import { firestore } from "@/firebase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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
    await firestore.collection("roles").doc(id).delete();

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Roles deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Roles" },
      { status: 500 }
    );
  }
}
