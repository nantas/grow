const ResourceMng = require('ResourceMng');
const WaterTank = require('WaterTank');
const TouchMng = require('touchManager');
const UIControl = require('UIControl');
const Spawner = require('Spawner');
const BranchMng = require('branchManager');
const EventMng = require('EventMng');
const Tween = require('TweenLite');

cc.Class({
    extends: cc.Component,

    properties: {
        resMng: ResourceMng,
        eventMng: EventMng,
        branchMng: BranchMng,
        spawner: Spawner,
        touchMng: TouchMng,
        uiControl: UIControl,
        launch: cc.Node,
        tickTime: 0,
        dangerTime: 0,
        secToYear: 0,
        initNutrition: 0,
        rootLengthProportion: 0,
        strHints: [cc.String],
        labelHint: cc.Label,
        hintDuration: 0,
        timePerHint: 0
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
        this.hintTimer = 0;
        this.labelHint.enabled = false;
        this.isWarning = false;

        this.rootLength = 0;
    },

    startGame () {
        this.touchMng.init(this);
        this.branchMng.btnCreate.node.active = true;
        this.isCountingLow = false;
        this.lowTimer = 0;
        this.year = 0;
        this.startLoop();
        Tween.to(this.launch, 3, {
            opacity: 0,
            onComplete: function () {
                this.launch.active = false;
            }.bind(this)
        });
        this.uiControl.land2.y = -400;//HACK camera culling
    },

    startLoop () {
        this.totalTime = 0;
        this.schedule(this.tick, this.tickTime);
    },

    tick () {
        if (!this.labelHint.enabled) {
            this.hintTimer += this.tickTime;
            if (this.hintTimer >= this.timePerHint) {
                this.showHint();
            }
        }
        this.totalTime += this.tickTime;
        this.year = Math.floor(this.totalTime/this.secToYear);  
        this.uiControl.updateYear(this.year);
        this.resMng.tick();
        this.eventMng.tick();
        if (this.resMng.waterSrcCount === 0) {
            if (this.isCountingLow) {
                this.lowTimer += this.tickTime;
                if (this.lowTimer >= this.dangerTime) {
                    if (!this.isWarning) {
                        this.resMng.waterMeter.playWarning();
                        this.resMng.updateEventRes(-1, 0);     
                        this.isWarning = true;
                    }
                    if (this.resMng.waterStorage === 0 && this.lowTimer >= this.dangerTime * 2) {
                        this.gameover();
                    }
                }
            } else {
                this.isCountingLow = true;
            }
        } else {
            this.isCountingLow = false;
            if (this.isWarning) {
                this.isWarning = false;
                this.resMng.updateEventRes(1, 0);
                this.resMng.waterMeter.stopWarning();
            }
            this.lowTimer = 0;
        }
    },

    showHint () {
        if (this.strHints.length > 0) {
            let idx = Math.floor(Math.random() * this.strHints.length);
            this.labelHint.enabled = true;
            this.labelHint.string = this.strHints[idx];
            this.strHints.splice(idx, 1);
            this.scheduleOnce(this.hideHint, this.hintDuration);
        }
    },

    hideHint () {
        this.labelHint.enabled = false;
        this.hintTimer = 0;
    },
    
    setRootLength (rootLength) {
        this.rootLength += rootLength / this.rootLengthProportion;
        this.uiControl.updateRootLength(this.rootLength);
    },

    gameover () {
        this.pause();
        this.uiControl.showGameOver(this.year);
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
