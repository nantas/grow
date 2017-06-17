cc.Class({
    extends: cc.Component,

    properties: {
        light: cc.Prefab,
        treeRoot: cc.Prefab,
        lightNode: cc.Node,
        treeRootNode: cc.Node,
        holeNode: cc.Node,
        holeRadius: 0,
        // waterActiveRadius: 0,
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
                touchIndex = i;
            }
        }
        if(touchIndex === null) {
            this.isTouchLight = false;
            return;
        }
        event.stopPropagation();
        this.isTouchLight = true;
        this.canProduce = true;
        if(this.game.resMng.nutrition <= 0)  {
            this.canProduce = false;
        }
        this.produceTreeRoot(this.lightList[touchIndex].position);
        this.deltaPos = cc.pSub(this.touchStartPos, this.lightList[touchIndex].position);
        this.startPos = this.lightList[touchIndex].position;
    },
    
    onTouchMove: function (event) {
        this.cameraControl(event);
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
        if(touchMovePos.y > 0) {
            touchMovePos.y = 0;
        }
        var newPos = cc.pSub(this.touchStartPos, touchMovePos);
        var angle = cc.radiansToDegrees(- cc.pToAngle(newPos));
        this.treeRootList[this.treeRootIndex].rotation = angle;
        this.distance = this.getDistance(touchMovePos);
        var rootStartPos = this.deltaPos ? cc.pSub(this.touchStartPos, this.deltaPos) : this.touchStartPos;
        this.treeRootList[this.treeRootIndex].width = this.distance;
        this.lightPos = cc.pSub(rootStartPos, cc.pMult(cc.pNormalize(newPos), this.distance));
        this.endPos = cc.pSub(rootStartPos, cc.pMult(cc.pNormalize(newPos), this.distance - this.lightList[0].width / 2));
    },
    
    onTouchEnd: function (event) {
        if(!this.isTouchLight) return;
        event.stopPropagation();
        var touchEndPos = this.treeRootNode.convertToNodeSpaceAR(cc.Camera.main.getCameraToWorldPoint(event.getLocation()));
        for (var i = 0; i < this.treeRootLineList.length; i++) {
            var line = this.treeRootLineList[i];
            if(!this.canProduce ||
                cc.Intersection.lineLine(this.touchStartPos, this.lightPos, line.startPos, line.endPos) ||
                cc.pDistance(this.lightPos, this.startPos) < this.unitLength[0]-this.lightList[0].width / 2 ||
                this.lightPos.y >= 0) {
                this.treeRootList[this.treeRootIndex].removeFromParent();
                this.treeRootList[this.treeRootIndex].destroy();
                this.treeRootList.splice(this.treeRootIndex, 1);
                return;
            }
        }
        touchEndPos = this.endPos ? this.endPos : touchEndPos;
        this.produceLight(this.lightPos);
        var startPos = this.startPos ? this.startPos : this.touchStartPos;
        var line = {startPos:startPos, endPos: touchEndPos};
        this.treeRootLineList.push(line);
        this.game.setRootLength(this.distance);
        this.treeRootIndex ++;
        this.game.resMng.updateNutrition(-this.curRootUnits);
        for (let j = 0; j < this.game.spawner.locList.length; j++) {
            let pos = this.game.spawner.locList[j];
            let lineDist = cc.Intersection.pointLineDistance(pos, startPos, this.lightPos, true);
            if( lineDist > this.holeRadius) continue;
            this.game.spawner.locList.splice(j, 1);
            let hole = this.game.spawner.spawnRandomHole(pos);
            let bbox = hole.node.getBoundingBox();
            if (cc.Intersection.lineRect(startPos, this.lightPos, bbox)) {
                hole.activate();
            }
        }
    },

    cameraControl: function(event) {
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
    },

    getDistance: function (touchMovePos) {
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
        return distance;
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
