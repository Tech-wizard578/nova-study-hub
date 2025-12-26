import { QuestionBankItem } from '../types';

export const spatialQuestions: QuestionBankItem[] = [
    {
        id: 6001,
        subject: 'Spatial Reasoning',
        question: 'A person walks 4 km towards North, then turns right and walks 4 km, then turns left and walks 2 km. In which direction is he from the starting point?',
        options: ['North', 'North-East', 'dSouth-East', 'West'],
        correct_answer: 'North-East',
        explanation: 'He is to the North and East of his starting position.',
        difficulty: 'medium'
    },
    {
        id: 6002,
        subject: 'Spatial Reasoning',
        question: 'A cube is painted red on all sides. It is cut into 27 smaller identical cubes. How many small cubes have exactly 3 sides painted?',
        options: ['4', '6', '8', '12'],
        correct_answer: '8',
        explanation: 'Only the corner cubes have 3 sides painted. A cube has 8 corners.',
        difficulty: 'medium'
    },
    {
        id: 6003,
        subject: 'Spatial Reasoning',
        question: 'A die has numbers 1 to 6. If 1 is opposite 6, 2 is opposite 5, and 3 is opposite 4, and 1 is on top, what is at the bottom?',
        options: ['2', '4', '6', '3'],
        correct_answer: '6',
        explanation: 'Standard dice rule: opposite sides sum to 7. 1 is opposite 6.',
        difficulty: 'easy'
    },
    {
        id: 6004,
        subject: 'Spatial Reasoning',
        question: 'Tom is facing South. He turns 135 degrees anti-clockwise and then 180 degrees clockwise. Which direction is he facing now?',
        options: ['South-West', 'South-East', 'North-West', 'North-East'],
        correct_answer: 'South-West',
        explanation: 'Initial: South (180°). Anti-clockwise 135° -> 45° (NE). Clockwise 180° -> 225° (SW).',
        difficulty: 'hard'
    },
    {
        id: 6005,
        subject: 'Spatial Reasoning',
        question: 'Which letter looks the same in a mirror?',
        options: ['S', 'N', 'A', 'P'],
        correct_answer: 'A',
        explanation: 'The letter A implies vertical symmetry.',
        difficulty: 'easy'
    },
    {
        id: 6006,
        subject: 'Spatial Reasoning',
        question: 'A cube is cut into 64 small cubes. How many have NO sides painted?',
        options: ['4', '8', '16', '24'],
        correct_answer: '8',
        explanation: 'Inner core cubes = (n-2)³. Here n=4 (4x4x4=64). So (4-2)³ = 2³ = 8.',
        difficulty: 'hard'
    },
    {
        id: 6007,
        subject: 'Spatial Reasoning',
        question: 'If "NORTH" is called "WEST", "WEST" is called "SOUTH", what is "EAST" called?',
        options: ['NORTH', 'SOUTH', 'WEST', 'NORTH-EAST'],
        correct_answer: 'NORTH',
        explanation: 'Rotation is 90 degrees anti-clockwise. East becomes North.',
        difficulty: 'medium'
    },
    {
        id: 6008,
        subject: 'Spatial Reasoning',
        question: 'Imagine a clock at 3:15. If the minute hand points East, which direction does the hour hand point?',
        options: ['East', 'South-East', 'North-East', 'South'],
        correct_answer: 'East',
        explanation: 'At 3:15, both hands are near 3. If minute hand (at 3) is East, Hour hand (slightly below 3) is also essentially East (or slightly South-East depending on precision required, but usually treated as overlapping for simple spatial comparison). Actually, strictly speaking hour hand moves. But assuming standard orientation mapping: 3 is East. Hour hand is slightly past 3. Options suggest general direction.',
        difficulty: 'medium'
    },
    {
        id: 6009,
        subject: 'Spatial Reasoning',
        question: 'How many straight lines are needed to draw a cube?',
        options: ['9', '10', '11', '12'],
        correct_answer: '12',
        explanation: 'A cube has 12 edges.',
        difficulty: 'easy'
    },
    {
        id: 6010,
        subject: 'Spatial Reasoning',
        question: 'A sheet of paper A4 size is folded exactly in half. What is the relationship between the new area and original area?',
        options: ['1:2', '1:4', '2:1', '1:1'],
        correct_answer: '1:2',
        explanation: 'Folding in half reduces area by 50%.',
        difficulty: 'easy'
    }
];
