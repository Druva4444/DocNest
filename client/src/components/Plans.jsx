import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import Navbar from './Navbar';

export default function Plans() {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const planLevels = {
    free: 0,
    silver: 1,
    gold: 2,
    platinum: 3,
  };
  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await axios.get('/api/getplans', { withCredentials: true });
        if (res.status === 200) setPlans(res.data.plans);
      } catch (err) {
        console.error('Failed to load plans', err);
      }
    }

    async function fetchUser() {
      try {
        const res = await axios.get('/api/getuser', { withCredentials: true });
        if (res.status === 200) setUser(res.data.user);
      } catch (err) {
        console.error('Failed to load user', err);
      }
    }

    fetchPlans();
    fetchUser();
  }, []);

  const handleUpgrade = async (planId) => {
    const currentPlanId = typeof user?.plan === 'object' ? user?.plan?._id : user?.plan;
    if (currentPlanId === planId) return;

    setLoadingPlan(planId);
    try {
      const res = await axios.post(
        '/api/create-checkout-session',
        { plan: planId },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('Checkout session creation failed');
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Failed to start payment. Please try again.' });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-10 bg-[#f5f5dc] min-h-screen">
        <h1 className="text-4xl font-bold text-red-700 mb-8">Choose a Plan</h1>

        {/* Alert */}
        {alert && (
          <div
            className={`mb-6 px-4 py-3 rounded ${
              alert.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-md border-l-8 border-red-600 p-6 max-w-xl mb-10">
          <h2 className="text-xl text-red-700 font-semibold">Current Plan</h2>
          <p className="text-2xl mt-2 capitalize">
            {typeof user?.plan === 'object' ? user?.plan?.name : user?.plan || 'free'}
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans
  .filter((plan) => plan.name.toLowerCase() !== 'free')
  .map((plan) => {
    const currentPlanName =
      typeof user?.plan === 'object' ? user.plan.name.toLowerCase() : user?.plan?.toLowerCase();
    const currentPlanLevel = planLevels[currentPlanName] || 0;
    const thisPlanLevel = planLevels[plan.name.toLowerCase()] || 0;

    const isCurrent = user?.plan?._id === plan._id;
    const isLower = thisPlanLevel < currentPlanLevel;
    const isLoading = loadingPlan === plan._id;

    return (
      <div
        key={plan._id}
        className="bg-white p-6 rounded-xl shadow-md border border-red-300 hover:shadow-lg transition"
      >
        <h3 className="text-2xl text-red-700 font-bold mb-2">{plan.name}</h3>
        <p className="text-gray-700 mb-2">
          Storage: <strong>{(plan.capacity / (1024 ** 3)).toFixed(1)} GB</strong>
        </p>
        <p className="text-gray-700 mb-2">
          Support: <strong>{plan.support}</strong>
        </p>
        <p className="text-gray-900 font-semibold mb-4">₹{plan.price}</p>
        <button
          disabled={isCurrent || isLower || isLoading}
          onClick={() => handleUpgrade(plan._id)}
          className={`w-full py-2 rounded text-white transition ${
            isCurrent || isLower || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isLoading
            ? 'Processing...'
            : isCurrent
            ? 'Current Plan'
            : isLower
            ? 'Unavailable'
            : 'Upgrade'}
        </button>
      </div>
    );
  })}
        </div>
      </div>
    </div>
  );
}
