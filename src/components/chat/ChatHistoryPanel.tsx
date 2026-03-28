import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Trash2, 
  Download, 
  FileJson, 
  FileText,
  ExternalLink,
  Clock
} from 'lucide-react';
import { useChatHistory } from '@/hooks/useChatHistory';
import { toast } from 'sonner';

interface ChatHistoryPanelProps {
  onSelectHistory?: (messages: Array<{ role: 'user' | 'assistant'; content: string }>) => void;
  className?: string;
}

/**
 * Chat History Panel Component
 * Displays searchable chat history with export options
 */
export const ChatHistoryPanel = ({ onSelectHistory, className = '' }: ChatHistoryPanelProps) => {
  const {
    currentPage,
    setCurrentPage,
    isLoading,
    searchQuery,
    searchHistory,
    getPaginatedResults,
    deleteEntry,
    exportAsJSON,
    exportAsCSV,
    clearAll,
  } = useChatHistory({ pageSize: 10 });

  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const handleSearch = useCallback(
    (query: string) => {
      setLocalSearchQuery(query);
      searchHistory(query);
      setCurrentPage(1);
    },
    [searchHistory, setCurrentPage]
  );

  const results = getPaginatedResults();

  const handleSelectHistory = (id: string) => {
    const entry = results.entries.find(e => e.id === id);
    if (entry && onSelectHistory) {
      onSelectHistory(entry.messages);
      toast.success('Conversation loaded');
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  const getPreview = (messages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
    const lastUserMsg = messages.reverse().find(m => m.role === 'user');
    return lastUserMsg?.content.substring(0, 50) + '...' || 'No preview';
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-base">Chat History</CardTitle>
        <CardDescription>Search and manage conversations</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Search Bar */}
        <div className="p-3 border-b space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={localSearchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-1 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={exportAsJSON}
              className="h-7 text-xs"
              disabled={results.total === 0}
              title="Export as JSON"
            >
              <FileJson className="h-3 w-3 mr-1" />
              JSON
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportAsCSV}
              className="h-7 text-xs"
              disabled={results.total === 0}
              title="Export as CSV"
            >
              <FileText className="h-3 w-3 mr-1" />
              CSV
            </Button>
            {results.total > 0 && (
              <Button
                size="sm"
                variant="destructive"
                onClick={clearAll}
                className="h-7 text-xs ml-auto"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* Results Info */}
          {results.total > 0 && (
            <div className="text-xs text-muted-foreground">
              {results.total} conversation{results.total !== 1 ? 's' : ''} found
              {searchQuery && ` (filtered)`}
            </div>
          )}
        </div>

        {/* History List */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Loading history...
              </div>
            ) : results.entries.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {results.total === 0
                  ? 'No chat history yet'
                  : 'No results found'}
              </div>
            ) : (
              results.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-2 rounded border border-muted hover:border-primary/50 cursor-pointer transition-all hover:bg-accent/5 group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <button
                      onClick={() => handleSelectHistory(entry.id)}
                      className="flex-1 text-left hover:text-primary transition-colors"
                    >
                      <div className="font-medium text-xs line-clamp-2">
                        {entry.title || 'Untitled Conversation'}
                      </div>
                    </button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteEntry(entry.id)}
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {getPreview(entry.messages)}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {entry.messages.length} messages
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSelectHistory(entry.id)}
                      className="h-6 text-xs ml-auto"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Load
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {results.totalPages > 1 && (
          <div className="border-t p-3 flex items-center justify-between gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {results.currentPage} of {results.totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(Math.min(results.totalPages, currentPage + 1))}
              disabled={currentPage === results.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
