function renderCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elCell.innerText = value;
    elCell.classList.remove('hidden');
}

function renderExplodedCell(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elCell.innerText = value;
    elCell.style.backgroundColor = "red";
    elCell.classList.remove('hidden');
}

function renderTimer(value) {
    var elTimer = document.querySelector(`.timer-div`);
    elTimer.innerText = value;
}

function renderCellClickRight(i, j, value) {
    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elCell.innerText = value;
    elCell.classList.add('hidden');
}

