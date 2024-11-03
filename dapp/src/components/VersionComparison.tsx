import React from 'react';
import { Version } from '../types';
import { Shield, GitBranch, Calendar } from 'lucide-react';

interface VersionComparisonProps {
  versions: Version[];
  selectedVersion: string;
  onVersionSelect: (version: string) => void;
}

export default function VersionComparison({
  versions,
  selectedVersion,
  onVersionSelect,
}: VersionComparisonProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {versions.map((version) => (
          <button
            key={version.version}
            onClick={() => onVersionSelect(version.version)}
            className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 ${
              selectedVersion === version.version ? 'bg-purple-50' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <GitBranch className="h-5 w-5 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  v{version.version}
                </p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(version.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  version.verificationStatus === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : version.verificationStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <Shield className="h-3 w-3 mr-1" />
                {version.verificationStatus}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}