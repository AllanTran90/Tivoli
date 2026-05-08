"use client";

type Props ={
    text: string
    onClick: () => void
    disabled?: boolean
    className?: string
};

export default function GameButton ({
   text,
   onClick,
   disabled,
   className
}: 
Props){

    return(
      <button
        onClick={onClick}
        disabled={disabled}
        className={className}
        >
            {text}
      </button>
    );
}