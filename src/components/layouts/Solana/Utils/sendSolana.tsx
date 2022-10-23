import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import React, { FC, useCallback, useState } from 'react';

export const SendSolanaToAddress: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, wallets, wallet} = useWallet();
    const [address, setAddress] = useState('')

    const onClick = useCallback(async () => {
        console.log('address', address)
        if (!publicKey) throw new WalletNotConnectedError();

        // 890880 lamports as of 2022-09-01
        let lamports = await connection.getMinimumBalanceForRentExemption(0);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(address as unknown as PublicKey),
                lamports,
            })
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
    }, [publicKey, sendTransaction, connection, address]);

    return (
        <div>
            <input onChange={(event) => {
                setAddress(event.target.value)
            }}/>
            <br/>
            <button onClick={onClick} disabled={!publicKey}>
                <>
                Send SOL to {address}!
                </>
            </button>
        </div>

    );
};