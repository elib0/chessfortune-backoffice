export const userColumns = [
  { name: "Name", uid: "displayName" },
  { name: "Email", uid: "email" },
  { name: "ELO", uid: "elo" },
  { name: "Online Status", uid: "online" },
  { name: "Actions", uid: "actions" },
];

export const identityVerificationColumns = [
  { name: "Name", uid: "displayName" },
  { name: "Identity", uid: "identity" },
  { name: "History", uid: "history" },
];

export const activityHistoryColumns = [
  { name: "Name", uid: "displayName" },
  { name: "Game Played", uid: "gamePlayed" },
  { name: "Transaction", uid: "transaction" },
  // { name: "Timeline", uid: "timeline" },
];

export const activityTimelineColumns = [
  { name: "Action", uid: "action" },
  { name: "Email", uid: "email" },
  { name: "Month", uid: "month" },
  { name: "Time", uid: "time" },
  { name: "Date", uid: "date" },
];

export const invoiceColumns = [
  { name: "Amount", uid: "amount" },
  { name: "User", uid: "user" },
  { name: "Status URL", uid: "statusUrl" },
  { name: "Seed Amount", uid: "seedAmount" },
  { name: "Confirmations", uid: "confirmations" },
  { name: "Currency", uid: "currentCurrency" },
  { name: "Status", uid: "status" },
  { name: "Created At", uid: "createdAt" },
];

export const paymentColumns = [...invoiceColumns];
export const withdrawlColumns = [
  ...invoiceColumns,
  { name: "Actions", uid: "actions" },
];

export const roomColumns = [
  { name: "Game ID", uid: "id" },
  { name: "Bet", uid: "bet" },
  { name: "Timer", uid: "timer" },
  { name: "Created By", uid: "createdBy" },
  { name: "Created At", uid: "createdAt" },
  { name: "Start At", uid: "startAt" },
  { name: "Winner", uid: "winner" },
  { name: "Game Over Reason", uid: "gameOverReason" },
  { name: "Finish At", uid: "finishAt" },
];

export const roomHistoryColumns = [
  { name: "Game ID", uid: "id" },
  { name: "User", uid: "user" },
  { name: "Bet", uid: "bet" },
  { name: "Timer", uid: "timer" },
  { name: "Created By", uid: "createdBy" },
  { name: "Created At", uid: "createdAt" },
  { name: "Analysis", uid: "analysis" },
  { name: "History", uid: "history" },
];

export const financialReportsColumns = [
  { name: "Name", uid: "displayName" },
  { name: "Email", uid: "email" },
  { name: "View", uid: "view" },
];

export const roomsReportsColumns = [
  { name: "Board Side", uid: "boardSide" },
  { name: "Room ID", uid: "roomId" },
  { name: "Text", uid: "text" },
  { name: "Type", uid: "type" },
];

export const liveRoomColumns = [
  { name: "Game ID", uid: "id" },
  { name: "Bet", uid: "bet" },
  { name: "Timer", uid: "timer" },
  { name: "Created By", uid: "createdBy" },
  { name: "Created At", uid: "createdAt" },
  { name: "Player White", uid: "playerWhite" },
  { name: "Player Black", uid: "playerBlack" },
  { name: "Start At", uid: "startAt" },
];

export const gameSettingsColumns = [
  { name: "Game Id", uid: "id" },
  { name: "User", uid: "user" },
  { name: "Game Time", uid: "timer" },
  { name: "Bet Amount", uid: "bet" },
  { name: "Game Over Reason", uid: "gameOverReason" },
  // { name: "Cheat Analysis", uid: "cheatAnalysis" },
  { name: "Actions", uid: "actions" },
];

export const reportsColumns = [
  { name: "Id", uid: "id" },
  { name: "Type", uid: "type" },
  { name: "User ID", uid: "userId" },
  { name: "Amount", uid: "amount" },
  { name: "Category", uid: "category" },
  { name: "Description", uid: "description" },
  { name: "Date", uid: "date" },
  { name: "Actions", uid: "actions" },
];

export const gameReportsColumns = [
  { name: "Game ID", uid: "id" },
  { name: "Bet", uid: "bet" },
  { name: "Timer", uid: "timer" },
  { name: "Created By", uid: "createdBy" },
  { name: "Created At", uid: "createdAt" },
  { name: "Analysis", uid: "analysis" },
];
