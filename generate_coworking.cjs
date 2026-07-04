const fs = require('fs');
const path = require('path');

const cities = [
  'Ahmedabad', 'Bangalore', 'Chandigarh', 'Chennai', 'Chhattisgarh', 
  'Delhi', 'Gurgaon', 'Himachal Pradesh', 'Hyderabad', 'Jaipur', 
  'Jammu and Kashmir', 'Jharkhand', 'Jodhpur', 'Kochi', 'Kolkata', 
  'Madhya Pradesh', 'Mumbai', 'Mysuru', 'Noida', 'Patna', 'Pune', 
  'Punjab', 'Uttarakhand'
];

const dir = 'src/components/sections';

cities.forEach(city => {
  const componentName = `${city.replace(/ /g, '')}CoworkingSeoContent`;
  const filePath = path.join(dir, `${componentName}.tsx`);
  
  const content = `import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ${componentName} = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="w-full bg-white rounded-2xl p-6 md:p-8 mt-12 border border-border/60 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8F0EB] rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E8F0EB] rounded-full blur-3xl -ml-32 -mb-32 opacity-50 pointer-events-none" />
      
      <div className="relative z-10 text-muted-foreground text-[13px] leading-relaxed">
        <h2 className="text-[12px] font-bold text-foreground mb-4">
          Coworking Space in ${city}
        </h2>
        
        <div className={\`relative transition-all duration-500 ease-in-out \${showMore ? 'max-h-[5000px] opacity-100' : 'max-h-[120px] overflow-hidden opacity-90'}\`}>
          <p className="mb-4">
            Placeholder SEO content for Coworking Spaces in ${city}. Content will be provided later.
          </p>
          
          <h3 className="text-[12px] font-bold text-foreground mt-6 mb-3">
            Why choose a Coworking Space in ${city}?
          </h3>
          <p className="mb-4">
            Placeholder text...
          </p>
          
          {!showMore && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        <button
          onClick={() => setShowMore(!showMore)}
          className="mt-6 flex items-center gap-2 text-[#36503F] font-semibold text-[13px] hover:opacity-80 transition-opacity mx-auto"
        >
          {showMore ? (
            <>
              View Less
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              View More
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ${componentName};
`;

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Coworking SEO files generated successfully.');
