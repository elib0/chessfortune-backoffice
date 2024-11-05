import { firestore } from "../../../../firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  try {
    const invoicesCollectionRef = firestore.collection("invoices");
    const querySnapshot = await invoicesCollectionRef
      .orderBy("createdAt", "desc")
      .get();

    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ invoices }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
