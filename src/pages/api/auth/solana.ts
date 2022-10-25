import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie, getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { HttpError } from "../../../utils/HttpError";
import { createSession, verifySession } from "../../../utils/session";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      await createSession(req, res);
      res.send({ message: "success" });
    } else if (req.method === "GET") {
      res.send(await verifySession(req, res));
    } else {
      throw new HttpError("Invalid Method", 405);
    }
  } catch (e: any) {
    res.status(e.status || 500).send({ message: e.message || e });
  }
}
