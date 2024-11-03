import { http, createConfig } from "wagmi";
import { mainnet, sepolia, arbitrumSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(),
    // [sepolia.id]: http(),
  },
});
