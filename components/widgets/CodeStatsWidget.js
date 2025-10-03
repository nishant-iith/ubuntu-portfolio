import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * CodeStats Widget - Draggable coding statistics widget
 * Displays real-time stats from CodeForces, LeetCode, and GitHub
 * Features: Expandable view, drag & drop, persistent position, error handling
 */
const CodeStatsWidget = () => {
    // State management
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [data, setData] = useState({
        codeforces: null,
        leetcode: null,
        github: null
    });
    const [errors, setErrors] = useState({
        codeforces: null,
        leetcode: null,
        github: null
    });
    const [lastUpdated, setLastUpdated] = useState(null);
    const [position, setPosition] = useState({ x: 15, y: 50 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const widgetRef = useRef(null);
    const dataIntervalRef = useRef(null);

    /**
     * Fetch CodeForces data using real API
     */
    const fetchCodeforcesData = useCallback(async () => {
        try {
            const handle = 'so-called-iitian';
            const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status !== 'OK') {
                throw new Error(data.comment || 'Unknown error');
            }

            const user = data.result[0];

            // Fetch submissions for problem count
            const submissionsResponse = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
            let problemsSolved = 0;

            if (submissionsResponse.ok) {
                const submissionsData = await submissionsResponse.json();
                if (submissionsData.status === 'OK') {
                    const acceptedSubmissions = submissionsData.result.filter(sub => sub.verdict === 'OK');
                    const uniqueProblems = new Set();
                    acceptedSubmissions.forEach(sub => {
                        const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                        uniqueProblems.add(problemId);
                    });
                    problemsSolved = uniqueProblems.size;
                }
            }

            return {
                rating: user.rating || 'Unrated',
                rank: user.rank || 'Unrated',
                handle: user.handle,
                problemsSolved,
                maxRating: user.maxRating || user.rating,
            };
        } catch (error) {
            console.warn('CodeForces fetch failed:', error);
            throw error;
        }
    }, []);

    /**
     * Fetch LeetCode data using API proxy
     */
    const fetchLeetcodeData = useCallback(async () => {
        try {
            const username = 'Nishant-iith';
            const response = await fetch(`/api/leetcode?username=${username}`);

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('LeetCode API proxy failed:', error);
            throw error;
        }
    }, []);

    /**
     * Fetch GitHub data using GitHub API
     */
    const fetchGithubData = useCallback(async () => {
        try {
            const username = 'nishant-iith';
            const userResponse = await fetch(`https://api.github.com/users/${username}`);

            if (!userResponse.ok) {
                throw new Error(`GitHub API error: ${userResponse.status}`);
            }

            const userData = await userResponse.json();
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=30&sort=updated`);

            if (!reposResponse.ok) {
                throw new Error(`GitHub API error: ${reposResponse.status}`);
            }

            const repos = await reposResponse.json();
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

            return {
                username: userData.login,
                publicRepos: userData.public_repos,
                followers: userData.followers,
                totalStars,
            };
        } catch (error) {
            console.warn('GitHub fetch failed:', error);
            throw error;
        }
    }, []);

    /**
     * Fetch all data from APIs
     */
    const fetchAllData = useCallback(async () => {
        // Don't fetch if minimized to save API calls
        if (isMinimized) return;

        setIsLoading(true);
        const newErrors = { codeforces: null, leetcode: null, github: null };

        try {
            const [codeforcesResult, leetcodeResult, githubResult] = await Promise.allSettled([
                fetchCodeforcesData(),
                fetchLeetcodeData(),
                fetchGithubData()
            ]);

            setData({
                codeforces: codeforcesResult.status === 'fulfilled' ? codeforcesResult.value : null,
                leetcode: leetcodeResult.status === 'fulfilled' ? leetcodeResult.value : null,
                github: githubResult.status === 'fulfilled' ? githubResult.value : null
            });

            if (codeforcesResult.status === 'rejected') {
                newErrors.codeforces = 'Failed to load';
            }
            if (leetcodeResult.status === 'rejected') {
                newErrors.leetcode = 'Failed to load';
            }
            if (githubResult.status === 'rejected') {
                newErrors.github = 'Failed to load';
            }

            setErrors(newErrors);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchCodeforcesData, fetchLeetcodeData, fetchGithubData, isMinimized]);

    /**
     * Mouse event handlers for dragging
     */
    const handleMouseDown = useCallback((e) => {
        // Only allow dragging from the header area
        if (e.target.closest('.drag-handle')) {
            const rect = widgetRef.current.getBoundingClientRect();
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            e.preventDefault();
        }
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return;

        const widgetWidth = isExpanded ? window.innerWidth * 0.7 : window.innerWidth * 0.2;
        const widgetHeight = isExpanded ? window.innerHeight * 0.7 : window.innerHeight * 0.4;

        let newX = e.clientX - dragOffset.x;
        let newY = e.clientY - dragOffset.y;

        // Constrain to window bounds
        const maxX = window.innerWidth - widgetWidth;
        const maxY = window.innerHeight - widgetHeight;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setPosition({ x: newX, y: newY });
    }, [isDragging, dragOffset, isExpanded]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            // Save position to localStorage
            localStorage.setItem('codeStatsWidgetPosition', JSON.stringify(position));
        }
    }, [isDragging, position]);

    /**
     * Setup and cleanup effects
     */
    // Load saved position from localStorage on mount (client-side only)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('codeStatsWidgetPosition');
            if (saved) {
                try {
                    const savedPosition = JSON.parse(saved);
                    setPosition(savedPosition);
                } catch (e) {
                    console.error('Failed to parse saved position:', e);
                }
            }
        }
    }, []); // Only run once on mount

    useEffect(() => {
        fetchAllData();

        // Update data every 30 minutes only if not minimized
        dataIntervalRef.current = setInterval(() => {
            if (!isMinimized) {
                fetchAllData();
            }
        }, 30 * 60 * 1000);

        return () => {
            if (dataIntervalRef.current) {
                clearInterval(dataIntervalRef.current);
            }
        };
    }, [fetchAllData, isMinimized]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    /**
     * Helper functions
     */
    const getRatingColor = (platform, rating) => {
        if (platform === 'codeforces') {
            if (rating >= 2100) return 'text-red-400';
            if (rating >= 1900) return 'text-purple-400';
            if (rating >= 1600) return 'text-blue-400';
            if (rating >= 1400) return 'text-cyan-400';
            if (rating >= 1200) return 'text-green-400';
            return 'text-gray-400';
        }
        return 'text-white';
    };

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleRefresh = () => {
        fetchAllData();
    };

    /**
     * Render compact widget view
     */
    const renderCompactWidget = () => (
        <div className="w-full h-full bg-gradient-to-br from-ub-grey to-ub-drk-abrgn backdrop-blur-lg rounded-lg border border-gray-700/60 shadow-2xl overflow-hidden flex flex-col">
            {/* Header - Drag Handle */}
            <div className="drag-handle bg-ub-window-title px-3 py-2 flex items-center justify-between border-b border-gray-600 cursor-move" aria-label="Drag to move widget">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-ub-orange rounded-full"></div>
                    <span className="text-white text-sm font-semibold">CodeStats</span>
                    <div className="flex items-center space-x-1 ml-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-300">Live</span>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={handleRefresh}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        disabled={isLoading}
                        aria-label="Refresh data"
                        title="Refresh data"
                    >
                        <svg className={`w-3.5 h-3.5 text-gray-300 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button
                        onClick={toggleMinimize}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label="Minimize widget"
                        title="Minimize"
                    >
                        <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-hidden">
                {isLoading && !data.codeforces ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-ub-orange/30 border-t-ub-orange"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full justify-between space-y-3">
                        {/* CodeForces */}
                        <div className="bg-gradient-to-r from-blue-500/15 to-blue-600/10 rounded-lg p-3 border border-blue-500/30 hover:border-blue-400/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L3.09 8.26L4 21h16L20.91 8.26L12 2z"/>
                                    </svg>
                                    <span className="text-blue-200 text-sm font-medium">CodeForces</span>
                                </div>
                                <div className="text-right">
                                    {errors.codeforces ? (
                                        <span className="text-xs text-red-400">Error</span>
                                    ) : (
                                        <>
                                            <div className={`text-lg font-bold ${getRatingColor('codeforces', data.codeforces?.rating)}`}>
                                                {data.codeforces?.rating || '?'}
                                            </div>
                                            <div className="text-blue-300 text-xs capitalize">
                                                {data.codeforces?.rank || 'Unrated'}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* LeetCode */}
                        <div className="bg-gradient-to-r from-orange-500/15 to-red-500/10 rounded-lg p-3 border border-orange-500/30 hover:border-orange-400/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.814 2.133 8.038-.074l3.927-3.954c2.165-2.165 2.165-5.677 0-7.842L13.483 0z"/>
                                    </svg>
                                    <span className="text-orange-200 text-sm font-medium">LeetCode</span>
                                </div>
                                <div className="text-right">
                                    {errors.leetcode ? (
                                        <span className="text-xs text-red-400">Error</span>
                                    ) : (
                                        <>
                                            <div className="text-emerald-400 text-lg font-bold">
                                                {data.leetcode?.totalSolved || '?'}
                                            </div>
                                            <div className="text-orange-300 text-xs">
                                                Problems
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* GitHub */}
                        <div className="bg-gradient-to-r from-gray-600/15 to-gray-700/10 rounded-lg p-3 border border-gray-500/30 hover:border-gray-400/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    <span className="text-gray-200 text-sm font-medium">GitHub</span>
                                </div>
                                <div className="text-right">
                                    {errors.github ? (
                                        <span className="text-xs text-red-400">Error</span>
                                    ) : (
                                        <>
                                            <div className="text-cyan-400 text-lg font-bold">
                                                {data.github?.publicRepos || '?'}
                                            </div>
                                            <div className="text-gray-300 text-xs">
                                                Repos
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - Expand Button */}
            <div className="px-4 pb-3 pt-1">
                <button
                    onClick={toggleExpansion}
                    className="w-full bg-ub-orange/80 hover:bg-ub-orange text-white px-3 py-2 rounded transition-all flex items-center justify-center space-x-2 font-medium text-sm"
                    aria-label="Expand widget to see more details"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>Expand</span>
                </button>
            </div>
        </div>
    );

    /**
     * Render expanded widget view
     */
    const renderExpandedWidget = () => (
        <div className="w-full h-full bg-ub-cool-grey rounded-lg overflow-hidden shadow-2xl border border-gray-700 flex flex-col">
            {/* Header - Drag Handle */}
            <div className="drag-handle bg-ub-window-title px-4 py-3 flex items-center justify-between border-b border-gray-600 cursor-move">
                <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-ub-orange rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-white font-semibold">Coding Statistics</h2>
                        <p className="text-gray-300 text-xs">
                            {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleRefresh}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all"
                        disabled={isLoading}
                        aria-label="Refresh data"
                        title="Refresh"
                    >
                        <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button
                        onClick={toggleExpansion}
                        className="p-2 text-gray-400 hover:text-ub-orange hover:bg-ub-orange/10 rounded transition-all"
                        aria-label="Collapse widget"
                        title="Collapse"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100% - 60px)' }}>
                {isLoading && !data.codeforces ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 border-4 border-ub-orange/20 border-t-ub-orange rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400">Fetching coding statistics...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* CodeForces Card */}
                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-400 text-sm font-medium">CodeForces</p>
                                        {errors.codeforces ? (
                                            <p className="text-red-400 text-sm mt-1">Failed to load</p>
                                        ) : (
                                            <>
                                                <p className="text-2xl font-bold text-white mt-1">{data.codeforces?.rating || '?'}</p>
                                                <p className="text-blue-300 text-xs capitalize">{data.codeforces?.rank || 'Unrated'}</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L3.09 8.26L4 21h16L20.91 8.26L12 2z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* LeetCode Card */}
                            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-xl p-4 border border-orange-500/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-400 text-sm font-medium">LeetCode</p>
                                        {errors.leetcode ? (
                                            <p className="text-red-400 text-sm mt-1">Failed to load</p>
                                        ) : (
                                            <>
                                                <p className="text-2xl font-bold text-white mt-1">{data.leetcode?.totalSolved || 0}</p>
                                                <p className="text-orange-300 text-xs">Problems Solved</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-7 h-7 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.814 2.133 8.038-.074l3.927-3.954c2.165-2.165 2.165-5.677 0-7.842L13.483 0z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* GitHub Card */}
                            <div className="bg-gradient-to-br from-gray-600/20 to-gray-700/10 rounded-xl p-4 border border-gray-600/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium">GitHub</p>
                                        {errors.github ? (
                                            <p className="text-red-400 text-sm mt-1">Failed to load</p>
                                        ) : (
                                            <>
                                                <p className="text-2xl font-bold text-white mt-1">{data.github?.publicRepos || 0}</p>
                                                <p className="text-gray-300 text-xs">Repositories</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="w-12 h-12 bg-gray-600/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-7 h-7 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Platform Sections */}
                        <div className="space-y-4">
                            {/* CodeForces Detailed Section */}
                            {!errors.codeforces && data.codeforces && (
                                <div className="bg-ub-drk-abrgn/80 rounded-xl border border-gray-600/30 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 px-4 py-3 border-b border-gray-600/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2L3.09 8.26L4 21h16L20.91 8.26L12 2z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">CodeForces</h3>
                                                    <p className="text-blue-400 text-xs">Competitive Programming</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-blue-400">{data.codeforces.rating}</div>
                                                <div className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-medium capitalize border border-green-400/30">
                                                    {data.codeforces.rank}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-lg p-3 text-center border border-emerald-500/20">
                                                <div className="text-xl font-bold text-emerald-400">{data.codeforces.problemsSolved}</div>
                                                <div className="text-emerald-300 text-xs mt-1">Problems Solved</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-lg p-3 text-center border border-cyan-500/20">
                                                <div className="text-sm font-bold text-cyan-400">@{data.codeforces.handle}</div>
                                                <div className="text-cyan-300 text-xs mt-1">Handle</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* LeetCode Detailed Section */}
                            {!errors.leetcode && data.leetcode && (
                                <div className="bg-ub-drk-abrgn/80 rounded-xl border border-gray-600/30 overflow-hidden">
                                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/5 px-4 py-3 border-b border-gray-600/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.814 2.133 8.038-.074l3.927-3.954c2.165-2.165 2.165-5.677 0-7.842L13.483 0z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">LeetCode</h3>
                                                    <p className="text-orange-400 text-xs">Problem Solving</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-orange-400">{data.leetcode.totalSolved}</div>
                                                <div className="text-orange-300 text-xs">Rating: {data.leetcode.contestRating || 'N/A'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-3 text-center border border-green-500/30">
                                                <div className="text-lg font-bold text-green-400">{data.leetcode.easy || 0}</div>
                                                <div className="text-green-300 text-xs mt-1">Easy</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg p-3 text-center border border-yellow-500/30">
                                                <div className="text-lg font-bold text-yellow-400">{data.leetcode.medium || 0}</div>
                                                <div className="text-yellow-300 text-xs mt-1">Medium</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-lg p-3 text-center border border-red-500/30">
                                                <div className="text-lg font-bold text-red-400">{data.leetcode.hard || 0}</div>
                                                <div className="text-red-300 text-xs mt-1">Hard</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GitHub Detailed Section */}
                            {!errors.github && data.github && (
                                <div className="bg-ub-drk-abrgn/80 rounded-xl border border-gray-600/30 overflow-hidden">
                                    <div className="bg-gradient-to-r from-gray-700/10 to-gray-800/5 px-4 py-3 border-b border-gray-600/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-semibold">GitHub</h3>
                                                    <p className="text-gray-400 text-xs">Open Source</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-gray-300">{data.github.publicRepos}</div>
                                                <div className="text-gray-400 text-xs">@{data.github.username}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg p-3 text-center border border-blue-500/20">
                                                <div className="text-lg font-bold text-blue-400">{data.github.followers}</div>
                                                <div className="text-blue-300 text-xs mt-1">Followers</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-lg p-3 text-center border border-yellow-500/20">
                                                <div className="text-lg font-bold text-yellow-400">{data.github.totalStars}</div>
                                                <div className="text-yellow-300 text-xs mt-1">Total Stars</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Don't render if minimized
    if (isMinimized) {
        return (
            <button
                onClick={toggleMinimize}
                className="fixed bottom-4 left-4 z-20 bg-ub-orange hover:bg-ub-orange/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 transition-all"
                aria-label="Show CodeStats widget"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                <span className="text-sm font-medium">CodeStats</span>
            </button>
        );
    }

    // Responsive size classes
    const sizeClass = isExpanded
        ? 'w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] h-[85vh] sm:h-[80vh] md:h-[75vh]'
        : 'w-[280px] sm:w-[300px] h-[340px] sm:h-[360px]';

    const positionStyle = isExpanded
        ? {
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
        }
        : {
            left: `${position.x}px`,
            top: `${position.y}px`,
        };

    return (
        <div
            ref={widgetRef}
            className={`fixed z-20 ${sizeClass} ${isDragging ? 'select-none cursor-grabbing' : ''} transition-all duration-300 ease-out`}
            style={positionStyle}
            onMouseDown={handleMouseDown}
            role="dialog"
            aria-label="Coding statistics widget"
        >
            {isExpanded ? renderExpandedWidget() : renderCompactWidget()}
        </div>
    );
};

CodeStatsWidget.propTypes = {};

export default CodeStatsWidget;
