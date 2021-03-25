'use strict'

const MINE = '💣';
const FLAG= '🏴';
const EMPTY= ' ';
const NORMAL_SMILEY= '🙂';
const LOSE_SMILEY= '☠';
const VICTORY= '🏆';
const NOT_SHOWN='🎁'
const GLIVES= '❤';


var gBoard;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};
var gTimer;

var gLevel = {
    size: 4,
    mines: 2,
    live: 1
};

function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function incrTimer() {
    gGame.secsPassed++;
    renderTimer(gGame.secsPassed);
    //console.log(gGame.secsPassed)
}

function buildBoard() {
    //debugger
    var size = gLevel.size;
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            //var cell = gCell
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
            //cell.isShown = true
            board[i][j] = cell;
        }
    }
    //debugger

    return board;
}

function randomizeMines(number, board, forbiddenI, forbiddenJ) {
    console.log("inside rand mines")
    //debugger
    var minesCounter = 0;
    while(minesCounter < number) {
        var i = getRandomInt(0, gLevel.size - 1);
        var j = getRandomInt(0, gLevel.size - 1);
        if (forbiddenI === i && forbiddenJ === j) {
            console.log("forbidden ", i, " ", j);
            continue;
        }
        if(!board[i][j].isMine) {
            board[i][j].isMine = true;
            //board[i][j].isShown = true;
            minesCounter++;
        } else {
            console.log("collision ", i, " ", j)
        }
    }
    
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// set all the numbers depending on the mines
function setMinesNegsCount(board) {
    var size = gLevel.size;
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board);
        }
    }
    return board;
}

function countNeighbors(cellI, cellJ, mat) {
    //debugger
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

function showNeighbors(cellI, cellJ, mat) {
    //debugger
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (!mat[i][j].isShown){
                mat[i][j].isShown = true;
                gGame.shownCount++;
                var value;
                if(gBoard[i][j].minesAroundCount === 0 ){
                    value = EMPTY; 
                }else
                    value = gBoard[i][j].minesAroundCount;
                //console.log('shownCount=',gGame.shownCount)
                renderCell(i, j, value);  
            }
        }
    }
}

function renderBoard(board) {
    var strHtml = '';
    strHtml += `<div id= container>
        <div class= "mines-div">${MINE} = ${gLevel.mines}</div>
        <button class="start-btn" onclick="playAgain(this)">${NORMAL_SMILEY}</button><br>
        <div class= "timer-div">⏱ = ${gGame.secsPassed}</div><br>
        <div class="lives">${GLIVES} = ${gLevel.live}</div>
        </div>`
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var picture;
            var className;
            if(cell.isShown) {
                if(cell.isMine) { 
                    picture = MINE;
                    className = "mine"
                } else if(cell.minesAroundCount > 0 ) {
                    picture = cell.minesAroundCount;
                    className = "number"
                } else {
                    picture = EMPTY;
                    className = "empty"
                }
            } else {
                picture = NOT_SHOWN;
                className = "hidden"
            }

            strHtml += `<td class="${className}"
            data-i="${i}" data-j="${j}"
            onclick="cellClicked(event , ${i} , ${j})"
            oncontextmenu="cellClicked(event , ${i} , ${j})"
            >${picture}</td>`
        }
        strHtml += '</tr>'
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}


function cellClicked(ev, i, j){
    // TODO check which button was clicked
    console.log("inside cell clicked")
    //debugger
    if(gGame.isOn){
        if(ev.button === 0) { //left button click
            if(gBoard[i][j].isMarked) return;
            if(!gBoard[i][j].isMine) {
                if(!gBoard[i][j].isShown) {
                   gBoard[i][j].isShown = true; 
                    var value;
                    if(gBoard[i][j].minesAroundCount === 0 ){
                        value = EMPTY;
                        showNeighbors(i, j, gBoard) 
                    }else
                        value = gBoard[i][j].minesAroundCount;
                    gGame.shownCount++;
                    //console.log('shownCount=',gGame.shownCount)
                    renderCell(i, j, value);
                }
            } else {
                userLost(i, j);
                return;
            }
        } else if (ev.button === 2 ) { //right button click
            //debugger
            if(gBoard[i][j].isMarked){
                renderCellClickRight(i,j,NOT_SHOWN);
                gGame.markedCount--;
                var elCountMines = document.querySelector('.mines-div');
                elCountMines.innerHTML = `${MINE} = ${++gLevel.mines}`;

            }else if(!gBoard[i][j].isShown) {
                gBoard[i][j].isMarked = true;
                gGame.markedCount++;
                console.log('markedCount=',gGame.markedCount)
                renderCell(i, j, FLAG);
                //while(gLevel.mines > 0){
                    var elCountMines = document.querySelector('.mines-div');
                    elCountMines.innerHTML = `${MINE} = ${--gLevel.mines}`;
                //}
            }
        }
    } else {
        console.log("inside else")
        gGame.isOn = true;
        randomizeMines(gLevel.mines, gBoard, i, j);
        setMinesNegsCount(gBoard);
        gTimer = setInterval(incrTimer, 1000);
        var value;
        if(gBoard[i][j].minesAroundCount === 0 )
            value = EMPTY;
        else
            value = gBoard[i][j].minesAroundCount;
        gGame.shownCount++;
        //console.log('shownCount=',gGame.shownCount)
        renderCell(i, j, value);
    }
    checkGameOver(gBoard)
}


function userLost(i, j) {
    if(gLevel.live === 0){
        clearInterval(gTimer);
        var elBtnSmile = document.querySelector(`.start-btn`);
        elBtnSmile.innerText = LOSE_SMILEY;
        for(var k=0; k < gBoard.length; k++) {
            for(var m=0; m < gBoard[0].length; m++) {
                if(k === i && m === j) {
                    renderExplodedCell(i, j, MINE)
                } else {
                    if(gBoard[k][m].isMine) {
                        renderCell(k, m, MINE)
                    }
                }
            }
        }
    }else{
        gLevel.live--;
        var elBtnSmile = document.querySelector(`.lives`);
        elBtnSmile.innerText =`${GLIVES} = ${gLevel.live}`;
        showBomb(i, j);
    }
}

function showBomb(i, j) {
    // render bomb

    renderCell(i,j,MINE)
    setTimeout(function() {
        renderCellClickRight(i,j,NOT_SHOWN);
    }, 2000)

    // renderExplodedCell(i,j,MINE)
    // setTimeout(renderCellClickRight(i,j,NOT_SHOWN), 2000)

    
}

function checkGameOver(board){
    // TODO if true then stop timer
    var cellCount = gGame.markedCount + gGame.shownCount;
    var boardCount = gLevel.size * gLevel.size;
    if(cellCount === boardCount && gGame.markedCount === gLevel.mines){
        var elBtnSmile = document.querySelector(`.start-btn`);
        elBtnSmile.innerText = VICTORY;
        clearInterval(gTimer);   
    }
}

// function expandShown(board, elCell, i, j){
    
// }

function playLevel(elButton) {
    if (elButton.classList.contains('medium')){
        gLevel.size= 8;
        gLevel.mines=12;
        gLevel.live=2;
        var imageBody = document.querySelector(`.board`);
        imageBody.style.backgroundSize = "500px 570px" ;
        //imageBody.style.opacity = "0.5" ;

    } else if (elButton.classList.contains('easy')){
        gLevel.size= 4;
        gLevel.mines=2;
        gLevel.live=1;
        var imageBody = document.querySelector(`.board`);
        imageBody.style.backgroundSize = "250px 270px" ;
    }
    else {
       gLevel.size= 12;
       gLevel.mines=30;
        gLevel.live=3;
       var imageBody = document.querySelector(`.board`);
        imageBody.style.backgroundSize = "700px 790px" ;
    }
    playAgain();
}

function playAgain() {
    //debugger
    clearInterval(gTimer);
    gGame.secsPassed = 0
    gGame.isOn = false
    if(gLevel.size === 4){
        gLevel.mines =2;
        gLevel.live=1;
    }else if(gLevel.size === 8){
        gLevel.mines = 12
        gLevel.live=2;
    }else{
        gLevel.mines=30;
        gLevel.live=3;
    }
    var elCountMines = document.querySelector('.mines-div');
    elCountMines.innerHTML = `${MINE} = ${gLevel.mines}`;
    renderTimer(0)
    initGame();
}



// while (gLevel.live !== 0){
//     gLevel.live--;
// }