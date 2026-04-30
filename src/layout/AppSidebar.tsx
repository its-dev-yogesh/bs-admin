"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CheckCircleIcon,
  DollarLineIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  ListIcon,
  PieChartIcon,
  ShootingStarIcon,
  TaskIcon,
  UserCircleIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const mainNav: NavItem[] = [
  { name: "Dashboard", icon: <GridIcon />, path: "/" },
  { name: "Users", icon: <GroupIcon />, path: "/users" },
  { name: "Listings", icon: <BoxCubeIcon />, path: "/listings" },
  { name: "Leads", icon: <TaskIcon />, path: "/leads" },
  { name: "KYC Verification", icon: <CheckCircleIcon />, path: "/verification" },
  { name: "Moderation", icon: <ShootingStarIcon />, path: "/moderation" },
];

const opsNav: NavItem[] = [
  { name: "Notifications", icon: <ListIcon />, path: "/notifications" },
  { name: "Roles & Permissions", icon: <UserCircleIcon />, path: "/permissions" },
  { name: "Monetization", icon: <DollarLineIcon />, path: "/monetization" },
  { name: "Analytics", icon: <PieChartIcon />, path: "/analytics" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`);

  const showLabels = isExpanded || isHovered || isMobileOpen;

  const renderItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            className={`menu-item group ${
              isActive(item.path) ? "menu-item-active" : "menu-item-inactive"
            } ${!showLabels ? "lg:justify-center" : "lg:justify-start"}`}
          >
            <span
              className={
                isActive(item.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }
            >
              {item.icon}
            </span>
            {showLabels && (
              <span className="menu-item-text">{item.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !showLabels ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          {showLabels ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Broker-Social Admin"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Broker-Social Admin"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Broker-Social Admin"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <nav className="mb-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <div>
          <h2
            className={`mb-3 text-xs uppercase flex leading-5 text-gray-400 ${
              !showLabels ? "lg:justify-center" : "justify-start"
            }`}
          >
            {showLabels ? "Manage" : <HorizontaLDots />}
          </h2>
          {renderItems(mainNav)}
        </div>
        <div>
          <h2
            className={`mb-3 text-xs uppercase flex leading-5 text-gray-400 ${
              !showLabels ? "lg:justify-center" : "justify-start"
            }`}
          >
            {showLabels ? "Operations" : <HorizontaLDots />}
          </h2>
          {renderItems(opsNav)}
        </div>
      </nav>
    </aside>
  );
};

export default AppSidebar;
