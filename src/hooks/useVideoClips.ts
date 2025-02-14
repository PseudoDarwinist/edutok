import { useState, useCallback } from "react";
import type { VideoClip } from "../components/VideoCard";

const hardcodedClips: VideoClip[] = [
    {
        id: "3b1b-neural-networks",
        youtubeId: "aircAruvnKk",
        startTime: 60,
        endTime: 180,
        title: "But what is a neural network?",
        description: "A beautiful visual introduction to neural networks by 3Blue1Brown"
    },
    {
        id: "karpathy-gpt",
        youtubeId: "kCc8FmEb1nY",
        startTime: 180,
        endTime: 300,
        title: "Let's build GPT",
        description: "Understanding GPT architecture and implementation by Andrej Karpathy"
    },
    {
        id: "veritasium-learning",
        youtubeId: "R9OHn5ZF4Uo",
        startTime: 120,
        endTime: 240,
        title: "The Science of Learning",
        description: "How to learn more effectively using scientific principles"
    }
];

export function useVideoClips() {
    const [clips, setClips] = useState<VideoClip[]>(hardcodedClips);
    const [loading, setLoading] = useState(false);

    const fetchMore = useCallback(async () => {
        setLoading(true);
        // Simulate loading more clips
        setTimeout(() => {
            setClips(prev => [...prev, ...hardcodedClips]);
            setLoading(false);
        }, 1000);
    }, []);

    return { clips, loading, fetchMore };
} 