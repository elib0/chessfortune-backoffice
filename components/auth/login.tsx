"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { EyeIcon } from "../icons/table/eye-icon";
import { MailIcon } from "../icons/auth/mail-icon";
import { LockIcon } from "../icons/auth/lock-icon";
import { EyeSlashIcon } from "../icons/auth";
import LanguageTranslator from "../translator/language-translator";
import toast from "react-hot-toast";
import { auth } from "@/firebase/client";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Loader } from "../shared";
import axios from "axios";

export const Login = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [signInWithEmailAndPassword, loading] =
    useSignInWithEmailAndPassword(auth);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const initialValues: LoginFormType = {
    email: "admin@gmail.com",
    password: "123456",
  };

  const handleLogin = useCallback(
    async ({ email, password }: LoginFormType) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          email,
          password
        );

        if (userCredential) {
          const {
            user: { uid },
          } = userCredential;

          await createAuthCookie();

          await axios.post(`/api/activity`, {
            action: "Logged In",
            email,
            profileId: uid,
          });

          toast.success("Loggeed in successfully");
          router.replace("/");
        }
      } catch (error: any) {
        toast.error(
          error.message === "Firebase: Error (auth/invalid-email)."
            ? "Invalid Email Address"
            : error.message === "Firebase: Error (auth/invalid-credential)."
            ? "Invalid Password"
            : "Something went wrong"
        );
      }
    },
    [router]
  );

  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Login</div>
      <LanguageTranslator />
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-1/2 gap-4 mb-4">
              <Input
                variant="bordered"
                label="Email"
                type="email"
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
                startContent={<MailIcon fill="#d0d1d0" />}
              />
              <Input
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                startContent={<LockIcon fill="#d0d1d0" />}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? (
                      <EyeSlashIcon fill="#d0d1d0" />
                    ) : (
                      <EyeIcon fill="#d0d1d0" size={16} />
                    )}
                  </button>
                }
                value={values.password}
                className="w-full"
                type={isVisible ? "text" : "password"}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant="flat"
              color="primary"
            >
              {loading && <Loader size="xs" />}
              Login
            </Button>
          </>
        )}
      </Formik>

      <div className="font-light text-slate-400 mt-4 text-sm">
        Don&apos;t have an account ?{" "}
        <Link href="/register" className="font-bold">
          Register here
        </Link>
      </div>
    </>
  );
};
