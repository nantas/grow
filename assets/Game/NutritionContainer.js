const Tween = require('TweenLite');
var HoleType = require("Types").HoleType;

cc.Class({
    extends: cc.Component,

    properties: {
        icon:cc.Sprite,
        iconSprite:[cc.SpriteFrame],
        nutritionNum:[cc.Integer],
        showDuration:0,
        type: {
            default: HoleType.Turd,
            type: HoleType
        }
    },

    // use this for initialization
    init (nutrition, resMng) {
        var rand = parseInt(cc.random0To1()*this.iconSprite.length);
        this.resMng = resMng;
        this.icon.spriteFrame = this.iconSprite[rand];

        this.icon.node.opacity = 255;
        this.nutrition = this.nutritionNum[rand];
        this.flashNode = this.node.getChildByName('flash');
        // this.node.active = false
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
        this.resMng.updateNutrition(this.nutrition);
        Tween.to(this.icon.node, this.showDuration, {
            opacity: 0
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
