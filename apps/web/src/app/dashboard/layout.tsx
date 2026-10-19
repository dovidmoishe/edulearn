"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/../components/Dashboard/sidebar"
import { DynamicNavbar } from "@/../components/Dashboard/DynamicNavbar"
import useUserStore from "@/../core/userState";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: storeUser, setUserAsync } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [hasAuth, setHasAuth] = useState(false);

  const isTwitterCallback = pathname?.includes('/twitter-callback');
  const isChatRoute = pathname?.startsWith('/dashboard/chat');

  useEffect(() => {
    if (isTwitterCallback) {
      setAuthChecked(true);
      setHasAuth(true);
      return;
    }

    let mounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const supabase = createClient();
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await setUserAsync();
          
          if (mounted) {
            setHasAuth(true);
            setAuthChecked(true);
          }
          return;
        }
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`⏳ No user found, retry ${retryCount}/${MAX_RETRIES}...`);
            setTimeout(() => {
              if (mounted) checkAuth();
            }, 500 * retryCount);
            return;
          }
        
          if (mounted) router.push("/auth");
          return;
        }
        
        await setUserAsync();
        
        if (mounted) {
          setHasAuth(true);
          setAuthChecked(true);
        }
      } catch (error) {
        
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(() => {
            if (mounted) checkAuth();
          }, 500 * retryCount);
          return;
        }
        
        if (mounted) router.push("/auth");
      }
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_IN' && session && mounted) {
        checkAuth();
      }
    });
    
    checkAuth();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, setUserAsync, isTwitterCallback]);

  const isLoading = !isTwitterCallback && (!authChecked || (hasAuth && !storeUser));
  
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

  return (
    <SidebarProvider
      className={cn(
        isChatRoute &&
          "h-dvh max-h-dvh min-h-0 overflow-hidden",
      )}
    >
      <AppSidebar />
      <SidebarInset
        className={cn(
          isChatRoute &&
            "min-h-0 max-h-full overflow-hidden md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none",
        )}
      >
        {!isChatRoute && <DynamicNavbar />}
        <div
          className={
            isChatRoute
              ? 'flex h-0 min-h-0 flex-1 flex-col overflow-hidden'
              : 'flex flex-1 flex-col gap-4 p-2 md:p-4'
          }
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
