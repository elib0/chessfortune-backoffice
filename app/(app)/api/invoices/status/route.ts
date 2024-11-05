import { firestore } from "@/firebase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  if (req.method !== "PUT") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      {
        status: 405,
      }
    );
  }

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateStatus = {
      status,
      createdAt: new Date(),
    };

    await firestore.collection("invoices").doc(id).update(updateStatus);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Status updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to updated status" },
      { status: 500 }
    );
  }
}
