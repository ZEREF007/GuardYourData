import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'zh' | 'es' | 'ne'

export interface Translations {
  // Navbar
  nav_overview: string
  nav_modules: string
  nav_quiz: string
  nav_game: string
  nav_glossary: string
  nav_laws: string
  nav_live: string
  nav_dashboard: string
  nav_references: string
  nav_privacy: string
  nav_thankyou: string
  nav_admin: string
  nav_signin: string
  nav_signout: string
  nav_modules_hint: string

  // Module names
  mod1: string
  mod2: string
  mod3: string
  mod4: string
  mod5: string

  // Auth page
  auth_signin: string
  auth_register: string
  auth_email: string
  auth_password: string
  auth_name: string
  auth_submit_login: string
  auth_submit_register: string
  auth_no_account: string
  auth_has_account: string
  auth_register_here: string
  auth_signin_here: string
  auth_processing: string

  // Section titles
  section_objectives: string
  section_objectives_sub: string
  section_slides: string
  section_slides_sub: string
  section_video: string
  section_video_sub: string
  section_takeaways: string
  section_tips: string

  // Common
  btn_prev: string
  btn_next: string
  btn_start_quiz: string
  btn_finish: string
  btn_try_again: string
  btn_next_question: string
  quiz_complete: string
  video_soon: string

  // Live threats
  live_title: string
  live_sub: string

  // Dashboard
  dash_title: string

  // Lang switcher label
  lang_label: string
}

const T: Record<Lang, Translations> = {
  en: {
    nav_overview: 'Overview',
    nav_modules: 'Modules',
    nav_quiz: 'MCQ Quiz',
    nav_game: 'Game',
    nav_glossary: 'Glossary',
    nav_laws: 'Laws',
    nav_live: 'Live Threats',
    nav_dashboard: 'Dashboard',
    nav_references: 'References',
    nav_privacy: 'Privacy',
    nav_thankyou: 'Thank You',
    nav_admin: 'Admin',
    nav_signin: 'Sign in',
    nav_signout: 'Sign out',
    nav_modules_hint: 'Click a module to begin learning',
    mod1: 'Module 1: What is a Data Breach?',
    mod2: 'Module 2: Attack Vectors and Techniques',
    mod3: 'Module 3: Regulatory Environment',
    mod4: 'Module 4: Security Controls and Defences',
    mod5: 'Module 5: Case Studies and Governance',
    auth_signin: '🔑 Sign In',
    auth_register: '🆕 Register',
    auth_email: 'Email Address',
    auth_password: 'Password',
    auth_name: 'Full Name',
    auth_submit_login: '🔑 Sign In',
    auth_submit_register: '🚀 Create Account',
    auth_no_account: "Don't have an account? ",
    auth_has_account: 'Already have an account? ',
    auth_register_here: 'Register here',
    auth_signin_here: 'Sign in here',
    auth_processing: 'Processing...',
    section_objectives: '🎯 Learning Objectives',
    section_objectives_sub: 'After completing this module, you will be able to:',
    section_slides: '🎞 Slide Presentation',
    section_slides_sub: 'Navigate through key concepts using the arrows or dots below.',
    section_video: '🎬 Module Video',
    section_video_sub: 'Watch the expert walkthrough for this module.',
    section_takeaways: '🔑 Key Takeaways',
    section_tips: '💡 Quick Tips',
    btn_prev: 'Previous',
    btn_next: 'Next',
    btn_start_quiz: 'Start Quiz',
    btn_finish: '🏁 Finish',
    btn_try_again: 'Try Again',
    btn_next_question: 'Next Question',
    quiz_complete: 'Quiz Complete!',
    video_soon: 'Video coming soon',
    live_title: 'Live Threat Intelligence',
    live_sub: 'Real-time data from CISA Known Exploited Vulnerabilities',
    dash_title: 'Your Learning Dashboard',
    lang_label: 'Language',
  },

  zh: {
    nav_overview: '概览',
    nav_modules: '模块',
    nav_quiz: '选择题',
    nav_game: '游戏',
    nav_glossary: '词汇表',
    nav_laws: '法律法规',
    nav_live: '实时威胁',
    nav_dashboard: '仪表板',
    nav_references: '参考资料',
    nav_privacy: '隐私政策',
    nav_thankyou: '致谢',
    nav_admin: '管理员',
    nav_signin: '登录',
    nav_signout: '退出',
    nav_modules_hint: '点击模块开始学习',
    mod1: '模块 1：什么是数据泄露？',
    mod2: '模块 2：攻击向量与技术',
    mod3: '模块 3：监管环境',
    mod4: '模块 4：安全控制与防御',
    mod5: '模块 5：案例研究与治理',
    auth_signin: '🔑 登录',
    auth_register: '🆕 注册',
    auth_email: '电子邮件地址',
    auth_password: '密码',
    auth_name: '姓名',
    auth_submit_login: '🔑 登录',
    auth_submit_register: '🚀 创建账户',
    auth_no_account: '没有账户？',
    auth_has_account: '已有账户？',
    auth_register_here: '点击注册',
    auth_signin_here: '点击登录',
    auth_processing: '处理中...',
    section_objectives: '🎯 学习目标',
    section_objectives_sub: '完成本模块后，您将能够：',
    section_slides: '🎞 幻灯片演示',
    section_slides_sub: '使用箭头或圆点导航浏览关键概念。',
    section_video: '🎬 模块视频',
    section_video_sub: '观看本模块的专家讲解视频。',
    section_takeaways: '🔑 关键要点',
    section_tips: '💡 快速提示',
    btn_prev: '上一页',
    btn_next: '下一页',
    btn_start_quiz: '开始测验',
    btn_finish: '🏁 完成',
    btn_try_again: '再试一次',
    btn_next_question: '下一题',
    quiz_complete: '测验完成！',
    video_soon: '视频即将上线',
    live_title: '实时威胁情报',
    live_sub: 'CISA 已知被利用漏洞的实时数据',
    dash_title: '您的学习仪表板',
    lang_label: '语言',
  },

  es: {
    nav_overview: 'Visión General',
    nav_modules: 'Módulos',
    nav_quiz: 'Cuestionario',
    nav_game: 'Juego',
    nav_glossary: 'Glosario',
    nav_laws: 'Leyes',
    nav_live: 'Amenazas en Vivo',
    nav_dashboard: 'Panel',
    nav_references: 'Referencias',
    nav_privacy: 'Privacidad',
    nav_thankyou: 'Agradecimiento',
    nav_admin: 'Admin',
    nav_signin: 'Iniciar sesión',
    nav_signout: 'Cerrar sesión',
    nav_modules_hint: 'Haz clic en un módulo para comenzar',
    mod1: 'Módulo 1: ¿Qué es una Filtración de Datos?',
    mod2: 'Módulo 2: Vectores y Técnicas de Ataque',
    mod3: 'Módulo 3: Entorno Regulatorio',
    mod4: 'Módulo 4: Controles y Defensas de Seguridad',
    mod5: 'Módulo 5: Casos de Estudio y Gobernanza',
    auth_signin: '🔑 Iniciar Sesión',
    auth_register: '🆕 Registrarse',
    auth_email: 'Correo Electrónico',
    auth_password: 'Contraseña',
    auth_name: 'Nombre Completo',
    auth_submit_login: '🔑 Iniciar Sesión',
    auth_submit_register: '🚀 Crear Cuenta',
    auth_no_account: '¿No tienes cuenta? ',
    auth_has_account: '¿Ya tienes cuenta? ',
    auth_register_here: 'Regístrate aquí',
    auth_signin_here: 'Inicia sesión aquí',
    auth_processing: 'Procesando...',
    section_objectives: '🎯 Objetivos de Aprendizaje',
    section_objectives_sub: 'Al completar este módulo, podrás:',
    section_slides: '🎞 Presentación de Diapositivas',
    section_slides_sub: 'Navega por los conceptos clave con las flechas o puntos.',
    section_video: '🎬 Video del Módulo',
    section_video_sub: 'Mira la guía experta para este módulo.',
    section_takeaways: '🔑 Conclusiones Clave',
    section_tips: '💡 Consejos Rápidos',
    btn_prev: 'Anterior',
    btn_next: 'Siguiente',
    btn_start_quiz: 'Iniciar Cuestionario',
    btn_finish: '🏁 Finalizar',
    btn_try_again: 'Intentar de Nuevo',
    btn_next_question: 'Siguiente Pregunta',
    quiz_complete: '¡Cuestionario Completado!',
    video_soon: 'Video próximamente',
    live_title: 'Inteligencia de Amenazas en Vivo',
    live_sub: 'Datos en tiempo real de CISA sobre Vulnerabilidades Explotadas',
    dash_title: 'Tu Panel de Aprendizaje',
    lang_label: 'Idioma',
  },

  ne: {
    nav_overview: 'सिंहावलोकन',
    nav_modules: 'मोड्युलहरू',
    nav_quiz: 'प्रश्नोत्तरी',
    nav_game: 'खेल',
    nav_glossary: 'शब्दकोश',
    nav_laws: 'कानूनहरू',
    nav_live: 'लाइभ खतरा',
    nav_dashboard: 'ड्यासबोर्ड',
    nav_references: 'सन्दर्भहरू',
    nav_privacy: 'गोपनीयता',
    nav_thankyou: 'धन्यवाद',
    nav_admin: 'प्रशासक',
    nav_signin: 'साइन इन',
    nav_signout: 'साइन आउट',
    nav_modules_hint: 'सिक्न सुरु गर्न मोड्युलमा क्लिक गर्नुहोस्',
    mod1: 'मोड्युल १: डेटा उल्लङ्घन के हो?',
    mod2: 'मोड्युल २: आक्रमण माध्यम र प्रविधिहरू',
    mod3: 'मोड्युल ३: नियामक वातावरण',
    mod4: 'मोड्युल ४: सुरक्षा नियन्त्रण र प्रतिरक्षा',
    mod5: 'मोड्युल ५: केस स्टडी र शासन',
    auth_signin: '🔑 साइन इन',
    auth_register: '🆕 दर्ता',
    auth_email: 'इमेल ठेगाना',
    auth_password: 'पासवर्ड',
    auth_name: 'पूरा नाम',
    auth_submit_login: '🔑 साइन इन',
    auth_submit_register: '🚀 खाता सिर्जना गर्नुहोस्',
    auth_no_account: 'खाता छैन? ',
    auth_has_account: 'पहिले नै खाता छ? ',
    auth_register_here: 'यहाँ दर्ता गर्नुहोस्',
    auth_signin_here: 'यहाँ साइन इन गर्नुहोस्',
    auth_processing: 'प्रशोधन हुँदैछ...',
    section_objectives: '🎯 सिक्ने उद्देश्यहरू',
    section_objectives_sub: 'यो मोड्युल पूरा गरेपछि, तपाईं सक्षम हुनुहुनेछ:',
    section_slides: '🎞 स्लाइड प्रस्तुति',
    section_slides_sub: 'तलका तीर वा बिन्दुहरू प्रयोग गरेर मुख्य अवधारणाहरू नेभिगेट गर्नुहोस्।',
    section_video: '🎬 मोड्युल भिडियो',
    section_video_sub: 'यो मोड्युलको विशेषज्ञ मार्गदर्शन हेर्नुहोस्।',
    section_takeaways: '🔑 मुख्य निष्कर्षहरू',
    section_tips: '💡 छिटो सुझावहरू',
    btn_prev: 'अघिल्लो',
    btn_next: 'अर्को',
    btn_start_quiz: 'प्रश्नोत्तरी सुरु गर्नुहोस्',
    btn_finish: '🏁 समाप्त',
    btn_try_again: 'फेरि प्रयास गर्नुहोस्',
    btn_next_question: 'अर्को प्रश्न',
    quiz_complete: 'प्रश्नोत्तरी पूर्ण भयो!',
    video_soon: 'भिडियो छिट्टै आउँदैछ',
    live_title: 'लाइभ खतरा बुद्धिमत्ता',
    live_sub: 'CISA ज्ञात शोषित कमजोरीहरूबाट रियल-टाइम डेटा',
    dash_title: 'तपाईंको सिक्ने ड्यासबोर्ड',
    lang_label: 'भाषा',
  },
}

const LANG_META: Record<Lang, { label: string; flag: string }> = {
  en: { label: 'English',  flag: '🇬🇧' },
  zh: { label: '中文',     flag: '🇨🇳' },
  es: { label: 'Español',  flag: '🇪🇸' },
  ne: { label: 'नेपाली',  flag: '🇳🇵' },
}

interface LanguageContextType {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
  langMeta: typeof LANG_META
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: T.en,
  setLang: () => {},
  langMeta: LANG_META,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    return stored && stored in T ? stored : 'en'
  })

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, t: T[lang], setLang, langMeta: LANG_META }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
export { LANG_META }
