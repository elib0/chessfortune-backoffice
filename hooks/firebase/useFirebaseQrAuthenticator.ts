"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/client";
import {
  TotpSecret,
  multiFactor,
  TotpMultiFactorGenerator,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";

const useFirebaseQrAuthenticator = () => {
  const [user] = useAuthState(auth);
  const [qrUri, setQrUri] = useState<string>("");
  const [authSecret, setAuthSecret] = useState<TotpSecret | null>(null);

  useEffect(() => {
    const generateAuthSecret = async () => {
      try {
        if (!user) return;
        const multiFactorSession = await multiFactor(user).getSession();
        const totpSecret = await TotpMultiFactorGenerator.generateSecret(
          multiFactorSession
        );

        const totpUri = totpSecret.generateQrCodeUrl(
          user.email as string,
          "Chess Fortune"
        );

        toast.success(user.email);

        setQrUri(totpUri);
        setAuthSecret(totpSecret);
      } catch (error: any) {
        toast.error(
          error.message ===
            "Firebase: TOTP based MFA not enabled. (auth/operation-not-allowed)."
            ? "Firebase: TOTP based MFA not enabled"
            : error.message
        );
      }
    };

    if (user) {
      generateAuthSecret();
    }
  }, [user]);

  return {
    qrUri,
    authSecret,
  };
};

export default useFirebaseQrAuthenticator;

// Here This Code is check if the authentication pin from google authenticator and users pin is valid

// const checkVerificationCode = async () => {
//   if (!user) return;

//   const secret = authSecret;

//   if (!secret) return;

//   const multiFactorAssertion =
//     await TotpMultiFactorGenerator.assertionForEnrollment(secret, pin); // here pin means Users input

//   await multiFactor(user).enroll(multiFactorAssertion, user.displayName);
// };
