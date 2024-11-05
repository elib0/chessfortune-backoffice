import { firestore } from "@/firebase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (!firestore)
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );

  try {
    const rommsDoc = firestore.collection("rooms").doc(id as string);
    const docSnapshot = await rommsDoc.get();

    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: "User Rooms not found" },
        { status: 404 }
      );
    }

    const room = {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    };
    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching rooms" },
      { status: 500 }
    );
  }
}

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
    const { timer, bet, gameOverReason } = await req.json();

    if (!timer || !bet || !gameOverReason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateGame = {
      timer,
      bet,
      gameOverReason,
    };

    await firestore.collection("rooms").doc(id).update(updateGame);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Game updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Game" },
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
    await firestore.collection("rooms").doc(id).delete();

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Game deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete Game" },
      { status: 500 }
    );
  }
}
