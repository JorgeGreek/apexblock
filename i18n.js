/* =====================================================
   APEX BLOCK — Site translation (EN / ES / EL)
   i18n.js

   - index.html is written in ENGLISH (default language, the one search
     engines index). Every translatable element carries:
       data-i18n="key"                 → replaces innerHTML
       data-i18n-attr="alt:key|..."    → replaces attributes
   - Switching back to English restores the exact original HTML (snapshot).
   - Loaded in <head> WITHOUT defer: sets <html lang> before first paint and
     hides the page for an instant when the stored language is not English.
   - Notifies the rest of the site with the "apx:langchange" event
     (script.js uses it for the rotating headline, the a11y widget for its UI).
   ===================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'apx-lang';
  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'es', 'el'];

  // Rotating headline words per language (English lives in script.js too)
  var ROTATOR = {
    en: ['decentralized protocols', 'DeFi systems', 'native mobile dApps', 'ZK rollups', 'trustless wallets', 'tokenized assets'],
    es: ['protocolos descentralizados', 'sistemas DeFi', 'dApps móviles nativas', 'rollups ZK', 'wallets sin custodia', 'activos tokenizados'],
    el: ['αποκεντρωμένα πρωτόκολλα', 'συστήματα DeFi', 'native mobile dApps', 'ZK rollups', 'wallets χωρίς θεματοφύλακα', 'tokenized assets']
  };

  // ---------- Castellano ----------
  var ES = {
    'meta.title': 'Apex Block — Estudio de ingeniería descentralizada',
    'meta.desc': 'Apex Block es un estudio de ingeniería blockchain integral: smart contracts y auditorías, protocolos DeFi, dApps móviles nativas, wallets y custodia, tokenización, infraestructura y rollups ZK. Nuestra especialidad: todo lo descentralizado.',
    'lang.group': 'Idioma',

    'nav.services': 'Servicios', 'nav.edge': 'Nuestra ventaja', 'nav.work': 'Proyectos', 'nav.process': 'Proceso', 'nav.stack': 'Stack', 'nav.contact': 'Contacto',
    'nav.cta': 'Empezar un proyecto', 'nav.toggle': 'Abrir o cerrar la navegación',

    'hero.l1': 'Construimos',
    'hero.rot0': 'protocolos descentralizados',
    'hero.l3': 'que <span class="holo">sobreviven al hype.</span>',
    'hero.sub': 'Ingeniería blockchain de espectro completo: smart contracts, protocolos DeFi, wallets, infraestructura, tokenización y dApps móviles nativas. Una obsesión atraviesa todo lo que entregamos: <strong>descentralización real</strong>, verificada on-chain, no prometida en una presentación.',
    'hero.cta1': 'Ver capacidades <i class="fas fa-arrow-right"></i>',
    'hero.cta2': '<i class="fas fa-cube"></i> Ver casos de estudio',
    'hero.s1': 'Contratos entregados', 'hero.s2': 'Protocolos auditados', 'hero.s3': 'Chains soportadas', 'hero.s4': 'Años de ingeniería',
    'hero.core': 'CONSENSO', 'hero.hud2': 'FINALIDAD', 'hero.hud3': 'NODOS', 'hero.hud4': 'PRUEBA', 'hero.scroll': 'DESPLAZA',

    'svc.eyebrow': '// CAPACIDADES',
    'svc.title': 'Cada capa del <span class="holo">stack blockchain.</span>',
    'svc.sub': 'Del bytecode de la EVM al píxel en la pantalla de un móvil. Nueve disciplinas, un estándar: calidad de producción, auditado y descentralizado por diseño.',
    'svc.tagSpecialty': '<i class="fas fa-star"></i> NUESTRA ESPECIALIDAD',
    'svc.tagNative': '<i class="fas fa-mobile-screen"></i> SOLO NATIVO',
    'svc.1.t': 'Ingeniería de protocolos descentralizados',
    'svc.1.p': 'Sistemas de confianza mínima donde ninguna parte, ni siquiera nosotros, puede detener, censurar o actualizar sin consenso. Diseñamos la gobernanza, las primitivas on-chain y los incentivos económicos como una sola máquina coherente.',
    'svc.1.f1': '<i class="fas fa-check"></i> Arquitectura permissionless y diseño de gobernanza',
    'svc.1.f2': '<i class="fas fa-check"></i> Tokenomics, incentivos y modelado de superficie de ataque',
    'svc.1.f3': '<i class="fas fa-check"></i> Rutas de actualización inmutables o con timelock',
    'svc.1.f4': '<i class="fas fa-check"></i> Secuenciación, almacenamiento y oráculos descentralizados',
    'svc.2.t': 'Smart contracts y auditorías',
    'svc.2.p': 'Contratos en Solidity, Rust y Move escritos con invariantes formales, fuzzing con Foundry y revisión línea a línea antes de mainnet.',
    'svc.3.t': 'Protocolos DeFi y dApps',
    'svc.3.p': 'AMMs, mercados de préstamo, vaults, perps y sistemas de staking con matemáticas probadas y ejecución consciente del MEV.',
    'svc.4.t': 'dApps móviles nativas',
    'svc.4.p': 'Apps en SwiftUI y Jetpack Compose con claves respaldadas por hardware, firma biométrica y capas RPC que cuidan la batería. Sin WebViews, sin wrappers.',
    'svc.5.t': 'Wallets y custodia',
    'svc.5.p': 'Wallets sin custodia, configuraciones MPC y multisig, account abstraction e integraciones WalletConnect sin fricción.',
    'svc.6.t': 'Tokenización y RWA',
    'svc.6.p': 'Estándares de token, flujos de emisión conformes a normativa, infraestructura NFT y raíles para activos del mundo real pensados para reguladores y usuarios.',
    'svc.7.t': 'Infraestructura e indexación',
    'svc.7.p': 'Nodos validadores y RPC, subgraphs, indexadores a medida y pipelines de eventos que mantienen tu producto rápido a escala.',
    'svc.8.t': 'ZK, L2 e interoperabilidad',
    'svc.8.p': 'Circuitos de conocimiento cero, despliegues de rollups y mensajería cross-chain que preservan la seguridad reduciendo costes.',
    'svc.9.t': 'Arquitectura Web3 y asesoría',
    'svc.9.p': 'Selección de chain, modelado de amenazas, hojas de ruta de descentralización y due diligence técnica para fundadores y CTOs.',
    'svc.9.foot': 'ESTRATEGIA · AUDITORÍA · HOJA DE RUTA',

    'edge.dial': 'DESCENTRALIZADO', 'edge.c1': '0 claves de admin', 'edge.c2': '0 custodios', 'edge.c3': '0 puntos únicos de fallo',
    'edge.eyebrow': '// NUESTRA VENTAJA',
    'edge.title': 'Descentralizado no es una función. <span class="holo">Es la arquitectura.</span>',
    'edge.p': 'La mayoría de productos "Web3" son una base de datos con un token. Nosotros construimos lo contrario: sistemas cuya seguridad nace del consenso, la criptografía y la verificación abierta, para que tus usuarios nunca tengan que confiar en ti, y tus inversores tampoco.',
    'edge.p1t': 'Confianza mínima por defecto', 'edge.p1p': 'Claves en hardware, actualizaciones tras timelocks y gobernanza, datos verificables por cualquiera.',
    'edge.p2t': 'Nivel de auditoría desde el día uno', 'edge.p2p': 'Tests de invariantes, fuzzing y revisión formal forman parte del sprint, no de una partida al final.',
    'edge.p3t': 'Rendimiento que se puede medir', 'edge.p3p': 'Presupuestos de gas, objetivos de finalidad y tiempos de frame móviles seguidos en cada release.',
    'edge.p4t': 'Abierto y reproducible', 'edge.p4p': 'Código verificado, builds deterministas y documentación que tus auditores agradecerán.',
    'edge.cta': 'Habla con un ingeniero <i class="fas fa-arrow-right"></i>',

    'work.eyebrow': '// ARQUITECTURAS DE REFERENCIA',
    'work.title': 'Arquitecturas que <span class="holo">llevan nuestro nombre.</span>',
    'work.sub': 'Sistemas fundacionales que muestran cómo tratamos la custodia, la liquidez y los datos on-chain a nivel de protocolo.',
    'work.sign': 'Firmar', 'work.proof': '<i class="fas fa-check"></i> prueba verificada · 212 ms',
    'work.1.tag': 'WALLET SIN CUSTODIA',
    'work.1.p': 'Base de wallet nativa para iOS y Android con claves en Secure Enclave / StrongBox, firma biométrica y WalletConnect v2.',
    'work.2.tag': 'PROTOCOLO DEFI',
    'work.2.p': 'Dashboard reactivo y capa de ejecución que transmite eventos de contratos en múltiples chains EVM con transacciones agrupadas y conscientes del MEV.',
    'work.3.tag': 'LIQUIDACIÓN ZK', 'work.3.t': 'Capa de liquidación cross-chain',
    'work.3.p': 'Mensajería verificada con conocimiento cero entre una L1 y un rollup específico de aplicación, sin relayer de confianza en el camino.',

    'pr.eyebrow': '// EL MÉTODO PROTOCOLO',
    'pr.title': 'Del modelo de amenazas <span class="holo">a mainnet.</span>',
    'pr.sub': 'Un proceso de entrega diseñado para CTOs que necesitan certeza criptográfica, sprints predecibles y un rastro de auditoría limpio.',
    'pr.1t': 'Descubrimiento y modelo de amenazas', 'pr.1p': 'Mapeamos actores, activos y superficies de ataque, elegimos la chain y definimos qué debe ser descentralizado desde el día uno.',
    'pr.2t': 'Arquitectura y diseño', 'pr.2p': 'Contratos, servicios off-chain y flujos de cliente diseñados juntos, con gobernanza y rutas de actualización decididas de antemano.',
    'pr.3t': 'Construcción y verificación', 'pr.3p': 'Sprints ágiles con tests de invariantes, fuzzing y despliegues en testnet cada semana, más clientes nativos donde haga falta.',
    'pr.4t': 'Auditoría y lanzamiento', 'pr.4p': 'Coordinación de auditoría externa, código verificado, monitorización y despliegue escalonado en mainnet con política de kill-switch on-chain.',

    'st.eyebrow': '// ARSENAL',
    'st.title': 'Herramientas en las que <span class="holo">confiamos en producción.</span>',
    'st.c1': 'ON-CHAIN', 'st.c2': 'CHAINS', 'st.c3': 'MÓVIL', 'st.c4': 'INFRA',

    'cta.eyebrow': '// ¿LISTO?',
    'cta.title': 'Construyamos algo que <span class="holo">nadie pueda apagar.</span>',
    'cta.sub': 'Cuéntanos tu chain, tus contratos y tus usuarios. Un ingeniero responde en un día laborable.',
    'cta.main': 'Empieza tu proyecto <i class="fas fa-arrow-right"></i>',

    'ct.eyebrow': '// PIDE PRESUPUESTO',
    'ct.title': 'Define tu <span class="holo">protocolo.</span>',
    'ct.sub': 'Unos pocos datos te dirigen al ingeniero adecuado y te consiguen una estimación real, no una llamada comercial.',
    'ct.email': 'EMAIL', 'ct.resp': 'RESPUESTA', 'ct.respV': 'En un día laborable', 'ct.conf': 'CONFIDENCIAL', 'ct.confV': 'NDA antes de cualquier sesión técnica',
    'ct.term': '$ apex scope --chain evm --layer protocol,mobile\n✓ modelo de amenazas redactado\n✓ ingeniero asignado\n✓ estimación en &lt; 24h ▍',

    'f.name': 'Nombre completo *', 'f.email': 'Email de trabajo *', 'f.company': 'Empresa / Protocolo',
    'f.service': 'Servicio de interés *', 'f.serviceSel': 'Selecciona un servicio...',
    'f.chain': 'Blockchain objetivo *', 'f.chainSel': 'Selecciona una chain...', 'f.chainCross': 'Cross-chain', 'f.chainUndecided': 'Aún sin decidir',
    'f.budget': 'Presupuesto del proyecto', 'f.budgetSel': 'Selecciona un rango...', 'f.b1': 'Menos de 15.000 USD',
    'f.msg': 'Cuéntanos tu proyecto *', 'f.msgPh': 'Contratos implicados, chains, plataformas, producto existente (si lo hay), plazos...',
    'f.consent': 'Acepto que me contacten por email sobre mi solicitud. *',
    'f.submit': 'Pedir presupuesto <i class="fas fa-paper-plane"></i>', 'f.sending': '<i class="fas fa-spinner fa-spin"></i> Enviando...',
    'f.ok': '<i class="fas fa-check-circle"></i> Solicitud recibida. Un ingeniero responderá en un día laborable.',
    'f.err': '<i class="fas fa-exclamation-circle"></i> Algo ha fallado. Escríbenos a <a href="mailto:hello@apexblock.tech">hello@apexblock.tech</a>.',

    'ft.brand': 'Estudio de ingeniería blockchain integral. Especialidad: todo lo descentralizado.',
    'ft.services': 'SERVICIOS', 'ft.s1': 'Protocolos descentralizados', 'ft.s3': 'DeFi y dApps',
    'ft.company': 'EMPRESA', 'ft.cases': 'Casos de estudio', 'ft.contact': 'CONTACTO',
    'ft.copy': '&copy; 2026 Apex Block. Todos los derechos reservados. Construido descentralizado.',
    'ft.privacy': 'Política de privacidad', 'ft.terms': 'Términos del servicio'
  };

  // ---------- Ελληνικά ----------
  var EL = {
    'meta.title': 'Apex Block — Στούντιο αποκεντρωμένης μηχανικής',
    'meta.desc': 'Η Apex Block είναι στούντιο μηχανικής blockchain πλήρους φάσματος: smart contracts και audits, πρωτόκολλα DeFi, native mobile dApps, wallets και θεματοφυλακή, tokenization, υποδομή και ZK rollups. Ειδικότητά μας: ό,τι είναι αποκεντρωμένο.',
    'lang.group': 'Γλώσσα',

    'nav.services': 'Υπηρεσίες', 'nav.edge': 'Το πλεονέκτημά μας', 'nav.work': 'Έργα', 'nav.process': 'Διαδικασία', 'nav.stack': 'Stack', 'nav.contact': 'Επικοινωνία',
    'nav.cta': 'Ξεκινήστε ένα έργο', 'nav.toggle': 'Άνοιγμα ή κλείσιμο πλοήγησης',

    'hero.l1': 'Κατασκευάζουμε',
    'hero.rot0': 'αποκεντρωμένα πρωτόκολλα',
    'hero.l3': 'που <span class="holo">αντέχουν πέρα από το hype.</span>',
    'hero.sub': 'Μηχανική blockchain πλήρους φάσματος: smart contracts, πρωτόκολλα DeFi, wallets, υποδομή, tokenization και native mobile dApps. Μία εμμονή διατρέχει ό,τι παραδίδουμε: <strong>πραγματική αποκέντρωση</strong>, επαληθεύσιμη on-chain, όχι υπόσχεση σε μια παρουσίαση.',
    'hero.cta1': 'Δείτε τις δυνατότητες <i class="fas fa-arrow-right"></i>',
    'hero.cta2': '<i class="fas fa-cube"></i> Δείτε case studies',
    'hero.s1': 'Contracts που παραδόθηκαν', 'hero.s2': 'Ελεγμένα πρωτόκολλα', 'hero.s3': 'Υποστηριζόμενα chains', 'hero.s4': 'Χρόνια μηχανικής',
    'hero.core': 'CONSENSUS', 'hero.hud2': 'FINALITY', 'hero.hud3': 'ΚΟΜΒΟΙ', 'hero.hud4': 'ΑΠΟΔΕΙΞΗ', 'hero.scroll': 'SCROLL',

    'svc.eyebrow': '// ΔΥΝΑΤΟΤΗΤΕΣ',
    'svc.title': 'Κάθε επίπεδο του <span class="holo">blockchain stack.</span>',
    'svc.sub': 'Από το bytecode της EVM μέχρι το pixel στην οθόνη ενός κινητού. Εννέα ειδικότητες, ένα πρότυπο: ποιότητα παραγωγής, ελεγμένο, αποκεντρωμένο εκ σχεδιασμού.',
    'svc.tagSpecialty': '<i class="fas fa-star"></i> Η ΕΙΔΙΚΟΤΗΤΑ ΜΑΣ',
    'svc.tagNative': '<i class="fas fa-mobile-screen"></i> ΜΟΝΟ NATIVE',
    'svc.1.t': 'Μηχανική αποκεντρωμένων πρωτοκόλλων',
    'svc.1.p': 'Συστήματα ελάχιστης εμπιστοσύνης όπου κανένα μέρος, ούτε εμείς, δεν μπορεί να σταματήσει, να λογοκρίνει ή να αναβαθμίσει χωρίς consensus. Σχεδιάζουμε τη διακυβέρνηση, τα on-chain primitives και τα οικονομικά κίνητρα ως μία συνεκτική μηχανή.',
    'svc.1.f1': '<i class="fas fa-check"></i> Permissionless αρχιτεκτονική και σχεδιασμός διακυβέρνησης',
    'svc.1.f2': '<i class="fas fa-check"></i> Tokenomics, κίνητρα και μοντελοποίηση επιφάνειας επίθεσης',
    'svc.1.f3': '<i class="fas fa-check"></i> Αμετάβλητες ή με timelock διαδρομές αναβάθμισης',
    'svc.1.f4': '<i class="fas fa-check"></i> Αποκεντρωμένο sequencing, αποθήκευση και oracles',
    'svc.2.t': 'Smart contracts και audits',
    'svc.2.p': 'Contracts σε Solidity, Rust και Move γραμμένα με τυπικές αναλλοίωτες, fuzzing με Foundry και έλεγχο γραμμή προς γραμμή πριν το mainnet.',
    'svc.3.t': 'Πρωτόκολλα DeFi και dApps',
    'svc.3.p': 'AMMs, αγορές δανεισμού, vaults, perps και συστήματα staking με δοκιμασμένα μαθηματικά και εκτέλεση με επίγνωση MEV.',
    'svc.4.t': 'Native mobile dApps',
    'svc.4.p': 'Εφαρμογές SwiftUI και Jetpack Compose με κλειδιά σε hardware, βιομετρική υπογραφή και επίπεδα RPC που σέβονται την μπαταρία. Χωρίς WebViews, χωρίς wrappers.',
    'svc.5.t': 'Wallets και θεματοφυλακή',
    'svc.5.p': 'Wallets χωρίς θεματοφύλακα, MPC και multisig, account abstraction και ενσωματώσεις WalletConnect χωρίς τριβή.',
    'svc.6.t': 'Tokenization και RWA',
    'svc.6.p': 'Πρότυπα token, συμμορφούμενες ροές έκδοσης, υποδομή NFT και ράγες για πραγματικά περιουσιακά στοιχεία, για ρυθμιστές και χρήστες.',
    'svc.7.t': 'Υποδομή και indexing',
    'svc.7.p': 'Validator και RPC nodes, subgraphs, custom indexers και pipelines συμβάντων που κρατούν το προϊόν σας γρήγορο σε κλίμακα.',
    'svc.8.t': 'ZK, L2 και διαλειτουργικότητα',
    'svc.8.p': 'Κυκλώματα μηδενικής γνώσης, αναπτύξεις rollup και cross-chain μηνύματα που διατηρούν την ασφάλεια μειώνοντας το κόστος.',
    'svc.9.t': 'Αρχιτεκτονική Web3 και συμβουλευτική',
    'svc.9.p': 'Επιλογή chain, μοντελοποίηση απειλών, οδικοί χάρτες αποκέντρωσης και τεχνικό due diligence για founders και CTOs.',
    'svc.9.foot': 'ΣΤΡΑΤΗΓΙΚΗ · AUDIT · ROADMAP',

    'edge.dial': 'ΑΠΟΚΕΝΤΡΩΜΕΝΟ', 'edge.c1': '0 admin keys', 'edge.c2': '0 θεματοφύλακες', 'edge.c3': '0 μοναδικά σημεία αστοχίας',
    'edge.eyebrow': '// ΤΟ ΠΛΕΟΝΕΚΤΗΜΑ ΜΑΣ',
    'edge.title': 'Η αποκέντρωση δεν είναι χαρακτηριστικό. <span class="holo">Είναι η αρχιτεκτονική.</span>',
    'edge.p': 'Τα περισσότερα προϊόντα "Web3" είναι μια βάση δεδομένων με ένα token. Εμείς χτίζουμε το αντίθετο: συστήματα των οποίων η ασφάλεια πηγάζει από consensus, κρυπτογραφία και ανοιχτή επαλήθευση, ώστε οι χρήστες σας να μη χρειάζεται ποτέ να σας εμπιστευτούν, ούτε οι επενδυτές σας.',
    'edge.p1t': 'Ελάχιστη εμπιστοσύνη εξ ορισμού', 'edge.p1p': 'Κλειδιά σε hardware, αναβαθμίσεις πίσω από timelocks και διακυβέρνηση, δεδομένα επαληθεύσιμα από οποιονδήποτε.',
    'edge.p2t': 'Επίπεδο audit από την πρώτη μέρα', 'edge.p2p': 'Tests αναλλοίωτων, fuzzing και τυπικός έλεγχος είναι μέρος του sprint, όχι γραμμή στο τέλος.',
    'edge.p3t': 'Απόδοση που μετριέται', 'edge.p3p': 'Προϋπολογισμοί gas, στόχοι finality και χρόνοι frame σε κινητά, παρακολουθούμενα σε κάθε release.',
    'edge.p4t': 'Ανοιχτό και αναπαραγώγιμο', 'edge.p4p': 'Επαληθευμένος κώδικας, ντετερμινιστικά builds και τεκμηρίωση που οι ελεγκτές σας θα εκτιμήσουν.',
    'edge.cta': 'Μιλήστε με μηχανικό <i class="fas fa-arrow-right"></i>',

    'work.eyebrow': '// ΑΡΧΙΤΕΚΤΟΝΙΚΕΣ ΑΝΑΦΟΡΑΣ',
    'work.title': 'Αρχιτεκτονικές που <span class="holo">φέρουν το όνομά μας.</span>',
    'work.sub': 'Θεμελιώδη συστήματα που δείχνουν πώς χειριζόμαστε θεματοφυλακή, ρευστότητα και on-chain δεδομένα σε επίπεδο πρωτοκόλλου.',
    'work.sign': 'Υπογραφή', 'work.proof': '<i class="fas fa-check"></i> απόδειξη επαληθεύτηκε · 212 ms',
    'work.1.tag': 'WALLET ΧΩΡΙΣ ΘΕΜΑΤΟΦΥΛΑΚΑ',
    'work.1.p': 'Native βάση wallet για iOS και Android με κλειδιά Secure Enclave / StrongBox, βιομετρική υπογραφή και WalletConnect v2.',
    'work.2.tag': 'ΠΡΩΤΟΚΟΛΛΟ DEFI',
    'work.2.p': 'Αντιδραστικό dashboard και επίπεδο εκτέλεσης που μεταδίδει συμβάντα contracts σε πολλαπλά EVM chains με ομαδοποιημένες συναλλαγές με επίγνωση MEV.',
    'work.3.tag': 'ΔΙΑΚΑΝΟΝΙΣΜΟΣ ZK', 'work.3.t': 'Επίπεδο cross-chain διακανονισμού',
    'work.3.p': 'Μηνύματα επαληθευμένα με μηδενική γνώση μεταξύ ενός L1 και ενός app-specific rollup, χωρίς έμπιστο relayer στη διαδρομή.',

    'pr.eyebrow': '// Ο ΤΡΟΠΟΣ ΤΟΥ ΠΡΩΤΟΚΟΛΛΟΥ',
    'pr.title': 'Από το μοντέλο απειλών <span class="holo">στο mainnet.</span>',
    'pr.sub': 'Μια διαδικασία παράδοσης σχεδιασμένη για CTOs που χρειάζονται κρυπτογραφική βεβαιότητα, προβλέψιμα sprints και καθαρό ίχνος ελέγχου.',
    'pr.1t': 'Discovery και μοντέλο απειλών', 'pr.1p': 'Χαρτογραφούμε φορείς, περιουσιακά στοιχεία και επιφάνειες επίθεσης, επιλέγουμε chain και ορίζουμε τι πρέπει να είναι αποκεντρωμένο από την πρώτη μέρα.',
    'pr.2t': 'Αρχιτεκτονική και σχεδιασμός', 'pr.2p': 'Contracts, off-chain υπηρεσίες και ροές client σχεδιασμένα μαζί, με διακυβέρνηση και διαδρομές αναβάθμισης αποφασισμένες εκ των προτέρων.',
    'pr.3t': 'Κατασκευή και επαλήθευση', 'pr.3p': 'Agile sprints με tests αναλλοίωτων, fuzzing και αναπτύξεις σε testnet κάθε εβδομάδα, συν native clients όπου χρειάζεται.',
    'pr.4t': 'Audit και εκκίνηση', 'pr.4p': 'Συντονισμός εξωτερικού audit, επαληθευμένος κώδικας, παρακολούθηση και σταδιακή ανάπτυξη σε mainnet με πολιτική on-chain kill-switch.',

    'st.eyebrow': '// ΟΠΛΟΣΤΑΣΙΟ',
    'st.title': 'Εργαλεία που <span class="holo">εμπιστευόμαστε σε παραγωγή.</span>',
    'st.c1': 'ON-CHAIN', 'st.c2': 'CHAINS', 'st.c3': 'MOBILE', 'st.c4': 'ΥΠΟΔΟΜΗ',

    'cta.eyebrow': '// ΕΤΟΙΜΟΙ;',
    'cta.title': 'Ας χτίσουμε κάτι που <span class="holo">κανείς δεν μπορεί να σβήσει.</span>',
    'cta.sub': 'Πείτε μας για το chain, τα contracts και τους χρήστες σας. Ένας μηχανικός απαντά εντός μίας εργάσιμης ημέρας.',
    'cta.main': 'Ξεκινήστε το έργο σας <i class="fas fa-arrow-right"></i>',

    'ct.eyebrow': '// ΖΗΤΗΣΤΕ ΠΡΟΣΦΟΡΑ',
    'ct.title': 'Ορίστε το <span class="holo">πρωτόκολλό σας.</span>',
    'ct.sub': 'Λίγα στοιχεία σας οδηγούν στον κατάλληλο μηχανικό και σας εξασφαλίζουν πραγματική εκτίμηση, όχι εμπορική κλήση.',
    'ct.email': 'EMAIL', 'ct.resp': 'ΑΠΑΝΤΗΣΗ', 'ct.respV': 'Εντός μίας εργάσιμης ημέρας', 'ct.conf': 'ΕΜΠΙΣΤΕΥΤΙΚΟ', 'ct.confV': 'NDA πριν από κάθε τεχνική συζήτηση',
    'ct.term': '$ apex scope --chain evm --layer protocol,mobile\n✓ μοντέλο απειλών συντάχθηκε\n✓ μηχανικός ανατέθηκε\n✓ εκτίμηση σε &lt; 24h ▍',

    'f.name': 'Ονοματεπώνυμο *', 'f.email': 'Εταιρικό email *', 'f.company': 'Εταιρεία / Πρωτόκολλο',
    'f.service': 'Υπηρεσία ενδιαφέροντος *', 'f.serviceSel': 'Επιλέξτε υπηρεσία...',
    'f.chain': 'Blockchain-στόχος *', 'f.chainSel': 'Επιλέξτε chain...', 'f.chainCross': 'Cross-chain', 'f.chainUndecided': 'Δεν έχει αποφασιστεί ακόμη',
    'f.budget': 'Προϋπολογισμός έργου', 'f.budgetSel': 'Επιλέξτε εύρος...', 'f.b1': 'Κάτω από 15.000 USD',
    'f.msg': 'Πείτε μας για το έργο σας *', 'f.msgPh': 'Contracts που εμπλέκονται, chains, πλατφόρμες, υπάρχον προϊόν (αν υπάρχει), χρονοδιάγραμμα...',
    'f.consent': 'Συμφωνώ να επικοινωνήσετε μαζί μου μέσω email για το αίτημά μου. *',
    'f.submit': 'Ζητήστε προσφορά <i class="fas fa-paper-plane"></i>', 'f.sending': '<i class="fas fa-spinner fa-spin"></i> Αποστολή...',
    'f.ok': '<i class="fas fa-check-circle"></i> Το αίτημα ελήφθη. Ένας μηχανικός θα απαντήσει εντός μίας εργάσιμης ημέρας.',
    'f.err': '<i class="fas fa-exclamation-circle"></i> Κάτι πήγε στραβά. Στείλτε μας email στο <a href="mailto:hello@apexblock.tech">hello@apexblock.tech</a>.',

    'ft.brand': 'Στούντιο μηχανικής blockchain πλήρους φάσματος. Ειδικότητα: ό,τι είναι αποκεντρωμένο.',
    'ft.services': 'ΥΠΗΡΕΣΙΕΣ', 'ft.s1': 'Αποκεντρωμένα πρωτόκολλα', 'ft.s3': 'DeFi και dApps',
    'ft.company': 'ΕΤΑΙΡΕΙΑ', 'ft.cases': 'Case studies', 'ft.contact': 'ΕΠΙΚΟΙΝΩΝΙΑ',
    'ft.copy': '&copy; 2026 Apex Block. Με επιφύλαξη παντός δικαιώματος. Χτισμένο αποκεντρωμένα.',
    'ft.privacy': 'Πολιτική απορρήτου', 'ft.terms': 'Όροι χρήσης'
  };

  var DICTS = { es: ES, el: EL };

  /* ---------- Stored language & early boot ---------- */
  function readStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.indexOf(v) !== -1) return v;
    } catch (e) { /* storage blocked */ }
    return DEFAULT_LANG;
  }

  var current = readStored();
  var root = document.documentElement;
  root.lang = current;

  // Avoid a flash of English when the stored language is another one
  if (current !== DEFAULT_LANG) {
    root.classList.add('apx-i18n-pending');
    var hide = document.createElement('style');
    hide.textContent = 'html.apx-i18n-pending body{opacity:0!important}';
    (document.head || root).appendChild(hide);
    setTimeout(function () { root.classList.remove('apx-i18n-pending'); }, 2000); // safety net
  }

  /* ---------- DOM translation ---------- */
  var originals = new Map(); // element → { html, attrs }

  function parseAttrs(el) {
    return el.getAttribute('data-i18n-attr').split('|').map(function (pair) {
      var i = pair.indexOf(':');
      return { attr: pair.slice(0, i).trim(), key: pair.slice(i + 1).trim() };
    });
  }

  function snapshot() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var o = originals.get(el) || {};
      if (o.html === undefined) o.html = el.innerHTML;
      originals.set(el, o);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var o = originals.get(el) || {};
      o.attrs = o.attrs || {};
      parseAttrs(el).forEach(function (p) {
        if (!(p.attr in o.attrs)) o.attrs[p.attr] = el.getAttribute(p.attr);
      });
      originals.set(el, o);
    });
  }

  function lookup(lang, key) {
    var dict = DICTS[lang];
    return dict && Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : null;
  }

  function apply(lang) {
    originals.forEach(function (o, el) {
      if (o.html !== undefined) {
        var v = lookup(lang, el.getAttribute('data-i18n'));
        var next = v !== null ? v : o.html;
        if (el.innerHTML !== next) el.innerHTML = next;
      }
      if (o.attrs) {
        parseAttrs(el).forEach(function (p) {
          var v = lookup(lang, p.key);
          var next = v !== null ? v : o.attrs[p.attr];
          if (next === null) el.removeAttribute(p.attr);
          else el.setAttribute(p.attr, next);
        });
      }
    });
    root.lang = lang;
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-set-lang') === lang));
    });
    root.classList.remove('apx-i18n-pending');
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    apply(lang);
    document.dispatchEvent(new CustomEvent('apx:langchange', { detail: { lang: lang } }));
  }

  window.ApexI18n = {
    setLang: setLang,
    getLang: function () { return current; },
    rotatorWords: function (lang) { return ROTATOR[lang || current] || ROTATOR.en; }
  };

  function init() {
    snapshot();
    apply(current);
    document.dispatchEvent(new CustomEvent('apx:langchange', { detail: { lang: current } }));
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('[data-set-lang]');
      if (btn) setLang(btn.getAttribute('data-set-lang'));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
