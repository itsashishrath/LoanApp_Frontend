import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoanRequestForm } from '../loan/LoanRequestForm';
import { LoanList } from '../loan/LoanList';
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { LogOut, CreditCard, PiggyBank, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"

export const UserDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 bg-white shadow-md lg:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Loan Dashboard</h1>
        </div>
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Mobile header */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Loan Dashboard</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>Manage your loans and repayments</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="loans" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="loans">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Loans
                </TabsTrigger>
                <TabsTrigger value="request">
                  <PiggyBank className="mr-2 h-4 w-4" />
                  Request Loan
                </TabsTrigger>
              </TabsList>
              <TabsContent value="loans">
                <LoanList />
              </TabsContent>
              <TabsContent value="request">
                <LoanRequestForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};