import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Trash2, AlertTriangle, TrendingUp, Calendar, Clock } from 'lucide-react';


export const Profile: React.FC = () => {
    const { progress, resetProgress } = useStore();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Calculate generic stats
    const totalQuestionsAnswered = Object.keys(progress.answeredQuestions).length;
    const correctCount = Object.values(progress.answeredQuestions).filter(q => q.correct).length;
    const accuracy = totalQuestionsAnswered > 0 ? Math.round((correctCount / totalQuestionsAnswered) * 100) : 0;

    const handleReset = () => {
        resetProgress();
        setShowDeleteConfirm(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mi Perfil</h1>
                <p className="text-slate-500 dark:text-slate-400">Gestiona tu progreso y revisa tus estadísticas.</p>
            </header>

            {showSuccess && (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl border border-green-200 dark:border-green-800 flex items-center justify-center animate-in fade-in slide-in-from-top-2">
                    <span className="font-bold">¡Progreso eliminado correctamente!</span>
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
                        <TrendingUp size={20} />
                        <span className="font-semibold text-sm uppercase tracking-wide">Precisión General</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {accuracy}%
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
                        <Calendar size={20} />
                        <span className="font-semibold text-sm uppercase tracking-wide">Preguntas Respondidas</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {totalQuestionsAnswered}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-slate-400">
                        <Clock size={20} />
                        <span className="font-semibold text-sm uppercase tracking-wide">Simulacros Completados</span>
                    </div>
                    <div className="text-4xl font-bold text-slate-900 dark:text-white">
                        {progress.history.length}
                    </div>
                </div>
            </div>

            {/* Domain Breakdown */}
            <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Detalle por Dominio</h2>
                <div className="space-y-4">
                    {Object.entries(progress.domainMastery).map(([name, mastery]) => (
                        <div key={name}>
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-700 dark:text-slate-300 font-medium">{name}</span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm">{Math.round(mastery as number)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-azure-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${mastery}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* History */}
            <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Historial de Simulacros</h2>
                {progress.history.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 italic">
                        Aún no has completado ningún simulacro de examen.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* List exam attempts here in future */}
                    </div>
                )}
            </section>

            {/* Danger Zone */}
            <section className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 rounded-2xl p-6">
                <h2 className="text-red-700 dark:text-red-400 font-bold mb-2 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Zona de Peligro
                </h2>
                <p className="text-red-600 dark:text-red-300/80 mb-6 text-sm">
                    Estas acciones no se pueden deshacer. Ten cuidado.
                </p>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors font-medium text-sm"
                    >
                        <Trash2 size={16} />
                        Reiniciar todo el progreso
                    </button>
                ) : (
                    <div className="bg-white dark:bg-red-950/50 p-4 rounded-xl border border-red-200 dark:border-red-800/50 animate-in zoom-in-95 duration-200">
                        <p className="font-bold text-slate-900 dark:text-white mb-2">¿Estás absolutamente seguro?</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Esto borrará todo tu historial de preguntas, maestría de dominios y resultados de simulacros.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                            >
                                Sí, eliminar todo
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};
