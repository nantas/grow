const ResourceMng = require('ResourceMng');
const WaterTank = require('WaterTank');
const TouchMng = require('touchManager');
const UIControl = require('UIControl');
const Spawner = require('Spawner');

cc.Class({
    extends: cc.Component,

    properties: {
        resMng: ResourceMng,
        spawner: Spawner,
        touchMng: TouchMng,
        holes: [WaterTank],
        uiControl: UIControl,
        tickTime: 0,
        secToYear: 0,
        initNutrition: 0
    },

    // use this for initialization
    onLoad () {
        this.spawner.init(this);
        this.resMng.init();
        this.uiControl.init();

        //TEST
        for (let i = 0; i < this.holes.length; ++i) {
            this.holes[i].init();
            this.resMng.registerWater(this.holes[i]);
        }
        this.resMng.leafCount = 4;
        this.resMng.updateNutrition(this.initNutrition);
        this.uiControl.updateLeaf(this.resMng.leafCount);

        this.rootLength = 0;
        this.touchMng.init(this);
        this.startLoop();
    },

    startLoop () {
        this.totalTime = 0;
        this.schedule(this.tick, this.tickTime);
    },

    tick () {
        this.totalTime += this.tickTime;
        this.resMng.tick();
        this.uiControl.updateYear(Math.floor(this.totalTime/this.secToYear));
    },
    
    setRootLength (rootLength) {
        this.rootLength+=rootLength;
        this.uiControl.updateRootLength(this.rootLength);
    },

    pause () {
        cc.director.getScheduler().pauseTarget(this);
    }
});
