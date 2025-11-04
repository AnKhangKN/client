import React from "react";
import RenderMedia from "../RenderMedia/RenderMedia";

const MediaLayout = ({ medias }) => {
  if (!medias || medias.length === 0) return null;

  // 🖼️ 1 media → full khung
  if (medias.length === 1) {
    return (
      <div
        className="p-4 border border-gray-200 rounded-lg shadow-lg dark:border-0 
      dark:bg-[#333334] flex justify-center items-center"
      >
        <RenderMedia media={medias[0]} />
      </div>
    );
  }

  // 🖼️ 2 media → chia đôi 50% - 50%
  if (medias.length === 2) {
    return (
      <div
        className="flex gap-2 justify-center items-center p-4 border border-gray-200 
        rounded-lg shadow-lg overflow-hidden dark:border-0 dark:bg-[#333334]"
      >
        {medias.map((m, i) => (
          <div
            key={i}
            className="w-1/2 h-full flex justify-center items-center"
          >
            <RenderMedia media={m} />
          </div>
        ))}
      </div>
    );
  }

  // 🖼️ 3 media → 1 bên trái, 2 bên phải chia đôi
  if (medias.length === 3) {
    return (
      <div
        className="flex gap-2 p-4 border border-gray-200 rounded-lg shadow-lg 
        overflow-hidden dark:border-0 dark:bg-[#333334]"
      >
        <div className="w-1/2 flex justify-center items-center">
          <RenderMedia media={medias[0]} />
        </div>

        <div className="w-1/2 flex flex-col gap-2">
          {medias.slice(1, 3).map((m, i) => (
            <div
              key={i}
              className="flex-1 flex justify-center items-center"
              style={{ minHeight: "0" }}
            >
              <RenderMedia media={m} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🖼️ ≥4 media → 1 bên trái, 2 bên phải, +overlay
  return (
    <div
      className="flex gap-2 overflow-hidden p-4 border border-gray-200 
      rounded-lg shadow-lg dark:border-0 dark:bg-[#333334]"
    >
      {/* Media đầu tiên (bên trái 50%) */}
      <div className="w-1/2 flex justify-center items-center">
        <RenderMedia media={medias[0]} />
      </div>

      {/* 2 media tiếp theo (bên phải xếp dọc) */}
      <div className="w-1/2 flex flex-col gap-2">
        {medias.slice(1, 3).map((m, i) => (
          <div
            key={i}
            className="relative flex-1 flex justify-center items-center"
          >
            <RenderMedia media={m} />
            {i === 1 && medias.length > 3 && (
              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  +{medias.length - 3}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaLayout;
