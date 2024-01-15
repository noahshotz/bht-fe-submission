document.addEventListener('DOMContentLoaded', function () {
    var startGameButton = document.getElementById('startgame');
    var betInput = document.getElementById('bet');

    startGameButton.addEventListener('click', function () {
        startgame(betInput.value);
    });

    function startgame(bet) {
        if (bet < 1) {
            console.log("Your bet of " + (bet || 0) + " is too low. Minimum bet is 1 coin!");
            return;
        }

        // Step 1: Reset each grid item
        const originalGridItems = document.querySelectorAll('.grid-item');
        originalGridItems.forEach(gridItem => {
            resetGridItem(gridItem);
        });

        const gridItems = document.querySelectorAll('.grid-item');
        let foundMoney = 0;
        let mineCount = 0;
        let moneyCount = 0;

        gridItems.forEach((gridItem, index) => {

            gridItem.dataset.clicked = false; // Track whether the item has been clicked
            const randomNum = Math.random();
            if (randomNum <= 0.2) {
                gridItem.classList.add('mine');
                mineCount++;
            } else {
                gridItem.classList.add('money');
                moneyCount++;
            }

            gridItem.addEventListener('click', function handleClick() {
                if (gridItem.dataset.clicked === "true") return; // Prevent multiple clicks
                gridItem.dataset.clicked = true;

                if (gridItem.classList.contains('mine')) {
                    processMineClick(gridItem);
                } else if (gridItem.classList.contains('money')) {
                    processMoneyClick(gridItem);
                }
            });
        });

        function processMineClick(gridItem) {
            gridItem.classList.add('mine-clicked');
            gridItem.querySelector("h2").innerHTML = "💣";
            console.log("Game over, player lost " + bet + " coins!");
            endGame();
        }

        function processMoneyClick(gridItem) {
            gridItem.classList.add('money-clicked');
            gridItem.querySelector("h2").innerHTML = "💰";
            foundMoney++;
            console.log("Found money: " + foundMoney + "/" + moneyCount);
            if (foundMoney === moneyCount) {
                console.log("Player won " + (bet * 2) + " coins!");
                endGame();
            }
        }

        function endGame() {
            gridItems.forEach(gridItem => {
                gridItem.classList.add(foundMoney === moneyCount ? 'win' : 'game-over');
                gridItem.querySelector("h2").innerHTML = gridItem.classList.contains('mine') ? "💣" : "💰";
                gridItem.dataset.clicked = true;
            });
        }

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

