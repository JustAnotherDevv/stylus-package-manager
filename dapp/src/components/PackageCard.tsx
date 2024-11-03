import React from 'react';
import { Package, Shield, GitBranch, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Package as PackageType } from '../types';

interface PackageCardProps {
  pkg: PackageType;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const getAuditBadge = () => {
    const colors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      unverified: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[pkg.auditStatus]}`}>
        <Shield className="w-4 h-4 mr-1" />
        {pkg.auditStatus.charAt(0).toUpperCase() + pkg.auditStatus.slice(1)}
      </span>
    );
  };

  return (
    <Link 
      to={`/packages/${pkg.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <img
              src={pkg.logo || 'https://via.placeholder.com/40'}
              alt={pkg.name}
              className="w-10 h-10 rounded-lg"
            />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
              <p className="text-sm text-gray-500">{pkg.description}</p>
            </div>
          </div>
          {getAuditBadge()}
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <GitBranch className="w-4 h-4 mr-1" />
            <span>{pkg.versions.length} versions</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="w-4 h-4 mr-1" />
            <span>{pkg.upvotes}</span>
          </div>
          <div className="flex items-center">
            <ThumbsDown className="w-4 h-4 mr-1" />
            <span>{pkg.downvotes}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {pkg.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}