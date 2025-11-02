import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllProblems,
  fetchSolvedProblems,
  markProblemSolved,
  invalidateCache,
} from '@/store/slices/problemsSlice';

/**
 * Custom hook for problems management
 * @returns {object} Problems state and methods
 */
export const useProblems = () => {
  const dispatch = useDispatch();
  
  const {
    problems,
    solvedProblems,
    loading,
    error,
  } = useSelector((state) => state.problems);

  /**
   * Fetch all problems from API
   */
  const loadProblems = () => {
    dispatch(fetchAllProblems());
  };

  /**
   * Fetch solved problems for current user
   */
  const loadSolvedProblems = () => {
    dispatch(fetchSolvedProblems());
  };

  /**
   * Mark a problem as solved (optimistic update)
   * @param {string} problemId - Problem ID
   */
  const markAsSolved = (problemId) => {
    dispatch(markProblemSolved(problemId));
  };

  /**
   * Force refresh problems by invalidating cache
   */
  const refreshProblems = () => {
    dispatch(invalidateCache());
    loadProblems();
    loadSolvedProblems();
  };

  /**
   * Check if a problem is solved
   * @param {string} problemId - Problem ID
   * @returns {boolean} Whether problem is solved
   */
  const isProblemSolved = (problemId) => {
    return solvedProblems.includes(problemId);
  };

  /**
   * Get problems by difficulty
   * @param {string} difficulty - Difficulty level
   * @returns {Array} Filtered problems
   */
  const getProblemsByDifficulty = (difficulty) => {
    return problems.filter(
      (p) => p.difficulty?.toLowerCase() === difficulty.toLowerCase()
    );
  };

  // Auto-load problems on mount
  useEffect(() => {
    if (problems.length === 0) {
      loadProblems();
      loadSolvedProblems();
    }
  }, []);

  return {
    problems,
    solvedProblems,
    loading,
    error,
    loadProblems,
    loadSolvedProblems,
    markAsSolved,
    refreshProblems,
    isProblemSolved,
    getProblemsByDifficulty,
  };
};
