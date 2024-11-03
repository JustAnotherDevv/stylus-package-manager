import { useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
  useTransaction,
} from "wagmi";
import { parseAbi } from "viem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CONTRACT_ADDRESS = "0x9a6ad25b3ea706008a31b877823def127442f63b"; // Replace with your contract address

const CONTRACT_ABI = parseAbi([
  "function registerPkg(string calldata new_name, string calldata initial_cid, string calldata initial_metadata_cid) external",
  "function updatePkg(uint256 pkg_id, string calldata new_cid) external returns (bool)",
  "function updateMetadata(uint256 pkg_id, string calldata new_metadata_cid) external returns (bool)",
  "function getPkgCid(uint256 pkg_id, uint256 version) external view returns (string)",
  "function getPkgVersion(uint256 pkg_id) external view returns (uint256)",
  "function getPkg(uint256 pkg_id) external view returns (string, address, uint256, string, string)",
]);

export default function Debugger() {
  const [pkgId, setPkgId] = useState("0");
  const [version, setVersion] = useState("0");
  const [txHash, setTxHash] = useState("");

  const {
    data: pkgInfo,
    error: pkgError,
    isPending: pkgLoading,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPkg",
    args: [BigInt(pkgId)],
  });

  const { data: pkgVersion } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPkgVersion",
    args: [BigInt(pkgId)],
  });

  const { data: pkgCid } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPkgCid",
    args: [BigInt(pkgId), BigInt(version)],
  });

  const { writeContract: writeRegisterPkg, isPending: isRegisterPending } =
    useWriteContract();
  const { writeContract: writeUpdatePkg, isPending: isUpdatePending } =
    useWriteContract();

  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useTransaction({
    hash: txHash as `0x${string}`,
  });

  const handleRegisterPkg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const hash = await writeRegisterPkg({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "registerPkg",
      args: [
        formData.get("name") as string,
        formData.get("cid") as string,
        formData.get("metadataCid") as string,
      ],
    });
    if (hash) setTxHash(hash);
  };

  const handleUpdatePkg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const hash = await writeUpdatePkg({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "updatePkg",
      args: [
        BigInt(formData.get("updatePkgId") as string),
        formData.get("newCid") as string,
      ],
    });
    if (hash) setTxHash(hash);
  };

  return (
    <div className=" mx-auto p-4 space-y-6 bg-red-600 w-full">
      <Card>
        <CardHeader>
          <CardTitle>VisitorBook Contract Debugger</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Package Query Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Query Package</h3>
            <div className="flex gap-4">
              <Input
                type="number"
                placeholder="Package ID"
                value={pkgId}
                onChange={(e) => setPkgId(e.target.value)}
                className="w-32"
              />
              <Input
                type="number"
                placeholder="Version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-32"
              />
              <Button variant="outline">Query</Button>
            </div>
          </div>

          {/* Package Info Display */}
          {pkgInfo && (
            <Alert>
              <AlertDescription>
                <div className="space-y-2">
                  <p>
                    <strong>Name:</strong> {pkgInfo[0]}
                  </p>
                  <p>
                    <strong>Owner:</strong> {pkgInfo[1]}
                  </p>
                  <p>
                    <strong>Version:</strong> {pkgInfo[2]?.toString()}
                  </p>
                  <p>
                    <strong>CID:</strong> {pkgInfo[3]}
                  </p>
                  <p>
                    <strong>Metadata CID:</strong> {pkgInfo[4]}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Register Package Form */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Register New Package</h3>
            <form onSubmit={handleRegisterPkg} className="space-y-2">
              <Input name="name" placeholder="Package Name" />
              <Input name="cid" placeholder="Initial CID" />
              <Input name="metadataCid" placeholder="Initial Metadata CID" />
              <Button type="submit" disabled={isRegisterPending || isTxLoading}>
                {isRegisterPending || isTxLoading
                  ? "Registering..."
                  : "Register Package"}
              </Button>
            </form>
          </div>

          {/* Update Package Form */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Update Package</h3>
            <form onSubmit={handleUpdatePkg} className="space-y-2">
              <Input
                name="updatePkgId"
                type="number"
                placeholder="Package ID"
              />
              <Input name="newCid" placeholder="New CID" />
              <Button type="submit" disabled={isUpdatePending || isTxLoading}>
                {isUpdatePending || isTxLoading
                  ? "Updating..."
                  : "Update Package"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
