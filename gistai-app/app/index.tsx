import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { ArticleCard } from '@/components/ArticleCard';
import { AudioControlBar } from '@/components/AudioControlBar';
import { useNewsProcessing } from '@/hooks/useNewsProcessing';
import { useDeepDivePipeline } from '@/hooks/useDeepDivePipeline';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAudioControl } from '@/hooks/useAudioControl';

interface ArticleSource {
    id: string | null;
    name: string;
}

interface ArticleData {
    title: string;
    description: string;
    content: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    author?: string | null;
    source: ArticleSource;
}

export default function HomeScreen() {
    const audioControl = useAudioControl();
    const { 
        loading: newsLoading, 
        error: newsError, 
        articles, 
        fetchAndPlayNews
    } = useNewsProcessing(audioControl);

    const { 
        loading: deepDiveLoading, 
        error: deepDiveError, 
        script, 
        fetchAndPlayDeepDive
    } = useDeepDivePipeline(audioControl);

    const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
    
    const isLoading = newsLoading || deepDiveLoading;
    const combinedError = newsError || deepDiveError;

    const handlePlayPause = () => {
        console.log("Got to handlePlayPause")
        audioControl.togglePlayPause();
    };

    const handleSeek = (value: number) => {
        audioControl.handleSeek(value);
    }

    const getAudioTitle = () => {
        // TODO: Implement title logic
        return "No audio playing";
    };

    const handleDeepDive = () => {
        if (selectedArticle) {
            fetchAndPlayDeepDive(selectedArticle.title);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroSection}
            >
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>AI-Powered News Intelligence</Text>
                    <Text style={styles.heroSubtitle}>
                        Get personalized news insights and deep dives powered by advanced AI
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            onPress={fetchAndPlayNews} 
                            disabled={isLoading}
                            style={styles.primaryButton}
                        >
                            <Feather name="rss" size={20} color="white" style={styles.buttonIcon} />
                            <Text style={styles.primaryButtonText}>Fetch Latest News</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={handleDeepDive} 
                            disabled={isLoading || !selectedArticle}
                            style={[
                                styles.secondaryButton,
                                (!selectedArticle || isLoading) && styles.disabledButton
                            ]}
                        >
                            <Feather 
                                name="search" 
                                size={20} 
                                color={selectedArticle && !isLoading ? "#4F46E5" : "#9CA3AF"} 
                                style={styles.buttonIcon} 
                            />
                            <Text style={[
                                styles.secondaryButtonText,
                                (!selectedArticle || isLoading) && styles.disabledButtonText
                            ]}>
                                {selectedArticle ? "Deep Dive Selected Article" : "Select an Article First"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <AudioControlBar 
                isPlaying={audioControl.isPlaying}
                progress={audioControl.progress}
                duration={audioControl.duration}
                onPlayPause={handlePlayPause}
                onSeek={handleSeek}
                audioTitle={getAudioTitle()}
            />

            {/* Loading State */}
            {isLoading && (
                <View style={styles.statusContainer}>
                    <ActivityIndicator size="large" color="#4F46E5" />
                    <Text style={styles.statusText}>Processing your request...</Text>
                </View>
            )}

            {/* Error State */}
            {combinedError && (
                <View style={styles.statusContainer}>
                    <Feather name="alert-circle" size={24} color="#EF4444" />
                    <Text style={styles.errorText}>{combinedError}</Text>
                </View>
            )}

            {/* Articles Section */}
            <View style={styles.contentSection}>
                {articles.length > 0 && (
                    <Text style={styles.sectionTitle}>Today's Insights</Text>
                )}
                {articles.map((article, index) => (
                    <ArticleCard 
                        key={index} 
                        article={article}
                        isSelected={selectedArticle?.title === article.title}
                        onSelect={() => setSelectedArticle(article)}
                    />
                ))}
            </View>

            {/* Deep Dive Results */}
            {script && (
                <View style={styles.contentSection}>
                    <View style={styles.deepDiveContainer}>
                        <Text style={styles.deepDiveTitle}>Deep Dive Analysis</Text>
                        <View style={styles.deepDiveContent}>
                            <Text style={styles.scriptText}>{script}</Text>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    heroSection: {
        padding: 32,
        minHeight: 400,
        justifyContent: 'center',
    },
    heroContent: {
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    heroSubtitle: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 28,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        flexWrap: 'wrap',
    },
    primaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#F3F4F6',
        opacity: 0.8,
    },
    buttonIcon: {
        marginRight: 8,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#4F46E5',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButtonText: {
        color: '#9CA3AF',
    },
    contentSection: {
        padding: 24,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 24,
    },
    statusContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        margin: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statusText: {
        color: '#4F46E5',
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '500',
    },
    deepDiveContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginTop: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    deepDiveTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    deepDiveContent: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    scriptText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#374151',
    },
});