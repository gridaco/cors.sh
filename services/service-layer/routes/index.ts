import * as express from "express";
import router_payments from "./payments";

const router = express.Router();

// router.use("/", router_posts);
router.use("/payments", router_payments);

// utils
// router.use("/utils", router_utils);

export default router;
