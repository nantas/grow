var HoleType = require("Types").HoleType;

cc.Class({
    extends: cc.Component,

    properties: {
        type: {
            default: HoleType.Water,
            type: HoleType
        }
    },

    onLoad: function () {

    },

    init () {
        this.show();
    },

    show () {
    },

    activate () {
        if (!this.isActive) {
            this.isActive = true;
        }
    }
});
