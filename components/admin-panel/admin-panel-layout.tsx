"use client";

import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { Toaster, toast } from "sonner";
import { ContentLayout } from "./content-layout";

const API = process.env.NEXT_PUBLIC_API!;

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  useEffect(() => {
    const socket = io(API);

    socket.on("connect", () => console.log("Connected", socket.id));

    socket.on("receive-message", (data) => {
      const message = JSON.parse(data);
      toast.info(`New message from ${message.From}`);
    });

    return () => {
      socket.close();
    }
  }, []);

  if (!sidebar) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <ContentLayout title="">
          {children}
        </ContentLayout>
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {/* <Footer /> */}
      </footer>
    </>
  );
}
