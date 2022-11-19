import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useProviderIsConnected } from "../../providers/FilecoinProvider";
import { connect, getAddress } from "../../services/digitalSignature";
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
          icon={<Image src="/filecoin.svg" height={75} width={75} />}
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
