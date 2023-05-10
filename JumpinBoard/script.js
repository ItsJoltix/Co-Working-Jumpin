const gameBoard = document.querySelector('.game-board');
const boxes = document.querySelectorAll('.box');
let frog;
let lelipads = [];
let occupiedBoxes = [];

// Find frog and lelipads
boxes.forEach(box => {
    if (box.classList.contains('frog')) {
        frog = box;
    } else if (box.classList.contains('leli')) {
        lelipads.push(box);
    }
});

// Initialize occupied boxes with the frog
occupiedBoxes.push(frog);

// Add event listeners to boxes
boxes.forEach(box => {
    box.addEventListener('click', () => {
        // Check if the clicked box is adjacent to the frog
        const isAdjacent = isBoxAdjacent(box);

        // Check if the clicked box is a valid move
        const isValidMove = isAdjacent && isBoxValid(box);

        if (isValidMove) {
            // Move the frog to the clicked box
            moveFrog(box);

            // Check if the player has won
            checkWin();
        }
    });
});

// Check if the clicked box is adjacent to the frog
function isBoxAdjacent(box) {
    const frogIndex = Array.from(gameBoard.children).indexOf(frog);
    const boxIndex = Array.from(gameBoard.children).indexOf(box);
    const adjacentIndexes = getAdjacentIndexes(frogIndex);

    return adjacentIndexes.includes(boxIndex);
}

// Get the indexes of boxes adjacent to the given index
function getAdjacentIndexes(index) {
    const indexes = [];

    if (index % 5 !== 0) {
        indexes.push(index - 1);
    }
    if ((index + 1) % 5 !== 0) {
        indexes.push(index + 1);
    }
    if (index >= 5) {
        indexes.push(index - 5);
    }
    if (index <= 19) {
        indexes.push(index + 5);
    }

    return indexes;
}

// Check if the clicked box is a valid move
function isBoxValid(box) {
    // Check if the box is empty or a hole
    if (box.classList.contains('leli') || box.classList.contains('frog')) {
        return false;
    }

    // Check if the box is occupied by another frog or lelipad
    if (occupiedBoxes.includes(box)) {
        const direction = getDirection(box);
        const nextBox = getNextBox(box, direction);

        // Check if there is a lelipad between the current box and the clicked box
        const lelipadIndex = getLelipadIndex(box, direction);
        if (lelipadIndex === null) {
            return false;
        }

        // Check if there is a lelipad between the frog and the clicked box
        const frogIndex = Array.from(gameBoard.children).indexOf(frog);
        const lelipadDirection = getDirection(frog, box);
        const lelipadBetween = getLelipadIndex(frog, lelipadDirection) === lelipadIndex;
        if (!lelipadBetween) {
            return false;
        }

        // Check if the next box after the lelipad is empty
        const nextBoxAfterLelipad = getNextBox(boxes[lelipadIndex], direction);
        if (
            nextBoxAfterLelipad === null ||
            !nextBoxAfterLelipad.classList.contains('box') ||
            nextBoxAfterLelipad.classList.contains('leli')
        ) {
            return false;
        }

        // Move the other frog or lelipad to the next box
        // Move the other frog or lelipad to the next box
        moveFrog(nextBoxAfterLelipad, true);
    } else if (box.classList.contains('hole')) {
        // The player wins if the frog reaches a hole
        alert('You won!');
    }

    return true;
}


// Get the index of the lelipad in the given direction from the current box
function getLelipadIndex(box, direction) {
    const boxIndex = Array.from(gameBoard.children).indexOf(box);
    let lelipadIndex = null;

    switch (direction) {
        case "up":
            for (let i = boxIndex - 5; i >= 0; i -= 5) {
                if (boxes[i].classList.contains("leli")) {
                    lelipadIndex = i;
                    break;
                }
            }
            break;
        case "right":
            for (let i = boxIndex + 1; i < 25; i++) {
                if (i % 5 === 0) {
                    break;
                }
                if (boxes[i].classList.contains("leli")) {
                    lelipadIndex = i;
                    break;
                }
            }
            break;
        case "down":
            for (let i = boxIndex + 5; i < 25; i += 5) {
                if (boxes[i].classList.contains("leli")) {
                    lelipadIndex = i;
                    break;
                }
            }
            break;
        case "left":
            for (let i = boxIndex - 1; i >= 0; i--) {
                if ((i + 1) % 5 === 0) {
                    break;
                }
                if (boxes[i].classList.contains("leli")) {
                    lelipadIndex = i;
                    break;
                }
            }
            break;
    }

    return lelipadIndex;
}


// Move the frog to the clicked box
// Move the frog to the clicked box
// Move the frog to the clicked box
function moveFrog(box, isJumping) {
    // Remove the frog from the current box
    frog.classList.remove('frog');
    occupiedBoxes.splice(occupiedBoxes.indexOf(frog), 1);

    // Add the frog to the new box
    box.classList.add('frog');
    occupiedBoxes.push(box);

    // If the frog is jumping over a lelipad, move the lelipad to the next box
    if (isJumping) {
        const direction = getDirection(frog, box);
        const lelipadIndex = getLelipadIndex(frog, direction);
        const nextBoxAfterLelipad = getNextBox(boxes[lelipadIndex], direction);
        boxes[lelipadIndex].classList.remove('leli');
        nextBoxAfterLelipad.classList.add('leli');
    }

    // Update the reference to the frog
    frog = box;
}

// Get the box that the frog would jump over if it moves to the clicked box
function getJumpedBox(box) {
    const frogIndex = Array.from(gameBoard.children).indexOf(frog);
    const boxIndex = Array.from(gameBoard.children).indexOf(box);
    const direction = getDirection(frog, box);
    let jumpedBoxIndex = null;

    switch (direction) {
        case "up":
            if (boxIndex < frogIndex) {
                jumpedBoxIndex = boxIndex + 5;
            }
            break;
        case "right":
            if (boxIndex > frogIndex) {
                jumpedBoxIndex = boxIndex - 1;
            }
            break;
        case "down":
            if (boxIndex > frogIndex) {
                jumpedBoxIndex = boxIndex - 5;
            }
            break;
        case "left":
            if (boxIndex < frogIndex) {
                jumpedBoxIndex = boxIndex + 1;
            }
            break;
    }

    if (jumpedBoxIndex !== null) {
        return boxes[jumpedBoxIndex];
    } else {
        return null;
    }
}


// Get the index of the box that the frog would jump over if it moves to the clicked box
function getJumpIndex(boxIndex, direction) {
    switch (direction) {
        case 'up':
            if (boxIndex < 10) {
                return null;
            }
            return boxIndex - 5;
        case 'right':
            if (boxIndex % 5 === 4) {
                return null;
            }
            return boxIndex + 1;
        case 'down':
            if (boxIndex > 14) {
                return null;
            }
            return boxIndex + 5;
        case 'left':
            if (boxIndex % 5 === 0) {
                return null;
            }
            return boxIndex - 1;
        default:
            return null;
    }
}


// Check if the player has won
function checkWin() {
    const isWon = lelipads.every(leli => occupiedBoxes.includes(leli));
    if (isWon) {
        setTimeout(() => {
            alert('Congratulations! You won!');
            location.reload();
        }, 100);
    }
}

// Get the direction of the other frog
function getDirection(from, to) {
    const fromIndex = Array.from(gameBoard.children).indexOf(from);
    const toIndex = Array.from(gameBoard.children).indexOf(to);
    const rowDiff = Math.floor(fromIndex / 5) - Math.floor(toIndex / 5);
    const colDiff = (fromIndex % 5) - (toIndex % 5);

    if (rowDiff === 1 && colDiff === 0) {
        return "up";
    } else if (rowDiff === -1 && colDiff === 0) {
        return "down";
    } else if (rowDiff === 0 && colDiff === 1) {
        return "left";
    } else if (rowDiff === 0 && colDiff === -1) {
        return "right";
    }
}

function getNextBox(box, direction) {
    const index = Array.from(gameBoard.children).indexOf(box);
    let nextIndex = null;

    switch (direction) {
        case 'up':
            nextIndex = index - 5;
            break;
        case 'right':
            nextIndex = index + 1;
            break;
        case 'down':
            nextIndex = index + 5;
            break;
        case 'left':
            nextIndex = index - 1;
            break;
    }

    if (nextIndex < 0 || nextIndex >= 25) {
        return null;
    }

    return boxes[nextIndex];
}



 