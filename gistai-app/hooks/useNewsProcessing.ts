import { useState } from 'react';
import { fetchFullPipelineData } from '@/services/apiService';

export const useNewsProcessing = (audioControl: any) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [articles, setArticles] = useState<ArticleData[]>([]);
    //const audioControl = useAudioControl();

    const fetchAndPlayNews = async () => {
        setLoading(true);
        setError(null);
        try {
            const count = 5;
            const data = await fetchFullPipelineData(count);
            if (data.speech_url) {
                await audioControl.loadAudio(data.speech_url);
                audioControl.playAudio();
            }
            const articlesArray = Object.values(data.article_data) as ArticleData[];
            setArticles(articlesArray);
        } catch (error) {
            setError(`Failed to process news: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        articles,
        fetchAndPlayNews
    };
};
