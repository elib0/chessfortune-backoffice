import { revalidatePath } from "next/cache";
import { firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";
import { ProfileData } from "@/types";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
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

    for (const id of ids) {
      const profileRef = firestore.collection("profiles").doc(id);
      const invoiceRef = firestore.collection("invoices").doc();

      const profileSnapshot = await profileRef.get();
      const { seeds } = profileSnapshot.data() as ProfileData;
      const newSeedAmount = (Number(seeds) || 0) + Number(amount);

      batch.update(profileRef, { seeds: newSeedAmount });

      batch.set(invoiceRef, {
        amount: Number(amount),
        statusUrl: "ChessFortune",
        seedAmount: Number(amount),
        confirmations: 1,
        timeout: 0,
        currentAddress: "ChessFortune",
        checkoutUrl: "ChessFortune",
        createdAt: new Date(),
        profileId: id,
        currentCurrency: "usd",
        txnId: "ChessFortune",
        status: "new",
        qrcodeUrl: "ChessFortune",
      });
    }

    await batch.commit();
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
