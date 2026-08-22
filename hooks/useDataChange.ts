'use client'

import { useEffect, useState, useCallback } from 'react';
export function useDateChange() {
  
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
  });

  const checkDateChange = useCallback(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const todayTimestamp = now.getTime();
    
    if (todayTimestamp !== currentDate) {

      setCurrentDate(todayTimestamp);

      window.dispatchEvent(new CustomEvent('dateChanged', { 
        detail: { newDate: todayTimestamp } 
      }));
      return true;
    }
    return false;
  }, [currentDate]);

  useEffect(() => {

    const interval = setInterval(checkDateChange, 60000);
    

    window.addEventListener('focus', checkDateChange);
    

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkDateChange();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkDateChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkDateChange]);

  return { currentDate, checkDateChange };
}