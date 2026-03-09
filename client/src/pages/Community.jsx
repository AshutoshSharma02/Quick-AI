import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'

import { Heart } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const {getToken} = useAuth()

  const fetchCreations = async () => {
   try {
    const {data} = await axios.get('/api/user/get-published-creations',{
      headers:{Authorization:`Bearer ${await getToken()}`}

    })
    if(data.success){
      setCreations(data.creations)

    }else{
      toast.error(data.message)
    }
    
   } catch (error) {
    toast.error(error.message)
    
   }
   setLoading(false)
  }
   const imageLikeToggle = async(id)=>{
     try {
       const {data} = await axios.post('/api/user/toggle-like-creations',{id},{
         headers:{Authorization:`Bearer ${await getToken()}`}
       })
 
       if(data.success){
         toast.success(data.message)
         await fetchCreations()
       }else{
         toast.error(data.message)
       }
   
       
     } catch (error) {
       toast.error(error.message)
       
     }
   }
  
  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return  !loading ?(
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h2 className='text-xl font-semibold'>Creations</h2>
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creation, index) => (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            <div className='relative'>
              <img 
                src={creation.content} 
                alt="" 
                className='w-full h-full object-cover rounded-lg'
              />
              <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-200 rounded-lg'></div>
              <div className='absolute bottom-0 left-0 right-0 p-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-white hidden group-hover:block pl-2'>{creation.prompt}</p>
                  <div className='flex gap-1 items-center ml-auto'>
                    <span className='text-sm text-white'>{creation.likes?.length || 0}</span>
                    <Heart onClick={()=> imageLikeToggle(creation.id)}
                      className={`w-4 h-4 cursor-pointer ${
                        creation.likes?.includes(user?.id) ? 'fill-red-500 text-red-600' : 'text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ):(
    <div className='flex justify-center items-center h-full'><span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span></div>
  )
}

export default Community