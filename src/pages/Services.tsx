import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { createPurchaseUrl } from '../utils/url';

const SERVICE_IDS = {
  data: ['mtn-data', 'airtel-data', 'glo-data', 'etisalat-data'], // Service IDs for data plans
  tv: ['dstv', 'gotv', 'startimes'], // Service IDs for TV subscriptions
  utilities: ['electricity'], // Service IDs for utilities (e.g., electricity bills)
  airtime: {
    info: 'Buy airtime for all Nigerian networks instantly.',
    serviceID: ['mtn', 'airtel', 'glo', 'etisalat'] // Service IDs for airtime purchase
  }
};

const Services = () => {
  const { category } = useParams<{ category: string }>();
  const [services, setServices] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (category === 'data' || category === 'tv' || category === 'utilities') {
      const serviceIDs = SERVICE_IDS[category];
      serviceIDs.forEach((serviceID) => {
        setLoading((prev) => ({ ...prev, [serviceID]: true }));
        fetch(`https:shamsubbackend-production.up.railway.app/api/variations?serviceID=${encodeURIComponent(serviceID)}`)
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
          }
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid JSON response");
          }
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
                ) :(
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
                            to={createPurchaseUrl('data', {
                              network: serviceID.split('-')[0],
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
        {category === 'utilities' &&
          SERVICE_IDS.utilities.map((serviceID) => (
            <div key={serviceID} className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {serviceID.toUpperCase()} Providers
                </h2>
                {loading[serviceID] ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(services[serviceID] || []).map((provider, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:border-yellow-500 transition-colors"
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {provider.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Code: {provider.variation_code}
                          </p>
                          <Link
                            to={createPurchaseUrl('data', {
                              service: serviceID.split('-')[0],
                              provider: provider.variation_code,
                              price: provider.variation_amount,
                            })}
                            
                            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors inline-flex items-center justify-center"
                          >
                            Pay Bill
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
      </div>
    </div>
  );
};

export default Services;