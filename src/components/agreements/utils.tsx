import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, AnchorProvider, web3
} from '@project-serum/anchor';
import { IDL } from '../../utils/e_signatures';

// SystemProgram is a reference to the Solana runtime!


// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new web3.PublicKey('FqUDkQ5xq2XE7BecTN8u9R28xtLudP7FgCTC8vSLDEwL');

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
    //check type
  preflightCommitment: "processed" as any
}

export const getProvider = (connection: any) => {
    const provider = new AnchorProvider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
}
  

export const getProgram = async (connection: any) => {
    // Get metadata about your solana program
    return new Program(IDL, programID, getProvider(connection))
};

  

  