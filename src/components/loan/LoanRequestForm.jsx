import React from 'react';
import { useLoan } from './LoanContext';
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useToast } from "../../hooks/use-toast"

export const LoanRequestForm = () => {
  const [amount, setAmount] = React.useState('');
  const [term, setTerm] = React.useState('');
  const { createLoan } = useLoan();
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createLoan(parseFloat(amount), parseInt(term));
    if (success) {
      setAmount('');
      setTerm('');
      toast({
        title: "Loan Request Submitted",
        description: "Your loan request has been successfully submitted.",
      })
    } else {
      toast({
        title: "Error",
        description: "There was an error submitting your loan request. Please try again.",
        variant: "destructive",
      })
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a New Loan</CardTitle>
        <CardDescription>Fill out the form below to request a new loan</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Loan Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="0.01"
              placeholder="Enter loan amount"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Term (weeks)</Label>
            <Input
              id="term"
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
              min="1"
              placeholder="Enter loan term in weeks"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Request Loan</Button>
        </CardFooter>
      </form>
    </Card>
  );
};