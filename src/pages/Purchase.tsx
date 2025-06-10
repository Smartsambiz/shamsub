import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { CreditCard, Wallet, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { processVTpassPurchase } from "../services/vtpassService";


const Purchase = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, deductFunds } = useWallet();

  const [formData, setFormData] = useState({
    request_id: `txn_${Date.now()}`,
    phoneNumber: '',
    amount: searchParams.get('price') || '',
    network: searchParams.get('network') || '',
    plan: searchParams.get('plan') || '',
    service: searchParams.get('service') || '',
    smartCardNumber: '',
    meterNumber: '',
    customerName: '',
    billType: searchParams.get('type') || ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Validate form
      if (!formData.phoneNumber) {
        throw new Error('Phone number is required');
      }

      const amount = parseFloat(formData.amount);
      if (!amount || amount <= 0) {
        throw new Error('Valid amount is required');
      }

      // Process payment
      if (paymentMethod === 'wallet') {
        if (!user) {
          throw new Error('Please login to use wallet payment');
        }
        
        const success = await deductFunds(amount, `${category} purchase`);
        if (!success) {
          throw new Error('Insufficient wallet balance');
        }
      } else {
        // Simulate Paystack payment
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
              resolve(true);
            } else {
              reject(new Error('Payment failed. Please try again.'));
            }
          }, 3000);
        });
      }

      // Actual VTpass API call
      const vtpassResponse = await processVTpassPurchase({
        request_id: formData.request_id,      // string, unique
        serviceID: formData.service,          // string, e.g., "mtn"
        billersCode: formData.phoneNumber,    // string, e.g., phone, smartcard, meter
        variation_code: formData.plan,        // string, e.g., "mtn-500"
        amount: Number(formData.amount),      // number
        phone: formData.phoneNumber
      // email: user?.email || '', // optional: for receipts or logging
      });

      // Check VTpass response
      if (vtpassResponse?.status === 'success') {
        setIsSuccess(true);
      } else {
        throw new Error(vtpassResponse?.message || 'VTpass transaction failed');
      }


        setIsSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsProcessing(false);
      }
    };

    if (isSuccess) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Purchase Successful!
              </h1>
              <p className="text-gray-600 mb-6">
                Your {category} purchase has been completed successfully.
              </p>
              <div className="space-y-2 text-left bg-gray-50 rounded-lg p-4 mb-6">
                <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                <p><strong>Amount:</strong> ₦{formData.amount}</p>
                {formData.network && <p><strong>Network:</strong> {formData.network}</p>}
                {formData.plan && <p><strong>Plan:</strong> {formData.plan}</p>}
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      )
  
  }

  const getTitle = () => {
    switch (category) {
      case 'data': return 'Purchase Data Plan';
      case 'airtime': return 'Buy Airtime';
      case 'utilities': return 'Pay Utility Bill';
      case 'tv': return 'TV Subscription';
      default: return 'Make Purchase';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-700 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {getTitle()}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="08123456789"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Network Selection for Data/Airtime */}
            {(category === 'data' || category === 'airtime') && (
              <div>
                <label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-2">
                  Network
                </label>
                <select
                  id="network"
                  name="network"
                  value={formData.network}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Network</option>
                  <option value="MTN">MTN</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Glo">Glo</option>
                  <option value="9Mobile">9Mobile</option>
                </select>
              </div>
            )}

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="50"
                max="50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* TV Subscription specific fields */}
            {category === 'tv' && (
              <div>
                <label htmlFor="smartCardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Smart Card Number
                </label>
                <input
                  type="text"
                  id="smartCardNumber"
                  name="smartCardNumber"
                  value={formData.smartCardNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your smart card number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            {/* Utilities specific fields */}
            {category === 'utilities' && (
              <>
                <div>
                  <label htmlFor="meterNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Meter/Account Number
                  </label>
                  <input
                    type="text"
                    id="meterNumber"
                    name="meterNumber"
                    value={formData.meterNumber}
                    onChange={handleInputChange}
                    placeholder="Enter meter or account number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </>
            )}

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Payment Method
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Card Payment</span>
                </button>
                
                {user && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      paymentMethod === 'wallet'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    <span>Wallet (₦{balance.toLocaleString()})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-700 text-white py-4 px-6 rounded-lg hover:bg-blue-800 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay ₦${formData.amount || '0'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Purchase;