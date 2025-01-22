'use client'

import React from "react";

const Footer = ()=>{

    return <>
    

    <footer className="bg-white dark:bg-slate-700



 mt-2 h-full lg:block md:block sm:hidden text-center hidden sm:block">

    <div className="container mx-auto w-full">
        <div className="lg:grid-cols-12">
 <div className="flex justify-center mt-10">
          <div className="mt-10 flex">
          <a href=""><p className="text-white mx-5 text-sm">Privacy Policy</p></a>
            <a href=""><p className="text-white mx-5 text-sm">Terms & conditions</p></a>
            <a href=""><p className="text-white mx-5 text-sm">Main</p></a>
          </div>
        </div>
 <div className="flex justify-center mt-10">
 <div className="mt-10 flex mb-20">
            <i className="fab fa-x-twitter text-white  text-3xl mx-5"></i>
            <i className="fab fa-facebook text-white  text-3xl mx-5"> </i>
            <i className="fab fa-linkedin text-white  text-3xl mx-5"></i>
            <i className="fab fa-instagram text-white  text-3xl mx-5"></i>
            </div>
        </div>
        </div>
       
     </div>
</footer>

    </>
  
}
export default Footer;