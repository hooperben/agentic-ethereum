import Account from "client/components/account";
import Dictaphone from "client/components/voice";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center w-full text-center">
        <p className="w-full text-center">afbap</p>
      </div>
      <div className="w-full">
        <Account />
      </div>
      <div className="w-full">
        <Dictaphone />
      </div>
    </div>
  );
}
