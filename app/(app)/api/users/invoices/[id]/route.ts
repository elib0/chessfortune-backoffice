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
    const invoiceDoc = firestore
      .collection("invoices")
      .where("profileId", "==", id);
    const querySnapshot = await invoiceDoc.get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "User Invoice not found" },
        { status: 404 }
      );
    }

    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ invoices }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user invocie" },
      { status: 500 }
    );
  }
}
