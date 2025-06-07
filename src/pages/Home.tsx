import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Wifi, Zap, Tv, Shield, Clock, CreditCard, Users } from 'lucide-react';

const Home = () => {
  const services = [
    {
      icon: Wifi,
      title: 'Data Plans',
      description: 'Buy data bundles for all networks - MTN, Airtel, Glo, 9Mobile',
      link: '/services/data',
      color: 'bg-blue-500'
    },
    {
      icon: Smartphone,
      title: 'Airtime',
      description: 'Instant airtime top-up for all Nigerian networks',
      link: '/services/airtime',
      color: 'bg-green-500'
    },
    {
      icon: Zap,
      title: 'Utilities',
      description: 'Pay electricity bills, water bills, and waste management',
      link: '/services/utilities',
      color: 'bg-yellow-500'
    },
    {
      icon: Tv,
      title: 'TV Subscription',
      description: 'Subscribe to DStv, GOtv, StarTimes, and other TV services',
      link: '/services/tv',
      color: 'bg-purple-500'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your transactions are protected with bank-level security'
    },
    {
      icon: Clock,
      title: 'Instant Delivery',
      description: 'Services delivered within seconds of payment confirmation'
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Pay via card, bank transfer, or your Shamsub wallet'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Our customer support team is always ready to help'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Pay Bills, Buy Data & Airtime
              <span className="block text-blue-300">Instantly in Nigeria</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Fast, secure, and reliable platform for all your digital payments. 
              No registration required for quick purchases.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services/data"
                className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Start Now
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transition-colors inline-flex items-center justify-center"
              >
                Create Wallet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for digital payments and services in Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200"
              >
                <div className={`${service.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Shamsub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best digital payment experience in Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of Nigerians who trust shamsub for their digital payments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services/data"
              className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Make a Purchase
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-700 transition-colors inline-flex items-center justify-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;