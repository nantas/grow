var HoleType = require("Types").HoleType;

cc.Class({
    extends: cc.Component,
    properties: {
        layer: cc.Node,
        waterTankPrefab: cc.Prefab,
        rockPrefab: cc.Prefab,
        NutritionPrefab: cc.Prefab,
        pestPrefab: cc.Prefab,
        // distLevels: [cc.Integer], //distance to the start point
        // countForLevel: [cc.Integer], //how many stuff we spawn for each level
        // minDist:0,
        regionRoot: cc.Node,
        randomRange: 0,
        // angleMargin: 0,
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
        var randType = -1;
        if (Math.random() > 0.7) {
            randType = HoleType.Water;
        } else {
            randType = parseInt(cc.random0To1()*(HoleType.Pest + 1));
        }
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
                return this.spawnPestTank(pos);
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
        let turdN = cc.instantiate(this.NutritionPrefab);
        let turd = turdN.getComponent('NutritionContainer');
        this.layer.addChild(turdN);
        turdN.position = pos;
        turd.init(Math.floor(5 * this.getResModifierForPos(pos)), this.game.resMng);
        return turd;
    },

    spawnWaterTank (pos) {
        let waterN = cc.instantiate(this.waterTankPrefab);
        let water = waterN.getComponent('WaterTank');
        this.layer.addChild(waterN);
        waterN.position = pos;
        water.init(Math.floor(150 * this.getResModifierForPos(pos)));
        this.game.resMng.registerWater(water);
        return water;
    },

    spawnPestTank (pos) {
        let pestN = cc.instantiate(this.pestPrefab);
        let pest = pestN.getComponent('PestTank');
        this.layer.addChild(pestN);
        pestN.position = pos;
        pest.init();
        return pest;
    },

    getResModifierForPos (pos) {
        let dist = cc.pDistance(cc.p(0, 0), pos);
        if (dist > 500) {
            return dist/500;
        }
    },

    saveHole(hole) {
        this.holeList.push(hole);
    }
});