import { authMiddleware } from "../auth";

router.use("/applications", authMiddleware, router_applications);
