class Deck {
    constructor() {
        this.mCards = [];
    }

    setCards(pCards) {
        this.mCards = pCards;
    }

    addCard(pCard) {
        this.mCards.push(pCard);
    }
    numberOfCards() {
        return this.mCards.length;
    }

    drawCard(pIndex) {
        let card = this.mCards[pIndex];
        this.mCards.splice(pIndex, 1);
        return card;
    }

    getCard(pIndex) {
        if(pIndex >= this.mCards.length) {
            return null;
        }
        return this.mCards[pIndex];
    }

    drawTopCard() {
        let numberOfCards = this.mCards.length;
        if(numberOfCards > 0) {
            let topCard = this.mCards[numberOfCards - 1];
            this.mCards.pop();
            return topCard;
        }
        return null;
    }

    shuffle() {
        let cards = [];
        while(this.mCards.length > 0) {
            let randomIndex = Math.floor((Math.random() * this.mCards.length) + 0);
            let randomCard = this.drawCard(randomIndex);
            cards.push(randomCard);
        }
        this.mCards = cards;
    }

    static createDeck(pNumberOfPlayers) {
        switch(pNumberOfPlayers) {
            case 4: return Deck.createFourPlayerDeck(); break;
            case 5: return Deck.createFivePlayerDeck(); break;
            case 6: return Deck.createSixPlayerDeck(); break;
            case 7: return Deck.createSevenPlayerDeck(); break;
            case 8: return Deck.createEightPlayerDeck(); break;
            case 9: return Deck.createNinePlayerDeck(); break;
            case 10: return Deck.createTenPlayerDeck(); break;
            case 11: return Deck.createElevenPlayerDeck(); break;
            case 12: return Deck.createTwelvePlayerDeck(); break;
            case 13: return Deck.createThirteenPlayerDeck(); break;
            default: return null;
        }
    }

    static createFourPlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        let fool = new Card("Fool");
        deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        let thief = new Card("Thief");
        deck.addCard(thief);
        //let witch = new Card("Witch");
        //deck.addCard(witch);
        //let spy = new Card("Spy");
        //deck.addCard(spy);
        //let peasant1 = new Card("Peasant");
        //deck.addCard(peasant1);        
        //let peasant2 = new Card("Peasant");
        //deck.addCard(peasant2);  
        let cheat = new Card("Cheat");
        deck.addCard(cheat);
        //let inquisitor = new Card("Inquisitor");
        //deck.addCard(inquisitor);
        //let widow = new Card("Widow");
        //deck.addCard(widow);

        return deck;
    }
    static createFivePlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        //let fool = new Card("Fool");
        //deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        //let thief = new Card("Thief");
        //deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        //let spy = new Card("Spy");
        //deck.addCard(spy);
        //let peasant1 = new Card("Peasant");
        //deck.addCard(peasant1);        
        //let peasant2 = new Card("Peasant");
        //deck.addCard(peasant2);  
        let cheat = new Card("Cheat");
        deck.addCard(cheat);
        //let inquisitor = new Card("Inquisitor");
        //deck.addCard(inquisitor);
        //let widow = new Card("Widow");
        //deck.addCard(widow);

        return deck;
    }
    static createSixPlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        //let fool = new Card("Fool");
        //deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        //let thief = new Card("Thief");
        //deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        //let spy = new Card("Spy");
        //deck.addCard(spy);
        //let peasant1 = new Card("Peasant");
        //deck.addCard(peasant1);        
        //let peasant2 = new Card("Peasant");
        //deck.addCard(peasant2);  
        let cheat = new Card("Cheat");
        deck.addCard(cheat);
        //let inquisitor = new Card("Inquisitor");
        //deck.addCard(inquisitor);
        //let widow = new Card("Widow");
        //deck.addCard(widow);

        return deck;
    }
    static createSevenPlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        let fool = new Card("Fool");
        deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        let thief = new Card("Thief");
        deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        //let spy = new Card("Spy");
        //deck.addCard(spy);
        //let peasant1 = new Card("Peasant");
        //deck.addCard(peasant1);        
        //let peasant2 = new Card("Peasant");
        //eck.addCard(peasant2);  
        //let cheat = new Card("Cheat");
        //deck.addCard(cheat);
        //let inquisitor = new Card("Inquisitor");
        //deck.addCard(inquisitor);
        //let widow = new Card("Widow");
        //deck.addCard(widow);

        return deck;
    }
    static createEightPlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        let fool = new Card("Fool");
        deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        //let thief = new Card("Thief");
        //deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        //let spy = new Card("Spy");
        //deck.addCard(spy);
        let peasant1 = new Card("Peasant");
        deck.addCard(peasant1);        
        let peasant2 = new Card("Peasant");
        deck.addCard(peasant2);  
        //let cheat = new Card("Cheat");
        //deck.addCard(cheat);
        //let inquisitor = new Card("Inquisitor");
        //deck.addCard(inquisitor);
        //let widow = new Card("Widow");
        //deck.addCard(widow);

        return deck;
    }
    static createNinePlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        let fool = new Card("Fool");
        deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        //let thief = new Card("Thief");
        //deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        //let spy = new Card("Spy");
        //deck.addCard(spy);
        let peasant1 = new Card("Peasant");
        deck.addCard(peasant1);        
        let peasant2 = new Card("Peasant");
        deck.addCard(peasant2);  
        let cheat = new Card("Cheat");
        deck.addCard(cheat);
        //let inquisitor = new Card("Inquisitor");
        //deck.addCard(inquisitor);
        //let widow = new Card("Widow");
        //deck.addCard(widow);

        return deck;
    }
    static createTenPlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        let fool = new Card("Fool");
        deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        //let thief = new Card("Thief");
        //deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        let spy = new Card("Spy");
        deck.addCard(spy);
        let peasant1 = new Card("Peasant");
        deck.addCard(peasant1);        
        let peasant2 = new Card("Peasant");
        deck.addCard(peasant2);  
        let cheat = new Card("Cheat");
        deck.addCard(cheat);
        //let inquisitor = new Card("Inquisitor");
        //deck.addCard(inquisitor);
        //let widow = new Card("Widow");
        //deck.addCard(widow);

        return deck;
    }
    static createElevenPlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        let fool = new Card("Fool");
        deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        //let thief = new Card("Thief");
        //deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        let spy = new Card("Spy");
        deck.addCard(spy);
        let peasant1 = new Card("Peasant");
        deck.addCard(peasant1);        
        let peasant2 = new Card("Peasant");
        deck.addCard(peasant2);  
        let cheat = new Card("Cheat");
        deck.addCard(cheat);
        let inquisitor = new Card("Inquisitor");
        deck.addCard(inquisitor);
        //let widow = new Card("Widow");
        //deck.addCard(widow);

        return deck;
    }
    static createTwelvePlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        let fool = new Card("Fool");
        deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        //let thief = new Card("Thief");
        //deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        let spy = new Card("Spy");
        deck.addCard(spy);
        let peasant1 = new Card("Peasant");
        deck.addCard(peasant1);        
        let peasant2 = new Card("Peasant");
        deck.addCard(peasant2);  
        let cheat = new Card("Cheat");
        deck.addCard(cheat);
        let inquisitor = new Card("Inquisitor");
        deck.addCard(inquisitor);
        let widow = new Card("Widow");
        deck.addCard(widow);

        return deck;
    }
    static createThirteenPlayerDeck() {
        let deck = new Deck();
        let judge = new Card("Judge");
        deck.addCard(judge);
        let bishop = new Card("Bishop");
        deck.addCard(bishop);
        let king = new Card("King");
        deck.addCard(king);
        let fool = new Card("Fool");
        deck.addCard(fool);
        let queen = new Card("Queen");
        deck.addCard(queen);
        let thief = new Card("Thief");
        deck.addCard(thief);
        let witch = new Card("Witch");
        deck.addCard(witch);
        let spy = new Card("Spy");
        deck.addCard(spy);
        let peasant1 = new Card("Peasant");
        deck.addCard(peasant1);        
        let peasant2 = new Card("Peasant");
        deck.addCard(peasant2);  
        let cheat = new Card("Cheat");
        deck.addCard(cheat);
        let inquisitor = new Card("Inquisitor");
        deck.addCard(inquisitor);
        let widow = new Card("Widow");
        deck.addCard(widow);

        return deck;
    }
}
if (typeof exports !== 'undefined') {
    exports.Deck = Deck;
}
else {
    window.Deck = Deck;
}