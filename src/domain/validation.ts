import type { Question } from './types'

export function validateQuestion(q: unknown): q is Question {
  if (!q || typeof q !== 'object') return false
  const question = q as Record<string, unknown>
  if (typeof question['id'] !== 'string' || question['id'] === '') return false
  if (typeof question['categoryId'] !== 'string' || question['categoryId'] === '') return false
  if (typeof question['prompt'] !== 'string' || question['prompt'] === '') return false
  if (!Array.isArray(question['answers']) || question['answers'].length !== 4) return false
  if ((question['answers'] as unknown[]).some(a => typeof a !== 'string' || a === '')) return false
  const idx = question['correctAnswerIndex']
  if (typeof idx !== 'number' || ![0, 1, 2, 3].includes(idx)) return false
  if (typeof question['basePoints'] !== 'number' || question['basePoints'] <= 0) return false
  return true
}

export function validateQuestionBank(questions: unknown[]): asserts questions is Question[] {
  const valid = questions.filter(validateQuestion)
  if (valid.length < 10) {
    throw new Error(`Question bank must have at least 10 valid questions, got ${valid.length}`)
  }
  const categories = new Set(valid.map(q => q.categoryId))
  if (categories.size < 2) {
    throw new Error(`Question bank must span at least 2 categories, got ${categories.size}`)
  }
}
