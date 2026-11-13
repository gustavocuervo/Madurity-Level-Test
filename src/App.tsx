/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  BarChart3, 
  BrainCircuit, 
  Building2, 
  Mail, 
  UserCircle2, 
  Download, 
  Trash2, 
  Lock,
  LogOut,
  RefreshCcw,
  Trophy,
  ArrowRight
} from 'lucide-react';

// --- Constants & Data ---

const ROLES = [
  "Personal de IT",
  "Gerente General",
  "Sub-Gerente",
  "Gerente de Finanzas",
  "Gerente de Marketing",
  "Gerente de Recursos Humanos",
  "Gerente de Auditoría",
  "Gerente de Transformación / Innovación",
  "Gerente de Operaciones",
  "Gerente de Legal / Cumplimiento",
  "Gerente de Ventas",
  "Gerente de Customer Success"
];

const QUESTIONS = [
  {
    id: 1, peso: 0.09, cat: 'Conocimiento',
    text: '¿Qué nivel de conocimiento tiene la organización sobre IA?',
    options: [
      { label: 'a', text: 'Conocimiento muy limitado, apenas están familiarizándose con el concepto', pts: 1 },
      { label: 'b', text: 'Conocimiento básico, han investigado y consumido contenido sobre IA', pts: 2 },
      { label: 'c', text: 'Conocimiento intermedio, entienden aplicaciones y casos de uso', pts: 3 },
      { label: 'd', text: 'Conocimiento avanzado, tienen claridad sobre implementación', pts: 4 },
    ]
  },
  {
    id: 2, peso: 0.12, cat: 'Casos de Uso',
    text: '¿La organización tiene casos de uso de IA identificados?',
    options: [
      { label: 'a', text: 'No tienen casos de uso identificados', pts: 1 },
      { label: 'b', text: 'Tienen ideas vagas pero sin documentar', pts: 2 },
      { label: 'c', text: 'Tienen 1-3 casos de uso claramente identificados', pts: 3 },
      { label: 'd', text: 'Tienen múltiples casos de uso priorizados y documentados', pts: 4 },
    ]
  },
  {
    id: 3, peso: 0.14, cat: 'Presupuesto',
    text: '¿Existe presupuesto asignado para iniciativas de IA?',
    options: [
      { label: 'a', text: 'No hay presupuesto asignado', pts: 1 },
      { label: 'b', text: 'Están explorando opciones de presupuesto', pts: 2 },
      { label: 'c', text: 'Tienen presupuesto aprobado para evaluación/planeación', pts: 3 },
      { label: 'd', text: 'Tienen presupuesto aprobado para implementación', pts: 4 },
    ]
  },
  {
    id: 4, peso: 0.13, cat: 'Liderazgo',
    text: '¿Qué nivel de apoyo ejecutivo tienen las iniciativas de IA?',
    options: [
      { label: 'a', text: 'No hay interés ejecutivo formal', pts: 1 },
      { label: 'b', text: 'Hay curiosidad a nivel ejecutivo', pts: 2 },
      { label: 'c', text: 'Hay un sponsor ejecutivo comprometido', pts: 3 },
      { label: 'd', text: 'Es una prioridad estratégica de la alta dirección', pts: 4 },
    ]
  },
  {
    id: 5, peso: 0.10, cat: 'Experimentación',
    text: '¿Han realizado alguna prueba o experimento con IA?',
    options: [
      { label: 'a', text: 'No han experimentado con IA', pts: 1 },
      { label: 'b', text: 'Han usado herramientas públicas de IA (ChatGPT, Copilot, etc.)', pts: 2 },
      { label: 'c', text: 'Han realizado pruebas de concepto internas o con proveedores', pts: 3 },
      { label: 'd', text: 'Tienen pilotos en ejecución o implementaciones parciales', pts: 4 },
    ]
  },
  {
    id: 6, peso: 0.08, cat: 'Equipo',
    text: '¿Cuentan con equipo dedicado a iniciativas de IA?',
    options: [
      { label: 'a', text: 'No hay equipo asignado', pts: 1 },
      { label: 'b', text: 'Hay personas interesadas pero sin rol formal', pts: 2 },
      { label: 'c', text: 'Tienen un equipo pequeño o personas asignadas parcialmente', pts: 3 },
      { label: 'd', text: 'Tienen un equipo dedicado con roles definidos', pts: 4 },
    ]
  },
  {
    id: 7, peso: 0.15, cat: 'Datos',
    text: '¿Cuál es el estado de sus datos para IA?',
    options: [
      { label: 'a', text: 'No han evaluado sus datos', pts: 1 },
      { label: 'b', text: 'Saben que tienen datos pero no están seguros de su calidad', pts: 2 },
      { label: 'c', text: 'Están evaluando y preparando sus datos', pts: 3 },
      { label: 'd', text: 'Tienen datos estructurados, accesibles y de calidad', pts: 4 },
    ]
  },
  {
    id: 8, peso: 0.07, cat: 'Urgencia',
    text: '¿Qué urgencia tiene la organización para implementar IA?',
    options: [
      { label: 'a', text: 'Es un tema de interés futuro — exploración', pts: 1 },
      { label: 'b', text: 'Quieren entender cómo aplicarlo este año', pts: 2 },
      { label: 'c', text: 'Necesitan definir estrategia y comenzar en 3-6 meses', pts: 3 },
      { label: 'd', text: 'Necesitan implementar soluciones en los próximos meses', pts: 4 },
    ]
  },
  {
    id: 9, peso: 0.07, cat: 'Métricas',
    text: '¿Han definido métricas de éxito para sus iniciativas de IA?',
    options: [
      { label: 'a', text: 'No han pensado en métricas', pts: 1 },
      { label: 'b', text: 'Tienen ideas generales de lo que quieren lograr', pts: 2 },
      { label: 'c', text: 'Tienen KPIs preliminares definidos', pts: 3 },
      { label: 'd', text: 'Tienen métricas claras y alineadas con objetivos de negocio', pts: 4 },
    ]
  },
  {
    id: 10, peso: 0.05, cat: 'Acompañamiento',
    text: '¿Qué tipo de acompañamiento buscan?',
    options: [
      { label: 'a', text: 'Educación y sensibilización sobre IA', pts: 1 },
      { label: 'b', text: 'Ayuda para definir estrategia y casos de uso', pts: 2 },
      { label: 'c', text: 'Validación de ideas y pruebas de concepto', pts: 3 },
      { label: 'd', text: 'Implementación y puesta en producción', pts: 4 },
    ]
  }
];

const STAGES = [
  {
    range: [0, 33],
    label: '1. Exploración',
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    borderColor: 'border-rose-400/20',
    desc: 'Las organizaciones en esta etapa recién están comenzando con la IA. Están aprendiendo y experimentando en áreas seleccionadas de la organización.',
    services: ['Workshop de Evolución de Ideas', 'Webinars de Adopción y Sensibilización', 'Casos de Uso y Estudios de Mercado', 'AI Data Ready', 'Innovation Studio']
  },
  {
    range: [34, 66],
    label: '2. Planeación',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
    desc: 'Las organizaciones en esta etapa están evaluando, definiendo y planificando activamente una estrategia de IA, ejecutando pruebas de concepto y planificando implementaciones.',
    services: ['Workshop de Alineación Estratégica', 'Validación de la IDEA (Express)', 'Industry Use Cases', 'Programa Ejecutivo de IA', 'Convenios de Colaboración / Co-desarrollo']
  },
  {
    range: [67, 100],
    label: '3. Pruebas y Producción',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
    desc: 'Las organizaciones en esta etapa están pasando de las pruebas de concepto y los pilotos a los ambientes productivos.',
    services: ['Product Discovery - Validaciones', 'Product Delivery - Plan de despliegue', 'Desarrollo de Casos en operación', 'Transición del MVP a un producto o servicio']
  }
];

// --- Components ---

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-8">
      <motion.div 
        className="h-full bg-emerald-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'intro' | 'user-info' | 'quiz' | 'results' | 'admin-login' | 'admin-dashboard'>('intro');
  const [userInfo, setUserInfo] = useState({ email: '', company: '', role: '' });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1));
  const [score, setScore] = useState(0);
  const [stage, setStage] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminData, setAdminData] = useState<any[]>([]);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Calculate score when answers change
  useEffect(() => {
    if (view === 'results') {
      let numerator = 0;
      let denominator = 0;
      QUESTIONS.forEach((q, i) => {
        const pts = answers[i] !== -1 ? q.options[answers[i]].pts : 0;
        numerator += q.peso * pts;
        denominator += q.peso;
      });
      const finalScore = Math.round((numerator / (4 * denominator)) * 100);
      setScore(finalScore);
      const finalStage = STAGES.find(s => finalScore >= s.range[0] && finalScore <= s.range[1]);
      setStage(finalStage);

      // Save to DB
      const saveData = async () => {
        setIsSaving(true);
        setSaveError(false);
        try {
          const res = await fetch('/api/save-assessment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...userInfo,
              score: finalScore,
              stage: finalStage?.label
            })
          });
          if (!res.ok) throw new Error('Failed to save');
        } catch (err) {
          console.error("Save error:", err);
          setSaveError(true);
        } finally {
          setIsSaving(false);
        }
      };

      saveData();
    }
  }, [view, answers, userInfo]);

  const handleReset = () => {
    setUserInfo({ email: '', company: '', role: '' });
    setCurrentQuestion(0);
    setAnswers(new Array(QUESTIONS.length).fill(-1));
    setScore(0);
    setStage(null);
    setView('intro');
  };

  const handleStart = () => {
    setUserInfo({ email: '', company: '', role: '' });
    setCurrentQuestion(0);
    setAnswers(new Array(QUESTIONS.length).fill(-1));
    setScore(0);
    setStage(null);
    setView('user-info');
  };
  
  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.email && userInfo.company && userInfo.role) {
      setView('quiz');
    }
  };

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setView('results');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const user = (form.elements.namedItem('user') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password })
    });

    if (res.ok) {
      setAdminAuth(true);
      fetchAdminData();
      setView('admin-dashboard');
    } else {
      alert('Credenciales inválidas');
    }
  };

  const fetchAdminData = async () => {
    setIsAdminLoading(true);
    setAdminError(null);
    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Error al cargar datos');
      }
      const data = await res.json();
      setAdminData(data);
    } catch (err: any) {
      console.error("Admin fetch error:", err);
      setAdminError(err.message);
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleClearData = async () => {
    if (confirm('¿Estás seguro de que deseas borrar todos los registros?')) {
      await fetch('/api/admin/clear', { method: 'POST' });
      fetchAdminData();
    }
  };

  const handleDownloadCSV = () => {
    window.location.href = '/api/admin/csv';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />

      <main className="w-full max-w-2xl z-10">
        <AnimatePresence mode="wait">
          
          {/* INTRO VIEW */}
          {view === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
                <BrainCircuit className="w-4 h-4" />
                Assessment v1.0
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white leading-tight">
                Mide tu <span className="text-emerald-400">Madurez</span> en IA
              </h1>
              <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
                Descubre en qué etapa se encuentra tu organización y recibe una hoja de ruta personalizada para acelerar tu adopción tecnológica.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button 
                  onClick={handleStart}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                >
                  Comenzar Evaluación
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setView('admin-login')}
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </button>
              </div>
            </motion.div>
          )}

          {/* USER INFO VIEW */}
          {view === 'user-info' && (
            <motion.div 
              key="user-info"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold text-white">Cuéntanos sobre ti</h2>
                <p className="text-slate-400">Necesitamos estos datos para personalizar tu reporte final.</p>
              </div>

              <form onSubmit={handleUserInfoSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Corporativo
                  </label>
                  <input 
                    required
                    type="email"
                    placeholder="ejemplo@empresa.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white"
                    value={userInfo.email}
                    onChange={e => setUserInfo({ ...userInfo, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Nombre de la Empresa
                  </label>
                  <input 
                    required
                    type="text"
                    placeholder="Nombre de tu organización"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white"
                    value={userInfo.company}
                    onChange={e => setUserInfo({ ...userInfo, company: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <UserCircle2 className="w-4 h-4" /> Tu Perfil / Rol
                  </label>
                  <select 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white appearance-none"
                    value={userInfo.role}
                    onChange={e => setUserInfo({ ...userInfo, role: e.target.value })}
                  >
                    <option value="" disabled className="bg-[#1a1a24]">Selecciona tu rol</option>
                    {ROLES.map(role => (
                      <option key={role} value={role} className="bg-[#1a1a24]">{role}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  Siguiente paso
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {/* QUIZ VIEW */}
          {view === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Pregunta {currentQuestion + 1} de {QUESTIONS.length}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {QUESTIONS[currentQuestion].cat} • Peso {Math.round(QUESTIONS[currentQuestion].peso * 100)}%
                </span>
              </div>
              
              <ProgressBar current={currentQuestion + 1} total={QUESTIONS.length} />

              <div className="glass-card p-8 md:p-12 rounded-[2.5rem] space-y-8 neon-border">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
                  {QUESTIONS[currentQuestion].text}
                </h3>

                <div className="grid gap-3">
                  {QUESTIONS[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 group ${
                        answers[currentQuestion] === idx 
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-white' 
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                        answers[currentQuestion] === idx 
                          ? 'border-emerald-500 bg-emerald-500' 
                          : 'border-slate-600 group-hover:border-slate-400'
                      }`}>
                        {answers[currentQuestion] === idx && <CheckCircle2 className="w-4 h-4 text-black" />}
                      </div>
                      <span className="text-base font-medium leading-relaxed">{opt.text}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={handleBack}
                    disabled={currentQuestion === 0}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white font-bold rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === -1}
                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {currentQuestion === QUESTIONS.length - 1 ? 'Finalizar' : 'Siguiente'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS VIEW */}
          {view === 'results' && stage && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold tracking-widest uppercase">
                  <Trophy className="w-4 h-4" /> Resultado Final
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Tu Nivel de Madurez</h2>
                
                {/* Sync Status */}
                <div className="flex justify-center pt-2">
                  {isSaving && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 animate-pulse">
                      <RefreshCcw className="w-3 h-3 animate-spin" /> Sincronizando con el servidor...
                    </div>
                  )}
                  {saveError && (
                    <div className="flex items-center gap-2 text-xs text-rose-400">
                      <Trash2 className="w-3 h-3" /> Error al guardar. Intenta de nuevo.
                    </div>
                  )}
                  {!isSaving && !saveError && (
                    <div className="flex items-center gap-2 text-xs text-emerald-500/60">
                      <CheckCircle2 className="w-3 h-3" /> Datos sincronizados correctamente
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className="md:col-span-1 glass-card p-8 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 neon-border">
                  <div className="text-6xl font-display font-bold text-emerald-400">{score}</div>
                  <div className="text-slate-500 text-sm uppercase tracking-widest font-bold">Puntos / 100</div>
                  <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tighter ${stage.bgColor} ${stage.color} border ${stage.borderColor}`}>
                    {stage.label}
                  </div>
                </div>

                {/* Description Card */}
                <div className="md:col-span-2 glass-card p-8 rounded-[2rem] space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" /> 
                    Análisis de Etapa
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {stage.desc}
                  </p>
                  <div className="pt-4 space-y-3">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Servicios Recomendados</h4>
                    <div className="flex flex-wrap gap-2">
                      {stage.services.map((s: string) => (
                        <span key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleReset}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Reiniciar Evaluación
                </button>
                <button 
                  onClick={() => setView('admin-login')}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Acceso Admin
                </button>
              </div>
            </motion.div>
          )}

          {/* ADMIN LOGIN VIEW */}
          {view === 'admin-login' && (
            <motion.div 
              key="admin-login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-12 rounded-[2.5rem] max-w-md mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Lock className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-display font-bold text-white">Admin Access</h2>
                <p className="text-slate-400">Ingresa tus credenciales de administrador.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Usuario</label>
                  <input 
                    name="user"
                    required
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Contraseña</label>
                  <input 
                    name="password"
                    required
                    type="password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-white"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Entrar
                </button>
                <button 
                  type="button"
                  onClick={handleReset}
                  className="w-full py-4 text-slate-500 hover:text-white transition-colors text-sm font-medium"
                >
                  Volver al inicio
                </button>
              </form>
            </motion.div>
          )}

          {/* ADMIN DASHBOARD VIEW */}
          {view === 'admin-dashboard' && (
            <motion.div 
              key="admin-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-3xl font-display font-bold text-white">Panel de Control</h2>
                  <p className="text-slate-400">Gestiona los resultados de las evaluaciones.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleDownloadCSV}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> CSV
                  </button>
                  <button 
                    onClick={handleClearData}
                    className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-sm font-bold rounded-lg transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Limpiar
                  </button>
                  <button 
                    onClick={() => { setAdminAuth(false); handleReset(); }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg transition-all border border-white/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Salir
                  </button>
                </div>
              </div>

              <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white/5 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">Empresa</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Fecha/Hora</th>
                        <th className="px-6 py-4 text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {isAdminLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                            <RefreshCcw className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Cargando registros...
                          </td>
                        </tr>
                      ) : adminError ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-rose-400">
                            Error: {adminError}
                          </td>
                        </tr>
                      ) : adminData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No hay registros disponibles.</td>
                        </tr>
                      ) : (
                        adminData.map((row) => (
                          <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4 font-medium text-white">{row.company}</td>
                            <td className="px-6 py-4 text-slate-400">{row.email}</td>
                            <td className="px-6 py-4 text-slate-400">{row.role}</td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                              {row.date} <br/> {row.time}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-bold">
                                {row.score}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-slate-600 text-xs font-medium tracking-widest uppercase z-10">
        © 2026 AI Maturity Assessment Tool • GBM
      </footer>
    </div>
  );
}
