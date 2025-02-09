import Testbed from "client/components/ui/testbed";
import Dictaphone from "client/components/voice";

export default function Home() {
  return (
    <div className="h-screen text-mono">
      <Testbed />
      <div className="flex flex-col h-full w-full relative">
        <div className="w-full text-center mt-20">
          <p>afbap</p>
        </div>
        <div className="w-full flex justify-center mt-10">
          <div className="bg-white rounded-lg shadow-md p-6 w-80">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">USDC</span>
              <span className="text-2xl font-semibold">10.00</span>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center mt-10">
          <div className="bg-white rounded-lg shadow-md p-6 w-80">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">GLUE</span>
              <span className="text-2xl font-semibold">420.00</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[20%] w-full">
          <Dictaphone />
        </div>
      </div>
    </div>
  );
}
