import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getClient } from '../lib/api-client';

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const tags = ['interpret:knowledge'];
    getClient()
      .queryBreadcrumbs({ tags, limit: 50 })
      .then((data: any) => {
        setArticles(Array.isArray(data) ? data : data?.breadcrumbs || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? articles.filter(
        (a) =>
          (a.title || '').toLowerCase().includes(query.toLowerCase()) ||
          (a.content?.content || '').toLowerCase().includes(query.toLowerCase())
      )
    : articles;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Knowledge Base</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-surface text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3 pb-20 md:pb-4">
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No articles found.</p>
        )}
        {filtered.map((article, i) => (
          <div
            key={article.breadcrumb_id || i}
            className="rounded-2xl border border-border p-4 hover:bg-muted/30 transition-colors"
          >
            <h3 className="text-sm font-medium text-foreground">{article.title || 'Untitled'}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {article.content?.content || article.content?.summary || 'No preview available.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
