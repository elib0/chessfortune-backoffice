import { firestore } from "@/firebase/server";
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
    const referralsDocs = [] as any;
    const collections = await firestore.listCollections();

    for (const collection of collections) {
      if (collection.id.startsWith("referred")) {
        const profileId = collection.id.split("_")[1];

        const profileSnapshot = await firestore
          .collection("profiles")
          .doc(profileId)
          .get();

        if (!profileSnapshot.exists) continue;

        const profileData = profileSnapshot.data();
        if (!profileData) continue;

        const profiles = {
          id: profileSnapshot.id,
          email: profileData.email,
          photoURL: profileData.photoURL,
          displayName: profileData.displayName,
        };

        const referredSnapshot = await firestore
          .collection(`referred_${profileId}`)
          .get();

        if (referredSnapshot.empty) continue;
        const referrals = await Promise.all(
          referredSnapshot.docs.map(async (doc) => {
            const referredUserId = doc.id;
            const referredUserSnapshot = await firestore
              .collection("profiles")
              .doc(referredUserId)
              .get();

            if (!referredUserSnapshot.exists) {
              return null;
            }

            const referredUserData = referredUserSnapshot.data();

            return {
              id: referredUserId,
              photoURL: referredUserData?.photoURL || "",
              displayName: referredUserData?.displayName || "",
              email: referredUserData?.email || "",
              onine: referredUserData?.online || false,
              amount: referredUserData?.amount || 0,
              status: doc.data().status,
              createdAt: doc.data().createdAt,
            };
          })
        );

        const validReferrals = referrals.filter(
          (referral) => referral !== null
        );

        referralsDocs.push({
          ...profiles,
          referrals: validReferrals,
        });
      }
    }

    return NextResponse.json({ referrals: referralsDocs }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
