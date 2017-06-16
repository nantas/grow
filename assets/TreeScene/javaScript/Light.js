cc.Class({
    extends: cc.Component,

    properties: {
        speedX: 0,
        speedY: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.enabled = false;
    },
    
    init: function (game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    },
    
    getPlayerDistance: function (position) {
        // 根据两点位置计算两点之间距离
        var dist = cc.pDistance(this.node.position, position);
        return dist;
    },
    
    stopUpdate: function(){
        this.unscheduleUpdate();
    },
    
    update: function (dt) {
        this.node.x = this.node.x + this.speedX;
        this.node.y = this.node.y + this.speedY;
        //cc.log(this.game.targetPos.length);
        for(var i=0;i<this.game.targetPos.length;i++){
            if(this.getPlayerDistance(this.game.targetPos[i]) < 20){
                if(this.game.lightArr[i]<2){
                    this.node.removeFromParent();
                    this.game.lightArr[i]=this.game.lightArr[i]+1;
                }
            }
        }
        if(this.node.x>505||this.node.x<-505||this.node.y<-345){
            this.node.removeFromParent();
        }
    },
});
