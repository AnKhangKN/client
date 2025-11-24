import React from "react";
import { FaPlay } from "react-icons/fa";

const RenderMedia = ({ media, index }) => {
  if (!media) return null;

  const isVideo = media.type === "video";
  const isFirstMedia = index === 0; // <-- Check media đầu tiên

  return (
    <div
      className="flex items-center justify-center h-full bg-black/5 dark:bg-black/40 
      rounded-lg overflow-hidden"
    >
      {isVideo ? (
        <div className="relative">
          <video src={media.url} className="w-full object-contain" />

          {isFirstMedia && (
            <div className="absolute inset-0 flex items-center justify-center z-10 text-white text-6xl">
              <FaPlay />
            </div>
          )}
        </div>
      ) : (
        <img src={media.url} alt="media" className="w-full object-contain" />
      )}
    </div>
  );
};

export default RenderMedia;
