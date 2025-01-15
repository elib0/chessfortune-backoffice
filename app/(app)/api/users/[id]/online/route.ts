import { revalidatePath } from "next/cache";
import { firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      {
        status: 405,
      }
    );
  }

  try {
    const { online } = await req.json();

    const updateProfile = {
      online,
    };

    await firestore.collection("profiles").doc(id).update(updateProfile);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: `User is ${online ? "Online" : "Offline"}` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Profile" },
      { status: 500 }
    );
  }
}
