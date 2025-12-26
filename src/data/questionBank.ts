import { QuestionBankItem } from './types';
import { quantitativeQuestions } from './questions/quantitative';
import { verbalQuestions } from './questions/verbal';
import { logicalQuestions } from './questions/logical';
import { abstractQuestions } from './questions/abstract';
import { situationalQuestions } from './questions/situational';
import { spatialQuestions } from './questions/spatial';
import { codingQuestions } from './questions/coding';

export type { QuestionBankItem };

export const questionBank: QuestionBankItem[] = [
    ...quantitativeQuestions,
    ...verbalQuestions,
    ...logicalQuestions,
    ...abstractQuestions,
    ...situationalQuestions,
    ...spatialQuestions,
    ...codingQuestions
];
