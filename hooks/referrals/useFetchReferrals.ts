"use client";

import { Referral } from "@/types";
import { useState, useEffect } from "react";
import { httpHeaderOptions } from "@/helpers";

const useFetchReferrals = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);

      try {
        const data = await fetch("/api/referrals", {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { referrals: referralsData } = await data.json();

        setReferrals(referralsData);
      } catch (error) {
        console.error("Error fetching Referrals: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  return { loading, referrals };
};

export default useFetchReferrals;
