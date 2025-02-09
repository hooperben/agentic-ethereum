import Account from "client/components/Account";
import Dictaphone from "client/components/voice";
import WalletWrapper from "client/components/WalletWrapper";

export default function Home() {
  return (
    <div className="h-screen text-mono">
      <div className="flex flex-col h-full w-full relative">
        <div className="w-full text-center mt-20">
          <p>afbap</p>
        </div>
        <Account />

        <div className="absolute bottom-[20%] w-full">
          <Dictaphone />
        </div>
      </div>
    </div>
  );
}
