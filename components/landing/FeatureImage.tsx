/**
 * Feature Image Component
 *
 * Displays either a placeholder or actual screenshot/GIF for landing page features
 * Makes it easy to swap between placeholder and real images
 * Optimized for performance with Next.js Image component
 */

import Image from "next/image";
import { LucideIcon } from "lucide-react";

interface FeatureImageProps {
  src?: string; // Path to image (e.g., "/screenshots/pipeline.png")
  alt: string;
  placeholderIcon?: LucideIcon; // Lucide icon component
  placeholderText: string; // Text to show in placeholder
  placeholderPath: string; // File path hint for placeholder
  priority?: boolean; // Load image with priority (for above-the-fold images)
}

export default function FeatureImage({
  src,
  alt,
  placeholderIcon,
  placeholderText,
  placeholderPath,
  priority = false,
}: FeatureImageProps) {
  // If src is provided and file exists, show the image
  // Otherwise show placeholder

  if (src) {
    // Check if it's a GIF (animated images should not be optimized by Next.js)
    const isGif = src.endsWith('.gif');

    return (
      <div className="aspect-video bg-muted/30 rounded-lg overflow-hidden border border-border/50 relative">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          priority={priority}
          unoptimized={isGif} // Don't optimize GIFs to preserve animation
          quality={isGif ? 100 : 90}
        />
      </div>
    );
  }

  // Placeholder view
  const IconComponent = placeholderIcon;

  return (
    <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center border border-border/50">
      <div className="text-center space-y-2">
        {IconComponent && <IconComponent size={64} className="text-muted-foreground mx-auto" />}
        <p className="text-sm text-muted-foreground">{placeholderText}</p>
        <p className="text-xs text-muted-foreground/70">{placeholderPath}</p>
      </div>
    </div>
  );
}
