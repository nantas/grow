const ResType = require('Types').ResType;
const Tween = require('TweenLite');

cc.Class({
    extends: cc.Component,

    properties: {
        icon:cc.Sprite,
        label: cc.Label,
        resIcons: [cc.SpriteFrame],
        resColors: [cc.Color],
        upDist: 0,
        upDuration: 0,
        fadeDuration: 0
    },

    // use this for initialization
    init (type, num, uiCtrl) {
        this.uiCtrl = uiCtrl;
        this.node.opacity = 0;
        this.icon.spriteFrame = this.resIcons[type];
        this.label.node.color = this.resColors[type];
        let strSign = num >= 0 ? '+' : '-';
        this.label.string = strSign + Math.abs(num);
        Tween.to(this.node, this.upDuration, {
            opacity: 255,
            y: this.node.y + this.upDist,
            ease: Power2.easeOut,
            onComplete: this.startFade.bind(this)
        });
    },

    startFade () {
        Tween.to(this.node, this.fadeDuration, {
            opacity: 0,
            ease: Power2.easeIn,
            onComplete: this.despawn.bind(this)
        });
    },

    despawn () {
        this.uiCtrl.despawnScore(this);
    }
});
