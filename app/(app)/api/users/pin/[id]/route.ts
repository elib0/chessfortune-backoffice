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
    const updateProfile = {
      pin: Math.floor(100000 + Math.random() * 900000).toString(),
    };

    await firestore.collection("profiles").doc(id).update(updateProfile);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Updated profile's pin successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Profile's pin" },
      { status: 500 }
    );
  }
}
