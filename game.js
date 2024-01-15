document.addEventListener('DOMContentLoaded', function () {

    // get start button
    var startGameButton = document.getElementById('startgame');

    var betInput = document.getElementById('bet');

    // attach event listener on start button
    startGameButton.addEventListener('click', function () {
        // run game
        startgame(betInput.value);
    });

    function startgame(bet) {

        // confirm minimum bet amount
        if (bet < 1) {
            console.log("Your bet of " + (bet || 0) + " is too low. Minimum bet is 1 coin!")
        } else {

            // loop through all elements with class .grid-item in container .game-grid-container
            const gridItems = document.querySelectorAll('.grid-item');

            // track found entities
            let foundMoney = 0;
            let mineCount = 0;
            let moneyCount = 0;

            gridItems.forEach(gridItem => {

                /**
                 * Clean up the game from possible previous session
                 */
                gridItem.classList.remove('grid-item-active');
                gridItem.classList.remove('money');
                gridItem.classList.remove('money-clicked');
                gridItem.classList.remove('mine');
                gridItem.classList.remove('mine-clicked');
                gridItem.classList.remove('game-over');
                gridItem.classList.remove('win');
                gridItem.querySelector("h2").innerHTML = "";

                /**
                 * Intialize game
                 */
                // visually activate all fields
                gridItem.classList.add('grid-item-active');

                // randomly add class .mine or .money to each element and keep track of how many mines and money are on the board using variables mineCount and moneyCount
                const randomNum = Math.random();
                if (randomNum <= 0.2) {
                    gridItem.classList.add('mine');
                    mineCount++;
                } else if (randomNum > 0.2) {
                    gridItem.classList.add('money');
                    moneyCount++;
                }

                console.log("Added mines: " + mineCount);
                console.log("Added money: " + moneyCount);

                /**
                 * Process game state
                 */
                gridItem.addEventListener('click', function () {
                    // if element has class .mine, add class .mine-clicked and remove event listener from all elements to end game
                    if (gridItem.classList.contains('mine')) {
                        gridItem.classList.add('mine-clicked');
                        gridItem.querySelector("h2").innerHTML = "💣";
                        console.log("Game over, player lost " + bet + " coins!");
                        gridItems.forEach(gridItem => {
                            gridItem.classList.add("game-over");
                            if (gridItem.classList.contains('mine')) {
                                gridItem.querySelector("h2").innerHTML = "💣";
                            } else {
                                gridItem.querySelector("h2").innerHTML = "💰";
                            }
                            foundMoney = 0;
                            gridItem.removeEventListener('click', function () { });
                        });

                        // if element has class .money, add class .money-clicked, increment foundMoney variable, and remove event listener from element
                    } else if (gridItem.classList.contains('money')) {
                        gridItem.classList.add('money-clicked');
                        gridItem.querySelector("h2").innerHTML = "💰";
                        foundMoney++;
                        console.log("Found money: " + foundMoney + "/" + moneyCount);
                        gridItem.removeEventListener('click', function () { });
                    }

                    /**
                     * Win case
                     * if foundMoney equals moneyCount, add class .win to all elements to end game
                     */
                    if (foundMoney === moneyCount) {
                        gridItems.forEach(gridItem => {
                            gridItem.classList.add('win');
                            console.log("Player won " + (bet * 2) + " coins!");
                            if (gridItem.classList.contains('mine')) {
                                gridItem.querySelector("h2").innerHTML = "💣";
                            } else {
                                gridItem.querySelector("h2").innerHTML = "💰";
                            }
                            foundMoney = 0;
                            gridItem.removeEventListener('click', function () { });
                        });
                    }
                });
            });
        }
    }
});