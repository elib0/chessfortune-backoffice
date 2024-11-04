"use client";

import { useState, useEffect } from "react";
import { RoomData } from "../../types";
import { httpHeaderOptions } from "@/helpers";

const useFetchRoomById = (userId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [room, setRoom] = useState<RoomData | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);

      try {
        const data = await fetch(`/api/rooms/${userId}`, {
          method: "GET",
          ...httpHeaderOptions,
        });
        const { room: roomData } = await data.json();

        setRoom(roomData);
      } catch (error) {
        console.error("Error fetching rooms by user ID: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchRooms();
  }, [userId]);

  return { loading, room };
};

export default useFetchRoomById;
