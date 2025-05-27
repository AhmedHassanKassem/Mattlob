// ;
// import React, { ChangeEvent, FC, useEffect, useState } from "react";
// import Dashboard from "../dashboard/page";
// import Input from "./Input";
// import Button from "./Button";
// import { AppDispatch, RootState } from "../ProjectRedux/store";
// import { useDispatch, useSelector } from "react-redux";
// import getTeachers from "../ProjectRedux/Teachers/getTeachersAction";
// import { ITeacher } from "../ProjectRedux/Teachers/Interface";

// const Tab = () => {
//     const dispatch : AppDispatch = useDispatch()
//   const teachers = useSelector((state: RootState) => state.teachers.teachers);

//   const [activeTab, setActiveTab] = useState("teachers");
//   const handleClick = (tab: string) => {
//     setActiveTab(tab);
//   };
//   const [profilePhoto, setProfilePhoto] = useState<string>('https://via.placeholder.com/100');
// const [showProfileLabel, setShowProfileLabel] = useState<boolean>(true);
// const handleProfilePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target?.result) {
//           setProfilePhoto(e.target.result as string);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   useEffect(()=>{
//    dispatch(getTeachers())
//   },[dispatch])
//   useEffect(()=>{
//    console.log(teachers);
   
//   },[teachers])
//   return (
//     <div>
//       <div className="border bg-white rounded-b-lg flex justify-center">
//         <ul className="flex flex-wrap -mb-px text-sm font-medium text-center mt-2 mx-2 text-gray-500 dark:text-gray-400">
//           <li
//             className={` p-4  rounded-t-lg ${
//               activeTab === "teachers"
//                 ? "text-slate-600 font-bold bg-slate-700



// "
//                 : "text-slate-500  hover:text-slate-600"
//             }`}
//             onClick={() => handleClick("teachers")}
//           >
//             <a
//               href="#"
//               className={`inline-flex items-center justify-center ${
//                 activeTab === "teachers" ? "text-white" : ""
//               }  border-transparent rounded-t-lg`}
//             >
//               <i
//                 className={`far fa-user pr-2 ${
//                   activeTab === "teachers" ? "text-white" : "text-slate-400"
//                 } `}
//               ></i>
//               Teachers
//             </a>
//           </li>
//           <button
//             className={` p-4  rounded-t-lg ${
//               activeTab === "reservation"
//                 ? "text-slate-600 font-bold bg-slate-700



// "
//                 : "text-slate-500"
//             }`}
//             onClick={() => handleClick("reservation")}
//           >
//             <a
//               href="#"
//               className={`inline-flex items-center justify-center ${
//                 activeTab === "reservation" ? "text-white" : ""
//               }  border-transparent rounded-t-lg`}
//               aria-current="page"
//             >
//               <i
//                 className={`fa-solid fa-table-cells-large pr-2  ${
//                   activeTab === "reservation" ? "text-white" : "text-slate-400"
//                 }`}
//               ></i>
//               Reservation
//             </a>
//           </button>
//           <li
//             className={` p-4  rounded-t-lg ${
//               activeTab === "settings"
//                 ? "text-slate-600 font-bold bg-slate-700



// "
//                 : "text-slate-500"
//             }`}
//             onClick={() => handleClick("settings")}
//           >
//             <a
//               href="#"
//               className={`inline-flex items-center justify-center ${
//                 activeTab === "settings" ? "text-white" : ""
//               } border-b-2 border-transparent rounded-t-lg`}
//               aria-current="page"
//             >
//               <i
//                 className={`fa-solid fa-sliders pr-2  ${
//                   activeTab === "settings" ? "text-white" : "text-slate-400"
//                 }`}
//               ></i>
//               Settings
//             </a>
//           </li>
//         </ul>
//       </div>

//       <div id="default-styled-tab-content">
//         <div
//           className={`p-4 rounded-lg  ${
//             activeTab === "teachers" ? "block" : "hidden"
//           }`}
//         >
//           <div className="gap-2">
//             <div className="border bg-white rounded-lg shadow-lg w-full p-4">
//             <p className="text-slate-700 p-2 text-base">Add teacher</p>

//               <div className="grid grid-cols-12">
               
               
//                 <div className="col-span-4 w-full">               
//                   <Input
//                     placeholderType="Name"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                   <Input
//                     placeholderType="Password"
//                     type="password"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                 </div>
//                 <div className="col-span-4 w-full pl-2">
//                   <Input
//                     placeholderType="Mobile"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                   <Input
//                     placeholderType="Confirm password"
//                     type="password"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                 </div>
//                 <div className="col-span-4 w-full pl-2">
//                   <Input
//                     placeholderType="E-mail"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                   <div
//                     className="flex items-center justify-evenly"
//                   >
//                     <img
//                       id="profile-photo"
//                       className="h-20 w-20 rounded-full border border-slate-400"
//                       src={profilePhoto}
//                       alt="Profile"
//                     />
//                     <input
//                       type="file"
//                       id="profile-photo-input"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleProfilePhotoChange}
//                     />
//                     {showProfileLabel && (
//                       <label
//                         htmlFor="profile-photo-input"
//                         className="bg-gray-800 bg-opacity-75 h-full  text-white text-xs py-1 px-2 rounded cursor-pointer"
//                       >
//                        Add profile photo
//                       </label>
//                     )}
//                   </div>
//                 </div>
//               </div>
//              <div className="flex justify-end p-4">
//              <Button
//               className="bg-slate-700

//  p-2 rounded-lg shadow-lg"
//               title="Add teacher"
//               titleClassname="text-sm font-bold text-white "
//               />
//              </div>
//             </div>
//             <div className="border bg-white rounded-lg shadow-lg w-full mt-3">


//             <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
//     <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//         <thead className="text-xs text-gray-700 uppercase text-center">
//             <tr>
               
       
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                    #
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                    Teacher name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                     Email
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                     Mobile
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                     Description
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                     Options
//                 </th>
//             </tr>
//         </thead>
//         <tbody>
//         {teachers.map((teacher : ITeacher , index : number)=>{
//              return <tr key={index} className="bg-white border-b text-center dark:border-slate-200 p-3 ">
//               <th scope="row" className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap dark:text-black">
//                  {index + 1}
//               </th>
//               <th scope="row" className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap dark:text-black">
//                   {teacher.first_name + " " + teacher.last_name}
//               </th>
           
//               <td className="px-6 py-4">
//                   a@gmail.com
//               </td>
//               <td className="px-6 py-4">
//                   03123123123
//               </td>
//               <td className="px-6 py-4">
//                   Lorem ipsum dolor sit,
//               </td>
//               <td className="px-6 py-4">
//                   <Button
//                   iconClass={'fas fa-pencil text-green-500 '}
//                   className="pr-5 cursor-pointer"
//                   />               
//                   <Button
//                   iconClass={'fas fa-file-circle-plus text-blue-500 '}
//                   className="pr-5 cursor-pointer"
//                   />
//                   <Button
//                   iconClass={'fas fa-trash-can text-red-500'}
//                   />
//               </td>
//           </tr>
//         })}
                    
//         </tbody>
//     </table>
//     <nav className="flex items-center flex-column flex-wrap md:flex-row justify-end pt-4 p-5" aria-label="Table navigation">
//         <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
//         <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
//             </li>
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
//             </li>
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
//             </li>
//             <li>
//                 <a href="#"  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">3</a>
//             </li>
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
//             </li>
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
//             </li>
//             <li>
//         <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
//             </li>
//         </ul>
//     </nav>
// </div>

//             </div>
//           </div>
//         </div>

//         <div
//           className={`p-4 rounded-lg  ${
//             activeTab === "reservation" ? "block" : "hidden"
//           }`}
//         >
//           <div className="gap-2">
//           <div
//           className={`p-4 rounded-lg  ${
//             activeTab === "reservation" ? "block" : "hidden"
//           }`}
//         >
//           <div className="gap-2">
//             <div className="border bg-white rounded-lg shadow-lg w-full p-4">
//             <p className="text-slate-700 p-2 text-base">Add teacher</p>

//               <div className="grid grid-cols-12">
               
               
//                 <div className="col-span-4 w-full">               
//                   <Input
//                     placeholderType="Name"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                   <Input
//                     placeholderType="Password"
//                     type="password"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                 </div>
//                 <div className="col-span-4 w-full pl-2">
//                   <Input
//                     placeholderType="Mobile"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                   <Input
//                     placeholderType="Confirm password"
//                     type="password"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                 </div>
//                 <div className="col-span-4 w-full pl-2">
//                   <Input
//                     placeholderType="E-mail"
//                     className="mb-4 focus:outline-none border p-3 w-full"
//                   />
//                   <div
//                     className="flex items-center justify-evenly"
//                   >
//                     <img
//                       id="profile-photo"
//                       className="h-20 w-20 rounded-full border border-slate-400"
//                       src={profilePhoto}
//                       alt="Profile"
//                     />
//                     <input
//                       type="file"
//                       id="profile-photo-input"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleProfilePhotoChange}
//                     />
//                     {showProfileLabel && (
//                       <label
//                         htmlFor="profile-photo-input"
//                         className="bg-gray-800 bg-opacity-75 h-full  text-white text-xs py-1 px-2 rounded cursor-pointer"
//                       >
//                        Add profile photo
//                       </label>
//                     )}
//                   </div>
//                 </div>
//               </div>
//              <div className="flex justify-end p-4">
//              <Button
//               className="bg-slate-700

//  p-2 rounded-lg shadow-lg"
//               title="Add teacher"
//               titleClassname="text-sm font-bold text-white "
//               />
//              </div>
//             </div>
//             <div className="border bg-white rounded-lg shadow-lg w-full mt-3">


//             <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-5">
//     <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//         <thead className="text-xs text-gray-700 uppercase text-center">
//             <tr>
               
       
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                    #
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                    Teacher name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                     Email
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                     Mobile
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                     Description
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-slate-600">
//                     Options
//                 </th>
//             </tr>
//         </thead>
//         <tbody>
//         {teachers.map((teacher : ITeacher , index : number)=>{
//              return <tr key={index} className="bg-white border-b text-center dark:border-slate-200 p-3 ">
//               <th scope="row" className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap dark:text-black">
//                  {index + 1}
//               </th>
//               <th scope="row" className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap dark:text-black">
//                   {teacher.first_name + " " + teacher.last_name}
//               </th>
           
//               <td className="px-6 py-4">
//                   a@gmail.com
//               </td>
//               <td className="px-6 py-4">
//                   03123123123
//               </td>
//               <td className="px-6 py-4">
//                   Lorem ipsum dolor sit,
//               </td>
//               <td className="px-6 py-4">
//                   <Button
//                   iconClass={'fas fa-pencil text-green-500 '}
//                   className="pr-5 cursor-pointer"
//                   />               
//                   <Button
//                   iconClass={'fas fa-file-circle-plus text-blue-500 '}
//                   className="pr-5 cursor-pointer"
//                   />
//                   <Button
//                   iconClass={'fas fa-trash-can text-red-500'}
//                   />
//               </td>
//           </tr>
//         })}
                    
//         </tbody>
//     </table>
//     <nav className="flex items-center flex-column flex-wrap md:flex-row justify-end pt-4 p-5" aria-label="Table navigation">
//         <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
//         <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
//             </li>
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
//             </li>
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
//             </li>
//             <li>
//                 <a href="#"  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">3</a>
//             </li>
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
//             </li>
//             <li>
//                 <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
//             </li>
//             <li>
//         <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700  dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
//             </li>
//         </ul>
//     </nav>
// </div>

//             </div>
//           </div>
//         </div>
//           </div>
//         </div>
//         <div
//           className={`p-4 rounded-lg  ${
//             activeTab === "settings" ? "block" : "hidden"
//           }`}
//         >
//           <div className="flex gap-2">Settings</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Tab;
