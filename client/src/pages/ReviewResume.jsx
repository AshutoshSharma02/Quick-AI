import { FileText, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'

const ReviewResume = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('ReviewResume: onSubmit')
    setLoading(true)
    try {
      if (!file) {
        toast.error('Please select a resume file')
        return
      }

      const formData = new FormData()
      formData.append('resume', file)

      let token
      try {
        token = await getToken()
      } catch (err) {
        toast.error('Authentication required')
        return
      }

      const { data } = await axios.post(
        '/api/ai/resume-review',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data?.success) setContent(data.content)
      else toast.error(data?.message || 'Failed to review resume')
    } catch (error) {
      console.error('ReviewResume error', error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-full p-6 flex flex-wrap gap-4'>

      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white border rounded'>
        <div className='flex items-center gap-2'>
          <Sparkles className='text-green-600' />
          <h1 className='text-xl font-semibold'>Resume Review</h1>
        </div>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className='mt-4'
          required
        />

        <button type='submit' disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
          {loading ? 'Analyzing...' : 'Review Resume'}
        </button>
      </form>

      <div className='w-full max-w-lg p-4 bg-white border rounded min-h-96'>
        <h1 className='font-semibold mb-2'>Result</h1>
        {content ? <Markdown>{content}</Markdown> : <p>No output yet</p>}
      </div>

    </div>
  )
}

export default ReviewResume