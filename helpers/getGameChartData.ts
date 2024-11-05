import convertFirestoreTimestampToDate from "./convertFirestoreTimestampToDate";

export const getGameChartData = (data: any) => {
  const playerCountByDate: Record<string, number> = {};
  const playerCountByDateArray: number[] = [];

  const today = new Date();
  const currentMonth = today.getMonth(); // Get current month (0-11)
  const currentYear = today.getFullYear(); // Get current year

  data.forEach((game: any) => {
    const gameDateObj = convertFirestoreTimestampToDate(game.createdAt as any);
    const gameDate = gameDateObj.toLocaleDateString().split("T")[0];

    const gameMonth = gameDateObj.getMonth(); // Extract month of the game
    const gameYear = gameDateObj.getFullYear(); // Extract year of the game

    // Only process games from the current month and year
    if (gameMonth === currentMonth && gameYear === currentYear) {
      const players = Object.keys(game.players).length; // Count how many players are in the game

      // Initialize the date entry if it doesn't exist
      if (!playerCountByDate[gameDate]) {
        playerCountByDate[gameDate] = 0;
      }

      // Add the players count for the game to the date
      playerCountByDate[gameDate] += players;
    }
  });

  // Convert the player count by date into the desired format
  Object.keys(playerCountByDate).forEach((date) => {
    playerCountByDateArray.push(playerCountByDate[date]);
  });

  return {
    dates: Object.keys(playerCountByDate), // Dates
    data: playerCountByDateArray, // Count of players
  };
};
