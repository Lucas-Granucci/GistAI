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