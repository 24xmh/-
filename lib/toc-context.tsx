"use client";

import { createContext, useContext, useState } from 'react';

interface Heading {
  id: string;
  text: string;
}

interface TocContextType {
  headings: Heading[];
  setHeadings: (headings: Heading[]) => void;
  activeHeading: string | null;
  setActiveHeading: (id: string | null) => void;
}

export const TocContext = createContext<TocContextType | undefined>(undefined);

export const TocProvider = ({ children }: { children: React.ReactNode }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);

  return (
    <TocContext.Provider value={{ headings, setHeadings, activeHeading, setActiveHeading }}>
      {children}
    </TocContext.Provider>
  );
};

export const useToc = () => {
  const context = useContext(TocContext);
  if (!context) throw new Error('useToc must be used within TocProvider');
  return context;
};