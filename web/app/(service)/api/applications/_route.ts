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
export async function GET(request: Request) {
  const customer_id = Number(request.headers.get("x-cors-service-customer-id") as string);
  const applications = await getMyApplications(customer_id);

  return NextResponse.json(applications);
}

/**
 * create a new application
 */
export async function POST(request: Request) {
  const customer_id = Number(request.headers.get("x-cors-service-customer-id") as string);
  const { name } = await request.json();

  const app = await createApplication({
    name,
    owner: { id: customer_id },
  });

  const signed = await signApplication(app);

  return NextResponse.json(mask(signed));
}
