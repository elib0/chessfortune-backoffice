import { usePathname } from "next/navigation";
import {
  ReportsIcon,
  SettingsIcon,
  ActivityIcon,
  BadgeCheckIcon,
  BookOpenIcon,
  DashboardIcon,
  GameIcon,
  GiftIcon,
  HistoryIcon,
  PieChartIcon,
  PlayIcon,
  ShareIcon,
  SupportIcon,
  UserCogIcon,
  UserGroupIcon,
  UserIcon,
  WalletIcon,
} from "../icons/sidebar";
import { useSidebarContext } from "../layout/layout-context";
import { SidebarItem } from "./sidebar-item";
import { Sidebar } from "./sidebar.styles";
import BriefcaseIcon from "../icons/sidebar/brifecase-icon";
import GamepadIcon from "../icons/sidebar/game-pad-icon";
import { CollapseIconItems } from "./collapse-icon-item";
import { LockIcon } from "../icons/auth";
import { Logo } from "../shared";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <div className="flex justify-center items-center p-4 rounded-xl bg-content1 w-full">
            <Logo />
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-6 h-full">
          {/* // Dashboard Menu */}
          <SidebarItem
            isActive={pathname === "/"}
            icon={<DashboardIcon />}
            href="/"
            title="Dashboard"
          />

          {/* // Users Menu */}
          <CollapseIconItems
            icon={<UserGroupIcon />}
            items={[
              {
                icon: <UserGroupIcon />,
                href: "/users",
                title: "User Management",
              },
              {
                icon: <BadgeCheckIcon />,
                href: "/users/identity-verification",
                title: "Identity Verification",
              },
              {
                icon: <ActivityIcon />,
                href: "/users/activity-history",
                title: "Activity History",
              },
              // {
              //   icon: <LockIcon fill="#969696" />,
              //   href: "/users/access-control",
              //   title: "Access Control",
              // },
              {
                icon: <SupportIcon />,
                href: "/users/customer-support",
                title: "Customer Support",
              },
            ]}
            title="Users"
          />

          {/* // Games Menu */}
          <CollapseIconItems
            icon={<GameIcon />}
            items={[
              {
                icon: <GamepadIcon />,
                href: "/games",
                title: "Game Management",
              },
              {
                icon: <HistoryIcon />,
                href: "/games/history",
                title: "Game History",
              },
              {
                icon: <PlayIcon />,
                href: "/games/live",
                title: "Live Games",
              },
              {
                icon: <SettingsIcon />,
                href: "/games/settings",
                title: "Game Settings",
              },
            ]}
            title="Games"
          />

          {/* // Staff Menu */}
          <CollapseIconItems
            icon={<UserIcon />}
            items={[
              {
                icon: <UserCogIcon />,
                href: "/staff",
                title: "Staff Management",
              },
              {
                icon: <ActivityIcon />,
                href: "/staff/activity-monitoring",
                title: "Activity Monitoring",
              },
              {
                icon: <BookOpenIcon />,
                href: "/staff/training-and-awareness",
                title: "Training and Awareness",
              },
            ]}
            title="Staff"
          />

          {/* // Reports Menu */}
          <CollapseIconItems
            icon={<ReportsIcon />}
            items={[
              {
                icon: <ReportsIcon />,
                href: "/reports/financial",
                title: "Financial Reports",
              },
              {
                icon: <ReportsIcon />,
                href: "/reports/game",
                title: "Game Reports",
              },
              {
                icon: <ReportsIcon />,
                href: "/reports/security",
                title: "Security Reports",
              },
              {
                icon: <ReportsIcon />,
                href: "/reports/custom",
                title: "Custom Reports",
              },
            ]}
            title="Reports"
          />

          {/* // Payments Menu */}
          <CollapseIconItems
            icon={<WalletIcon />}
            items={[
              {
                icon: <WalletIcon />,
                href: "/payments",
                title: "Payment Management",
              },
              {
                icon: <WalletIcon />,
                href: "/payments/withdrawal-process",
                title: "Withdrawal Processing",
              },
              {
                icon: <WalletIcon />,
                href: "/payments/balances-and-movements",
                title: "Balances and Movements",
              },
              {
                icon: <SettingsIcon />,
                href: "/payments/gateway-settings",
                title: "Payment Gateway Settings",
              },
            ]}
            title="Payments"
          />

          {/* // Referrals Menu */}
          <CollapseIconItems
            icon={<ShareIcon />}
            items={[
              {
                icon: <BriefcaseIcon />,
                href: "/referrals",
                title: "Referrals Management",
              },
              {
                icon: <PieChartIcon />,
                href: "/referrals/program-overview",
                title: "Referrals Program Overview",
              },
              {
                icon: <GiftIcon />,
                href: "/referrals/rewards",
                title: "Referrals Rewards",
              },
            ]}
            title="Referrals"
          />
        </div>
        {/* <div className={Sidebar.Footer()}>
          <Tooltip content={"Settings"} color="primary">
            <div className="max-w-fit">
              <SettingsIcon />
            </div>
          </Tooltip>
          <Tooltip content={"Adjustments"} color="primary">
            <div className="max-w-fit">
              <FilterIcon />
            </div>
          </Tooltip>
          <Tooltip content={"Profile"} color="primary">
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              size="sm"
            />
          </Tooltip>
        </div> */}
      </div>
    </aside>
  );
};
