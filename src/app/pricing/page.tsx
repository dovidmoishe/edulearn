"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '../../../core/userState';
import { WalletService } from '../../../services/wallet.service';
import { Check, Sparkles, Zap } from 'lucide-react';

const planData = [
  {
    name: "Basic",
    price: 0,
    features: [
      "Basic AI models (Gemini 2.5 Flash)",
      "5 quiz attempts per day",
      "10 chat credits per day",
      "Daily credit renewal",
      "Basic Badge rewards", 
      "Community access"
    ],
  },
  {
    name: "Premium",
    price: 5,
    features: [
      "Advanced AI models (Gemini 2.5 Pro)",
      "15 quiz attempts per day",
      "20 chat credits per day",
      "Credit rollovers & priority support",
      "Exclusive premium badges",
      "Unlimited Chat Messages"
    ],
  },
];

interface PlanCardProps {
  name: string;
  price: number;
  isAnnual: boolean;
  features: string[];
  isCurrentPlan: boolean;
  onUpgrade: () => void;
  isLoading: boolean;
  theme: 'light' | 'dark';
}

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  isAnnual,
  features,
  isCurrentPlan,
  onUpgrade,
  isLoading,
  theme
}) => {
  const isFree = price === 0;
  const displayPrice = isAnnual ? price * 10 : price;
  const isPremium = !isFree;

  return (
    <div className={`
      relative rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl
      ${isPremium 
        ? theme === 'dark' 
          ? 'bg-[#131313] border-2 border-[#00FF80] shadow-lg shadow-[#00FF80]/20' 
          : 'bg-white border-2 border-[#00FF80] shadow-lg shadow-[#00FF80]/10'
        : theme === 'dark'
          ? 'bg-[#131313] border border-[#2E3033]'
          : 'bg-white border border-[#EDF3FC]'
      }
    `}>
      {isPremium && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className={`
            px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2
            ${theme === 'dark' ? 'bg-[#00FF80] text-black' : 'bg-black text-[#00FF80]'}
          `}>
            <Sparkles className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-6 mt-2">
        <div className={`
          inline-block px-3 py-1 rounded-full text-xs font-medium mb-4
          ${theme === 'dark' 
            ? 'bg-[#2E3033] text-[#B3B3B3]' 
            : 'bg-[#F9FBFC] text-[#61728C] border border-[#EDF3FC]'
          }
        `}>
          🔥 {isAnnual ? 'Annually' : 'Monthly'}
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-5xl font-bold ${theme === 'dark' ? 'text-[#E0E0E0]' : 'text-[#2D3C52]'}`}>
            ${displayPrice}
          </span>
          <span className={`text-lg ${theme === 'dark' ? 'text-[#B3B3B3]' : 'text-[#61728C]'}`}>
            /{isAnnual ? 'year' : 'month'}
          </span>
        </div>

        <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-[#E0E0E0]' : 'text-[#2D3C52]'}`}>
          {isFree ? 'Free' : name}
        </h3>

        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-[#B3B3B3]' : 'text-[#61728C]'}`}>
          {isFree 
            ? 'Get started with basic features and explore edulearn'
            : 'Upgrade your edulearn Plan to get access to more features that aren\'t available on the free plan'
          }
        </p>
      </div>

      <div className="mb-6">
        <h4 className={`text-sm font-semibold mb-4 ${theme === 'dark' ? 'text-[#E0E0E0]' : 'text-[#2D3C52]'}`}>
          Features:
        </h4>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`
                flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
                ${theme === 'dark' ? 'bg-[#00FF80]/20' : 'bg-[#00FF80]/10'}
              `}>
                <Check className="w-3 h-3 text-[#00FF80]" />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-[#E0E0E0]' : 'text-[#2D3C52]'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onUpgrade}
        disabled={isLoading || isFree}
        className={`
          w-full py-3 px-6 rounded-full font-semibold text-base transition-all duration-200
          flex items-center justify-center gap-2
          ${isFree
            ? theme === 'dark'
              ? 'bg-[#2E3033] text-[#B3B3B3] cursor-not-allowed'
              : 'bg-[#EDF3FC] text-[#61728C] cursor-not-allowed'
            : theme === 'dark'
              ? 'bg-[#00FF80] text-black hover:bg-[#00FF80]/90 active:scale-95'
              : 'bg-black text-[#00FF80] hover:bg-black/90 active:scale-95'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : isCurrentPlan ? (
          isPremium ? '✓ Active Plan' : 'Current Plan'
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Upgrade Now
          </>
        )}
      </button>
    </div>
  );
};

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, theme } = useUserStore();
  const router = useRouter();
  const walletService = new WalletService();

  const handleUpgrade = async (planIndex: number) => {
    if (!user?.id) {
      alert('Please log in to upgrade your plan');
      router.push('/auth');
      return;
    }

    if (user.isPremium) {
      alert('You are already subscribed to a Premium plan!');
      return;
    }

    const currentPlan = planData[planIndex];
    if (currentPlan.price === 0) {
      return;
    }

    const planAmount = isAnnual ? 50 : 5;

    const confirmed = window.confirm(
      `Are you sure you want to upgrade to ${currentPlan.name} plan for $${planAmount} USDC${isAnnual ? ' (Annual)' : ' (Monthly)'}?`
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const result = await walletService.upgradeToPremium(user.id, planAmount);
      
      const signature = result?.result?.signature || result?.signature || 'N/A';
      const subscriptionType = result?.subscriptionType || (isAnnual ? 'annual' : 'monthly');
      
      const viewTransaction = window.confirm(
        `✅ Premium upgrade successful!\n\n` +
        `Subscription: ${subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1)}\n` +
        `Transaction: ${signature.substring(0, 20)}...\n\n` +
        `Click OK to view transaction on Solscan, or Cancel to stay here.`
      );
      
      if (viewTransaction && signature !== 'N/A') {
        window.open(`https://solscan.io/tx/${signature}`, '_blank');
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: unknown) {
      console.error('Premium upgrade error:', error);
      
      let errorMessage = 'Failed to process premium upgrade. Please try again.';
      
      if (error instanceof Error && 'response' in error) {
        const errorWithResponse = error as Error & { response?: { data?: { error?: string; data?: { error?: string } } } };
        if (errorWithResponse.response?.data?.error) {
          errorMessage = errorWithResponse.response.data.error;
        } else if (errorWithResponse.response?.data?.data?.error) {
          errorMessage = errorWithResponse.response.data.data.error;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(`❌ Upgrade Failed\n\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0D0D0D]' : 'bg-[#F9FBFC]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-[#E0E0E0]' : 'text-[#2D3C52]'}`}>
            Upgrade Your Plan
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-[#B3B3B3]' : 'text-[#61728C]'}`}>
            Choose the perfect plan for your learning journey
          </p>
          {user?.isPremium && (
            <div className={`
              mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full
              ${theme === 'dark' ? 'bg-[#00FF80]/20 text-[#00FF80]' : 'bg-[#00FF80]/10 text-[#00FF80]'}
            `}>
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">You&apos;re Premium!</span>
            </div>
          )}
        </div>

        <div className="flex justify-center mb-12">
          <div className={`
            inline-flex items-center gap-2 p-1 rounded-full
            ${theme === 'dark' 
              ? 'bg-[#131313] border border-[#2E3033]' 
              : 'bg-white border border-[#EDF3FC]'
            }
          `}>
            <button
              onClick={() => setIsAnnual(false)}
              className={`
                px-6 py-2 rounded-full font-medium text-sm transition-all duration-200
                ${!isAnnual
                  ? theme === 'dark'
                    ? 'bg-[#00FF80] text-black'
                    : 'bg-black text-[#00FF80]'
                  : theme === 'dark'
                    ? 'text-[#E0E0E0]'
                    : 'text-[#2D3C52]'
                }
              `}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`
                px-6 py-2 rounded-full font-medium text-sm transition-all duration-200
                flex items-center gap-2
                ${isAnnual
                  ? theme === 'dark'
                    ? 'bg-[#00FF80] text-black'
                    : 'bg-black text-[#00FF80]'
                  : theme === 'dark'
                    ? 'text-[#E0E0E0]'
                    : 'text-[#2D3C52]'
                }
              `}
            >
              Annually
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${isAnnual
                  ? theme === 'dark'
                    ? 'bg-[#2E3033] text-[#00FF80]'
                    : 'bg-white text-black'
                  : 'bg-[#00FF80] text-black'
                }
              `}>
                -20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {planData.map((plan, index) => (
            <PlanCard
              key={index}
              name={plan.name}
              price={plan.price}
              isAnnual={isAnnual}
              features={plan.features}
              isCurrentPlan={plan.price === 0 || ((user?.isPremium ?? false) && plan.price > 0)}
              onUpgrade={() => handleUpgrade(index)}
              isLoading={isLoading}
              theme={theme}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-[#B3B3B3]' : 'text-[#61728C]'}`}>
            All payments are processed securely via USDC on Solana blockchain.
            <br />
            Need help? Contact our support team at support@edulearn.com
          </p>
        </div>
      </div>
    </div>
  );
}

