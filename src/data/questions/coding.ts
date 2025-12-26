import { QuestionBankItem } from '../types';

export const codingQuestions: QuestionBankItem[] = [
    {
        id: 7001,
        subject: 'Coding',
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'],
        correct_answer: 'O(log n)',
        explanation: 'Binary search halves the search space each step.',
        difficulty: 'medium'
    },
    {
        id: 7002,
        subject: 'Coding',
        question: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Tree'],
        correct_answer: 'Stack',
        explanation: 'Stack is Last-In-First-Out.',
        difficulty: 'easy'
    },
    {
        id: 7003,
        subject: 'Coding',
        question: 'What does SQL stand for?',
        options: ['Structured Question Language', 'Structured Query Language', 'Simple Query Language', 'System Query Language'],
        correct_answer: 'Structured Query Language',
        explanation: 'Standard language for relational databases.',
        difficulty: 'easy'
    },
    {
        id: 7004,
        subject: 'Coding',
        question: 'Which of these is NOT a primitive data type in Java?',
        options: ['int', 'boolean', 'String', 'char'],
        correct_answer: 'String',
        explanation: 'String is a class/object type in Java.',
        difficulty: 'medium'
    },
    {
        id: 7005,
        subject: 'Coding',
        question: 'What is the concept of wrapping data and methods into a single unit called?',
        options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
        correct_answer: 'Encapsulation',
        explanation: 'Encapsulation binds data and code together.',
        difficulty: 'medium'
    },
    {
        id: 7006,
        subject: 'Coding',
        question: 'What is the output of 5 + "5" in JavaScript?',
        options: ['10', '55', 'Error', 'undefined'],
        correct_answer: '55',
        explanation: 'Number 5 is coerced to string, resulting in concatenation.',
        difficulty: 'easy'
    },
    {
        id: 7007,
        subject: 'Coding',
        question: 'Which sorting algorithm has the best average case time complexity?',
        options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
        correct_answer: 'Merge Sort',
        explanation: 'Merge sort is O(n log n), others are O(n^2) on average.',
        difficulty: 'hard'
    },
    {
        id: 7008,
        subject: 'Coding',
        question: 'What keyword is used to inherit a class in Java?',
        options: ['implements', 'extends', 'inherits', 'super'],
        correct_answer: 'extends',
        explanation: 'extends is used for class inheritance.',
        difficulty: 'easy'
    },
    {
        id: 7009,
        subject: 'Coding',
        question: 'What is a deadlock?',
        options: ['Process termination', 'Two processes waiting for each other indefinitely', 'Memory leak', 'CPU overload'],
        correct_answer: 'Two processes waiting for each other indefinitely',
        explanation: 'Deadlock occurs when processes block each other.',
        difficulty: 'hard'
    },
    {
        id: 7010,
        subject: 'Coding',
        question: 'What is the purpose of the "finally" block in Java?',
        options: ['Handle errors', 'Execute code regardless of exception', 'Stop execution', 'Define variables'],
        correct_answer: 'Execute code regardless of exception',
        explanation: 'finally block executes whether an exception occurs or not.',
        difficulty: 'medium'
    }
];
