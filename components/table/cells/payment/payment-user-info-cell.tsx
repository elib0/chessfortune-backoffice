"use client";

import { useFetchUserById } from "@/hooks";
import { Skeleton } from "@nextui-org/react";

const PaymentUserInfo = ({ userId }: { userId: string }) => {
  const { user, loading } = useFetchUserById(userId);

  if (!user || loading)
    return (
      <div className="w-full flex flex-col gap-1">
        <Skeleton className="h-3 w-40 rounded-lg" />
        <Skeleton className="h-3 w-48 rounded-lg" />
      </div>
    );

  const { displayName, email } = user;

  return (
    <div className="w-full flex flex-col">
      <h2 className="">{displayName}</h2>
      <h3 className="">{email}</h3>
    </div>
  );
};

export default PaymentUserInfo;
