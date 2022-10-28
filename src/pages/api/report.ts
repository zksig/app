import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAllAgreements,
  getAllSignatures,
  getAllSolanaProfiles,
} from "../../services/solana";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [profiles, agreements, signatures] = await Promise.all([
      getAllSolanaProfiles(),
      getAllAgreements(),
      getAllSignatures(),
    ]);

    res.send({
      agreementsCount: agreements.length,
      signaturesCount: signatures.length,
      profilesCount: profiles.length,
      agreements,
      signatures,
      profiles,
    });
  } catch (e) {
    res.status(500).send({ message: "failed" });
  }
}
