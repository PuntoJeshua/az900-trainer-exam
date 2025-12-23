import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, ArrowRight, RotateCw, Shuffle } from 'lucide-react';
import clsx from 'clsx';

export const Flashcards: React.FC = () => {
    const { questions } = useStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Create flashcard data from questions (Concept -> Explanation/Key Fact)
    // In a real app, this might be a separate dataset, but we can adapt questions.
    const flashcards = questions.map(q => ({
        id: q.id,
        front: q.text,
        back: q.explanation,
        domain: q.domain,
        keyword: q.keyword
    }));

    const currentCard = flashcards[currentIndex];

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % flashcards.length);
        }, 200);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        }, 200);
    };

    const shuffleCards = () => {
        // Simple shuffle for now just picks a random index
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex(Math.floor(Math.random() * flashcards.length));
        }, 200);
    };

    return (
        <div className="max-w-2xl mx-auto py-8 text-center space-y-8 h-[calc(100vh-100px)] flex flex-col justify-center">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Flashcards</h2>
                <span className="text-slate-500 font-mono text-sm">
                    {currentIndex + 1} / {flashcards.length}
                </span>
            </div>

            <div
                className="relative w-full aspect-[3/2] perspective-1000 cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className={clsx(
                    "w-full h-full relative transition-all duration-500 transform-style-3d shadow-xl rounded-3xl",
                    isFlipped ? "rotate-y-180" : ""
                )}>
                    {/* Front */}
                    <div className="absolute w-full h-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col justify-center items-center backface-hidden">
                        <span className="text-xs font-bold text-azure-500 uppercase tracking-widest mb-4">Pregunta</span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                            {currentCard.front}
                        </h3>
                        <p className="absolute bottom-8 text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <RotateCw size={12} /> Clic para girar
                        </p>
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full bg-azure-600 text-white rounded-3xl p-8 flex flex-col justify-center items-center backface-hidden rotate-y-180">
                        <span className="text-xs font-bold text-azure-200 uppercase tracking-widest mb-4">Explicación</span>
                        <p className="text-xl font-medium leading-relaxed">
                            {currentCard.back}
                        </p>
                        <div className="mt-6 inline-block bg-azure-700/50 px-3 py-1 rounded-full text-sm font-bold border border-azure-400/30">
                            {currentCard.keyword}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-6 mt-8">
                <button
                    onClick={(e) => { e.stopPropagation(); prevCard(); }}
                    className="p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                    <ArrowLeft size={24} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); shuffleCards(); }}
                    className="p-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-azure-600 dark:text-azure-400 hover:bg-azure-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    title="Aleatorio"
                >
                    <Shuffle size={24} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextCard(); }}
                    className="p-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:scale-110 transition-transform"
                >
                    <ArrowRight size={24} />
                </button>
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};
