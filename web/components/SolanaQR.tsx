import { QRCodeSVG } from "qrcode.react";
import SOL from "@/../public/sol.png"
import Image from "next/image";

interface QRInterface {
    address: string;
    amount: string;
    label: string;
}

export default function SolanaQR({ address, amount, label }: QRInterface) {
  const buildSolanaUri = () => {
    let uri = `solana:${address}`;
    const params = [];
    
    if (amount) {
      params.push(`amount=${amount}`);
    }
    if (label) {
      params.push(`label=${encodeURIComponent(label)}`);
    }
    
    if (params.length > 0) {
      uri += `?${params.join('&')}`;
    }
    
    return uri;
  };

  const solanaUri = buildSolanaUri();

  return (
    <div className="relative w-48 h-48">
      <QRCodeSVG
        value={solanaUri}
        size={192}
        level="H"
        includeMargin={true}
      />

      <Image
        src={SOL}
        alt="Solana"
        width={48}
        height={48}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-1"
      />
    </div>
  );
}
