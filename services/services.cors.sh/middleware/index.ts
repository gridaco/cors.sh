import { prisma } from "../clients";
import Axios from "axios";

const authclient = Axios.create({
  baseURL: "https://accounts.services.grida.co",
});

export async function authMiddleware(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // request auth server for authentication.
    const { data } = await authclient.get("/verify", {
      //  ?
      // TODO:
    });

    const customer = await prisma.customer.findUnique({
      where: {
        workspaceId: data.id,
      },
    });

    res.locals.customer = customer;
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
