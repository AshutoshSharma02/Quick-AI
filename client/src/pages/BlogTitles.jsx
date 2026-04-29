import { useAuth } from '@clerk/clerk-react'
import { Hash, Sparkles } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import axios from 'axios'

const BlogTitles = () => {
  const blogCategories = [
    'General','Technology','Business','Health',
    'Lifestyle','Education','Travel','Food'
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  useEffect(() => {
    console.log('BlogTitles mounted')
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('BlogTitles: onSubmit')
    setLoading(true)
    try {
      if (!input || !input.trim()) {
        toast.error('Please enter a keyword')
        return
      }

      const prompt = `Generate a blog title for ${input} in ${selectedCategory}`

      let token
      try {
        token = await getToken()
      } catch (err) {
        toast.error('Authentication required')
        return
      }

      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data?.success) setContent(data.content)
      else toast.error(data?.message || 'Failed to generate title')

    } catch (error) {
      console.error('BlogTitles error', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-6 flex flex-wrap gap-4 text-slate-700'>

      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border'>
        <div className='flex items-center gap-2'>
          <Sparkles className='text-purple-600' />
          <h1 className='text-xl font-semibold'>AI Title Generator</h1>
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter keyword'
          className='w-full mt-4 p-2 border rounded'
          required
        />

        <div className='flex flex-wrap gap-2 mt-3'>
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`px-3 py-1 rounded-full cursor-pointer text-xs border ${
                selectedCategory === item
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-500'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full mt-5 bg-purple-600 text-white py-2 rounded'
        >
          {loading ? 'Generating...' : 'Generate Title'}
        </button>
      </form>

      <div className='w-full max-w-lg p-4 bg-white border rounded min-h-96'>
        <h1 className='font-semibold mb-2'>Generated Titles</h1>
        {content ? <Markdown>{content}</Markdown> : <p>Output appears here</p>}
      </div>

    </div>
  )
}

export default BlogTitles