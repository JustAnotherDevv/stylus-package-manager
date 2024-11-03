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

const MOCK_PACKAGES: Package[] = [
  {
    id: "1",
    name: "stylus-erc20",
    description: "ERC20 implementation for Arbitrum Stylus",
    owner: "0x1234...5678",
    versions: [
      {
        version: "1.0.0",
        verificationStatus: "verified",
        sourceCode: "source code here",
        timestamp: "2024-03-15",
        contractAddress: "0xabc...def",
        deploymentHash: "0xhash...",
      },
    ],
    upvotes: 150,
    downvotes: 5,
    auditStatus: "verified",
    securityScore: 95,
    logo: "https://via.placeholder.com/40",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-15",
    tags: ["erc20", "token", "stylus"],
  },
  {
    id: "2",
    name: "stylus-nft",
    description:
      "Complete NFT implementation with metadata support for Arbitrum Stylus",
    owner: "0x9876...4321",
    versions: [
      {
        version: "1.1.2",
        verificationStatus: "verified",
        sourceCode: "source code here",
        timestamp: "2024-03-20",
        contractAddress: "0xdef...789",
        deploymentHash: "0xhash2...",
      },
      {
        version: "1.0.0",
        verificationStatus: "verified",
        sourceCode: "initial source code",
        timestamp: "2024-02-15",
        contractAddress: "0xold...789",
        deploymentHash: "0xoldhash...",
      },
    ],
    upvotes: 280,
    downvotes: 12,
    auditStatus: "verified",
    securityScore: 92,
    logo: "https://via.placeholder.com/40",
    createdAt: "2024-02-15",
    updatedAt: "2024-03-20",
    tags: ["nft", "erc721", "metadata", "stylus"],
  },
  {
    id: "3",
    name: "stylus-vault",
    description:
      "Secure multi-signature vault implementation for asset management",
    owner: "0x5555...7777",
    versions: [
      {
        version: "0.9.0",
        verificationStatus: "pending",
        sourceCode: "beta source code",
        timestamp: "2024-03-18",
        contractAddress: "0xvault...123",
        deploymentHash: "0xvaulthash...",
      },
    ],
    upvotes: 75,
    downvotes: 8,
    auditStatus: "pending",
    securityScore: 85,
    logo: "https://via.placeholder.com/40",
    createdAt: "2024-03-18",
    updatedAt: "2024-03-18",
    tags: ["vault", "multisig", "security", "stylus"],
  },
  {
    id: "4",
    name: "stylus-amm",
    description: "Automated Market Maker implementation with optimal routing",
    owner: "0x7777...8888",
    versions: [
      {
        version: "1.2.0",
        verificationStatus: "verified",
        sourceCode: `
        use alloc::{ string::String, vec, vec::Vec };
use alloy_primitives::{ b256, Address, U256 };
use alloy_sol_types::{ sol, SolError };
use core::{ borrow::BorrowMut, marker::PhantomData };
use stylus_sdk::{ abi::Bytes, evm, msg, prelude::* };

pub trait ERC1155Params {
    /// Immutable NFT name.
    const NAME: &'static str;

    /// Immutable NFT symbol.
    const SYMBOL: &'static str;

    /// The NFT's Uniform Resource Identifier.
    fn token_uri(token_id: U256) -> String;
}

sol_storage! {
    /// ERC721 implements all ERC-721 methods
    pub struct ERC1155<T: ERC721Params> {
        mapping(address => mapping(uint256 => uint256)) balanceOf;
        mapping(address => mapping(address => bool)) isApprovedForAll;
        PhantomData<T> phantom;
    }
}

// Declare events and Solidity error types
sol! {
    event TransferSingle(
        address indexed from,
        address indexed to,
        uint256 id,
    );
    event TransferBatch(
        address indexed from,
        address indexed to,
        uint256[] ids,
    );
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    event URI(string value, uint256 indexed id);
    mapping(address => mapping(uint256 => uint256)) public balanceOf;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    function uri(uint256 id) public view virtual returns (string memory);
    error TransferToZero(uint256 token_id);
    error ReceiverRefused(address receiver, uint256 token_id, bytes4 returned);
}

/// Represents the ways methods may fail.
pub enum ERC721Error {
    AlreadyMinted(AlreadyMinted),
    InvalidTokenId(InvalidTokenId),
    NotOwner(NotOwner),
    NotApproved(NotApproved),
    TransferToZero(TransferToZero),
    ReceiverRefused(ReceiverRefused),
    ExternalCall(stylus_sdk::call::Error),
}

impl From<stylus_sdk::call::Error> for ERC721Error {
    fn from(err: stylus_sdk::call::Error) -> Self {
        Self::ExternalCall(err)
    }
}
        `,
        timestamp: "2024-03-22",
        contractAddress: "0xamm...456",
        deploymentHash: "0xammhash...",
      },
    ],
    upvotes: 320,
    downvotes: 15,
    auditStatus: "verified",
    securityScore: 98,
    logo: "https://via.placeholder.com/40",
    createdAt: "2024-01-10",
    updatedAt: "2024-03-22",
    tags: ["defi", "amm", "swap", "stylus"],
  },
  {
    id: "5",
    name: "stylus-governor",
    description: "Flexible DAO governance implementation with timelock",
    owner: "0x8888...9999",
    versions: [
      {
        version: "0.8.0",
        verificationStatus: "pending",
        sourceCode: "source code here",
        timestamp: "2024-03-10",
        contractAddress: "0xgov...789",
        deploymentHash: "0xgovhash...",
      },
    ],
    upvotes: 90,
    downvotes: 3,
    auditStatus: "pending",
    securityScore: 88,
    logo: "https://via.placeholder.com/40",
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10",
    tags: ["dao", "governance", "timelock", "stylus"],
  },
];

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
