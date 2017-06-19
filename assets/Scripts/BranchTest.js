const BranchMng = require('branchManager');

cc.Class({
    extends: cc.Component,

    properties: {
        branchMng: BranchMng
    },

    // use this for initialization
    onLoad () {
        this.branchMng.init();
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
