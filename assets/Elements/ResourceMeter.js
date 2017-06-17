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
        flash: cc.Node
    },

    // use this for initialization
    init (resMng) {
        this.resMng = resMng;
        this.flash.active = false;
        this.updateProgress(0);
    },

    updateProgress (ratio) {
        this.progress.progress = ratio;
    },

    onResFull1 () {
        this.flash.active = true;
        this.flash.opacity = 0;
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
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
