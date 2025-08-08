import Image from "next/image";

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
}

export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      {/* Video Wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="video thumbnail"
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          src={previewUrl || "/placeholder.svg"}
          alt="video thumbnail"
          fill
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      {/** video duration box */}
      {/**TODO: Add video duration box */}
    </div>
  );
};
