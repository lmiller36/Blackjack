
document.suits = {
    clubs: 'clubs',
    diamonds: 'diamonds',
    hearts: 'hearts',
    spades: 'spades'
}

document.values = {
    "ace": "?",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "10": "10",
    "jack": "10",
    "queen": "10",
    "king": "10"
}

// i.e. 2 > 2 or 11 > Jack ... etc
// getValueFromFaceValue(faceValue){
//     switch()
// }

// A card has two attributes, 
// a face value [1,13], where 1 = Ace, 11 = J, 12 = Q, 13 = l
// and a suit
class Card {
    constructor(suit, faceValue, value) {
        this.suit = suit;
        this.faceValue = faceValue;
        this.value = document.values[faceValue];
    }

    getSVG() {
        var img = document.createElement('img');
        img.src = "./svg-cards/" + this.faceValue + "_of_" + this.suit + ".svg";
        return img;
    }
}

// function getValue(faceValue) {
//     switch (faceValue) {
//         case values["2"]:
//             return 2;
//         case values["3"]:
//             return 3;
//         case values["4"]:
//             return 4;
//         case values["5"]:
//             return 5;
//         case values["6"]:
//             return 6;
//         case values["7"]:
//             return 7;
//         case values["8"]:
//             return 8;
//         case values["9"]:
//             return 9;
//         case values["10"]:
//             return 10;
//         case values["jack"]:
//             return 10;
//         case values["queen"]:
//             return 10;
//         case values["king"]:
//             return 10;
//         case values["ace"]:
//             return "?";
//     }
// }

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

function addCards(cards) {
    var sums = [];
    var numSums = 1;

    sums.push(0);

    cards.forEach((card) => {
        var value = card.value;
        var v1, v2;
        //     // ace
        if (value == "?") {
            for (var i = 0; i < numSums; i++) {
                sums.push(sums[i]);
            }
            numSums *= 2;
            v2 = 11;
            v1 = 1;
            // v2 = 11;                                                                                                                                                                                                                                                                                                                                                                           )
        }
        else {
            v1 = parseInt(value);
            v2 = v1;
            console.log(v1 + " " + v2);
        }
        console.log(v1 + " " + v2);


        for (var i = 0; i < numSums; i++) {
            if (i < numSums / 2)
                sums[i] += v1;
            else
                sums[i] += v2;
        }
    });


    // set of remaining values 
    var set = new Set();

    // remove over 21
    sums.forEach(sum => {
        if (sum <= 21) set.add(sum);
    })

    var final = Array.from(set);

    console.log(sums);
    console.log(set);
    console.log(final);

    // didn't bust
    if (final.length > 0)
        return final;

    // busted
    else return ["bust"];

}

// returns a shuffled array of cards 
class Deck {

    constructor() {
        this.cards = [];
        var suits = Object.keys(document.suits);
        var values = Object.keys(document.values);

        for (var i = 0; i < suits.length; i++) {
            var suit = suits[i];
            for (var j = 0; j < values.length; j++) {
                this.cards.push(new Card(suit, values[j], null))
            }
        }

        this.cards = shuffle(this.cards);
    }
}

var deck = new Deck();

var img = document.createElement('img');
img.src = "./svg-cards/Card_back.svg";
img.width = "222";

console.log(deck.cards)

// add dealer's card
var dealersCards = document.getElementById("dealerContainer")
dealersCards.appendChild(img);
dealersCards.appendChild(deck.cards[2].getSVG());


// add player's cards
var playersCards = document.getElementById("playerContainer")
var card1 = deck.cards[1];
var card2 = deck.cards[3];

playersCards.appendChild(card1.getSVG());
playersCards.appendChild(card2.getSVG());

// update sum
var sums = addCards([card1, card2]);
console.log(sums);
var str = "Sum: " + sums[0];
var sumText = document.getElementById("sumText");

for (var i = 1; i < sums.length; i++)
    str += " or " + sums[i];

sumText.innerText = str;


