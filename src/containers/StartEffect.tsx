import { ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface Phrase {
  text: string;
  image: string;
}

const phrases: Phrase[] = [
    { text: 'Launch your career', image: 'eff2.webp' },
  { text: 'Stand out instantly', image: 'eff2.png' },
  { text: 'Get hired faster', image: 'eff3.png' },
  { text: 'Show your best self', image: 'eff4.png' },

];

const RotatingTextEffect: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(phrases.length - 1);
  const [nextIndex, setNextIndex] = useState(1);
  const navigate = useNavigate()
  useEffect(() => {
    const interval = setInterval(() => {
      const newCurrent = (currentIndex + 1) % phrases.length;
      const newPrev = currentIndex;
      const newNext = (newCurrent + 1) % phrases.length;

      setCurrentIndex(newCurrent);
      setPrevIndex(newPrev);
      setNextIndex(newNext);
    }, 2500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const getClasses = (index: number): string => {
    const base = "absolute w-full text-center  transition-all duration-700 ease-out flex gap-2 items-center justify-center ";

    if (index === currentIndex) return `${base}  text-6xl drop-shadow-xl text-black opacity-100 transform scale-100 z-10`;
    if (index === prevIndex) return `${base} text-xl text-gray-400 opacity-50 transform -translate-y-20 scale-90`;
    if (index === nextIndex) return `${base} text-xl text-gray-400 opacity-50 transform translate-y-20 scale-90`;

    return `${base} text-xl text-gray-400 opacity-0 transform scale-75`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="relative w-full max-w-4xl  flex flex-col items-center justify-center pt-50">
        <div className="relative w-full h-full mb-20">
          {phrases.map((phrase, index) => (
            <div key={index} className={getClasses(index)}>       
             <span   style={{
    fontFamily: '"Ubuntu Mono", monospace',
    fontWeight: 700,
  }}>{phrase.text}</span>

              <img src={phrase.image} alt="" className="w-12 h-12" />
            </div>
          ))}
        </div>
       <div>
        <Button
        onClick={()=>navigate('/login')}
        btnContentClassname='p-0'
        buttonContent={
          <>
            <div className="pt-50 px-6 flex items-center justify-center hover:text-sky-700 text-sky-600 text-lg font-bold  transition">
        <p className='text-2xl'>Getting started </p><ChevronRight/>
      </div>
          </>
        }
        />
        </div> 
      </div>  
    </div>
  );
};

export default RotatingTextEffect;
