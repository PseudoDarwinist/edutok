import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { VideoClip } from '../components/VideoCard';

interface LikedVideosContextType {
    likedVideos: VideoClip[];
    toggleLike: (video: VideoClip) => void;
    isLiked: (id: string) => boolean;
}

const LikedVideosContext = createContext<LikedVideosContextType | undefined>(undefined);

export function LikedVideosProvider({ children }: { children: ReactNode }) {
    const [likedVideos, setLikedVideos] = useState<VideoClip[]>(() => {
        const saved = localStorage.getItem('likedVideos');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
    }, [likedVideos]);

    const toggleLike = (video: VideoClip) => {
        setLikedVideos(prev => {
            const isAlreadyLiked = prev.some(v => v.id === video.id);
            if (isAlreadyLiked) {
                return prev.filter(v => v.id !== video.id);
            } else {
                return [...prev, video];
            }
        });
    };

    const isLiked = (id: string) => {
        return likedVideos.some(video => video.id === id);
    };

    return (
        <LikedVideosContext.Provider value={{ likedVideos, toggleLike, isLiked }}>
            {children}
        </LikedVideosContext.Provider>
    );
}

export function useLikedVideos() {
    const context = useContext(LikedVideosContext);
    if (context === undefined) {
        throw new Error('useLikedVideos must be used within a LikedVideosProvider');
    }
    return context;
} 