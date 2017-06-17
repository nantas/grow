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
        for (let i = 0; i < regions.length; ++i) {
            let pos = regions[i].position;
            regions[i].active = false;
            pos.x += this.randomRange * 2 * ( Math.random() - 0.5);
            pos.y += this.randomRange * 2 * ( Math.random() - 0.5);
            this.locList.push(pos);
            // let ph = cc.instantiate(this.icon);
            // this.layer.addChild(ph);
            // ph.setPosition(pos);            
        }
    },

    spawnRandomHole(pos) {
        //replace this
        return this.spawnWaterTank(pos);
    },

    spawnRock(pos) {

    },

    spawnNutrition(pos) {

    },

    spawnWaterTank (pos) {
        let waterN = cc.instantiate(this.waterTankPrefab);
        let water = waterN.getComponent('WaterTank');
        this.layer.addChild(waterN);
        waterN.position = pos;
        water.init();
        this.game.resMng.registerWater(water);
        return water;
    }
});