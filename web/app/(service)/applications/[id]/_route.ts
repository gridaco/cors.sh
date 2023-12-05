// import { Application } from "@prisma/client";
// import { prisma } from "../../clients";
import { signApplication } from "@/lib/controllers/applications";
import { mask } from "@/lib/mask";
import { NextResponse } from "next/server";

/**
 * get a single application
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params;

  console.info("fething application securely", {
    id,
    customer: res.locals.customer,
  });
  const application = await prisma.application.findUnique({
    where: {
      id: id,
    },
  });

  console.info("fetched application", application);

  if (!application) {
    return res.status(404).json({ error: "application not found" });
  }

  if (application.ownerId !== res.locals.customer.id) {
    return res.status(403).json({ error: "application not found" });
  }

  const signed = await signApplication(application);

  res.json(mask(signed));
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const id = params;

  await prisma.application.update({
    where: {
      id: id,
    },
    data: {
      ...data,
    },
  });

  return NextResponse.json({ success: true }); // or.. updated body?
}
