import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

export interface ChatHistoryEntry {
  id: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

interface UseChatHistoryOptions {
  pageSize?: number;
  storageKey?: string;
}

/**
 * Custom hook for managing chat history with pagination and search
 * Handles local state and future database integration
 */
export const useChatHistory = (options: UseChatHistoryOptions = {}) => {
  const { pageSize = 25, storageKey = 'chatbot_history' } = options;

  const [history, setHistory] = useState<ChatHistoryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load history from localStorage (temporary, will integrate with DB)
  useEffect(() => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  // Persist history to localStorage
  const saveHistory = useCallback(
    (entries: ChatHistoryEntry[]) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(entries));
        setHistory(entries);
      } catch (err) {
        console.error('Failed to save chat history:', err);
        toast.error('Failed to save history');
      }
    },
    [storageKey]
  );

  // Add new conversation to history
  const addEntry = useCallback(
    (messages: ChatHistoryEntry['messages'], title?: string) => {
      const entry: ChatHistoryEntry = {
        id: `chat-${Date.now()}`,
        messages,
        createdAt: new Date(),
        updatedAt: new Date(),
        title:
          title ||
          messages
            .find((m) => m.role === 'user')
            ?.content.substring(0, 50) + '...',
      };
      saveHistory([entry, ...history]);
      return entry;
    },
    [history, saveHistory]
  );

  // Delete entry
  const deleteEntry = useCallback(
    (id: string) => {
      saveHistory(history.filter((e) => e.id !== id));
      toast.success('Conversation deleted');
    },
    [history, saveHistory]
  );

  // Search history
  const searchHistory = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      if (!query.trim()) return history;

      const lowerQuery = query.toLowerCase();
      return history.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(lowerQuery) ||
          entry.messages.some((m) =>
            m.content.toLowerCase().includes(lowerQuery)
          )
      );
    },
    [history]
  );

  // Get paginated results
  const getPaginatedResults = useCallback(() => {
    const results = searchQuery ? searchHistory(searchQuery) : history;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return {
      entries: results.slice(start, end),
      total: results.length,
      totalPages: Math.ceil(results.length / pageSize),
      currentPage,
      hasMore: end < results.length,
    };
  }, [history, searchQuery, currentPage, pageSize, searchHistory]);

  // Export as JSON
  const exportAsJSON = useCallback(() => {
    const data = JSON.stringify(history, null, 2);
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(data)
    );
    element.setAttribute('download', `chat-history-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('History exported as JSON');
  }, [history]);

  // Export as CSV
  const exportAsCSV = useCallback(() => {
    let csv = 'Timestamp,Role,Message\n';
    history.forEach((entry) => {
      entry.messages.forEach((msg) => {
        const content = msg.content.replace(/"/g, '""');
        csv += `"${entry.createdAt}","${msg.role}","${content}"\n`;
      });
    });

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    );
    element.setAttribute('download', `chat-history-${Date.now()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('History exported as CSV');
  }, [history]);

  // Export to PDF (requires jsPDF - will add if needed)
  const exportAsPDF = useCallback(async () => {
    toast.info('PDF export coming soon');
  }, []);

  // Clear all history
  const clearAll = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear all chat history? This cannot be undone.'
      )
    ) {
      saveHistory([]);
      setCurrentPage(1);
      toast.success('All history cleared');
    }
  }, [saveHistory]);

  return {
    history,
    currentPage,
    setCurrentPage,
    isLoading,
    searchQuery,
    addEntry,
    deleteEntry,
    searchHistory,
    getPaginatedResults,
    exportAsJSON,
    exportAsCSV,
    exportAsPDF,
    clearAll,
  };
};
