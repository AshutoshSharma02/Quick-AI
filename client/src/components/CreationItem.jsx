import React, { useState } from 'react'
import Markdown from 'react-markdown'

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div 
      onClick={() => setExpanded(!expanded)} 
      className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow'
    >
      <div className='flex justify-between items-center gap-4'>
        <div className='flex-1'>
          <h2 className='font-medium text-gray-900 mb-1'>{item.prompt}</h2>
          <p className='text-gray-500 text-xs'>
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full text-xs font-medium whitespace-nowrap'>
          {item.type}
        </button>
      </div>
      
      {expanded && (
        <div className='mt-4'>
          {item.type === 'image' ? (
            <div>
              <img 
                src={item.content} 
                alt="Generated image" 
                className='mt-3 w-full max-w-md rounded-lg'
              />
            </div>
          ) : (
            <div className='mt-3 max-h-40 overflow-y-auto text-sm text-slate-700 bg-gray-50 p-3 rounded-lg'>
              <div className='reset-tw'>
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreationItem