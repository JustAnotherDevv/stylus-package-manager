import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Debugger from "./components/Debugger";

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="w-full bg-blue-600 ">
          <Debugger />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
