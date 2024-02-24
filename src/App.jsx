import "./App.css";
import { Square } from "./components/Square";
import { useState } from "react";
import { turns } from "./constants";
import { checkWinnerFrom } from "./logic/board.js";
import { WinnerModal } from "./components/WinnerModal.jsx";
import { checkEndGame } from "./logic/board.js";
import { saveGameToStorage, resetGameStorage } from "./logic/storage/index.js";
import confetti from "canvas-confetti";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? turns.X;
  });

  //nulll es no hay ganador y false empate
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(turns.X);
    setWinner(null);

    resetGameStorage();
  };

  const updateBoard = (index) => {
    //no actualiza si ya tiene algo
    if (board[index] || winner) return;

    //actualiza el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    //Cambia el turno
    const newTurn = turn === turns.X ? turns.O : turns.X;
    setTurn(newTurn);

    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    });

    //revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); // empate
    }
  };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>
      <section className="turn">
        <Square isSelected={turn === turns.X}>{turns.X}</Square>
        <Square isSelected={turn === turns.O}>{turns.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
