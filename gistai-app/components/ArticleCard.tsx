import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

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

interface ArticleCardProps {
    article: ArticleData;
    isSelected?: boolean;
    onSelect?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
    article, 
    isSelected = false,
    onSelect 
}) => {
    // Format the publication date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <TouchableOpacity 
            onPress={onSelect}
            style={[
                styles.card,
                isSelected && styles.selectedCard
            ]}
        >
            {isSelected && (
                <View style={styles.selectedBadge}>
                    <Feather name="check-circle" size={20} color="white" />
                </View>
            )}
            
            <View style={styles.cardContent}>
                {article.urlToImage && (
                    <Image 
                        source={{ uri: article.urlToImage }} 
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
                
                <View style={styles.textContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>{article.title}</Text>
                        <View style={styles.metaContainer}>
                            {article.author && (
                                <View style={styles.metaItem}>
                                    <Feather name="user" size={14} color="#6B7280" style={styles.metaIcon} />
                                    <Text style={styles.metaText}>{article.author}</Text>
                                </View>
                            )}
                            <View style={styles.metaItem}>
                                <Feather name="calendar" size={14} color="#6B7280" style={styles.metaIcon} />
                                <Text style={styles.metaText}>{formatDate(article.publishedAt)}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.contentContainer}>
                        {article.description && (
                            <Text style={styles.description} numberOfLines={2}>
                                {article.description}
                            </Text>
                        )}
                        <Text style={styles.content} numberOfLines={3}>
                            {article.content}
                        </Text>
                        <View style={styles.footer}>
                            <View style={styles.sourceContainer}>
                                <Feather name="globe" size={14} color="#6B7280" style={styles.sourceIcon} />
                                <Text style={styles.source}>{article.source.name}</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.urlButton}
                                onPress={() => Linking.openURL(article.url)}
                            >
                                <Text style={styles.urlButtonText}>Read More</Text>
                                <Feather name="external-link" size={14} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: '#4F46E5',
        backgroundColor: '#F5F3FF',
    },
    selectedBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#4F46E5',
        borderRadius: 12,
        padding: 4,
        zIndex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        backgroundColor: '#F3F4F6',
    },
    cardContent: {
        overflow: 'hidden',
    },
    textContent: {
        padding: 20,
    },
    cardHeader: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
        lineHeight: 24,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaIcon: {
        marginRight: 6,
    },
    metaText: {
        fontSize: 14,
        color: '#6B7280',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    contentContainer: {
        gap: 12,
    },
    description: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 22,
    },
    content: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    sourceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sourceIcon: {
        marginRight: 6,
    },
    source: {
        fontSize: 14,
        color: '#6B7280',
    },
    urlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    urlButtonText: {
        fontSize: 14,
        color: '#4F46E5',
        fontWeight: '500',
    },
});