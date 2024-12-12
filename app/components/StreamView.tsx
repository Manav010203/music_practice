'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowBigUp, ArrowBigDown, ThumbsUp } from 'lucide-react'
import { Appbar } from '../components/Appbar'

interface Song {
  id: number;
  url: string;
  upvotes: number;
  haveUpvoted: boolean;
  title:string
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
    creatorId
}:{
    creatorId:string
}) {
  const [songQueue, setSongQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [newSongUrl, setNewSongUrl] = useState('');
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  useEffect(()=>{
    if(!currentSong && songQueue.length>0){
      playNextSong();
    }
  },[currentSong,songQueue])

  useEffect(() => {
    if (!currentSong && songQueue.length > 0) {
      playNextSong();
    }
  }, [currentSong, songQueue]);

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
setLoading(true)
    if (!newSongUrl) return;

    const res = await fetch(`/api/stream/`, {
      method: "POST",
      body: JSON.stringify({
        url: newSongUrl,
        creatorId: "1686036d-a955-4dc3-b99b-72e646b3903d",
      }),
    });

    const newSong: Song = {
      id: Date.now(),
      title:"",
      url: newSongUrl,
      upvotes: 0,
      haveUpvoted: false,
    };

    setSongQueue((prevQueue) => [...prevQueue, newSong].sort((a, b) => b.upvotes - a.upvotes));
    setLoading(false)
    setNewSongUrl('');
  };
  

  async function refreshStreams() {
    const res = await fetch(`/api/stream/?creatorId=${creatorId}`, {
      credentials: "include",
    });
    const json = await res.json();
    setSongQueue(json.streams || []); // Ensure it's an array
  }

  const handleVote = (id: number, isUpvote: boolean) => {
    setSongQueue((prevQueue) =>
      prevQueue.map((song) =>
        song.id === id
          ? {
              ...song,
              votes: isUpvote ? song.upvotes + 1 : song.upvotes - 1,
              haveUpvoted: !song.haveUpvoted,
            }
          : song
      ).sort((a, b) => b.upvotes - a.upvotes)
    );

    fetch(`/api/stream/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({
        streamId: id,
      }),
    });
  };

  const playNextSong = () => {
    setSongQueue((prevQueue) => {
      if (prevQueue.length === 0) {
        setCurrentSong(null);
        return [];
      }

      const [nextSong, ...restQueue] = prevQueue;
      setCurrentSong(nextSong);
      return restQueue;
    });
  };

  // const getEmbedUrl = (url: string) => {
  //   const videoId = url.split('v=')[1];
  //   return `https://www.youtube.com/embed/${videoId}`;
  // };
  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
  
      // Handle standard YouTube URL
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
  
      // Handle shortened YouTube URL (e.g., youtu.be)
      if (urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.pathname.substring(1); // Extract ID from path
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
  
      return null; // URL does not match expected formats
    } catch (error) {
      console.error('Invalid URL:', url, error);
      return null; // Return null for invalid URLs
    }
  };
  const getVideoId = (url: string): string | null => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*v=([^&]+)/) ||
                  url.match(/(?:https?:\/\/)?youtu\.be\/([^?]+)/);
    return match ? match[1] : null;
  };
  

  const getThumbnailUrl = (url: string) => {
    const videoId = getVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/default.jpg` : '';
  };
  
  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Appbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Song Voting Queue</h1>
        
        <form onSubmit={addSong} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              value={newSongUrl}
              onChange={(e) => setNewSongUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
            />
            <Button disabled={loading} type="submit" variant="secondary">{loading ?"Adding Song":"Add Song"}</Button>
          </div>
        </form>

        {currentSong && (
          <Card className="mb-6 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-100">Now Playing</h2>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  //@ts-ignore
                  src={getEmbedUrl(currentSong.url)}
                  allowFullScreen
                  className="rounded-lg"
                  onEnded={playNextSong}
                ></iframe>
              </div>
              <div className='pt-2 flex justify-end'>
              <Button onClick={()=>
                playNextSong()
              }  type="submit" variant="secondary">
              <span>&#8594;</span>Next Song</Button>
              </div>
              
            </CardContent>
          </Card>
        )}

        <h2 className="text-2xl font-semibold mb-4 text-gray-100">Upcoming Songs</h2>
        <ul className="space-y-3">
          {songQueue.map((song) => (
            <li key={song.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <img 
              src={getThumbnailUrl(song.url)}
              alt='Thumbnail'
              className='w-12 h-12 rounded-sm object-cover'/>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(song.id, !song.haveUpvoted)}
                className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              >

                <ThumbsUp className="h-5 w-5" />
                <span>{isNaN(song.upvotes) ? 0 : song.upvotes}</span>
              </Button>
              <span className="flex-grow truncate text-gray-300">{song.title}</span>
            </li>
          ))}
        </ul>

        {songQueue.length === 0 && !currentSong && (
          <p className="text-gray-400">No songs in the queue. Add a song to get started!</p>
        )}
      </div>
    </div>
  );
}
