"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, CheckCircle, Clock, XCircle, ExternalLink, Loader2, Crown, Zap } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
}

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

function BillingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetchBillingData();

    if (searchParams.get('success') === 'true') {
      toast.success("Subscription activated successfully!", {
        description: "Welcome to Refraim AI Pro! Enjoy unlimited features.",
      });
      router.replace('/app/billing');
    }
  }, [searchParams, router]);

  const fetchBillingData = async () => {
    try {
      const [subRes, plansRes] = await Promise.all([
        fetch('/api/billing/subscription'),
        fetch('/api/plans'),
      ]);

      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscription(subData.subscription);
        setCurrentPlan(subData.plan);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setAvailablePlans(plansData.plans || []);
      }
    } catch (error) {
      console.error("Error fetching billing data:", error);
      toast.error("Failed to load billing information");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planSlug: string, billingPeriod: 'monthly' | 'annual' = 'monthly') => {
    setCheckoutLoading(planSlug);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planSlug, billingPeriod }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout process");
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Portal error:", error);
      toast.error("Failed to open billing portal");
      setPortalLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      trialing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Clock },
      past_due: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };
    
    const style = styles[status as keyof typeof styles] || styles.active;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>
          Billing & Subscription
        </h1>
        <p className="text-base" style={{ color: 'var(--app-text-muted)' }}>
          Manage your Refraim AI subscription and billing settings
        </p>
      </header>

      {/* Current Subscription Card */}
      <div className="mb-8 p-6 rounded-2xl" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--app-text)' }}>
              {currentPlan?.slug !== 'free' && <Crown className="w-5 h-5 text-yellow-500" />}
              {currentPlan?.name} Plan
            </h2>
            <p className="text-sm mb-3" style={{ color: 'var(--app-text-muted)' }}>
              {currentPlan?.description}
            </p>
            {subscription && getStatusBadge(subscription.status)}
          </div>
          
          {currentPlan?.slug !== 'free' && subscription && (
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--app-accent)', color: 'white' }}
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Manage Subscription
            </button>
          )}
        </div>

        {subscription && currentPlan?.slug !== 'free' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: 'var(--app-border)' }}>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--app-text-muted)' }}>Current Period</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
                {new Date(subscription.currentPeriodStart).toLocaleDateString('en-GB')} - {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--app-text-muted)' }}>Next Billing Date</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: 'var(--app-text-muted)' }}>Auto-renew</p>
              <p className="text-sm font-semibold" style={{ color: subscription.cancelAtPeriodEnd ? '#ef4444' : '#10b981' }}>
                {subscription.cancelAtPeriodEnd ? 'Cancelled' : 'Enabled'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--app-text)' }}>
          Available Plans
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availablePlans.map((plan) => {
            const isCurrent = currentPlan?.slug === plan.slug;
            const isUpgrade = plan.priceMonthly > (currentPlan?.priceMonthly || 0);
            
            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl transition-all ${isCurrent ? 'ring-2' : ''}`}
                style={{ 
                  background: isCurrent ? 'var(--app-surface-hover)' : 'var(--app-surface)',
                  border: `1px solid ${isCurrent ? 'var(--app-accent)' : 'var(--app-border)'}`,
                }}
              >
                <div className="mb-4">
                  {plan.slug === 'team' && <Zap className="w-8 h-8 text-purple-500 mb-2" />}
                  {plan.slug === 'pro' && <Crown className="w-8 h-8 text-yellow-500 mb-2" />}
                  <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--app-text)' }}>
                    {plan.name}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--app-text-muted)' }}>
                    {plan.description}
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>
                      £{(plan.priceMonthly / 100).toFixed(2)}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--app-text-muted)' }}>/month</span>
                  </div>
                  {plan.priceAnnual > 0 && (
                    <p className="text-xs" style={{ color: 'var(--app-text-muted)' }}>
                      or £{(plan.priceAnnual / 100).toFixed(2)}/year (save {Math.round((1 - (plan.priceAnnual / 12) / plan.priceMonthly) * 100)}%)
                    </p>
                  )}
                </div>

                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm" style={{ color: 'var(--app-text)' }}>
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--app-accent)' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full px-4 py-3 rounded-lg font-semibold text-sm opacity-60 cursor-not-allowed"
                    style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)', color: 'var(--app-text)' }}
                  >
                    Current Plan
                  </button>
                ) : plan.slug === 'free' ? (
                  <button
                    disabled
                    className="w-full px-4 py-3 rounded-lg font-semibold text-sm opacity-60 cursor-not-allowed"
                    style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)', color: 'var(--app-text)' }}
                  >
                    Free Tier
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.slug)}
                    disabled={checkoutLoading !== null}
                    className="w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 text-white"
                    style={{ background: 'var(--app-accent)' }}
                  >
                    {checkoutLoading === plan.slug ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `${isUpgrade ? 'Upgrade' : 'Downgrade'} to ${plan.name}`
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing Portal Info */}
      {currentPlan?.slug !== 'free' && (
        <div className="p-6 rounded-2xl" style={{ background: 'var(--app-surface)', border: '1px solid var(--app-border)' }}>
          <div className="flex items-start gap-4">
            <CreditCard className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--app-accent)' }} />
            <div className="flex-1">
              <h3 className="font-bold mb-2" style={{ color: 'var(--app-text)' }}>
                Manage Payment & Invoices
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--app-text-muted)' }}>
                Update your payment method, view invoices, and manage your subscription through our secure billing portal.
              </p>
              <button
                onClick={handleManageSubscription}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{ background: 'var(--app-accent)', color: 'white' }}
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Opening...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Open Billing Portal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--app-accent)' }} />
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
