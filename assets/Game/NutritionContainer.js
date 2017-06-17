const Tween = require('TweenLite');
cc.Class({
    extends: cc.Component,

    properties: {
        icon:cc.Sprite,
        nutrition:0,
        showDuration:0
    },

    // use this for initialization
    init (nutrition, nutritionType, resMng) {
        this.resMng = resMng;
        this.icon.node.opacity = 255;
        if (nutrition) {
            this.nutrition = nutrition;
        }
        this.flashNode = this.node.getChildByName('flash');
        this.node.active = false;
    },

    show () {
        this.node.active = true;
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
