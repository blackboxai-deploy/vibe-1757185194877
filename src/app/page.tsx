"use client";

import { AppProvider } from '@/contexts/AppContext';
import TabNavigation from '@/components/TabNavigation';

export default function Home() {
  return (
    <AppProvider>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <TabNavigation />
      </main>
    </AppProvider>
  );
}