import { useState, useRef, useEffect } from 'react';

export const useAudioControl = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioObjectUrlRef = useRef<string | null>(null);
    const currentPositionRef = useRef(0);

    const cleanup = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        if (audioObjectUrlRef.current) {
            URL.revokeObjectURL(audioObjectUrlRef.current);
            audioObjectUrlRef.current = null;
        }
        setIsPlaying(false);
        setProgress(0);
        setDuration(0);
        currentPositionRef.current = 0;
    };

    useEffect(() => {
        return cleanup;
    }, []);

    const loadAudio = async (audioUrl: string) => {
        try {
            stopAudio(); // Stop any existing audio before loading new
            const response = await fetch(audioUrl);
            if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
            const audioBlob = await response.blob();
            const audioObjectUrl = URL.createObjectURL(audioBlob);
            audioObjectUrlRef.current = audioObjectUrl;
            const audio = new Audio(audioObjectUrl);
            audioRef.current = audio;
            audio.addEventListener('loadedmetadata', () => {
                setDuration(audio.duration);
                currentPositionRef.current = 0;
            });
            audio.addEventListener('timeupdate', () => {
                setProgress(audio.currentTime);
                currentPositionRef.current = audio.currentTime;
            });
            audio.onended = () => cleanup();
        } catch (error) {
            console.error("Failed to load audio:", error);
            cleanup();
        }
    };

    const playAudio = () => {
        console.log("Calling playAudio()")
        if (audioRef.current) {
            audioRef.current.currentTime = currentPositionRef.current;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((error) => {
                    console.error("Audio playback error:", error);
                    setIsPlaying(false);
                });
        }
    };

    const togglePlayPause = () => {
        console.log("Got to togglePlayPause")
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            currentPositionRef.current = audioRef.current.currentTime;
            setIsPlaying(false);
        } else {
            console.log("Got to another call for playAudio()")
            playAudio();
        }
    };

    const handleSeek = (value: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            currentPositionRef.current = value;
            setProgress(value);
        }
    };

    const stopAudio = () => {
        if (audioRef.current && isPlaying) {
            cleanup();
        }
    };

    return {
        isPlaying,
        progress,
        duration,
        togglePlayPause,
        loadAudio,
        playAudio,
        stopAudio,
        handleSeek
    };
};