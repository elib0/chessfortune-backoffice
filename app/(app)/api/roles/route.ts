import { firestore } from "@/firebase/server";
import { revalidatePath } from "next/cache";
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
    const rolesCollection = firestore.collection("roles");
    const querySnapshot = await rolesCollection
      .orderBy("createdAt", "desc")
      .get();

    const roles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ roles }, { status: 200 });
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
    const { role } = await req.json();

    if (!role?.trim()) {
      return NextResponse.json(
        { message: "Missing required field role" },
        { status: 400 }
      );
    }

    const rolesCollection = firestore.collection("roles");

    const roleExistsSnapshot = await rolesCollection
      .where("role", "==", role.trim())
      .get();

    if (!roleExistsSnapshot.empty) {
      return NextResponse.json(
        { message: "Role already exists" },
        { status: 409 }
      );
    }

    await rolesCollection.add({ role, createdAt: new Date() });

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Role created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Role" },
      { status: 500 }
    );
  }
}
