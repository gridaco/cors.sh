import {
  createApplication,
  getMyApplications,
  signApplication,
} from "@/lib/controllers/applications";
import { mask } from "@/lib/mask";
import { NextResponse } from "next/server";

/**
 * list all my applications
 */
export async function GET() {
  const applications = await getMyApplications(res.locals.customer.id);

  return NextResponse.json(applications);
}

/**
 * create a new application
 */
export async function POST() {
  const { name } = req.body;

  const app = await createApplication({
    name,
    owner: res.locals.customer,
  });

  const signed = await signApplication(app);

  return NextResponse.json(mask(signed));
}
