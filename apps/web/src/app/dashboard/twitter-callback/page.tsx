"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TwitterService } from "@/../services/twitter.service";
import useUserStore from "@/../core/userState";

function TwitterCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUserStore((state) => state.user);
  const setUserAsync = useUserStore((state) => state.setUserAsync);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your X account...');
  
  const twitterCodeRef = useRef<string | null>(null);
  const stateRef = useRef<string | null>(null);
  const hasCleanedUrl = useRef(false);
  const hasLoadedUser = useRef(false);
  const hasProcessedCallback = useRef(false);

  useEffect(() => {
    if (!hasLoadedUser.current && !user) {
      hasLoadedUser.current = true;
      setUserAsync().catch(err => {
        console.error('Failed to load user:', err);
      });
    }
  }, [user, setUserAsync]);

  useEffect(() => {
    if (hasCleanedUrl.current) {
      return;
    }
    
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    
    if (state && !state.startsWith('TWITTER_')) {
      setStatus('error');
      setMessage('Invalid authentication state. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
      hasCleanedUrl.current = true;
      setTimeout(() => router.push('/dashboard/profile'), 3000);
      return;
    }
    
    if (code && state) {
      twitterCodeRef.current = code;
      stateRef.current = state;
      window.history.replaceState({}, '', window.location.pathname);
      hasCleanedUrl.current = true;
    }
    
    if (error) {
      setStatus('error');
      setMessage('Authorization denied. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
      hasCleanedUrl.current = true;
      setTimeout(() => router.push('/dashboard/profile'), 3000);
    }
    
    if (!code && !error) {
      
    }
  }, [searchParams, router]);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasProcessedCallback.current) {

        return;
      }
      
      if (!user?.email) {
        return;
      }

      if (!twitterCodeRef.current || !stateRef.current) {
      
        return;
      }
      hasProcessedCallback.current = true;

      try {
        const twitterService = new TwitterService();
        const profile = await twitterService.handleCallback(
          twitterCodeRef.current, 
          stateRef.current,
          user.email
        );


        setStatus('success');
        setMessage(`Successfully connected as @${profile.username}!`);
        
        await setUserAsync();

        setTimeout(() => router.push('/dashboard/profile'), 2000);
      } catch (error: unknown) {
        setStatus('error');
        setMessage((error as Error).message || 'Failed to connect X account. Please try again.');
        setTimeout(() => router.push('/dashboard/profile'), 3000);
      }
    };
    
    handleCallback();
  }, [user, router, setUserAsync]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-[24px] p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF80]"></div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 rounded-full bg-[rgba(0,255,128,0.1)] border-2 border-[#00FF80] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#00FF80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 rounded-full bg-[rgba(255,59,48,0.1)] border-2 border-[#FF3B30] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        <h1 className={`text-2xl font-bold mb-4 ${
          status === 'success' ? 'text-[#00FF80]' : 
          status === 'error' ? 'text-[#FF3B30]' : 
          'text-[#E0E0E0]'
        }`}>
          {status === 'loading' && 'Connecting...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Connection Failed'}
        </h1>

        <p className="text-[#B3B3B3] text-[16px] leading-[24px]">
          {message}
        </p>

        {status !== 'loading' && (
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="mt-6 bg-[#00FF80] text-[#000000] px-6 py-3 rounded-[12px] font-[600] text-[16px] hover:bg-[#00CC66] transition-colors"
          >
            Return to Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default function TwitterCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-[24px] p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF80]"></div>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-[#E0E0E0]">
            Loading...
          </h1>
          <p className="text-[#B3B3B3] text-[16px] leading-[24px]">
            Please wait...
          </p>
        </div>
      </div>
    }>
      <TwitterCallbackContent />
    </Suspense>
  );
}

