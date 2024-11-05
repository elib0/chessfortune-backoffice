import { firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params: { id: email } }: { params: { id: string } }
) {
  if (!firestore)
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );

  try {
    const userCollection = firestore.collection("profiles");
    const querySnapshot = await userCollection
      .where("email", "==", email)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = querySnapshot.docs[0];
    const user = {
      id: userDoc.id,
      ...userDoc.data(),
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}
