import { useState } from 'react';
import { fetchDeepDiveData } from '@/services/apiService';

export const useDeepDivePipeline = (audioControl: any) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [script, setScript] = useState<string | null>(null);

    const fetchAndPlayDeepDive = async (articleTitle: string) => {

        if (!articleTitle) {
            setError("Please select an article first");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await fetchDeepDiveData(articleTitle);

            if (data.speech_url) {
                await audioControl.loadAudio(data.speech_url);
                audioControl.playAudio();
            }

            setScript(data.deep_dive);
        } catch (error) {
            setError(`Failed to process deep dive: ${error}`);
            audioControl.stopAudio();
        } finally {
            setLoading(false);
        }
    };

    return { 
        loading, 
        error, 
        script, 
        fetchAndPlayDeepDive
    };
};
