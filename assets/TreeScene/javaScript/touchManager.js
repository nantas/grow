cc.Class({
    extends: cc.Component,

    properties: {
        light: cc.Prefab,
        treeRoot: cc.Prefab,
        lightNode: cc.Node,
        camera: cc.Node,
        holeNode: cc.Node
    },

    onLoad: function () {
        this.lightList = [];
        this.treeRootList = [];
        this.treeRootLineList = [];
        this.treeRootIndex = 0;
        this.produceLight(cc.p(0, cc.winSize.height / 2));
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchmove", this.onTouchMove, this);
        this.node.on("touchend", this.onTouchEnd, this);

    },

    onDestroy: function () {
        this.node.off("touchstart", this.onTouchStart, this);
        this.node.off("touchmove", this.onTouchMove, this);
        this.node.off("touchend", this.onTouchEnd, this);
    },
    
    onTouchStart: function (event) {
        this.touchStartPos = this.node.convertToNodeSpaceAR(event.getLocation());
        var touchIndex = null;
        for (var i = 0; i < this.lightList.length; i++) {
            var obj = this.lightList[i];
            if(obj.getBoundingBox().contains(this.touchStartPos)){
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
        if(!this.isTouchLight) {
            var detalX = event.getDeltaX();
            var detalY = event.getDeltaY();
            this.camera.x -= detalX;
            this.camera.y -= detalY;
            return;
        }
        event.stopPropagation();
        var touchMovePos = this.node.convertToNodeSpaceAR(event.getLocation());
        var touchMovePos = this.deltaPos ? cc.pAdd(touchMovePos, this.deltaPos) : touchMovePos;
        var newPos = cc.pSub(this.touchStartPos, touchMovePos);
        var angle = cc.radiansToDegrees(- cc.pToAngle(newPos));
        this.treeRootList[this.treeRootIndex].rotation = angle;
        var distance = cc.pDistance(touchMovePos, this.touchStartPos);
        this.treeRootList[this.treeRootIndex].width = distance;
    },
    
    onTouchEnd: function (event) {
        if(!this.isTouchLight) return;
        event.stopPropagation();
        var touchEndPos = this.node.convertToNodeSpaceAR(event.getLocation());
        for (var i = 0; i < this.treeRootLineList.length; i++) {
            var line = this.treeRootLineList[i];
            if(cc.Intersection.lineLine(this.touchStartPos, touchEndPos, line.startPos, line.endPos)) {
                this.canTouch = false;
                this.treeRootList[this.treeRootIndex].removeFromParent();
                this.treeRootList.splice(this.treeRootIndex, 1);
                return;
            }
        }
        this.produceLight(touchEndPos);
        var line = {startPos:this.touchStartPos, endPos: touchEndPos};
        this.treeRootLineList.push(line);
        this.treeRootIndex ++;
        // for (var j = 0; j < this.holeNode.children.length; j++) {
        //     var obj = this.holeNode.children[j];
        //
        // }
    },

    produceLight: function (pos) {
        var light = cc.instantiate(this.light);
        light.parent = this.lightNode;
        light.position = pos;
        this.lightList.push(light);
    },

    produceTreeRoot: function (pos) {
        var treeRoot = cc.instantiate(this.treeRoot);
        treeRoot.parent = this.node;
        treeRoot.position = pos;
        this.treeRootList.push(treeRoot);
    }

});
