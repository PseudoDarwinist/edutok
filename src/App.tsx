import { useEffect, useRef, useCallback, useState } from "react";
import { VideoCard } from "./components/VideoCard";
import { Loader2, Search, X, Download } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import { useVideoClips } from "./hooks/useVideoClips";
import { useLikedVideos } from "./contexts/LikedVideosContext";
import { LanguageSelector } from "./components/LanguageSelector";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const { clips, loading, fetchMore } = useVideoClips();
  const { likedVideos, toggleLike } = useLikedVideos();
  const observerTarget = useRef(null);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        fetchMore();
      }
    },
    [loading, fetchMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    fetchMore();
  }, []);

  const handleVideoEnd = useCallback(() => {
    setCurrentClipIndex((prev) => (prev + 1) % clips.length);
  }, [clips.length]);

  const filteredLikedVideos = likedVideos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const dataStr = JSON.stringify(likedVideos, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `edutok-favorites-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen w-full bg-zinc-900 flex justify-center">
      <div className="w-full max-w-[420px] relative bg-black">
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory hide-scroll">
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={() => window.location.reload()}
              className="text-2xl font-bold text-white drop-shadow-lg hover:opacity-80 transition-opacity"
            >
              LearningTok
            </button>
          </div>

          <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              About
            </button>
            <button
              onClick={() => setShowLikes(!showLikes)}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Likes
            </button>
            <LanguageSelector />
          </div>

          {showAbout && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 z-[41] p-6 rounded-lg max-w-md relative">
                <button
                  onClick={() => setShowAbout(false)}
                  className="absolute top-2 right-2 text-white/70 hover:text-white"
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-4 text-white">About LearningTok</h2>
                <p className="mb-4 text-white">
                  A TikTok-style interface for exploring educational video clips.
                </p>
                <p className="text-white/70 mt-2">
                  Made with ❤️ for learning and education.
                </p>
              </div>
              <div
                className="w-full h-full z-[40] top-1 left-1 bg-[rgb(28 25 23 / 43%)] fixed"
                onClick={() => setShowAbout(false)}
              />
            </div>
          )}

          {showLikes && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 z-[41] p-6 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col relative text-white">
                <button
                  onClick={() => setShowLikes(false)}
                  className="absolute top-2 right-2 text-white/70 hover:text-white"
                >
                  ✕
                </button>

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Liked Videos</h2>
                  {likedVideos.length > 0 && (
                    <button
                      onClick={handleExport}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Export liked videos"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  )}
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search liked videos..."
                    className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>

                <div className="flex-1 overflow-y-auto min-h-0">
                  {filteredLikedVideos.length === 0 ? (
                    <p className="text-white/70">
                      {searchQuery ? "No matches found." : "No liked videos yet."}
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {filteredLikedVideos.map((video) => (
                        <div
                          key={video.id}
                          className="flex gap-4 items-start group"
                        >
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <a
                                href={`https://youtube.com/watch?v=${video.youtubeId}&t=${video.startTime}s`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold hover:text-gray-200"
                              >
                                {video.title}
                              </a>
                              <button
                                onClick={() => toggleLike(video)}
                                className="text-white/50 hover:text-white/90 p-1 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                aria-label="Remove from likes"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-white/70 line-clamp-2">
                              {video.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div
                className="w-full h-full z-[40] top-1 left-1 bg-[rgb(28 25 23 / 43%)] fixed"
                onClick={() => setShowLikes(false)}
              />
            </div>
          )}

          {clips.map((clip, index) => (
            <VideoCard
              key={`${clip.id}-${index}`}
              clip={clip}
              onEnded={handleVideoEnd}
              isVisible={index === currentClipIndex}
            />
          ))}
          
          <div ref={observerTarget} className="h-10 -mt-1" />
          {loading && (
            <div className="h-screen w-full flex items-center justify-center gap-2 text-white">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading...</span>
            </div>
          )}
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default App;
