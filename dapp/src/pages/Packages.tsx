import React, { useState } from 'react';
import PackageCard from '../components/PackageCard';
import { Package } from '../types';
import { Filter } from 'lucide-react';

const MOCK_PACKAGES: Package[] = [
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
  },
  // Add more mock packages as needed
];

export default function Packages() {
  const [sortBy, setSortBy] = useState('newest');
  const [filterAudit, setFilterAudit] = useState('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Packages</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="security">Security Score</option>
            </select>
          </div>
          
          <select
            value={filterAudit}
            onChange={(e) => setFilterAudit(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
          >
            <option value="all">All Audit Status</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Audit</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_PACKAGES.map(pkg => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}