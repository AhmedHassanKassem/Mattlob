import React, { useState, useRef, useEffect } from "react"

interface OTPInputProps {
  onChange: (code: string) => void
}

const OTPInput: React.FC<OTPInputProps> = ({ onChange }) => {
  const [otp, setOtp] = useState(Array(6).fill(""))
  const inputRefs = useRef<HTMLInputElement[]>([])

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    onChange(updatedOtp.join(""))

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const updatedOtp = [...otp]
      updatedOtp[index - 1] = ""
      setOtp(updatedOtp)
      onChange(updatedOtp.join(""))
      inputRefs.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
   <div className="flex justify-center">
     <div className="flex gap-4 justify-between">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el!
          }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center  rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
        />
      ))}
    </div>
   </div>
  )
}

export default OTPInput
