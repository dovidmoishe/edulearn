"use client";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/../components/Dashboard/sidebar"
import { DynamicNavbar } from "@/../components/Dashboard/DynamicNavbar"
import useUserStore from "@/../core/userState";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";

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
          console.log("✅ Session found for:", session.user.email);
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
          
          console.log("No authenticated user found, redirecting to /auth");
          if (mounted) router.push("/auth");
          return;
        }
        
        console.log("✅ Auth user found:", authUser.email);
        await setUserAsync();
        
        if (mounted) {
          setHasAuth(true);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error("❌ Auth check error:", error);
        
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`⏳ Auth error, retry ${retryCount}/${MAX_RETRIES}...`);
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
        console.log("✅ Auth state changed: SIGNED_IN");
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

  console.log("✅ Rendering dashboard for user:", storeUser?.email);

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
