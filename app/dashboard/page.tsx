// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"
// import { ArrowBigUp, ArrowBigDown, ThumbsUp } from 'lucide-react'
// import { Appbar } from '../components/Appbar'

// interface Song {
//   id: number;
//   url: string;
//   votes: number;
//   haveUpvoted: boolean
// }
// const REFRESH_INTERVAL_MS = 10*1000;
// export default function SongVotingQueue() {
//   const [songQueue, setSongQueue] = useState<Song[]>([])
//   const [currentSong, setCurrentSong] = useState<Song | null>(null)
//   const [newSongUrl, setNewSongUrl] = useState('')
//   useEffect(()=>{
//     refreshstreams()
//     const interval = setInterval(()=>{

//     },REFRESH_INTERVAL_MS)
//   },[])
//   useEffect(() => {
//     if (!currentSong && songQueue?.length > 0) {
//       playNextSong()
//     }
//   }, [currentSong, songQueue])

//   const addSong =async (e: React.FormEvent) => {
//     e.preventDefault()
//     const res = await fetch(`/api/stream/`,{
//       method:"POST",
//       body:JSON.stringify({
//         url:newSongUrl,
//         creatorId:"f28d6cbd-7a8e-4f3f-9683-0d49ac7e8d05"
//       })
//     })
//     if (newSongUrl) {
//       const newSong: Song = {
//         id: Date.now(),
//         url: newSongUrl,
//         votes: 0,
//         haveUpvoted: false
//       }
//       setSongQueue(prevQueue => [...prevQueue, newSong].sort((a, b) => b.votes - a.votes))
//       setNewSongUrl('')
//     }
//   }
//   async function refreshstreams() {
//     const res = await fetch(`/api/stream/my`,{
//         credentials:"include"
//     })
//     const json =await res.json();
//     setSongQueue(json.str)
//   }
  
//   // const vote = (id: number, increment: number) => {
//   //   setSongQueue(prevQueue =>
//   //     prevQueue.map(song =>
//   //       song.id === id ? { ...song, votes: song.votes + increment } : song
//   //     ).sort((a, b) => b.votes - a.votes)
//   //   )
//   //   fetch("/api/stream/upvote",{
//   //     method: "POST",
//   //     body:JSON.stringify({
//   //       streamId: id
//   //     })
//   //   })
//   // }
//   const handleVote = (id:number,isUpvote:boolean)=>{
//      setSongQueue(songQueue.map(song=>
//       song.id===id ? {
//         ...song, vote: isUpvote ? song.votes +1
// : song.votes -1, 
// haveUpvoted: !song.haveUpvoted     }
// :song
//      ).sort((a,b)=> (b.votes)-(a.votes)))
//      fetch(`/api/stream/${isUpvote ? "upvote":"downvote"}`,{
//       method: "POST",
//       body:JSON.stringify({
//         streamId: id
//       })
//     })
//   }

//   const playNextSong = () => {
//     if (songQueue.length > 0) {
//       const nextSong = songQueue[0]
//       setCurrentSong(nextSong)
//       setSongQueue(prevQueue => prevQueue.slice(1))
//     } else {
//       setCurrentSong(null)
//     }
//   }

//   const getEmbedUrl = (url: string) => {
//     const videoId = url.split('v=')[1]
//     return `https://www.youtube.com/embed/${videoId}`
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <Appbar/>
//       <div className="container mx-auto p-4">
//         <h1 className="text-3xl font-bold mb-6 text-gray-100">Song Voting Queue</h1>
        
//         <form onSubmit={addSong} className="mb-6">
//           <div className="flex gap-2">
//             <Input
//               type="text"
//               value={newSongUrl}
//               onChange={(e) => setNewSongUrl(e.target.value)}
//               placeholder="Enter YouTube URL"
//               className="flex-grow bg-gray-800 text-gray-100 border-gray-700"
//             />
//             <Button onClick={addSong} type="submit" variant="secondary">Add Song</Button>
//           </div>
//         </form>

//         {currentSong && (
//           <Card className="mb-6 bg-gray-800 border-gray-700">
//             <CardContent className="p-4">
//               <h2 className="text-2xl font-semibold mb-4 text-gray-100">Now Playing</h2>
//               <div className="aspect-video">
//                 <iframe
//                   width="100%"
//                   height="100%"
//                   src={getEmbedUrl(currentSong.url)}
//                   allowFullScreen
//                   className="rounded-lg"
//                 ></iframe>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         <h2 className="text-2xl font-semibold mb-4 text-gray-100">Upcoming Songs</h2>
//         <ul className="space-y-3">
//           {songQueue?.map(song => (
//             <li key={song.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">      
//                 <Button variant="outline"
//                 size="sm"
//                 onClick={()=>handleVote(song.id,song.haveUpvoted ? false : true)}
//                 className='flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700'>
//                   {song.haveUpvoted ? <ThumbsUp className='h-5 w-5'/> :<ThumbsUp className='h-5 w-5'/>}
//                   <span>{song.votes}</span>
//                 </Button>
//               <span className="flex-grow truncate text-gray-300">{song.url}</span>
//             </li>
//           ))}
//         </ul>

//         {songQueue?.length === 0 && !currentSong && (
//           <p className="text-gray-400">No songs in the queue. Add a song to get started!</p>
//         )}
//       </div>
//     </div>
//   )
// }
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
  votes: number;
  haveUpvoted: boolean;
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function SongVotingQueue() {
  const [songQueue, setSongQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [newSongUrl, setNewSongUrl] = useState('');

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    if (!currentSong && songQueue.length > 0) {
      playNextSong();
    }
  }, [currentSong, songQueue]);

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();

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
      url: newSongUrl,
      votes: 0,
      haveUpvoted: false,
    };

    setSongQueue((prevQueue) => [...prevQueue, newSong].sort((a, b) => b.votes - a.votes));
    setNewSongUrl('');
  };

  async function refreshStreams() {
    const res = await fetch(`/api/stream/my`, {
      credentials: "include",
    });
    const json = await res.json();
    setSongQueue(json.str || []); // Ensure it's an array
  }

  const handleVote = (id: number, isUpvote: boolean) => {
    setSongQueue((prevQueue) =>
      prevQueue.map((song) =>
        song.id === id
          ? {
              ...song,
              votes: isUpvote ? song.votes + 1 : song.votes - 1,
              haveUpvoted: !song.haveUpvoted,
            }
          : song
      ).sort((a, b) => b.votes - a.votes)
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

  const getEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
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
            <Button type="submit" variant="secondary">Add Song</Button>
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
          {songQueue.map((song) => (
            <li key={song.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(song.id, !song.haveUpvoted)}
                className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{song.votes}</span>
              </Button>
              <span className="flex-grow truncate text-gray-300">{song.url}</span>
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
