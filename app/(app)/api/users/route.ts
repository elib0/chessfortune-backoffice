import { revalidatePath } from "next/cache";
import { adminAuth, firestore } from "../../../../firebase/server";
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
    const profilesCollection = firestore.collection("profiles");
    const querySnapshot = await profilesCollection
      .orderBy("createdAt", "desc")
      .get();

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
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );

  try {
    const {
      displayName,
      email,
      password,
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

    if (!displayName?.trim() || !email?.trim() || !password?.trim() || !set) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const profilesCollection = firestore.collection("profiles");

    const emailExistsSnapshot = await profilesCollection
      .where("email", "==", email.trim())
      .get();

    if (!emailExistsSnapshot.empty) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const updateProfile = {
      config: {
        boardTheme: {
          set: set || "cburnett",
          theme: theme || 0,
        },
        chat,
        sound,
      },
      displayName: displayName.trim(),
      email: email.trim(),
      elo: 0,
      online,
      photoURL: photoURL.trim() || "",
      referred: "",
      seeds: seeds || 0,
      statistics: {
        loses: loses || 0,
        win: win || 0,
      },
      createdAt: new Date(),
    };

    const authUser = await adminAuth.createUser({
      email,
      password,
    });

    await profilesCollection.doc(authUser.uid).set(updateProfile);

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
