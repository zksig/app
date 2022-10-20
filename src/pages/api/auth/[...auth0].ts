import { handleAuth, handleCallback, Session } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, UserProfile } from "@prisma/client";

const prisma = new PrismaClient();

const afterCallback = async (
  _: NextApiRequest,
  __: NextApiResponse,
  session: Session,
  ___?: Record<string, any>
) => {
  const profile = await prisma.userProfile.upsert({
    create: { email: session.user.email },
    update: {},
    where: { email: session.user.email },
  });
  return { ...session, user: { ...session.user, ...profile } };
};

export default handleAuth({
  callback: (req: NextApiRequest, res: NextApiResponse) =>
    handleCallback(req, res, { afterCallback }),
});
