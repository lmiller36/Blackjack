var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


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

function show(elem) {
    elem.style.display = "";
}

function hide(elem) {
    elem.style.display = "none";
}

function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
}

function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
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

        // this.cards.splice(1, 1, new Card("spades", "ace"))
        // this.cards.splice(3, 1, new Card("clubs", "10"))
        // this.cards.splice(4, 1, new Card("hearts", "ace"))
        // this.cards.splice(5, 1, new Card("hearts", "ace"))
        // this.cards.splice(6, 1, new Card("hearts", "ace"))
    }
}

function removeChildren(nodeStr) {
    var node = document.getElementById(nodeStr);
    var cNode = node.cloneNode(false);
    node.parentNode.replaceChild(cNode, node);
}

function removeChildrenWithNode(node) {
    var cNode = node.cloneNode(false);
    node.parentNode.replaceChild(cNode, node);
}

function delayOneSecond() {
    setTimeout(function () { }, 1000);
}

// A card has two attributes, 
// a face value [1,13], where 1 = Ace, 11 = J, 12 = Q, 13 = l
// and a suit
class Card {
    constructor(suit, faceValue, isHidden) {
        this.suit = suit;
        this.faceValue = faceValue;
        this.value = document.values[faceValue];
        this.isHidden = isHidden;
    }

    getSVG() {
        var img = document.createElement('img');

        // dealer card showing 
        if (this.isHidden) {
            img.src = "./svg-cards/Card_back.svg";
            img.id = "hiddenCard";
        }
        else {
            img.src = "./svg-cards/" + this.faceValue + "_of_" + this.suit + ".svg";
        }

        img.className = "card "+document.height;
        return img;
    }
}

class Hand {
    constructor() {
        this.cards = [];
        this.isBusted = false;
        this.sum = 0;
        this.showSum = false;
    }

    takeCard(card) {
        this.cards.push(card);

        var sum = this.calculateCardSum();
        this.sum = sum[0];
        this.sumText = sum[0];
        if (sum.length > 1)
            this.sumText += " or " + sum[1];
    }

    calculateCardSum() {
        var sums = [];
        var numSums = 1;

        sums.push(0);

        this.cards.forEach((card) => {
            var value = card.value;
            var v1, v2;
            // ace
            if (value == "?") {
                for (var i = 0; i < numSums; i++) {
                    sums.push(sums[i]);
                }
                numSums *= 2;
                v2 = 11;
                v1 = 1;
            }
            else {
                v1 = parseInt(value);
                v2 = v1;
            }


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

    createElement() {
        var maxCardsInRow = 4;
        var rowsNeeded = Math.ceil(this.cards.length / maxCardsInRow);
        var div = document.createElement("div");

        for (var i = 0; i < rowsNeeded; i++) {
            var row = document.createElement("tr");
            for (var j = 0; j < maxCardsInRow; j++) {
                var cardNum = i * maxCardsInRow + j;
                if (cardNum < this.cards.length) {
                    var card = this.cards[cardNum];
                    row.appendChild(card.getSVG());
                }
            }
            div.appendChild(row);

            if (this.showSum && i == (rowsNeeded - 1)) {
                var textContainer = document.createElement("div");
                textContainer.className = "hand_textContainer";
                var sumText = document.createElement("div");
                sumText.innerText = "Sum: " + this.sumText;
                sumText.style.float = "left";

                if (this.bet) {
                    var betText = document.createElement("div");
                    betText.innerText = "Bet: " + this.bet;
                    betText.style.float = "right";
                    textContainer.appendChild(betText);
                }

                textContainer.appendChild(sumText);

                row.appendChild(textContainer);
            }
        }

        return div;
    }

    isHandOver() { }
}

class PlayerHand extends Hand {
    constructor(bet) {
        super();
        this.bet = bet;
        this.isDoubled = false;
        this.hasStand = false;
        this.showSum = true;
    }

    // returns a subset of [hit,stand,double,split]
    applicableActions() {
        var applicableActions = [];
        if (!this.isBusted && !this.isDoubled && !this.hasStand) {
            applicableActions.push("hit");
            applicableActions.push("stand");

            // can only double on initial hand
            if (this.cards.length == 2) {
                applicableActions.push("double");

                // can only split w/ 2 cards of equal value
                if (this.cards[0].value == this.cards[1].value)
                    applicableActions.push("split");
            }
        }

        return applicableActions;
    }

    removeCard() {
        return this.cards.pop();
    }

    hit(card) {
        this.takeCard(card);
    }

    double(card) {
        this.isDoubled = true;
        this.hit(card);
        this.stand();
    }

    stand() {
        this.hasStand = true;
    }

    isHandOver() {
        if (this.sum == "bust")
            this.isBusted = true;

        return this.isDoubled || this.isBusted || this.hasStand || this.sum == 21;
    }
}

class DealerHand extends Hand {
    constructor() {
        super();
    }

    flipCard() {
        this.cards[0].isHidden = false;
    }

    isHandOver() {
        if (this.sum == "bust")
            this.isBusted = true;

        return this.isBusted || this.sum >= 17;
    }
}

class Round {
    constructor(bet) {
        this.deck = new Deck();
        this.currentCard = 0;
        this.dealerHand = new DealerHand();

        // A player may have multiple hands, if a split occurred
        this.playerHands = [];
        this.playerHands.push(new PlayerHand(bet));
        this.playerHandIndex = 0;

        // Add First 4 cards
        this.addDealerCard(true);
        this.addPlayerCard();
        this.addDealerCard(false);
        this.addPlayerCard();

        this.checkStatus();

        this.roundDelta = 0;
    }

    nextCard() {
        var card = this.deck.cards[this.currentCard];
        this.currentCard++;
        return card;
    }

    addPlayerCard() {
        var card = this.nextCard();
        this.playerHands[this.playerHandIndex].takeCard(card);
    }

    addDealerCard(hideCard) {
        var card = this.nextCard();
        this.dealerHand.takeCard(card);
        if (hideCard) card.isHidden = true;

    }

    updatePage() {
        this.updateDealerHand();
        this.updatePlayerHands();

        if (this.playerHandIndex < this.playerHands.length)
            this.updateGameButtons();

    }

    updateGameButtons() {
        console.log(this.playerHandIndex);
        var toShow = new Set(this.playerHands[this.playerHandIndex].applicableActions());
        var allButtons = new Set(["hit", "stand", "split", "double"]);
        var toHide = difference(allButtons, toShow);

        var gameButtonsContainer = document.getElementById("gameButtonsContainer");
        show(gameButtonsContainer);

        // show applicable
        toShow.forEach(buttonName => {
            show(gameButtonsContainer
                .querySelector("." + buttonName));
        })

        // hide non-applicable
        toHide.forEach(buttonName => {
            hide(gameButtonsContainer
                .querySelector("." + buttonName));
        })
    }

    updateDealerHand() {
        removeChildren("dealerHandContainer");

        var dealerHandContainer = document.getElementById("dealerHandContainer");
        var row = this.dealerHand.createElement();
        var table = document.createElement("table");
        table.className += " centerContent";
        table.appendChild(row);

        // fix spacing issue should the dealer require >1 row of cards
        if (row.childNodes.length > 1)
            document.getElementById("gameContainer").style.display = "grid";
        else
            document.getElementById("gameContainer").style.display = "";

        dealerHandContainer.appendChild(table);
    }

    updatePlayerHands() {

        var currRow =

            removeChildren("playerHandsContainer");

        var playerHandsContainer = document.getElementById("playerHandsContainer");
        var table = document.createElement("table");

        var i = 0;
        this.playerHands.forEach(playerHand => {
            var rows = playerHand.createElement();
            if (i == this.playerHandIndex) {
                rows.className += " currentHand";
                // set buttons
                currRow = rows;
            }

            if (playerHand.won)
                rows.className += " win";
            else if (playerHand.lost)
                rows.className += " loss";

            table.appendChild(rows);

            var breaker = document.createElement("br");
            table.appendChild(breaker);
            i++;
        });

        playerHandsContainer.appendChild(table);

        if (currRow) {
            var top = Math.round(currRow.getBoundingClientRect().top);
            document.getElementById("gameButtonsContainer").style.top = top + "px";
        }

    }

    playOutDealer() {
        var addCardInterval;
        delayOneSecond();
        this.dealerHand.flipCard();
        this.dealerHand.showSum = true;
        this.updateDealerHand();

        // keep playing cards until
        // dealer is done
        var addCard = () => {

            if (this.dealerHand.isHandOver()) {
                clearInterval(addCardInterval);

                this.endRound();
            }
            else {
                this.addDealerCard(false);
                this.updateDealerHand();
            }
        }

        addCardInterval = setInterval(addCard, 1000);
    }

    hit() {
        var card = this.nextCard();
        this.playerHands[this.playerHandIndex].hit(card);

        this.checkStatus();
    }

    double() {
        var card = this.nextCard();
        this.playerHands[this.playerHandIndex].double(card);

        this.checkStatus();
    }

    stand() {

        this.playerHands[this.playerHandIndex].stand();
        this.updatePlayerHands();

        this.checkStatus();
    }

    // will remove a card from the current hand,
    // move it to a new hand, 
    // and give a new card each
    split() {
        var card = this.playerHands[this.playerHandIndex].removeCard();
        var bet = this.playerHands[this.playerHandIndex].bet;

        var splitHand = new PlayerHand(bet);
        splitHand.takeCard(card);
        this.playerHands.push(splitHand);


        this.playerHands[this.playerHandIndex].takeCard(this.nextCard());
        splitHand.takeCard(this.nextCard());

        this.updatePlayerHands();
        this.checkStatus();

    }

    endRound() {
        this.roundDelta = 0;
        this.playerHands.forEach(playerHand => {
            if (playerHand.sum == this.dealerHand.sum) return;

            var lost = false;
            var won = false;

            lost |= playerHand.isBusted;
            lost |= !this.dealerHand.isBusted && playerHand.sum < this.dealerHand.sum;

            won |= !this.dealerHand.isBusted && playerHand.sum > this.dealerHand.sum;
            won |= this.dealerHand.isBusted && !playerHand.isBusted;

            // blackjack
            if (playerHand.isDoubled)
                playerHand.bet *= 2;
            if (playerHand.sum == 21 && playerHand.cards.length == 2 && won)
                playerHand.bet = Math.round(playerHand.bet * 1.5);

            this.roundDelta += (lost) * (-1) * playerHand.bet;
            this.roundDelta += (won) * playerHand.bet;

            if (won)
                playerHand.won = true;
            else if (lost)
                playerHand.lost = true;

            this.updatePlayerHands();


        });
        document.game.endRound();
    }

    checkStatus() {
        if (this.playerHands[this.playerHandIndex].isHandOver()) {

            this.playerHandIndex++;

            // if hand is 21, pass on to next hand
            while (this.playerHandIndex < this.playerHands.length && this.playerHands[this.playerHandIndex].isHandOver())
                this.playerHandIndex++;
        }

        if (this.playerHandIndex == this.playerHands.length) {
            hide(document.getElementById("gameButtonsContainer"));
            this.playOutDealer();
        }
        else {
            this.updatePage();
        }



    }
}

class Game {
    constructor() {
        this.currentRound = null;
        this.pastRounds = [];
        this.chips = 100;
        this.bet = 1;
    }

    newRound() {
        this.currentRound = new Round(this.bet);
        this.updatePage();
    }

    updatePage() {
        this.currentRound.updatePage();
    }

    changeBet(change) {
        var newBet = this.bet + change;
        if (newBet > 0 && newBet <= this.chips) {
            this.bet = newBet;
            document.getElementById("bet").innerText = "Total: " + newBet;
        }
    }
    changeChips(delta) {
        this.chips = this.chips + delta;
        document.getElementById("chips").innerText = "Chips: " + this.chips;

    }
    endRound() {
        this.changeChips(this.currentRound.roundDelta);
        hide(document.getElementById("gameButtonsContainer"));
    }

}

function hit() {
    document.game.currentRound.hit();
}

function double() {
    document.game.currentRound.double();
}

function stand() {
    document.game.currentRound.stand();
}

function split() {
    document.game.currentRound.split();
}

function changeBet(inc) {
    document.game.changeBet(inc);
}

function newGame() {
    document.game.newRound();
}