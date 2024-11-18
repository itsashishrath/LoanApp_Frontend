import React from 'react';
import { format } from 'date-fns';
import { useLoan } from './LoanContext';
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

export const RepaymentList = ({ loan, onPaymentClick }) => {
  if (!loan || !loan.repayments || loan.repayments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-6">
          No repayments available for this loan.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repayment Schedule</CardTitle>
        <CardDescription>View and manage your repayments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loan.repayments.map((repayment) => (
            <Card key={repayment.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <div>
                    <p className="font-medium">Amount: ${parseFloat(repayment.amount).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      Due: {format(new Date(repayment.due_date), 'MMM dd, yyyy')}
                    </p>
                    <Badge className="mt-1" variant={repayment.status === 'PAID' ? 'success' : 'warning'}>
                      {repayment.status}
                    </Badge>
                  </div>
                  {repayment.status === 'PENDING' && (
                    <Button className="w-full sm:w-auto" onClick={() => onPaymentClick(repayment)}>
                      Make Payment
                    </Button>
                  )}
                </div>
                {repayment.paid_at && (
                  <p className="text-sm text-gray-600 mt-2">
                    Paid on: {format(new Date(repayment.paid_at), 'MMM dd, yyyy')}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};