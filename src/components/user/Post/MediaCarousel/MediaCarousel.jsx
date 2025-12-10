import { useState } from "react";

const MediaCarousel = ({ medias }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % medias.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + medias.length) % medias.length);
  };

  const currentMedia = medias[currentIndex];

  return (
    <div className="relative w-full h-96 flex items-center justify-center bg-gray-100">
      {currentMedia.type === "image" ? (
        <img
          src={currentMedia.url}
          alt="media"
          className="object-contain max-h-full"
        />
      ) : (
        <video
          key={currentIndex}
          controls
          className="object-contain max-h-full"
        >
          <source src={currentMedia.url} type="video/mp4" />
        </video>
      )}

      {/* Navigation */}
      {medias.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute z-50 left-2 top-1/2 transform -translate-y-1/2 
             bg-black/50 text-white p-2 rounded-full cursor-pointer"
          >
            Prev
          </button>

          <button
            onClick={handleNext}
            className="absolute z-50 right-2 top-1/2 transform -translate-y-1/2 
             bg-black/50 text-white p-2 rounded-full cursor-pointer"
          >
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default MediaCarousel;
