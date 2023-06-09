import {stopTimer, startTimer} from "./stopwatch.js";
import {fetchHighscores} from "./highscorestijd.js";


/* voor start en username */
const startButton = document.getElementById("start");
const startScreen = document.getElementById("startScreen");
let name; // DIT IS DE GEBRUIKERSNAAM EN MOET IEDERE KEER WORDEN INGEGEVEN BIJ STARTEN VAN SPEL

startButton.addEventListener("click", function () {
    const nameInput = document.getElementById("name");
    name = nameInput.value;
    const errorMessage = document.querySelector('.error-message');
    // NAKIJKEN OF ER WEL EEN NAAM IS INGEVULD (kortere manier)
    if (nameInput.value === '') {
        errorMessage.classList.remove('hidden')
        errorMessage.classList.add('visible');
    } else {
        startScreen.classList.add("hidden");
        console.log('speler = ' + name);
        startTimer();
        fetchHighscores();
    }
});



const gameBoard = document.querySelector('.game-board');
const boxes = document.querySelectorAll('.box');
let frog;

let reigerHead;
let reigerTail;
let reigerDirection;

let lelipads = [];

let clickedBoxIndex;
let clickedFrogOrReiger;
let frogAmount = 0;

let currentLevel = parseInt(localStorage.getItem('currentLevel'));
if(!currentLevel){
    currentLevel = 0;
}


let gameWon = false;


fetch('./json/levels.json')
    .then(response => response.json())
    .then(data => {
        const levels = data.levels;
        // Hier wordt het level gekozen --> initeel nul dus --> dit nog misschien aanpassen zodat het level locally gestockeerd wordt
        const levelData = levels[currentLevel];
        assignClassesToBoxes(levelData);
    })
    .catch(error => {
        console.error('Error loading levels:', error);
    });

function assignClassesToBoxes(levelData) {
    const boxes = document.querySelectorAll('.box');

    levelData.holes.forEach(index => {
        boxes[index].classList.add('hole');
    });

    levelData.leli.forEach(index => {
        boxes[index].classList.add('leli');
    });

    levelData.frog.forEach(index => {
        boxes[index].classList.add('frog');
        frogAmount++;
    });

    if (levelData.reigerHead) {
        levelData.reigerHead.forEach((index, reigerIndex) => {
            boxes[index].classList.add('reigerHead');

            if (reigerIndex === 0) {
                if (levelData.reigerBottomHeadPosition1) {
                    boxes[index].classList.add('reigerBottomHeadPosition');
                } else if (levelData.reigerLeftHeadPosition1) {
                    boxes[index].classList.add('reigerLeftHeadPosition');
                } else if (levelData.reigerRightHeadPosition1) {
                    boxes[index].classList.add('reigerRightHeadPosition');
                } else if (levelData.reigerTopHeadPosition1) {
                    boxes[index].classList.add('reigerTopHeadPosition');
                }
            } else if (reigerIndex === 1) {
                if (levelData.reigerBottomHeadPosition2) {
                    boxes[index].classList.add('reigerBottomHeadPosition');
                } else if (levelData.reigerLeftHeadPosition2) {
                    boxes[index].classList.add('reigerLeftHeadPosition');
                } else if (levelData.reigerRightHeadPosition2) {
                    boxes[index].classList.add('reigerRightHeadPosition');
                } else if (levelData.reigerTopHeadPosition2) {
                    boxes[index].classList.add('reigerTopHeadPosition');
                }
            }
        });

        levelData.reigerTail.forEach((index, reigerIndex) => {
            boxes[index].classList.add('reigerTail');

            if (reigerIndex === 0) {
                if (levelData.reigerBottomTailPosition1) {
                    boxes[index].classList.add('reigerBottomTailPosition');
                } else if (levelData.reigerLeftTailPosition1) {
                    boxes[index].classList.add('reigerLeftTailPosition');
                } else if (levelData.reigerRightTailPosition1) {
                    boxes[index].classList.add('reigerRightTailPosition');
                } else if (levelData.reigerTopTailPosition1) {
                    boxes[index].classList.add('reigerTopTailPosition');
                }
            } else if (reigerIndex === 1) {
                if (levelData.reigerBottomTailPosition2) {
                    boxes[index].classList.add('reigerBottomTailPosition');
                } else if (levelData.reigerLeftTailPosition2) {
                    boxes[index].classList.add('reigerLeftTailPosition');
                } else if (levelData.reigerRightTailPosition2) {
                    boxes[index].classList.add('reigerRightTailPosition');
                } else if (levelData.reigerTopTailPosition2) {
                    boxes[index].classList.add('reigerTopTailPosition');
                }
            }
        });
    }
}

// kikkers en lelipads zoeken
boxes.forEach(box => {
    if (box.classList.contains('frog')) {
        //frog = box;
        frogAmount++;
    } else if (box.classList.contains('leli')) {
        lelipads.push(box);
    }
});


// aan de boxes de event listeners toevoegen
boxes.forEach(box => {
    box.addEventListener('click', () => {
        if (!gameWon) {
            clickedBoxIndex = Array.from(gameBoard.children).indexOf(box);


            // alle highlights verwijderen als niks is aangeduid
            if (!boxes[clickedBoxIndex].classList.contains('highlight')) {
                removeAllHighlights();

                // laatste aangeklikte characterke onthouden
                const frogOrReigerClicked = isFrogOrReigerClicked(clickedBoxIndex);
                clickedFrogOrReiger = boxes[clickedBoxIndex].className.includes('frog') ? 'frog' : boxes[clickedBoxIndex].className.includes('reiger') ? 'reiger' : '';

                frogOrReigerBoxClicked(frogOrReigerClicked, clickedFrogOrReiger);
            } else {
                if (clickedFrogOrReiger === 'frog') {
                    moveFrog();
                } else if (clickedFrogOrReiger === 'reiger') {
                    moveReiger();
                }
                removeAllHighlights();
            }

            // Nakijken of de kikkers in de holes zitten --> zoja, gewonnen :)
            checkWon();
        }
    });
});

function frogOrReigerBoxClicked(frogOrReigerClicked, clickedFrogOrReiger) {

    if (clickedFrogOrReiger === 'frog') {
        frog = clickedBoxIndex;
    } else if (clickedFrogOrReiger === 'reiger') {
        let headOrTail = findClickedHeadOrTail();

        if (headOrTail === 'Head') {
            fillHeadFindTailAndDirection();
        } else if (headOrTail === 'Tail') {
            fillTailFindHeadAndDirection();
        }
    }

    if (frogOrReigerClicked) {
        const possibleMoveablePositions = findPositionsToMoveAndHighlight();
        if (possibleMoveablePositions != null) {
            loopAndHighlight(possibleMoveablePositions);
        }
    }
}

function moveFrog() {
    boxes[frog].classList.remove('frog');
    boxes[clickedBoxIndex].classList.add('frog');
    boxes[clickedBoxIndex].classList.remove('highlight');
}

function moveReiger() {
    switch (reigerDirection) {
        case 'Left':
            boxes[reigerHead].classList.remove('reigerHead');
            boxes[reigerHead].classList.remove('reigerLeftHeadPosition');
            boxes[reigerTail].classList.remove('reigerTail');
            boxes[reigerTail].classList.remove('reigerLeftTailPosition');

            if (clickedBoxIndex < reigerHead) { // naar links bewegen
                let nearestToLeftPart = reigerHead < reigerTail ? reigerHead : reigerTail;
                boxes[reigerHead - (nearestToLeftPart - clickedBoxIndex)].classList.add('reigerHead');
                boxes[reigerHead - (nearestToLeftPart - clickedBoxIndex)].classList.add('reigerLeftHeadPosition');
                boxes[reigerTail - (nearestToLeftPart - clickedBoxIndex)].classList.add('reigerTail');
                boxes[reigerTail - (nearestToLeftPart - clickedBoxIndex)].classList.add('reigerLeftTailPosition');
            } else { // naar rechts bewegen
                let nearestToRightPart = reigerHead > reigerTail ? reigerHead : reigerTail;
                boxes[reigerHead + (clickedBoxIndex - nearestToRightPart)].classList.add('reigerHead');
                boxes[reigerHead + (clickedBoxIndex - nearestToRightPart)].classList.add('reigerLeftHeadPosition');
                boxes[reigerTail + (clickedBoxIndex - nearestToRightPart)].classList.add('reigerTail');
                boxes[reigerTail + (clickedBoxIndex - nearestToRightPart)].classList.add('reigerLeftTailPosition');
            }
            break;
        case 'Bottom':
            boxes[reigerHead].classList.remove('reigerHead');
            boxes[reigerHead].classList.remove('reigerBottomHeadPosition');
            boxes[reigerTail].classList.remove('reigerTail');
            boxes[reigerTail].classList.remove('reigerBottomTailPosition');

            if (clickedBoxIndex > reigerHead) { // naar beneden bewegen
                let nearestToBottomPart = reigerHead > reigerTail ? reigerHead : reigerTail;
                boxes[reigerHead + (clickedBoxIndex - nearestToBottomPart)].classList.add('reigerHead');
                boxes[reigerHead + (clickedBoxIndex - nearestToBottomPart)].classList.add('reigerBottomHeadPosition');
                boxes[reigerTail + (clickedBoxIndex - nearestToBottomPart)].classList.add('reigerTail');
                boxes[reigerTail + (clickedBoxIndex - nearestToBottomPart)].classList.add('reigerBottomTailPosition');
            } else { // naar boven bewegen
                let nearestToTopPart = reigerHead < reigerTail ? reigerHead : reigerTail;
                boxes[reigerHead - (nearestToTopPart - clickedBoxIndex)].classList.add('reigerHead');
                boxes[reigerHead - (nearestToTopPart - clickedBoxIndex)].classList.add('reigerBottomHeadPosition');
                boxes[reigerTail - (nearestToTopPart - clickedBoxIndex)].classList.add('reigerTail');
                boxes[reigerTail - (nearestToTopPart - clickedBoxIndex)].classList.add('reigerBottomTailPosition');
            }
            break;
        case 'Right':
            boxes[reigerHead].classList.remove('reigerHead');
            boxes[reigerHead].classList.remove('reigerRightHeadPosition');
            boxes[reigerTail].classList.remove('reigerTail');
            boxes[reigerTail].classList.remove('reigerRightTailPosition');

            if (clickedBoxIndex < reigerHead) { // naar links bewegen
                let nearestToLeftPart = reigerHead < reigerTail ? reigerHead : reigerTail;
                boxes[reigerHead - (nearestToLeftPart - clickedBoxIndex)].classList.add('reigerHead');
                boxes[reigerHead - (nearestToLeftPart - clickedBoxIndex)].classList.add('reigerRightHeadPosition');
                boxes[reigerTail - (nearestToLeftPart - clickedBoxIndex)].classList.add('reigerTail');
                boxes[reigerTail - (nearestToLeftPart - clickedBoxIndex)].classList.add('reigerRightTailPosition');
            } else { // naar rechts bewegen
                let nearestToRightPart = reigerHead > reigerTail ? reigerHead : reigerTail;
                boxes[reigerHead + (clickedBoxIndex - nearestToRightPart)].classList.add('reigerHead');
                boxes[reigerHead + (clickedBoxIndex - nearestToRightPart)].classList.add('reigerRightHeadPosition');
                boxes[reigerTail + (clickedBoxIndex - nearestToRightPart)].classList.add('reigerTail');
                boxes[reigerTail + (clickedBoxIndex - nearestToRightPart)].classList.add('reigerRightTailPosition');
            }
            break;
        case 'Top':
            boxes[reigerHead].classList.remove('reigerHead');
            boxes[reigerHead].classList.remove('reigerTopHeadPosition');
            boxes[reigerTail].classList.remove('reigerTail');
            boxes[reigerTail].classList.remove('reigerTopTailPosition');

            if (clickedBoxIndex > reigerHead) { // naar bottom bewegen
                let nearestToBottomPart = reigerHead > reigerTail ? reigerHead : reigerTail;
                boxes[reigerHead + (clickedBoxIndex - nearestToBottomPart)].classList.add('reigerHead');
                boxes[reigerHead + (clickedBoxIndex - nearestToBottomPart)].classList.add('reigerTopHeadPosition');
                boxes[reigerTail + (clickedBoxIndex - nearestToBottomPart)].classList.add('reigerTail');
                boxes[reigerTail + (clickedBoxIndex - nearestToBottomPart)].classList.add('reigerTopTailPosition');
            } else { // naar top bewegen
                let nearestToTopPart = reigerHead < reigerTail ? reigerHead : reigerTail;
                boxes[reigerHead - (nearestToTopPart - clickedBoxIndex)].classList.add('reigerHead');
                boxes[reigerHead - (nearestToTopPart - clickedBoxIndex)].classList.add('reigerTopHeadPosition');
                boxes[reigerTail - (nearestToTopPart - clickedBoxIndex)].classList.add('reigerTail');
                boxes[reigerTail - (nearestToTopPart - clickedBoxIndex)].classList.add('reigerTopTailPosition');
            }
            break;
        default:
            reigerDirection = ''; // als er iets mis ging
    }
}

function removeAllHighlights() {
    boxes.forEach(box => {
        box.classList.remove('highlight');
    });
}

// checken of speler reiger of kikker heeft aangeduid
function isFrogOrReigerClicked(boxIndex) {
    if (boxes[boxIndex].classList.contains('frog') || boxes[boxIndex].classList.contains('reigerHead') || boxes[boxIndex].classList.contains('reigerTail')) {
        return true;
    }
    return false;
}

function findPositionsToMoveAndHighlight() {
    const indexes = [];

    if (clickedFrogOrReiger === 'frog') {
        // Left mogelijke moves
        let leftIndexes = leftMovesFrog();
        if (leftIndexes.length !== 0) indexes.push(...leftIndexes);
        // Right mogelijke moves
        let rightIndexes = rightMovesFrog();
        if (rightIndexes.length !== 0) indexes.push(...rightIndexes);
        // Top mogelijke moves
        let topIndexes = topMovesFrog();
        if (topIndexes.length !== 0) indexes.push(...topIndexes);
        // Bottom mogelijke moves
        let bottomIndexes = bottomMovesFrog();
        if (bottomIndexes.length !== 0) indexes.push(...bottomIndexes);
    } else if (clickedFrogOrReiger === 'reiger') {
        if (reigerDirection === 'Left') {
            // Left mogelijke moves
            let leftIndexes = leftMovesReiger();
            if (leftIndexes.length !== 0) indexes.push(...leftIndexes);

            // Right mogelijke moves
            let rightIndexes = rightMovesReiger();
            if (rightIndexes.length !== 0) indexes.push(...rightIndexes);
        } else if (reigerDirection === 'Bottom') {
            // Top mogelijke moves
            let topIndexes = topMovesReiger();
            if (topIndexes.length !== 0) indexes.push(...topIndexes);
            // Bottom mogelijke moves
            let bottomIndexes = bottomMovesReiger();
            if (bottomIndexes.length !== 0) indexes.push(...bottomIndexes);
        } else if (reigerDirection === 'Right') {
            // Left mogelijke moves
            let leftIndexes = leftMovesReiger();
            if (leftIndexes.length !== 0) indexes.push(...leftIndexes);
            // Right mogelijke moves
            let rightIndexes = rightMovesReiger();
            if (rightIndexes.length !== 0) indexes.push(...rightIndexes);
        } else if (reigerDirection === 'Top') {
            // Top mogelijk moves
            let topIndexes = topMovesReiger();
            if (topIndexes.length !== 0) indexes.push(...topIndexes);
            // Bottom mogelijke moves
            let bottomIndexes = bottomMovesReiger();
            if (bottomIndexes.length !== 0) indexes.push(...bottomIndexes);
        }
    }

    return indexes;
}

// Mogelijke moves voor kikkers
function leftMovesFrog() {
    let indexes = [];
    if (clickedBoxIndex % 5 !== 0) {
        let leftIndices = checkIfLeftPossibleFrog(clickedBoxIndex % 5);
        if (leftIndices !== undefined && leftIndices.length !== 0) {
            indexes.push(leftIndices);
        }
    }
    return indexes;
}

function topMovesFrog() {
    let indexes = [];

    let possibleTopSteps = Math.floor(clickedBoxIndex / 5);
    if (clickedBoxIndex >= 5) {
        let topIndices = checkIfTopPossibleFrog(possibleTopSteps);
        if (topIndices !== undefined && topIndices.length !== 0) {
            indexes.push(topIndices);
        }
    }
    return indexes;
}

function rightMovesFrog() {
    let indexes = [];
    let possibleRightSteps = 5 - (clickedBoxIndex + 1) % 5;
    if ((clickedBoxIndex + 1) % 5 !== 0) {
        let rightIndices = checkIfRightPossibleFrog(possibleRightSteps);
        if (rightIndices !== undefined && rightIndices.length !== 0) {
            indexes.push(rightIndices);
        }
    }
    return indexes;
}

function bottomMovesFrog() {
    let indexes = [];
    let possibleBottomSteps = 4 - Math.floor(clickedBoxIndex / 5);
    if (clickedBoxIndex <= 19) {
        let bottomIndices = checkIfBottomPossibleFrog(possibleBottomSteps);
        if (bottomIndices !== undefined && bottomIndices.length !== 0) {
            indexes.push(bottomIndices);
        }
    }
    return indexes;
}


// Mogelijk moves voor de reigers
function leftMovesReiger() {
    let indexes = [];
    if (reigerHead < reigerTail) {
        clickedBoxIndex = reigerHead;
    } else {
        clickedBoxIndex = reigerTail;
    }
    if (clickedBoxIndex % 5 !== 0) {
        let leftIndices = checkIfLeftPossibleReiger(clickedBoxIndex % 5);
        if (leftIndices !== undefined && leftIndices.length !== 0) {
            indexes.push(...leftIndices);
        }
    }
    return indexes;
}

function bottomMovesReiger() {
    let indexes = [];
    if (reigerHead < reigerTail) {
        clickedBoxIndex = reigerTail;
    } else {
        clickedBoxIndex = reigerHead;
    }
    let possibleTopSteps = 4 - Math.floor(clickedBoxIndex / 5);
    if (clickedBoxIndex <= 19) {
        let topIndices = checkIfBottomPossibleReiger(possibleTopSteps);
        if (topIndices !== undefined && topIndices.length !== 0) {
            indexes.push(...topIndices);
        }
    }
    return indexes;
}

function rightMovesReiger() {
    let indexes = [];
    if (reigerHead < reigerTail) {
        clickedBoxIndex = reigerTail;
    } else {
        clickedBoxIndex = reigerHead;
    }
    let possibleRightSteps = 5 - (clickedBoxIndex + 1) % 5;
    if ((clickedBoxIndex + 1) % 5 !== 0) {
        let rightIndices = checkIfRightPossibleReiger(possibleRightSteps);
        if (rightIndices !== undefined && rightIndices.length !== 0) {
            indexes.push(...rightIndices);
        }
    }
    return indexes;
}

function topMovesReiger() {
    let indexes = [];
    if (reigerHead < reigerTail) {
        clickedBoxIndex = reigerHead;
    } else {
        clickedBoxIndex = reigerTail;
    }
    let possibleTopSteps = Math.floor(reigerHead / 5) - 1; // -1 --> voor de staart
    if (clickedBoxIndex >= 5) {
        let topIndices = checkIfTopPossibleReiger(possibleTopSteps);
        if (topIndices !== undefined && topIndices.length !== 0) {
            indexes.push(...topIndices);
        }
    }
    return indexes;
}

// Moves voor de frogs die mogelijk zijn
function checkIfLeftPossibleFrog(possibleLefts) {
    let somthingToJumpOver = false;
    let possibleCounter = 1;
    while (boxes[clickedBoxIndex - possibleCounter].classList.contains('frog') ||
    boxes[clickedBoxIndex - possibleCounter].classList.contains('leli') ||
    boxes[clickedBoxIndex - possibleCounter].classList.contains('reigerHead') ||
    boxes[clickedBoxIndex - possibleCounter].classList.contains('reigerTail')) {

        somthingToJumpOver = true;
        if (possibleCounter === possibleLefts) {
            break;
        }
        possibleCounter++;
    }
    if (somthingToJumpOver) {
        // Nakijken of pos niet uit de range van het bord is
        if ((clickedBoxIndex - possibleCounter) >= 0 &&
            (clickedBoxIndex - possibleCounter) <= 24 && possibleJumpBoxIsEmpty(clickedBoxIndex - possibleCounter)) {
            return clickedBoxIndex - possibleCounter;
        }
    }
}

function checkIfRightPossibleFrog(possibleRights) {
    let somthingToJumpOver = false;
    let possibleCounter = 1;
    while (boxes[clickedBoxIndex + possibleCounter].classList.contains('frog') ||
    boxes[clickedBoxIndex + possibleCounter].classList.contains('leli') ||
    boxes[clickedBoxIndex + possibleCounter].classList.contains('reigerHead') ||
    boxes[clickedBoxIndex + possibleCounter].classList.contains('reigerTail')) {

        somthingToJumpOver = true;
        if (possibleCounter === possibleRights) {
            break;
        }
        possibleCounter++;
    }
    if (somthingToJumpOver) {
        // Nakijken of pos niet uit de range van het bord is
        if ((clickedBoxIndex + possibleCounter) >= 0 &&
            (clickedBoxIndex + possibleCounter) <= 24 && possibleJumpBoxIsEmpty(clickedBoxIndex + possibleCounter)) {
            return clickedBoxIndex + possibleCounter;
        }
    }
}

function checkIfBottomPossibleFrog(possibleTops) {
    let somthingToJumpOver = false;
    let possibleCounter = 5;
    let maxStepReached = 0;
    while (boxes[clickedBoxIndex + possibleCounter].classList.contains('frog') ||
    boxes[clickedBoxIndex + possibleCounter].classList.contains('leli') ||
    boxes[clickedBoxIndex + possibleCounter].classList.contains('reigerHead') ||
    boxes[clickedBoxIndex + possibleCounter].classList.contains('reigerTail')) {

        somthingToJumpOver = true;
        maxStepReached++;
        if (maxStepReached === possibleTops) {
            break;
        }
        possibleCounter += 5;
    }
    if (somthingToJumpOver) {
        // Nakijken of pos niet uit de range van het bord is
        if ((clickedBoxIndex + possibleCounter) >= 0 &&
            (clickedBoxIndex + possibleCounter) <= 24 && possibleJumpBoxIsEmpty(clickedBoxIndex + possibleCounter)) {
            return clickedBoxIndex + possibleCounter;
        }
    }
}

function checkIfTopPossibleFrog(possibleBottoms) {
    let somthingToJumpOver = false;
    let possibleCounter = 5;
    let maxStepReached = 0;
    while (boxes[clickedBoxIndex - possibleCounter].classList.contains('frog') ||
    boxes[clickedBoxIndex - possibleCounter].classList.contains('leli') ||
    boxes[clickedBoxIndex - possibleCounter].classList.contains('reigerHead') ||
    boxes[clickedBoxIndex - possibleCounter].classList.contains('reigerTail')) {

        somthingToJumpOver = true;
        maxStepReached++;
        if (maxStepReached === possibleBottoms) {
            break;
        }
        possibleCounter += 5;
    }
    if (somthingToJumpOver) {
        // Nakijken of pos niet uit de range van het bord is
        if ((clickedBoxIndex - possibleCounter) >= 0 &&
            (clickedBoxIndex - possibleCounter) <= 24 && possibleJumpBoxIsEmpty(clickedBoxIndex - possibleCounter)) {
            return clickedBoxIndex - possibleCounter;
        }
    }
}

// Possible move positions reiger
function checkIfLeftPossibleReiger(possibleLefts) {
    let indexes = [];
    let possibleCounter = 1;
    while (boxes[clickedBoxIndex - possibleCounter].classList.length === 1 &&
    boxes[clickedBoxIndex - possibleCounter].classList.contains('box')) {

        if ((clickedBoxIndex - possibleCounter) >= 0 &&
            (clickedBoxIndex - possibleCounter) <= 24) {
            indexes.push(clickedBoxIndex - possibleCounter);

        }
        if (possibleCounter === possibleLefts) {
            break;
        }
        possibleCounter++;
    }
    return indexes;
}

function checkIfRightPossibleReiger(possibleRights) {
    let indexes = [];
    let possibleCounter = 1;
    while (boxes[clickedBoxIndex + possibleCounter].classList.length === 1 &&
    boxes[clickedBoxIndex + possibleCounter].classList.contains('box')) {
        if ((clickedBoxIndex + possibleCounter) >= 0 &&
            (clickedBoxIndex + possibleCounter) <= 24) {
            indexes.push(clickedBoxIndex + possibleCounter);
        }
        if (possibleCounter === possibleRights) {
            break;
        }
        possibleCounter++;
    }
    return indexes;
}

function checkIfBottomPossibleReiger(possibleBottoms) {
    let indexes = [];
    let possibleCounter = 5;
    let maxStepReached = 0;

    while (boxes[clickedBoxIndex + possibleCounter].classList.length === 1 &&
    boxes[clickedBoxIndex + possibleCounter].classList.contains('box')) {
        maxStepReached++;
        if ((clickedBoxIndex + possibleCounter) >= 0 &&
            (clickedBoxIndex + possibleCounter) <= 24) {
            indexes.push(clickedBoxIndex + possibleCounter);
        }
        if (maxStepReached === possibleBottoms) {
            break;
        }
        possibleCounter += 5;
    }
    return indexes;
}

function checkIfTopPossibleReiger(possibleTops) {
    let indexes = [];
    let possibleCounter = 5;
    let maxStepReached = 0;

    while (clickedBoxIndex - possibleCounter >= 0 &&
    boxes[clickedBoxIndex - possibleCounter] &&
    boxes[clickedBoxIndex - possibleCounter].classList.length === 1 &&
    boxes[clickedBoxIndex - possibleCounter].classList.contains('box')) {
        maxStepReached++;

        indexes.push(clickedBoxIndex - possibleCounter);

        if (maxStepReached === possibleTops) {
            break;
        }
        possibleCounter += 5;
    }

    return indexes;
}


function findClickedHeadOrTail() {
    if (boxes[clickedBoxIndex].classList.contains('reigerHead')) {
        return 'Head';
    } else if (boxes[clickedBoxIndex].classList.contains('reigerTail')) {
        return 'Tail';
    }
}

function fillHeadFindTailAndDirection() {
    reigerHead = clickedBoxIndex;

    findReigerDirection();

    findTail();


}

function fillTailFindHeadAndDirection() {
    reigerTail = clickedBoxIndex;

    findReigerDirection();

    findHead();
}

function findReigerDirection() {
    if (boxes[clickedBoxIndex].classList.contains('reigerLeftHeadPosition') || boxes[clickedBoxIndex].classList.contains('reigerLeftTailPosition')) {
        reigerDirection = 'Left';
    } else if (boxes[clickedBoxIndex].classList.contains('reigerBottomHeadPosition') || boxes[clickedBoxIndex].classList.contains('reigerBottomTailPosition')) {
        reigerDirection = 'Bottom';
    } else if (boxes[clickedBoxIndex].classList.contains('reigerRightHeadPosition') || boxes[clickedBoxIndex].classList.contains('reigerRightTailPosition')) {
        reigerDirection = 'Right';
    } else if (boxes[clickedBoxIndex].classList.contains('reigerTopHeadPosition') || boxes[clickedBoxIndex].classList.contains('reigerLeftTopPosition')) {
        reigerDirection = 'Top';
    }
}

function findTail() {
    switch (reigerDirection) {
        case 'Left':
            reigerTail = clickedBoxIndex + 1;
            break;
        case 'Bottom':
            reigerTail = clickedBoxIndex - 5;
            break;
        case 'Right':
            reigerTail = clickedBoxIndex - 1;
            break;
        case 'Top':
            reigerTail = clickedBoxIndex + 5;
            break;
        default:
            reigerDirection = ''; // ALS ER IETS FOUT GING
    }
}

function findHead() {
    switch (reigerDirection) {
        case 'Left':
            reigerHead = clickedBoxIndex - 1;
            break;
        case 'Bottom':
            reigerHead = clickedBoxIndex + 5;
            break;
        case 'Right':
            reigerHead = clickedBoxIndex + 1;
            break;
        case 'Top':
            reigerHead = clickedBoxIndex - 5;
            break;
        default:
            reigerDirection = ''; // ALS ER IETS FOUT GING
    }
}

function possibleJumpBoxIsEmpty(index) {
    if (boxes[index].classList.contains('frog') ||
        boxes[index].classList.contains('leli') ||
        boxes[index].classList.contains('reigerHead') ||
        boxes[index].classList.contains('reigerTail')) {
        return false;
    }
    return true;
}

// Moves die kunnen highlighten
function loopAndHighlight(possibleMoveablePositions) {
    for (let i = 0; i < possibleMoveablePositions.length; i++) {
        boxes[possibleMoveablePositions[i]].classList.add('highlight');
    }
}

// CHECKEN OF SPELER GEWONNEN HEEFT --> ALS GEWONNEN IS DISPLAYEN VAN HET MENUTJE GEWONNEN EN DAARIN KAN MEN NEXT LEVEL OF PREV LEVEL KIEZEN
function checkWon() {
    let frogsInHole = 0;
    boxes.forEach(box => {
        if (box.classList.contains('hole') && box.classList.contains('frog')) {
            frogsInHole++;
        }
    });

    console.log(frogsInHole)
    console.log(frogAmount)
    if (frogsInHole === frogAmount) {
        setTimeout(() => {
            const levelCompletedDiv = document.querySelector('#levelCompleted');
            levelCompletedDiv.classList.remove('hidden')
            levelCompletedDiv.classList.add('popup');
            console.log('you have won')
            gameWon = true;
            stopTimer();
            const timerdisplay = document.querySelector('#timer-display')
            let behaaldeTijd = timerdisplay.innerHTML;
            const data = {
                idlevel: parseInt(currentLevel)+1,
                naam: name,
                tijd: behaaldeTijd
            }
            fetch('http://localhost:3000/api/v1/highscores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)
            })
                .then(response =>
                    response.json()

                )
                .then(result => {
                    console.log(result);

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }, 100);
    }
}

function reloadLevel() {
    const levelCompletedDiv = document.querySelector('#levelCompleted');
    levelCompletedDiv.classList.remove('popup')
    levelCompletedDiv.classList.add('hidden');
    fetch('./json/levels.json')
        .then(response => response.json())
        .then(data => {
            const levels = data.levels;
            console.log(currentLevel); // NAKIJKEN WELK LEVEL IK ZIT
            const levelData = levels[currentLevel];
            clearBoard(); // ALLES DELETEN VAN VORIG LEVEL
            assignClassesToBoxes(levelData);
            startTimer();
            fetchHighscores();
        })
        .catch(error => {
            console.error('Error loading levels:', error);
        });
}


function loadNextLevel() {
    const levelCompletedDiv = document.querySelector('#levelCompleted');
    levelCompletedDiv.classList.remove('popup')
    levelCompletedDiv.classList.add('hidden');
    currentLevel += 1; // currentLevel +1 doen vr volgend level
    localStorage.setItem('currentLevel', currentLevel);
    startTimer();
    fetchHighscores();

    fetch('./json/levels.json')
        .then(response => response.json())
        .then(data => {
            const levels = data.levels;
            const levelData = levels[currentLevel];
            console.log('level:' + currentLevel); // NAKIJKEN WELK LEVEL IK ZIT
            clearBoard(); // ALLES DELETEN VAN VORIG LEVEL
            assignClassesToBoxes(levelData);
        })
        .catch(error => {
            console.error('Error loading levels:', error);
        });
}

function clearBoard() {
    boxes.forEach(box => {
        box.classList.remove('hole', 'leli', 'frog', 'reigerHead', 'reigerTail',
            'reigerBottomHeadPosition', 'reigerLeftHeadPosition', 'reigerRightHeadPosition', 'reigerTopHeadPosition',
            'reigerBottomTailPosition', 'reigerLeftTailPosition', 'reigerRightTailPosition', 'reigerTopTailPosition');
    });
    frogAmount = 0;
    gameWon = false;
}

document.querySelector('#redo').addEventListener('click', reloadLevel);
document.querySelector('#next').addEventListener('click', loadNextLevel);
