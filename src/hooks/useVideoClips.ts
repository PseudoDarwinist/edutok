import { useState, useCallback } from "react";
import type { VideoClip } from "../components/VideoCard";

const hardcodedClips: VideoClip[] = [
    {
        id: "web-dev-basics",
        youtubeId: "916GWv2Qs08",
        startTime: 60,
        endTime: 180,
        title: "Web Development in 2024",
        description: "Learn about the latest trends and technologies in web development"
    },
    {
        id: "react-hooks",
        youtubeId: "TNhaISOUy6Q",
        startTime: 120,
        endTime: 240,
        title: "React Hooks Explained",
        description: "Understanding React Hooks with practical examples"
    },
    {
        id: "javascript-async",
        youtubeId: "vn3tm0quoqE",
        startTime: 90,
        endTime: 210,
        title: "Async JavaScript Made Simple",
        description: "Master asynchronous programming in JavaScript"
    },
    {
        id: "css-grid",
        youtubeId: "9zBsdzdE4sM",
        startTime: 150,
        endTime: 270,
        title: "CSS Grid Layout",
        description: "Learn modern CSS Grid layout techniques"
    },
    {
        id: "typescript-basics",
        youtubeId: "BwuLxPH8IDs",
        startTime: 180,
        endTime: 300,
        title: "TypeScript for Beginners",
        description: "Getting started with TypeScript in your web projects"
    },
    {
        id: "nextjs-intro",
        youtubeId: "Sklc_fQBmcs",
        startTime: 140,
        endTime: 260,
        title: "Next.js Tutorial",
        description: "Introduction to Next.js framework and its features"
    },
    {
        id: "tailwind-basics",
        youtubeId: "mr15Xzb1Ook",
        startTime: 100,
        endTime: 220,
        title: "TailwindCSS Crash Course",
        description: "Learn utility-first CSS with Tailwind"
    },
    {
        id: "git-basics",
        youtubeId: "8JJ101D3knE",
        startTime: 120,
        endTime: 240,
        title: "Git for Beginners",
        description: "Essential Git commands and workflows"
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