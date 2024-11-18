import React, { useState, useEffect } from 'react';
import { useLoan } from './LoanContext';
import { useAuth } from '../auth/AuthContext';
import { RepaymentList } from './RepaymentList';
import { PaymentModal } from './PaymentModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Badge } from "../ui/badge"

export const LoanList = () => {
  const { loans, fetchLoans, selectedLoan, setSelectedLoan } = useLoan();
  const { user } = useAuth();
  const [selectedRepayment, setSelectedRepayment] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const handlePaymentClick = (repayment) => {
    setSelectedRepayment(repayment);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Loans</CardTitle>
        <CardDescription>View and manage your current loans</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {loans.map(loan => (
            <AccordionItem key={loan.id} value={`loan-${loan.id}`}>
              <AccordionTrigger>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                  <span className="text-sm sm:text-base">Loan Amount: ${parseFloat(loan.amount).toFixed(2)}</span>
                  <Badge className="mt-2 sm:mt-0" variant={loan.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {loan.status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p className="text-sm">Term: {loan.term} weeks</p>
                  <RepaymentList 
                    loan={loan}
                    onPaymentClick={handlePaymentClick}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>

      {selectedRepayment && (
        <PaymentModal
          repayment={selectedRepayment}
          onClose={() => setSelectedRepayment(null)}
        />
      )}
    </Card>
  );
};