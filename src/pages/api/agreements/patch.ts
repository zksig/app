import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@auth0/nextjs-auth0";
import { HttpError } from "../../../utils/HttpError";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = getSession(req, res);
    if (!session) {
      throw new HttpError("Unauthorized", 401);
    }

    const agreement = await prisma.agreement.update({
      where: {
        id: req?.body?.id || "",
      },
      data: {
        transactionHash: req?.body?.transactionHash || "",
      }
    });

    res.send(agreement);
  } catch (e: any) {
    res.status(e.status || 500).send({ message: e.message || e });
  }
}