"use client";

import { useState, useEffect } from "react";
import { RoomsReports } from "../../types";
import { httpHeaderOptions } from "@/helpers";

const useFetchRoomsReports = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<RoomsReports[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/rooms/reports", {
          ...httpHeaderOptions,
        });
        const { roomReports } = await response.json();

        setRooms(roomReports);
      } catch (error) {
        console.error("Error fetching rooms report: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { loading, rooms };
};

export default useFetchRoomsReports;
