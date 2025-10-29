/**
 * Feature Image Component
 *
 * Displays either a placeholder or actual screenshot/GIF for landing page features
 * Makes it easy to swap between placeholder and real images
 */

import Image from "next/image";

interface FeatureImageProps {
  src?: string; // Path to image (e.g., "/screenshots/pipeline.png")
  alt: string;
  placeholderIcon: string; // Flaticon class (e.g., "fi-ts-mobile-notch")
  placeholderText: string; // Text to show in placeholder
  placeholderPath: string; // File path hint for placeholder
}

export default function FeatureImage({
  src,
  alt,
  placeholderIcon,
  placeholderText,
  placeholderPath,
}: FeatureImageProps) {
  // If src is provided and file exists, show the image
  // Otherwise show placeholder

  if (src) {
    return (
      <div className="aspect-video bg-muted/30 rounded-lg overflow-hidden border border-border/50">
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Placeholder view
  return (
    <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center border border-border/50">
      <div className="text-center space-y-2">
        <i className={`${placeholderIcon} text-6xl text-muted-foreground`}></i>
        <p className="text-sm text-muted-foreground">{placeholderText}</p>
        <p className="text-xs text-muted-foreground/70">{placeholderPath}</p>
      </div>
    </div>
  );
}
