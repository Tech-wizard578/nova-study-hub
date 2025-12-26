export interface QuestionBankItem {
    id: number;
    subject: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}
