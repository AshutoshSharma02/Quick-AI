import React, { useState } from 'react'
import axios from 'axios'
import { Image, Sparkles } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

// Configure axios base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

// Constants
const IMAGE_STYLES = [
  'Realistic',
  'Ghibli style',
  'Anime style',
  'Cartoon style',
  'Fantasy Style',
  'Realistic style',
  '3D style',
  'Portrait style'
]

const GenerateImages = () => {
  // State management
  const [selectedStyle, setSelectedStyle] = useState('Realistic')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  // Hooks
  const { getToken } = useAuth()

  // Event handlers
  const handleStyleSelect = (style) => {
    setSelectedStyle(style)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handlePublishChange = (e) => {
    setPublish(e.target.checked)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`
      
      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt, publish },
        {
          headers: { Authorization: `Bearer ${await getToken()}` }
        }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Render functions
  const renderStyleOptions = () => {
    return IMAGE_STYLES.map((style) => (
      <span
        key={style}
        onClick={() => handleStyleSelect(style)}
        className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors ${
          selectedStyle === style
            ? 'bg-green-50 text-green-700 border-green-300'
            : 'text-gray-500 border-gray-300 hover:border-gray-400'
        }`}
      >
        {style}
      </span>
    ))
  }

  const renderPublishToggle = () => {
    return (
      <div className='my-6 flex items-center gap-2'>
        <label className='relative cursor-pointer'>
          <input
            type="checkbox"
            onChange={handlePublishChange}
            checked={publish}
            className='sr-only peer'
          />
          <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors'></div>
          <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></span>
        </label>
        <p className='text-sm'>Make this image Public</p>
      </div>
    )
  }

  const renderGenerateButton = () => {
    return (
      <button
        disabled={loading}
        className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
      >
        {loading ? (
          <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
        ) : (
          <Image className='w-5' />
        )}
        Generate Image
      </button>
    )
  }

  const renderGeneratedImage = () => {
    if (!content) {
      return (
        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
            <Image className='w-9 h-9' />
            <p>Enter a topic and click "Generate image" to get started</p>
          </div>
        </div>
      )
    }

    return (
      <div className='mt-3 h-full'>
        <img
          src={content}
          alt='Generated image'
          className='w-full h-full object-contain rounded-lg'
        />
      </div>
    )
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left Column - Input Form */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea
          onChange={handleInputChange}
          value={input}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-green-500 transition-colors'
          placeholder='Describe what you want to see in the image'
          required
        />

        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {renderStyleOptions()}
        </div>

        {renderPublishToggle()}
        {renderGenerateButton()}
      </form>

      {/* Right Column - Generated Image */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 shadow-sm'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>
        {renderGeneratedImage()}
      </div>
    </div>
  )
}

export default GenerateImages