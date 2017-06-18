const ResourceMng = require('ResourceMng');
const WaterTank = require('WaterTank');
const TouchMng = require('touchManager');
const UIControl = require('UIControl');
const Spawner = require('Spawner');
const BranchMng = require('branchManager');
const EventMng = require('EventMng');

cc.Class({
    extends: cc.Component,

    properties: {
        resMng: ResourceMng,
        eventMng: EventMng,
        branchMng: BranchMng,
        spawner: Spawner,
        touchMng: TouchMng,
        uiControl: UIControl,
        tickTime: 0,
        dangerTime: 0,
        secToYear: 0,
        initNutrition: 0,
        rootLengthProportion: 0
    },

    // use this for initialization
    onLoad () {
        this.uiControl.init();
        this.spawner.init(this);
        this.resMng.init(this);
        this.eventMng.init(this);
        this.branchMng.init(this);

        // this.resMng.leafCount = 2;
        this.resMng.updateNutrition(this.initNutrition);
        // this.uiControl.updateLeaf(this.resMng.leafCount);

        this.rootLength = 0;
        this.touchMng.init(this);
        this.isCountingLow = false;
        this.lowTimer = 0;
        this.year = 0;
        this.startLoop();
    },

    startLoop () {
        this.totalTime = 0;
        this.schedule(this.tick, this.tickTime);
    },

    tick () {
        this.totalTime += this.tickTime;
        this.year = Math.floor(this.totalTime/this.secToYear);  
        this.uiControl.updateYear(this.year);
        this.resMng.tick();
        this.eventMng.tick();
        if (this.resMng.nutrition <= 0 && this.resMng.waterSrcCount === 0) {
            if (this.isCountingLow) {
                this.lowTimer += this.tickTime;
                if (this.lowTimer >= this.dangerTime) {
                    this.resMng.waterMeter.playWarning();
                    // if (this.lowTimer >= this.dangerTime * 2) {
                    //     this.gameover();
                    // }
                }
            } else {
                this.isCountingLow = true;
            }
        } else {
            this.isCountingLow = false;
            this.lowTimer = 0;
            this.resMng.waterMeter.stopWarning();
        }
    },
    
    setRootLength (rootLength) {
        this.rootLength += rootLength / this.rootLengthProportion;
        this.uiControl.updateRootLength(this.rootLength);
    },

    gameover () {
        this.pause();
        this.uiControl.showGameOver();
        this.branchMng.btnCreate.node.active = false;
        cc.log('Game Over!');
    },

    restart () {
        cc.director.loadScene('game');
    },

    pause () {
        cc.director.getScheduler().pauseTarget(this);
    }
});
