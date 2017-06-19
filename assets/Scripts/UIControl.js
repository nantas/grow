cc.Class({
    extends: cc.Component,

    properties: {
        labelYear: cc.Label,
        labelRoot: cc.Label,
        labelLeaf: cc.Label,
        uiGameOver: cc.Node,
        scorePrefab: cc.Prefab,
        land2: cc.Node, //Hack to fix camera culling
        fxLayer: cc.Node
    },

    // use this for initialization
    init () {
        this.updateYear(0);
        this.updateRootLength(0);
        this.updateLeaf(0);
        this.scorePool = new cc.NodePool();
        this.uiGameOver.active = false;
    },

    updateYear(num) {
        this.labelYear.string = 'Year: ' + num;
    },

    updateRootLength (num) {
        num = parseInt(num);
        this.labelRoot.string = 'Root: ' + num + 'm';
    },

    updateLeaf (num) {
        this.labelLeaf.string = 'Leaf: ' + num;
    },

    showGameOver () {
        this.uiGameOver.active = true;
    },

    spawnScore (type, num, pos) {
        let scoreN = null;
        if (this.scorePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            scoreN = this.scorePool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            scoreN = cc.instantiate(this.scorePrefab);
        }
        let score = scoreN.getComponent('ScoreFX');
        this.fxLayer.addChild(scoreN);
        scoreN.position = pos;
        score.init(type, num, this);
    },

    despawnScore (score) {
        this.scorePool.put(score.node);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
