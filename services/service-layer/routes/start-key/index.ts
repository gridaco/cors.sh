import { prisma } from "../../clients";
import * as express from "express";
import { sign_temporary_key } from "keygen";
const router = express.Router();

// send me a api key to get started.
router.post("/with-email", async (req, res) => {
  const { email } = req.body;
  // create temporary key
  sign_temporary_key(email);
  //
});

export default router;
