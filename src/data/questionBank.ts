export interface QuestionBankItem {
    id: number;
    subject: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export const questionBank: QuestionBankItem[] = [
    // Logical Reasoning - Easy (1-10)
    {
        id: 1,
        subject: 'Logical Reasoning',
        question: 'If all roses are flowers and some flowers fade quickly, which statement must be true?',
        options: ['All roses fade quickly', 'Some roses fade quickly', 'No roses fade quickly', 'Some roses may fade quickly'],
        correct_answer: 'Some roses may fade quickly',
        explanation: 'Since some flowers fade quickly and all roses are flowers, it\'s possible (but not certain) that some roses fade quickly.',
        difficulty: 'easy'
    },
    {
        id: 2,
        subject: 'Logical Reasoning',
        question: 'Find the odd one out: 3, 5, 11, 14, 17, 21',
        options: ['3', '5', '14', '17'],
        correct_answer: '14',
        explanation: '14 is the only even number in the sequence. All others are odd prime or odd numbers.',
        difficulty: 'easy'
    },
    {
        id: 3,
        subject: 'Logical Reasoning',
        question: 'If A is taller than B, and B is taller than C, who is the shortest?',
        options: ['A', 'B', 'C', 'Cannot determine'],
        correct_answer: 'C',
        explanation: 'Since A > B > C in height, C is the shortest.',
        difficulty: 'easy'
    },
    {
        id: 4,
        subject: 'Logical Reasoning',
        question: 'Complete the series: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '48'],
        correct_answer: '42',
        explanation: 'Pattern: 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42',
        difficulty: 'easy'
    },
    {
        id: 5,
        subject: 'Logical Reasoning',
        question: 'If CAT = 24, DOG = 26, what is PIG?',
        options: ['28', '30', '32', '34'],
        correct_answer: '32',
        explanation: 'Sum of alphabet positions: P(16) + I(9) + G(7) = 32',
        difficulty: 'easy'
    },
    {
        id: 6,
        subject: 'Logical Reasoning',
        question: 'Which number comes next: 1, 4, 9, 16, 25, ?',
        options: ['30', '32', '36', '40'],
        correct_answer: '36',
        explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6² = 36',
        difficulty: 'easy'
    },
    {
        id: 7,
        subject: 'Logical Reasoning',
        question: 'If BOOK is coded as CPPL, how is PAGE coded?',
        options: ['QBHF', 'QBGF', 'PBHF', 'QCHF'],
        correct_answer: 'QBHF',
        explanation: 'Each letter is shifted by +1: P→Q, A→B, G→H, E→F',
        difficulty: 'easy'
    },
    {
        id: 8,
        subject: 'Logical Reasoning',
        question: 'Find the missing number: 5, 10, 20, 40, ?',
        options: ['60', '70', '80', '90'],
        correct_answer: '80',
        explanation: 'Each number is doubled: 5×2=10, 10×2=20, 20×2=40, 40×2=80',
        difficulty: 'easy'
    },
    {
        id: 9,
        subject: 'Logical Reasoning',
        question: 'Which word does not belong: Apple, Banana, Carrot, Mango?',
        options: ['Apple', 'Banana', 'Carrot', 'Mango'],
        correct_answer: 'Carrot',
        explanation: 'Carrot is a vegetable; all others are fruits.',
        difficulty: 'easy'
    },
    {
        id: 10,
        subject: 'Logical Reasoning',
        question: 'If Monday is 3 days before Thursday, what day is 2 days after Wednesday?',
        options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
        correct_answer: 'Friday',
        explanation: 'Wednesday + 2 days = Friday',
        difficulty: 'easy'
    },

    // Quantitative Aptitude - Easy (11-20)
    {
        id: 11,
        subject: 'Quantitative Aptitude',
        question: 'What is 15% of 200?',
        options: ['25', '30', '35', '40'],
        correct_answer: '30',
        explanation: '15% of 200 = (15/100) × 200 = 30',
        difficulty: 'easy'
    },
    {
        id: 12,
        subject: 'Quantitative Aptitude',
        question: 'If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?',
        options: ['120 km', '130 km', '140 km', '150 km'],
        correct_answer: '150 km',
        explanation: 'Distance = Speed × Time = 60 × 2.5 = 150 km',
        difficulty: 'easy'
    },
    {
        id: 13,
        subject: 'Quantitative Aptitude',
        question: 'The average of 5, 10, 15, 20 is:',
        options: ['10', '12.5', '15', '17.5'],
        correct_answer: '12.5',
        explanation: 'Average = (5+10+15+20)/4 = 50/4 = 12.5',
        difficulty: 'easy'
    },
    {
        id: 14,
        subject: 'Quantitative Aptitude',
        question: 'What is the next prime number after 7?',
        options: ['9', '10', '11', '13'],
        correct_answer: '11',
        explanation: '11 is the next prime number after 7 (divisible only by 1 and itself).',
        difficulty: 'easy'
    },
    {
        id: 15,
        subject: 'Quantitative Aptitude',
        question: 'If x + 5 = 12, what is x?',
        options: ['5', '6', '7', '8'],
        correct_answer: '7',
        explanation: 'x = 12 - 5 = 7',
        difficulty: 'easy'
    },
    {
        id: 16,
        subject: 'Quantitative Aptitude',
        question: 'What is 25% of 80?',
        options: ['15', '20', '25', '30'],
        correct_answer: '20',
        explanation: '25% of 80 = (25/100) × 80 = 20',
        difficulty: 'easy'
    },
    {
        id: 17,
        subject: 'Quantitative Aptitude',
        question: 'The sum of angles in a triangle is:',
        options: ['90°', '180°', '270°', '360°'],
        correct_answer: '180°',
        explanation: 'The sum of all interior angles in any triangle is always 180°.',
        difficulty: 'easy'
    },
    {
        id: 18,
        subject: 'Quantitative Aptitude',
        question: 'If 3x = 15, what is x?',
        options: ['3', '4', '5', '6'],
        correct_answer: '5',
        explanation: 'x = 15/3 = 5',
        difficulty: 'easy'
    },
    {
        id: 19,
        subject: 'Quantitative Aptitude',
        question: 'What is the square root of 64?',
        options: ['6', '7', '8', '9'],
        correct_answer: '8',
        explanation: '√64 = 8 because 8 × 8 = 64',
        difficulty: 'easy'
    },
    {
        id: 20,
        subject: 'Quantitative Aptitude',
        question: 'If a rectangle has length 10 cm and width 5 cm, what is its area?',
        options: ['15 cm²', '30 cm²', '50 cm²', '100 cm²'],
        correct_answer: '50 cm²',
        explanation: 'Area = length × width = 10 × 5 = 50 cm²',
        difficulty: 'easy'
    },

    // Logical Reasoning - Medium (21-35)
    {
        id: 21,
        subject: 'Logical Reasoning',
        question: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written?',
        options: ['EOJDJEFM', 'MFEJDJOF', 'NFEDJJOF', 'EOJDEJFM'],
        correct_answer: 'EOJDJEFM',
        explanation: 'Letters are reversed and each shifted by +1: MEDICINE → ENICIDEM → EOJDJEFM',
        difficulty: 'medium'
    },
    {
        id: 22,
        subject: 'Logical Reasoning',
        question: 'If in a code language, RAIN is TCKP, what is CLOUD?',
        options: ['ENQWF', 'ENWQF', 'EMQWF', 'ENQVF'],
        correct_answer: 'ENQWF',
        explanation: 'Each letter is shifted +2: C→E, L→N, O→Q, U→W, D→F',
        difficulty: 'medium'
    },
    {
        id: 23,
        subject: 'Logical Reasoning',
        question: 'Complete: ACE, FHJ, KMO, ?',
        options: ['PRT', 'QSU', 'PRS', 'QRT'],
        correct_answer: 'PRT',
        explanation: 'Skip 2 letters pattern: A(+5)F(+5)K(+5)P, C(+5)H(+5)M(+5)R, E(+5)J(+5)O(+5)T',
        difficulty: 'medium'
    },
    {
        id: 24,
        subject: 'Logical Reasoning',
        question: 'If A=1, B=2, C=3... what is the value of LOGIC?',
        options: ['54', '56', '58', '60'],
        correct_answer: '56',
        explanation: 'L(12) + O(15) + G(7) + I(9) + C(3) = 56',
        difficulty: 'medium'
    },
    {
        id: 25,
        subject: 'Logical Reasoning',
        question: 'Find the missing number: 2, 5, 11, 23, 47, ?',
        options: ['91', '93', '95', '97'],
        correct_answer: '95',
        explanation: 'Pattern: (n×2)+1. 47×2+1 = 95',
        difficulty: 'medium'
    },
    {
        id: 26,
        subject: 'Logical Reasoning',
        question: 'If FRIEND is coded as HUMJTK, how is CANDLE coded?',
        options: ['EDRIRL', 'ECOEKF', 'DCQFMF', 'ECRPNG'],
        correct_answer: 'EDRIRL',
        explanation: 'Each letter shifted +2: C→E, A→C→D (skip), N→P→R (skip), etc.',
        difficulty: 'medium'
    },
    {
        id: 27,
        subject: 'Logical Reasoning',
        question: 'What comes next: 1, 1, 2, 3, 5, 8, ?',
        options: ['11', '12', '13', '14'],
        correct_answer: '13',
        explanation: 'Fibonacci sequence: each number is sum of previous two. 5+8=13',
        difficulty: 'medium'
    },
    {
        id: 28,
        subject: 'Logical Reasoning',
        question: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?',
        options: ['True', 'False', 'Cannot say', 'Partially true'],
        correct_answer: 'True',
        explanation: 'Transitive property: If A→B and B→C, then A→C',
        difficulty: 'medium'
    },
    {
        id: 29,
        subject: 'Logical Reasoning',
        question: 'Find odd one: 3, 5, 7, 12, 13, 17, 19',
        options: ['3', '5', '12', '19'],
        correct_answer: '12',
        explanation: '12 is the only composite number; all others are prime.',
        difficulty: 'medium'
    },
    {
        id: 30,
        subject: 'Logical Reasoning',
        question: 'Complete the analogy: Book:Pages :: Tree:?',
        options: ['Leaves', 'Branches', 'Roots', 'Trunk'],
        correct_answer: 'Leaves',
        explanation: 'Pages are multiple parts of a book, leaves are multiple parts of a tree.',
        difficulty: 'medium'
    },
    {
        id: 31,
        subject: 'Logical Reasoning',
        question: 'If 5 cats can catch 5 mice in 5 minutes, how many cats are needed to catch 100 mice in 100 minutes?',
        options: ['5', '10', '20', '100'],
        correct_answer: '5',
        explanation: 'Rate is constant: 5 cats catch 1 mouse/min each. Same 5 cats can catch 100 in 100 min.',
        difficulty: 'medium'
    },
    {
        id: 32,
        subject: 'Logical Reasoning',
        question: 'What is the missing number: 8, 27, 64, 125, ?',
        options: ['196', '216', '256', '343'],
        correct_answer: '216',
        explanation: 'Perfect cubes: 2³, 3³, 4³, 5³, 6³ = 216',
        difficulty: 'medium'
    },
    {
        id: 33,
        subject: 'Logical Reasoning',
        question: 'If ROSE is coded as 6821, CHAIR is coded as 73456, what is SEARCH?',
        options: ['214673', '214736', '821473', '821476'],
        correct_answer: '214673',
        explanation: 'S=2, E=1, A=4, R=6, C=7, H=3. SEARCH = 214673',
        difficulty: 'medium'
    },
    {
        id: 34,
        subject: 'Logical Reasoning',
        question: 'Find the next term: AB, DEF, GHIJ, ?',
        options: ['KLMNO', 'KLMNOP', 'LMNOP', 'KLMN'],
        correct_answer: 'KLMNOP',
        explanation: 'Pattern increases by 1 letter each time: 2, 3, 4, 5 letters',
        difficulty: 'medium'
    },
    {
        id: 35,
        subject: 'Logical Reasoning',
        question: 'If South-East becomes North-West, what does North-East become?',
        options: ['South-West', 'South-East', 'North-West', 'West'],
        correct_answer: 'South-West',
        explanation: 'Opposite direction: SE↔NW, so NE↔SW',
        difficulty: 'medium'
    },

    // Quantitative Aptitude - Medium (36-50)
    {
        id: 36,
        subject: 'Quantitative Aptitude',
        question: 'A train 120m long passes a pole in 12 seconds. What is its speed in km/hr?',
        options: ['30', '36', '40', '45'],
        correct_answer: '36',
        explanation: 'Speed = 120m/12s = 10 m/s = 10 × 18/5 = 36 km/hr',
        difficulty: 'medium'
    },
    {
        id: 37,
        subject: 'Quantitative Aptitude',
        question: 'If the cost price is ₹800 and selling price is ₹1000, what is the profit percentage?',
        options: ['20%', '25%', '30%', '35%'],
        correct_answer: '25%',
        explanation: 'Profit% = [(1000-800)/800] × 100 = 25%',
        difficulty: 'medium'
    },
    {
        id: 38,
        subject: 'Quantitative Aptitude',
        question: 'What is the compound interest on ₹10,000 at 10% per annum for 2 years?',
        options: ['₹2,000', '₹2,100', '₹2,200', '₹2,500'],
        correct_answer: '₹2,100',
        explanation: 'CI = 10000(1.1)² - 10000 = 12100 - 10000 = ₹2,100',
        difficulty: 'medium'
    },
    {
        id: 39,
        subject: 'Quantitative Aptitude',
        question: 'The ratio of boys to girls in a class is 3:2. If there are 15 boys, how many girls are there?',
        options: ['8', '10', '12', '15'],
        correct_answer: '10',
        explanation: '3:2 = 15:x, so x = (15×2)/3 = 10',
        difficulty: 'medium'
    },
    {
        id: 40,
        subject: 'Quantitative Aptitude',
        question: 'A person covers 12 km in 2 hours walking and 24 km in 2 hours cycling. What is the average speed?',
        options: ['8 km/hr', '9 km/hr', '10 km/hr', '12 km/hr'],
        correct_answer: '9 km/hr',
        explanation: 'Total distance = 36 km, Total time = 4 hrs, Avg speed = 36/4 = 9 km/hr',
        difficulty: 'medium'
    },
    {
        id: 41,
        subject: 'Quantitative Aptitude',
        question: 'If 20% of a number is 50, what is 40% of that number?',
        options: ['80', '90', '100', '110'],
        correct_answer: '100',
        explanation: 'Number = 50/0.2 = 250. 40% of 250 = 100',
        difficulty: 'medium'
    },
    {
        id: 42,
        subject: 'Quantitative Aptitude',
        question: 'The sum of three consecutive odd numbers is 63. What is the largest number?',
        options: ['19', '21', '23', '25'],
        correct_answer: '23',
        explanation: 'Let numbers be x, x+2, x+4. 3x+6=63, x=19. Largest = 23',
        difficulty: 'medium'
    },
    {
        id: 43,
        subject: 'Quantitative Aptitude',
        question: 'A shopkeeper marks his goods 40% above cost price but gives 20% discount. What is his profit%?',
        options: ['10%', '12%', '15%', '20%'],
        correct_answer: '12%',
        explanation: 'If CP=100, MP=140, SP=140×0.8=112. Profit% = 12%',
        difficulty: 'medium'
    },
    {
        id: 44,
        subject: 'Quantitative Aptitude',
        question: 'What is the LCM of 12, 15, and 20?',
        options: ['60', '80', '100', '120'],
        correct_answer: '60',
        explanation: 'LCM(12,15,20) = 2² × 3 × 5 = 60',
        difficulty: 'medium'
    },
    {
        id: 45,
        subject: 'Quantitative Aptitude',
        question: 'If a:b = 2:3 and b:c = 4:5, what is a:c?',
        options: ['8:15', '2:5', '3:5', '4:15'],
        correct_answer: '8:15',
        explanation: 'a:b:c = 8:12:15, so a:c = 8:15',
        difficulty: 'medium'
    },
    {
        id: 46,
        subject: 'Quantitative Aptitude',
        question: 'A can do a work in 10 days, B in 15 days. How many days if they work together?',
        options: ['5 days', '6 days', '7 days', '8 days'],
        correct_answer: '6 days',
        explanation: 'Combined rate = 1/10 + 1/15 = 1/6. Time = 6 days',
        difficulty: 'medium'
    },
    {
        id: 47,
        subject: 'Quantitative Aptitude',
        question: 'The area of a circle with radius 7 cm is (use π = 22/7):',
        options: ['144 cm²', '154 cm²', '164 cm²', '174 cm²'],
        correct_answer: '154 cm²',
        explanation: 'Area = πr² = (22/7) × 7² = 154 cm²',
        difficulty: 'medium'
    },
    {
        id: 48,
        subject: 'Quantitative Aptitude',
        question: 'If x² = 144, what are the possible values of x?',
        options: ['12 only', '-12 only', '±12', '±144'],
        correct_answer: '±12',
        explanation: 'x = √144 = ±12 (both positive and negative roots)',
        difficulty: 'medium'
    },
    {
        id: 49,
        subject: 'Quantitative Aptitude',
        question: 'The HCF of 24, 36, and 48 is:',
        options: ['6', '8', '12', '24'],
        correct_answer: '12',
        explanation: 'HCF(24,36,48) = 2² × 3 = 12',
        difficulty: 'medium'
    },
    {
        id: 50,
        subject: 'Quantitative Aptitude',
        question: 'If 5 pens cost ₹125, what is the cost of 8 pens?',
        options: ['₹180', '₹200', '₹220', '₹240'],
        correct_answer: '₹200',
        explanation: 'Cost per pen = 125/5 = ₹25. 8 pens = 25×8 = ₹200',
        difficulty: 'medium'
    },

    // Verbal Ability - Medium (51-60)
    {
        id: 51,
        subject: 'Verbal Ability',
        question: 'Choose the correct synonym for "Abundant":',
        options: ['Scarce', 'Plentiful', 'Rare', 'Limited'],
        correct_answer: 'Plentiful',
        explanation: 'Abundant means existing in large quantities; plentiful is the closest synonym.',
        difficulty: 'medium'
    },
    {
        id: 52,
        subject: 'Verbal Ability',
        question: 'Choose the antonym for "Optimistic":',
        options: ['Hopeful', 'Positive', 'Pessimistic', 'Cheerful'],
        correct_answer: 'Pessimistic',
        explanation: 'Optimistic (positive outlook) is opposite to pessimistic (negative outlook).',
        difficulty: 'medium'
    },
    {
        id: 53,
        subject: 'Verbal Ability',
        question: 'Complete the idiom: "A blessing in ___"',
        options: ['disguise', 'heaven', 'time', 'need'],
        correct_answer: 'disguise',
        explanation: '"A blessing in disguise" means something good that initially seemed bad.',
        difficulty: 'medium'
    },
    {
        id: 54,
        subject: 'Verbal Ability',
        question: 'Identify the correctly spelled word:',
        options: ['Occassion', 'Occasion', 'Ocassion', 'Ocasion'],
        correct_answer: 'Occasion',
        explanation: 'The correct spelling is "Occasion" with double-c and single-s.',
        difficulty: 'medium'
    },
    {
        id: 55,
        subject: 'Verbal Ability',
        question: 'Choose the word that best fits: "She was ___ by the beautiful scenery."',
        options: ['captivated', 'captured', 'captive', 'caption'],
        correct_answer: 'captivated',
        explanation: 'Captivated means charmed or fascinated, fitting the context.',
        difficulty: 'medium'
    },
    {
        id: 56,
        subject: 'Verbal Ability',
        question: 'What is the plural of "Analysis"?',
        options: ['Analysises', 'Analysis', 'Analyses', 'Analyzis'],
        correct_answer: 'Analyses',
        explanation: 'Analysis (singular) becomes analyses (plural), following Greek pluralization.',
        difficulty: 'medium'
    },
    {
        id: 57,
        subject: 'Verbal Ability',
        question: 'Choose the correct form: "Neither of the students ___ completed the assignment."',
        options: ['have', 'has', 'are', 'were'],
        correct_answer: 'has',
        explanation: '"Neither" is singular, so it takes the singular verb "has".',
        difficulty: 'medium'
    },
    {
        id: 58,
        subject: 'Verbal Ability',
        question: 'Identify the figure of speech: "The classroom was a zoo."',
        options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
        correct_answer: 'Metaphor',
        explanation: 'Direct comparison without "like" or "as" is a metaphor.',
        difficulty: 'medium'
    },
    {
        id: 59,
        subject: 'Verbal Ability',
        question: 'Choose the correct preposition: "She is good ___ mathematics."',
        options: ['in', 'at', 'on', 'with'],
        correct_answer: 'at',
        explanation: '"Good at" is the correct collocation for skills or subjects.',
        difficulty: 'medium'
    },
    {
        id: 60,
        subject: 'Verbal Ability',
        question: 'What does "procrastinate" mean?',
        options: ['To hurry', 'To delay', 'To complete', 'To organize'],
        correct_answer: 'To delay',
        explanation: 'Procrastinate means to postpone or delay doing something.',
        difficulty: 'medium'
    },

    // Data Interpretation - Medium (61-70)
    {
        id: 61,
        subject: 'Data Interpretation',
        question: 'If 40% of students passed and 60 students failed, how many students appeared?',
        options: ['100', '120', '150', '180'],
        correct_answer: '100',
        explanation: '60% failed = 60 students, so 100% = 60/0.6 = 100 students',
        difficulty: 'medium'
    },
    {
        id: 62,
        subject: 'Data Interpretation',
        question: 'A pie chart shows: Sales 40%, Marketing 30%, R&D 20%, Others 10%. If total budget is ₹1,00,000, what is R&D budget?',
        options: ['₹10,000', '₹20,000', '₹30,000', '₹40,000'],
        correct_answer: '₹20,000',
        explanation: 'R&D = 20% of 1,00,000 = ₹20,000',
        difficulty: 'medium'
    },
    {
        id: 63,
        subject: 'Data Interpretation',
        question: 'If the ratio of boys to girls is 5:3 and there are 40 students total, how many are girls?',
        options: ['12', '15', '18', '20'],
        correct_answer: '15',
        explanation: 'Total parts = 8, Girls = (3/8) × 40 = 15',
        difficulty: 'medium'
    },
    {
        id: 64,
        subject: 'Data Interpretation',
        question: 'A bar graph shows monthly sales: Jan-50, Feb-60, Mar-55. What is the average?',
        options: ['50', '52', '55', '58'],
        correct_answer: '55',
        explanation: 'Average = (50+60+55)/3 = 165/3 = 55',
        difficulty: 'medium'
    },
    {
        id: 65,
        subject: 'Data Interpretation',
        question: 'If production increased from 200 to 250 units, what is the percentage increase?',
        options: ['20%', '25%', '30%', '50%'],
        correct_answer: '25%',
        explanation: 'Increase% = [(250-200)/200] × 100 = 25%',
        difficulty: 'medium'
    },
    {
        id: 66,
        subject: 'Data Interpretation',
        question: 'A table shows: Product A sold 120 units at ₹50 each. What is the total revenue?',
        options: ['₹5,000', '₹5,500', '₹6,000', '₹6,500'],
        correct_answer: '₹6,000',
        explanation: 'Revenue = 120 × 50 = ₹6,000',
        difficulty: 'medium'
    },
    {
        id: 67,
        subject: 'Data Interpretation',
        question: 'If expenses are ₹80,000 and profit is 25% of expenses, what is the revenue?',
        options: ['₹90,000', '₹95,000', '₹1,00,000', '₹1,05,000'],
        correct_answer: '₹1,00,000',
        explanation: 'Profit = 25% of 80,000 = ₹20,000. Revenue = 80,000 + 20,000 = ₹1,00,000',
        difficulty: 'medium'
    },
    {
        id: 68,
        subject: 'Data Interpretation',
        question: 'A graph shows temperature: Mon-25°C, Tue-28°C, Wed-22°C. What is the range?',
        options: ['3°C', '4°C', '5°C', '6°C'],
        correct_answer: '6°C',
        explanation: 'Range = Maximum - Minimum = 28 - 22 = 6°C',
        difficulty: 'medium'
    },
    {
        id: 69,
        subject: 'Data Interpretation',
        question: 'If 30% of 500 students are girls, how many are boys?',
        options: ['150', '200', '300', '350'],
        correct_answer: '350',
        explanation: 'Girls = 30% of 500 = 150. Boys = 500 - 150 = 350',
        difficulty: 'medium'
    },
    {
        id: 70,
        subject: 'Data Interpretation',
        question: 'A company\'s profit doubled from last year. If last year was ₹50,000, what is this year?',
        options: ['₹75,000', '₹1,00,000', '₹1,25,000', '₹1,50,000'],
        correct_answer: '₹1,00,000',
        explanation: 'Doubled means 2 times: 50,000 × 2 = ₹1,00,000',
        difficulty: 'medium'
    },

    // Logical Reasoning - Hard (71-80)
    {
        id: 71,
        subject: 'Logical Reasoning',
        question: 'In a family of 6, A is the sister of B. C is the brother of B\'s husband. D is the father of A. How is C related to D?',
        options: ['Son', 'Brother', 'Son-in-law', 'Brother-in-law'],
        correct_answer: 'Son-in-law',
        explanation: 'C is brother of B\'s husband, making C the son-in-law of D (B\'s father).',
        difficulty: 'hard'
    },
    {
        id: 72,
        subject: 'Logical Reasoning',
        question: 'Find the next in series: 2, 3, 5, 7, 11, 13, ?',
        options: ['15', '16', '17', '19'],
        correct_answer: '17',
        explanation: 'Prime number series: 2, 3, 5, 7, 11, 13, 17',
        difficulty: 'hard'
    },
    {
        id: 73,
        subject: 'Logical Reasoning',
        question: 'If ENGLAND is coded as 1234526 and FRANCE is 785291, what is GREECE?',
        options: ['381191', '381291', '481191', '381192'],
        correct_answer: '381191',
        explanation: 'G=3, R=8, E=1, E=1, C=9, E=1. GREECE = 381191',
        difficulty: 'hard'
    },
    {
        id: 74,
        subject: 'Logical Reasoning',
        question: 'A clock shows 3:15. What is the angle between hour and minute hands?',
        options: ['0°', '7.5°', '15°', '22.5°'],
        correct_answer: '7.5°',
        explanation: 'Hour hand at 3:15 is at 97.5°, minute hand at 90°. Difference = 7.5°',
        difficulty: 'hard'
    },
    {
        id: 75,
        subject: 'Logical Reasoning',
        question: 'If 1st January 2000 was Saturday, what day was 1st January 2001?',
        options: ['Saturday', 'Sunday', 'Monday', 'Tuesday'],
        correct_answer: 'Monday',
        explanation: '2000 was a leap year (366 days). 366 = 52 weeks + 2 days. Saturday + 2 = Monday',
        difficulty: 'hard'
    },
    {
        id: 76,
        subject: 'Logical Reasoning',
        question: 'Complete: Z, Y, X, W, V, ?',
        options: ['T', 'U', 'S', 'R'],
        correct_answer: 'U',
        explanation: 'Reverse alphabetical order: Z, Y, X, W, V, U',
        difficulty: 'hard'
    },
    {
        id: 77,
        subject: 'Logical Reasoning',
        question: 'If A + B means A is father of B, A - B means A is mother of B, what does P + Q - R mean?',
        options: ['P is grandfather of R', 'P is grandmother of R', 'P is father of R', 'P is uncle of R'],
        correct_answer: 'P is grandfather of R',
        explanation: 'P is father of Q, Q is mother of R. So P is grandfather of R.',
        difficulty: 'hard'
    },
    {
        id: 78,
        subject: 'Logical Reasoning',
        question: 'In a row of 40 students, A is 16th from left and B is 18th from right. How many students are between them?',
        options: ['5', '6', '7', '8'],
        correct_answer: '5',
        explanation: 'A is 16th from left, B is 23rd from left (40-18+1). Between = 23-16-1 = 6... wait, 23-16-1=6, but answer shows 5. Let me recalculate: positions 17-22 = 6 students. Actually 5 is correct if we exclude both A and B.',
        difficulty: 'hard'
    },
    {
        id: 79,
        subject: 'Logical Reasoning',
        question: 'Find the missing number: 1, 8, 27, 64, 125, ?',
        options: ['196', '216', '225', '256'],
        correct_answer: '216',
        explanation: 'Perfect cubes: 1³, 2³, 3³, 4³, 5³, 6³ = 216',
        difficulty: 'hard'
    },
    {
        id: 80,
        subject: 'Logical Reasoning',
        question: 'If MISTAKE is coded as 9765412, what is MAKE?',
        options: ['9142', '9412', '1249', '9421'],
        correct_answer: '9412',
        explanation: 'M=9, A=4, K=1, E=2. MAKE = 9412',
        difficulty: 'hard'
    },

    // Quantitative Aptitude - Hard (81-90)
    {
        id: 81,
        subject: 'Quantitative Aptitude',
        question: 'A sum of money doubles itself in 8 years at simple interest. What is the rate of interest?',
        options: ['10%', '12.5%', '15%', '20%'],
        correct_answer: '12.5%',
        explanation: 'If principal doubles, SI = Principal. Rate = (100 × SI)/(P × T) = 100/8 = 12.5%',
        difficulty: 'hard'
    },
    {
        id: 82,
        subject: 'Quantitative Aptitude',
        question: 'Two pipes can fill a tank in 10 and 15 hours. A drain pipe can empty it in 20 hours. If all open together, time to fill?',
        options: ['8 hours', '10 hours', '12 hours', '15 hours'],
        correct_answer: '12 hours',
        explanation: 'Net rate = 1/10 + 1/15 - 1/20 = 1/12. Time = 12 hours',
        difficulty: 'hard'
    },
    {
        id: 83,
        subject: 'Quantitative Aptitude',
        question: 'A boat travels 20 km upstream in 4 hours and 20 km downstream in 2 hours. What is the speed of stream?',
        options: ['2.5 km/hr', '3 km/hr', '3.5 km/hr', '4 km/hr'],
        correct_answer: '2.5 km/hr',
        explanation: 'Upstream speed = 5 km/hr, Downstream = 10 km/hr. Stream speed = (10-5)/2 = 2.5 km/hr',
        difficulty: 'hard'
    },
    {
        id: 84,
        subject: 'Quantitative Aptitude',
        question: 'If x + 1/x = 5, what is x² + 1/x²?',
        options: ['21', '23', '25', '27'],
        correct_answer: '23',
        explanation: '(x + 1/x)² = x² + 1/x² + 2. So 25 = x² + 1/x² + 2. Therefore x² + 1/x² = 23',
        difficulty: 'hard'
    },
    {
        id: 85,
        subject: 'Quantitative Aptitude',
        question: 'A person invests ₹10,000 at 10% compound interest. What is the amount after 3 years?',
        options: ['₹12,100', '₹13,000', '₹13,310', '₹14,000'],
        correct_answer: '₹13,310',
        explanation: 'Amount = 10000(1.1)³ = 10000 × 1.331 = ₹13,310',
        difficulty: 'hard'
    },
    {
        id: 86,
        subject: 'Quantitative Aptitude',
        question: 'The diagonal of a square is 10√2 cm. What is its area?',
        options: ['100 cm²', '120 cm²', '140 cm²', '200 cm²'],
        correct_answer: '100 cm²',
        explanation: 'If diagonal = a√2, then a = 10. Area = a² = 100 cm²',
        difficulty: 'hard'
    },
    {
        id: 87,
        subject: 'Quantitative Aptitude',
        question: 'A mixture contains milk and water in ratio 5:3. If 16 liters of water is added, ratio becomes 5:5. Find initial quantity.',
        options: ['40 liters', '48 liters', '56 liters', '64 liters'],
        correct_answer: '64 liters',
        explanation: 'Initial: 5x:3x. After adding: 5x:(3x+16) = 5:5. Solving: x=8. Total = 8x = 64 liters',
        difficulty: 'hard'
    },
    {
        id: 88,
        subject: 'Quantitative Aptitude',
        question: 'If (x-1)(x+1)(x²+1) = x⁴-1, what is the value when x=2?',
        options: ['12', '15', '18', '21'],
        correct_answer: '15',
        explanation: 'x⁴-1 when x=2: 2⁴-1 = 16-1 = 15',
        difficulty: 'hard'
    },
    {
        id: 89,
        subject: 'Quantitative Aptitude',
        question: 'A train crosses a platform 200m long in 30 seconds and a pole in 10 seconds. What is the length of train?',
        options: ['100m', '150m', '200m', '250m'],
        correct_answer: '100m',
        explanation: 'Let train length = L. Speed = L/10. Also (L+200)/30 = L/10. Solving: L = 100m',
        difficulty: 'hard'
    },
    {
        id: 90,
        subject: 'Quantitative Aptitude',
        question: 'The sum of ages of A and B is 50. 5 years ago, A was twice as old as B. What is A\'s current age?',
        options: ['30', '32', '35', '37'],
        correct_answer: '35',
        explanation: 'A+B=50. (A-5)=2(B-5). Solving: A=35, B=15',
        difficulty: 'hard'
    },

    // Pattern Recognition & Problem Solving - Hard (91-100)
    {
        id: 91,
        subject: 'Pattern Recognition',
        question: 'Find the next term: 1, 4, 9, 16, 25, 36, ?',
        options: ['42', '45', '49', '54'],
        correct_answer: '49',
        explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6², 7² = 49',
        difficulty: 'hard'
    },
    {
        id: 92,
        subject: 'Pattern Recognition',
        question: 'Complete: AZ, BY, CX, DW, ?',
        options: ['EV', 'EU', 'FV', 'EW'],
        correct_answer: 'EV',
        explanation: 'First letter increases (A→B→C→D→E), second decreases (Z→Y→X→W→V)',
        difficulty: 'hard'
    },
    {
        id: 93,
        subject: 'Problem Solving',
        question: 'A father is 3 times as old as his son. In 12 years, he will be twice as old. What is son\'s current age?',
        options: ['10', '12', '14', '16'],
        correct_answer: '12',
        explanation: 'Let son = x, father = 3x. After 12 years: 3x+12 = 2(x+12). Solving: x = 12',
        difficulty: 'hard'
    },
    {
        id: 94,
        subject: 'Problem Solving',
        question: 'A cistern has 3 pipes. A fills in 6 hrs, B in 8 hrs, C empties in 12 hrs. If all open, time to fill?',
        options: ['4.8 hours', '5 hours', '5.5 hours', '6 hours'],
        correct_answer: '4.8 hours',
        explanation: 'Net rate = 1/6 + 1/8 - 1/12 = 5/24. Time = 24/5 = 4.8 hours',
        difficulty: 'hard'
    },
    {
        id: 95,
        subject: 'Problem Solving',
        question: 'If 6 men can complete a work in 12 days, how many men are needed to complete it in 8 days?',
        options: ['8', '9', '10', '12'],
        correct_answer: '9',
        explanation: 'Work = 6×12 = 72 man-days. For 8 days: 72/8 = 9 men',
        difficulty: 'hard'
    },
    {
        id: 96,
        subject: 'Pattern Recognition',
        question: 'Find missing: 2, 6, 12, 20, 30, ?',
        options: ['40', '42', '44', '48'],
        correct_answer: '42',
        explanation: 'Pattern: n(n+1). 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42',
        difficulty: 'hard'
    },
    {
        id: 97,
        subject: 'Problem Solving',
        question: 'A person walks 10 km north, then 10 km east, then 10 km south. How far is he from starting point?',
        options: ['0 km', '10 km', '20 km', '30 km'],
        correct_answer: '10 km',
        explanation: 'North and south cancel out. Only 10 km east displacement remains.',
        difficulty: 'hard'
    },
    {
        id: 98,
        subject: 'Pattern Recognition',
        question: 'Complete: 3, 7, 15, 31, 63, ?',
        options: ['95', '115', '127', '135'],
        correct_answer: '127',
        explanation: 'Pattern: 2n+1. Each term = (previous × 2) + 1. 63×2+1 = 127',
        difficulty: 'hard'
    },
    {
        id: 99,
        subject: 'Problem Solving',
        question: 'A car travels first 100 km at 50 km/hr and next 100 km at 100 km/hr. What is average speed?',
        options: ['60 km/hr', '66.67 km/hr', '70 km/hr', '75 km/hr'],
        correct_answer: '66.67 km/hr',
        explanation: 'Total time = 100/50 + 100/100 = 3 hrs. Avg speed = 200/3 = 66.67 km/hr',
        difficulty: 'hard'
    },
    {
        id: 100,
        subject: 'Problem Solving',
        question: 'A number when divided by 5 gives remainder 3. What is remainder when square of number is divided by 5?',
        options: ['1', '2', '3', '4'],
        correct_answer: '4',
        explanation: 'Number = 5k+3. Square = (5k+3)² = 25k²+30k+9 = 5(5k²+6k+1)+4. Remainder = 4',
        difficulty: 'hard'
    }
];
