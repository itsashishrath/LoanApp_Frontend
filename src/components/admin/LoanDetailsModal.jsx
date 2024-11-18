// components/admin/LoanDetailsModal.jsx
import { Dialog } from '@headlessui/react';

export const LoanDetailsModal = ({ loan, isOpen, onClose }) => {
  if (!loan) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Loan Details #{loan.id}
          </Dialog.Title>
          
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">User Information</p>
              <p className="font-medium">{loan.user_email}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">${loan.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Term</p>
                <p className="font-medium">{loan.term} weeks</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Repayment Schedule</p>
              <div className="mt-2 space-y-2">
                {loan.repayments?.map((repayment) => (
                  <div
                    key={repayment.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>{new Date(repayment.due_date).toLocaleDateString()}</span>
                    <span className="font-medium">${repayment.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};