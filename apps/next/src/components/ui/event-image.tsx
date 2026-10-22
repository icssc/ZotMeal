"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const PLACEHOLDER_SRC = "/placeholder-event.png";

/**
 * `EventImage` renders an event's image and falls back to a default placeholder
 * when the event has no image or the image fails to load. This avoids showing a
 * blank white area for events that are missing artwork.
 *
 * @param {Omit<ImageProps, "src"> & { src: string }} props - Standard next/image
 * props; `src` may be an empty string, in which case the placeholder is used.
 */
export default function EventImage({
  src,
  alt,
  ...props
}: Omit<ImageProps, "src"> & { src: string }) {
  const resolvedSrc = src?.trim() ? src : PLACEHOLDER_SRC;
  const [imgSrc, setImgSrc] = useState(resolvedSrc);

  // Reset when the event (and therefore its image) changes.
  useEffect(() => {
    setImgSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(PLACEHOLDER_SRC)}
    />
  );
}
