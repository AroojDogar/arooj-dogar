import Image from "next/image";
import { profile } from "@/data/profile";

/** Your photo (or initials) filling its box; size and shape come from className. */
export function ProfilePhoto({
  className,
  sizes,
  zoom = profile.photoZoom,
  focus = profile.photoFocus,
}: {
  className?: string;
  sizes: string;
  /** Override profile.photoZoom / photoFocus for a differently shaped frame */
  zoom?: number;
  focus?: string;
}) {
  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`overflow-hidden bg-surface-2 ${className ?? "relative"}`}>
      {profile.photo ? (
        <Image
          src={profile.photo}
          alt={profile.name}
          fill
          priority
          sizes={sizes}
          className="object-cover"
          style={{
            objectPosition: focus,
            transform: `scale(${zoom})`,
            transformOrigin: focus,
          }}
        />
      ) : (
        <span className="flex size-full font-semibold items-center justify-center text-5xl text-accent">
          {initials}
        </span>
      )}
    </div>
  );
}
