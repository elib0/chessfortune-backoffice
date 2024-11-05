"use client";

import WalletIcon from "@/components/icons/sidebar/wallet-icon";
import AppContainer from "@/components/shared/app-container";
import { paymentColumns } from "@/components/table/columns";
import { PaymentTable } from "@/components/table/payment/payment-table";
import { useFetchInvoices } from "@/hooks";
import React from "react";

const Page = () => {
  const { invoices, loading } = useFetchInvoices();

  const paymentInvoice =
    invoices?.length > 0
      ? invoices.filter(
          ({ amount, status }) =>
            (status === "completed" || status === "expired") && amount > 0
        )
      : [];

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <WalletIcon />,
          href: "/payments",
          title: "Payments",
        },
      ]}
    >
      <PaymentTable
        isLoading={loading}
        data={paymentInvoice}
        columns={paymentColumns}
        title={`Payments`}
        table="payment"
        showSeedRange={true}
      />
    </AppContainer>
  );
};

export default Page;
