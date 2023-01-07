import * as express from "express";
import { prisma } from "../../clients";
import { sign_live_key, sign_temporary_key, sign_test_key } from "../../keygen";

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

// create a new application
router.post("/", async (req, res) => {
  //
  const { name } = req.body;
  const { id: customer_id } = res.locals.customer;
  const application = await prisma.application.create({
    data: {
      name: name,
      owner: {
        connect: {
          id: customer_id,
        },
      },
    },
  });

  const payload = {
    ...application,
    apikey_test: sign_test_key({
      app_id: application.id,
      owner_id: customer_id,
    }),
    apukey_live: sign_live_key({
      app_id: application.id,
      owner_id: customer_id,
    }),
  };

  res.json(payload);
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
