"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeIcon } from "../icons/table/eye-icon";
import { MailIcon } from "../icons/auth/mail-icon";
import { LockIcon } from "../icons/auth/lock-icon";
import { EyeSlashIcon } from "../icons/auth";
import toast from "react-hot-toast";
import { auth } from "@/firebase/client";
import { Loader } from "../shared";
import axios from "axios";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const Login = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const initialValues: LoginFormType = {
    // email: "admin@gmail.com",
    // password: "123456",

    email: "",
    password: "",
  };

  const handleLogin = async ({ email, password }: LoginFormType) => {
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential) {
        const {
          user: { uid },
        } = userCredential;

        let permission;
        try {
          const { data } = await axios.get(`/api/permissions/${uid}`);
          permission = data;
        } catch (permissionError: any) {
          await signOut(auth);
          toast.error(permissionError?.response?.data?.error);
          return;
        }

        if (!permission) {
          await signOut(auth);
          toast.error("You do not have permission to access this application.");
          return;
        }

        await createAuthCookie();

        await axios.post(`/api/activity`, {
          action: "Logged In",
          email,
          profileId: uid,
        });

        setIsLoading(false);
        toast.success("Logged in successfully");
        router.replace("/");
      }
    } catch (error: any) {
      toast.error(
        error.message === "Firebase: Error (auth/invalid-email)."
          ? "Invalid Email Address"
          : error.message === "Firebase: Error (auth/invalid-credential)."
          ? "Invalid Credentials"
          : error?.response?.data?.error || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Login</div>
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
                placeholder="Enter your email address"
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
                startContent={<MailIcon fill="#d0d1d0" />}
              />
              <Input
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                startContent={<LockIcon fill="#d0d1d0" size="1.4em" />}
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
                onChange={handleChange("password")}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant="flat"
              color="primary"
            >
              {isLoading && <Loader size="xs" />}
              Login
            </Button>
          </>
        )}
      </Formik>

      {/* <div className="font-light text-slate-400 mt-4 text-sm">
        Don&apos;t have an account ?{" "}
        <Link href="/register" className="font-bold">
          Register here
        </Link>
      </div> */}
    </>
  );
};
