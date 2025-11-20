'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DrawingCanvas from '@/components/DrawingCanvas'
import { supabase } from '@/lib/supabase'

export default function DrawPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [doodleBlob, setDoodleBlob] = useState<Blob | null>(null)

  const handleSave = (blob: Blob) => {
    setDoodleBlob(blob)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!doodleBlob || !title.trim()) {
      alert('Please provide a title for your doodle')
      return
    }

    setIsUploading(true)

    try {
      // Generate unique filename
      const fileName = `doodle-${Date.now()}-${Math.random().toString(36).substring(7)}.png`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('doodles')
        .upload(fileName, doodleBlob, {
          contentType: 'image/png',
          cacheControl: '3600',
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('doodles')
        .getPublicUrl(fileName)

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('doodles')
        .insert([
          {
            title: title.trim(),
            description: description.trim() || null,
            image_url: publicUrl,
          },
        ])

      if (dbError) {
        throw dbError
      }

      // Success! Redirect to gallery
      alert('Your doodle has been shared! 🎨')
      router.push('/gallery')
    } catch (error) {
      console.error('Error uploading doodle:', error)
      alert('Failed to upload doodle. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-green-600 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-red-600 to-transparent"></div>
      </div>
      
      <div className="absolute top-20 right-10 w-32 h-32 bg-green-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-4 tracking-tight">
            <span className="inline-block bg-gradient-to-r from-green-400 via-white to-red-400 bg-clip-text text-transparent animate-gradient">
              Create Your Doodle
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">🕊️</span>
            <p className="text-lg text-gray-300">
              Express your solidarity through art
            </p>
            <span className="text-2xl">🕊️</span>
          </div>
        </div>

        {/* Drawing Canvas */}
        {!showForm ? (
          <DrawingCanvas onSave={handleSave} isUploading={isUploading} />
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-white to-red-600 rounded-2xl opacity-50 blur"></div>
              <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                  <span>✨</span>
                  Share Your Voice
                </h2>
                
                {/* Preview */}
                <div className="mb-8 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-red-600 rounded-xl opacity-50 group-hover:opacity-75 blur transition"></div>
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(doodleBlob)} 
                      alt="Your doodle"
                      className="w-full rounded-xl border-2 border-white/20"
                    />
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="title">
                      Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your doodle a meaningful title..."
                      className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-300" htmlFor="description">
                      Description <span className="text-gray-500">(optional)</span>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Share your message, inspiration, or story..."
                      className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      rows={4}
                      maxLength={500}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setDoodleBlob(null)
                      }}
                      className="px-6 py-4 bg-slate-700 hover:bg-slate-600 border border-white/10 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                      disabled={isUploading}
                    >
                      ← Back to Canvas
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading || !title.trim()}
                      className="group relative flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative px-6 py-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-white font-bold flex items-center justify-center gap-2">
                        {isUploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <span>🌍</span>
                            Share My Doodle
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

