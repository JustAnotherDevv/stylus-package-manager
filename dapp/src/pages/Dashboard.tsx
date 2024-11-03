import React from 'react';
import { Package as PackageIcon, Plus, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import { Package } from '../types';

const MOCK_USER_PACKAGES: Package[] = [
  {
    id: '1',
    name: 'stylus-erc20',
    description: 'ERC20 implementation for Arbitrum Stylus',
    owner: '0x1234...5678',
    versions: [
      {
        version: '1.0.0',
        verificationStatus: 'verified',
        sourceCode: 'source code here',
        timestamp: '2024-03-15',
        contractAddress: '0xabc...def',
        deploymentHash: '0xhash...'
      }
    ],
    upvotes: 150,
    downvotes: 5,
    auditStatus: 'verified',
    securityScore: 95,
    logo: 'https://via.placeholder.com/40',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15',
    tags: ['erc20', 'token', 'stylus']
  }
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/publish"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Publish Package
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Packages</h2>
            <div className="space-y-6">
              {MOCK_USER_PACKAGES.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Connected Wallet</p>
                    <p className="text-sm text-gray-500">0x1234...5678</p>
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700">
                    Disconnect
                  </button>
                </div>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <PackageIcon className="h-5 w-5 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-500">Total Packages</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-gray-900">1</p>
                  <p className="text-sm text-gray-500">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}