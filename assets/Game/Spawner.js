cc.Class({
    extends: cc.Component,
    properties: {
        layer: cc.Node,
        waterTankPrefab: cc.Prefab,
        rockPrefab: cc.Prefab,
        nutritionPrefab: cc.Prefab,
        // distLevels: [cc.Integer], //distance to the start point
        // countForLevel: [cc.Integer], //how many stuff we spawn for each level
        // minDist:0,
        regionRoot: cc.Node,
        randomRange: 0,
        // angleMargin: 0,
        icon: cc.Prefab
    },

    init (game) {
        this.game = game;
        this.startDist = 0;
        this.endDist = 0;
        // this.spawnLocations();
        this.locList = [];
        this.spawnLocationsFromRegion();
    },

    spawnLocationsFromRegion() {
        let regions = this.regionRoot.children;
        for (let i = 0; i < this.regions.length; ++i) {
            let pos = this.regions[i].position;
            this.regionList[i].active = false;
            pos.x += this.randomRange * 2 * ( Math.random() - 0.5);
            pos.y += this.randomRange * 2 * ( Math.random() - 0.5);
            this.locList.push(pos);
            // let ph = cc.instantiate(this.icon);
            // this.layer.addChild(ph);
            // ph.setPosition(pos);            
        }
    },

    // spawnLocations () {
    //     for (let i = 0; i < this.distLevels.length - 1; ++i) {
    //         this.startDist = this.distLevels[i];
    //         this.endDist = this.distLevels[i+1];
    //         let lastPos = null;
    //         let countForLevel = this.countForLevel[i];
    //         let angleUnit = 180/countForLevel;
    //         for (let i = 0; i < countForLevel; ++i) {
    //             let angle = (i  + Math.random()) * angleUnit;
    //             let pos = cc.pForAngle(angle * Math.PI / 180);
    //             pos.y = -pos.y;
    //             pos = cc.pMult(pos, this.startDist + Math.random() * (this.endDist - this.startDist));
    //             if (pos.y > -150) {
    //                 pos.y = -150;
    //             }
    //             if (lastPos && cc.pDistance(lastPos, pos) <= this.minDist) {
    //                 lastPos = pos;
    //                 continue;
    //             }
    //             let ph = cc.instantiate(this.icon);
    //             this.layer.addChild(ph);
    //             ph.setPosition(pos);
    //             lastPos = pos;
    //         }
    //     }
    // },

    spawnWaterTank () {

    }
});