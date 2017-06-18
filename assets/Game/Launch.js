const Tween = require('TweenLite');
cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.fadeEnd = false;
        this.onLoadEnd = false;
        this.mask.opacity = 255;
        Tween.to(this.mask, 3, {
            opacity: 0,
            onComplete: this.onFadeEnd.bind(this)
        });
        cc.director.preloadScene('game', this.onPreloadEnd.bind(this));
    },

    startGame () {
        Tween.to(this.node, 2, {
            opacity: 0
        });
        cc.director.loadScene('game');
    },

    onFadeEnd () {
        this.fadeEnd = true;
        if (this.onLoadEnd) {
            cc.director.loadScene('game');
        }
    },

    onPreloadEnd () {
        this.onLoadEnd = true;
        if (this.fadeEnd) {
            cc.director.loadScene('game');
        }
    }
});
