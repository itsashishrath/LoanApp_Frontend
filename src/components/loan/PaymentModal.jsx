import React, { useState } from 'react';
import { useLoan } from './LoanContext';

export const PaymentModal = ({ repayment, onClose }) => {
  const { makeRepayment } = useLoan();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await makeRepayment(repayment.id, repayment.amount);
      if (result) {
        onClose();
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while processing payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Payment</h3>
        <p className="mb-4">
          Are you sure you want to make a payment of ${parseFloat(repayment.amount).toFixed(2)}?
        </p>
        
        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};
