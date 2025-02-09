"use client";

import React, { useCallback } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./ui/button";

// Utility function to shorten address
const shortenAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const Account = () => {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const connectWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === "coinbaseWalletSDK",
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  if (isConnected && address) {
    return (
      <div className="flex flex-col gap-3 mt-12 w-[50%]">
        <div className="px-4 py-3 bg-gray-100 rounded-lg font-mono text-sm">
          Connected to: {shortenAddress(address)}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-center items-center">
      {/* // TODO this should probably be it's own component */}
      <Button className="w-[50%]" onClick={connectWallet}>
        {isConnected ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Connecting...
          </div>
        ) : (
          "Login/Sign Up"
        )}
      </Button>
    </div>
  );
};

export default Account;
