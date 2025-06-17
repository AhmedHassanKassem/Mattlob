import RotatingTextEffect from "../../containers/StartEffect"

const Start = () => {
  return (
<div>
  <div className="grid grid-cols-12 overflow-hidden">
    {/* LEFT COLUMN — Marketing Text */}
    <div className="col-span-6 flex flex-col justify-center px-10 space-y-4 pr-5 animate__animated animate__fadeInLeft">
      <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
        Build Your <span className="text-sky-600">Future</span> with Mattlob
      </h1>
      <p className="text-lg text-gray-600">
        Craft stunning resumes that get noticed. Whether you're a designer, engineer, or fresh graduate — Mattlob gives you the edge you need to stand out.
      </p>
      <ul className="list-disc pl-5 text-gray-500 text-base space-y-1">
        <li>Professionally designed templates</li>
        <li>Quick & easy customization</li>
        <li>Instant PDF download</li>
      </ul>
    
    </div>

    {/* RIGHT COLUMN — Rotating Effect */}
    <div className="col-span-6 animate__animated animate__fadeInRight">
      <div>
        <RotatingTextEffect /> 
     
      </div>
      
    </div>
  </div>
</div>

  )
}

export default Start
