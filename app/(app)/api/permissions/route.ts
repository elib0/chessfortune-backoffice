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
    const permissionsCollection = firestore.collection("permissions");
    const querySnapshot = await permissionsCollection
      .orderBy("createdAt", "desc")
      .get();

    const permissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching permissions" },
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
    const { userId, pages, role, email } = await req.json();

    if (!role || !userId || !email) {
      return NextResponse.json(
        { message: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    const permissionsCollection = firestore.collection("permissions");

    const adminExistsSnapshot = await permissionsCollection
      .where("role", "==", "admin")
      .get();

    if (!adminExistsSnapshot.empty && role.toLowerCase() === "admin") {
      return NextResponse.json(
        { message: "Admin Permission already exists" },
        { status: 409 }
      );
    }

    const userExistsSnapshot = await permissionsCollection
      .where("userId", "==", userId)
      .get();

    if (!userExistsSnapshot.empty) {
      return NextResponse.json(
        { message: "Permission has already been assigned to this user" },
        { status: 409 }
      );
    }

    const addRole = {
      role,
      userId,
      email,
      pages: pages || [],
      createdAt: new Date(),
    };

    await permissionsCollection.add(addRole);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Permission created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
