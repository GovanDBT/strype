"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import useUserRole from "../../hooks/useUserRole";

import {
  LayoutDashboard,
  UserRound,
  ChevronDown,
  Search,
  Inbox,
  School,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { fetchUserRole } = useUserRole(); // Fetch user role custom hook
  const pathname = usePathname(); // Get the current path
  const [menuItems, setMenuItems] = useState<
    {
      title: string;
      url: string;
      icon: React.ComponentType;
      subItem?: {
        subTitle: string;
        subUrl: string;
      }[];
    }[]
  >([]); // State to store menu items
  const [loading, setLoading] = useState(true); // State to track loading
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({}); // State to track collapsible open states

  // Fetch menu items based on user role
  useEffect(() => {
    const fetchMenuItems = async () => {
      const userRole = await fetchUserRole();

      if (!userRole) {
        console.error("User role is not available yet.");
        setLoading(false);
        return;
      }

      if (userRole === "superAdmin") {
        setMenuItems([
          {
            title: "Dashboard",
            url: "/dashboard/superAdmin",
            icon: LayoutDashboard,
          },
          {
            title: "Schools",
            url: "/dashboard/superAdmin/schools",
            icon: School,
          },
          {
            title: "Users",
            url: "/dashboard/superAdmin/schools",
            icon: UserRound,
            subItem: [
              {
                subTitle: "Admins",
                subUrl: "/dashboard/superAdmin/users/admins",
              },
              {
                subTitle: "Staff/Teachers",
                subUrl: "#",
              },
              {
                subTitle: "Students",
                subUrl: "we",
              },
              {
                subTitle: "Parents",
                subUrl: "fe",
              },
            ],
          },
        ]);
      } else if (userRole === "admin") {
        setMenuItems([
          {
            title: "Dashboard",
            url: "/dashboard/admin",
            icon: LayoutDashboard,
          },
          {
            title: "Users",
            url: "#",
            icon: UserRound,
            subItem: [
              {
                subTitle: "Students",
                subUrl: "/dashboard/admin/users/students",
              },
            ],
          },
        ]);
      } else {
        setMenuItems([
          {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboard,
          },
          {
            title: "Subjects",
            url: "#",
            icon: UserRound,
          },
        ]);
      }

      setLoading(false);
    };

    fetchMenuItems();
  }, [fetchUserRole]);

  const upperMenus = [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
  ];

  // Toggle collapsible state for a specific item
  const toggleCollapsible = (title: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching menu items
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        {/** Sidebar Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <Image
                src="/Strype-logo-primary.svg"
                alt="Strype logo"
                width={42}
                height={42}
              />
              <div>
                <h2 className="text-3xl uppercase text-primary font-logo font-bold">
                  Strype<span className="text-secondary">.</span>
                </h2>
                <p className="text-[9px] text-nowrap italic">
                  Earn your Strypes, Shape your Future
                </p>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        {/** Sidebar Upper Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {upperMenus.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`h-9 hover:bg-primary/10 ${
                      pathname === item.url &&
                      "bg-primary/10 text-primary border-1 font-bold hover:text-primary"
                    }`}
                  >
                    <Link href={item.url}>
                      <item.icon size={40} />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {/** Sidebar Main Menu */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItem ? (
                    <Collapsible
                      open={openStates[item.title] || false}
                      onOpenChange={() => toggleCollapsible(item.title)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          className="hover:bg-primary/10"
                        >
                          <div className="cursor-pointer">
                            <item.icon />
                            <span className="text-base">{item.title}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItem.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.subTitle}>
                              <SidebarMenuSubButton
                                asChild
                                className={`h-9 hover:bg-primary/10 ${
                                  pathname === subItem.subUrl &&
                                  "bg-primary/10 text-primary border-1 font-bold hover:text-primary"
                                }`}
                              >
                                <Link href={subItem.subUrl}>
                                  <span className="text-base">
                                    {subItem.subTitle}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      className={`h-9 hover:bg-primary/10 ${
                        pathname === item.url &&
                        "bg-primary/10 text-primary border-1 font-bold hover:text-primary"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarRail />
      </SidebarContent>
    </Sidebar>
  );
}
