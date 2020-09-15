let clickNumber = 0.0; // The current "score"
let clickStrength = 1; // How much the counter is incremented by when the player clicks the button.
let autoClickStrength = 0.01; // Automatic clicks per second

var upgradeClick = {
    level : 1,
    cost : 20,
    id : "buy-upgrade-click"
}

var autoClicker = {
    inv : 0,
    cost : 10,
    id: "buy-auto-clicker"
}

var superClicker = {
    inv : 0,
    cost : 100,
    id: "buy-super-clicker"
}

var store = [upgradeClick, autoClicker, superClicker];


// Setting the unlocked content at the beginning of the game.
let isUpgradeClickUnlocked = false;
let isAutoClickerUnlocked = false;
let isSuperClickerUnlocked = false;


/* This is in here to round the clickNumber and avoid the weird Javascript
decimal rounding stuff that Javascript does... */
function truncate (num) {
    return Math.trunc(num * Math.pow(10, 1)) / Math.pow(10, 1);
}

document.getElementById("clickButton").addEventListener("click", click);
// Increments the click counter when the button is clicked. 
function click() {
    clickNumber += clickStrength;
    clickNumber = truncate(clickNumber);
    display();
}
// Increments the click counter by the number of autoclickers.    
function autoClick() {
    clickNumber += autoClickStrength;
    clickNumber = truncate(clickNumber);
    display();
}

// Displays the clickNumber to the html.
function display() {
    // Checks if the number is an integer to append .0 to it, so 
    // integers are displayed like 15.0 instead of 15. Also checks
    // if the clickstrength as been changed, to avoid showing 0.0
    // at the start instead of 0
    if (Number.isInteger(clickNumber) && autoClickStrength > 0.01) {
        document.getElementById("number").innerHTML = clickNumber + ".0";
    }
    else {
        document.getElementById("number").innerHTML = clickNumber;
    }
    unlockCheck();
    buyCheck();
}

// Checks for unlocked content.
function unlockCheck() {
    if (clickNumber >= 10 && isAutoClickerUnlocked == false) {
        isAutoClickerUnlocked = true;
        document.getElementById("auto-clicker").className += " reveal";
    } 
    if (clickNumber >= 20 && isUpgradeClickUnlocked == false) {
        isUpgradeClickUnlocked = true;
        document.getElementById("upgrade-click").className += " reveal";
    }
    if (clickNumber >= 100 && isSuperClickerUnlocked == false) {
        isSuperClickerUnlocked = true;
        document.getElementById("super-clicker").className += " reveal";
    }
}

// Checks if the player has enough clicks to buy an item in the shop.
// if true, then displays it with a dark color. If not, then displays a lighter
// color. Very janky I know, but it's the best I've got.
function buyCheck() {
    for (x in store) {
        // If the player have enough clicks and the element does not yet have the canbuy class, then it adds it.
        // Here it uses the index of the for loop, plugged into the array to get the id of the item.
        if (clickNumber >= store[x].cost && !(document.getElementById(store[x].id).classList.contains("canbuy"))) {
            document.getElementById(store[x].id).className += " canbuy";
        } 
        // If the player doesn't have enough cilcks and the item has the canbuy class, then it removes it.
        else if (clickNumber < store[x].cost && document.getElementById(store[x].id).classList.contains("canbuy")) {
            document.getElementById(store[x].id).className =
              document.getElementById(store[x].id).className.replace
              ( /(?:^|\s)canbuy(?!\S)/g , '' )
        }
    }
}

document.getElementById("buy-upgrade-click").addEventListener("click", buyUpgradeClick);
function buyUpgradeClick() {
    if (clickNumber >= upgradeClick.cost) {
        clickNumber = truncate(clickNumber-upgradeClick.cost);
        upgradeClick.level += 1;
        document.getElementById("current-click-level").innerHTML = upgradeClick.level;
        clickStrength *= 2;
        upgradeClick.cost *= 3;
        document.getElementById("cost-upgrade-click").innerHTML = upgradeClick.cost;
        display();
    }
}

document.getElementById("buy-auto-clicker").addEventListener("click", buyAutoClicker);
function buyAutoClicker() {
    if (clickNumber >= autoClicker.cost) {
        clickNumber = truncate(clickNumber-autoClicker.cost);
        autoClicker.inv += 1;
        document.getElementById("inv-auto-clicker").innerHTML = autoClicker.inv;
        autoClickStrength += .1 ;
        autoClicker.cost *= 2;
        document.getElementById("cost-auto-clicker").innerHTML = autoClicker.cost;
        display();
    }
}

document.getElementById("buy-super-clicker").addEventListener("click", buySuperClicker);
function buySuperClicker() {
    if (clickNumber >= autoClicker.cost) {
        clickNumber = truncate(clickNumber-autoClicker.cost);
        superClicker.inv += 1;
        document.getElementById("inv-super-clicker").innerHTML = superClicker.inv;
        autoClickStrength += 1 ;
        superClicker.cost *= 2;
        document.getElementById("cost-super-clicker").innerHTML = superClicker.cost;
        display();
    }
}

window.setInterval(function(){autoClick()}, 100);

