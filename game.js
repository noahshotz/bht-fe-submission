document.addEventListener('DOMContentLoaded', function () {

    /**
     * Get required data input
     */

    // get `start game` button
    var startGameButton = document.getElementById('startgame');
    // get `bet amount`
    var betInput = document.getElementById('bet');
    // get `player balance``
    var balance = document.getElementById('balance');

    /**
     * Start game process
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

        gridItems.forEach((gridItem, index) => {
            // Track whether the item has been clicked
            gridItem.dataset.clicked = false;

            // Initialize game field (randomly assign money or mines to a cell)
            const randomNum = Math.random();
            if (randomNum <= 0.2) {
                gridItem.classList.add('mine');
                mineCount++;
            } else {
                gridItem.classList.add('money');
                moneyCount++;
            }

            gridItem.addEventListener('click', function handleClick() {
                // Validate that cell has not been flipped yet
                if (gridItem.dataset.clicked === "true") return;
                gridItem.dataset.clicked = true;

                // assert item
                if (gridItem.classList.contains('mine')) {
                    processMineClick(gridItem);
                } else if (gridItem.classList.contains('money')) {
                    processMoneyClick(gridItem);
                }
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
});

