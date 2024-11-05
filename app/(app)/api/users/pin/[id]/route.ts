import { firestore } from "@/firebase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params: { id: email } }: { params: { id: string } }
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

    const profilesSnapshot = await firestore
      .collection("profiles")
      .where("email", "==", email)
      .get();

    if (profilesSnapshot.empty) {
      return NextResponse.json(
        { error: "No profile found with the provided email" },
        { status: 404 }
      );
    }

    const batch = firestore.batch();

    profilesSnapshot.forEach((doc) => {
      const docRef = firestore.collection("profiles").doc(doc.id);
      batch.update(docRef, updateProfile);
    });

    await batch.commit();

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
