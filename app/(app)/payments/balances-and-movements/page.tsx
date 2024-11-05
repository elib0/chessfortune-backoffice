"use client";

import { ArrowUpIcon } from "@/components/icons/arrow-up-icon";
import { BuildingIcon } from "@/components/icons/building-icon";
import { CreditCardIcon } from "@/components/icons/credit-card-icon";
import { WalletIcon } from "@/components/icons/sidebar";
import { Loader } from "@/components/shared";
import AppContainer from "@/components/shared/app-container";
import { TableWrapper } from "@/components/table";
import { invoiceColumns } from "@/components/table/columns";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { useFetchInvoices } from "@/hooks";
import { Divider } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";
import React from "react";

import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

type paymentType = "pay" | "withdraw";

const cardStyle =
  `flex items-center justify-start gap-8 rounded-xl shadow-lg p-6` as string;

const Page = () => {
  const { invoices, loading } = useFetchInvoices();

  if (loading)
    return (
      <div className="flex justify-center items-center mt-40">
        <Loader size="lg" />
      </div>
    );

  if (!loading && !invoices?.length)
    return (
      <div className="text-center mt-40">
        <h4 className="text-xl font-semibold capitalize">{`No Balances and Movements Available`}</h4>
        <p className="text-gray-500 mt-2">
          {`
          We couldn’t find any Balances and Movements data. Please check back later or contact support
          if you think this is an error.
          `}
        </p>
      </div>
    );

  const getPayments = (type: paymentType) =>
    invoices?.length > 0
      ? invoices.filter(
          ({ amount, status }) =>
            status === "completed" && (type === "pay" ? amount > 0 : amount < 0)
        )
      : [];

  const getLength = (type: paymentType) => getPayments(type).length | 0;

  const getAmount = (type: paymentType) =>
    getPayments(type).reduce(
      (prevAmt, curAmt) => prevAmt + Math.abs(curAmt.amount),
      0
    );

  const dates = invoices.map(({ createdAt }) =>
    convertFirestoreTimestampToDate(createdAt as any).toLocaleDateString()
  );

  const chartOptions: ApexOptions = {
    series: [
      {
        color: "#60ca65",
        name: "Payed Amount",
        // data: [0, 200, 800, 400, 200, 300, 400, 200, 300],
        data: [0, ...getPayments("pay").map(({ amount }) => amount)],
      },
      {
        color: "#f04a61",
        name: "Withdrawn Amount",
        // data: [0, 400, 100, 300, 600, 200, 700, 200, 500],
        data: [0, ...getPayments("withdraw").map(({ amount }) => amount)],
      },
    ],
    chart: {
      foreColor: "#a0a0a9",
      height: 300,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Payments and Withdrawals Over Time",
      align: "left",
    },
    grid: {
      show: false,
    },
    xaxis: {
      categories: dates,
    },
  };

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
          href: "/payments/balances-and-movements",
          title: "Balances and Movements",
        },
      ]}
    >
      <div className="w-full">
        <div className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-6 justify-center w-full">
          <div className={`${cardStyle} bg-primary`}>
            <CreditCardIcon height={100} width={100} />
            <Divider
              orientation="vertical"
              className="bg-default-foreground w-1.5 rounded"
            />
            <div className="flex flex-col text-start gap-2.5">
              <h2 className="text-2xl font-bold">Payments</h2>
              <h3 className="text-xl font-semibold">{`Transaction: ${getLength(
                "pay"
              )}`}</h3>
              <h3 className="text-lg font-semibold">{`Amount: $${getAmount(
                "pay"
              )}`}</h3>
            </div>
          </div>
          <div className={`${cardStyle} bg-warning`}>
            <ArrowUpIcon height={100} width={100} />
            <Divider
              orientation="vertical"
              className="bg-default-foreground w-1.5 rounded"
            />
            <div className="flex flex-col text-start gap-2.5">
              <h2 className="text-2xl font-bold">Withdraws</h2>
              <h3 className="text-xl font-semibold">{`Transaction: ${getLength(
                "withdraw"
              )}`}</h3>
              <h3 className="text-lg font-semibold">{`Amount: $${getAmount(
                "withdraw"
              )}`}</h3>
            </div>
          </div>
          <div className={`${cardStyle} bg-secondary`}>
            <BuildingIcon height={100} width={100} />
            <Divider
              orientation="vertical"
              className="bg-default-foreground w-1.5 rounded"
            />
            <div className="flex flex-col text-start gap-2.5">
              <h2 className="text-2xl font-bold">Current Balance</h2>
              <h3 className="text-xl font-semibold">{`Transaction: ${
                getLength("pay") + getLength("withdraw")
              }`}</h3>
              <h3 className="text-lg font-semibold">{`Amount: $${
                getAmount("pay") - getAmount("withdraw")
              }`}</h3>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl shadow my-6 bg-content1 w-full">
          <ApexCharts
            options={chartOptions}
            series={chartOptions.series}
            type="line"
            height={300}
          />
        </div>
        <TableWrapper
          isLoading={loading}
          data={getPayments("pay")}
          columns={invoiceColumns}
          cell={"invoices"}
          title="Balance and Movements"
          showDateFilter={true}
          showExportIcon={true}
          csvData={{
            fileName: "balance-and-movements.csv",
            data: getPayments("pay"),
          }}
        />
      </div>
    </AppContainer>
  );
};

export default Page;
