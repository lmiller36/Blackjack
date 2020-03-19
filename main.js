
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

// A card has two attributes, 
// a face value [1,13], where 1 = Ace, 11 = J, 12 = Q, 13 = l
// and a suit
class Card {
    constructor(suit, faceValue) {
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
            // console.log(v1 + " " + v2);
        }
        // console.log(v1 + " " + v2);


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
    final.sort((a,b)=> {return b-a});

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
                this.cards.push(new Card(suit, values[j]))
            }
        }

        this.cards = shuffle(this.cards);
    }
}

var currentCard = 0;
var playersCards = [];
var dealerCards = [];
var hasBusted = false;
var deck;

function hit() {
    if (!hasBusted)
        addPlayerCard();
}

function delayOneSecond() {
    setTimeout(function () { }, 1000);
}

function stand() {
    // flip over hidden card
    var hidden = document.getElementById("hiddenCard");
    hidden.style.display = "none";
    var dealersCards = document.getElementById("dealerContainer")
    var firstCard = deck.cards[0];
    dealersCards.insertBefore(firstCard.getSVG(), dealersCards.firstChild);

    // show dealer sum
    var dealerSumDiv = document.getElementById("dealerSumContainer");
    dealerSumDiv.style.display = "";

    var sums = updateSum(dealerCards, "dealerSumText")

    // finish out dealer cards
    var maxSum = sums[0];
    console.log(maxSum);
    var bust = (maxSum == "bust");
    var mustStop = maxSum >= 17;

    delayOneSecond();

    // dealer will continue playing until they bust
    // or reach a value of 17

    var addCardInterval;
    var addCard = () => {
        sums = addDealerCard(true, true);
        maxSum = sums[0];
        console.log(maxSum)
        if (maxSum == "bust") bust = true;
        else {
            if (maxSum >= 17) mustStop = true;
        }

        if (bust || mustStop) clearInterval(addCardInterval);
    }
    
    // start autoplay for dealer, playing one card / sec
    // only initiate if dealer starts below 17
    if (!bust && !mustStop)
        addCardInterval = setInterval(addCard, 1000);
}

function updateSum(cards, div) {
    var sums = addCards(cards);
    console.log(sums);
    var str = "Sum: " + sums[0];
    var sumText = document.getElementById(div);

    for (var i = 1; i < sums.length; i++)
        str += " or " + sums[i];

    sumText.innerText = str;

    return sums;
}

function addDealerCard(showCard, updateSums) {
    var img, card;
    var dealersCards = document.getElementById("dealerContainer")

    card = deck.cards[currentCard];
    if (!showCard) {
        img = document.createElement('img');
        img.src = "./svg-cards/Card_back.svg";
        img.width = "222";
        img.id = "hiddenCard";
    }
    else {
        img = card.getSVG();
    }

    dealersCards.appendChild(img);
    dealerCards.push(card);

    var sums;
    if (updateSums)
        sums = updateSum(dealerCards, "dealerSumText")


    currentCard++;

    return sums;
}

function addPlayerCard() {
    var playersCardsDiv = document.getElementById("playerContainer")

    // add card to window
    var card = deck.cards[currentCard];
    playersCardsDiv.appendChild(card.getSVG());

    playersCards.push(card);

    // update sum
    var sums = updateSum(playersCards, "playerSumText");

    // if busted, update variable
    if (sums[0] == "bust") {
        hasBusted = true;
        setTimeout(stand, 1000);
    }


    // increment used card
    currentCard++;
}

function start(){
     deck = new Deck();

    // initial cards
    addDealerCard(false, false);
    addPlayerCard();
    addDealerCard(true, false);
    addPlayerCard();

}
