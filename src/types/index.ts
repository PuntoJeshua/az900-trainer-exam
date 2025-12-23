export type Domain =
    | 'Conceptos de la nube'
    | 'Servicios principales de Azure'
    | 'Seguridad, cumplimiento e identidad'
    | 'Precios, SLA y soporte';

export type Complexity = 'Basico' | 'Intermedio' | 'Avanzado';

export interface Option {
    id: string;
    text: string;
}

export interface Question {
    id: string;
    text: string;
    options: Option[];
    correctOptionIds: string[];
    domain: Domain;
    explanation: string;
    complexity: Complexity;
    keyword: string; // "Palabra clave que define la respuesta"
    learnMoreUrl?: string;
}

export type QuestionStatus = 'No visto' | 'Inestable' | 'Dominado' | 'Listo para examen';

export interface ExamResult {
    id: string;
    date: number; // timestamp
    score: number; // percentage
    passed: boolean; // >= 70% typically
    durationSeconds: number;
}

export interface UserProgress {
    answeredQuestions: Record<string, {
        correct: boolean;
        attempts: number;
        lastAnsweredAt: number; // timestamp
        confidence?: 'High' | 'Low';
    }>;
    domainMastery: Record<Domain, number>; // 0-100
    history: ExamResult[];
    bookmarks: string[];
}

export interface AppState {
    questions: Question[];
    progress: UserProgress;
    settings: {
        darkMode: boolean;
        appMode: 'Estudio' | 'Practica' | 'Simulacion';
        zenMode: boolean;
    };
}
