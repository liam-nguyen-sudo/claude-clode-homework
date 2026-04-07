import type { Category, Question } from '../domain/types'

export const CATEGORIES: Category[] = [
  { id: 'general-knowledge', label: 'General Knowledge' },
  { id: 'science', label: 'Science' },
]

export const ALL_QUESTIONS: Question[] = [
  {
    id: 'gk-001',
    categoryId: 'general-knowledge',
    prompt: 'What is the capital of France?',
    answers: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswerIndex: 2,
    basePoints: 100,
  },
  {
    id: 'gk-002',
    categoryId: 'general-knowledge',
    prompt: 'How many continents are there on Earth?',
    answers: ['5', '6', '7', '8'],
    correctAnswerIndex: 2,
    basePoints: 100,
  },
  {
    id: 'gk-003',
    categoryId: 'general-knowledge',
    prompt: 'Which planet is known as the Red Planet?',
    answers: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswerIndex: 1,
    basePoints: 100,
  },
  {
    id: 'gk-004',
    categoryId: 'general-knowledge',
    prompt: 'What is the largest ocean on Earth?',
    answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswerIndex: 3,
    basePoints: 100,
  },
  {
    id: 'gk-005',
    categoryId: 'general-knowledge',
    prompt: 'In which year did World War II end?',
    answers: ['1943', '1944', '1945', '1946'],
    correctAnswerIndex: 2,
    basePoints: 100,
  },
  {
    id: 'gk-006',
    categoryId: 'general-knowledge',
    prompt: 'What is the chemical symbol for gold?',
    answers: ['Ag', 'Fe', 'Au', 'Cu'],
    correctAnswerIndex: 2,
    basePoints: 100,
  },
  {
    id: 'sci-001',
    categoryId: 'science',
    prompt: 'What is the speed of light in a vacuum (approx)?',
    answers: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '200,000 km/s'],
    correctAnswerIndex: 0,
    basePoints: 100,
  },
  {
    id: 'sci-002',
    categoryId: 'science',
    prompt: 'What is the atomic number of hydrogen?',
    answers: ['2', '1', '3', '4'],
    correctAnswerIndex: 1,
    basePoints: 100,
  },
  {
    id: 'sci-003',
    categoryId: 'science',
    prompt: 'Which gas do plants absorb during photosynthesis?',
    answers: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    correctAnswerIndex: 2,
    basePoints: 100,
  },
  {
    id: 'sci-004',
    categoryId: 'science',
    prompt: 'What force keeps planets in orbit around the Sun?',
    answers: ['Magnetism', 'Gravity', 'Electrostatics', 'Nuclear force'],
    correctAnswerIndex: 1,
    basePoints: 100,
  },
  {
    id: 'sci-005',
    categoryId: 'science',
    prompt: 'How many bones are in the adult human body?',
    answers: ['196', '206', '216', '226'],
    correctAnswerIndex: 1,
    basePoints: 100,
  },
  {
    id: 'sci-006',
    categoryId: 'science',
    prompt: 'What is the powerhouse of the cell?',
    answers: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'],
    correctAnswerIndex: 2,
    basePoints: 100,
  },
]

export function getQuestionsByCategory(categoryId: string): Question[] {
  return ALL_QUESTIONS.filter(q => q.categoryId === categoryId)
}
