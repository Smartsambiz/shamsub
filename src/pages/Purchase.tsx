import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useFrontendAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { CreditCard, Wallet, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { processVTpassPurchase } from '../services/vtpassService';


const Purchase = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useFrontendAuth();
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

  // Redirect if category is invalid
  useEffect(() => {
    if (!category || !['data', 'airtime', 'tv', 'utilities'].includes(category)) {
      navigate('/error', { state: { message: 'Invalid service category' } });
    }
  }, [category, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    const { name, value } = e.target;
    const getServiceIdForNetwork = (network: string): string => {
      switch (network.toLowerCase()) {
        case 'mtn':
          return 'mtn';
        case 'airtel':
          return 'airtel';
        case 'glo':
          return 'glo';
        case '9mobile':
        case 'etisalat': // some users may still call it this
          return 'etisalat'; // VTpass uses 'etisalat' as the ID for 9mobile
        default:
          return ''; // return empty if unknown
      }
    };


    type UpdatedData = typeof formData;
    const updatedData: UpdatedData = {
      ...formData,
      [name]: value
    };

    // Automatically assign serviceID for airtime based on selected network
    if (category === 'airtime' && name === 'network') {
      updatedData.service = getServiceIdForNetwork(value);
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      if (!formData.phoneNumber) throw new Error('Phone number is required');

      const amount = parseFloat(formData.amount);
      if (!amount || amount <= 0) throw new Error('Valid amount is required');

      if (paymentMethod === 'wallet') {
        if (!user) throw new Error('Please login to use wallet payment');
        const success = await deductFunds(amount, `${category} purchase`);
        if (!success) throw new Error('Insufficient wallet balance');

        const vtpassResponse = await processVTpassPurchase({
        request_id: formData.request_id,
        serviceID: formData.service,
        billersCode: formData.phoneNumber,
        variation_code: formData.plan,
        amount: formData.amount,
        phone: formData.phoneNumber
        });

        if (vtpassResponse?.status === 'success') {
          setIsSuccess(true);
        } else {
          throw new Error(vtpassResponse?.message || 'VTpass transaction failed');
        }
    } else {
        interface PaystackConfig {
          key: string;
          email: string;
          amount: number;
          currency: string;
          metadata: Record<string, unknown>;
          onSuccess: () => void;
          onCancel: () => void;
        }

        // @ts-expect-error: PaystackPop is injected globally by Paystack script and has no type
        const PaystackPop = (window as unknown as { PaystackPop: { setup: (config: PaystackConfig) => { openIframe: () => void } } }).PaystackPop;
        

          const handler = PaystackPop.setup({
            key: 'pk_test_d58caa670751f392957d246053c4a3b1340a4dd4', // 🔁 Replace with your test/live key
            email: user?.email || 'default@email.com',
            amount: amount * 100, // Paystack expects amount in kobo
            currency: 'NGN',
            metadata: {
              phone: formData.phoneNumber,
              network: formData.network,
              category,
            },
            onSuccess: async () => {
              try{
                const vtpassResponse = await processVTpassPurchase({
            request_id: formData.request_id,
            serviceID: formData.service,
            billersCode: formData.phoneNumber,
            variation_code: formData.plan,
            amount: formData.amount,
            phone: formData.phoneNumber
          });

          if (vtpassResponse?.status === 'success') {
            setIsSuccess(true);
          } else {
            throw new Error(vtpassResponse?.message || 'VTpass transaction failed');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
          setIsProcessing(false);
        }
      },
      onCancel: () => {
            setError('Payment was cancelled');
            setIsProcessing(false);
          }
        }) 
    handler.openIframe();    
    
}

console.log('Sending VTpass payload:', {
  request_id: formData.request_id,
  serviceID: formData.service,
  billersCode: formData.phoneNumber,
  variation_code: formData.plan,
  amount: formData.amount,
  phone: formData.phoneNumber
});


    } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
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
    );
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Network (for data/airtime) */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Network</option>
                  <option value="mtn">MTN</option>
                  <option value="airtel">Airtel</option>
                  <option value="glo">Glo</option>
                  <option value="9mobile">9Mobile</option>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Smart Card (TV) */}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            )}

            {/* Utilities Fields */}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </>
            )}

            {/* Payment Method */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mr-2"
                />
                <CreditCard className="h-5 w-5 mr-1" /> Pay with Card
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={() => setPaymentMethod('wallet')}
                  className="mr-2"
                />
                <Wallet className="h-5 w-5 mr-1" /> Use Wallet (₦{balance})
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
            >
              {isProcessing ? 'Processing...' : 'Proceed'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
