import { useState, useEffect } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Loader2, Heart, Share2 } from 'lucide-react';
import { useLikedVideos } from '../contexts/LikedVideosContext';

export interface VideoClip {
    id: string;
    youtubeId: string;
    startTime: number;
    endTime: number;
    title: string;
    description: string;
}

interface VideoCardProps {
    clip: VideoClip;
    onEnded?: () => void;
    isVisible?: boolean;
}

export function VideoCard({ clip, onEnded, isVisible = false }: VideoCardProps) {
    const [player, setPlayer] = useState<YouTubePlayer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toggleLike, isLiked } = useLikedVideos();

    useEffect(() => {
        if (!player) return;

        try {
            if (isVisible) {
                player.playVideo();
            } else {
                player.pauseVideo();
            }
        } catch (err) {
            console.error('Error updating player state:', err);
        }
    }, [isVisible, player]);

    const onReady = (event: YouTubeEvent) => {
        console.log('Video ready');
        const player = event.target;
        setPlayer(player);
        setIsLoading(false);
        setError(null);
    };

    const onError = (event: YouTubeEvent) => {
        console.error('YouTube player error:', event);
        const errorCode = event.data;
        let errorMessage = 'Failed to load video';
        
        switch (errorCode) {
            case 2:
                errorMessage = 'Invalid video ID';
                break;
            case 5:
                errorMessage = 'HTML5 player error';
                break;
            case 100:
                errorMessage = 'Video not found';
                break;
            case 101:
            case 150:
                errorMessage = 'Video playback not allowed';
                break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
    };

    const onStateChange = (event: YouTubeEvent) => {
        const state = event.data;
        
        if (state === 1) { // Playing
            setIsLoading(false);
            setError(null);
            const currentTime = event.target.getCurrentTime();
            if (currentTime < clip.startTime) {
                event.target.seekTo(clip.startTime);
            }
        }
        else if (state === 0) { // Ended
            if (onEnded) {
                onEnded();
            }
        }
        else if (state === -1 || state === 3) { // Unstarted or Buffering
            setIsLoading(true);
        }
        else if (state === 2) { // Paused
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        if (player) {
            player.loadVideoById({
                videoId: clip.youtubeId,
                startSeconds: clip.startTime,
                endSeconds: clip.endTime
            });
        }
    };

    const handleShare = async () => {
        try {
            const shareData = {
                title: clip.title,
                text: clip.description,
                url: `https://youtube.com/watch?v=${clip.youtubeId}&t=${clip.startTime}s`
            };
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center snap-start relative bg-black overflow-hidden">
            <div className="w-full h-full relative flex items-center justify-center">
                <div className="absolute w-full h-0 pb-[56.25%] max-h-screen">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <YouTube
                            videoId={clip.youtubeId}
                            opts={{
                                width: '100%',
                                height: '100%',
                                playerVars: {
                                    autoplay: isVisible ? 1 : 0,
                                    mute: 1,
                                    start: clip.startTime,
                                    end: clip.endTime,
                                    controls: 1,
                                    modestbranding: 1,
                                    rel: 0,
                                    showinfo: 0,
                                    origin: window.location.origin,
                                    playsinline: 1,
                                    enablejsapi: 1
                                },
                            }}
                            onReady={onReady}
                            onError={onError}
                            onStateChange={onStateChange}
                            className="absolute inset-0 w-full h-full"
                            iframeClassName="w-full h-full"
                        />
                    </div>
                </div>

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-white text-center">
                            <p className="text-red-500 mb-2">{error}</p>
                            <button
                                onClick={handleRetry}
                                className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                <div className="absolute right-4 bottom-[20vh] flex flex-col items-center gap-4 z-20">
                    <div className="flex flex-col items-center">
                        <button
                            onClick={() => toggleLike(clip)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                isLiked(clip.id) ? 'text-red-500' : 'text-white hover:text-red-500'
                            }`}
                            aria-label="Like video"
                        >
                            <Heart className={`w-7 h-7 ${isLiked(clip.id) ? 'fill-current' : ''}`} />
                        </button>
                        <span className="text-white text-xs mt-1">
                            {isLiked(clip.id) ? 'Liked' : 'Like'}
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full text-white hover:text-blue-500 transition-colors"
                            aria-label="Share video"
                        >
                            <Share2 className="w-7 h-7" />
                        </button>
                        <span className="text-white text-xs mt-1">Share</span>
                    </div>
                </div>

                <div className="absolute backdrop-blur-xs bg-black/30 bottom-[10vh] left-0 right-0 p-6 text-white z-10">
                    <h2 className="text-2xl font-bold drop-shadow-lg">{clip.title}</h2>
                    <p className="text-gray-100 mb-4 drop-shadow-lg line-clamp-6">
                        {clip.description}
                    </p>
                </div>
            </div>
        </div>
    );
} 