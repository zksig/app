import nextConnect from "next-connect";
import multer from "multer";
import { HttpError } from "../../utils/HttpError";
import { store } from "../../services/storage";

const upload = multer({
  storage: multer.memoryStorage(),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const router = nextConnect();

router.post(upload.single("file"), async (req, res) => {
  try {
    if (!req.file) throw new HttpError("Error parsing file", 400);

    const file = req.file;
    const cid = await store(file.originalname || "", file.buffer);
    res.send({ message: "success", cid });
  } catch (e: any) {
    res.status(e.status || 500).send({ message: e.message || e });
  }
});

export default router;
