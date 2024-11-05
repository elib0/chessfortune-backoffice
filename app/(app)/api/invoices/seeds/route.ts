import { revalidatePath } from "next/cache";
import { firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";
import { InvoiceData } from "@/types";

export async function PUT(req: NextRequest) {
  if (req.method !== "PUT") {
    return NextResponse.json(
      { error: "Method Not Allowed" },
      {
        status: 405,
      }
    );
  }

  try {
    const { ids, seedAmount: amount } = await req.json();

    if (!amount || ids.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const batch = firestore.batch();

    ids.forEach((id: string) => {
      const docRef = firestore.collection("invoices").doc(id);

      docRef.get().then(async (docSnapshot) => {
        const { seedAmount } = docSnapshot.data() as InvoiceData;

        const newSeedAmount = (Number(seedAmount) || 0) + Number(amount);
        batch.update(docRef, { seedAmount: newSeedAmount });
        await batch.commit();
      });
    });

    revalidatePath(req.url);

    return NextResponse.json(
      { message: "Seeds updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Seeds" },
      { status: 500 }
    );
  }
}
