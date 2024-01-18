(function game() {
    "use strict";

    /**
     * Get required data input
     */

    // get `start game` button
    let startGameButton = document.getElementById('startgame');
    // get `bet amount`
    let betInput = document.getElementById('bet');
    // get `player balance``
    let balance = document.getElementById('balance');

    /**
     * Start game process event listener
     */
    startGameButton.addEventListener('click', function () {
        startgame(Number(betInput.value), Number(balance.textContent));
    });

    /**
     * Game logic
     */
    function startgame(bet, balance) {
        // validate bet size
        if (bet < 1) {
            console.log("Your bet of " + (bet || 0) + " is too low. Minimum bet is 1 coin!");
            return;
        }

        // validate player balance
        if (bet > balance) {
            console.log("Insufficient balance!");
            return;
        }

        // update player balance
        balance -= bet;
        document.getElementById('balance').textContent = balance;

        // reset each grid item in case of previous game
        const originalGridItems = document.querySelectorAll('.grid-item');
        originalGridItems.forEach(gridItem => {
            resetGridItem(gridItem);
        });

        /**
         * Initialize variables to keep track of game state
         */
        const gridItems = document.querySelectorAll('.grid-item');
        let foundMoney = 0;
        let mineCount = 0;
        let moneyCount = 0;

        // Place the first mine randomly
        const firstMineIndex = Math.floor(Math.random() * gridItems.length);
        gridItems[firstMineIndex].classList.add('mine');
        mineCount++;

        // Iterate over each grid item
        gridItems.forEach((gridItem, index) => {
            // Track whether the item has been clicked
            gridItem.dataset.clicked = false;

            // Skip the first mine placement
            if (index !== firstMineIndex) {
                // Initialize game field (adjust odds for placing mines and money)
                const randomNum = Math.random();
                if (randomNum < 0.1) { // Reduced chance for additional mines
                    gridItem.classList.add('mine');
                    mineCount++;
                } else {
                    gridItem.classList.add('money');
                    moneyCount++;
                }
            }

            // set stats to initial state
            document.getElementById('moneyfoundindicator').textContent = foundMoney + "/" + moneyCount;
            document.getElementById('minecountindicator').textContent = mineCount;

            // calculate initial mine risk
            let mineRisk = (mineCount / gridItems.length) * 100;
            document.getElementById('mineriskindicator').textContent = mineRisk.toFixed(2) + "%";

            // Event listener for clicks
            gridItem.addEventListener('click', function handleClick() {
                // Validate that cell has not been clicked yet
                if (gridItem.dataset.clicked === "true") return;
                gridItem.dataset.clicked = true;

                // Assert item and process click
                if (gridItem.classList.contains('mine')) {
                    processMineClick(gridItem);
                } else if (gridItem.classList.contains('money')) {
                    processMoneyClick(gridItem);
                }

                // continously calculate mine risk by dividing the number of mines by the number of remaining cells
                mineRisk = (mineCount / (gridItems.length - foundMoney)) * 100;
                document.getElementById('mineriskindicator').textContent = mineRisk.toFixed(2) + "%";
            });
        });


        /**
         * Player hit mine
        */
        function processMineClick(gridItem) {
            gridItem.classList.add('mine-clicked');
            gridItem.querySelector("h2").innerHTML = "💣";
            console.log("Game over, player lost " + bet + " coins!");
            endGame();
        }

        /**
         * Player found money
         */
        function processMoneyClick(gridItem) {
            gridItem.classList.add('money-clicked');
            gridItem.querySelector("h2").innerHTML = "💰";
            foundMoney++;
            document.getElementById('moneyfoundindicator').textContent = foundMoney + "/" + moneyCount;
            //document.getElementById('mineriskindicator').textContent = 'New Value';
            //document.getElementById('minecountindicator').textContent = 'New Value';

            console.log("Found money: " + foundMoney + "/" + moneyCount);
            if (foundMoney === moneyCount) {
                console.log("Player won " + (bet * 2) + " coins!");
                balance += (bet * 2);
                document.getElementById('balance').textContent = balance;
                endGame();
            }
        }

        /**
         * Arriving at a final state uncovers all cells and sets each of them to visited
         */
        function endGame() {
            gridItems.forEach(gridItem => {
                gridItem.classList.add(foundMoney === moneyCount ? 'win' : 'game-over');
                gridItem.querySelector("h2").innerHTML = gridItem.classList.contains('mine') ? "💣" : "💰";
                gridItem.dataset.clicked = true;
            });
        }

        /**
         * Reset game field so a new game can be played
         */
        function resetGridItem(gridItem) {
            // Clone the node, including its contents
            const newGridItem = gridItem.cloneNode(true);

            // Replace old grid item with the new one
            gridItem.parentNode.replaceChild(newGridItem, gridItem);

            // Now set the class name and inner HTML on the new grid item
            newGridItem.className = 'grid-item grid-item-active';
            newGridItem.querySelector("h2").innerHTML = "";
        }

        console.log("Added mines: " + mineCount);
        console.log("Added money: " + moneyCount);
    }
})();