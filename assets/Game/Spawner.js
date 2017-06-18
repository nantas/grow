var HoleType = require("Types").HoleType;

cc.Class({
    extends: cc.Component,
    properties: {
        layer: cc.Node,
        waterTankPrefab: cc.Prefab,
        rockPrefab: cc.Prefab,
        turdPrefab: cc.Prefab,
        // distLevels: [cc.Integer], //distance to the start point
        // countForLevel: [cc.Integer], //how many stuff we spawn for each level
        // minDist:0,
        regionRoot: cc.Node,
        randomRange: 0,
        // angleMargin: 0,
        icon: cc.Prefab,
        typeRadius: [cc.Integer]
    },

    init (game) {
        this.game = game;
        this.startDist = 0;
        this.endDist = 0;
        // this.spawnLocations();
        this.locList = [];
        this.holeList = [];
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
        var randType = parseInt(cc.random0To1()*(HoleType.Toxic + 1));
        switch (randType) {
            case HoleType.Water:
                var water = this.spawnWaterTank(pos);
                return water;
            case HoleType.Rock:
                var rock = this.spawnRock(pos)
                return rock;
            case HoleType.Turd:
                var turd = this.spawnTurd(pos)
                return turd;
            case HoleType.Pest:
                return this.spawnRandomHole(pos);
            case HoleType.Toxic:
                return this.spawnRandomHole(pos);
        }
    },

    getRadiusByType(type) {
        return this.typeRadius[type];
    },

    spawnRock(pos) {
        let rockN = cc.instantiate(this.rockPrefab);
        let rock = rockN.getComponent('RockTank');
        this.layer.addChild(rockN);
        rockN.position = pos;
        rockN.init();
        return rock;
    },

    spawnTurd(pos) {
        let turdN = cc.instantiate(this.turdPrefab);
        let turd = turdN.getComponent('NutritionContainer');
        this.layer.addChild(turdN);
        turdN.position = pos;
        turd.init(5, this.game.resMng);
        return turd;
    },

    spawnWaterTank (pos) {
        let waterN = cc.instantiate(this.waterTankPrefab);
        let water = waterN.getComponent('WaterTank');
        this.layer.addChild(waterN);
        waterN.position = pos;
        water.init(150);
        this.game.resMng.registerWater(water);
        return water;
    },

    saveHole(hole) {
        this.holeList.push(hole);
    }
});