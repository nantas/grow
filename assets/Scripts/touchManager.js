var HoleType = require("Types").HoleType;

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
        treeRootSprite:[cc.SpriteFrame],
        firstLight: cc.Animation
    },

    init (game) {
        this.game = game;
        this.hasClickFirstLight = false;
        this.lightList = [];
        this.treeRootList = [];
        this.treeRootLineList = [];
        this.treeRootIndex = 0;
        this.produceLight(cc.p(0, -30));
        this.firstLight.node.position = cc.p(0, -30);
        this.firstLight.play('light');
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchmove", this.onTouchMove, this);
        this.node.on("touchend", this.onTouchEnd, this);
        this.node.on("mousewheel", this.onMouseWheel, this);
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

    onMouseWheel (event) {
        this.camera.zoomRatio *= (100 - event._scrollY/3) / 100;
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
            this.camera.node.x -= deltaX * 1.5;
            this.camera.node.y -= deltaY * 1.5;
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
        this.newPos = cc.pSub(this.touchStartPos, touchMovePos);
        var angle = cc.radiansToDegrees(- cc.pToAngle(this.newPos));
        this.treeRootList[this.treeRootIndex].rotation = angle;
        this.distance = this.getDistance(touchMovePos);
        this.treeRootList[this.treeRootIndex].width = this.distance;
        // var startPos = this.startPos;
        // for(var i = 0; i < this.curRootUnits; i++) {
        //     startPos = this.rootEndPos ? this.rootEndPos : startPos;
        //     this.rootEndPos = cc.pSub(startPos, cc.pMult(cc.pNormalize(this.newPos), this.unitLength[i]));
        //     this.produceTreeRoot(this.rootEndPos);
        // }
        this.lightPos = cc.pSub(this.startPos, cc.pMult(cc.pNormalize(this.newPos), this.distance));
        this.endPos = cc.pSub(this.startPos, cc.pMult(cc.pNormalize(this.newPos), this.distance - this.lightList[0].width / 2));
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
        var startPos = this.startPos ? this.startPos : this.touchStartPos;
        if(!this.checkHole()) return;
        this.produceLight(this.lightPos);
        var line = {startPos:startPos, endPos: touchEndPos};
        this.treeRootLineList.push(line);
        this.game.setRootLength(this.distance);
        this.treeRootIndex ++;
        this.game.resMng.updateNutrition(-this.curRootUnits);
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
        this.maxUnits = Math.min(this.unitLength.length, this.game.resMng.nutrition);
        this.curRootUnits = 0;
        for (var i = 0; i < this.maxUnits; i++) {
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
        if(i === this.maxUnits) {
            distance = rootLength;
        }
        return distance;
    },

    getCollisionRootUnits: function (holePos, startPos) {
        let rootLength = 0;
        let collisionRootUnits = 0;
        for (var i = 0; i < this.maxUnits; i++) {
            rootLength += this.unitLength[i];

            let endPos = cc.pSub(startPos, cc.pMult(cc.pNormalize(this.newPos), rootLength));

            let lineDist = cc.Intersection.pointLineDistance(holePos, startPos, endPos, true);

            if( lineDist > this.holeRadius) {
                collisionRootUnits++;
                continue;
            }
            return collisionRootUnits;
        }
        return null;
    },
    
    checkHole: function () {
        for (let i = 0; i < this.game.spawner.holeList.length; i++) {
            let hole = this.game.spawner.holeList[i];
            let pos = hole.node.position;
            // let bbox = hole.node.getBoundingBox();
            let typeRadius = this.game.spawner.getRadiusByType(hole.type);
            if (cc.Intersection.pointLineDistance(hole.node.position, this.startPos, this.lightPos, true) < typeRadius) {
                if(!this.checkHoleType(hole, pos)){
                    return false;
                }
                hole.activate();
            }
        }


        for (let j = 0; j < this.game.spawner.locList.length; j++) {
            let pos2 = this.game.spawner.locList[j];
            let lineDist = cc.Intersection.pointLineDistance(pos2, this.startPos, this.lightPos, true);
            if( lineDist > this.holeRadius) continue;
            let hole2 = this.game.spawner.spawnRandomHole(pos2);
            // let bbox = hole.node.getBoundingBox();
            this.game.spawner.saveHole(hole2);
            let typeRadius2 = this.game.spawner.getRadiusByType(hole2.type);
            this.game.spawner.locList.splice(j, 1);
            if (cc.Intersection.pointLineDistance(hole2.node.position, this.startPos, this.lightPos, true) < typeRadius2) {
                hole2.activate();
                if(!this.checkHoleType(hole2, hole2.node.position)) {
                    return false;
                }
            }

        }
        return true;
    },

    checkHoleType(hole, pos) {
        if(hole.type === HoleType.Rock || hole.type === HoleType.Pest) {
            var collisionRootUnits = this.getCollisionRootUnits(pos, this.startPos);
            if(collisionRootUnits === null) return false;
            for (let i = this.curRootUnits; i > collisionRootUnits; i--) {
                this.distance -= this.unitLength[i];
            }
            if(this.distance <= 0) {
                this.treeRootList[this.treeRootIndex].removeFromParent();
                this.treeRootList[this.treeRootIndex].destroy();
                this.treeRootList.splice(this.treeRootIndex, 1);
                return false;
            }
            this.curRootUnits -= collisionRootUnits;
            this.treeRootList[this.treeRootIndex].width = this.distance;
            this.lightPos = cc.pSub(this.startPos, cc.pMult(cc.pNormalize(this.newPos), this.distance));
            this.endPos = cc.pSub(this.startPos, cc.pMult(cc.pNormalize(this.newPos), this.distance - this.lightList[0].width / 2));
        }
        return true;
    },

    produceLight: function (pos) {
        var light = cc.instantiate(this.light);
        light.parent = this.lightNode;
        light.position = pos;
        this.lightList.push(light);
    },

    produceTreeRoot: function (pos) {
        if (!this.hasClickFirstLight) {
            this.hasClickFirstLight = true;
            this.firstLight.stop();
            this.firstLight.node.active = false;
        }
        var treeRoot = cc.instantiate(this.treeRoot);
        treeRoot.parent = this.treeRootNode;
        treeRoot.position = pos;
        var rand = parseInt(cc.random0To1()*this.treeRootSprite.length);
        treeRoot.getComponent(cc.Sprite).spriteFrame = this.treeRootSprite[rand];
        this.treeRootList.push(treeRoot);
    }

});
