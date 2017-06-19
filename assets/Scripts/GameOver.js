cc.Class({
    extends: cc.Component,

    properties: {
        labelYear: cc.Label,
        inscription: cc.Sprite,
        sfIns: [cc.SpriteFrame]
    },

    // use this for initialization
    init (year) {
        this.labelYear.string = year + '年';
        let idx = 0;
        if (year > 120) {
            idx = 2;
        } else if (year > 30 && year < 70) {
            idx = 1;
        }
        this.inscription.spriteFrame = this.sfIns[idx];
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
