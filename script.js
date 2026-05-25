const boardElement = document.getElementById("bingoBoard");
const winPopup = document.getElementById("winPopup");
const okButton = document.getElementById("okButton");
const winningLine = document.getElementById("winningLine");
const confettiContainer = document.getElementById("confettiContainer");

let board = [];
let gameOver = false;

function generateBoard() {
  boardElement.innerHTML = "";
  winPopup.classList.remove("show");
  winningLine.style.display = "none";
  confettiContainer.innerHTML = "";
  board = [];
gameOver = false;

  const numbers = generateBingoNumbers();

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("button");
    cell.classList.add("cell");

    cell.textContent = numbers[i];
board.push({ value: numbers[i], marked: false });

    cell.addEventListener("click", () => {
      if (gameOver) return;

      board[i].marked = !board[i].marked;
      cell.classList.toggle("marked");

      checkWinner();
    });

    boardElement.appendChild(cell);
  }
}

function generateBingoNumbers() {
  let numbers = [];

  for (let i = 1; i <= 25; i++) {
    numbers.push(i);
  }

  numbers.sort(() => Math.random() - 0.5);

  return numbers;
}

function checkWinner() {
  const winningPatterns = [
    // Rows
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],

    // Columns
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],

    // Diagonals
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
  ];

  for (let pattern of winningPatterns) {
    const isWinner = pattern.every(index => board[index].marked);

    if (isWinner) {
      gameOver = true;
      
      highlightWinningCells(pattern);
      drawWinningLine(pattern);
      startConfetti();

      setTimeout(() => {
        winPopup.classList.add("show"); 
      }, 900);

      return;
    }
  }
}

function highlightWinningCells(pattern) {
  const cells = document.querySelectorAll(".cell");

  pattern.forEach(index => {
    cells[index].classList.add("winning");
  });
}

generateBoard();

okButton.addEventListener("click", function () {
  winPopup.classList.remove("show");
  generateBoard();
});

function drawWinningLine(pattern) {
  const cells = document.querySelectorAll(".cell");
  const wrapper = document.querySelector(".board-wrapper");

  const firstCell = cells[pattern[0]];
  const lastCell = cells[pattern[pattern.length - 1]];

  const wrapperRect = wrapper.getBoundingClientRect();
  const firstRect = firstCell.getBoundingClientRect();
  const lastRect = lastCell.getBoundingClientRect();

  const x1 = firstRect.left + firstRect.width / 2 - wrapperRect.left;
  const y1 = firstRect.top + firstRect.height / 2 - wrapperRect.top;

  const x2 = lastRect.left + lastRect.width / 2 - wrapperRect.left;
  const y2 = lastRect.top + lastRect.height / 2 - wrapperRect.top;

  const angleRad = Math.atan2(y2 - y1, x2 - x1);
  const angleDeg = angleRad * 180 / Math.PI;

  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  // 這裡控制紅線多長
  const extraLength = 35;

  const startX = x1 - Math.cos(angleRad) * extraLength;
  const startY = y1 - Math.sin(angleRad) * extraLength;

  winningLine.style.display = "block";
  winningLine.style.width = distance + extraLength * 2 + "px";
  winningLine.style.left = startX + "px";
  winningLine.style.top = startY + "px";
  winningLine.style.transform = `rotate(${angleDeg}deg)`;
}

function startConfetti() {
  confettiContainer.innerHTML = "";

  const colors = [
    "#ff4d4d",
    "#ffd93d",
    "#4caf50",
    "#4da3ff",
    "#b366ff",
    "#ff8c1a"
  ];

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    confetti.style.animationDelay = Math.random() * 0.8 + "s";
    confetti.style.animationDuration = 2.5 + Math.random() * 1.8 + "s";

    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = "";
  }, 5000);
}
