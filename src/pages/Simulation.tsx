import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { QuestionCard } from '../components/QuestionCard';
import { Timer, AlertTriangle, ArrowRight, Play } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export const Simulation: React.FC = () => {
    const { questions, addExamResult } = useStore();
    const navigate = useNavigate();

    // Game States
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Exam State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({}); // valid questionId -> optionId
    const [flagged, setFlagged] = useState<Set<string>>(new Set());
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds

    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        let interval: any;
        if (isPlaying && !isFinished && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying && !isFinished) {
            finishExam();
        }
        return () => clearInterval(interval);
    }, [isPlaying, isFinished, timeLeft]);

    const startExam = () => {
        setIsPlaying(true);
        setAnswers({});
        setFlagged(new Set());
        setTimeLeft(60 * 60);
        setCurrentIndex(0);
    };

    const finishExam = () => {
        setIsFinished(true);
        setIsPlaying(false);

        // Calculate Score
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] && q.correctOptionIds.includes(answers[q.id])) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 70;

        addExamResult({
            id: crypto.randomUUID(),
            date: Date.now(),
            score,
            passed,
            durationSeconds: 3600 - timeLeft
        });
    };

    const handleSelect = (optionId: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionId
        }));
    };

    const toggleFlag = () => {
        const newFlags = new Set(flagged);
        if (newFlags.has(currentQuestion.id)) {
            newFlags.delete(currentQuestion.id);
        } else {
            newFlags.add(currentQuestion.id);
        }
        setFlagged(newFlags);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // INTRO SCREEN
    if (!isPlaying && !isFinished) {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
                <div className="bg-azure-50 dark:bg-azure-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-azure-600 dark:text-azure-400">
                    <Timer size={48} />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Simulacro de Examen</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Estás a punto de comenzar un simulacro completo del examen AZ-900.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-lg mx-auto">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="block text-sm text-slate-500 font-bold uppercase">Tiempo</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">60 min</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="block text-sm text-slate-500 font-bold uppercase">Preguntas</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{questions.length}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="block text-sm text-slate-500 font-bold uppercase">Aprobación</span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">70%</span>
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        onClick={startExam}
                        className="bg-azure-600 hover:bg-azure-700 text-white text-xl font-bold py-4 px-12 rounded-2xl shadow-xl shadow-azure-900/20 transition-transform hover:scale-105 flex items-center gap-3 mx-auto"
                    >
                        <Play fill="currentColor" />
                        Comenzar Examen
                    </button>
                </div>
            </div>
        );
    }

    // RESULTS SCREEN
    if (isFinished) {
        // Recalculate for display
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] && q.correctOptionIds.includes(answers[q.id])) {
                correctCount++;
            }
        });
        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= 70;

        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-8 animate-in zoom-in-95">
                <div className={clsx(
                    "w-32 h-32 rounded-full flex items-center justify-center mx-auto border-8",
                    passed ? "bg-green-50 border-green-500 text-green-600" : "bg-red-50 border-red-500 text-red-600"
                )}>
                    <span className="text-4xl font-extrabold">{score}%</span>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        {passed ? "¡Felicidades! Aprobaste" : "Esta vez no fue suficiente"}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                        Has respondido correctamente {correctCount} de {questions.length} preguntas.
                    </p>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Volver al Panel
                    </button>
                    <button
                        onClick={startExam}
                        className="px-6 py-3 bg-azure-600 text-white rounded-xl font-bold hover:bg-azure-700 transition-colors shadow-lg"
                    >
                        Intentar de Nuevo
                    </button>
                </div>
            </div>
        );
    }

    // EXAM RUNNER
    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Pregunta</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{currentIndex + 1} <span className="text-slate-400 text-base font-normal">/ {questions.length}</span></span>
                </div>

                <div className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg",
                    timeLeft < 300 ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                )}>
                    <Timer size={20} />
                    {formatTime(timeLeft)}
                </div>

                <button
                    onClick={finishExam}
                    className="text-sm font-bold text-slate-500 hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                    Finalizar
                </button>
            </div>

            {/* Question Area */}
            <div className="flex-1 overflow-y-auto mb-6">
                <QuestionCard
                    question={currentQuestion}
                    selectedOptionId={answers[currentQuestion.id] || null}
                    onSelectOption={handleSelect}
                    showFeedback={false} // Exam mode: NO Feedback!
                />
            </div>

            {/* Navigation Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={toggleFlag}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors",
                            flagged.has(currentQuestion.id)
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-slate-50 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-100"
                        )}
                    >
                        <AlertTriangle size={16} fill={flagged.has(currentQuestion.id) ? "currentColor" : "none"} />
                        {flagged.has(currentQuestion.id) ? "Marcada" : "Marcar para revisión"}
                    </button>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 rounded-lg font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => {
                            if (currentIndex === questions.length - 1) {
                                finishExam();
                            } else {
                                setCurrentIndex(prev => prev + 1);
                            }
                        }}
                        className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold hover:opacity-90 flex items-center gap-2"
                    >
                        {currentIndex === questions.length - 1 ? "Finalizar Examen" : "Siguiente"}
                        {currentIndex < questions.length - 1 && <ArrowRight size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
