import {
  getApplication,
  signApplication,
  updateApplication,
} from "@/lib/controllers/applications";
import { mask } from "@/lib/mask";
import { NextResponse } from "next/server";

/**
 * get a single application
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const customer_id = Number(request.headers.get("x-cors-service-customer-id") as string);

  const application = await getApplication(id);

  if (!application) {
    return NextResponse.json(
      { error: "application not found" },
      { status: 404 }
    );
  }

  if (application.owner_id !== customer_id) {
    return NextResponse.json(
      { error: "application not found" },
      { status: 403 }
    );
  }

  const signed = await signApplication(application);

  return NextResponse.json(mask(signed));
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const { id } = params;

  await updateApplication(id, data);

  return NextResponse.json({ success: true }); // or.. updated body?
}
