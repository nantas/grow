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
        this.flashNode.opacity = 255;
        Tween.to(this.flashNode, this.showDuration, {
            opacity: 0
        });
    },
    
    activate () {
        if (!this.isActive) {
            this.isActive = true;
        }
    }
});
