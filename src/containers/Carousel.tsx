
// import React, { FC, useCallback, useEffect, useRef, useState } from "react";


// interface Slider {
//   Id?: string | number;
//   topImg?: string;
//   className?: string;
//   secondImg?: string | null;
//   intrevalSeconds?: number;
//   thirdImg?: string | null;
//   indicatorsClass?: string;
//   onClickInd?: (index: number) => void;
//   onClickCarousel?: () => void;
// }
// interface Slides{
//   id: number,
//   image: string,
//   alt: string,
// }
// const Carousel : FC<Slider> = ({
//   Id,
//   topImg,
//   secondImg,
//   thirdImg,
//   className,
//   indicatorsClass,
//   intrevalSeconds,
//   onClickInd,
//   onClickCarousel,
// }) => {
  
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const isAbsoluteUrl = (url?: string) => /^https?:\/\//.test(url!);
//   const slides = [
//     {
//       id: 1,
//       media_name: topImg || "https://via.placeholder.com/800x400?text=Slide+1",
//       media_type: "Top Image",
//     },
//     {
//       id: 1,
//       media_name: secondImg || "https://via.placeholder.com/800x400?text=Slide+2",
//       media_type: "Top Image",
//     },
//     {
//       id: 1,
//       media_name: thirdImg || "https://via.placeholder.com/800x400?text=Slide+3",
//       media_type: "Top Image",
//     },
  
//   ];

//   const handleIndicatorClick = (index: number) => {
//     setCurrentIndex(index);
//     if (onClickInd) {
//       onClickInd(index);
//     }
//   };
//   const runSlider = () => {
//     if (intervalRef.current) return;
//     intervalRef.current = setInterval(() => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex == slides.length - 1 ? 0 : prevIndex + 1
//       );
//     },2000);
//   };
//   const pauseSlider = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     setCurrentIndex(0);
//   };

//   useEffect(() => {
//   }, [intrevalSeconds, slides.length]);
//   return (
//     <div
//     className="relative w-full h-56" // Ensure container hides overflow
//     onMouseEnter={runSlider}
//     onMouseLeave={pauseSlider}
//   >
//     <div className="relative flex items-center justify-center h-full">
//     {slides.map((slide, index) => (
//         <div
//           key={index}
//           style={{
//             maxHeight: "100%", // Adjust to fit within parent container
//             minHeight: "100%",
//             minWidth: "100%",
//             maxWidth: "100%",
//           }}
//           className={`absolute w-full px-3 inset-0 transition-transform duration-100 ease-in-out flex items-center justify-center ${
//             index === currentIndex
//               ? "translate-x-0"
//               : index < currentIndex
//               ? "-translate-x-full"
//               : "translate-x-full"
//           }`}
//         >
//           <link href={``} onClick={onClickCarousel}>
//           <img
//     src={
//       isAbsoluteUrl(slide.media_name) // Assuming 'media_name' holds the image URL
//         ? `../../${slide.media_name}`
//         : `../../${slide.media_name}`
//     }
//     style={
//      slide.media_name === topImg
//         ? { width: "100%" }
//         : { width: "100%" , maxHeight: "200px", 
//           paddingLeft : '13px',
//           paddingRight : '14px',
//           minHeight: "30%",
//           minWidth: "100%",
//           maxWidth: "100%",}
//     }
//     alt={slide.media_type || 'Image'} // Assuming 'media_type' could be used as alt text
//     className={className || "items-center w-full object-cover mix-blend-multiply"}
//   />
//           </link>
//         </div>
//       ))}
// </div>


// <div className="absolute -bottom-10  z-30 left-1/2 transform -translate-x-1/2 flex space-x-2">
//       {slides.map((_, index) => (
//         <div
//           key={index}
//           onClick={() => handleIndicatorClick(index)}
//           className={`cursor-pointer w-1 h-1 rounded-full ${
//             index == currentIndex
//               ? "bg-black"
//               : "bg-gray-400"
//           }`}
//         ></div>
//       ))}
//     </div>
//     </div>
//   );
// };

// export default Carousel;
