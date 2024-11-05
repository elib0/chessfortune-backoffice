import { firestore } from "@/firebase/server";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (!firestore) {
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }

  try {
    const permissionCollection = firestore.collection("permissions");
    const querySnapshot = await permissionCollection
      .where("userId", "==", id)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "No permissions found for this user." },
        { status: 404 }
      );
    }

    const permissionDoc = querySnapshot.docs[0];
    const permission = {
      id: permissionDoc.id,
      ...permissionDoc.data(),
    };

    return NextResponse.json({ permission }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching permission" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  if (req.method !== "PUT") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { pages } = await req.json();

    if (!Array.isArray(pages) || !pages.length) {
      return NextResponse.json(
        { error: "Missing or invalid pages" },
        { status: 400 }
      );
    }

    const permissionsCollection = firestore.collection("permissions");

    const updatepermission = {
      pages,
    };

    const permissionRef = permissionsCollection.doc(id);
    const permissionSnapshot = await permissionRef.get();

    if (!permissionSnapshot.exists) {
      return NextResponse.json(
        { error: "permission not found" },
        { status: 404 }
      );
    }

    await permissionRef.update(updatepermission);

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "permission updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update permission", details: error.message },
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
    await firestore.collection("permissions").doc(id).delete();

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "permission deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete permission" },
      { status: 500 }
    );
  }
}
