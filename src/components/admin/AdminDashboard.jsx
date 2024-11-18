// AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../loan/LoanContext';
// NEW IMPORT 👇
import { RefreshCcw } from 'lucide-react'; // Import the refresh icon

export const AdminDashboard = () => {
  const { tokens, logout } = useAuth();
  const navigate = useNavigate();
  const { approveLoan, rejectLoan } = useLoan();
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // NEW STATE 👇
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchPendingLoans = async () => {
    if (!tokens?.access) {
      setError('Missing tokens for authentication');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://54.252.194.42:8000/api/loans/', {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch pending loans');
      const data = await response.json();
      console.log('Loan data:', data); 

      setPendingLoans(data.filter(loan => loan.status === 'PENDING'));
      setLoading(false);
    } catch (error) {
      console.error('Fetch pending loans error:', error);
      setError('Failed to load pending loans');
      setLoading(false);
    }
  };

  // NEW FUNCTION 👇
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPendingLoans();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchPendingLoans();
  }, [tokens]);

  const handleApprove = async (loanId) => {
    try {
      await approveLoan(loanId);
      await fetchPendingLoans();
    } catch (error) {
      console.error('Loan approval error:', error);
      setError('Failed to approve loan');
    }
  };

  const handleReject = async (loanId) => {
    try {
      await rejectLoan(loanId);
      await fetchPendingLoans();
    } catch (error) {
      console.error('Loan rejection error:', error);
      setError('Failed to reject loan');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-600 text-center py-4">{error}</div>;

  // NEW EMPTY STATE COMPONENT 👇
  const EmptyState = () => (
    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
      <div className="space-y-6">
        <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">No pending loans</h3>
          <p className="text-sm text-gray-500">There are currently no new loans waiting for approval.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          disabled={isRefreshing}
        >
          <RefreshCcw
            className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pending Loan Approvals</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      {/* MODIFIED CONTENT SECTION 👇 */}
      <div className="space-y-4">
        {pendingLoans.length === 0 ? (
          <EmptyState />
        ) : (
          pendingLoans.map(loan => (
            <div key={loan.id} className="p-4 border rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Amount: ${loan.amount}</p>
                  <p className="text-sm">Term: {loan.term} weeks</p>
                  <p className="text-sm">Status: {loan.status}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(loan.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(loan.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};