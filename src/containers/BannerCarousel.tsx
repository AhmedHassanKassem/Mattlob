// import React, { useState, useEffect, useRef, type FC } from "react";
// import Button from "./Button";

// interface Image {
//   id: number;
//   image: string;
//   alt: string;
//   teacherId?: number | string;
//   onClick?: ()=>void;

// }

// interface BannerCarouselProps {
//   classname?: string;

//   hide?: boolean;
//   buttonsHide?: boolean;
//   images: Image[];
// }

// const BannerCarousel: FC<BannerCarouselProps> = ({
//   classname,
//   hide = false,
//   buttonsHide = false,
//   images: initialImages,
// }) => {
//   const [images, setImages] = useState<Image[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const intervalRef = useRef<null>(null);

//   useEffect(() => {
//     // Combine dynamic and static images
//     setImages([
//       ...initialImages,
//       { id: 2, image: "../el.webp", alt: "Static Course 4" },
//       { id: 3, image: "../teacherSample.jpg", alt: "Static Course 5" },
//     ]);
//   }, [initialImages]);

//   const goToPrevious = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const handleIndicatorClick = (index: number) => {
//     setCurrentIndex(index);
//   };

//   const runSlider = (hover: boolean = false) => {
//     if (intervalRef.current) return; // Prevent duplicate intervals
//     intervalRef!.current = setInterval(() => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === images.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 3000);
//     setIsHovered(hover);
//   };

//   const pauseSlider = (hover: boolean = true) => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     setIsHovered(hover);
//   };

//   useEffect(() => {
//     if (images.length) runSlider(false); // Start slider when images are ready

//     return () => pauseSlider(false); // Cleanup on unmount
//   }, [images.length]);
//   return (
//     <div className="relative w-full">
//       {/* Carousel wrapper */}
//       <div
//         className={classname || "relative  w-full overflow-hidden md:h-72"}
//         onMouseEnter={() => pauseSlider(true)}
//         onMouseLeave={() => runSlider(false)}
//       >
//         {images.map((image, index) => (
//           <Link href={`/teachers/${image.teacherId}`} onClick={image.onClick}>
//           <div
//             key={index}
//             className={`absolute inset-0 duration-700 flex justify-center ease-in-out transform ${
//               index === currentIndex
//                 ? "translate-x-0 opacity-100"
//                 : "translate-x-full opacity-0"
//             }`}
//           >
//             {/* Dynamic Image */}
         
//          <img
//               src={image.image}
//               alt={image.alt}
//             />
        
//           </div> </Link>
//         ))}

       
//       </div>

//       {/* Slider indicators */}
//       <div
//         className="absolute z-10 flex -translate-x-1/2 sm:bottom-4 md:bottom-12 lg:-bottom-8 bottom-5 left-1/2 space-x-3"
//         onMouseEnter={() => pauseSlider(true)}
//         onMouseLeave={() => runSlider(false)}
//       >
//         {images.map((_, index) => (
//           <button
//             key={index}
//             className={`w-6 h-1 ${
//               currentIndex === index ? "bg-black" : "bg-gray-400"
//             }`}
//             aria-label={`Slide ${index + 1}`}
//             onClick={() => setCurrentIndex(index)}
//             hidden={hide}
//           />
//         ))}

       
//       </div>

//       {/* Navigation Buttons */}
//       <div
//         className="absolute top-1/2 w-full flex justify-between items-center px-4 z-10"
//         onMouseEnter={() => pauseSlider(true)}
//         onMouseLeave={() => runSlider(false)}
//         hidden={hide}
//       >
//         {/* Previous Button */}
//         {/* <Button
//           btnType="button"
//           onClick={goToPrevious}
//           iconClass="fas fa-left-long text-white lg:text-gray-white text-2xl pr-2"
//           className="z-10 relative flex items-center w-10 h-10 lg:bottom-0 bottom-8 sm:bottom-8 rounded-full lg:shadow-lg 
//           lg:bg-gray-500 lg:bg-transparent border md:bg-transparent md:border 
//           justify-center cursor-pointer group focus:outline-none"
//         />

//         <Button
//           btnType="button"
//           onClick={goToNext}
//           iconClass="fas fa-right-long text-white lg:text-gray-white text-2xl pr-2"
//           className="z-10 relative flex items-center w-10 h-10 lg:bottom-0 bottom-8 sm:bottom-8 rounded-full 
//           lg:shadow-lg lg:bg-gray-500 lg:bg-transparent lg:border 
//           md:bg-transparent border justify-center cursor-pointer group focus:outline-none"
//         /> */}
//       </div>
//     </div>
//   );
// };

// export default BannerCarousel;
