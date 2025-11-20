'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, type Doodle } from '@/lib/supabase'

export default function GalleryPage() {
  const [doodles, setDoodles] = useState<Doodle[]>([])
  const [filteredDoodles, setFilteredDoodles] = useState<Doodle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')

  useEffect(() => {
    fetchDoodles()
  }, [])

  useEffect(() => {
    filterAndSortDoodles()
  }, [doodles, searchQuery, sortBy])

  const fetchDoodles = async () => {
    try {
      const { data, error} = await supabase
        .from('doodles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setDoodles(data || [])
    } catch (error) {
      console.error('Error fetching doodles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortDoodles = () => {
    let filtered = [...doodles]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(query) || 
        (d.description && d.description.toLowerCase().includes(query))
      )
    }

    // Sort
    if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredDoodles(filtered)
  }

  const handleLike = async (id: string) => {
    try {
      // Get current likes
      const doodle = doodles.find(d => d.id === id)
      if (!doodle) return

      const newLikes = (doodle.likes || 0) + 1

      // Update in database
      const { error } = await supabase
        .from('doodles')
        .update({ likes: newLikes })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setDoodles(doodles.map(d => 
        d.id === id ? { ...d, likes: newLikes } : d
      ))
    } catch (error) {
      console.error('Error liking doodle:', error)
    }
  }

  const shareToTwitter = (doodle: Doodle) => {
    const text = `Check out "${doodle.title}" on Olive - Art for Palestine 🇵🇸🫒`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank')
  }

  const shareToFacebook = (doodle: Doodle) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank')
  }

  const shareToWhatsApp = (doodle: Doodle) => {
    const text = `Check out "${doodle.title}" on Olive - Art for Palestine 🇵🇸🫒 ${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
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
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
            <span className="inline-block bg-gradient-to-r from-green-400 via-white to-red-400 bg-clip-text text-transparent animate-gradient">
              Doodle Gallery
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-green-500"></div>
            <p className="text-xl text-gray-300">
              <span className="font-bold text-white">{doodles.length}</span> voices of solidarity 🇵🇸
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500"></div>
          </div>

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto mb-8 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doodles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-slate-800/90 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  sortBy === 'recent'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-slate-800/90 text-gray-400 hover:text-white border border-white/20'
                }`}
              >
                🕐 Most Recent
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  sortBy === 'popular'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-slate-800/90 text-gray-400 hover:text-white border border-white/20'
                }`}
              >
                ❤️ Most Liked
              </button>
            </div>
          </div>

          <Link 
            href="/draw"
            className="group relative inline-block"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative px-8 py-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-white font-bold text-lg flex items-center gap-2 shadow-2xl">
              <span>✨</span>
              Add Your Doodle
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="w-16 h-16 border-4 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-400 text-lg">Loading amazing doodles...</p>
          </div>
        )}

        {/* No Results State */}
        {!loading && doodles.length > 0 && filteredDoodles.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl text-white font-bold mb-3">No results found</p>
            <p className="text-gray-400 mb-6">Try a different search term</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && doodles.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-3xl text-white font-bold mb-3">No doodles yet!</p>
              <p className="text-gray-400 text-lg mb-8">Be the first voice. Share your art.</p>
            </div>
            <Link 
              href="/draw"
              className="group relative inline-block"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative px-8 py-4 bg-gradient-to-br from-green-600 to-green-700 rounded-xl text-white font-bold text-lg">
                Create First Doodle
              </div>
            </Link>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && filteredDoodles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoodles.map((doodle) => (
              <div 
                key={doodle.id}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 via-white to-red-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative bg-slate-800/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="aspect-video bg-slate-700 relative overflow-hidden">
                    <img 
                      src={doodle.image_url} 
                      alt={doodle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white group-hover:text-green-400 transition-colors">
                      {doodle.title}
                    </h3>
                    {doodle.description && (
                      <p className="text-gray-400 text-sm mb-3 line-clamp-3 flex-1">
                        {doodle.description}
                      </p>
                    )}
                    
                    {/* Like and Share Section */}
                    <div className="mt-auto pt-3 border-t border-white/10 space-y-3">
                      {/* Date and Like */}
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(doodle.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <button
                          onClick={() => handleLike(doodle.id)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition-all group/like"
                        >
                          <span className="group-hover/like:scale-125 transition-transform">❤️</span>
                          <span className="text-sm font-bold">{doodle.likes || 0}</span>
                        </button>
                      </div>

                      {/* Share Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => shareToTwitter(doodle)}
                          className="flex-1 px-2 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-xs transition-all"
                          title="Share on Twitter"
                        >
                          🐦
                        </button>
                        <button
                          onClick={() => shareToFacebook(doodle)}
                          className="flex-1 px-2 py-2 bg-blue-800/20 hover:bg-blue-800/40 rounded-lg text-xs transition-all"
                          title="Share on Facebook"
                        >
                          📘
                        </button>
                        <button
                          onClick={() => shareToWhatsApp(doodle)}
                          className="flex-1 px-2 py-2 bg-green-600/20 hover:bg-green-600/40 rounded-lg text-xs transition-all"
                          title="Share on WhatsApp"
                        >
                          💬
                        </button>
                        <button
                          onClick={copyLink}
                          className="flex-1 px-2 py-2 bg-gray-600/20 hover:bg-gray-600/40 rounded-lg text-xs transition-all"
                          title="Copy Link"
                        >
                          🔗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Message */}
        {!loading && doodles.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
              <p className="text-gray-400 text-sm">
                Every doodle is a voice for <span className="text-white font-bold">Palestine 🇵🇸</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

