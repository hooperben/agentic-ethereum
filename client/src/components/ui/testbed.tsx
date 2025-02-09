"use client";

import {
  useAccount,
  usePrepareTransactionRequest,
  useReadContract,
  UseReadContractParameters,
  useWriteContract,
} from "wagmi";
import { useState } from "react";
import { Button } from "./button";
import { Abi, etherUnits, maxUint256 } from "viem";

const VAULT_ADDRESS = "0xA161Fb50D16aA6f3ceF595AA7D76D886ea1d14b0";

const contractConfig: UseReadContractParameters = {
  address: VAULT_ADDRESS,
  functionName: "owner",
  abi: [
    {
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { name: "erc20", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      name: "deposit",
      outputs: [],
      payable: true,
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

export default function Testbed() {
  const [owner, setOwner] = useState<string | null>(null);
  const { refetch, data, error, status } = useReadContract(contractConfig);
  const { writeContractAsync } = useWriteContract();

  const depositToVault = async () => {
    const result = await writeContractAsync({
      ...(contractConfig as any),
      functionName: "deposit",
      args: [TOKEN_ADDRESS, 100],
      gas: 7000000,
    });

    console.log(result);
  };

  return (
    <div className="p-4">
      <TestTokenTestbed />
      <Button onClick={() => refetch()}>Get Owner</Button>
      {owner && <p className="mt-2">Contract Owner: {owner}</p>}
      <Button onClick={depositToVault}>Deposit 100</Button>
    </div>
  );
}

const TOKEN_ADDRESS = "0xD3d36A7d514f55da2a4C4C22ef5EaBAB0781ecaD";

const tokenConfig: UseReadContractParameters = {
  address: TOKEN_ADDRESS,
  functionName: "balanceOf",
  abi: [
    {
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    // Mint
    {
      inputs: [
        { name: "to", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      name: "mint",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    // Approve
    {
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

const TestTokenTestbed = () => {
  const { address } = useAccount();
  const { data, error, status, refetch } = useReadContract({
    ...tokenConfig,
    args: [address],
  });
  const { writeContract } = useWriteContract();

  const mint = async () => {
    writeContract({
      ...(tokenConfig as any),
      functionName: "mint",
      args: [address, 100],
    });
  };

  const approveTokenToVault = async () => {
    writeContract({
      ...(tokenConfig as any),
      functionName: "approve",
      args: [VAULT_ADDRESS, maxUint256],
    });
  };

  return (
    <div className="p-4">
      <Button onClick={() => refetch()}>Get Balance: {data as any}</Button>
      <Button onClick={mint}>Mint 100</Button>
      <Button onClick={approveTokenToVault}>Approve Vault</Button>
    </div>
  );
};
