class Card {
    constructor(pName, pDescription) {
        this.setName(pName);
        this.setDescription(pDescription);
    }
    setName(pName) {
        this.mName = pName;
    }
    getName() {
        return this.mName;
    }
    setDescription(pDescription) {
        this.mDescription = pDescription;
    }
    getDescription() {
        return this.mDescription;
    }
}
if (typeof exports !== 'undefined') {
    exports.Card = Card;
}
else {
    window.Card = Card;
}