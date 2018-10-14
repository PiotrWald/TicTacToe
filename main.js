/////////////////////////////////////////////////////////////////////////////////
//  GAME BOARD MODULE
/////////////////////////////////////////////////////////////////////////////////


const gameBoard = (() => {

  // Public
  const field = (i,j) => {
    return board[i][j];
  }

  const renderIn = (element) => {
    if ( board[0] === undefined) { prepareBoard() };
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }
    for (let i = 0; i < board.length; i++) {
      for (let k = 0; k < board.length; k++) {
        cell = prepareCell(i,k);
        element.appendChild(cell);
      }
    }
  }

  const clear = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = undefined;
    }
  }

  // Private
  const board = new Array(3);

  const prepareBoard = () => {
    for (let index = 0; index < 3; index++) {
      board[index] = new Array(3)
      for (let index2 = 0; index2 < 3; index2++) {
        board[index][index2] = { value: "" };
      }
    }
  }

  const prepareCell = (i,k) => {
    let cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = field(i,k).value
    cell.setAttribute("data-index", `${i}-${k}`)

    return cell;
  }

  return { field, renderIn, clear };
})();

/////////////////////////////////////////////////////////////////////////////////
//  GAME RULES MODULE
/////////////////////////////////////////////////////////////////////////////////

const gameRules = ( ()=> {

  // Public

  const cellSelected = (coordinates) => {
    if (isMoveValid(coordinates)) {
      activePlayer().makeMove(coordinates);
      if (hasPlayerWon()) { crownWinner(activePlayer()) }
      else if (isDraw()) { drawHappened() };
      changeActivePlayer();
    }
  }

  // Private

  const isMoveValid = (coordinates) => {
    if (gameBoard.field(...coordinates).value == "") {
      return true } else { return false }
  }

  const hasPlayerWon = () => {
    if ( horizontalLine() || verticalLine() || crossLine()) {
      return true } else { return false }
  }

  const isDraw = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameBoard.field(i,j).value == "") { return false }
      }
    }

    return true;
  }

  const horizontalLine = () => {

    outerLoop:
    for (let i = 0; i < 3; i++) {
      if (gameBoard.field(i,0).value == "") { continue outerLoop };

      innerLoop:
      for (let j = 0; j < 3; j++) {
        if (j == 0) { continue innerLoop };

        if (gameBoard.field(i,j).value != gameBoard.field(i,j-1).value) {
          continue outerLoop;
        }
      }
      return true;
    }
    return false;
  }

  const verticalLine = () => {

    outerLoop:
    for (let i = 0; i < 3; i++) {
      if (gameBoard.field(0,i).value == "") { continue outerLoop };

      innerLoop:
      for (let j = 0; j < 3; j++) {
        if (j == 0) { continue innerLoop };
        if (gameBoard.field(j,i).value != gameBoard.field(j-1,i).value) {
          continue outerLoop;
        }
      }
      return true
    }
    return false;
  }

  const crossLine = () => {

      value = gameBoard.field(1,1).value
      if (value == "") { return false };
    if (
      gameBoard.field(0,0).value == value &&
      gameBoard.field(2,2).value == value )
    {
      return true;
    } else if (
      gameBoard.field(2,0).value == value &&
      gameBoard.field(0,2).value == value )
    {
      return true;
    } else
    {
      return false;
    }
  }

  return { cellSelected };
})();

/////////////////////////////////////////////////////////////////////////////////
//    PLAYER FACTORY
/////////////////////////////////////////////////////////////////////////////////

const PlayerFactory = (name, symbol) => {
  const makeMove = (coordinates) => {
    gameBoard.field(...coordinates).value = symbol;
  }

  return { makeMove, name };
};

/////////////////////////////////////////////////////////////////////////////////
//    GLOBAL SCOPE FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////

function addEventsToCells () {
  cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function(e){
      let element = e.target
      let coordinates = element.dataset.index.split("-");
      gameRules.cellSelected(coordinates)

      gameBoard.renderIn(document.querySelector(".gameBoard"));

      addEventsToCells();
    }, false);
  }
}

function activePlayer() {
  return players[0];
}

function changeActivePlayer() {
  players.reverse();
}

function initialize() {
  gameBoard.renderIn(document.querySelector(".gameBoard"));
  addEventsToCells();
  players = [
    PlayerFactory("player1", "x"),
    PlayerFactory("player2", "o")
  ]

  document.querySelector("h1").addEventListener("click", reloadGame, false);
}

function reloadGame() {
  gameBoard.clear()
  initialize()
}

function crownWinner() { alert(`we have a winner: ${activePlayer().name}`) };
function drawHappened() { alert("draw")};

/////////////////////////////////////////////////////////////////////////////////
//    INITIALIZATION
/////////////////////////////////////////////////////////////////////////////////

let players = [];
initialize();

