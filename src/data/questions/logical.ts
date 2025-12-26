import { QuestionBankItem } from '../types';

export const logicalQuestions: QuestionBankItem[] = [
    {
        id: 3001,
        subject: 'Logical Reasoning',
        question: 'If all roses are flowers and some flowers fade quickly, which statement must be true?',
        options: ['All roses fade quickly', 'Some roses fade quickly', 'No roses fade quickly', 'Some roses may fade quickly'],
        correct_answer: 'Some roses may fade quickly',
        explanation: 'Based on the premises, it is possible for some roses to fade quickly.',
        difficulty: 'easy'
    },
    {
        id: 3002,
        subject: 'Logical Reasoning',
        question: 'Find the odd one out: 3, 5, 11, 14, 17, 21',
        options: ['3', '5', '14', '17'],
        correct_answer: '14',
        explanation: '14 is the only even number; others are odd/prime.',
        difficulty: 'easy'
    },
    {
        id: 3003,
        subject: 'Logical Reasoning',
        question: 'Complete the series: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '48'],
        correct_answer: '42',
        explanation: 'Pattern: 1*2, 2*3, 3*4, 4*5, 5*6, 6*7 = 42',
        difficulty: 'medium'
    },
    {
        id: 3004,
        subject: 'Logical Reasoning',
        question: 'If CAT = 24, DOG = 26, what is PIG?',
        options: ['28', '30', '32', '34'],
        correct_answer: '32',
        explanation: 'P(16)+I(9)+G(7) = 32',
        difficulty: 'medium'
    },
    {
        id: 3005,
        subject: 'Logical Reasoning',
        question: 'If BOOK is coded as CPPL, how is PAGE coded?',
        options: ['QBHF', 'QBGF', 'PBHF', 'QCHF'],
        correct_answer: 'QBHF',
        explanation: 'Shift +1 for each letter.',
        difficulty: 'easy'
    },
    {
        id: 3006,
        subject: 'Logical Reasoning',
        question: 'Find the missing number: 5, 10, 20, 40, ?',
        options: ['60', '70', '80', '90'],
        correct_answer: '80',
        explanation: 'Doubling pattern: 40 * 2 = 80',
        difficulty: 'easy'
    },
    {
        id: 3007,
        subject: 'Logical Reasoning',
        question: 'Which word does not belong: Apple, Banana, Carrot, Mango?',
        options: ['Apple', 'Banana', 'Carrot', 'Mango'],
        correct_answer: 'Carrot',
        explanation: 'Carrot is a vegetable, others are fruits.',
        difficulty: 'easy'
    },
    {
        id: 3008,
        subject: 'Logical Reasoning',
        question: 'If Monday is 3 days before Thursday, what day is 2 days after Wednesday?',
        options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
        correct_answer: 'Friday',
        explanation: 'Wednesday + 2 = Friday',
        difficulty: 'easy'
    },
    {
        id: 3009,
        subject: 'Logical Reasoning',
        question: 'If A is taller than B, and B is taller than C, who is the shortest?',
        options: ['A', 'B', 'C', 'Cannot determine'],
        correct_answer: 'C',
        explanation: 'A > B > C, so C is shortest.',
        difficulty: 'easy'
    },
    {
        id: 3010,
        subject: 'Logical Reasoning',
        question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
        options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
        correct_answer: '(1/8)',
        explanation: 'Each number is divided by 2.',
        difficulty: 'medium'
    }
];
