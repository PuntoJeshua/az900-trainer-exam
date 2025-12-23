import React, { useState } from 'react';
import { ExternalLink, Check, X, BookOpen, HelpCircle, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import type { Question } from '../types';

interface QuestionCardProps {
    question: Question;
    selectedOptionId: string | null;
    onSelectOption: (optionId: string, confidence: 'High' | 'Low') => void;
    showFeedback: boolean;
    isBookmarked?: boolean;
    onToggleBookmark?: (id: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    selectedOptionId,
    onSelectOption,
    showFeedback,
    isBookmarked = false,
    onToggleBookmark
}) => {
    const [confidence, setConfidence] = useState<'High' | 'Low'>('High');

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 relative group">

            {/* Bookmark Button */}
            {onToggleBookmark && (
                <button
                    onClick={() => onToggleBookmark(question.id)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
                    title={isBookmarked ? "Quitar de favoritos" : "Guardar pregunta"}
                >
                    <Bookmark
                        size={24}
                        className={clsx(
                            "transition-all duration-300",
                            isBookmarked ? "fill-yellow-400 text-yellow-400 scale-110" : "text-slate-300 group-hover:text-slate-400"
                        )}
                    />
                </button>
            )}

            <div className="flex items-start gap-4 mb-6 pr-12">
                <span className={clsx(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    question.complexity === 'Basic' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        question.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}>
                    {question.complexity === 'Basic' ? 'Básico' : question.complexity === 'Intermediate' ? 'Intermedio' : 'Avanzado'}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider py-1">
                    {question.domain}
                </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
                {question.text}
            </h3>

            {/* Confidence Meter - Only show if not yet answered */}
            {!showFeedback && !selectedOptionId && (
                <div className="mb-6 flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <HelpCircle size={16} />
                        <span className="text-sm font-medium">¿Qué tan seguro estás?</span>
                    </div>
                    <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setConfidence('High')}
                            className={clsx(
                                "px-3 py-1 rounded-md text-sm font-bold transition-colors",
                                confidence === 'High'
                                    ? "bg-azure-100 text-azure-700 dark:bg-azure-900/50 dark:text-azure-300 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            Seguro
                        </button>
                        <button
                            onClick={() => setConfidence('Low')}
                            className={clsx(
                                "px-3 py-1 rounded-md text-sm font-bold transition-colors",
                                confidence === 'Low'
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 shadow-sm"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            )}
                        >
                            Dudando
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {question.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrect = question.correctOptionIds.includes(option.id);
                    const showCorrect = showFeedback && isCorrect;
                    const showIncorrect = showFeedback && isSelected && !isCorrect;

                    return (
                        <button
                            key={option.id}
                            onClick={() => !showFeedback && onSelectOption(option.id, confidence)}
                            disabled={showFeedback}
                            className={clsx(
                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative",
                                showCorrect
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : showIncorrect
                                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                        : isSelected
                                            ? "border-azure-500 bg-azure-50 dark:bg-azure-900/20 dark:border-azure-400"
                                            : "border-slate-200 dark:border-slate-700 hover:border-azure-200 dark:hover:border-slate-600 bg-transparent dark:text-slate-200"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{option.text}</span>
                                {showCorrect && <Check className="text-green-600" size={20} />}
                                {showIncorrect && <X className="text-red-600" size={20} />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {showFeedback && (
                <div className="mt-8 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-2 text-azure-600 dark:text-azure-400 font-bold">
                            <BookOpen size={18} />
                            <span>Explicación</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-3">
                            {question.explanation}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Palabra Clave: <span className="text-slate-700 dark:text-slate-200">{question.keyword}</span>
                            </span>
                            {question.learnMoreUrl && (
                                <a
                                    href={question.learnMoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-xs font-bold text-azure-600 dark:text-azure-400 hover:underline"
                                >
                                    <ExternalLink size={12} />
                                    Microsoft Learn
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
