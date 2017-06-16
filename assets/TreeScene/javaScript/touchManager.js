cc.Class({
    extends: cc.Component,

    properties: {
        light: cc.Prefab,
        treeRoot: cc.Prefab
    },

    onLoad: function () {
        this.lightList = [];
        this.treeRootList = [];
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
            this.canTouch = false;
            return;
        }
        this.canTouch = true;
        this.produceTreeRoot(this.lightList[touchIndex].position);
        if(this.touchEndPos) {
            this.deltaPos = cc.pSub(this.touchStartPos, this.touchEndPos);
        }
    },
    
    onTouchMove: function (event) {
        if(!this.canTouch) return;
        var touchMovePos = this.node.convertToNodeSpaceAR(event.getLocation());
        var touchMovePos = this.deltaPos ? cc.pAdd(touchMovePos, this.deltaPos) : touchMovePos;
        var newPos = cc.pSub(this.touchStartPos, touchMovePos);
        var angle = cc.radiansToDegrees(- cc.pToAngle(newPos));
        this.treeRootList[this.treeRootIndex].rotation = angle;
        var distance = cc.pDistance(touchMovePos, this.touchStartPos);
        this.treeRootList[this.treeRootIndex].width = distance;
    },
    
    onTouchEnd: function (event) {
        if(!this.canTouch) return;
        this.touchEndPos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.produceLight(this.touchEndPos);
        this.treeRootIndex ++;
    },

    produceLight: function (pos) {
        var light = cc.instantiate(this.light);
        light.parent = this.node;
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
