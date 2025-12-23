
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap, Moon, Sun, User, Maximize2, Minimize2, BookA, List } from 'lucide-react';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { settings, toggleDarkMode, toggleZenMode } = useStore();

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Panel' },
        { to: '/practice', icon: BookOpen, label: 'Práctica' },
        { to: '/simulation', icon: GraduationCap, label: 'Simulacro' },
        { to: '/flashcards', icon: BookA, label: 'Flashcards' },
        { to: '/glossary', icon: List, label: 'Glosario' },
        { to: '/profile', icon: User, label: 'Perfil' },
    ];

    return (
        <div className={clsx("min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative")}>
            {/* Sidebar - Hidden in Zen Mode */}
            <aside className={clsx(
                "bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col fixed h-full z-10 transition-transform duration-300",
                settings.zenMode ? "-translate-x-full" : "w-64 translate-x-0"
            )}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-8 h-8 bg-azure-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">AZ</span>
                    </div>
                    <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">Trainer</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-azure-50 text-azure-700 dark:bg-azure-900/30 dark:text-azure-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                )
                            }
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                    <button
                        onClick={toggleZenMode}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all font-medium"
                    >
                        <Maximize2 size={20} />
                        <span>Modo Zen</span>
                    </button>
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all font-medium"
                    >
                        {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span>{settings.darkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={clsx(
                "flex-1 p-8 overflow-y-auto transition-all duration-300",
                settings.zenMode ? "ml-0" : "ml-64"
            )}>
                {/* Zen Mode Restore Button */}
                {settings.zenMode && (
                    <button
                        onClick={toggleZenMode}
                        className="fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-3 rounded-full shadow-xl hover:scale-110 transition-transform z-50"
                        title="Salir del Modo Zen"
                    >
                        <Minimize2 size={24} />
                    </button>
                )}

                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

