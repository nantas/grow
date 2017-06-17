cc.Class({
    extends: cc.Component,

    properties: {
        light: cc.Prefab,
        treeRoot: cc.Prefab,
        lightNode: cc.Node,
        treeRootNode: cc.Node,
        holeNode: cc.Node,
        holeRadius: 0,
        waterActiveRadius: 0,
        rootNodeRadius: 0,
        camera: cc.Camera,
        unitLength: [cc.Integer],
        roundingNum: 0,
    },

    init (game) {
        this.game = game;
        this.lightList = [];
        this.treeRootList = [];
        this.treeRootLineList = [];
        this.treeRootIndex = 0;
        this.produceLight(cc.p(0, -20));
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchmove", this.onTouchMove, this);
        this.node.on("touchend", this.onTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.lastTotalFrames = -1;
        this.curRootUnits = 0;
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.KEY.up:
                this.camera.zoomRatio *= 0.95;
                break;
            case cc.KEY.down:
                this.camera.zoomRatio *= 1.05;
                break;
        }
    },    

    onDestroy: function () {
        this.node.off("touchstart", this.onTouchStart, this);
        this.node.off("touchmove", this.onTouchMove, this);
        this.node.off("touchend", this.onTouchEnd, this);
    },
    
    onTouchStart: function (event) {
        this.touchStartPos = this.treeRootNode.convertToNodeSpaceAR(cc.Camera.main.getCameraToWorldPoint(event.getLocation()));
        var touchIndex = null;
        for (var i = 0; i < this.lightList.length; i++) {
            var obj = this.lightList[i];
            if (cc.pDistance(obj.position, this.touchStartPos) <= this.rootNodeRadius) {
            // if(obj.getBoundingBox().contains(this.touchStartPos)){
                touchIndex = i;
            }
        }
        if(touchIndex === null) {
            this.isTouchLight = false;
            return;
        }
        event.stopPropagation();
        this.isTouchLight = true;
        this.produceTreeRoot(this.lightList[touchIndex].position);
        if(this.lightList[touchIndex]) {
            this.deltaPos = cc.pSub(this.touchStartPos, this.lightList[touchIndex].position);
        }
    },
    
    onTouchMove: function (event) {
        //zoom
        // let totalFrames = cc.director.getTotalFrames();
        // if (this.lastTotalFrames !== totalFrames) {
            // this.lastTotalFrames = totalFrames;
        let touches = event.getTouches();
        if (touches.length >= 2) {
            let touch1 = touches[0], touch2 = touches[1];
            let delta1 = touch1.getDelta(), delta2 = touch2.getDelta();

            var touchPoint1 = this.node.parent.convertToNodeSpaceAR(touch1.getLocation());
            var touchPoint2 = this.node.parent.convertToNodeSpaceAR(touch2.getLocation());
            //缩放
            var distance = cc.pSub(touchPoint1, touchPoint2);
            var delta = cc.pSub(delta1, delta2);
            var zoomRatio = 1;
            if (Math.abs(distance.x) > Math.abs(distance.y)) {
                zoomRatio = (distance.x + delta.x) / distance.x * this.camera.zoomRatio;
            }
            else {
                zoomRatio = (distance.y + delta.y) / distance.y * this.camera.zoomRatio;
            }
            this.camera.zoomRatio = zoomRatio < 0.1 ? 0.1 : zoomRatio;
            return;
        }
        // }

        var deltaX = event.getDeltaX();
        var deltaY = event.getDeltaY();

        if(!this.isTouchLight) {
            this.camera.node.x -= deltaX;
            this.camera.node.y -= deltaY;
            return;
        }

        var screenPos = event.getLocation();
        if ((deltaX > 0 && screenPos.x > (this.node.width - 100)) ||
            (deltaX < 0 && screenPos.x < 100) || 
            (deltaY > 0 && screenPos.y > (this.node.height - 80)) ||
            (deltaY < 0 && screenPos.y < 80)) 
        {
            this.camera.node.x += deltaX;
            this.camera.node.y += deltaY;
        }

        event.stopPropagation();
        var touchMovePos = this.treeRootNode.convertToNodeSpaceAR(cc.Camera.main.getCameraToWorldPoint(event.getLocation()));
        var touchMovePos = this.deltaPos ? cc.pAdd(touchMovePos, this.deltaPos) : touchMovePos;
        var newPos = cc.pSub(this.touchStartPos, touchMovePos);
        var angle = cc.radiansToDegrees(- cc.pToAngle(newPos));
        this.treeRootList[this.treeRootIndex].rotation = angle;
        var distance = cc.pDistance(touchMovePos, this.touchStartPos);
        var rootLength = 0;
        let maxUnits = Math.min(this.unitLength.length, this.game.resMng.nutrition);
        this.curRootUnits = 0;
        for (var i = 0; i < maxUnits; i++) {
            rootLength += this.unitLength[i];
            this.curRootUnits++;
            if(distance < rootLength){
                var ratio = (rootLength - distance) / this.unitLength[i];
                if(ratio > this.roundingNum) {
                    rootLength -= this.unitLength[i];
                    this.curRootUnits--;
                }
                distance = rootLength;
                break;
            }
        }
        if(i === maxUnits) {
            distance = rootLength;
        }
        var rootStartPos = this.deltaPos ? cc.pSub(this.touchStartPos, this.deltaPos) : this.touchStartPos;
        this.treeRootList[this.treeRootIndex].width = distance;
        this.endPos = cc.pSub(rootStartPos, cc.pMult(cc.pNormalize(newPos), distance));
    },
    
    onTouchEnd: function (event) {
        if(!this.isTouchLight) return;
        event.stopPropagation();
        var touchEndPos = this.treeRootNode.convertToNodeSpaceAR(cc.Camera.main.getCameraToWorldPoint(event.getLocation()));
        for (var i = 0; i < this.treeRootLineList.length; i++) {
            var line = this.treeRootLineList[i];
            if(cc.Intersection.lineLine(this.touchStartPos, touchEndPos, line.startPos, line.endPos)) {
                this.treeRootList[this.treeRootIndex].removeFromParent();
                this.treeRootList[this.treeRootIndex].destroy();
                this.treeRootList.splice(this.treeRootIndex, 1);
                return;
            }
        }
        touchEndPos = this.endPos ? this.endPos : touchEndPos;
        this.produceLight(this.endPos);
        var line = {startPos:this.touchStartPos, endPos: touchEndPos};
        this.treeRootLineList.push(line);
        this.treeRootIndex ++;
        this.game.resMng.updateNutrition(-this.curRootUnits);
        for (let j = 0; j < this.game.holes.length; j++) {
            let hole = this.game.holes[j];
            let lineDist = cc.Intersection.pointLineDistance(hole.node.position, line.startPos, line.endPos, true);
            if( lineDist > this.holeRadius) continue;
            hole.show();
            if ( lineDist < this.waterActiveRadius) {
                hole.activate();
            }
        }
    },

    produceLight: function (pos) {
        var light = cc.instantiate(this.light);
        light.parent = this.lightNode;
        light.position = pos;
        this.lightList.push(light);
    },

    produceTreeRoot: function (pos) {
        var treeRoot = cc.instantiate(this.treeRoot);
        treeRoot.parent = this.treeRootNode;
        treeRoot.position = pos;
        this.treeRootList.push(treeRoot);
    }

});
