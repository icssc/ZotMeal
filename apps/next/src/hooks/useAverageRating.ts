import { useState, useEffect, useCallback } from 'react';

export function useAverageRating(foodName: string) {
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user rating from localStorage
  useEffect(() => {
    const storedRating = localStorage.getItem(`rating_${foodName}`);
    if (storedRating) {
      setUserRating(parseFloat(storedRating));
    }
  }, [foodName]);

  const fetchRating = useCallback(async () => {
    try {
      // Get the current localStorage rating before fetching
      const storedRating = localStorage.getItem(`rating_${foodName}`);
      
      const response = await fetch(`/api/ratings/average?foodName=${encodeURIComponent(foodName)}`);
      if (response.ok) {
        const data = await response.json();
        setAverageRating(data.averageRating || 0);
        setRatingCount(data.count || 0);
        
        //  preserve localStorage rating if it exists
        if (storedRating) {
          setUserRating(parseFloat(storedRating));
        } else if (data.userRating !== undefined && data.userRating !== null) {
          // Only use backend rating if no localStorage rating exists
          setUserRating(data.userRating);
          localStorage.setItem(`rating_${foodName}`, data.userRating.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    } finally {
      setIsLoading(false);
    }
  }, [foodName]);

  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const submitRating = async (stars: number) => {
    // update the UI and localStorage
    setUserRating(stars);
    localStorage.setItem(`rating_${foodName}`, stars.toString());
    
    try {
      const response = await fetch('/api/ratings/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodName,
          rating: stars,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // update average and count, but don't touch userRating
        setAverageRating(data.averageRating || 0);
        setRatingCount(data.count || 0);
        // Keep the userRating we just set
        setUserRating(stars);
      }
    } catch (error) {
      console.error('There was an error in submitting rating:', error);
      // Even on error, keep the rating locally
      // should we add a retry mechanism here?  
    }
  };

  return { averageRating, ratingCount, userRating, isLoading, submitRating };
}
