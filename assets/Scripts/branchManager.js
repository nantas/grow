const ResType = require('Types').ResType;
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
        this.branchPos = this.branchBornPos.copyWithin();
        this.existBranches = [];
        for (var i = 0; i < 2; i++) {
            var randIndex = parseInt(cc.random0To1()*this.branchItem.length);
            this.createBranch(randIndex, i);
        }
    },

    enableCreate (enable) {
        this.btnCreate.interactable = enable;
    },

    playScoreOnBranches () {
        for (let i = 0; i < this.existBranches.length; ++i) {
            this.game.uiControl.spawnScore(ResType.Light, this.game.resMng.lightPerTick, this.existBranches[i]);
        }
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
        if (Math.random() > 0.5) {
            branchItem.scaleX = -1;
        }
        this.existBranches.push(branchItem.position);
        var newBranchPos = branchItem.getChildByName("initPos").position;
        this.branchPos[posIndex] = cc.pAdd(branchItem.position, newBranchPos);
        if (this.game) {
            this.game.resMng.updateNutrition(-1);
            this.game.resMng.addLeaf();
        }
    },
});
