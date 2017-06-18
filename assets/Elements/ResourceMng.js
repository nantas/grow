const ResType = require('Types').ResType;
const ResourceMeter = require('ResourceMeter');
cc.Class({
    extends: cc.Component,

    properties: {
        waterPerTick: 0,
        lightPerTick: 0,
        maxStorage: 0,
        waterMeter: ResourceMeter,
        lightMeter: ResourceMeter,
        labelNutrition: cc.Label,
        nutritionScoreAnchor: cc.Node
    },

    init (game) {
        this.game = game;
        this.waterList = [];
        this.leafCount = 0;
        this.waterSrcCount = 0;
        this.waterStorage = 0;
        this.lightStorage = 0;
        this.nutrition = 0;
        this.waterMeter.init(this);
        this.lightMeter.init(this);
        this.updateNutrition(0);
    },

    registerWater (res) {
        this.waterList.push(res);
    },

    addLeaf () {
        this.leafCount++;
        this.game.uiControl.updateLeaf(this.leafCount);
    },

    resetMeter (resType) {
        if (resType === ResType.Water) {
            this.waterMeter.updateProgress(0);
        } else {
            this.lightMeter.updateProgress(0);
        }
    },

    updateNutrition (delta) { //can be positive or negative
        this.nutrition += delta;
        this.labelNutrition.string = this.nutrition;
        this.game.branchMng.enableCreate(this.nutrition > 0);
    },

    tick () {
        this.waterSrcCount = 0;
        for (let i = 0; i < this.waterList.length; ++i) {
            let res = this.waterList[i];
            if (res.curVolume > 0 && this.waterStorage < this.maxStorage) {
                res.updateVol(this.waterPerTick);
                this.waterStorage += this.waterPerTick;
                this.game.uiControl.spawnScore(ResType.Water, this.waterPerTick, res.node.position);
                this.waterMeter.updateProgress(this.waterStorage/ this.maxStorage);
                if (this.waterStorage >= this.maxStorage) {
                    this.checkGainNutrition();
                }
                if (res.isActive) {
                    this.waterSrcCount++;
                }
            }
        }
        this.lightStorage += this.lightPerTick * this.leafCount;
        this.game.branchMng.playScoreOnBranches();
        this.lightMeter.updateProgress(this.lightStorage/this.maxStorage);
        if (this.lightStorage >= this.maxStorage) {
            this.checkGainNutrition();
        }
    },

    checkGainNutrition () {
        if (this.waterStorage >= this.maxStorage && this.lightStorage >= this.maxStorage) {
            this.waterMeter.onResFull1();
            this.waterStorage = 0;
            this.lightMeter.onResFull1();
            this.lightStorage = 0;
            this.updateNutrition(1);
            this.game.uiControl.spawnScore(ResType.Nutrition, 1, this.nutritionScoreAnchor.position);
        }
    },

});
