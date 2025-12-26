import { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  streak_days: number;
}

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return 'from-yellow-400 to-amber-600';
    case 2:
      return 'from-gray-300 to-gray-500';
    case 3:
      return 'from-amber-600 to-amber-800';
    default:
      return 'from-primary/50 to-primary/30';
  }
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
  if (rank <= 3) return <Medal className="w-5 h-5 text-gray-300" />;
  return <span className="text-muted-foreground font-bold">#{rank}</span>;
};

const getLevel = (points: number) => {
  if (points >= 100) return 'Diamond';
  if (points >= 50) return 'Platinum';
  if (points >= 20) return 'Gold';
  if (points >= 10) return 'Silver';
  return 'Bronze';
};

const getAvatar = (name: string) => {
  const words = name.split(' ');
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const LeaderboardSection = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [animatedPoints, setAnimatedPoints] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, points, streak_days')
        .order('points', { ascending: false })
        .limit(5);

      if (error) throw error;

      setLeaderboardData(data || []);
      setLoading(false);

      // Animate points counting up
      if (data) {
        const intervals = data.map((user, index) => {
          let current = 0;
          const target = user.points || 0;
          const increment = Math.ceil(target / 50);

          return setInterval(() => {
            current = Math.min(current + increment, target);
            setAnimatedPoints(prev => {
              const newPoints = [...prev];
              newPoints[index] = current;
              return newPoints;
            });

            if (current >= target) {
              clearInterval(intervals[index]);
            }
          }, 30);
        });

        return () => intervals.forEach(clearInterval);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  return (
    <section id="leaderboard" className="relative py-24 px-4" data-tour="leaderboard">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-muted-foreground">Top Learners</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Weekly{' '}
            <span className="gradient-text">Leaderboard</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compete with fellow students and climb the ranks. The more you study,
            the higher you score!
          </p>
        </div>

        {/* Leaderboard Card */}
        <div className="glass-card p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">Live Rankings</span>
            </div>
            <span className="text-xs text-muted-foreground">Updates every hour</span>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading leaderboard...
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users yet. Be the first to answer a question!
              </div>
            ) : (
              leaderboardData.map((user, index) => {
                const avatar = getAvatar(user.name);
                const level = getLevel(user.points || 0);
                const streak = user.streak_days || 0;

                return (
                  <div
                    key={user.id}
                    className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-muted/50 ${index === 0 ? 'bg-gradient-to-r from-yellow-400/10 to-transparent' : ''
                      }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Rank */}
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRankStyle(index + 1)} flex items-center justify-center`}>
                      {getRankIcon(index + 1)}
                    </div>

                    {/* Avatar */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankStyle(index + 1)} flex items-center justify-center text-primary-foreground font-bold`}>
                        {avatar}
                      </div>
                      {streak > 2 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                          <Flame className="w-3 h-3 text-accent-foreground" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{user.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                          {level}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-accent" />
                          {streak} day streak
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className="font-display font-bold text-xl gradient-text">
                        {(animatedPoints[index] || 0).toLocaleString()}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                        <span>pts</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-1000"
                        style={{ width: `${Math.min((user.points || 0) / 100 * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* View All */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <button className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              View Full Leaderboard →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;
