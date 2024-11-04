"use client";

import { useState } from "react";
import { GameHistory } from "@/types";
import { Chessboard } from "react-chessboard";
import { InfoIcon } from "../icons/accounts/info-icon";
import { ArrowLeftIcon } from "../icons/arrow-left-icon";
import { ArrowRightIcon } from "../icons/arrow-right-icon";
import { SearchScanIcon } from "../icons/search-scan-icon";
import { Modal, ModalContent, Button, useDisclosure } from "@nextui-org/react";

const AppChessBoard = ({ game }: { game: GameHistory[] }) => {
  const [moveIndex, setMoveIndex] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isInfoOpen,
    onOpen: onInfoOpen,
    onOpenChange: onInfoOpenChange,
  } = useDisclosure();

  const [currentFen, setCurrentFen] = useState(game[0]?.before || "start");

  const handleMove = (direction: "left" | "right") => {
    let newIndex = moveIndex;

    if (direction === "left" && moveIndex > 0) {
      newIndex = moveIndex - 1;
    } else if (direction === "right" && moveIndex < game.length - 1) {
      newIndex = moveIndex + 1;
    }

    setMoveIndex(newIndex);
    setCurrentFen(game[newIndex].before);
  };

  return (
    <>
      <Button onPress={onOpen} className="p-0 bg-transparent" isIconOnly>
        <SearchScanIcon />
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        closeButton={<></>}
      >
        <ModalContent>
          <div className="p-3">
            <div className="relative p-6 mx-auto bg-content2 shadow-md rounded-xl w-full">
              <Chessboard
                allowDragOutsideBoard={false}
                arePiecesDraggable={false}
                id="BasicBoard"
                position={currentFen}
              />
            </div>
            <div className={`flex items-center justify-between mt-2`}>
              <Button isIconOnly>{moveIndex}</Button>

              <div className="flex items-center justify-between mx-auto p-2 bg-content2 rounded-xl w-fit space-x-2">
                <Button isIconOnly onClick={() => handleMove("left")}>
                  <ArrowLeftIcon />
                </Button>
                {game && (
                  <div className="flex items-center justify-center bg-content1 min-w-32 h-10 rounded-xl py-2 px-4">
                    {`Move: ${game[moveIndex]?.san}`}
                  </div>
                )}
                <Button isIconOnly onClick={() => handleMove("right")}>
                  <ArrowRightIcon />
                </Button>
              </div>

              <Button isIconOnly onPress={onInfoOpen}>
                <InfoIcon />
              </Button>
              <Modal
                isOpen={isInfoOpen}
                onOpenChange={onInfoOpenChange}
                size="5xl"
              >
                <ModalContent>
                  {(onClose) => (
                    <div className="text-center p-4 space-y-4 w-full">
                      <h3 className="text-lg font-semibold mb-2">Game Moves</h3>
                      <div className="grid grid-flow-row grid-cols-3 xl:grid-cols-4 gap-2">
                        {game.map((move, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-content2 p-2 rounded-md capitalize"
                          >
                            <span className="text-sm font-semibold text-gray-500">
                              Move {index + 1}:
                            </span>
                            <span className="text-sm">
                              {`${move.san} (${move.color}) : ${move.from} ➔ ${move.to}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AppChessBoard;
