'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import MoodFormPage from './MoodFormPage';
import SpinnerLoading from '@/ui/components/components/SpinnerLoader';

export function MoodFormGuard({ children }: { children: React.ReactNode }) {
  const [shouldShowForm, setShouldShowForm] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const today = new Date().toDateString();
    const formSend = localStorage.getItem('formSend');
  
    if (formSend=== today) {
      setShouldShowForm(false);
    } else {
      setShouldShowForm(true);
    }

  }, [pathname,router]);

  if (shouldShowForm === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SpinnerLoading/>
      </div>
    );
  }
  
  return shouldShowForm ? <MoodFormPage /> : children;
}