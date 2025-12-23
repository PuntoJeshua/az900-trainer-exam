import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, Question } from '../types';
import { questions as initialQuestions } from '../data/questions';

interface Store extends AppState {
    setQuestions: (questions: Question[]) => void;
    setMode: (mode: AppState['settings']['appMode']) => void;
    toggleDarkMode: () => void;
    toggleZenMode: () => void;
    resetProgress: () => void;
    addExamResult: (result: import('../types').ExamResult) => void;
    answerQuestion: (questionId: string, optionId: string, correct: boolean, confidence: 'High' | 'Low') => void;
    toggleBookmark: (questionId: string) => void;
}

export const useStore = create<Store>()(
    persist(
        (set) => ({
            questions: initialQuestions,
            progress: {
                answeredQuestions: {},
                domainMastery: {
                    'Conceptos de la nube': 0,
                    'Servicios principales de Azure': 0,
                    'Seguridad, cumplimiento e identidad': 0,
                    'Precios, SLA y soporte': 0,
                },
                history: [],
                bookmarks: []
            },
            settings: {
                darkMode: false,
                appMode: 'Estudio',
                zenMode: false
            },
            setQuestions: (qs) => set({ questions: qs }),
            setMode: (mode) => set((state) => ({ settings: { ...state.settings, appMode: mode } })),
            toggleZenMode: () => set((state) => ({ settings: { ...state.settings, zenMode: !state.settings.zenMode } })),
            toggleDarkMode: () => set((state) => {
                const newMode = !state.settings.darkMode;
                if (newMode) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return { settings: { ...state.settings, darkMode: newMode } };
            }),
            addExamResult: (result) => set((state) => ({
                progress: {
                    ...state.progress,
                    history: [result, ...state.progress.history]
                }
            })),
            answerQuestion: (questionId, _optionId, correct, confidence) => set((state) => {
                const newAnswered = {
                    ...state.progress.answeredQuestions,
                    [questionId]: {
                        correct,
                        attempts: (state.progress.answeredQuestions[questionId]?.attempts || 0) + 1,
                        lastAnsweredAt: Date.now(),
                        confidence
                    }
                };

                // Recalculate Mastery
                // This is a simplified calculation: Correct % per domain
                // In a real app, this should be more complex (weighing complexity, etc.)
                const question = state.questions.find(q => q.id === questionId);
                const newMastery = { ...state.progress.domainMastery };

                if (question) {
                    const domainQuestions = state.questions.filter(q => q.domain === question.domain);
                    const domainAnswered = domainQuestions.filter(q => newAnswered[q.id]);
                    const correctCount = domainAnswered.filter(q => newAnswered[q.id].correct).length;

                    if (domainQuestions.length > 0) {
                        newMastery[question.domain] = (correctCount / domainQuestions.length) * 100;
                    }
                }

                return {
                    progress: {
                        ...state.progress,
                        answeredQuestions: newAnswered,
                        domainMastery: newMastery
                    }
                };
            }),
            toggleBookmark: (questionId) => set((state) => {
                const bookmarks = state.progress.bookmarks || [];
                const exists = bookmarks.includes(questionId);
                return {
                    progress: {
                        ...state.progress,
                        bookmarks: exists
                            ? bookmarks.filter(id => id !== questionId)
                            : [...bookmarks, questionId]
                    }
                };
            }),
            resetProgress: () => set(() => ({
                progress: {
                    answeredQuestions: {},
                    domainMastery: {
                        'Conceptos de la nube': 0,
                        'Servicios principales de Azure': 0,
                        'Seguridad, cumplimiento e identidad': 0,
                        'Precios, SLA y soporte': 0,
                    },
                    history: [],
                    bookmarks: []
                }
            })),
        }),
        {
            name: 'az900-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ progress: state.progress, settings: state.settings }),
        }
    )
);
