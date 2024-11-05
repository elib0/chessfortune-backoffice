"use client";

import { useState, useEffect } from "react";
import { InvoiceData } from "../../types";
import { httpHeaderOptions } from "@/helpers";

const useFetchInvoicesByUserId = (userId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userInvoices, setUserInvoices] = useState<InvoiceData[] | []>([]);

  useEffect(() => {
    const fetchUserInvoices = async () => {
      setLoading(true);

      try {
        const data = await fetch(`/api/users/invoices/${userId}`, {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { invoices } = await data.json();

        setUserInvoices(invoices);
      } catch (error) {
        console.error("Error fetching user invoices: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserInvoices();
  }, [userId]);

  return { loading, userInvoices };
};

export default useFetchInvoicesByUserId;
