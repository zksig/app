import { ethers } from "ethers";
import ProviderNFTDealClient from "./contracts/ProviderNFTDealClient.json";
import { Agreement } from "./digitalSignatures";
import { getProvider } from "./evm";

export const deployProviderNFTDealClient = async (agreement: Agreement) => {
  const provider = getProvider();

  const factory = new ethers.ContractFactory(
    ProviderNFTDealClient.abi,
    ProviderNFTDealClient.bytecode,
    provider.getSigner()
  );
  const contract = await factory.deploy(agreement.nftContractAddress);

  console.log(contract.address);
};
