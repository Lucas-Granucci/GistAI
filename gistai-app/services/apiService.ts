const BASE_URL = 'http://localhost:8000';

export async function fetchFullPipelineData(count: number) {
    try {
        const response = await fetch(`${BASE_URL}/news/full-pipeline?count=${count}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch full pipeline data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in fetchFullPipelineData:', error);
        throw error;
    }
}

export async function fetchDeepDiveData(articleTitle: string) {
    try {
        const response = await fetch(`${BASE_URL}/news/deep-dive?article_title=${articleTitle}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch deep dive data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in fetchDeepDiveData:', error);
        throw error;
    }
}
