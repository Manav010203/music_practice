'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowBigUp, ArrowBigDown, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Appbar } from '../components/Appbar'

interface Song {
  id: number;
  url: string;
  votes: number;
  title: string;
  thumbnail: string;
}

export default function SongVotingQueue() {
  const [songQueue, setSongQueue] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [newSongUrl, setNewSongUrl] = useState('')
  const [previewSong, setPreviewSong] = useState<Song | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!currentSong && songQueue.length > 0) {
      playNextSong()
    }
  }, [currentSong, songQueue])

  const fetchVideoDetails = async (url: string) => {
    setIsLoading(true)
    try {
      const videoId = url.split('v=')[1]
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=YOUR_YOUTUBE_API_KEY`)
      const data = await response.json()
      const videoDetails = data.items[0].snippet
      return {
        title: videoDetails.title,
        thumbnail: videoDetails.thumbnails.default.url
      }
    } catch (error) {
      console.error('Error fetching video details:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const previewNewSong = async (url: string) => {
    const details = await fetchVideoDetails(url)
    if (details) {
      setPreviewSong({
        id: Date.now(),
        url,
        votes: 0,
        title: details.title,
        thumbnail: details.thumbnail
      })
    }
  }

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newSongUrl && previewSong) {
      setSongQueue(prevQueue => [...prevQueue, previewSong].sort((a, b) => b.votes - a.votes))
      setNewSongUrl('')
      setPreviewSong(null)
    }
  }

  const vote = (id: number, increment: number) => {
    setSongQueue(prevQueue =>
      prevQueue.map(song =>
        song.id === id ? { ...song, votes: song.votes + increment } : song
      ).sort((a, b) => b.votes - a.votes)
    )
  }

  const playNextSong = () => {
    if (songQueue.length > 0) {
      const nextSong = songQueue[0]
      setCurrentSong(nextSong)
      setSongQueue(prevQueue => prevQueue.slice(1))
    } else {
      setCurrentSong(null)
    }
  }

  const getEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]
    return `https://www.youtube.com/embed/${videoId}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Appbar/>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Song Voting Queue</h1>
        
        <form onSubmit={addSong} className="mb-6">
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              value={newSongUrl}
              onChange={(e) => {
                setNewSongUrl(e.target.value)
                previewNewSong(e.target.value)
              }}
              placeholder="Enter YouTube URL"
              className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
            />
            <Button type="submit" variant="secondary" disabled={!previewSong || isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Song'}
            </Button>
          </div>
          {previewSong && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 flex items-center gap-4">
                <Image
                  src={previewSong.thumbnail}
                  alt={previewSong.title}
                  width={120}
                  height={90}
                  className="rounded"
                />
                <div>
                  <h3 className="font-semibold text-gray-100">{previewSong.title}</h3>
                  <p className="text-gray-400 text-sm">Click 'Add Song' to queue</p>
                </div>
              </CardContent>
            </Card>
          )}
        </form>

        {currentSong && (
          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">Now Playing</h2>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={getEmbedUrl(currentSong.url)}
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        )}

        <h2 className="text-2xl font-semibold mb-4 text-gray-100">Upcoming Songs</h2>
        <ul className="space-y-3">
          {songQueue.map(song => (
            <li key={song.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <Image
                src={song.thumbnail}
                alt={song.title}
                width={80}
                height={60}
                className="rounded"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-100">{song.title}</h3>
                <p className="text-gray-400 text-sm truncate">{song.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => vote(song.id, 1)} className="text-gray-100 border-gray-600 hover:bg-gray-700">
                  <ArrowBigUp className="h-5 w-5" />
                </Button>
                <span className="font-semibold text-gray-100 w-8 text-center">{song.votes}</span>
                <Button variant="outline" size="icon" onClick={() => vote(song.id, -1)} className="text-gray-100 border-gray-600 hover:bg-gray-700">
                  <ArrowBigDown className="h-5 w-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {songQueue.length === 0 && !currentSong && (
          <p className="text-gray-400">No songs in the queue. Add a song to get started!</p>
        )}
      </div>
    </div>
  )
}