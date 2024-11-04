"use client";

import { useState, useEffect } from "react";
import { RoomData } from "../../types";
import { httpHeaderOptions } from "@/helpers";

const useFetchRooms = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [rooms, setRooms] = useState<RoomData[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/rooms", {
          ...httpHeaderOptions,
        });
        const { rooms: roomsData } = await response.json();

        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return { loading, rooms };
};

export default useFetchRooms;
