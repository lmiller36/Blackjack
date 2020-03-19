
document.suits = {
    clubs: 'clubs',
    diamonds: 'diamonds',
    hearts: 'hearts',
    spades: 'spades'
}

document.values = {
    "ace": "ace",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "jack": "jack",
    "queen": "queen",
    "king": "king"
}

// i.e. 2 > 2 or 11 > Jack ... etc
// getValueFromFaceValue(faceValue){
//     switch()
// }

// A card has two attributes, 
// a face value [1,13], where 1 = Ace, 11 = J, 12 = Q, 13 = l
// and a suit
class Card {
    constructor(suit, faceValue) {
        this.suit = suit;
        this.faceValue = faceValue;
        this.value = null;
    }

    getSVG() {
        var img = document.createElement('img');
        img.src = "./svg-cards/" + this.faceValue + "_of_" + this.suit + ".svg";
        return img;
    }
}

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

// returns a shuffled array of cards 
class Deck {

    constructor() {
        this.cards = [];
        console.log(document.suits);
        var suits = Object.keys(document.suits);
        var values = Object.keys(document.values);

        for (var i = 0; i < suits.length; i++) {
            var suit = suits[i];
            for (var j = 0; j < values.length; j++) {
                this.cards.push(new Card(suit, values[j]))
            }
        }

        this.cards = shuffle(this.cards);
    }
}

var deck = new Deck();

for (var j = 0; j < deck.cards.length; j++) {
    var svg = deck.cards[j].getSVG();
    console.log(svg);
    document.body.appendChild(svg);
}

