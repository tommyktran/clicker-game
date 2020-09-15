let clickNumber = 0.0; // The current "score"
let clickStrength = 1; // How much the counter is incremented by when the player clicks the button.
let autoClickStrength = 0.01; // Automatic clicks per second

var store = [];

/* This item factory class is used for all the items in the store. It automatically assigns stats
and gives the functions that allow the item to check when it has been unlocked or not, etc*/
class Item {
    constructor(cost, itemClickStrength, id, inv=0, itemManualClickStrength=0) {
        this.cost = cost;
        this.itemClickStrength = itemClickStrength; // How much it increases the autoclicks by
        this.id = id; // The html id of the item
        this.buyId = "buy-" + id; // The id of the "buy" button for the item

        this.itemManualClickStrength = itemManualClickStrength;
        //for items that affect manual clicks. is 0 by default
        
        this.inv = inv; // How much of it you have. is 0 by default
        
        this.isUnlocked = false;
    }

    // Checks if the player has enough clicks to unlock the item. If true, then it's revealed
    checkUnlock() {
        if (clickNumber >= this.cost && this.isUnlocked == false) {
            this.isUnlocked = true;
            document.getElementById(this.id).className += " reveal";
        }
    }

    // Checks if the player can buy the item, to make the button gray when it can't be bought
    checkCanBuy() {
        if (clickNumber >= this.cost && !(document.getElementById(this.buyId).classList.contains("canbuy"))) {
            document.getElementById(this.buyId).classList.toggle("canbuy");
        } else if (clickNumber < this.cost &&  document.getElementById(this.buyId).classList.contains("canbuy")) {
            document.getElementById(this.buyId).classList.toggle("canbuy");
        }
    }

    // Buys the item by subtracting the clicks from the player and giving the necessary stats
    buy() {
        if (clickNumber >= this.cost) {
            clickNumber = truncate(clickNumber-this.cost);
            this.inv += 1;
            document.getElementById("inv-" + this.id).innerHTML = this.inv;
            if (this.itemManualClickStrength != 0) {
                clickStrength *= this.itemManualClickStrength;                
            }
            autoClickStrength += this.itemClickStrength;
            this.cost *= 2;
            
            document.getElementById("cost-" + this.id).innerHTML = this.cost;
            display();
        }
    }
}

// Does miscellaneous things for when an item is made, like putting it in Store[].
function doItemStuff(itemObject) {
    store.push(itemObject);
    document.getElementById(itemObject.buyId).addEventListener("click", function() {itemObject.buy();});
}

/* I would like to be able to create the item object and do the item stuff all in one move,
but I wasn't able to figure it out. */
upgradeClick = new Item(20, 0, "upgrade-click", 1, 2);
doItemStuff(upgradeClick);

autoClicker = new Item(10, .1, "auto-clicker");
doItemStuff(autoClicker);

superClicker = new Item(100, 1, "super-clicker");
doItemStuff(superClicker);

megaClicker = new Item(500, 4.7, "mega-clicker");
doItemStuff(megaClicker);

gigaClicker = new Item(2000, 22.9, "giga-clicker");
doItemStuff(gigaClicker);

ultraClicker = new Item(10000, 103.6, "ultra-clicker");
doItemStuff(ultraClicker);

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
    for (x in store) {
        store[x].checkUnlock();
        store[x].checkCanBuy();
    }
}

window.setInterval(function(){autoClick()}, 100);