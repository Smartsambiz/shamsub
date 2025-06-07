import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Mail, Phone, MapPin, Shield, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">PayHub</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Nigeria's trusted platform for instant data, airtime, utility bills, and TV subscription payments. 
              Fast, secure, and reliable service delivery.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Shield className="h-4 w-4 text-green-400" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>Instant Delivery</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/data" className="text-gray-300 hover:text-white transition-colors">
                  Data Plans
                </Link>
              </li>
              <li>
                <Link to="/services/airtime" className="text-gray-300 hover:text-white transition-colors">
                  Airtime Top-up
                </Link>
              </li>
              <li>
                <Link to="/services/utilities" className="text-gray-300 hover:text-white transition-colors">
                  Utility Bills
                </Link>
              </li>
              <li>
                <Link to="/services/tv" className="text-gray-300 hover:text-white transition-colors">
                  TV Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@payhub.ng</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+234 901 234 5678</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 PayHub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;