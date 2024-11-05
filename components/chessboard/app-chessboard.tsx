"use client";

import { useEffect, useState } from "react";
import { GameHistory } from "@/types";
import { Chessboard } from "react-chessboard";
import { InfoIcon } from "../icons/accounts/info-icon";
import { ArrowLeftIcon } from "../icons/arrow-left-icon";
import { ArrowRightIcon } from "../icons/arrow-right-icon";
import { SearchScanIcon } from "../icons/search-scan-icon";
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  Chip,
} from "@nextui-org/react";

const AppChessBoard = ({ game }: { game: GameHistory[] }) => {
  const [moveIndex, setMoveIndex] = useState(0);
  const [userMove, setUserMove] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isInfoOpen,
    onOpen: onInfoOpen,
    onOpenChange: onInfoOpenChange,
  } = useDisclosure();
  const [analysis, setAnalysis] = useState<string>("");
  const [validMove, setValidMove] = useState<string>("");

  const [currentFen, setCurrentFen] = useState(game[0]?.before || "start");

  useEffect(() => {
    const stockfish = new Worker("/stockfish/stockfish.js");

    stockfish.onmessage = (event) => {
      const output = event.data;

      if (output.includes("info") || output.includes("bestmove")) {
        setAnalysis(output);

        const bestMoveMatch = output.match(/bestmove (\w+)/);
        if (bestMoveMatch) {
          const bestMove = bestMoveMatch[1];

          if (userMove) {
            if (userMove !== bestMove) {
              setValidMove(
                `Suspicious move detected: ${userMove}. Best move is ${bestMove}.`
              );
            } else {
              setValidMove(`Move ${userMove} is valid.`);
            }
          }
        }
      }
    };

    stockfish.postMessage("uci");
    stockfish.postMessage(`position fen ${currentFen}`);
    stockfish.postMessage("go depth 15");

    return () => {
      stockfish.terminate();
    };
  }, [currentFen, userMove]);

  const handleMove = (direction: "left" | "right") => {
    let newIndex = moveIndex;

    if (direction === "left" && moveIndex > 0) {
      newIndex = moveIndex - 1;
    } else if (direction === "right" && moveIndex < game.length - 1) {
      newIndex = moveIndex + 1;
    }

    setMoveIndex(newIndex);
    setCurrentFen(game[newIndex].before);

    // Capture the user's move
    const move = game[newIndex]?.san; // San notation of the current move
    setUserMove(move); // Update the userMove state
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
          <div className="p-3 space-y-3">
            <div className="relative p-6 mx-auto bg-content2 shadow-md rounded-xl w-full">
              <Chessboard
                allowDragOutsideBoard={false}
                arePiecesDraggable={false}
                id="BasicBoard"
                position={currentFen}
              />
            </div>
            {/* Display Stockfish analysis */}
            {analysis && (
              <div className="flex flex-col justify-center items-center p-2 px-4 mx-auto bg-content2 shadow-md rounded-xl w-fit">
                <h4 className="font-bold underline underline-offset-4">
                  Analysis
                </h4>
                <p className="font-medium capitalize text-success text-center">
                  {analysis}
                </p>
              </div>
            )}
            {/* Display Valid Moves */}
            {validMove && (
              <div className="flex flex-col justify-center items-center w-full">
                <Chip
                  radius="sm"
                  className="py-4"
                  color={validMove.startsWith("S") ? "danger" : "success"}
                >
                  <span
                    className={`font-semibold capitalize text-sm text-center`}
                  >
                    {validMove}
                  </span>
                </Chip>
              </div>
            )}
            <div className={`flex items-center justify-between`}>
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
