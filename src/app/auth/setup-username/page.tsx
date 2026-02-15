'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '../../../../utils/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Sidebar from '../../../../components/Auth/sidebar';

export default function SetupUsername() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setChecking(true);
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${API_URL}auth/check-availability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username })
        });
        const data = await response.json();
        setIsAvailable(data.usernameAvailable);
      } catch (error) {
        console.error('Availability check error:', error);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const sanitizeUsername = (value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .substring(0, 30);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.length < 3) {
      toast.error('Username too short', {
        description: 'Username must be at least 3 characters'
      });
      return;
    }

    if (!isAvailable) {
      toast.error('Username unavailable', {
        description: 'Please choose a different username'
      });
      return;
    }

    setLoading(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!user) {
        toast.error('Session expired', {
          description: 'Please sign in again'
        });
        router.push('/auth');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_URL}auth/complete-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          userId: user.id,
          username: username
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      toast.success('Profile updated!', {
        description: 'Redirecting to complete your setup...'
      });
      
      router.push('/auth/learning');
    } catch (error: any) {
      toast.error('Update failed', {
        description: error.message || 'Please try again'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FBFC] dark:bg-[#0D0D0D]">
      <div className="hidden lg:flex lg:w-1/2">
        <Sidebar />
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-[500px]">
          <div className="w-full max-w-lg mx-auto px-6 py-8">
            <div className="flex flex-col items-center gap-[32px] mb-12">
              <div className="flex items-center justify-center">
                <Image
                  src="/assets/icons/LOGO.png"
                  alt="EduLearn Logo"
                  width={42}
                  height={40}
                  className="dark:hidden"
                  priority
                />
                <Image
                  src="/assets/icons/LOGO1.png"
                  alt="EduLearn Logo"
                  width={42}
                  height={40}
                  className="dark:inline hidden"
                  priority
                />
              </div>
              <div className="flex flex-col text-center">
                <p className="text-[#2D3C52] dark:text-[#E0E0E0] leading-[42px] font-[700] text-[24px]">
                  Complete Your Profile
                </p>
                <p className="text-[#61728C] dark:text-[#B3B3B3] text-[18px] leading-[26px] text-center font-medium opacity-[0.7]">
                  Add your X (Twitter) username to continue
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[#61728C] dark:text-[#B3B3B3] font-[Satoshi] text-[16px] font-medium leading-[24px] block">
                  X Username
                </label>
                <div className="relative w-full">
                  <span className="absolute left-[16px] top-1/2 transform -translate-y-1/2 text-[#61728C] dark:text-[#B3B3B3]">
                    @
                  </span>
                  <input
                    placeholder="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(sanitizeUsername(e.target.value))}
                    maxLength={30}
                    autoComplete="username"
                    required
                    className="w-full rounded-[8px] h-[48px] dark:bg-[#131313] border-[0.75px] border-[#EDF3FC] dark:border-[#2E3033] bg-[#fff] py-[12px] pl-[36px] pr-[44px] text-[#2D3C52] dark:text-[#E0E0E0] focus:outline-none focus:ring-0 focus:border-[#00FF80] dark:focus:border-[#00FF80] transition-colors"
                  />
                  <div className="absolute right-[16px] top-1/2 transform -translate-y-1/2 flex items-center justify-center">
                    {checking && (
                      <Loader2 className="h-5 w-5 animate-spin text-[#61728C]" />
                    )}
                    {!checking && isAvailable === true && (
                      <svg className="h-5 w-5 text-[#00FF80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {!checking && isAvailable === false && (
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
                {username.length > 0 && username.length < 3 && (
                  <p className="text-[#61728C] dark:text-[#B3B3B3] text-[14px]">
                    Username must be at least 3 characters
                  </p>
                )}
                {isAvailable === false && (
                  <p className="text-red-500 text-[14px]">
                    This username is already taken
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isAvailable || username.length < 3}
                className={`cursor-pointer gap-[12px] rounded-[8px] py-[14px] px-[24px] bg-[#000] text-[#00FF80] dark:text-[#000] dark:bg-[#00FF80] text-[16px] leading-[24px] font-[700] mt-8 w-full flex items-center justify-center transition-opacity ${
                  loading || !isAvailable || username.length < 3 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Saving...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
