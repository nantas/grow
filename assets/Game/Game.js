const ResourceMng = require('ResourceMng');
const WaterTank = require('WaterTank');
const TouchMng = require('touchManager');
const UIControl = require('UIControl');

cc.Class({
    extends: cc.Component,

    properties: {
        resMng: ResourceMng,
        touchMng: TouchMng,
        uiControl: UIControl,
        tickTime: 0,
        secToYear: 0
    },

    // use this for initialization
    onLoad () {
        this.resMng.init();
        this.uiControl.init();
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

    pause () {
        cc.director.getScheduler().pauseTarget(this);

    }
});
