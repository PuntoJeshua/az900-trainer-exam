import React from 'react';
import { useStore } from '../store/useStore';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Dashboard: React.FC = () => {
    const { progress } = useStore();

    // Calculate readiness (real logic)
    const totalAnswered = Object.keys(progress.answeredQuestions).length;
    const correctCount = Object.values(progress.answeredQuestions).filter(q => q.correct).length;
    // Simple heuristic: 100 questions = 100% readiness contribution, multiplied by accuracy
    const volumeFactor = Math.min(totalAnswered / 50, 1);
    const accuracyFactor = totalAnswered > 0 ? (correctCount / totalAnswered) : 0;

    const readiness = Math.round(volumeFactor * accuracyFactor * 100);

    const data = Object.entries(progress.domainMastery).map(([name, value]) => ({
        name,
        value: Math.max(value, 5) // Ensure at least small slice for visibility
    }));

    const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Panel de Control</h1>
                <p className="text-slate-500 dark:text-slate-400">Tu camino hacia la certificación AZ-900</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Readiness Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-2">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Nivel de Preparación</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Estimación basada en tus últimas sesiones.</p>
                        </div>
                        <div className="bg-azure-100 dark:bg-azure-900/40 text-azure-700 dark:text-azure-400 px-3 py-1 rounded-full text-sm font-bold">
                            {readiness}%
                        </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-azure-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${readiness}%` }}
                        />
                    </div>
                    <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                        Aún no estás listo. Recomendamos completar al menos 2 dominios más.
                    </p>

                    <Link to="/practice" className="mt-6 inline-flex items-center gap-2 bg-azure-600 hover:bg-azure-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-azure-900/20">
                        <Play size={18} fill="currentColor" />
                        Continuar Práctica
                    </Link>
                </div>

                {/* Stats Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 w-full">Dominio por Área</h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f1f5f9' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
