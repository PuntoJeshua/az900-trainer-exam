import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search, Book } from 'lucide-react';

export const Glossary: React.FC = () => {
    const { questions } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredQuestions = questions.filter(q =>
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.explanation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Glosario & Buscador</h1>
                    <p className="text-slate-500 dark:text-slate-400">Encuentra preguntas, conceptos y palabras clave.</p>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por concepto, pregunta o palabra clave..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-azure-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredQuestions.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        No se encontraron resultados para "{searchTerm}"
                    </div>
                ) : (
                    filteredQuestions.map(q => (
                        <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-azure-300 dark:hover:border-azure-700 transition-colors group">
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                                    {q.domain}
                                </span>
                                <div className="text-xs font-bold text-azure-600 dark:text-azure-400 bg-azure-50 dark:bg-azure-900/30 px-2 py-1 rounded-md">
                                    {q.keyword}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-azure-600 transition-colors">
                                {q.text}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3 mt-3">
                                <Book className="inline-block mr-2 w-4 h-4 text-slate-400" />
                                {q.explanation}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
