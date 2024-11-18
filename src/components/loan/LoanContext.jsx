import React, { createContext, useState, useContext } from 'react';
import { useAuth } from '../auth/AuthContext';

const LoanContext = createContext(null);

export const LoanProvider = ({ children }) => {
  const { tokens } = useAuth();
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchLoans = async () => {
    try {
      const response = await fetch('http://54.252.194.42:8000/api/loans/', {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch loans');
      
      const data = await response.json();
      setLoans(data);
      return data;
    } catch (error) {
      console.error('Fetch loans error:', error);
      return [];
    }
  };

  const createLoan = async (amount, term) => {
    try {
      const response = await fetch('http://54.252.194.42:8000/api/loans/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, term }),
      });
      
      if (!response.ok) throw new Error('Failed to create loan');
      
      const data = await response.json();
      setLoans(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Create loan error:', error);
      return null;
    }
  };

  const makeRepayment = async (repaymentId, amount) => {
    try {
      const response = await fetch(`http://54.252.194.42:8000/api/repayments/${repaymentId}/make_payment/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) throw new Error('Failed to make repayment');
      
      const data = await response.json();
      await fetchLoans(); // Refresh loans after repayment
      return data;
    } catch (error) {
      console.error('Repayment error:', error);
      return null;
    }
  };

  const approveLoan = async (loanId) => {
    try {
      const response = await fetch(`http://54.252.194.42:8000/api/loans/${loanId}/approve/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      });
      
      if (!response.ok) throw new Error('Failed to approve loan');
      
      const data = await response.json();
      await fetchLoans(); // Refresh loans after approval
      return data;
    } catch (error) {
      console.error('Loan approval error:', error);
      return null;
    }
  };

  const rejectLoan = async (loanId) => {
    try {
      const response = await fetch(`http://54.252.194.42:8000/api/loans/${loanId}/reject/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      });

      if (!response.ok) throw new Error('Failed to reject loan');

      await fetchLoans(); // Refresh the loans after rejection
    } catch (error) {
      console.error('Loan rejection error:', error);
    }
  };

  return (
    <LoanContext.Provider value={{
      loans,
      selectedLoan,
      setSelectedLoan,
      fetchLoans,
      createLoan,
      makeRepayment,
      approveLoan,
      rejectLoan
    }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => useContext(LoanContext);
