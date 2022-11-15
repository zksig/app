import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useProviderIsConnected } from "../../providers/FilecoinProvider";
import { connect, getAddress } from "../../services/filecoin";
import Button from "./Button";

export default function WalletButton() {
  const [address, setAddress] = useState("");
  const isConnected = useProviderIsConnected();

  useEffect(() => {
    (async () => {
      setAddress(await getAddress());
    })();
  }, [isConnected]);

  return (
    <>
      {isConnected ? (
        <Button
          text={address}
          onClick={async () => {
            try {
              await connect();
            } catch (e: any) {
              toast.error(e);
            }
          }}
        />
      ) : (
        <Button
          text="Connect Wallet"
          onClick={async () => {
            try {
              await connect();
              location.reload();
            } catch (e: any) {
              toast.error(e);
            }
          }}
        />
      )}
    </>
  );
}
