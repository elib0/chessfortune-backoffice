import { firestore } from "../../../../firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  if (!firestore)
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );

  try {
    const activitiesCollection = firestore.collection("activity");
    const querySnapshot = await activitiesCollection
      .orderBy("createdAt", "desc")
      .get();

    const activities = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching activity" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      {
        status: 405,
      }
    );
  }

  try {
    const { profileId, email, action } = await req.json();

    if (!email || !profileId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const activity = {
      email,
      action,
      profileId,
      createdAt: new Date(),
    };

    await firestore.collection("activity").add(activity);

    return NextResponse.json(
      { message: "Activity created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Profile" },
      { status: 500 }
    );
  }
}
