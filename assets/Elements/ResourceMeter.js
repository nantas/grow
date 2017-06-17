const Tween = require('TweenLite');
const ResType = require('Types').ResType;

cc.Class({
    extends: cc.Component,

    properties: {
        resType: {
            default: ResType.Water,
            type: ResType
        },
        progress: cc.ProgressBar,
        flashDuration: 0,
        flash: cc.Node,
        anim: cc.Animation
    },

    // use this for initialization
    init (resMng) {
        this.resMng = resMng;
        this.flash.active = false;
        this.updateProgress(0);
        this.isWarning = false;
    },

    updateProgress (ratio) {
        this.progress.progress = ratio;
    },

    onResFull1 () {
        this.flash.active = true;
        this.flash.opacity = 0;
        this.flash.color = cc.Color.WHITE;
        Tween.to(this.flash, this.flashDuration, {
            opacity: 255,
            easing: Power2.easeIn,
            onComplete: this.onResFull2.bind(this)
        });
    },

    onResFull2 () {
        this.resMng.resetMeter(this.resType);
        Tween.to(this.flash, this.flashDuration, {
            opacity: 0,
            easing: Power2.easeOut
        });
    },

    playWarning () {
        if (this.anim) {
            if (!this.isWarning) {
                this.flash.active = true;                
                this.anim.play('water-low');
                this.isWarning = true;
            }
        }
    },

    stopWarning () {
        if (this.anim) {
            this.anim.stop();
            this.flash.active = false;                
            this.isWarning = false;
        }
        this.flash.color = cc.Color.WHITE;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
