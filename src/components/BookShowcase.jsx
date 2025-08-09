const BookShowcase = () => {
  const books = [
    "/images/image1.png",
    "/images/image2.png",
    "/images/image3.png",
    "/images/bookcover.png",
    "/images/image.png",
  ];
  //recommended image covers 300x450 pixels (2:3 ratio) WebP preferred. 

  const middleIndex = Math.floor(books.length / 2);

  return (
    <div className="relative w-full flex flex-col items-center justify-center mt-10">

      {/* Books */}
      <div className="relative flex items-end justify-center -mt-6 z-10">
        {books.map((src, index) => {
          const isCenter = index === middleIndex;
          const zIndex = isCenter ? 30 : 20 - Math.abs(index - middleIndex);

          return (
            <div
              key={index}
              className={`relative w-22 md:w-30 lg:w-38 aspect-[2/3] rounded-lg shadow-lg border border-gray-300 overflow-hidden cursor-pointer transition-all duration-500
                ${isCenter ? "scale-100" : "scale-100"}
                hover:-translate-y-3 hover:shadow-2xl
              `}
              style={{
                marginLeft: index !== 0 ? -40 : 0,
                zIndex: zIndex 
              }}
            >
              <img
                src={src}
                alt={`Book ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          );
        })}
      </div>
      {/* Shelf */}
      <div className="relative w-full mt-0.5">
        <div className="relative w-full h-4 sm:h-5 md:h-6 lg:h-7 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-md shadow-2xl">

          <div className="absolute inset-0 rounded-md opacity-30" style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.1) 2px,
              rgba(0,0,0,0.1) 4px
            )`
          }}></div>

          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-md opacity-80"></div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-900 to-amber-800 rounded-b-md"></div>
        </div>

        <div className="absolute top-full left-0 right-0 h-2 sm:h-2.5 md:h-3 lg:h-3.5 bg-gradient-to-b from-amber-700 to-amber-900 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-px bg-amber-600"></div>

          <div className="absolute inset-0 opacity-20" style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0,0,0,0.1) 1px,
              rgba(0,0,0,0.1) 2px
            )`
          }}></div>
        </div>

        <div className="absolute left-1/4 top-full">
          <div className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-3 sm:h-4 md:h-5 lg:h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-sm shadow-md">
            <div className="absolute top-0 left-0 w-full h-px bg-gray-300"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gray-600"></div>
          </div>
          <div className="absolute top-full left-0 w-full h-1 bg-black/20 rounded-b-sm"></div>
        </div>

        <div className="absolute right-1/4 top-full">
          <div className="w-2 sm:w-2.5 md:w-3 lg:w-3.5 h-3 sm:h-4 md:h-5 lg:h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-sm shadow-md">
            <div className="absolute top-0 left-0 w-full h-px bg-gray-300"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gray-600"></div>
          </div>
          <div className="absolute top-full left-0 w-full h-1 bg-black/20 rounded-b-sm"></div>
        </div>

          <div className="absolute top-full left-2 right-2 mt-4 sm:mt-5 md:mt-6 lg:mt-7 h-2 bg-black/10 rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export default BookShowcase;
