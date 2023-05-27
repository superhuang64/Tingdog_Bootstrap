// random image

var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomNumber2 = Math.floor(Math.random() * 6) + 1;

document.querySelectorAll("img")[0].setAttribute("src", "images/dice" + randomNumber1 + ".png");
document.querySelectorAll("img")[1].setAttribute("src", "images/dice" + randomNumber2 + ".png");

// change the title to display the winner

if (randomNumber1 > randomNumber2) {
    document.querySelector("h1").innerHTML = "🚩 Play1 wins!";
}

else if (randomNumber1 < randomNumber2) {
    document.querySelector("h1").innerHTML = "Play2 wins! 🚩";
}

else {
    document.querySelector("h1").innerHTML = "Draw!";
}
