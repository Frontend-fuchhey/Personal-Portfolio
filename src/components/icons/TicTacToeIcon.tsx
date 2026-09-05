import React from 'react';

export const TIC_TAC_TOE_ICON_URL = 'https://cdn-icons-png.flaticon.com/512/10199/10199746.png';

interface TicTacToeIconProps {
  className?: string;
  bare?: boolean;
}

export const TicTacToeIcon: React.FC<TicTacToeIconProps> = ({ className, bare = false }) => {
  if (bare) {
    return (
      <img
        src={TIC_TAC_TOE_ICON_URL}
        alt="Tic Tac Toe"
        className={className || 'w-11 h-11 object-contain'}
        draggable={false}
      />
    );
  }

  return (
    <div className={`w-full h-full rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md border border-zinc-200/50 ${className || ''}`}>
      <img
        src={TIC_TAC_TOE_ICON_URL}
        alt="Tic Tac Toe"
        className="w-full h-full object-contain"
        draggable={false}
      />
    </div>
  );
};

export default TicTacToeIcon;
