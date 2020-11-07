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
            case 2: return Deck.createTestDeck(); break;
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
    useJudge() {
        let judge = new Card("Judge");
        judge.setDescription("Take all the coins from the Courthouse");
        this.addCard(judge);
    }
    useBishop() {
        let bishop = new Card("Bishop");
        bishop.setDescription("Take 2 coins from the richest player. If there is a tie, you can choose your victim.");
        this.addCard(bishop);
    }
    useKing() {
        let king = new Card("King");
        king.setDescription("Take 3 coins from the Bank.");
        this.addCard(king);
    }
    useFool() {
        let fool = new Card("Fool");
        fool.setDescription("Choose two other people to swap or not with.");
        this.addCard(fool);
    }
    useQueen() {
        let queen = new Card("Queen");
        queen.setDescription("Take 2 coins from the Bank.");
        this.addCard(queen);
    }
    useThief() {
        let thief = new Card("Thief");
        thief.setDescription("Take 1 coin from the two people sitting next to you.");
        this.addCard(thief);
    }
    useWitch() {
        let witch = new Card("Witch");
        witch.setDescription("Swap fortunes (coins) with another player.");
        this.addCard(witch);
    }
    useSpy() {
        let spy = new Card("Spy");
        spy.setDescription("Look at your own, and another players card. Then swap or not with them.");
        this.addCard(spy);
    }
    usePeasant() {
        let peasant = new Card("Peasant");
        peasant.setDescription("Take 1 coin from the Bank, or if two Peasants are revealed, both take 2 coins from the Bank.");
        this.addCard(peasant);        
    }
    usePeasants() {
        this.usePeasant();
        this.usePeasant();
    }
    useCheat() {
        let cheat = new Card("Cheat");
        cheat.setDescription("If you have 10 coins, then you win!");
        this.addCard(cheat);
    }
    useInquisitor() {
        let inquisitor = new Card("Inquisitor");
        inquisitor.setDescription("Choose another player. If they can't correctly guess their identity, they must give you 4 coins.");
        this.addCard(inquisitor);
    }
    useWidow() {
        let widow = new Card("Widow");
        widow.setDescription("Top up your fortune to 10 coins. If you have more than 10 coins already, this has no effect.");
        this.addCard(widow);
    }
    
    static createTestDeck() {
        let deck = new Deck();
        deck.useFool();
        deck.useCheat();
        deck.useSpy();
        deck.useInquisitor();
        deck.useWidow();
        deck.useKing();
        return deck;
    }
    static createFourPlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        //deck.useFool();
        deck.useQueen();
        deck.useThief();
        //deck.useWitch();
        //deck.useSpy();
        //deck.usePeasants(); 
        deck.useCheat();
        //deck.useInquisitor();
        //deck.useWidow();

        return deck;
    }
    static createFivePlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        //deck.useFool();
        deck.useQueen();
        //deck.useThief();
        deck.useWitch();
        //deck.useSpy();
        //deck.usePeasants(); 
        deck.useCheat();
        //deck.useInquisitor();
        //deck.useWidow();
        
        return deck;
    }
    static createSixPlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        //deck.useFool();
        deck.useQueen();
        //deck.useThief();
        deck.useWitch();
        //deck.useSpy();
        //deck.usePeasants(); 
        deck.useCheat();
        //deck.useInquisitor();
        //deck.useWidow();
        
        return deck;
    }
    static createSevenPlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        deck.useFool();
        deck.useQueen();
        deck.useThief();
        deck.useWitch();
        //deck.useSpy();
        //deck.usePeasants(); 
        //deck.useCheat();
        //deck.useInquisitor();
        //deck.useWidow();
        
        return deck;
    }
    static createEightPlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        deck.useFool();
        deck.useQueen();
        //deck.useThief();
        deck.useWitch();
        //deck.useSpy();
        deck.usePeasants(); 
        //deck.useCheat();
        //deck.useInquisitor();
        //deck.useWidow();
        
        return deck;
    }
    static createNinePlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        deck.useFool();
        deck.useQueen();
        //deck.useThief();
        deck.useWitch();
        //deck.useSpy();
        deck.usePeasants(); 
        deck.useCheat();
        //deck.useInquisitor();
        //deck.useWidow();
        
        return deck;
    }
    static createTenPlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        deck.useFool();
        deck.useQueen();
        //deck.useThief();
        deck.useWitch();
        deck.useSpy();
        deck.usePeasants(); 
        deck.useCheat();
        //deck.useInquisitor();
        //deck.useWidow();
        
        return deck;
    }
    static createElevenPlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        deck.useFool();
        deck.useQueen();
        //deck.useThief();
        deck.useWitch();
        deck.useSpy();
        deck.usePeasants(); 
        deck.useCheat();
        deck.useInquisitor();
        //deck.useWidow();
        
        return deck;
    }
    static createTwelvePlayerDeck() {
        let deck = new Deck();
        deck.useJudge();
        deck.useBishop();
        deck.useKing();
        deck.useFool();
        deck.useQueen();
        //deck.useThief();
        deck.useWitch();
        deck.useSpy();
        deck.usePeasants(); 
        deck.useCheat();
        deck.useInquisitor();
        deck.useWidow();
        
        return deck;
    }
    static createThirteenPlayerDeck() {
        let deck = new Deck();deck.useJudge();
        deck.useBishop();
        deck.useKing();
        deck.useFool();
        deck.useQueen();
        deck.useThief();
        deck.useWitch();
        deck.useSpy();
        deck.usePeasants(); 
        deck.useCheat();
        deck.useInquisitor();
        deck.useWidow();

        return deck;
    }
}
if (typeof exports !== 'undefined') {
    exports.Deck = Deck;
}
else {
    window.Deck = Deck;
}