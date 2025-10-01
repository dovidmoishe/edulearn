"use client";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/../components/Dashboard/sidebar"
import { DynamicNavbar } from "@/../components/Dashboard/DynamicNavbar"
import useUserStore from "@/../core/userState";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, setUserAsync } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const initUser = async () => {
      await setUserAsync();
    };
    
    initUser();
  }, [setUserAsync]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00FF80]"></div>
          <p className="text-[#E0E0E0] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DynamicNavbar />
        <div className="flex flex-1 flex-col gap-4 p-2 md:p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
