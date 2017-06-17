cc.Class({
    extends: cc.Component,

    properties: {
        branchBornPos: [cc.Vec2],
        branchItem: [cc.Prefab],
        branchParent: cc.Node,
        btnCreate: cc.Button
    },

    init (game) {
        this.game = game;
        this.branchPos = this.branchBornPos;
        for (var i = 0; i < 2; i++) {
            var randIndex = parseInt(cc.random0To1()*this.branchItem.length);
            this.createBranch(randIndex, i);
        }
    },

    enableCreate (enable) {
        this.btnCreate.interactable = enable;
    },

    randCreateBranch: function () {
        var rand = parseInt(cc.random0To1()*this.branchPos.length);
        var randIndex = parseInt(cc.random0To1()*this.branchItem.length);
        this.createBranch(randIndex, rand);
    },

    createBranch: function (itemIndex, posIndex) {
        var branchItem = cc.instantiate(this.branchItem[itemIndex]);
        branchItem.parent = this.branchParent;
        branchItem.position = this.branchPos[posIndex];
        var newBranchPos = branchItem.getChildByName("initPos").position;
        this.branchPos[posIndex] = cc.pAdd(branchItem.position, newBranchPos);
        this.game.resMng.updateNutrition(-1);
        this.game.resMng.addLeaf();
    },
});
