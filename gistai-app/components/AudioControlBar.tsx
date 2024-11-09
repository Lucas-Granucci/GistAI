import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

interface AudioControlBarProps {
    isPlaying: boolean;
    progress: number;
    duration: number;
    onPlayPause: () => void;
    onSeek: (value: number) => void;
    audioTitle?: string;
}

export const AudioControlBar: React.FC<AudioControlBarProps> = ({
    isPlaying,
    progress,
    duration,
    onPlayPause,
    onSeek,
    audioTitle = 'No audio playing'
}) => {
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={audioStyles.container}>
            <TouchableOpacity 
                onPress={onPlayPause}
                style={audioStyles.playButton}
            >
                <Feather 
                    name={isPlaying ? "pause" : "play"} 
                    size={24} 
                    color="#4F46E5"
                />
            </TouchableOpacity>
            <View style={audioStyles.progressContainer}>
                <Text style={audioStyles.audioTitle} numberOfLines={1}>
                    {audioTitle}
                </Text>
                <View style={audioStyles.sliderContainer}>
                    <Slider
                        style={audioStyles.slider}
                        minimumValue={0}
                        maximumValue={duration}
                        value={progress}
                        onValueChange={onSeek}
                        minimumTrackTintColor="#4F46E5"
                        maximumTrackTintColor="#D1D5DB"
                        thumbTintColor="#4F46E5"
                    />
                    <View style={audioStyles.timeContainer}>
                        <Text style={audioStyles.timeText}>{formatTime(progress)}</Text>
                        <Text style={audioStyles.timeText}>{formatTime(duration)}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const audioStyles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        margin: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    playButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    progressContainer: {
        flex: 1,
        marginLeft: 16,
    },
    audioTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 8,
    },
    sliderContainer: {
        width: '100%',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -8,
    },
    timeText: {
        fontSize: 12,
        color: '#6B7280',
    },
});