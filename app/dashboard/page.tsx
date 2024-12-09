'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Play, Music, Pause, SkipForward } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface Song {
  id: string
  url: string
  type: string
  title: string
  upvotes: number
  downvotes: number
  haveUpvoted : boolean
  

}

export default function SongQueue() {
  const [songs, setSongs] = useState<Song[]>([])
  const [inputUrl, setInputUrl] = useState('')
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/stream/",{
        method:"POST",
        body: JSON.stringify({
            creatorId:"4cbbdb8a-77ed-4faa-bbad-b28ecde8cf93",
            url: inputUrl
        })
    })
    const videoId = extractVideoId(inputUrl)
    if (videoId) {
      const newSong: Song = {
        id: videoId,
        url: inputUrl,
        title: `Song ${songs.length + 1}`, // Placeholder title
        upvotes: 0,
        downvotes: 0
      }
      setSongs([...songs, newSong])
      setInputUrl('')
    } else {
      alert('Invalid YouTube URL')
    }
  }

  const handleVote = (index: number, type: 'up' | 'down') => {
    const newSongs = [...songs]
    if (type === 'up') {
      newSongs[index].upvotes++
    } else {
      newSongs[index].downvotes++
    }
    setSongs(newSongs)
    const res= fetch("/ai/stream/upvote",{
        method: "POST",
        body: JSON.stringify({
            
        })
    })
  }

  useEffect(() => {
    const sortedSongs = [...songs].sort((a, b) => b.upvotes - a.upvotes)
    if (sortedSongs.length > 0 && !currentSong) {
      setCurrentSong(sortedSongs[0])
      setSongs(sortedSongs.slice(1))
      setIsPlaying(true)
    }
  }, [songs, currentSong])

  const playNextSong = () => {
    if (songs.length > 0) {
      const sortedSongs = [...songs].sort((a, b) => b.upvotes - a.upvotes)
      setCurrentSong(sortedSongs[0])
      setSongs(sortedSongs.slice(1))
      setIsPlaying(true)
      setProgress(0)
    } else {
      setCurrentSong(null)
      setIsPlaying(false)
      setProgress(0)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval)
            playNextSong()
            return 0
          }
          return prevProgress + 1
        })
      }, 1000) // Update every second
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentSong])

  return (
    <div className=" mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-300">STREAMS</h1>
      
      {/* Current Song Preview */}
      {currentSong && (
        <Card className="mb-6 bg-gray-800 border-gray-600 border-2">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-300">Now Playing</h2>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src={`https://www.youtube.com/embed/${currentSong.id}?autoplay=1&mute=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-100 h-40 rounded-lg"
              ></iframe>
            </div>
        
            <div className="flex justify-end items-center">
              
              <Button onClick={playNextSong} variant="outline" className="bg-gray-700 hover:bg-gray-600 text-gray-200">
                <SkipForward className="mr-2 h-4 w-4" />
                Next Song
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Song Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste YouTube URL here"
            className="flex-grow bg-gray-800 text-gray-200 border-gray-600"
          />
          <Button type="submit" className="bg-gray-700 hover:bg-gray-600 text-gray-200">
            <Music className="mr-2 h-4 w-4" />
            Add Song
          </Button>
        </div>
      </form>

      {/* Song Queue */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-300">Upcoming Songs</h2>
        {songs.map((song, index) => (
          <Card key={song.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-200">{song.title}</h3>
                <a
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  View on YouTube
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleVote(index, 'up')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{song.upvotes}</span>
                </Button>
                <Button
                  onClick={() => handleVote(index, 'down')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{song.downvotes}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

