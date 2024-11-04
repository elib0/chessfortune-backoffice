import { firestore } from "@/firebase/server";
import { revalidatePath } from "next/cache";
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
    const userDoc = firestore.collection("profiles").doc(id as string);
    const docSnapshot = await userDoc.get();

    if (!docSnapshot.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
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
    const {
      displayName,
      email,
      photoURL,
      online,
      config: {
        boardTheme: { set, theme },
        chat,
        sound,
      },
      statistics: { win, loses },
      seeds,
    } = await req.json();

    if (!displayName || !email || !set) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const updateProfile = {
      config: {
        boardTheme: {
          set,
          theme: theme || 0,
        },
        chat,
        sound,
      },
      displayName,
      elo: 0,
      email,
      online,
      photoURL,
      referred: "",
      seeds: seeds || 0,
      statistics: {
        loses: loses || 0,
        win: win || 0,
      },
      createdAt: new Date(),
    };

    await firestore.collection("profiles").doc(id).update(updateProfile);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(`MY Error`, error);
    return NextResponse.json(
      { error: "Failed to update Profile" },
      { status: 500 }
    );
  }
}
