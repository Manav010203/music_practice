
"use client"
import React, { useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { v4 as uuidv4 } from "uuid";

interface Song {
  id: string;
  videoId: string;
  title: string;
  upvotes: number;
}

const App: React.FC = () => {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [url, setUrl] = useState<string>("");

  const addSong = () => {
    if (!url) return;
    fetch("/api/stream",
        {
            method: "POST",
            body: JSON.stringify({
             url:url,
             creatorId: "creatorId"
            })
        }
    )

    const videoId = url.split("v=")[1]?.split("&")[0];
    if (videoId) {
      setQueue([
        ...queue,
        { id: uuidv4(), videoId, title: `Song ${queue.length + 1}`, upvotes: 0 },
      ]);
      setUrl("");
      
    } else {
      alert("Invalid YouTube URL");
    }
   
  };

//   const upvoteSong = (id: string) => {
//     setQueue(
//       queue.map((song) =>
//         song.id === id ? { ...song, upvotes: song.upvotes + 1 } : song)
//     );
//     fetch("/api/stream/upvote",{
//         method:"POST",
//         body: JSON.stringify({
//             streamId: id
//         })
//       })
//   };

//   const downvoteSong = (id: string) => {
//     setQueue(
//       queue.map((song) =>
//         song.id === id
//           ? { ...song, upvotes: Math.max(0, song.upvotes - 1) }
//           : song
//       )
//     );
//     // fetch("/api/stream/downvote",{
//     //     method:"POST",
//     //     body: JSON.stringify({
//     //         streamId: id
//     //     })
//     //   })
//   };

const handleVote = (id:string, isUpvote:boolean)=>{
    setQueue(queue.map(video=>video.id===id
        ? {
            ...video,
            upvotes: isUpvote? video.upvotes+1 : video.upvotes,
        }
        : video
    ).sort((a,b)=> (b.upvotes)-(a.upvotes)))
    fetch("/api/stream/upvote",{
        method:"POST",
        body:JSON.stringify({
            streamID: id
        })
    })
}

  const playNextSong = () => {
    if (queue.length > 0) {
      const [nextSong, ...rest] = queue;
      setCurrentSong(nextSong);
      setQueue(rest);
    }
  };

  const handlePlayerEnd: YouTubeProps["onEnd"] = () => {
    playNextSong();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">StreamTunes</h1>

      {/* Input for song URL */}
      <div className="mb-6">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL..."
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 w-80"
        />
        <button
          onClick={addSong }
          className="ml-4 px-6 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Add Song
        </button>
      </div>

      {/* Current Song */}
      <div className="mb-6 w-3/4">
        {currentSong ? (
          <>
            <h2 className="text-2xl mb-2">{currentSong.title}</h2>
            <YouTube
              videoId={currentSong.videoId}
              opts={{ width: "100%", height: "390" }}
              onEnd={handlePlayerEnd}
            />
          </>
        ) : (
          <p>No song is currently playing.</p>
        )}
      </div>

      {/* Song Queue */}
      <div className="w-3/4">
        <h2 className="text-xl mb-4">Queue</h2>
        {queue.length > 0 ? (
          <ul>
            {queue.map((song) => (
              <li
                key={song.id}
                className="flex justify-between items-center bg-gray-800 p-4 rounded mb-2"
              >
                <span>{song.title}</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleVote(song.id,true)}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    ⬆ {song.upvotes}
                  </button>
                  {/* <button
                    onClick={() => handleVote(song.id,false)}
                    className="ml-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    ⬇ */}
                  {/* </button> */}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>The queue is empty.</p>
        )}
      </div>
    </div>
  );
};

export default App;
