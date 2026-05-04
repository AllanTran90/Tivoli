"use client";

import { useState } from "react";

export default function ChoclateWheel(){
    const [ result, setResult ] = useState<number | null>(null);

    function spin (){
        const value = [ 0, 2, 3, 5 ];
        const random = value[Math.floor(Math.random() * value.length)];
        setResult(random);
    }

    return(
        <div>
            <h1>Choclate Wheel</h1>

            <button onClick={spin}>SPIN</button>

            (result ! == null && (
                <p>{result === 0 ? "Lost😢" : `Won x${result}`}</p>
            ))
        </div>
    )
}