"use client";

import { Header } from "@/components/Header";
import { MessageBoard } from "@/components/MessageBoard";
import { NetworkInfo } from "@/components/NetworkInfo";
import { TopBanner } from "@/components/TopBanner";
import { TransferAPT } from "@/components/TransferAPT";
import { WalletDetails } from "@/components/WalletDetails";
import { Button } from "@/components/ui/button";
import { aptosClient } from "@/utils/aptosClient";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet,InputTransactionData, AccountInfo, } from "@aptos-labs/wallet-adapter-react";
import { toast } from "react-hot-toast";
function App() {
  const { account, signAndSubmitTransaction } = useWallet();

  const MODULE_ADDRESS = "24ee77b7399ba1ca642876158895e88a0488a1be8d73130ad5adfd6cd0cb87c1";
  const CONTRACT_NAME = "TelemedicineBilling";

// Replace with the actual function name in your Move contract
const PAY_CONSULTATION_FUNCTION = "pay_consultation_fee";
  interface HandlePaymentProps {
    account: AccountInfo | null;
    signAndSubmitTransaction: (
      transaction: InputTransactionData
    ) => Promise<{ hash: string }>;
    providerAddress: string;
    consultationFee: number;
    onPaymentSuccess?: () => void; // Optional callback for successful payment
    onPaymentError?: (error: any) => void; // Optional callback for payment error
  }
  
  const handlePayment = async ({
    account,
    signAndSubmitTransaction,
    providerAddress,
    consultationFee,
    onPaymentSuccess,
    onPaymentError,
  }: HandlePaymentProps) => {
    if (!account) {
      toast.error("Please connect your wallet first.");
      return false;
    }
  
    const transaction: InputTransactionData = {
      data: {
        function: `${MODULE_ADDRESS}::${CONTRACT_NAME}::${PAY_CONSULTATION_FUNCTION}`,
        functionArguments: [providerAddress],
      },
    };
  
    try {
      toast.loading("Processing payment...", { id: "payment" });
      const response = await signAndSubmitTransaction(transaction);
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      toast.success(`Payment of ${consultationFee} APT successful!`, { id: "payment" });
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      return true;
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`, { id: "payment" });
      if (onPaymentError) {
        onPaymentError(error);
      }
      return false;
    }
  };
const consultationFee = 0.1; // Example fee, replace with actual value
const name = "Dr. John Doe"; // Example doctor name, replace with actual 
const providerAddress= "value"
  const handlePayClick = async () => {
    if (!providerAddress) {
      toast.error("Doctor address is not available.");
      return;
    }
    

    const success = await handlePayment({
      account: account, // Access the hex string of the address
      signAndSubmitTransaction,
      providerAddress: providerAddress,
      consultationFee: consultationFee,
      onPaymentSuccess: () => {
        toast.success(`Successfully paid Dr. ${name}!`);
        // Optionally update UI or refetch data
      },
      onPaymentError: (error) => {
        console.error("Payment failed:", error);
        toast.error(`Payment failed: ${error?.message || 'An unexpected error occurred.'}`);
      },
    });

    if (success) {
      // Any further actions after successful payment
    }
  };

  return (
    <>
    <TopBanner />
      <Header />
      <div className="flex items-center justify-center flex-col">
        {account ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              <WalletDetails />
              <NetworkInfo />
              {/* <AccountInfo /> */}
              <TransferAPT />
              <Button onClick={handlePayClick}> Add new list </Button>
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  );
}

export default App;
