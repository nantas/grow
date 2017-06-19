var HoleType = require("Types").HoleType;
const Tween = require('TweenLite');
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar:cc.ProgressBar,
        // flashNode: cc.Node,
        initVolume:0,
        showDuration:0,
        type: {
            default: HoleType.Water,
            type: HoleType
        }
    },

    // use this for initialization
    init (vol) {
        if (vol) {
            this.initVolume = vol;
        }
        this.flashNode = this.node.getChildByName('water-flash');
        this.curVolume = this.initVolume;
        this.updateProgress();
        // this.node.active = false;
        this.show();
    },

    show () {
        // this.node.active = true;
        this.flashNode.opacity = 255;
        Tween.to(this.flashNode, this.showDuration, {
            opacity: 0
        });
    },

    activate () {
        if (!this.isActive) {
            this.isActive = true;
        }
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
        this.progressBar.progress = this.curVolume / this.initVolume;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
