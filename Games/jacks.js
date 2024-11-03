var game = {
    "balance": 10000
}
var deck = [];
var Hand1 = [];

const winningsDiv = document.getElementById("winningsDiv")
const winningText = document.getElementById("winningsText")
const profitText = document.getElementById("profitsText")

var maxBet;
const minBet = 0;
const ascendBetValue = 100;
const descendBetValue = 100;

var betamount = document.querySelector("#betSum").value;

document.querySelectorAll("img").forEach(image => {image.draggable = false;});

if (localStorage.getItem("128") && localStorage.getItem("127")) {
    const savedSeed = localStorage.getItem("128");
    const savedBalance = localStorage.getItem("127");
    game.balance = savedBalance / random(savedSeed);

    // Update balance text
    maxBet = game.balance;
    document.querySelector("#betSum").placeholder = `Max bet: $${maxBet}...`
    document.querySelector("h3").innerText = "Balance: " + "$" + game.balance;
} else {
    game.balance = 10000;

    maxBet = game.balance;
    document.querySelector("#betSum").placeholder = `Max bet: $${maxBet}...`
    document.querySelector("h3").innerText = "Balance: " + "$" + game.balance;
}

function random(seed) {
    var m = 2 ** 35 - 31;
    var a = 185852;
    var s = seed % m;
    return (s = (s * a) % m) / m;
}

function saveBalance() {
    const currentSeed = Math.floor(Math.random()*4194304);
        localStorage.setItem("128", currentSeed);
        var encryptedBalance = game.balance * random(currentSeed);
        localStorage.setItem("127", encryptedBalance);
}

function checkForm(){
    betamount = document.querySelector("#betSum").value;
    const form =  document.querySelector("form");
    if (form.checkValidity() && betamount <= game.balance && betamount > 0 && betamount <= maxBet) {
        game.balance -= betamount
        document.querySelector("h3").innerText = "Balance: $" + game.balance
        document.querySelector("button.play").classList.add("none")
        document.querySelector("input").disabled = true
        play(); 

    } else {
        form.reportValidity();
        console.error("The desired value is not allowed")
    }
}

const betMaxBtn = document.querySelector("#betMax");
betMaxBtn.addEventListener("click", function() {
    if (game.balance >= maxBet) {
        betamount = maxBet;
    } else {
        betamount = game.balance;
    }
    document.querySelector("#betSum").value = betamount;
})

const betButton = document.querySelector(".play")
betButton.addEventListener("click", function() {
    checkForm();
});

var soundToggleVar = true;
const soundToggleSound = new Audio("../resources/sounds/soundSwitch.mp3");
const soundIcon = document.querySelector(".soundIcon");
soundIcon.addEventListener("click", soundToggle);
function soundToggle() {
    soundToggleSound.play();
    soundToggleVar = !soundToggleVar;
    if (soundToggleVar) {
        soundIcon.src = "../resources/soundon.svg"
    } else {
        soundIcon.src = "../resources/soundoff.svg"
    }
}

// For adding ascendBetValue to the betamount
const betUp = document.querySelector(".betUp");
betUp.addEventListener("click", function() {
    let betamount = parseInt(document.querySelector("#betSum").value);
    if (isNaN(betamount)) {
        betamount = 0;
    }

    if (betamount + ascendBetValue <= maxBet) {
        betamount += ascendBetValue;
        document.querySelector("#betSum").value = betamount;
    } else {
        betamount = maxBet;
        document.querySelector("#betSum").value = betamount;
    }
});

// For taking decendBetValue from the betamount
const betDown = document.querySelector(".betDown");
betDown.addEventListener("click", function() {
    let betamount = parseInt(document.querySelector("#betSum").value);
    if (isNaN(betamount)) {
        document.querySelector("#betSum").value = 0;
    }
    if (!isNaN(betamount)) {
        if (betamount - ascendBetValue >= minBet) {
            betamount -= ascendBetValue;
            document.querySelector("#betSum").value = betamount;
        } else {
            betamount = 0;
        }
    }
});

function flush(suitArr) {
    return suitArr.every(suit => suit === suitArr[0]);
}

function fourOfKind(intArr){
    for (let i = 0; i < intArr.length - 3; i++){
        if(intArr[i] === intArr[i+1] && intArr[i] === intArr[i+2] && intArr[i] === intArr[i+3]){
                return true 
        }
    }
}

function fullHouse(intArr) {
    
    let a = 0;
    let b = 0;

    for (let i = 0; i < intArr.length - 2; i++){
        if(intArr[i] === intArr[i+1] && intArr[i] === intArr[i+2]){
                b = 1
        }
    }
    
    for (let i = 0; i < intArr.length - 1; i++){
        if(intArr[i] === intArr[i+1]  && intArr != b){ // rart
                a = 1
        }
    }

    if (a == 1 && b == 1){
        return true
    }
}

function twoPair(intArr) {

    let a;
    let aPair;
    let b;
    let bPair;

    for (let i = 0; i < intArr.length - 1; i++){
        if(intArr[i] === intArr[i+1]){
            a = intArr[i]
            aPair = true;
        }
    }

    for (let i = intArr.length ; i > 0 ; i--){
        if(intArr[i] === intArr[i-1]){
            b = intArr[i]
            bPair = true;
        }
    }

    if (aPair === true && bPair === true && a !== b) {
        return true
    }
    
}

function threeOfKind(intArr){
    for (let i = 0; i < intArr.length - 2; i++){
        if(intArr[i] === intArr[i+1] && intArr[i] === intArr[i+2]){
                return true
        }
    }
}

function pair(intArr){
    for (let i = 0; i < intArr.length - 1; i++){
        if(intArr[i] === intArr[i+1]){
            if (intArr[i] > 10 || intArr[i] == 1){
                return true
            } else if (intArr[i] < 11){
                return false
            }
        }
    }
}

function straight(intArr){
    for (let i = 0; i < intArr.length - 1; i++){
        if (intArr[0] === intArr[1] - 1 && intArr[0] === intArr[2] - 2 && intArr[0] === intArr[3] - 3 && intArr[0] === intArr[4] - 4){
            return true
        }
    }
}

function Royal(intArr){
    return intArr.every(int => int > 9 || int === 1);

}

function detectHand(hand) {
    const intArr = [];
    const suitArr = [];

    for (let i = 0; i < 5; i++) {
        intArr.push(hand[i][2]);
        suitArr.push(hand[i][1]);
    }
    
    intArr.sort((a, b) => a - b);
    const caChing = new Audio("../resources/sounds/ca-ching.mp3");
    if (Royal(intArr) && flush(suitArr)) {
        if (soundToggleVar) {
            const royalFlush = new Audio("../resources/sounds/royal-flush.mp3");
            caChing.play();
            setTimeout(royalFlush.play(), 1000);
        }
        return { winningHand: "Royal flush", multiplier: 400 };
    }
    if (flush(suitArr) && straight(intArr)) {
        if (soundToggleVar) {
            const straightFlush = new Audio("../resources/sounds/straight-flush.mp3");
            caChing.play();
            setTimeout(straightFlush.play(), 1000);
        }
        return { winningHand: "Straight flush", multiplier: 50 };
    }
    if (fourOfKind(intArr)) {
        if (soundToggleVar) {
            const fourOfAKind = new Audio("../resources/sounds/royal-four-of-a-kind.mp3");
            caChing.play();
            setTimeout(fourOfAKind.play(), 1000);
        }
        return { winningHand: "Four of a kind", multiplier: 25 };
    }
    if (threeOfKind(intArr)) {
        if (soundToggleVar) {
            const threeOfAKind = new Audio("../resources/sounds/three-of-a-kind.mp3");
            caChing.play();
            setTimeout(threeOfAKind.play(), 1000);
        }
        return { winningHand: "Three of a kind", multiplier: 3 };
    }
    if (fullHouse(intArr)) {
        if (soundToggleVar) {
            const fullHouse = new Audio("../resources/sounds/full-house.mp3");
            caChing.play();
            setTimeout(fullHouse.play(), 1000);
        }
        return { winningHand: "Full house", multiplier: 9 };
    }
    if (flush(suitArr)) {
        if (soundToggleVar) {
            const flush = new Audio("../resources/sounds/flush.mp3");
            caChing.play();
            setTimeout(flush.play(), 1000);
        }
        return { winningHand: "Flush", multiplier: 6 };
    }
    if (straight(intArr)) {
        if (soundToggleVar) {
            const straight = new Audio("../resources/sounds/straight.mp3");
            caChing.play();
            setTimeout(straight.play(), 1000);
        }
        return { winningHand: "Straight", multiplier: 4 };
    }
    if (twoPair(intArr)) {
        if (soundToggleVar) {
            const twoPair = new Audio("../resources/sounds/two-pair.mp3");
            caChing.play();
            setTimeout(twoPair.play(), 1000);
        }
        return { winningHand: "Two pair", multiplier: 2 };
    }
    if (pair(intArr)) {
        if (soundToggleVar) {
            const pair = new Audio("../resources/sounds/pair.mp3");
            caChing.play();
            setTimeout(pair.play(), 1000);
        }
        return { winningHand: "Pair", multiplier: 1 };
    }
    if (pair(intArr) === false) {
        if (soundToggleVar) {
            const pairUnderJacks = new Audio("../resources/sounds/pair-under-jacks.mp3");
            pairUnderJacks.play();
        }
        return { winningHand: "Pair under jacks", multiplier: 0 };
    }
    
    if (soundToggleVar) {
        const highCard = new Audio("../resources/sounds/high-card.mp3");
        highCard.play();
    }
    return { winningHand: "High card", multiplier: 0 };
}

function identify(IdentifyCard) {
    let suit = "";
    let integer = 0;

    if (IdentifyCard.includes("S")) suit = "Spades";
    else if (IdentifyCard.includes("C")) suit = "Clubs";
    else if (IdentifyCard.includes("D")) suit = "Diamonds";
    else if (IdentifyCard.includes("H")) suit = "Hearts";

    integer = parseInt(IdentifyCard.replace(/[^\d]/g, ""));

    return { suit, integer };
}
function refreshDeck() {
    deck = [];
    for (let i = 1; i < 14; i++) {
        deck.push(i + "S", i + "C", i + "D", i + "H");
    }
    return deck;
}

document.querySelectorAll(".image").forEach((image) => {
    image.addEventListener("click", function() {
        image.classList.toggle("selected");
    });
});

function play() {
    deck = refreshDeck();
    Hand1 = [];
    let images = document.querySelectorAll(".image");

    images.forEach(image => {image.classList.remove("selected")});

    document.querySelector("button.round2").classList.remove("none")
    document.querySelector("input").disabled = true
    document.querySelector("button.play").classList.add("none")
    document.getElementById("winningsDiv").classList.add("none")

    for (let i = 0; i < 5; i++) {
        let randomCard = deck[Math.floor(Math.random() * deck.length)];
        let { suit, integer } = identify(randomCard);
        deck.splice(deck.indexOf(randomCard), 1);
        Hand1.push([randomCard, suit, integer]);
    }
 
        displayCards(Hand1)

    
    function displayCards(Handddd) {
        for (let i = 0; i < 5; i++)  {
            let cardElement = document.getElementById(`card${i+1}`)
            cardElement.src = "";
            cardElement.src = `../resources/cards_png/${Handddd[i][0]}.png`;
        }
    }



    if (!document.querySelector("button.round2").classList.contains("listener-added")) {
        document.querySelector("button.round2").addEventListener("click", function() {
            round2();
        });
        document.querySelector("button.round2").classList.add("listener-added");
    }


    function round2() {

        game.balance = Math.floor(game.balance);

        let Hand2 = Hand1;
    
        for (let i = 0; i < 5; i++) {
            const imageElement = document.getElementById(`card${i + 1}`);
            if (!imageElement.classList.contains("selected")) {
                let randomCard = deck[Math.floor(Math.random() * deck.length)];
                let { suit, integer } = identify(randomCard);
                deck.splice(deck.indexOf(randomCard), 1);
                Hand2[i] = [randomCard, suit, integer];
            }
        }

        displayCards(Hand2)

        images.forEach(image => image.classList.remove("selected"));
        finish();

        function finish(){
        document.querySelector("button.round2").classList.add("none")
        

        let { winningHand, multiplier  } = detectHand(Hand2)
        const betamount = document.querySelector("#betSum").value

        game.balance += betamount*multiplier
        maxBet = game.balance;

        document.querySelector("#betSum").placeholder = `Max bet: $${maxBet}...`
        document.querySelector("h3").innerText = "Balance: " + "$" + game.balance;

        saveBalance()
    
        document.getElementById("winningsDiv").classList.remove("none")
        winningText.innerText = `You got ${winningHand} ${multiplier}x`
        profitText.innerText = `You won ${betamount*multiplier}$`
    
        document.querySelector("button.play").classList.remove("none")
        document.querySelector("input").disabled = false

        }
    }

}