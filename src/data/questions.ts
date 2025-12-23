import type { Question } from '../types';

export const questions: Question[] = [
    {
        id: 'qm-1',
        text: 'Una empresa quiere migrar sus servidores físicos a Azure, pero necesita mantener el control total sobre el sistema operativo y el software instalado. ¿Qué modelo de servicio en la nube debería elegir?',
        options: [
            { id: 'a', text: 'IaaS (Infraestructura como servicio)' },
            { id: 'b', text: 'PaaS (Plataforma como servicio)' },
            { id: 'c', text: 'SaaS (Software como servicio)' },
            { id: 'd', text: 'FaaS (Funciones como servicio)' }
        ],
        correctOptionIds: ['a'],
        domain: 'Conceptos de la nube',
        explanation: 'IaaS ofrece el mayor nivel de control sobre la infraestructura, incluyendo el sistema operativo y las aplicaciones. PaaS gestiona el SO por ti, y SaaS es software listo para usar.',
        complexity: 'Basic',
        keyword: 'control total',
        learnMoreUrl: 'https://learn.microsoft.com/es-es/azure/cloud-adoption-framework/migrate/azure-best-practices/iaas-paas-saas'
    },
    {
        id: 'qm-2',
        text: '¿Cuál es el beneficio principal de usar zonas de disponibilidad en Azure?',
        options: [
            { id: 'a', text: 'Reducir la latencia entre regiones' },
            { id: 'b', text: 'Proteger contra fallos de un centro de datos completo' },
            { id: 'c', text: 'Ofrecer replicación global de datos' },
            { id: 'd', text: 'Minimizar los costos de almacenamiento' }
        ],
        correctOptionIds: ['b'],
        domain: 'Servicios principales de Azure',
        explanation: 'Las zonas de disponibilidad son ubicaciones físicas separadas dentro de una misma región, diseñadas para proteger sus aplicaciones y datos de fallos en el centro de datos.',
        complexity: 'Intermediate',
        keyword: 'fallos de centro de datos'
    },
    {
        id: 'qm-3',
        text: '¿Qué servicio de Azure utilizaría para gestionar las identidades de los usuarios y controlar el acceso a sus aplicaciones?',
        options: [
            { id: 'a', text: 'Azure Policy' },
            { id: 'b', text: 'Azure Active Directory (Entra ID)' },
            { id: 'c', text: 'Azure Key Vault' },
            { id: 'd', text: 'Azure Monitor' }
        ],
        correctOptionIds: ['b'],
        domain: 'Seguridad, cumplimiento e identidad',
        explanation: 'Azure Active Directory (ahora Microsoft Entra ID) es el servicio de gestión de identidades y accesos basado en la nube de Microsoft.',
        complexity: 'Basic',
        keyword: 'gestionar identidades'
    },
    {
        id: 'qm-4',
        text: '¿Qué modelo de gasto se asocia típicamente con los servicios en la nube pública (OpEx vs CapEx)?',
        options: [
            { id: 'a', text: 'CapEx (Gastos de capital)' },
            { id: 'b', text: 'OpEx (Gastos operativos)' },
            { id: 'c', text: 'Costos fijos anuales' },
            { id: 'd', text: 'Pago por adelantado' }
        ],
        correctOptionIds: ['b'],
        domain: 'Conceptos de la nube',
        explanation: 'El modelo de consumo de la nube se basa en OpEx (Gastos Operativos), donde pagas por lo que usas en lugar de invertir en infraestructura física por adelantado (CapEx).',
        complexity: 'Basic',
        keyword: 'OpEx'
    },
    {
        id: 'qm-5',
        text: 'Necesita una solución para ejecutar código pequeño y basado en eventos sin administrar servidores. ¿Qué servicio debe elegir?',
        options: [
            { id: 'a', text: 'Azure Virtual Machines' },
            { id: 'b', text: 'Azure Kubernetes Service' },
            { id: 'c', text: 'Azure Functions' },
            { id: 'd', text: 'Azure App Service' }
        ],
        correctOptionIds: ['c'],
        domain: 'Servicios principales de Azure',
        explanation: 'Azure Functions es una solución "Serverless" (sin servidor) diseñada para ejecutar pequeños fragmentos de código en respuesta a eventos.',
        complexity: 'Intermediate',
        keyword: 'sin servidor'
    },
    {
        id: 'qm-6',
        text: '¿Qué herramienta de Azure le ayuda a monitorizar el estado, el rendimiento y la disponibilidad de sus aplicaciones?',
        options: [
            { id: 'a', text: 'Azure Advisor' },
            { id: 'b', text: 'Azure Monitor' },
            { id: 'c', text: 'Azure Service Health' },
            { id: 'd', text: 'Azure Arc' }
        ],
        correctOptionIds: ['b'],
        domain: 'Servicios principales de Azure',
        explanation: 'Azure Monitor recopila, analiza y actúa sobre los datos de telemetría de sus entornos locales y en la nube.',
        complexity: 'Intermediate',
        keyword: 'monitorizar rendimiento'
    },
    {
        id: 'qm-7',
        text: '¿Verdadero o Falso? En un modelo de Responsabilidad Compartida, el cliente es siempre responsable de la seguridad física de los centros de datos en la nube pública.',
        options: [
            { id: 'a', text: 'Verdadero' },
            { id: 'b', text: 'Falso' }
        ],
        correctOptionIds: ['b'],
        domain: 'Seguridad, cumplimiento e identidad',
        explanation: 'Falso. En la nube pública, el proveedor (Microsoft) es responsable de la seguridad física de los centros de datos.',
        complexity: 'Basic',
        keyword: 'seguridad física'
    },
    {
        id: 'qm-8',
        text: '¿Qué servicio utilizaría para filtrar el tráfico de red hacia y desde los recursos de Azure en una red virtual de Azure?',
        options: [
            { id: 'a', text: 'Application Gateway' },
            { id: 'b', text: 'Network Security Group (NSG)' },
            { id: 'c', text: 'Azure VPN Gateway' },
            { id: 'd', text: 'Azure Dedicated Host' }
        ],
        correctOptionIds: ['b'],
        domain: 'Seguridad, cumplimiento e identidad',
        explanation: 'Un Grupo de Seguridad de Red (NSG) contiene reglas de seguridad que permiten o deniegan el tráfico de red entrante o saliente.',
        complexity: 'Advanced',
        keyword: 'filtrar tráfico'
    },
    {
        id: 'qm-9',
        text: '¿Qué factor afecta directamente al costo de un servicio en Azure?',
        options: [
            { id: 'a', text: 'La dirección IP del usuario' },
            { id: 'b', text: 'El tipo de recurso y la región' },
            { id: 'c', text: 'La hora del día en que se creó la cuenta' },
            { id: 'd', text: 'El nombre del grupo de recursos' }
        ],
        correctOptionIds: ['b'],
        domain: 'Precios, SLA y soporte',
        explanation: 'Los costos varían según el tipo de recurso (VM, SQL, etc.), el uso y la región geográfica donde se despliega.',
        complexity: 'Basic',
        keyword: 'región'
    },
    {
        id: 'qm-10',
        text: '¿Cuál es el SLA (Acuerdo de Nivel de Servicio) garantizado para la versión gratuita de los servicios de Azure?',
        options: [
            { id: 'a', text: '99.9%' },
            { id: 'b', text: '99.95%' },
            { id: 'c', text: '99.99%' },
            { id: 'd', text: 'Normalmente no hay SLA para servicios gratuitos' }
        ],
        correctOptionIds: ['d'],
        domain: 'Precios, SLA y soporte',
        explanation: 'Los servicios gratuitos o en versión preliminar (Preview) generalmente no ofrecen un SLA garantizado financieramente.',
        complexity: 'Intermediate',
        keyword: 'servicios gratuitos'
    }
];
