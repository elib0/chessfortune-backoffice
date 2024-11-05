"use client";

import AppChessBoard from "@/components/chessboard/app-chessboard";
import { ClockIcon, GameIcon, GamePadIcon } from "@/components/icons/sidebar";
import AppContainer from "@/components/shared/app-container";
import Loader from "@/components/shared/loader";
import { convertFirestoreTimestampToDate } from "@/helpers";
import { useFetchRoomById } from "@/hooks";
import { useParams } from "next/navigation";
import { FC } from "react";

const Page: FC = () => {
  const { id } = useParams();
  const { room, loading } = useFetchRoomById(id as string);

  return (
    <AppContainer
      breadCrumbs={[
        {
          icon: <GameIcon />,
          href: "/games/history",
          title: "Game",
        },
        {
          icon: <ClockIcon />,
          href: "/games/history",
          title: "History",
        },
        {
          icon: <GamePadIcon />,
          href: "#",
          title: room?.id as string,
        },
      ]}
    >
      {loading ? (
        <div className="flex items-center mt-12 div justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        room && (
          <div className="grid grid-flow-row grid-cols-4 gap-8 p-6 mx-auto bg-content1 shadow-md rounded-lg w-full">
            {/* Game Info Section */}
            <div className="mb-4 space-y-0.5">
              <div>
                <h2 className="text-xl font-bold mb-2">Game Room:</h2>
                <span className="text-2xl font-bold text-gray-500">
                  {room.id}
                </span>
              </div>

              <p className="text-base text-gray-600">
                Bet: <span className="text-gray-500">{room.bet}</span>
              </p>

              <p className="text-base text-gray-600">
                Timer: <span className="text-gray-500">{room.timer} mins</span>
              </p>

              <p className="text-base text-gray-600">
                Created by:{" "}
                <span className="text-gray-500">
                  {room.createdBy === "w" ? "White" : "Black"}
                </span>
              </p>

              <p className="text-base text-gray-600">
                Started at:{" "}
                <span className="text-gray-500">
                  {convertFirestoreTimestampToDate(
                    room.startAt ? room.startAt : (room.createdAt as any)
                  ).toLocaleString()}
                </span>
              </p>

              <p className="text-base text-gray-600">
                Winner:{" "}
                <span className="text-gray-500">
                  {room.winner === "w" ? "White" : "Black"}
                </span>
              </p>

              <p className="text-base text-gray-600 capitalize">
                Game Over Reason:{" "}
                <span className="text-gray-500">{room.gameOverReason}</span>
              </p>

              {room.finishAt && (
                <p className="text-base text-gray-600">
                  Finished at:{" "}
                  <span className="text-gray-500">
                    {convertFirestoreTimestampToDate(
                      room.finishAt as any
                    ).toLocaleString()}
                  </span>
                </p>
              )}
            </div>

            {/* Players Info Section */}
            {room?.players?.w?.profile && (
              <div>
                <h3 className="text-lg font-semibold">Player White</h3>
                <p className="text-gray-600">
                  Name:{" "}
                  <span className="text-gray-500">
                    {room.players.w.profile.displayName}
                  </span>
                </p>
                <p className="text-gray-600">
                  Elo:{" "}
                  <span className="text-gray-500">
                    {room.players.w.profile.elo}
                  </span>
                </p>
                <p className="text-gray-600">
                  Time Left:{" "}
                  <span className="text-gray-500">
                    {room.players.w.currenTime}s
                  </span>
                </p>
              </div>
            )}

            {room?.players?.b?.profile && (
              <div>
                <h3 className="text-lg font-semibold">Player Black</h3>
                <p className="text-gray-600">
                  Name:{" "}
                  <span className="text-gray-500">
                    {room.players.b.profile.displayName}
                  </span>
                </p>
                <p className="text-gray-600">
                  Elo:{" "}
                  <span className="text-gray-500">
                    {room.players.b.profile.elo}
                  </span>
                </p>
                <p className="text-gray-600 capitalize">
                  Time Left:{" "}
                  <span className="text-gray-500">
                    {room.players.b.currenTime}s
                  </span>
                </p>
              </div>
            )}

            {room?.game?.history ? (
              <div>
                <div className="flex gap-2 justify-center items-center">
                  <span className="text-base font-semibold">Analysis</span>
                  <div className={`bg-content2 p-1 h-fit rounded-xl`}>
                    <AppChessBoard game={room.game.history} />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-base font-medium">No game Available</span>
              </div>
            )}
          </div>
        )
      )}
    </AppContainer>
  );
};

export default Page;
