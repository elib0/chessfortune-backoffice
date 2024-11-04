import { revalidatePath } from "next/cache";
import { firestore } from "../../../../firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  if (!firestore)
    return new NextResponse("Internal Server Error", {
      status: 500,
    });

  try {
    const reportsCollection = firestore.collection("reports");
    const querySnapshot = await reportsCollection.get();

    const reports = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
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
    const { amount, category, description, userId } = await req.json();

    if (!amount || !category || !description || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createReport = {
      type: "income/expense",
      amount,
      category,
      description,
      userId,
      createdAt: new Date(),
    };

    await firestore.collection("reports").add(createReport);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Report created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Report" },
      { status: 500 }
    );
  }
}
