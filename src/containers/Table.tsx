import React from "react";

interface tableProps {
  id?: string | number;

}
const Table: React.FC<tableProps> = () => {
 

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead >
            <tr>
              <th className=" p-3  text-left"></th>

            </tr>
          </thead>
          <tbody className="border border-stone-300">
            <tr>
              <td className="border-b p-3 text-sm px-4 w-56 border-t border-stone-300 bg-stone-100">Customer Reviews</td>
             
            </tr>
            <tr>
              <td className="border-b p-3 text-sm px-4 border-t border-stone-300 bg-stone-100">
        Price
             </td>
        
            </tr>
            <tr>
            
            </tr>
             
            <tr>
              <td className="border-b p-3 text-sm px-4 border-t border-stone-300 bg-stone-100">
           
                </td>
                </tr>
                
             
            
            <tr>
              <td className="border-b p-3 text-sm px-4 border-t border-stone-300 bg-stone-100">
              
              </td>
            
            </tr>
            <tr>
              <td className="border-b p-3 text-sm px-4 border-t border-stone-300 bg-stone-100">
             
              </td>
           
            </tr>
            <tr>
              <td className="border-b p-3 text-sm px-4 border-t border-stone-300 bg-stone-100">
           
              </td>
          
            </tr>
            <tr>
              <td className="border-b p-3 text-sm px-4 border-t border-stone-300 bg-stone-100">
             
              </td>
             
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
