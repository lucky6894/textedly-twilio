import {
  // CannabisIcon,
  // CircleDollarSignIcon,
  // ContactIcon,
  HouseIcon,
  // InboxIcon,
  // KeyIcon,
  // LayoutGrid,
  LucideIcon,
  MessageCircleIcon,
  PhoneCallIcon,
  // Users2Icon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname == "/dashboard",
          icon: HouseIcon,
          submenus: []
        },
        // {
        //   href: "#",
        //   label: "Inbox",
        //   active: false,
        //   icon: InboxIcon
        // },
        // {
        //   href: "#",
        //   label: "Channels",
        //   active: false,
        //   icon: CannabisIcon
        // },
        // {
        //   href: "#",
        //   label: "Contacts",
        //   active: false,
        //   icon: ContactIcon
        // },
        {
          href: "/messages",
          label: "Messages",
          active: false,
          icon: MessageCircleIcon
        },
        // {
        //   href: "#",
        //   label: "Keywords",
        //   active: false,
        //   icon: KeyIcon
        // },
        {
          href: "/voice-calls",
          label: "Voice Calls",
          active: false,
          icon: PhoneCallIcon
        },
        // {
        //   href: "#",
        //   label: "Reviews",
        //   active: false,
        //   icon: Users2Icon
        // },
        // {
        //   href: "#",
        //   label: "Payments",
        //   active: false,
        //   icon: CircleDollarSignIcon
        // },
        // {
        //   href: "#",
        //   label: "App Store",
        //   active: false,
        //   icon: LayoutGrid
        // }
      ]
    },
  ];
}
