import {  getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient } from "@tanstack/react-query";
import OnchainProviders from "client/providers/coinbase";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  mainnet,
  optimism,
  polygon,
} from "wagmi/chains";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import "./globals.css";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, arbitrumSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <OnchainProviders>
        <SidebarProvider>
          <AppSidebar />
          <body>
            <main className="flex flex-col w-full">
              <SidebarTrigger />
              {children}
            </main>
          </body>
        </SidebarProvider>
      </OnchainProviders>
    </html>
  );
}
