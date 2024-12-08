"use client"

import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import YouTube from 'react-youtube';
import { Music, ThumbsUp, ThumbsDown, Play, Pause, Plus } from 'lucide-react';
import axios from "axios"
// Types
interface Song {
  id: string;
  url: string;
  title: string;
  votes: number;
  thumbnail: string;
}

interface MusicStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  addSong: (url: string) => void;
  vote: (id: string, value: number) => void;
  playNext: () => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
}

// Utility function to extract YouTube ID
function getYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}
const REFRESH_INTERVAL_MS=10*1000;

async function refreshStreams(){
    const res = await axios.get(`/api/stream/my`);
    console.log(res)
}

useEffect(()=>{
    refreshStreams();
    const interval = setInterval(()=>{

    },REFRESH_INTERVAL_MS)
},[])

// Store
const useMusicStore = create<MusicStore>((set) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  addSong: (url) => {
    const newSong: Song = {
      id: Math.random().toString(36).substr(2, 9),
      url,
      title: `Song ${Math.floor(Math.random() * 1000)}`,
      votes: 0,
      thumbnail: `https://img.youtube.com/vi/${getYouTubeId(url)}/default.jpg`,
    };
    set((state) => ({
      queue: [...state.queue, newSong].sort((a, b) => b.votes - a.votes),
    }));
  },
  vote: (id, value) => {
    set((state) => ({
      queue: state.queue
        .map((song) =>
          song.id === id ? { ...song, votes: song.votes + value } : song
        )
        .sort((a, b) => b.votes - a.votes),
    }));
  },
  playNext: () => {
    set((state) => ({
      currentSong: state.queue[0] || null,
      queue: state.queue.slice(1),
      isPlaying: true,
    }));
  },
  playSong: (song) => {
    set((state) => ({
      currentSong: song,
      queue: state.queue.filter((s) => s.id !== song.id),
      isPlaying: true,
    }));
  },
  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },
}));

// Player Component with Play Button
const Player: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, playNext } = useMusicStore();
  const [player, setPlayer] = useState<any>(null);

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      togglePlay();
    }
  };

  if (!currentSong) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">No song playing</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="relative">
        <YouTube
          videoId={getYouTubeId(currentSong.url)}
          opts={{
            height: '390',
            width: '640',
            playerVars: {
              autoplay: 1,
            },
          }}
          onReady={onReady}
          onEnd={playNext}
          className="w-full"
        />
        <button
          onClick={handlePlayPause}
          className="absolute bottom-4 left-4 bg-gray-900 bg-opacity-75 p-3 rounded-full hover:bg-opacity-100 transition-all"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-200">{currentSong.title}</h3>
      </div>
    </div>
  );
};

const AddSong: React.FC = () => {
  const [url, setUrl] = useState('');
  const addSong = useMusicStore((state) => state.addSong);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      addSong(url);
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex space-x-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL here..."
          className="flex-1 bg-gray-800 text-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={18} />
          <span>Add</span>
        </button>
      </div>
    </form>
  );
};

const SongQueue: React.FC = () => {
  const { queue, vote, playSong } = useMusicStore();

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-200">Queue</h2>
      <div className="space-y-3">
        {queue.map((song) => (
          <div
            key={song.id}
            className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-16 h-12 object-cover rounded"
              />
              <span className="text-gray-200">{song.title}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => playSong(song)}
                className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-gray-700 rounded-full"
                title="Play now"
              >
                <Play size={18} />
              </button>
              <button
                onClick={() => vote(song.id, 1)}
                className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ThumbsUp size={18} />
                <span>{song.votes}</span>
              </button>
              <button
                onClick={() => vote(song.id, -1)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ThumbsDown size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center space-x-4 mb-8">
          <Music size={32} className="text-gray-400" />
          <h1 className="text-3xl font-bold">Stream Music Queue</h1>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Player />
            <AddSong />
          </div>
          
          <div>
            <SongQueue />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;