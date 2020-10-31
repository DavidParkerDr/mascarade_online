class Card {
    constructor(pName) {
        this.setName(pName);
        this.show();
    }
    setName(pName) {
        this.mName = pName;
    }
    getName() {
        return this.mName;
    }
    hide() {
        this.mHidden = true;
    }
    show() {
        this.mHidden = false;
    }
    isHidden() {
        return this.mHidden;
    }
}
if (typeof exports !== 'undefined') {
    exports.Card = Card;
}
else {
    window.Card = Card;
}