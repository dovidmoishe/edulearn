'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../../utils/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing authentication...');
  
  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        setStatus('Authentication failed. Redirecting...');
        setTimeout(() => router.push('/auth'), 2000);
        return;
      }
      
      if (session?.user) {
        setStatus('Verifying account...');
        
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
          const provider = session.user.app_metadata?.provider as 'google' | 'apple' || 'google';
          
          const response = await fetch(`${API_URL}auth/oauth/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              supabaseUserId: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              provider: provider,
              providerId: session.user.id
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to process OAuth callback');
          }
          
          const { isNewUser, needsUsername } = await response.json();
          
          if (needsUsername) {
            setStatus('Setting up your profile...');
            router.push('/auth/setup-username');
          } else {
            setStatus('Welcome back! Redirecting...');
            router.push('/auth/learning');
          }
        } catch (err) {
          console.error('OAuth callback error:', err);
          setStatus('Something went wrong. Redirecting...');
          setTimeout(() => router.push('/auth'), 2000);
        }
      } else {
        setStatus('No session found. Redirecting...');
        setTimeout(() => router.push('/auth'), 2000);
      }
    };
    
    handleCallback();
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#00FF80]" />
        <p className="text-[#61728C] dark:text-[#B3B3B3] text-[16px] font-medium">
          {status}
        </p>
      </div>
    </div>
  );
}
