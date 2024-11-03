# Stylus Package Manager

Stylus package manager transforms Web3 development by giving developers access to public verifiable on-chain directory of smart contract packages.

```mermaid
flowchart TB
    subgraph "User Interfaces"
        direction LR
        DApp["Web DApp"]
        CLI["CLI Tool"]
    end

    subgraph "Storage Layer"
        IPFS["IPFS"]
    end

    subgraph "Smart Contract"
        PKG_REGISTRY["Package Registry"]
        PKG_REGISTRY --> |stores| METADATA["Package Metadata"]
        PKG_REGISTRY --> |tracks| VERSIONS["Version History"]
        PKG_REGISTRY --> |manages| SOCIAL["Social Data<br/>(Tags, Upvotes)"]
    end

    %% DApp Operations
    DApp --> |browse packages| PKG_REGISTRY
    DApp --> |create/update| IPFS
    DApp --> |register/modify| PKG_REGISTRY

    %% CLI Operations
    CLI --> |upload source| IPFS
    CLI --> |publish/update| PKG_REGISTRY
    CLI --> |fetch dependencies| PKG_REGISTRY
    CLI --> |download code| IPFS

    %% Data Flow
    IPFS --> |content CIDs| PKG_REGISTRY

    classDef interface fill:#f9f9f9,stroke:#333,stroke-width:2px
    classDef storage fill:#f0f8ff,stroke:#333,stroke-width:2px
    classDef contract fill:#fff0f5,stroke:#333,stroke-width:2px

    class DApp,CLI interface
    class IPFS storage
    class PKG_REGISTRY,METADATA,VERSIONS,SOCIAL contract
```

![Screenshot 2024-11-03 at 17.12.45.png](https://cdn.dorahacks.io/static/files/192f296a552c6acfbdb4cb84577a096f.png)

![Screenshot 2024-11-03 at 17.12.50.png](https://cdn.dorahacks.io/static/files/192f296d12a9715865536bb426b820fd.png)

![Screenshot 2024-11-03 at 17.13.11.png](https://cdn.dorahacks.io/static/files/192f296f5d9951b85c0fbc244969957d.png)

## Deployments

- V1 - `0x9a6ad25b3ea706008a31b877823def127442f63b`

- V2 - `0xf7b19f8b30967724a32a0995d5f767e620030af8`

- V3 - `0x7a394022193f9bab8a6660df4c418c0b5a6aa315`

## Setup

- `git clone <reppo>`
- `cd dapp && npm i` to install dependencies
- run dapp using `npm run dev`

## Usage

- deploy Stylus smart contract with:

```bash
cargo stylus deploy \
  --endpoint='http://localhost:8547' \
  --private-key="0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659" \
  --estimate-gas
```

## Features

- Package information stored directly on-chain in smart contract directory
- Package versioning
- Package build verification, source code, security audit status
- Retrieval of data and browsing packages in dapp
- CLI tool for fetching packages from smart contract and managing dependencies

## Contact

- tg - **Someone_Nevv**
