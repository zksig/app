import { CarReader } from "@ipld/car";
import { Web3Storage } from "web3.storage";

if (!process.env.WEB3_STORAGE_TOKEN) {
  throw new Error("Missing WEB3_STORAGE_TOKEN environment variable");
}

const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN! });

export const store = async (name: string, file: Buffer) => {
  const car = await CarReader.fromBytes(file);

  // @ts-ignore
  return client.putCar(car, {
    wrapWithDirectory: false,
  });
};
