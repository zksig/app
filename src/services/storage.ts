import { Readable } from "stream";
import { File, Web3Storage } from "web3.storage";

if (!process.env.WEB3_STORAGE_TOKEN) {
  throw new Error("Missing WEB3_STORAGE_TOKEN environment variable");
}

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN! });

export const store = async (name: string, file: Buffer) => {
  return client.put([new File([file], name)], {
    wrapWithDirectory: false,
  });
};
