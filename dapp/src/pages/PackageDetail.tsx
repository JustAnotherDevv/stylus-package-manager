import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Package as PackageIcon,
  Shield,
  GitBranch,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import VersionComparison from "../components/VersionComparison";
import SourceCodePreview from "../components/SourceCodePreview";
import { Package } from "../types";

// Mock data moved to a separate data file
const MOCK_PACKAGES: Record<string, Package> = {
  "1": {
    id: "1",
    name: "stylus-erc20",
    description: "ERC20 implementation for Arbitrum Stylus",
    owner: "0x1234...5678",
    versions: [
      {
        version: "1.0.0",
        verificationStatus: "verified",
        sourceCode:
          "pub mod erc20 {\n    // ERC20 implementation\n    #[derive(Default)]\n    pub struct Token {\n        total_supply: u64,\n        balances: HashMap<Address, u64>,\n    }\n}",
        timestamp: "2024-03-15",
        contractAddress: "0xabc...def",
        deploymentHash: "0xhash...",
      },
      {
        version: "0.9.0",
        verificationStatus: "verified",
        sourceCode: "pub mod erc20 {\n    // Previous version\n}",
        timestamp: "2024-03-10",
        contractAddress: "0xabc...def",
        deploymentHash: "0xhash...",
      },
    ],
    upvotes: 150,
    downvotes: 5,
    auditStatus: "verified",
    logo: "https://via.placeholder.com/40",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-15",
    tags: ["erc20", "token", "stylus"],
    githubUrl: "https://github.com/example/stylus-erc20",
    website: "https://example.com",
  },
};

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const pkg = MOCK_PACKAGES[id || ""];
  const [selectedVersion, setSelectedVersion] = useState(
    pkg?.versions[0].version
  );

  if (!pkg) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Package not found
          </h2>
          <Link
            to="/packages"
            className="mt-4 text-purple-600 hover:text-purple-700"
          >
            Back to packages
          </Link>
        </div>
      </div>
    );
  }

  const currentVersion = pkg.versions.find(
    (v) => v.version === selectedVersion
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <Link
        to="/packages"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to packages
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src={pkg.logo}
                  alt={pkg.name}
                  className="w-16 h-16 rounded-lg"
                />
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {pkg.name}
                  </h1>
                  <p className="text-gray-600 mt-1">{pkg.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600">
                  <ThumbsUp className="h-5 w-5" />
                  <span>{pkg.upvotes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600">
                  <ThumbsDown className="h-5 w-5" />
                  <span>{pkg.downvotes}</span>
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Source Code
                </h2>
                <span className="text-sm text-gray-500">
                  Version {selectedVersion}
                </span>
              </div>
              <SourceCodePreview code={currentVersion?.sourceCode || ""} />
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Contract Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Contract Address</p>
                    <p className="text-sm font-mono">
                      {currentVersion?.contractAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deployment Hash</p>
                    <p className="text-sm font-mono">
                      {currentVersion?.deploymentHash}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Package Info
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Owner</dt>
                  <dd className="mt-1 text-sm text-gray-900">{pkg.owner}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Links</dt>
                  <dd className="mt-1 space-y-2">
                    {pkg.githubUrl && (
                      <a
                        href={pkg.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        GitHub Repository
                      </a>
                    )}
                    {pkg.website && (
                      <a
                        href={pkg.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <VersionComparison
              versions={pkg.versions}
              selectedVersion={selectedVersion}
              onVersionSelect={setSelectedVersion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
