import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

const IMAGE_MAP: Record<string, string> = {
  "Laptop": "/items/laptop.png",
  "Buku": "/items/buku.png",
  "Charger": "/items/charger.png",
  "Botol Minum": "/items/botol-minum.png",
  "Kotak Pensil": "/items/kotak-pensil.png",
  "Powerbank": "/items/powerbank.png",
  "Jaket": "/items/jaket.png",
};

interface ItemIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function ItemIcon({ name, className, size = 32 }: ItemIconProps) {
  const src = IMAGE_MAP[name];

  if (!src) {
    return <Package className={cn("size-5 text-muted", className)} />;
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn("object-contain", className)}
    />
  );
}
