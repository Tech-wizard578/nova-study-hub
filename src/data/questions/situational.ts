import { QuestionBankItem } from '../types';

export const situationalQuestions: QuestionBankItem[] = [
    {
        id: 5001,
        subject: 'Situational Judgement',
        question: 'You notice a colleague stealing office supplies. What do you do?',
        options: ['Ignore it', 'Confront them publicly', 'Report to supervisor privately', 'Join them'],
        correct_answer: 'Report to supervisor privately',
        explanation: 'Professional integrity requires reporting misconduct through appropriate channels.',
        difficulty: 'medium'
    },
    {
        id: 5002,
        subject: 'Situational Judgement',
        question: 'A customer is angry about a product defect. How do you respond?',
        options: ['Argue with them', 'Apologize and offer a solution', 'Ignore them', 'Tell them it\'s not your fault'],
        correct_answer: 'Apologize and offer a solution',
        explanation: 'Customer service requires de-escalation and problem solving.',
        difficulty: 'easy'
    },
    {
        id: 5003,
        subject: 'Situational Judgement',
        question: 'You have a tight deadline but a team member asks for help. What do you do?',
        options: ['Refuse rudely', 'Help them and miss your deadline', 'Explain your situation and schedule a later time', 'Ignore them'],
        correct_answer: 'Explain your situation and schedule a later time',
        explanation: 'Balancing own responsibilities with teamwork is key.',
        difficulty: 'medium'
    },
    {
        id: 5004,
        subject: 'Situational Judgement',
        question: 'You discover a major bug in production right before leaving for the weekend.',
        options: ['Leave it for Monday', 'Fix it immediately or notify the team', 'Pretend you didn\'t see it', 'Blame someone else'],
        correct_answer: 'Fix it immediately or notify the team',
        explanation: 'Critical issues require immediate attention or escalation.',
        difficulty: 'hard'
    },
    {
        id: 5005,
        subject: 'Situational Judgement',
        question: 'Your boss gives you contradictory instructions.',
        options: ['Do nothing', 'Guess which one is right', 'Clarify with the boss', 'Ask a colleague'],
        correct_answer: 'Clarify with the boss',
        explanation: 'Communication is essential to avoid errors.',
        difficulty: 'easy'
    },
    {
        id: 5006,
        subject: 'Situational Judgement',
        question: 'You see a safety hazard in the workplace.',
        options: ['Walk past it', 'Report it immediately', 'Fix it yourself even if dangerous', 'Wait for someone else to see it'],
        correct_answer: 'Report it immediately',
        explanation: 'Safety is a collective responsibility.',
        difficulty: 'easy'
    },
    {
        id: 5007,
        subject: 'Situational Judgement',
        question: 'A client asks for a feature that is not in the contract.',
        options: ['Do it for free', 'Refuse immediately', 'Discuss with manager/Check contract scope', 'Promise to do it later'],
        correct_answer: 'Discuss with manager/Check contract scope',
        explanation: 'Scope management prevents scope creep.',
        difficulty: 'medium'
    },
    {
        id: 5008,
        subject: 'Situational Judgement',
        question: 'You made a mistake that caused data loss.',
        options: ['Hide it', 'Admit it immediately and work on recovery', 'Blame the system', 'Quit'],
        correct_answer: 'Admit it immediately and work on recovery',
        explanation: 'Honesty and accountability are valued.',
        difficulty: 'hard'
    },
    {
        id: 5009,
        subject: 'Situational Judgement',
        question: 'Two team members are arguing loudly.',
        options: ['Join the argument', 'Ignore them', 'Try to mediate or ask them to take it elsewhere', 'Record it'],
        correct_answer: 'Try to mediate or ask them to take it elsewhere',
        explanation: 'Maintaining a professional environment is important.',
        difficulty: 'medium'
    },
    {
        id: 5010,
        subject: 'Situational Judgement',
        question: 'You finish your work early.',
        options: ['Go home', 'Ask for more work or help others', 'Play games', 'Sleep'],
        correct_answer: 'Ask for more work or help others',
        explanation: 'Proactivity demonstrates dedication.',
        difficulty: 'easy'
    }
];
