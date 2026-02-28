'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Wallet, Church, CheckCircle, AlertTriangle, LayoutGrid, LayoutList } from 'lucide-react';

// --- 1. CONFIGURATION ---
const CONTRIBUTION_AMOUNT = 100; // Amount per Sunday
const DATES = [
  '2026-02-01', '2026-02-08', '2026-02-15', '2026-02-22',
  '2026-03-01', '2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29'
];

// --- 2. INPUT DATA (Edit this part!) ---
// We use 'missed' here just for speed, but the function below converts it to true/false immediately.

// active | warning | refund
const RAW_MEMBERS = [
  {
    id: 1, name: 'Lex', status: 'active', missed: [
'2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29'
    ]
  }, // Paid all
  {
    id: 2, name: 'Macabenta', status: 'active', missed: [
 
     , '2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29'
    ]
  },
  {
    id: 3, name: 'Elly', status: 'active', missed: [

      '2026-03-01', '2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29'
    ]
  },
    {
    id: 4, name: 'Keith', status: 'active', missed: [

     '2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29'
    ]
  },
     {
    id: 5, name: 'Tababa', status: 'active', missed: [

      '2026-03-01', '2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29'
    ],
  },
    {
       id: 6, name: 'Kami', status: 'active', missed: [
  '2026-03-01', '2026-03-08', '2026-03-15', '2026-03-22', '2026-03-29'
    ]
  },

];

// --- 3. THE ENGINE (Calculates Totals & Creates Booleans) ---
const INITIAL_DATA = RAW_MEMBERS.map(member => {
  const contributions: Record<string, boolean> = {};
  let paidCount = 0;

  // Create the True/False Object
  DATES.forEach(date => {
    const isPaid = !member.missed.includes(date);
    contributions[date] = isPaid; // Result: { '2026-02-01': true, ... }
    if (isPaid) paidCount++;
  });

  return {
    ...member,
    contributions, // This is now the object with true/false
    total_saved: paidCount * CONTRIBUTION_AMOUNT
  };
});

// Helper: Calculate Budget Split
function calculateAllocation(total: number) {
  return {
    fuel: Math.round(total * 0.2),      // 50%
    food: Math.round(total * 0.75),      // 30%
    emergency: Math.round(total * 0.05), // 20%
  };
}

// Helper: Badge Styles
function getStatusBadge(status: string) {
  const map: any = {
    active: { variant: 'default', label: 'Active' },
    warning: { variant: 'secondary', label: 'Warning' },
    refund: { variant: 'destructive', label: 'Refund' },
  };
  return map[status] || map.active;
}

export default function BisitaIglesia() {
  // Use the processed INITIAL_DATA
  const [members] = useState(INITIAL_DATA);
  const [selectedMember, setSelectedMember] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Calculate Group Totals
  const totalFunds = useMemo(() => {
    return members.reduce((sum, m) => sum + m.total_saved, 0);
  }, [members]);

  const allocation = calculateAllocation(totalFunds);

  // Filter Logic
  const activeMember = selectedMember !== 'all'
    ? members.find(m => m.id.toString() === selectedMember)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Church className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Bisita Iglesia 2026</h1>
              <p className="text-xs text-muted-foreground">Savings Tracker</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Rules</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rules</DialogTitle>
                <DialogDescription>
                  1. Miss 2 Sundays = Refund.<br />
                  2. Fuel 50%, Food 30%, Emergency 20%.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary-foreground/80">Total Collected</CardDescription>
              <CardTitle className="text-3xl">₱{totalFunds.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Food Budget</CardDescription>
              <CardTitle className="text-3xl text-green-600">₱{allocation.food.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Emergency Budget</CardDescription>
              <CardTitle className="text-3xl text-red-600">₱{allocation.emergency.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Fuel Budget</CardDescription>
              <CardTitle className="text-3xl text-blue-600">₱{allocation.fuel.toLocaleString()}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold">Member Tracking</h2>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Mobile Dropdown */}
            <div className="w-full sm:w-48">
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle (Desktop) */}
            <div className="hidden md:flex bg-white border rounded-md p-1">
              <Button
                variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                size="sm" onClick={() => setViewMode('card')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm" onClick={() => setViewMode('table')}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* --- VIEW: CARD LAYOUT --- */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(activeMember ? [activeMember] : members).map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50 pb-3 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Wallet className="w-3 h-3" /> Total: ₱{member.total_saved.toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadge(member.status).variant}>
                      {getStatusBadge(member.status).label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                    {DATES.map((date, index) => {
                      // HERE IS THE BOOLEAN LOGIC YOU WANTED
                      const isPaid = member.contributions[date];
                      const displayDate = new Date(date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });

                      return (
                        <div key={date} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">{displayDate}</span>
                          {isPaid ? (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* --- VIEW: TABLE LAYOUT --- */}
        {viewMode === 'table' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 text-left font-medium">Member</th>
                    {DATES.map(d => (
                      <th key={d} className="p-2 text-center text-xs text-muted-foreground font-normal">
                        {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </th>
                    ))}
                    <th className="p-4 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeMember ? [activeMember] : members).map(member => (
                    <tr key={member.id} className="border-b last:border-0 hover:bg-slate-50/50">
                      <td className="p-4 font-medium">{member.name}</td>
                      {DATES.map(date => (
                        <td key={date} className="p-2 text-center">
                          {member.contributions[date] ? (
                            <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-red-300 mx-auto" />
                          )}
                        </td>
                      ))}
                      <td className="p-4 text-right font-bold text-slate-700">
                        ₱{member.total_saved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </main>
    </div>
  );
}