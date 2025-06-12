import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { createPurchaseUrl } from '../utils/url';

const SERVICE_IDS = {
  data: ['mtn-data', 'airtel-data', 'glo-data', 'etisalat-data'],
  tv: ['dstv', 'gotv', 'startimes'],
  utilities: ['electricity'],
  airtime: {
    info: 'Buy airtime for all Nigerian networks instantly.',
    serviceID: ['mtn', 'airtel', 'glo', 'etisalat']
  }
};

const Services = () => {
  const { category } = useParams<{ category: string }>();
  const [services, setServices] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [utilityServices, setUtilityServices] = useState<string[]>([]);

  const [selectedDisco, setSelectedDisco] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');


  useEffect(() => {
    if (category === 'data' || category === 'tv') {
      const serviceIDs = SERVICE_IDS[category];
      serviceIDs.forEach((serviceID) => {
        setLoading((prev) => ({ ...prev, [serviceID]: true }));
        fetch(`https://industrious-contentment-production.up.railway.app/api/variations?serviceID=${encodeURIComponent(serviceID)}`)
          .then(async (res) => {
            const contentType = res.headers.get("content-type");
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            if (!contentType?.includes("application/json")) throw new Error("Invalid JSON response");
            return res.json();
          })
          .then((result) => {
            setServices((prev) => ({ ...prev, [serviceID]: result || [] }));
          })
          .catch((error) => {
            console.error(`Error fetching ${serviceID} variations:`, error);
            setServices((prev) => ({ ...prev, [serviceID]: [] }));
          })
          .finally(() => {
            setLoading((prev) => ({ ...prev, [serviceID]: false }));
          });
      });
    }

  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {category === 'data'
              ? 'Data Plans'
              : category === 'tv'
              ? 'TV Subscriptions'
              : 'Utility Bills'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {category === 'data'
              ? 'Choose from affordable data bundles for all networks.'
              : category === 'tv'
              ? 'Subscribe to your favorite TV services.'
              : 'Pay your utility bills instantly.'}
          </p>
        </div>

        {/* Data Plans */}
        {category === 'data' &&
          SERVICE_IDS.data.map((serviceID) => (
            <div key={serviceID} className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {serviceID.split('-')[0].toUpperCase()} Data Plans
                </h2>
                {loading[serviceID] ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(services[serviceID] || []).map((plan, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {plan.name}
                          </h3>
                          <p className="text-2xl font-bold text-blue-700 mb-2">
                            ₦{plan.variation_amount}
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            Code: {plan.variation_code}
                          </p>
                          <Link
                            to={createPurchaseUrl('data', {
                              network: serviceID.split('-')[0],
                              plan: plan.variation_code,
                              price: plan.variation_amount,
                            })}
                            className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center justify-center"
                          >
                            Buy Now
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Airtime */}
        {category === 'airtime' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 mb-6">
                  {SERVICE_IDS.airtime.info}
                </p>
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-6">
                  <Check className="h-5 w-5" />
                  <span>All Nigerian networks supported</span>
                </div>
              </div>
              <Link
                to="/purchase/airtime"
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center text-lg font-semibold"
              >
                Buy Airtime
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        )}

        {/* TV Subscriptions */}
        {category === 'tv' &&
          SERVICE_IDS.tv.map((serviceID) => (
            <div key={serviceID} className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {serviceID.toUpperCase()} Packages
                </h2>
                {loading[serviceID] ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(services[serviceID] || []).map((plan, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors"
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {plan.name}
                          </h3>
                          <p className="text-2xl font-bold text-purple-700 mb-4">
                            ₦{plan.variation_amount}
                          </p>
                          <Link
                            to={createPurchaseUrl('tv', {
                              network: serviceID,
                              plan: plan.variation_code,
                              price: plan.variation_amount,
                            })}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
                          >
                            Subscribe
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

        {/* Utility Bills */}
        {category === 'utilities' && (
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Verify Meter Number</h2>
            <div className="space-y-4">
              <select
                value={selectedDisco}
                onChange={(e) => setSelectedDisco(e.target.value)}
                className="w-full p-3 border rounded-md"
              >
                <option value="">Select DISCO</option>
                {utilityServices.map((serviceID) => (
                  <option key={serviceID} value={serviceID}>
                    {serviceID.toUpperCase()}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Enter Meter Number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full p-3 border rounded-md"
              />

              <button
                onClick={async () => {
                  setVerifying(true);
                  setVerificationError('');
                  setCustomerInfo(null);

                  try {
                    const res = await fetch('https://industrious-contentment-production.up.railway.app/api/verify-meter', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ serviceID: selectedDisco, meter_number: meterNumber }),
                    });
                    if (!res.ok) throw new Error('Failed to verify meter');
                    const data = await res.json();
                    setCustomerInfo(data);
                  } catch (err: any) {
                    setVerificationError('Could not verify meter. Please check and try again.');
                  } finally {
                    setVerifying(false);
                  }
                }}
                className="bg-yellow-600 text-white py-2 px-4 rounded-md w-full hover:bg-yellow-700"
                disabled={!selectedDisco || !meterNumber || verifying}
              >
                {verifying ? 'Verifying...' : 'Verify Meter'}
              </button>

              {verificationError && <p className="text-red-500 text-center">{verificationError}</p>}
              {customerInfo && (
                <div className="bg-green-50 p-4 rounded-md mt-4 text-center">
                  <p className="text-green-700 font-semibold">Verified Successfully!</p>
                  <p className="text-gray-700">Name: {customerInfo?.Customer_Name}</p>
                  <p className="text-gray-700">Meter No: {customerInfo?.Meter_Number}</p>
                  <p className="text-gray-700">Address: {customerInfo?.Address}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Services;
