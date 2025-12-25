import { supabase } from '@/lib/supabase';
import { questionBank, type QuestionBankItem } from '@/data/questionBank';
import type { AptitudeQuestion } from './aiService';

/**
 * Get the daily question from the question bank
 * Uses date-based rotation to ensure same question for all users on a given day
 */
export const getDailyQuestion = async (): Promise<AptitudeQuestion | null> => {
    try {
        // Get today's date and calculate day number since epoch
        const today = new Date();
        const epochStart = new Date('2025-01-01'); // Reference date
        const daysSinceEpoch = Math.floor((today.getTime() - epochStart.getTime()) / (1000 * 60 * 60 * 24));

        // Use modulo to cycle through questions (100 questions in bank)
        const questionIndex = daysSinceEpoch % questionBank.length;
        const todayQuestion = questionBank[questionIndex];

        // Convert to AptitudeQuestion format
        const question: AptitudeQuestion = {
            question: todayQuestion.question,
            options: todayQuestion.options,
            correct_answer: todayQuestion.correct_answer,
            explanation: todayQuestion.explanation,
            difficulty: todayQuestion.difficulty,
            subject: todayQuestion.subject,
        };

        return question;
    } catch (error) {
        console.error('Error in getDailyQuestion:', error);
        return null;
    }
};

/**
 * Submit an answer to the daily question
 * Returns whether the answer was correct and points earned
 */
export const submitAnswer = async (
    questionId: string,
    selectedAnswer: string,
    correctAnswer: string,
    difficulty: string,
    userId?: string
): Promise<{ isCorrect: boolean; pointsEarned: number }> => {
    const isCorrect = selectedAnswer === correctAnswer;

    // Calculate points based on difficulty
    let pointsEarned = 0;
    if (isCorrect) {
        switch (difficulty) {
            case 'easy':
                pointsEarned = 5;
                break;
            case 'medium':
                pointsEarned = 10;
                break;
            case 'hard':
                pointsEarned = 15;
                break;
            default:
                pointsEarned = 5;
        }
    }

    // If user is logged in, update their points and record the answer
    if (userId) {
        try {
            // Update user points
            const { data: currentUser } = await supabase
                .from('users')
                .select('points, streak_days')
                .eq('id', userId)
                .maybeSingle();

            if (currentUser) {
                const newPoints = (currentUser.points || 0) + pointsEarned;
                const newStreak = isCorrect ? (currentUser.streak_days || 0) + 1 : 0;

                await supabase
                    .from('users')
                    .update({
                        points: newPoints,
                        streak_days: newStreak
                    })
                    .eq('id', userId);
            }
        } catch (error) {
            console.error('Error updating user points:', error);
        }
    }

    return { isCorrect, pointsEarned };
};

/**
 * Get user statistics (points, streak, rank)
 */
export const getUserStats = async (userId: string) => {
    try {
        const { data: user } = await supabase
            .from('users')
            .select('points, streak_days')
            .eq('id', userId)
            .maybeSingle();

        if (!user) {
            return { points: 0, streak: 0, rank: null };
        }

        // Get user's rank
        const { data: allUsers } = await supabase
            .from('users')
            .select('id, points')
            .order('points', { ascending: false });

        const rank = allUsers ? allUsers.findIndex(u => u.id === userId) + 1 : null;

        return {
            points: user.points || 0,
            streak: user.streak_days || 0,
            rank,
        };
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return { points: 0, streak: 0, rank: null };
    }
};

/**
 * Get top users for leaderboard
 */
export const getTopUsers = async (limit: number = 5) => {
    try {
        const { data: topUsers } = await supabase
            .from('users')
            .select('name, points, streak_days')
            .order('points', { ascending: false })
            .limit(limit);

        return topUsers || [];
    } catch (error) {
        console.error('Error fetching top users:', error);
        return [];
    }
};
