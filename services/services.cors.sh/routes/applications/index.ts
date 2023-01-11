import * as express from "express";
import { prisma } from "../../clients";
import {
  createApplication,
  signApplication,
} from "../../controllers/applications";

const router = express.Router();

// list all my applications
router.get("/", async (req, res) => {
  const applications = await prisma.application.findMany({
    where: {
      ownerId: res.locals.customer.id,
    },
  });

  res.json(applications);
});

// get a single application
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const application = await prisma.application.findFirst({
    where: {
      id: id,
      owner: {
        id: res.locals.customer.id as string,
      },
    },
  });

  if (!application) {
    return res.status(404).json({ error: "application not found" });
  }

  res.json(application);
});

// create a new application
router.post("/", async (req, res) => {
  //
  const { name } = req.body;

  const app = await createApplication({
    name,
    owner: res.locals.customer,
  });

  const signed = await signApplication(app);

  res.json({
    id: signed.id,
    name: signed.name,
    allowedOrigins: signed.allowedOrigins,
    allowedTargets: signed.allowedTargets,
    // available once
    apikey_test: signed.apikey_test,
    apikey_live: signed.apikey_live,
  });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  await prisma.application.update({
    where: {
      id: id,
    },
    data: {
      ...req.body,
    },
  });

  res.json({ success: true }); // or.. updated body?
});

export default router;
