const Rabbit = require('Rabbit');
const EventType = require('Types').EventType;
cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        desc: cc.Label,
        sunshine: cc.Animation,
        rain: cc.ParticleSystem,
        rabbit: Rabbit,
        yearsDivide: 0,
        eventCount: 0,
        eventDuration: 0 //year
    },

    init (game) {
        this.game = game;
        this.eventYears = [];
        this.generateEventYears();
        // this.eventOn = false;
    },

    generateEventYears () {
        let count = 0;
        while (count < this.eventCount) {
            let min = count * yearsDivide;
            let year = min + Math.floor(Math.random() * yearsDivide / 2);
            this.eventYears.push(year);
            count++;
        }
    },

    tick () {
        let year = this.game.year;
        if (year === this.eventEndYear) {
            this.stopEvent();
        }
        this.checkEventForYear(year);
    },

    checkEventForYear(year) {
        let index = this.eventYears.indexOf(year);   
        if (index !== -1) {
            this.eventYears.splice(index, 1);
            // this.eventOn = true;
            this.eventEndYear = year + this.eventDuration;
            let eventType = Math.floor(Math.random() * 3);
            if (eventType === EventType.Sunshine) {
                this.startSunshine(); 
            } else if (eventType === EventType.Rain) {
                this.startRain();
            } else if (eventType === EventType.Rabbit) {
                this.startRabbit();
            }
        }
    },

    stopEvent() {
        this.sunshine.stop();
        this.sunshine.node.active = false;
        this.rain.enabled = false;
        this.rain.active = false;
        this.game.resMng.updateEventRes(0, 0);        
    },

    startSunshine () {
        this.sunshine.active = true;
        this.sunshine.play('sunshine');
        this.game.resMng.updateEventRes(-2, 5);
    },

    startRain() {
        this.rain.active = true;
        this.rain.enabled = true;
        this.game.resMng.updateEventRes(4, -2);
    },

    startRabbit() {
        cc.log('rabbit spawn');
        let isLeft = Math.random() > 0.5 ? true: false;
        // this.rabbit.startRun(isLeft);
    }

});