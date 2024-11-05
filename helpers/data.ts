export const months = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

export const boardThemeSetOptions = [
  { key: "cburnett", label: "Cburnett" },
  { key: "merida", label: "Merida" },
  { key: "tatiana", label: "Tatiana" },
  { key: "dubrovny", label: "Dubrovny" },
  { key: "maestro", label: "Maestro" },
  { key: "leipzig", label: "Leipzig" },
  { key: "chessnut", label: "Chessnut" },
  { key: "mpchess", label: "Mpchess" },
  { key: "caliente", label: "Caliente" },
  { key: "gioco", label: "Gioco" },
  { key: "staunty", label: "Staunty" },
];

export const reportTypes: {
  key: string;
  label: string;
}[] = [
  { key: "income", label: "Income" },
  { key: "expense", label: "Expense" },
];

export const categories: {
  key: string;
  label: string;
}[] = [
  { key: "salary", label: "Salary" },
  { key: "rent", label: "Rent" },
];

export const roles: {
  key: string;
  label: string;
}[] = [
  { key: "staff", label: "Staff" },
  { key: "staff admin", label: "Staff Admin" },
  { key: "admin", label: "Admin" },
];

export const pages = [
  {
    title: "Users",
    pages: [
      { title: "User Management", href: "/users" },
      { title: "Identity Verification", href: "/users/identity-verification" },
      { title: "Activity History", href: "/users/activity-history" },
      { title: "Customer Support", href: "/users/customer-support" },
    ],
  },
  {
    title: "Games",
    pages: [
      { title: "Game Management", href: "/games" },
      { title: "Game History", href: "/games/history" },
      { title: "Live Games", href: "/games/live" },
      { title: "Game Settings", href: "/games/settings" },
    ],
  },
  {
    title: "Reports",
    pages: [
      { title: "Financial Reports", href: "/reports/financial" },
      { title: "Game Reports", href: "/reports/game" },
      { title: "Security Reports", href: "/reports/security" },
      { title: "Custom Reports", href: "/reports/custom" },
      { title: "Room Reports", href: "/reports/room" },
    ],
  },
  {
    title: "Payments",
    pages: [
      { title: "Payment Management", href: "/payments" },
      { title: "Withdrawal Processing", href: "/payments/withdrawal-process" },
      {
        title: "Balances and Movements",
        href: "/payments/balances-and-movements",
      },
      { title: "Payment Gateway Settings", href: "/payments/gateway-settings" },
    ],
  },
  {
    title: "Referrals",
    pages: [
      {
        title: "Referrals Program Overview",
        href: "/referrals/program-overview",
      },
      {
        title: "Referrals Management",
        href: "/referrals/referrals-management",
      },
      { title: "Referrals Rewards", href: "/referrals/rewards" },
    ],
  },
];

export const routes = pages.flatMap((category) =>
  category.pages.map((page) => page.href)
);
