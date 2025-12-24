import { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, TrendingUp } from 'lucide-react';

const leaderboardData = [
  { 
    id: 1, 
    name: 'Sarah Chen', 
    avatar: 'SC', 
    points: 12850, 
    streak: 45,
    level: 'Diamond',
    change: 2 
  },
  { 
    id: 2, 
    name: 'Alex Rivera', 
    avatar: 'AR', 
    points: 11920, 
    streak: 32,
    level: 'Platinum',
    change: -1 
  },
  { 
    id: 3, 
    name: 'Jordan Lee', 
    avatar: 'JL', 
    points: 10540, 
    streak: 28,
    level: 'Platinum',
    change: 1 
  },
  { 
    id: 4, 
    name: 'Maya Patel', 
    avatar: 'MP', 
    points: 9870, 
    streak: 21,
    level: 'Gold',
    change: 3 
  },
  { 
    id: 5, 
    name: 'Chris Morgan', 
    avatar: 'CM', 
    points: 9450, 
    streak: 18,
    level: 'Gold',
    change: 0 
  },
];

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

const LeaderboardSection = () => {
  const [animatedPoints, setAnimatedPoints] = useState<number[]>([]);

  useEffect(() => {
    // Animate points counting up
    const intervals = leaderboardData.map((user, index) => {
      let current = 0;
      const target = user.points;
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
  }, []);

  return (
    <section id="leaderboard" className="relative py-24 px-4">
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
            {leaderboardData.map((user, index) => (
              <div
                key={user.id}
                className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-muted/50 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400/10 to-transparent' : ''
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
                    {user.avatar}
                  </div>
                  {user.streak > 20 && (
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
                      {user.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-accent" />
                      {user.streak} day streak
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="font-display font-bold text-xl gradient-text">
                    {(animatedPoints[index] || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs">
                    {user.change > 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-secondary" />
                        <span className="text-secondary">+{user.change}</span>
                      </>
                    ) : user.change < 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-destructive rotate-180" />
                        <span className="text-destructive">{user.change}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-1000"
                    style={{ width: `${(user.points / 15000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
