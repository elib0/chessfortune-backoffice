import { RoomData } from "@/types";
import { firestore } from "../../../../firebase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  try {
    const roomsCollectionRef = firestore.collection("rooms");
    const querySnapshot = await roomsCollectionRef
      .orderBy("createdAt", "desc")
      .get();

    const rooms: RoomData[] = querySnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as RoomData)
      )
      .filter((room): room is RoomData => room?.createdAt !== undefined);

    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
