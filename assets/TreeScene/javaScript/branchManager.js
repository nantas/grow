cc.Class({
    extends: cc.Component,

    properties: {
        branchBornPos: [cc.Vec2],
        branchItem: [cc.Prefab],
        branchParent: cc.Node
    },

    onLoad: function () {
        this.branchPos = this.branchBornPos;
        for (var i = 0; i < this.branchPos.length; i++) {
            var randIndex = parseInt(cc.random0To1()*this.branchItem.length);
            this.createBranch(randIndex, i);
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
        var newBranchPos = branchItem.getChildByName("initPos").position;
        this.branchPos[posIndex] = cc.pAdd(branchItem.position, newBranchPos);
    },
});
