import { sign } from "tweetnacl";
import bs58 from "bs58";
import { setCookie, getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { HttpError } from "./HttpError";
import { IncomingMessage, ServerResponse } from "http";

export const createSession = (req: NextApiRequest, res: NextApiResponse) => {
  const isValid = sign.detached.verify(
    Buffer.from(`ZKSIG AUTH SOLANA - ${req.body.date}`),
    Buffer.from(req.body.signature, "base64"),
    bs58.decode(req.body.publicKey)
  );
  if (!isValid) {
    throw new HttpError("Unauthorized", 401);
  }

  setCookie(
    "zksigSession",
    jwt.sign({ publicKey: req.body.publicKey }, process.env.APP_SECRET!, {
      expiresIn: "2d",
    }),
    { req, res, httpOnly: true, maxAge: 60 * 60 * 24 * 2 }
  );
};

export const verifySession = (
  req: IncomingMessage,
  res: ServerResponse
): { publicKey: string } => {
  const token = getCookie("zksigSession", { req, res });
  if (!token) throw new HttpError("Missing/Invalid token", 400);

  return jwt.verify(token.toString(), process.env.APP_SECRET!) as {
    publicKey: string;
  };
};
