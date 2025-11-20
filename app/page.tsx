'use client'

import Link from 'next/link'
import { useState } from 'react'

const translations = {
  en: {
    title1: 'Olive.',
    title2: '',
    subtitle: 'Express solidarity through art',
    description: 'Every doodle is a voice. Every stroke matters. Join thousands raising awareness through creative expression.',
    createBtn: 'Create a Doodle',
    galleryBtn: 'View Gallery',
    card1Title: 'Draw Freely',
    card1Desc: 'Use our intuitive canvas to create meaningful artwork. Express your voice with colors of hope and solidarity.',
    card2Title: 'Share Your Voice',
    card2Desc: 'Your artwork joins a powerful global gallery. Every piece contributes to a collective message of hope.',
    card3Title: 'Raise Awareness',
    card3Desc: 'Together we amplify voices and spread solidarity. Art transcends borders and speaks truth to power.',
    stat1: 'Voices United',
    stat2: 'Stories Shared',
    stat3: 'Hearts Reached',
    whyTitle: 'Why Olive?',
    whyText: 'The olive tree is an ancient symbol of Palestine, representing resilience, peace, and connection to the land. For thousands of years, olive trees have been deeply rooted in Palestinian culture and identity. Despite attempts to uproot them, they continue to grow - a powerful metaphor for the Palestinian spirit.',
    footer: 'Free Palestine',
    footerTagline: 'Art for Justice • Art for Peace • Art for Freedom',
  },
  ar: {
    title1: 'زيتون.',
    title2: '',
    subtitle: 'عبر عن تضامنك من خلال الفن',
    description: 'كل رسمة هي صوت. كل خط مهم. انضم إلى الآلاف الذين يرفعون الوعي من خلال التعبير الإبداعي.',
    createBtn: 'أنشئ رسمة',
    galleryBtn: 'عرض المعرض',
    card1Title: 'ارسم بحرية',
    card1Desc: 'استخدم لوحتنا السهلة لإنشاء عمل فني ذي معنى. عبر عن صوتك بألوان الأمل والتضامن.',
    card2Title: 'شارك صوتك',
    card2Desc: 'عملك الفني ينضم إلى معرض عالمي قوي. كل قطعة تساهم في رسالة أمل جماعية.',
    card3Title: 'ارفع الوعي',
    card3Desc: 'معاً نضخم الأصوات وننشر التضامن. الفن يتجاوز الحدود ويتحدث بالحقيقة أمام السلطة.',
    stat1: 'أصوات متحدة',
    stat2: 'قصص مشتركة',
    stat3: 'قلوب وصلت',
    whyTitle: 'لماذا الزيتون؟',
    whyText: 'شجرة الزيتون رمز قديم لفلسطين، تمثل الصمود والسلام والارتباط بالأرض. لآلاف السنين، كانت أشجار الزيتون متجذرة بعمق في الثقافة والهوية الفلسطينية. على الرغم من محاولات اقتلاعها، فإنها تستمر في النمو - استعارة قوية للروح الفلسطينية.',
    footer: 'فلسطين حرة',
    footerTagline: 'فن من أجل العدالة • فن من أجل السلام • فن من أجل الحرية',
  },
  tr: {
    title1: 'Zeytin.',
    title2: '',
    subtitle: 'Sanat yoluyla dayanışma göster',
    description: 'Her çizim bir sestir. Her fırça darbesi önemlidir. Yaratıcı ifade yoluyla farkındalık yaratan binlerce kişiye katılın.',
    createBtn: 'Çizim Yap',
    galleryBtn: 'Galeriyi Gör',
    card1Title: 'Özgürce Çiz',
    card1Desc: 'Anlamlı sanat eserleri yaratmak için sezgisel tuvalimizi kullanın. Umut ve dayanışma renkleriyle sesinizi ifade edin.',
    card2Title: 'Sesinizi Paylaşın',
    card2Desc: 'Sanat eseriniz güçlü bir küresel galeriye katılır. Her parça, kolektif bir umut mesajına katkıda bulunur.',
    card3Title: 'Farkındalık Yaratın',
    card3Desc: 'Birlikte sesleri yükseltiyor ve dayanışmayı yayıyoruz. Sanat sınırları aşar ve gerçeği güce karşı anlatır.',
    stat1: 'Birleşen Sesler',
    stat2: 'Paylaşılan Hikayeler',
    stat3: 'Ulaşılan Kalpler',
    whyTitle: 'Neden Zeytin?',
    whyText: 'Zeytin ağacı, Filistin\'in kadim sembolüdür ve dayanıklılığı, barışı ve toprakla bağlantıyı temsil eder. Binlerce yıldır zeytin ağaçları Filistin kültürü ve kimliğinde derin köklere sahiptir. Sökülme girişimlerine rağmen büyümeye devam ediyorlar - Filistin ruhunun güçlü bir metaforu.',
    footer: 'Özgür Filistin',
    footerTagline: 'Adalet için Sanat • Barış için Sanat • Özgürlük için Sanat',
  },
  es: {
    title1: 'Oliva.',
    title2: '',
    subtitle: 'Expresa solidaridad a través del arte',
    description: 'Cada garabato es una voz. Cada trazo importa. Únete a miles creando conciencia a través de la expresión creativa.',
    createBtn: 'Crear un Dibujo',
    galleryBtn: 'Ver Galería',
    card1Title: 'Dibuja Libremente',
    card1Desc: 'Usa nuestro lienzo intuitivo para crear arte significativo. Expresa tu voz con colores de esperanza y solidaridad.',
    card2Title: 'Comparte tu Voz',
    card2Desc: 'Tu obra se une a una poderosa galería global. Cada pieza contribuye a un mensaje colectivo de esperanza.',
    card3Title: 'Crear Conciencia',
    card3Desc: 'Juntos amplificamos voces y difundimos solidaridad. El arte trasciende fronteras y habla verdad al poder.',
    stat1: 'Voces Unidas',
    stat2: 'Historias Compartidas',
    stat3: 'Corazones Alcanzados',
    whyTitle: '¿Por qué Oliva?',
    whyText: 'El olivo es un símbolo antiguo de Palestina, que representa la resiliencia, la paz y la conexión con la tierra. Durante miles de años, los olivos han estado profundamente arraigados en la cultura e identidad palestina. A pesar de los intentos de desarraigarlos, continúan creciendo: una poderosa metáfora del espíritu palestino.',
    footer: 'Palestina Libre',
    footerTagline: 'Arte por la Justicia • Arte por la Paz • Arte por la Libertad',
  },
  fr: {
    title1: 'Olive.',
    title2: '',
    subtitle: 'Exprimez votre solidarité par l\'art',
    description: 'Chaque dessin est une voix. Chaque trait compte. Rejoignez des milliers de personnes sensibilisant par l\'expression créative.',
    createBtn: 'Créer un Dessin',
    galleryBtn: 'Voir la Galerie',
    card1Title: 'Dessinez Librement',
    card1Desc: 'Utilisez notre toile intuitive pour créer des œuvres significatives. Exprimez votre voix avec des couleurs d\'espoir et de solidarité.',
    card2Title: 'Partagez votre Voix',
    card2Desc: 'Votre œuvre rejoint une puissante galerie mondiale. Chaque pièce contribue à un message collectif d\'espoir.',
    card3Title: 'Sensibiliser',
    card3Desc: 'Ensemble, nous amplifions les voix et diffusons la solidarité. L\'art transcende les frontières et dit la vérité au pouvoir.',
    stat1: 'Voix Unies',
    stat2: 'Histoires Partagées',
    stat3: 'Cœurs Touchés',
    whyTitle: 'Pourquoi Olive?',
    whyText: 'L\'olivier est un symbole ancien de la Palestine, représentant la résilience, la paix et le lien avec la terre. Pendant des milliers d\'années, les oliviers ont été profondément enracinés dans la culture et l\'identité palestiniennes. Malgré les tentatives de les déraciner, ils continuent de pousser - une métaphore puissante de l\'esprit palestinien.',
    footer: 'Palestine Libre',
    footerTagline: 'Art pour la Justice • Art pour la Paix • Art pour la Liberté',
  },
  de: {
    title1: 'Olive.',
    title2: '',
    subtitle: 'Solidarität durch Kunst ausdrücken',
    description: 'Jede Zeichnung ist eine Stimme. Jeder Strich zählt. Schließen Sie sich Tausenden an, die durch kreativen Ausdruck Bewusstsein schaffen.',
    createBtn: 'Zeichnung Erstellen',
    galleryBtn: 'Galerie Ansehen',
    card1Title: 'Frei Zeichnen',
    card1Desc: 'Nutzen Sie unsere intuitive Leinwand, um bedeutungsvolle Kunst zu schaffen. Drücken Sie Ihre Stimme mit Farben der Hoffnung und Solidarität aus.',
    card2Title: 'Teilen Sie Ihre Stimme',
    card2Desc: 'Ihr Kunstwerk wird Teil einer mächtigen globalen Galerie. Jedes Stück trägt zu einer kollektiven Botschaft der Hoffnung bei.',
    card3Title: 'Bewusstsein Schaffen',
    card3Desc: 'Gemeinsam verstärken wir Stimmen und verbreiten Solidarität. Kunst überschreitet Grenzen und spricht Wahrheit zur Macht.',
    stat1: 'Vereinte Stimmen',
    stat2: 'Geteilte Geschichten',
    stat3: 'Erreichte Herzen',
    whyTitle: 'Warum Olive?',
    whyText: 'Der Olivenbaum ist ein uraltes Symbol Palästinas und steht für Widerstandsfähigkeit, Frieden und Verbundenheit mit dem Land. Seit Jahrtausenden sind Olivenbäume tief in der palästinensischen Kultur und Identität verwurzelt. Trotz Versuchen, sie zu entwurzeln, wachsen sie weiter - eine kraftvolle Metapher für den palästinensischen Geist.',
    footer: 'Freies Palästina',
    footerTagline: 'Kunst für Gerechtigkeit • Kunst für Frieden • Kunst für Freiheit',
  }
}

export default function Home() {
  const [lang, setLang] = useState<'en' | 'ar' | 'tr' | 'es' | 'fr' | 'de'>('en')
  const t = translations[lang]

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-green-600 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-red-600 to-transparent"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-red-600 rounded-xl opacity-50 group-hover:opacity-75 blur transition"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm border border-white/20 rounded-xl p-1">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                    lang === 'en'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="English"
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => setLang('ar')}
                  className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                    lang === 'ar'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="العربية"
                >
                  🇵🇸 AR
                </button>
                <button
                  onClick={() => setLang('tr')}
                  className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                    lang === 'tr'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Türkçe"
                >
                  🇹🇷 TR
                </button>
                <button
                  onClick={() => setLang('es')}
                  className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                    lang === 'es'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Español"
                >
                  🇪🇸 ES
                </button>
                <button
                  onClick={() => setLang('fr')}
                  className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                    lang === 'fr'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Français"
                >
                  🇫🇷 FR
                </button>
                <button
                  onClick={() => setLang('de')}
                  className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                    lang === 'de'
                      ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Deutsch"
                >
                  🇩🇪 DE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-20">
          {/* Palestinian Flag Accent */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-white animate-pulse delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-black animate-pulse delay-200"></div>
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse delay-300"></div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
            <span className="inline-block bg-gradient-to-r from-green-400 via-white to-green-400 bg-clip-text text-transparent animate-gradient">
              {t.title1}
            </span>
            {t.title2 && (
              <>
                <br />
                <span className="inline-block bg-gradient-to-r from-red-400 via-white to-red-400 bg-clip-text text-transparent animate-gradient">
                  {t.title2}
                </span>
              </>
            )}
          </h1>

          {/* Subtitle with Olive Branch Symbol */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">🕊️</span>
            <p className="text-xl sm:text-2xl text-gray-300 font-light max-w-3xl">
              {t.subtitle}
            </p>
            <span className="text-2xl">🕊️</span>
          </div>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 sm:mb-24">
          {/* Primary Button - Create */}
          <Link 
            href="/draw"
            className="group relative w-full sm:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <div className="relative px-10 py-5 bg-gradient-to-br from-green-600 to-green-700 rounded-xl leading-none flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-xl flex items-center gap-3">
                <span className="text-2xl">✨</span>
                {t.createBtn}
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>

          {/* Secondary Button - Gallery */}
          <Link 
            href="/gallery"
            className="group relative w-full sm:w-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-white via-gray-300 to-white rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl leading-none flex items-center justify-center shadow-2xl hover:bg-white/20 transition-all duration-300">
              <span className="text-white font-bold text-xl flex items-center gap-3">
                <span className="text-2xl">🎨</span>
                {t.galleryBtn}
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {/* Card 1 - Draw */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl opacity-50 group-hover:opacity-100 blur transition duration-300"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl border border-green-600/30 hover:border-green-600/60 transition-all duration-300 h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-600/50 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{t.card1Title}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t.card1Desc}
              </p>
            </div>
          </div>

          {/* Card 2 - Share */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white to-gray-300 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-300"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-white/30 group-hover:scale-110 transition-transform">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{t.card2Title}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t.card2Desc}
              </p>
            </div>
          </div>

          {/* Card 3 - Impact */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl opacity-50 group-hover:opacity-100 blur transition duration-300"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl border border-red-600/30 hover:border-red-600/60 transition-all duration-300 h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{t.card3Title}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t.card3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Why Olive? Section */}
        <div className="max-w-4xl mx-auto mb-16 mt-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-yellow-600 to-green-600 rounded-2xl opacity-50 group-hover:opacity-75 blur transition duration-500"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-sm p-8 sm:p-12 rounded-2xl border border-white/20">
              <div className="text-center mb-6">
                <span className="text-6xl mb-4 inline-block">🫒</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                  {t.whyTitle}
                </h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed text-center max-w-3xl mx-auto">
                {t.whyText}
              </p>
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 rounded-full">
                  <span className="text-2xl">🌱</span>
                  <span className="text-sm text-green-400 font-bold">Resilience</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  <span className="text-2xl">🕊️</span>
                  <span className="text-sm text-gray-300 font-bold">Peace</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 rounded-full">
                  <span className="text-2xl">🏡</span>
                  <span className="text-sm text-red-400 font-bold">Home</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text mb-2">∞</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">{t.stat1}</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text mb-2">∞</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">{t.stat2}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-gradient-to-r from-red-400 to-red-600 bg-clip-text mb-2">∞</div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium">{t.stat3}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
          <div className="text-center space-y-4">
          <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
            <p className="text-white font-bold tracking-wide flex items-center gap-3">
              <span className="text-xl">🇵🇸</span>
              {t.footer}
              <span className="text-xl">🇵🇸</span>
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            {t.footerTagline}
          </p>
        </div>
      </div>
    </main>
  );
}

