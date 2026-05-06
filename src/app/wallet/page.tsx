"use client"

import { useWallet } from "@/context/WalletContext"

export default function WalletPage(){
    const { balance } = useWallet();

    return (
        <main>
            <h1>
                💰 Wallet
            </h1>
            <p>
                Balance: {balance} Coins
            </p>
        </main>
    );
}