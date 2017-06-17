cc.Class({
    extends: cc.Component,

    properties: {
        leafParent: cc.Node,
    },

    onLoad: function () {
    },

    init: function (branchManager) {
        this.branchManager = branchManager;
        this.isFullLeaf = false;
    },

    bornLeaf: function () {
        var rand = this.getLeafActive();
        this.leafParent.children[rand].active = true;
        for (var i = 0; i < this.leafParent.children.length; i++) {
            if(!this.leafParent.children[i].active) {
                this.isFullLeaf = false;
                break;
            }
            this.isFullLeaf = true;
        }
        if(this.isFullLeaf) {
            this.branchManager.randCreateBranch();
        }
    },

    getFullLeaf: function () {
        return this.isFullLeaf;
    },

    getLeafActive: function () {
        var rand = parseInt(cc.random0To1()*this.leafParent.children.length);
        if(this.leafParent.children[rand].active) {
            rand = this.getLeafActive();
        }
        return rand;
    }
});
