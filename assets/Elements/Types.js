const ResType = cc.Enum({
    Water: -1,
    Light: -1,
    Nutrition: -1
});

const EventType = cc.Enum({
    Sunshine: -1,
    Rain: -1,
    Rabbit: -1
});

const HoleType = cc.Enum({
    Water: -1,
    Rock: -1,
    Turd: -1,
    Pest: -1,
    Toxic: -1,
});


module.exports = {
    ResType,
    EventType,
    HoleType
};