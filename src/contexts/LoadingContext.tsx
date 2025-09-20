'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FullPageLoading } from '@/components/loading/LoadingStates';

interface LoadingState {
  id: string;
  message: string;
  progress?: number;
}

interface LoadingContextType {
  isLoading: boolean;
  loadingStates: LoadingState[];
  startLoading: (id: string, message?: string) => void;
  updateLoading: (id: string, message?: string, progress?: number) => void;
  stopLoading: (id: string) => void;
  stopAllLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);

  const startLoading = useCallback((id: string, message = 'Loading...') => {
    setLoadingStates(prev => {
      // Remove any existing loading state with the same id
      const filtered = prev.filter(state => state.id !== id);
      return [...filtered, { id, message }];
    });
  }, []);

  const updateLoading = useCallback((id: string, message?: string, progress?: number) => {
    setLoadingStates(prev => 
      prev.map(state => 
        state.id === id 
          ? { ...state, ...(message && { message }), ...(progress !== undefined && { progress }) }
          : state
      )
    );
  }, []);

  const stopLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id));
  }, []);

  const stopAllLoading = useCallback(() => {
    setLoadingStates([]);
  }, []);

  const isLoading = loadingStates.length > 0;
  const currentLoadingState = loadingStates[loadingStates.length - 1]; // Show the most recent loading state

  const value: LoadingContextType = {
    isLoading,
    loadingStates,
    startLoading,
    updateLoading,
    stopLoading,
    stopAllLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && currentLoadingState && (
        <FullPageLoading
          message={currentLoadingState.message}
          progress={currentLoadingState.progress}
          showProgress={currentLoadingState.progress !== undefined}
        />
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Hook for managing a specific loading state
export function useLoadingState(id: string) {
  const { startLoading, updateLoading, stopLoading } = useLoading();

  const start = useCallback((message?: string) => {
    startLoading(id, message);
  }, [id, startLoading]);

  const update = useCallback((message?: string, progress?: number) => {
    updateLoading(id, message, progress);
  }, [id, updateLoading]);

  const stop = useCallback(() => {
    stopLoading(id);
  }, [id, stopLoading]);

  return { start, update, stop };
}