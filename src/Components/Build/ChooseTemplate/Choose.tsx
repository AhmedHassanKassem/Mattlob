import { useEffect, useState } from 'react';

import Templates from './Templates';
import SelectBar from '../../../containers/SelectBar';

// Choose component:
const Choose = () => {
const [selectedTempId , setSelectedTemplate] = useState(0)

useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || "[]")
    if (myTempId) {
      setSelectedTemplate(myTempId)
    }

  }, [])

type FilterKey = 'photo' | 'columns';

const [filters, setFilters] = useState<{ photo: string | null; columns: number | null }>({
  photo: null,
  columns: null,
});

const toggleFilter = (type: FilterKey, value: string | number) => {
  setFilters(prev => ({
    ...prev,
    [type]: prev[type] === value ? null : value
  }));
};


  return (
    <div className="w-full mx-auto py-10 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Best templates for jobseekers with little experience</h1>
        <p className="text-gray-600">You can always change your template later.</p>
      </div>

      <div className="flex gap-10">
        {/* Filter Panel */}
        <div className="text-sm min-w-[150px]">
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Headshot</h2>
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.photo === 'with'}
                onChange={() => toggleFilter('photo', 'with')}
              />
              With photo
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.photo === 'without'}
                onChange={() => toggleFilter('photo', 'without')}
              />
              Without photo
            </label>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Columns</h2>
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.columns === 1}
                onChange={() => toggleFilter('columns', 1)}
              />
              1 column
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.columns === 2}
                onChange={() => toggleFilter('columns', 2)}
              />
              2 columns
            </label>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="w-full grid grid-cols-10 sm:grid-cols-2 lg:grid-cols-3 gap-6">
       
           <Templates/>
        
       
                
                   <SelectBar selected={selectedTempId !== 0} />
            
          
        </div>
      </div>
    </div>
  );
};

export default Choose;