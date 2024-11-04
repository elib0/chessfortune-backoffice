import { firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (!firestore)
    return new NextResponse("Internal Server Error", {
      status: 500,
    });

  try {
    const activityDoc = firestore.collection("activity");

    const docSnapshot = await activityDoc
      .where("profileId", "==", id)
      .orderBy("createdAt", "desc")
      .get();

    if (docSnapshot.empty) {
      return NextResponse.json({ activities: [] }, { status: 200 });
    }

    const activities = docSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching activities" },
      { status: 500 }
    );
  }
}
