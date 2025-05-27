// import React, { FC, MouseEvent, ReactNode, useRef, useState } from 'react';


// interface Drop{
//     href1?:string
//     href2?:string
//     btnClassName?:string
//      dropDownHead? : ReactNode
//      link1? : ReactNode
//      link2? : ReactNode
//      link3? : ReactNode
//      link4? : ReactNode
//      button? : ReactNode
//     onClick? : (event : MouseEvent<HTMLAnchorElement>)=>void
//     onClickA? : (event : MouseEvent<HTMLAnchorElement>)=>void
//     onClickB? : ()=>void
//     onClickC? : (event : any)=>void
//     dropDownName? : string
// }
// const DropdownMenu: FC<Drop> = ({onClick ,onClickA ,onClickB ,onClickC , dropDownName , 
//     dropDownHead,
//     link1 ,
//     link2 ,
//     link3 ,
//     link4 ,
//     button ,
//     href1,
//     href2,
//     btnClassName
// }) => {
//     const [isOpen, setIsOpen] = useState<boolean>(false);
//     const [page , setPage] = useState<ReactNode>()
//     const timeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const toggleDropdown = () => {
//         setIsOpen(prevState => !prevState);
//     };
    
//     const handleMouseLeave = () => {
//         timeoutRef.current = setTimeout(() => {
//             setIsOpen(false);
//         }, 100);
//     };
    
//     const handleMouseEnter = () => {
//         if (timeoutRef.current !== null) {
//             clearTimeout(timeoutRef.current);
//         }
//         toggleDropdown();
//     };
  
//     const handleDropdownMouseEnter = () => {
//         if (timeoutRef.current !== null) {
//             clearTimeout(timeoutRef.current);
//         }
//     };
//     function handlePage(page : ReactNode){
//             setPage(page)
//             setIsOpen(false)
//     }

//     return (
//         <div className="relative">
//             {/* <div> {dropDownHead ? (
//           <>{dropDownHead}</>
//         ) : (
//           <p className="lg:text-white lg:block hidden lg:font-bold font-normal">
//             Hi, {dropDownName || "dropname"}!
//           </p>
//         )}</div>
//             <button
//                 id="dropdownNavbarlink"
//                 data-dropdown-toggle="dropdownNavbar"
//                 className="flex items-center justify-between w-full  p-3 py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//                 aria-controls="dropdownNavbar"
//                 aria-expanded={isOpen ? "true" : "false"}
//             >
//                 {button || <p className='lg:text-white sm:text-gray-900  text-xs'>Account</p>}
//                 <i
//     className={btnClassName || `fa fa-chevron-up text-xs mx-1 lg:text-white sm:text-gray-900 font-thin transition-transform duration-300 ${
//         isOpen ? 'rotate-180' : 'rotate-0'
//     }`}
// ></i>
//             </button> */}
//             <div
//              onMouseEnter={handleDropdownMouseEnter}
//             onMouseLeave={handleMouseLeave}
//                 id="dropdownNavbar"
//                 className={`z-20 absolute top-full left-0 ${isOpen ? 'block' : 'hidden'} mt-2 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-white  dark:divide-gray-300`}
//             >
//                 <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
//                    {/* <li>
//                        <link
//                             href={href1 || ""}
//                             // onClick={()=>onClick || handlePage(<Orders/>)}
//                             onClick={onClick}
//                             className="block px-4 py-2 font-semibold text-xs hover:bg-gray-100 dark:hover:bg-gray-300 dark:hover:text-black"
//                         >
//                         {link1 ? link1 : (<span>My Orders<span className='fa fa-bag-shopping p-1 text-blue-400 float-right font-thin'></span></span>)}

//                         </link> 
//                     </li> 
//                     <li>
//                          <link
//                             href={href2 || "/profile"}
//                             // onClick={()=>onClickA||handlePage(<Profile/>)}
//                             onClick={onClickA}
//                             className="block px-4 py-2 font-semibold text-xs  hover:bg-gray-100 dark:hover:bg-gray-300 dark:hover:text-black"
//                         >
//                            {link2 ? link2 :(<span>Profile<span className='fa fa-user p-1 text-blue-400 float-right'></span></span>) }
//                         </link>
                        
//                     </li> */}
//                     <li>
//                       {link3 || <link
//                             href="/profile"
                            
//                             className="block px-4 py-2 font-semibold text-xs  hover:bg-gray-100 dark:hover:bg-gray-300 dark:hover:text-black"
//                         >
//                             Settings<span className='fa fa-gear p-1 text-blue-400 float-right'></span>
//                         </link>  }
//                     </li>
//                 </ul>
//                 <div >
//                   {link4 || <link
//                         href={''}
//                         onClick={onClickC}
//                         className="font-semibold text-xs  block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-300 dark:text-black dark:hover:text-black"
//                     >
//                         Sign out<span className='fa fa-right-from-bracket p-1 text-blue-400 float-right'></span>
//                     </link>  }
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DropdownMenu;
