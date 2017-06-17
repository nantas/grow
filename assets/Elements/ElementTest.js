const ResourceMng = require('ResourceMng');
const WaterTank = require('WaterTank');

cc.Class({
    extends: cc.Component,

    properties: {
        resMng: ResourceMng,
        waterTanks: [WaterTank]
    },

    // use this for initialization
    onLoad () {
        this.resMng.init();
        for (let i = 0; i < this.waterTanks.length; ++i) {
            let waterTank = this.waterTanks[i];
            waterTank.init();
            this.resMng.registerWater(waterTank);
        }
    },

    showWaterTanks () {
        for (let i = 0; i < this.waterTanks.length; ++i) {
            this.waterTanks[i].show();
        }
    },

    activateWaterTanks () {
        for (let i = 0; i < this.waterTanks.length; ++i) {
            this.waterTanks[i].activate();
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
