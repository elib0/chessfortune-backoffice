import { firestore } from "@/firebase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (req.method !== "PUT") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      {
        status: 405,
      }
    );
  }

  try {
    const { amount, category, description, userId } = await req.json();

    if (!amount || !category || !description || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateReport = {
      amount,
      category,
      description,
      userId,
      createdAt: new Date(),
    };

    await firestore.collection("reports").doc(id).update(updateReport);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Report updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      {
        status: 405,
      }
    );
  }

  try {
    await firestore.collection("reports").doc(id).delete();

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Report deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(`MY Error`, error);
    return NextResponse.json(
      { error: "Failed to delete Report" },
      { status: 500 }
    );
  }
}
