import React, { useState, useEffect, useCallback } from 'react';

type Difficulty = 'easy' | 'medium' | 'impossible' | 'friend';
type Player = 'X' | 'O' | null;

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [difficulty, setDifficulty] = useState<Difficulty>('impossible');
  const [scores, setScores] = useState({ x: 0, ties: 0, o: 0 });
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('Your turn (X)');

  const checkWinner = (currentBoard: Player[]) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'Tie', combo: null };
    }
    return null;
  };

  const minimax = (tempBoard: Player[], depth: number, isMaximizing: boolean): { score: number; index?: number } => {
    const result = checkWinner(tempBoard);
    if (result?.winner === 'O') return { score: 10 - depth };
    if (result?.winner === 'X') return { score: depth - 10 };
    if (result?.winner === 'Tie') return { score: 0 };

    const availSpots = tempBoard.map((val, idx) => (val === null ? idx : null)).filter((v) => v !== null) as number[];

    if (isMaximizing) {
      let bestScore = -1000;
      let bestMove = availSpots[0];
      for (const idx of availSpots) {
        tempBoard[idx] = 'O';
        const score = minimax(tempBoard, depth + 1, false).score;
        tempBoard[idx] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = idx;
        }
      }
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = 1000;
      let bestMove = availSpots[0];
      for (const idx of availSpots) {
        tempBoard[idx] = 'X';
        const score = minimax(tempBoard, depth + 1, true).score;
        tempBoard[idx] = null;
        if (score < bestScore) {
          bestScore = score;
          bestMove = idx;
        }
      }
      return { score: bestScore, index: bestMove };
    }
  };

  const resetBoardOnly = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinningLine(null);
    setIsGameOver(false);
    setStatusMsg('Your turn (X)');
  };

  const handleAIMove = useCallback((currentBoard: Player[]) => {
    const availSpots = currentBoard.map((val, idx) => (val === null ? idx : null)).filter((v) => v !== null) as number[];
    if (availSpots.length === 0) return;

    let moveIndex: number;
    if (difficulty === 'easy') {
      moveIndex = availSpots[Math.floor(Math.random() * availSpots.length)];
    } else if (difficulty === 'medium') {
      moveIndex = Math.random() > 0.5 ? (minimax(currentBoard, 0, true).index ?? availSpots[0]) : availSpots[Math.floor(Math.random() * availSpots.length)];
    } else {
      moveIndex = minimax(currentBoard, 0, true).index ?? availSpots[0];
    }

    const newBoard = [...currentBoard];
    newBoard[moveIndex] = 'O';
    setBoard(newBoard);

    const gameRes = checkWinner(newBoard);
    if (gameRes) {
      setIsGameOver(true);
      if (gameRes.combo) setWinningLine(gameRes.combo);
      if (gameRes.winner === 'O') {
        setScores((s) => ({ ...s, o: s.o + 1 }));
        setStatusMsg('Computer (O) Wins!');
      } else {
        setScores((s) => ({ ...s, ties: s.ties + 1 }));
        setStatusMsg("It's a Tie!");
      }
    } else {
      setTurn('X');
      setStatusMsg('Your turn (X)');
    }
  }, [difficulty]);

  const handleCellClick = (index: number) => {
    if (board[index] || isGameOver || (difficulty !== 'friend' && turn === 'O')) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const gameRes = checkWinner(newBoard);
    if (gameRes) {
      setIsGameOver(true);
      if (gameRes.combo) setWinningLine(gameRes.combo);
      if (gameRes.winner === 'X') {
        setScores((s) => ({ ...s, x: s.x + 1 }));
        setStatusMsg('You (X) Win! 🎉');
      } else if (gameRes.winner === 'O') {
        setScores((s) => ({ ...s, o: s.o + 1 }));
        setStatusMsg('Player 2 (O) Wins!');
      } else {
        setScores((s) => ({ ...s, ties: s.ties + 1 }));
        setStatusMsg("It's a Tie!");
      }
    } else {
      const nextTurn = turn === 'X' ? 'O' : 'X';
      setTurn(nextTurn);
      if (difficulty !== 'friend' && nextTurn === 'O') {
        setStatusMsg('Computer thinking...');
        setTimeout(() => handleAIMove(newBoard), 250);
      } else {
        setStatusMsg(`Player ${nextTurn}'s turn`);
      }
    }
  };

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => {
        resetBoardOnly();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isGameOver]);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 p-3 font-sans select-none overflow-hidden">
      {/* Top Header Bar (Shrink-Resistant) */}
      <div className="shrink-0 flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm">
          <span className="text-zinc-400 text-[11px]">📊</span>
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value as Difficulty);
              resetBoardOnly();
            }}
            className="bg-transparent text-[11px] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="impossible">Impossible</option>
            <option value="friend">Play against a friend</option>
          </select>
        </div>

        <button
          onClick={() => {
            setScores({ x: 0, ties: 0, o: 0 });
            resetBoardOnly();
          }}
          className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition flex items-center gap-1 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-xl border border-zinc-200/80 dark:border-zinc-700 shadow-sm cursor-pointer"
        >
          <span>Reset Game</span> ↺
        </button>
      </div>

      {/* Scoreboard Card (Shrink-Resistant & Fixed-Height Borders) */}
      <div className="shrink-0 bg-white dark:bg-zinc-800/90 rounded-2xl p-2 my-1.5 border border-zinc-200/70 dark:border-zinc-700/60 shadow-sm grid grid-cols-3 gap-1 text-center">
        <div className={`p-1 rounded-xl border-b-2 transition ${turn === 'X' && !isGameOver ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600' : 'border-transparent'}`}>
          <div className="text-[9px] font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">YOU (X) ✏️</div>
          <div className="text-base font-black text-blue-600 dark:text-blue-400">{scores.x}</div>
        </div>
        <div className="p-1 rounded-xl border-b-2 border-transparent">
          <div className="text-[9px] font-extrabold text-zinc-400 tracking-wider">TIES</div>
          <div className="text-base font-black text-zinc-800 dark:text-zinc-200">{scores.ties}</div>
        </div>
        <div className={`p-1 rounded-xl border-b-2 transition ${turn === 'O' && !isGameOver ? 'bg-red-50 dark:bg-red-950/40 border-red-500' : 'border-transparent'}`}>
          <div className="text-[9px] font-extrabold text-red-500 tracking-wider">{difficulty === 'friend' ? 'P2 (O)' : 'COMPUTER (O)'}</div>
          <div className="text-base font-black text-red-500">{scores.o}</div>
        </div>
      </div>

      {/* Board Grid: Fixed square dimensions so cells NEVER resize or squeeze when placing X or O */}
      <div className="w-[225px] h-[225px] mx-auto my-auto shrink-0 grid grid-cols-3 grid-rows-3 gap-2">
        {board.map((cell, idx) => {
          const isWinningSquare = winningLine?.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              className={`w-full h-full aspect-square flex items-center justify-center rounded-2xl transition-colors bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-sm hover:shadow-md cursor-pointer ${
                isWinningSquare ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' : ''
              }`}
            >
              {cell === 'X' && (
                <svg className="w-8 h-8 stroke-blue-600 dark:stroke-blue-400 animate-scale-in shrink-0 pointer-events-none" viewBox="0 0 100 100">
                  <line x1="25" y1="25" x2="75" y2="75" strokeWidth="12" strokeLinecap="round" />
                  <line x1="75" y1="25" x2="25" y2="75" strokeWidth="12" strokeLinecap="round" />
                </svg>
              )}
              {cell === 'O' && (
                <svg className="w-8 h-8 stroke-red-500 animate-scale-in shrink-0 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="28" strokeWidth="12" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Turn Indicator (Fixed Height Container) */}
      <div className="shrink-0 flex justify-center items-center h-7 my-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-sm">
          <span className={`font-bold ${turn === 'X' ? 'text-blue-600' : 'text-red-500'}`}>
            {turn === 'X' ? 'X' : 'O'}
          </span>
          <span className="text-zinc-600 dark:text-zinc-300">{statusMsg}</span>
        </span>
      </div>

      {/* Bottom Tip Box (Shrink-Resistant) */}
      <div className="shrink-0 bg-white dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/60 rounded-xl p-2 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 shadow-sm">
        <span className="text-xs">💡</span>
        <span>Beat the computer to win!</span>
      </div>
    </div>
  );
};
