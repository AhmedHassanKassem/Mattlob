

import React from "react"

interface getSpinner{
    Role? : string
    ariaHidden? : boolean
    className?:string
    spinnerClass? : string
    animation?: "bounce" | "spin" | "pulse" | "ping";
    speed?: 'slow' | 'normal';
}

const Spinner: React.FC<getSpinner> = ({
    Role,
    ariaHidden,
    className,
    spinnerClass,
})=>{

    return (
        <div role={Role||"status"}>
            <div aria-hidden={ariaHidden || "true"} className={`inline w-4 h-8 text-gray-200 animate-spin dark:text-gray-600 ${className}`}>
            <div className="flex items-center justify-center min-h-screen ">

            <img src="../../../../../logo.png" className={spinnerClass||"animate-bounce w-20"} alt="logoSpinner" />
            </div>
            </div>        
        <span className="sr-only">Loading...</span>
    </div>
    )
}

export default Spinner;