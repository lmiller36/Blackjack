
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
        img.width = "125";
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
    final.sort((a, b) => { return b - a });

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

        // this.cards.splice(0, 1, new Card("clubs", "10"));
        // this.cards.splice(2, 1, new Card("clubs", "ace"));
        // // this.cards.splice(4, 1, new Card("clubs", "ace"));
        // this.cards.splice(5, 1, new Card("clubs", "ace"));
        // this.cards.splice(7, 1, new Card("clubs", "ace"));
        // this.cards.splice(8, 1, new Card("clubs", "ace"));


    }
}

var currentCard = 0;
var playersCards = [];
var dealerCards = [];
var currentBets = [];
var hasBusted = false;
var gameOver = false;
var doubled = false;
var deck;
var sum = -1;
var numHands = 0;
var dealerSum = -1;
document.chips = 100;
document.bet = 1;
var currHand = 0;

function changeBet(betChange) {
    var newBet = document.bet + betChange;
    if (newBet > 0 && newBet <= document.chips)
        document.bet = newBet;
    document.getElementById("bet").innerText = "Bet: " + document.bet;
}

function newGame() {
    currentCard = 0;
    playersCards = [[]];
    dealerCards = [];
    currentBets = [document.bet];
    hasBusted = false;
    gameOver = false;
    doubled = false;
    currHand = 0;
    numHands = 0;
    sum = -1;
    dealerSum = -1;

    deck = new Deck();

    // remove previous game's cards
    removeChildren("dealerContainer");
    removeChildren("playerHandsContainer");

    document.getElementById("dealerSumContainer").style.display = "none";
    document.getElementById("dealerSumContainer").style.display = "none";

    document.getElementById("actionContainer_inGame")
        .querySelector(".double").style.display = "";

    toggleButtons(true);

    // initialize player hand
    addPlayerHand();

    // initial cards
    addDealerCard(false, false);
    addPlayerCard("hand_0");
    addDealerCard(true, false);
    addPlayerCard("hand_0");

    // if dealer has 21, game is automatically over
    console.log(dealerCards[1].faceValue);
    console.log(dealerCards[0].value);
    if(dealerCards[1].faceValue == "ace" && dealerCards[0].value == 10){
        hideButtons();
        setTimeout(stand, 1000);
    }

    document.getElementById("hand_0").querySelector(".cards").className += " currentHand";

    if (playersCards[0].length == 2 && playersCards[0][0].value == playersCards[0][1].value) {
        var buttons = document.querySelector('#actionContainer_inGame');
        buttons.querySelector('.split').style.display = "";
    }
    else {
        var buttons = document.querySelector('#actionContainer_inGame');
        buttons.querySelector('.split').style.display = "none";
    }

    // if dealer has 21 w/ an ace showing, round is automatically over
    // if()

    // initializeML();
}

function removeChildren(nodeStr) {
    var node = document.getElementById(nodeStr);
    var cNode = node.cloneNode(false);
    node.parentNode.replaceChild(cNode, node);
}

function double() {
    if (hasBusted || gameOver) return
    doubled = true;
    currentBets[currHand] *= 2;
    // document.bet *= 2;
    document.getElementById("hand_" + currHand).querySelector(".textDiv")
        .querySelector(".bet").querySelector(".betText").innerText = "Bet: " + currentBets[currHand];
    // document.getElementById("bet").innerText = "Bet: " + document.bet;

    hit();
    stand();
}

function hideButtons(){
    document.getElementById("actionContainer_inGame")
    .style.display = "none";
}

function hit() {
    if (hasBusted || gameOver) return;

    hideButtons();

    addPlayerCard("hand_" + currHand);
}

function delayOneSecond() {
    setTimeout(function () { }, 1000);
}

function toggleButtons(inGame) {

    if (inGame) {
        document.getElementById("actionContainer_replay").style.display = "none";
        document.getElementById("actionContainer_inGame").style.display = "";
        document.getElementById("betButtons").style.display = "none";

    }
    else {
        document.getElementById("actionContainer_replay").style.display = "";
        document.getElementById("actionContainer_inGame").style.display = "none";
        document.getElementById("betButtons").style.display = "";
    }
}

function endGame() {
    toggleButtons(false);

    // determine bets
    var i = 0;
    playersCards.forEach(hand => {
        var sum = addCards(hand)[0];
        var cards = document.getElementById("hand_" + i).querySelector(".cards");

        // subtract if lost
        if (sum == -1 || sum < dealerSum) {
            document.chips -= currentBets[i];
            cards.className += " loss";
        }
        else if (sum > dealerSum) {
            if (sum == 21 && hand.length == 2) {
                var bjBet = Math.round(currentBets[i] * 1.5);
                document.getElementById("hand_" + (currHand - 1)).querySelector(".textDiv")
                    .querySelector(".bet").querySelector(".betText").innerText = "Bet: " + bjBet;
                document.chips += bjBet;
            }
            else
                document.chips += currentBets[i];

            cards.className += " win";
        }
        i++;
    })



    //update chips
    document.getElementById("chips").innerText = "Chips: " + document.chips;

}

function addPlayerHand() {
    var handsContainer = document.querySelector("#playerHandsContainer");
    var handDiv = document.createElement("div");
    handDiv.id = "hand_" + handsContainer.childNodes.length;
    handDiv.className = "centerContent";
    handDiv.style.display = "grid";

    var cardsDiv = document.createElement("div");
    cardsDiv.className = "cards";

    // <ul>
    //     <li>
    //         <span class="label">Blah blah</span>
    //         5
    //     </li>
    // </ul>

    //    var list = document.createElement("ul");
    //    var listElem = document.createElement("span");
    //    listElem.className = "sum label";
    //    listElem.innerText = "Sum: 13";
    //    listElem.innerHTML += "Bet:20";

    //    list.appendChild(listElem);

    var sumDiv = document.createElement("div");
    sumDiv.className = "sum";
    var sumText = document.createElement("p");
    sumText.className = "sumText text";
    sumText.innerText = "Sum:";
    sumText.style.marginRight = "80px";
    sumDiv.appendChild(sumText);

    var betDiv = document.createElement("div");
    betDiv.className = "bet";
    var betText = document.createElement("p");
    betText.className = "betText text";
    betText.innerText = "Bet:1";
    betDiv.appendChild(betText);

    var textDiv = document.createElement("div");
    textDiv.className = "textDiv";
    textDiv.style.display = "inline-flex";
    textDiv.appendChild(sumDiv);
    textDiv.appendChild(betDiv);

    handDiv.appendChild(cardsDiv);
    // handDiv.appendChild(list);
    handDiv.appendChild(textDiv);

    // handDiv.appendChild(sumDiv);
    // handDiv.appendChild(betDiv);

    handsContainer.appendChild(handDiv);
    numHands++;

    return handDiv;
}

function split() {

    playersCards.push([]);
    currentBets.push(document.bet);

    // denote that player has an additional hand to play out
    var currentHand = document.getElementById("hand_" + currHand);
    var createdHand = addPlayerHand();

    var newHandNum = createdHand.id.split("_")[1];

    var cardToMove = currentHand.querySelector(".cards").childNodes[1];
    currentHand.querySelector(".cards").removeChild(cardToMove);
    createdHand.querySelector(".cards").appendChild(cardToMove);

    playersCards[newHandNum].push(playersCards[currHand].splice(1, 1)[0]);

    addPlayerCard(currentHand.id);
    addPlayerCard(createdHand.id);

    if (playersCards[currHand].length == 2 && playersCards[currHand][0].value == playersCards[currHand][1].value) {
        var buttons = document.querySelector('#actionContainer_inGame');
        buttons.querySelector('.split').style.display = "";
    }
    else {
        var buttons = document.querySelector('#actionContainer_inGame');
        buttons.querySelector('.split').style.display = "none";
    }
}

function stand() {
    //if (hasBusted || gameOver) return;

    currHand++;

    document.getElementById("actionContainer_inGame")
        .querySelector(".double")
        .style.display = "";

    if (currHand < playersCards.length) {
        document.getElementById("hand_" + (currHand - 1)).querySelector(".cards").classList.remove("currentHand");

        document.getElementById("hand_" + currHand).querySelector(".cards").className += " currentHand";

        if (playersCards[currHand].length == 2 && playersCards[currHand][0].value == playersCards[currHand][1].value) {
            var buttons = document.querySelector('#actionContainer_inGame');
            buttons.querySelector('.split').style.display = "";
        }
        else {
            var buttons = document.querySelector('#actionContainer_inGame');
            buttons.querySelector('.split').style.display = "none";
        }
    }
    // if round is over
    else if (currHand == playersCards.length) {
        document.getElementById("actionContainer_inGame").style.display = "none";
        document.getElementById("hand_" + (currHand - 1)).querySelector(".cards").classList.remove("currentHand");

        // flip over hidden card
        var hidden = document.getElementById("hiddenCard");
        hidden.style.display = "none";
        var dealersCards = document.getElementById("dealerContainer")
        var firstCard = deck.cards[0];
        dealersCards.insertBefore(firstCard.getSVG(), dealersCards.firstChild);

        // show dealer sum
        var dealerSumDiv = document.getElementById("dealerSumContainer");
        dealerSumDiv.style.display = "";

        var sums = updateSum(dealerCards, document.getElementById("dealerSumText"))

        // finish out dealer cards
        var maxSum = sums[0];

        var bust = (maxSum == "bust");
        var mustStop = maxSum >= 17;
        dealerSum = maxSum;
        delayOneSecond();

        // dealer will continue playing until they bust
        // or reach a value of 17

        var addCardInterval;
        var addCard = () => {
            sums = addDealerCard(true, true);
            maxSum = sums[0];
            dealerSum = maxSum;

            if (maxSum == "bust") {
                bust = true;
                dealerSum = -1;
            }
            else {
                if (maxSum >= 17) mustStop = true;
            }

            if (bust || mustStop) {
                clearInterval(addCardInterval);
                endGame();
            }
        }

        // start autoplay for dealer, playing one card / sec
        // only initiate if dealer starts below 17
        if (!bust && !mustStop)
            addCardInterval = setInterval(addCard, 1000);
        else
            endGame();
    }
}

function updateSum(cards, sumText, bet) {
    var sums = addCards(cards);
    var str = "Sum: " + sums[0];

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
        img.width = "125";
        img.id = "hiddenCard";
    }
    else {
        img = card.getSVG();
    }

    dealersCards.appendChild(img);
    dealerCards.push(card);

    var sums;
    if (updateSums)
        sums = updateSum(dealerCards, document.getElementById("dealerSumText"))

    currentCard++;

    return sums;
}

function updateBet(newBet) {
    document.bet = newBet;
    document.getElementById("bet").innerText = "Bet: " + document.bet;
}

function addPlayerCard(handStr) {
    var handNum = handStr.split("_")[1];

    var playersCardsDiv = document.getElementById(handStr).querySelector(".cards");

    // add card to window
    var card = deck.cards[currentCard];
    playersCardsDiv.appendChild(card.getSVG());

    playersCards[handNum].push(card);

    // update sum
    var sums = updateSum(playersCards[handNum],
        document.getElementById(handStr)
            .querySelector(".textDiv")
            .querySelector(".sum")
            .querySelector(".sumText"),
        currentBets[handNum]);
    sum = sums[0];

    // if busted, update variable
    if (sums[0] == "bust" || sums[0] == 21) {
        console.log("timeout")
        setTimeout(stand, 1000);
    }

    // increment used card
    currentCard++;
}
