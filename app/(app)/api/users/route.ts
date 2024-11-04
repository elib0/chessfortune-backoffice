import { revalidatePath } from "next/cache";
import { firestore } from "../../../../firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  if (!firestore)
    return new NextResponse("Internal Server Error", {
      status: 500,
    });

  try {
    const profilesCollection = firestore.collection("profiles");
    const querySnapshot = await profilesCollection.get();

    const profiles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ profiles }, { status: 200 });
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

  if (!firestore)
    return new NextResponse("Internal Server Error", {
      status: 500,
    });

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

    await firestore.collection("profiles").add(updateProfile);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Profile created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Profile" },
      { status: 500 }
    );
  }
}
