const Tween = require('TweenLite');
var HoleType = require("Types").HoleType;

cc.Class({
    extends: cc.Component,

    properties: {
        icon:cc.Sprite,
        nutrition:0,
        showDuration:0,
        type: {
            default: HoleType.Turd,
            type: HoleType
        }
    },

    // use this for initialization
    init (nutrition, resMng) {
        this.resMng = resMng;
        this.icon.node.opacity = 255;
        if (nutrition) {
            this.nutrition = nutrition;
        }
        this.flashNode = this.node.getChildByName('flash');
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
        this.resMng.updateNutrition(this.nutrition);
        Tween.to(this.icon.node, this.showDuration, {
            opacity: 0
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
