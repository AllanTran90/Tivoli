"use client";

type Props ={
    text: string
    onClick: () => void
    disabled?: boolean
};

export default function GameButton ({
   text,
   onClick,
   disabled
}: 
Props){

    return(
      <button
        onClick={onClick}
        disabled={disabled}
        >
            {text}
      </button>
    );
}