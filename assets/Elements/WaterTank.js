const Tween = require('TweenLite');
cc.Class({
    extends: cc.Component,

    properties: {
        progress:cc.ProgressBar,
        flash: cc.Node,
        initVolume:0,
        showDuration:0
    },

    // use this for initialization
    init (vol) {
        if (vol) {
            this.initVolume = vol;
        }
        this.curVolume = this.initVolume;
        this.updateProgress();
        this.node.active = false;
    },

    show () {
        this.node.active = true;
        this.flash.opacity = 255;
        Tween.to(this.flash, this.showDuration, {
            opacity: 0
        });
    },

    activate () {
        this.isActive = true;
    },

    updateVol (delta) {
        this.curVolume -= delta;
        if (this.curVolume <= 0) {
            this.curVolume = 0;
            this.isActive = false;
        }
        this.updateProgress();
    },

    updateProgress () {
        this.progress.progress = this.curVolume / this.initVolume;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
