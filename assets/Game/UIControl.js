cc.Class({
    extends: cc.Component,

    properties: {
        labelYear: cc.Label,
        labelRoot: cc.Label,
        labelLeaf: cc.Label,
        uiGameOver: cc.Node
    },

    // use this for initialization
    init () {
        this.updateYear(0);
        this.updateRootLength(0);
        this.updateLeaf(0);
        this.uiGameOver.active = false;
    },

    updateYear(num) {
        this.labelYear.string = 'Year: ' + num;
    },

    updateRootLength (num) {
        this.labelRoot.string = 'Root: ' + num + 'm';
    },

    updateLeaf (num) {
        this.labelLeaf.string = 'Leaf: ' + num;
    },

    showGameOver () {
        this.uiGameOver.active = true;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
