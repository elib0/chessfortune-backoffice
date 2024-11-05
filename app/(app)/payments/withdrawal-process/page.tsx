"use client";

import React from "react";
import { useFetchInvoices } from "@/hooks";
import { withdrawlColumns } from "@/components/table/columns";
import AppContainer from "@/components/shared/app-container";
import WalletIcon from "@/components/icons/sidebar/wallet-icon";
import { PaymentTable } from "@/components/table/payment/payment-table";

const Page = () => {
  const { invoices, loading } = useFetchInvoices();
  const paymentInvoice =
    invoices?.length > 0 ? invoices.filter(({ amount }) => amount > 0) : [];

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <WalletIcon />,
          href: "/payments",
          title: "Payments",
        },
        {
          icon: <WalletIcon />,
          href: "/payments/withdrawal-process",
          title: "Withdrawal Processing",
        },
      ]}
    >
      <PaymentTable
        isLoading={loading}
        data={paymentInvoice}
        columns={withdrawlColumns}
        title={`Withdrawals`}
        table="withdrawal"
      />
    </AppContainer>
  );
};

export default Page;
