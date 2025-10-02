/**
 * LeetCode API Proxy
 *
 * This serverless function acts as a proxy to fetch LeetCode user data
 * and bypass CORS restrictions in the browser.
 *
 * @param {string} username - LeetCode username
 * @returns {object} User statistics including problems solved, contest rating, etc.
 */
export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        const url = 'https://leetcode.com/graphql';

        // Comprehensive GraphQL query for user profile
        const query = `
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    realName
                    reputation
                    ranking
                }
                submitStats: submitStatsGlobal {
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
            }
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                topPercentage
            }
            recentSubmissionList(username: $username, limit: 20) {
                title
                timestamp
                statusDisplay
            }
        }`;

        const variables = { username };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://leetcode.com',
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        if (!response.ok) {
            throw new Error(`LeetCode API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.data || !data.data.matchedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = data.data.matchedUser;
        const contestRanking = data.data.userContestRanking;
        const recentSubmissions = data.data.recentSubmissionList || [];

        // Parse submission statistics
        const stats = user.submitStats.acSubmissionNum;
        const totalStats = stats.find(s => s.difficulty === 'All');
        const easyStats = stats.find(s => s.difficulty === 'Easy');
        const mediumStats = stats.find(s => s.difficulty === 'Medium');
        const hardStats = stats.find(s => s.difficulty === 'Hard');

        // Calculate recent activity (last 30 days)
        const thirtyDaysAgo = Date.now() / 1000 - (30 * 24 * 60 * 60);
        const recentAccepted = recentSubmissions.filter(sub =>
            parseInt(sub.timestamp) >= thirtyDaysAgo &&
            sub.statusDisplay === 'Accepted'
        ).length;

        const result = {
            totalSolved: totalStats ? totalStats.count : 0,
            easy: easyStats ? easyStats.count : 0,
            medium: mediumStats ? mediumStats.count : 0,
            hard: hardStats ? hardStats.count : 0,
            username: user.username,
            reputation: user.profile.reputation || 0,
            ranking: user.profile.ranking || null,
            contestRating: contestRanking ? Math.round(contestRanking.rating) : null,
            contestsAttended: contestRanking ? contestRanking.attendedContestsCount : 0,
            recentAccepted,
            totalSubmissions: totalStats ? totalStats.submissions : 0,
            realName: user.profile.realName,
            lastUpdated: new Date().toISOString()
        };

        // Cache for 30 minutes
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');

        return res.status(200).json(result);

    } catch (error) {
        console.error('LeetCode API error:', error);

        // Return fallback data with error flag
        return res.status(200).json({
            totalSolved: 349,
            easy: 93,
            medium: 195,
            hard: 61,
            username: username,
            reputation: 0,
            ranking: null,
            contestRating: 1500,
            contestsAttended: 8,
            recentAccepted: 9,
            totalSubmissions: 497,
            realName: 'Nishant',
            isFallback: true,
            error: error.message
        });
    }
}
