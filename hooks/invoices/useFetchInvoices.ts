"use client";

import { useState, useEffect } from "react";
import { InvoiceData } from "@/types";
import { httpHeaderOptions } from "@/helpers";

const useFetchInvoices = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);

      try {
        const data = await fetch("/api/invoices", {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { invoices: invoiceData } = await data.json();

        setInvoices(invoiceData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return { loading, invoices };
};

export default useFetchInvoices;