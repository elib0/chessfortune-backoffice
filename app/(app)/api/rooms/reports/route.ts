import { firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  try {
    const roomsCollectionRef = firestore.collection("roomReports");
    const querySnapshot = await roomsCollectionRef.get();

    const roomReports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ roomReports }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
