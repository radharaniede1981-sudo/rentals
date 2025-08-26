import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  Shield,
  Banknote,
  Clock,
  ArrowRight
} from 'lucide-react';

interface PaymentGatewayProps {
  onNavigate: (page: string) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ onNavigate }) => {
  const [selectedGateway, setSelectedGateway] = useState('stripe');
  const [paymentType, setPaymentType] = useState('full');
  const [showPaymentForm, setShowPaymentForm] = useState(true);

  const gateways = [
    { id: 'stripe', name: 'Stripe', logo: '💳', fees: '2.9% + 30¢', processing: 'Instant' },
    { id: 'paypal', name: 'PayPal', logo: '🅿️', fees: '3.4% + 30¢', processing: 'Instant' },
    { id: 'razorpay', name: 'Razorpay', logo: '🔷', fees: '2.0% + ₹2', processing: 'Instant' }
  ];

  // For integration, you may want to pass these as props or fetch from context
  const pendingPayments = [];
  const recentTransactions = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Process Payment</h2>
            <button 
              onClick={() => onNavigate('close')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Type</label>
            <div className="space-y-3">
              {[
                { id: 'full', label: 'Full Payment', desc: 'Complete payment of the total amount' },
                { id: 'partial', label: 'Partial Payment / Deposit', desc: 'Pay a portion of the total amount' },
                { id: 'late_fee', label: 'Late Return Fee', desc: 'Additional charges for late returns' }
              ].map((type) => (
                <div
                  key={type.id}
                  onClick={() => setPaymentType(type.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentType === type.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <div className="relative">
              <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Payment Gateway */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Gateway</label>
            <div className="grid grid-cols-3 gap-3">
              {gateways.map((gateway) => (
                <div
                  key={gateway.id}
                  onClick={() => setSelectedGateway(gateway.id)}
                  className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                    selectedGateway === gateway.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{gateway.logo}</div>
                  <div className="text-sm font-medium">{gateway.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Shield size={18} className="text-green-600" />
              <span className="text-sm font-medium text-gray-900">Secure Payment Form</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button 
              onClick={() => onNavigate('close')}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              onClick={() => onNavigate('success')}
            >
              <span>Process Payment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
