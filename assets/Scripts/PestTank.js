var HoleType = require("Types").HoleType;

cc.Class({
    extends: cc.Component,

    properties: {
        iconSprite:[cc.SpriteFrame],
        icon: cc.Sprite,
        type: {
            default: HoleType.Pest,
            type: HoleType
        }
    },

    onLoad: function () {

    },

    init () {
        var rand = parseInt(cc.random0To1()*this.iconSprite.length);
        this.icon.spriteFrame = this.iconSprite[rand];
        if(rand === 0) {
            this.icon.getComponent(cc.Animation).play();
        }
        this.show();
    },

    show () {
    },

    activate () {
        if (!this.isActive) {
            this.isActive = true;
        }
    }
});
