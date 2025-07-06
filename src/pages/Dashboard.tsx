import React, { useState } from 'react';
import { useFrontendAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  CreditCard,
  TrendingUp,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useFrontendAuth();
  const { balance, transactions, addFunds } = useWallet();
  const [fundAmount, setFundAmount] = useState('');
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fundAmount);
    
    if (!amount || amount < 100) {
      alert('Minimum funding amount is ₦100');
      return;
    }

    setIsAddingFunds(true);
    try {
      const success = await addFunds(amount);
      if (success) {
        setFundAmount('');
        setShowFundModal(false);
        alert('Wallet funded successfully!');
      } else {
        alert('Failed to fund wallet. Please try again.');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setIsAddingFunds(false);
    }
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.email}!
          </h1>
          <p className="text-gray-600">
            Manage your wallet and track your transactions
          </p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Wallet Balance</p>
              <h2 className="text-4xl font-bold mb-4">
                ₦{balance.toLocaleString()}
              </h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFundModal(true)}
                  className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Funds</span>
                </button>
                <Link
                  to="/services/data"
                  className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors"
                >
                  Use Wallet
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Wallet className="h-24 w-24 text-blue-300" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Month Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{transactions
                    .filter(t => t.type === 'debit' && new Date(t.date).getMonth() === new Date().getMonth())
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Funded</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{transactions
                    .filter(t => t.type === 'credit')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-700'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'credit' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
              <p className="text-sm">Start by funding your wallet or making a purchase</p>
            </div>
          )}
        </div>
      </div>

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Add Funds to Wallet
            </h3>
            
            <form onSubmit={handleAddFunds}>
              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  min="100"
                  max="500000"
                  placeholder="Enter amount to add"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum: ₦100, Maximum: ₦500,000
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowFundModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingFunds}
                  className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingFunds ? 'Processing...' : 'Add Funds'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;