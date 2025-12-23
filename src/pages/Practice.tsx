import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { QuestionCard } from '../components/QuestionCard';
import { ArrowRight, Zap, Target, Layers, AlertCircle, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import type { Domain } from '../types';

type PracticeMode = 'ALL' | 'DOMAIN' | 'WEAKNESS' | 'MISTAKES' | 'BOOKMARKS';

export const Practice: React.FC = () => {
    const { questions, progress, answerQuestion, toggleBookmark } = useStore();

    // Setup State
    const [isSetup, setIsSetup] = useState(true);
    const [selectedMode, setSelectedMode] = useState<PracticeMode>('ALL');
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
    const [questionCount, setQuestionCount] = useState(10);

    // Session State
    const [sessionQuestions, setSessionQuestions] = useState<typeof questions>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // Derived States
    const weakestDomains = useMemo(() => {
        return Object.entries(progress.domainMastery)
            .sort(([, a], [, b]) => a - b)
            .slice(0, 2)
            .map(([d]) => d as Domain);
    }, [progress.domainMastery]);

    const mistakesCount = Object.values(progress.answeredQuestions).filter(a => !a.correct).length;
    const bookmarksCount = progress.bookmarks?.length || 0;

    const startSession = () => {
        let pool = questions;

        switch (selectedMode) {
            case 'DOMAIN':
                if (selectedDomain) pool = questions.filter(q => q.domain === selectedDomain);
                break;
            case 'WEAKNESS':
                pool = questions.filter(q => weakestDomains.includes(q.domain));
                break;
            case 'MISTAKES':
                pool = questions.filter(q => {
                    const ans = progress.answeredQuestions[q.id];
                    return ans && !ans.correct;
                });
                break;
            case 'BOOKMARKS':
                pool = questions.filter(q => progress.bookmarks?.includes(q.id));
                break;
            default:
                // ALL
                break;
        }

        // Shuffle and Slice
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        // Don't limit count if reviewing mistakes/bookmarks, user probably wants to see them all
        const limit = (selectedMode === 'MISTAKES' || selectedMode === 'BOOKMARKS') ? shuffled.length : questionCount;

        setSessionQuestions(shuffled.slice(0, limit));
        setCurrentIndex(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setIsSetup(false);
    };

    const handleAnswer = (optionId: string, confidence: 'High' | 'Low') => {
        const question = sessionQuestions[currentIndex];
        const isCorrect = question.correctOptionIds.includes(optionId);

        setSelectedOption(optionId);
        setShowFeedback(true);

        answerQuestion(question.id, optionId, isCorrect, confidence);
    };

    const nextQuestion = () => {
        if (currentIndex < sessionQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        } else {
            setIsSetup(true);
        }
    };

    // SETUP SCREEN
    if (isSetup) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Modo Práctica</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400">Personaliza tu sesión de estudio.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* STANDARD MODES */}
                    <button
                        onClick={() => { setSelectedMode('ALL'); setSelectedDomain(null); }}
                        className={clsx(
                            "p-6 rounded-2xl border-2 text-left transition-all hover:scale-105",
                            selectedMode === 'ALL'
                                ? "border-azure-500 bg-azure-50 dark:bg-azure-900/20 ring-2 ring-azure-200 dark:ring-azure-800"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-azure-300"
                        )}
                    >
                        <Layers size={32} className="text-azure-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aleatorio</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Mezcla de todos los dominios.</p>
                    </button>

                    <button
                        onClick={() => { setSelectedMode('WEAKNESS'); setSelectedDomain(null); }}
                        className={clsx(
                            "p-6 rounded-2xl border-2 text-left transition-all hover:scale-105 relative overflow-hidden",
                            selectedMode === 'WEAKNESS'
                                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-200 dark:ring-orange-800"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-orange-300"
                        )}
                    >
                        <Zap size={32} className="text-orange-500 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ataque de Debilidades</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Enfócate en: <span className="font-bold text-orange-600 italic">{weakestDomains.join(', ')}</span></p>
                    </button>

                    <button
                        onClick={() => setSelectedMode('DOMAIN')}
                        className={clsx(
                            "p-6 rounded-2xl border-2 text-left transition-all hover:scale-105",
                            selectedMode === 'DOMAIN'
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-200 dark:ring-purple-800"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300"
                        )}
                    >
                        <Target size={32} className="text-purple-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Por Dominio</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Elige un tema específico.</p>
                    </button>

                    {/* REVIEW MODES */}
                    <button
                        onClick={() => { setSelectedMode('MISTAKES'); setSelectedDomain(null); }}
                        disabled={mistakesCount === 0}
                        className={clsx(
                            "p-6 rounded-2xl border-2 text-left transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed md:col-span-1.5",
                            selectedMode === 'MISTAKES'
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-200 dark:ring-red-800"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300"
                        )}
                    >
                        <AlertCircle size={32} className="text-red-500 mb-4" />
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Repasar Errores</h3>
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">{mistakesCount}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Vuelve a intentar las preguntas que fallaste.</p>
                    </button>

                    <button
                        onClick={() => { setSelectedMode('BOOKMARKS'); setSelectedDomain(null); }}
                        disabled={bookmarksCount === 0}
                        className={clsx(
                            "p-6 rounded-2xl border-2 text-left transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed md:col-span-1.5",
                            selectedMode === 'BOOKMARKS'
                                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 ring-2 ring-yellow-200 dark:ring-yellow-800"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-yellow-300"
                        )}
                    >
                        <Bookmark size={32} className="text-yellow-500 mb-4" />
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Marcadores</h3>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">{bookmarksCount}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Preguntas guardadas para revisión.</p>
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in space-y-6">
                    {/* Domain Selector */}
                    {selectedMode === 'DOMAIN' && (
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Selecciona el Dominio:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.keys(progress.domainMastery).map((domain) => (
                                    <button
                                        key={domain}
                                        onClick={() => setSelectedDomain(domain as Domain)}
                                        className={clsx(
                                            "px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                                            selectedDomain === domain
                                                ? "bg-purple-600 text-white shadow-lg"
                                                : "bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                                        )}
                                    >
                                        {domain}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Slider - Only for generated sets (ALL, DOMAIN, WEAKNESS) */}
                    {['ALL', 'DOMAIN', 'WEAKNESS'].includes(selectedMode) && (
                        <div>
                            <div className="flex justify-between mb-2">
                                <h4 className="font-bold text-slate-900 dark:text-white">Cantidad de Preguntas</h4>
                                <span className="text-azure-600 font-bold bg-azure-50 px-3 py-0.5 rounded-lg">{questionCount}</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max={questions.length}
                                step="5"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-azure-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>5</span>
                                <span>{questions.length}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center pt-8">
                    <button
                        onClick={startSession}
                        disabled={
                            (selectedMode === 'DOMAIN' && !selectedDomain) ||
                            (selectedMode === 'MISTAKES' && mistakesCount === 0) ||
                            (selectedMode === 'BOOKMARKS' && bookmarksCount === 0)
                        }
                        className="bg-azure-600 hover:bg-azure-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold py-4 px-12 rounded-2xl shadow-xl shadow-azure-900/20 transition-all hover:scale-105 flex items-center gap-3"
                    >
                        Comenzar Sesión <ArrowRight />
                    </button>
                </div>
            </div>
        );
    }

    // PRACTICE RUNNER
    const question = sessionQuestions[currentIndex];

    if (!question) return <div>No hay preguntas disponibles.</div>;

    const isBookmarked = progress.bookmarks?.includes(question.id);

    return (
        <div className="max-w-3xl mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setIsSetup(true)}
                    className="text-sm font-medium text-slate-500 hover:text-azure-600 transition-colors"
                >
                    ← Terminar Sesión
                </button>
                <div className="text-sm font-bold text-slate-400">
                    Pregunta {currentIndex + 1} de {sessionQuestions.length}
                </div>
            </div>

            <QuestionCard
                question={question}
                selectedOptionId={selectedOption}
                onSelectOption={handleAnswer}
                showFeedback={showFeedback}
                isBookmarked={isBookmarked}
                onToggleBookmark={toggleBookmark}
            />

            {showFeedback && (
                <div className="flex justify-end mt-6 animate-in slide-in-from-bottom-2">
                    <button
                        onClick={nextQuestion}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        {currentIndex < sessionQuestions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Sesión'}
                        <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};
