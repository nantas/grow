var HoleType = require("Types").HoleType;

cc.Class({
    extends: cc.Component,

    properties: {
        type: {
            default: HoleType.Rock,
            type: HoleType
        }
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
