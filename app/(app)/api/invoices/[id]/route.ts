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
    const invoiceDoc = firestore.collection("invoices").doc(id as string);
    const docSnapshot = await invoiceDoc.get();

    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: "User Invoice not found" },
        { status: 404 }
      );
    }

    const invoice = {
      id: docSnapshot.id,
      ...docSnapshot.data(),
    };

    return NextResponse.json({ invoice }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching user invocie" },
      { status: 500 }
    );
  }
}
