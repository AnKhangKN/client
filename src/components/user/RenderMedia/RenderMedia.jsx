import React from "react";

const RenderMedia = ({ media }) => {
  if (!media) return null;

  const isVideo = media.type === "video";

  return (
    <div
      className="flex items-center justify-center h-full bg-black/5 dark:bg-black/40 
      rounded-lg overflow-hidden"
    >
      {isVideo ? (
        <video src={media.url} controls className="w-full object-contain" />
      ) : (
        <img src={media.url} alt="media" className="w-full object-contain" />
      )}
    </div>
  );
};

export default RenderMedia;
