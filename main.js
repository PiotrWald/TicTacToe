const gameBoard = (() => {
  // Private
  const board = new Array(3).fill(new Array(3).fill({ value: undefined }));

  const prepareCell = (i,k) => {
    let cell = document.createElement("div");

    cell.className = "cell";
    cell.innerText = field(i,k).value
    cell.setAttribute("data-index", `${i}-${k}`)
    cell.addEventListener("click", function(e){
      let element = e.target
      let index = element.dataset.index.split("-");
      field(...index).value = 1;
      renderIn(document.querySelector(".gameBoard"));
    }, false);
  
    return cell;
  }

  // Public
  const field = (i,j) => {
    return board[i][j];
  }

  const renderIn = (element) => {
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

  return { field, renderIn };
})();

// Top Level invocations
gameBoard.renderIn(document.querySelector(".gameBoard"));