import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const Services = () => {
  const { category } = useParams<{ category: string }>();

  const serviceData = {
    data: {
      title: 'Data Plans',
      description: 'Choose from affordable data bundles for all networks',
      services: [
        { network: 'MTN', plans: [
          { size: '500MB', price: 150, duration: '30 days' },
          { size: '1GB', price: 280, duration: '30 days' },
          { size: '2GB', price: 550, duration: '30 days' },
          { size: '5GB', price: 1300, duration: '30 days' },
          { size: '10GB', price: 2600, duration: '30 days' },
        ]},
        { network: 'Airtel', plans: [
          { size: '500MB', price: 145, duration: '30 days' },
          { size: '1GB', price: 275, duration: '30 days' },
          { size: '2GB', price: 540, duration: '30 days' },
          { size: '5GB', price: 1280, duration: '30 days' },
          { size: '10GB', price: 2550, duration: '30 days' },
        ]},
        { network: 'Glo', plans: [
          { size: '500MB', price: 140, duration: '30 days' },
          { size: '1GB', price: 270, duration: '30 days' },
          { size: '2GB', price: 530, duration: '30 days' },
          { size: '5GB', price: 1250, duration: '30 days' },
          { size: '10GB', price: 2500, duration: '30 days' },
        ]},
        { network: '9Mobile', plans: [
          { size: '500MB', price: 155, duration: '30 days' },
          { size: '1GB', price: 290, duration: '30 days' },
          { size: '2GB', price: 570, duration: '30 days' },
          { size: '5GB', price: 1350, duration: '30 days' },
          { size: '10GB', price: 2700, duration: '30 days' },
        ]},
      ]
    },
    airtime: {
      title: 'Airtime Top-up',
      description: 'Instant airtime recharge for all networks',
      info: 'Enter any amount from ₦50 to ₦50,000'
    },
    utilities: {
      title: 'Utility Bills',
      description: 'Pay your utility bills instantly',
      services: [
        { name: 'Electricity Bills', providers: ['IKEDC', 'EKEDC', 'AEDC', 'PHEDC', 'KEDC'] },
        { name: 'Water Bills', providers: ['Lagos Water', 'Kano Water', 'FCT Water'] },
        { name: 'Waste Management', providers: ['LAWMA', 'PSP Operators'] }
      ]
    },
    tv: {
      title: 'TV Subscriptions',
      description: 'Subscribe to your favorite TV services',
      services: [
        { name: 'DStv', plans: [
          { name: 'DStv Padi', price: 2500 },
          { name: 'DStv Yanga', price: 4200 },
          { name: 'DStv Confam', price: 6500 },
          { name: 'DStv Compact', price: 11500 },
          { name: 'DStv Premium', price: 25000 },
        ]},
        { name: 'GOtv', plans: [
          { name: 'GOtv Smallie', price: 1575 },
          { name: 'GOtv Jinja', price: 2700 },
          { name: 'GOtv Jolli', price: 4050 },
          { name: 'GOtv Max', price: 5700 },
        ]},
        { name: 'StarTimes', plans: [
          { name: 'Nova Bouquet', price: 1100 },
          { name: 'Basic Bouquet', price: 2200 },
          { name: 'Smart Bouquet', price: 2800 },
          { name: 'Super Bouquet', price: 5000 },
        ]},
      ]
    }
  };

  const currentService = serviceData[category as keyof typeof serviceData];

  if (!currentService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link to="/" className="text-blue-700 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentService.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {currentService.description}
          </p>
        </div>

        {/* Data Plans */}
        {category === 'data' && (
          <div className="space-y-8">
            {serviceData.data.services.map((networkData, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {networkData.network} Data Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {networkData.plans.map((plan, planIndex) => (
                    <div key={planIndex} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {plan.size}
                        </h3>
                        <p className="text-2xl font-bold text-blue-700 mb-2">
                          ₦{plan.price}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          Valid for {plan.duration}
                        </p>
                        <Link
                          to={`/purchase/data?network=${networkData.network}&plan=${plan.size}&price=${plan.price}`}
                          className="w-full bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors inline-flex items-center justify-center"
                        >
                          Buy Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Airtime */}
        {category === 'airtime' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 mb-6">
                  {serviceData.airtime.info}
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

        {/* Utilities */}
        {category === 'utilities' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceData.utilities.services.map((utility, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {utility.name}
                </h3>
                <ul className="space-y-2 mb-6">
                  {utility.providers.map((provider, providerIndex) => (
                    <li key={providerIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{provider}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/purchase/utilities?type=${utility.name}`}
                  className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors inline-flex items-center justify-center"
                >
                  Pay Bills
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* TV Subscriptions */}
        {category === 'tv' && (
          <div className="space-y-8">
            {serviceData.tv.services.map((tvService, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  {tvService.name} Packages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tvService.plans.map((plan, planIndex) => (
                    <div key={planIndex} className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-2xl font-bold text-purple-700 mb-4">
                          ₦{plan.price.toLocaleString()}
                        </p>
                        <Link
                          to={`/purchase/tv?service=${tvService.name}&plan=${plan.name}&price=${plan.price}`}
                          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center justify-center"
                        >
                          Subscribe
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;