import React from 'react';
import { GripHorizontal, GripVertical } from 'lucide-react';

const ResizableHandle = ({ direction = 'horizontal' }) => {
  const isHorizontal = direction === 'horizontal';

  return (
    <div 
      className={`
        
        flex items-center justify-center
        ${isHorizontal 
          ? 'w-full h-full cursor-row-resize' 
          : 'h-full w-full cursor-col-resize'
        }
        text-gray-400 hover:text-gray-200 transition-colors
        bg-gray-700/50 hover:bg-gray-600/50
      `}
    >
      <div className="p-1">
        {isHorizontal ? (
          <GripHorizontal size={14} />
        ) : (
          <GripVertical size={14} />
        )}
      </div>
    </div>
  );
};

export default ResizableHandle;
