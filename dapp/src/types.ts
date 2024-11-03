export interface Package {
  id: string;
  name: string;
  description: string;
  owner: string;
  versions: Version[];
  upvotes: number;
  downvotes: number;
  auditStatus: 'verified' | 'pending' | 'unverified';
  securityScore: number;
  logo: string;
  createdAt: string;
  updatedAt: string;
  githubUrl?: string;
  website?: string;
  tags: string[];
}

export interface Version {
  version: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  sourceCode: string;
  timestamp: string;
  contractAddress: string;
  deploymentHash: string;
}

export interface User {
  address: string;
  packages: Package[];
  favorites: string[];
}