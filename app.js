/* ============================================================
   INTERVIEW PRACTICE TRACKER — app.js
   VITO · AI Software Engineer · Medical Software & Regulatory Innovation
   ============================================================ */

const STORAGE_KEY       = "ivtPracticeCards";
const FLASH_STORAGE_KEY = "ivtPracticeFlashState";
const GIST_PAT_KEY      = "ivtGistPat";
const GIST_ID_KEY       = "ivtGistId";
const GIST_FILENAME     = "ivt-practice-data.json";
const DAILY_LIMIT       = 5;
const INTERVIEW_DATE    = new Date("2026-06-05T10:45:00");

const QA_BLOCK_REGEX = /(?:^|\n)(?:Q(?:uestion)?\s*[:.-]\s*)([\s\S]*?)(?:\nA(?:nswer)?\s*[:.-]\s*)([\s\S]*?)(?=(?:\nQ(?:uestion)?\s*[:.-])|$)/gi;

/* ---- VITO Sample Questions — exact text from interview prep workspace ---- */
const VITO_SAMPLE_QA = [
  // ── FROM: vito_introductory_interview_prep_workspace.md ──────────────────
  {
    question: "Give your 90-second self-introduction.",
    answer: "Thank you for inviting me. My background is in biomedical engineering, but most of my recent work has been at the point where healthcare or research ideas need to become usable software.\n\nAt Mindspeller, I worked as the technical owner across several health-adjacent products. The most relevant example is an EEG-based neuroprofiling and AI reporting platform, where I worked across data collection, preprocessing, feature extraction, AI-assisted interpretation, backend services, frontend workflows, deployment, validation checks, and documentation.\n\nWhat I think fits well with this VITO role is that it is not only about building AI models. It is about turning use cases into prototypes, making workflows testable, documenting behavior, and thinking about responsible deployment in healthcare. I am not yet a regulatory specialist, but I have practical experience with GDPR-aware workflows, documentation, validation logic, and medical technology systems, and I am very motivated to grow deeper into MDSW, IVDR, AI Act, and regulatory-ready AI software.\n\nSo the reason this role interests me is that it sits exactly between the areas I want to build in: AI workflows, biomedical data, medical software, and real-world healthcare impact."
  },
  {
    question: "Why VITO?",
    answer: "What attracts me to VITO is the position between research and practical healthcare application. I have worked on AI-enabled and biomedical software systems, but I want to grow in an environment where those systems are built with more attention to validation, documentation, regulation, and real-world medical impact. VITO's Digital BioSystems work feels like a strong fit because it combines AI, health data, digital twins, and regulatory thinking instead of treating them as separate areas."
  },
  {
    question: "Why this role?",
    answer: "What attracted me is that the role combines building and thinking. I like defining the workflow, understanding the data, building the prototype, testing it, documenting the behavior, and then improving what is unclear or unreliable.\n\nThat is very similar to how I worked at Mindspeller, but VITO gives that work a stronger healthcare, research, and regulatory direction. I do not see this as a narrow AI role. I see it as a role where AI, healthcare software, requirements, prototyping, validation, and documentation all come together. That is exactly the kind of work I want to do."
  },
  {
    question: "Tell us about your AI workflow experience.",
    answer: "One example is the EEG neuroprofiling and AI reporting workflow I built. The system collected EEG and behavioral data, processed it through signal-processing and feature-extraction steps, then used AI-assisted interpretation to generate clearer summaries for non-technical users.\n\nThe important part was not just calling an LLM. I had to structure the inputs, decide what should be deterministic versus generated, add validation and review steps, and make the output understandable. That taught me to treat AI as one component inside a larger controlled workflow, not as a black box.\n\nPoints to include if asked deeper:\n- Used AI APIs such as OpenAI, Claude, and Google AI APIs.\n- Worked on structured prompting and AI-assisted reporting.\n- Used human-in-the-loop review for sensitive outputs.\n- Built data quality and output consistency checks.\n- Focused on making generated outputs understandable and usable."
  },
  {
    question: "How do you handle validation?",
    answer: "I usually start by separating the workflow into stages: input quality, processing logic, generated output, and user-facing interpretation. For EEG and AI reporting, I used data quality checks, output consistency checks, manual review loops, and structured reporting.\n\nFor AI outputs specifically, I do not assume generation is correct just because the response sounds good. I prefer grounding, traceability, expected-output checks, and human review where the risk is high. Especially in healthcare-related systems, I think validation needs to be part of the workflow design from the beginning, not something added only at the end."
  },
  {
    question: "What is your regulatory experience?",
    answer: "I would describe myself as regulatory-aware rather than a regulatory specialist. I am familiar with MDR and SaMD concepts, and I have worked with GDPR-aware workflows, access control, documentation, validation logic, and audit-friendly handling.\n\nWhat I want to grow into is the translation layer: how regulatory requirements become development, testing, documentation, traceability, and validation practices. I have not owned a full regulatory submission or certification process, so I would not overclaim that experience. But I do have the right engineering mindset for it because I already care about workflow clarity, traceability, documentation, and controlled outputs."
  },
  {
    question: "What is your weakness for this role?",
    answer: "My main growth area is formal regulatory depth, especially IVDR, AI Act, and detailed MDSW validation frameworks. I have worked around documentation, GDPR-aware handling, and validation logic in practice, but I have not yet owned a full regulatory submission or certification process.\n\nThe reason I am interested in VITO is that I want to build that depth while contributing hands-on software and AI workflow experience from day one."
  },
  {
    question: "How do you work when requirements are unclear?",
    answer: "I try to make ambiguity visible early. I usually translate the idea into a workflow: who is the user, what data enters the system, what output is expected, what decisions are automated, what needs review, and what can fail.\n\nThen I build a small prototype or proof-of-concept to test the assumptions. Once the behavior is clearer, I document the workflow and refine it with stakeholders. This is how I worked at Mindspeller, where many ideas started as broad product or research needs and had to be turned into concrete data flows, backend logic, frontend workflows, and validation steps."
  },
  {
    question: "Why are you applying for a new role while already employed?",
    answer: "My current role has been extremely valuable because it gave me unusual end-to-end ownership very early. I worked across AI workflows, backend services, frontend workflows, biomedical data pipelines, deployment, documentation, validation logic, and GDPR-aware handling. That experience made me a much stronger builder.\n\nThe reason I am exploring a new role is not because I want to simply leave my current company. It is because I want my next step to be more directly aligned with healthcare AI, medical software, and real-world patient impact. When I joined full-time after my internship, what attracted me most was the possibility of contributing to health-related neurotechnology, especially assistive communication for patients with severe motor impairment. Over time, my work became much more focused on the mother company's B2B neuromarketing and consumer-tech side. I learned a lot from that, but it is not the long-term direction I want to build my career in.\n\nVITO is interesting to me because this role brings me back to the space I originally wanted to grow into: AI-enabled healthcare systems, medical software, validation, documentation, regulatory-readiness, and practical impact. I am looking for a role where my builder experience can be used in a more focused healthcare and medtech environment."
  },
  {
    question: "Why should we choose you?",
    answer: "I think my strongest value is that I can connect several layers that are important for this role. I understand biomedical systems and physiological data because of my background. I can build software hands-on across backend, frontend, APIs, data pipelines, and deployment. I have practical experience integrating AI into real workflows. And I already think in terms of validation, documentation, GDPR-aware handling, and user-facing reliability.\n\nI am not claiming to be the finished expert in medical software regulation yet. But I do think I bring the right combination of builder mindset, biomedical context, AI workflow experience, and motivation to grow into regulatory-ready healthcare software."
  },
  {
    question: "Tell us about the EEG AI reporting platform.",
    answer: "The EEG platform is probably the most relevant example from my experience. The goal was to move from raw EEG and behavioral data to outputs that users could actually understand. So I worked across the full workflow: headset configuration, data collection, preprocessing, feature extraction, backend services, AI-assisted interpretation, frontend reporting, validation checks, and documentation.\n\nWhat makes this relevant to VITO is that it required more than coding. I had to understand the data, define the workflow, think about reliability, and make sure the output was usable. I also had to think carefully about what should be generated by AI and what should remain structured or rule-based."
  },
  {
    question: "What do you mean by end-to-end ownership? Give an example.",
    answer: "A good example is the neuroprofiling and AI reporting platform I built at Mindspeller.\n\nThe company had a legacy product that was not performing well, and we wanted to create a new product that moved from mainly B2B neuromarketing toward a more scalable user-facing experience. Since the company already had a semantic network developed over several years, and the company's identity was strongly connected to neurotechnology, the idea was to combine EEG, cognitive tasks, semantic responses, and AI-generated interpretation into one product.\n\nMy role was end-to-end because I had to work across the full chain. I helped narrow the product direction from broad ideas like career, relationship, and lifestyle profiling into a more focused career-profiling product. Then I evaluated and selected a commercially viable EEG headset. Because it was a consumer-grade single-channel headset, the data quality and quantity were limited, so I had to build a live processing layer that was robust enough for those constraints.\n\nI also worked on the EEG task design. The tasks had to be researched carefully because we were trying to extract meaningful cognitive features from limited EEG data. The processing approach was later refined with input from a professor in computational neuroscience.\n\nFrom there, I built the software workflow around EEG acquisition, preprocessing, feature extraction, report generation, and user-facing interpretation. In parallel, I built the semantic IAT path, where user responses were used to compare implicit and explicit behavior patterns.\n\nThe AI part was used as an interpretation layer. The product eventually used three agents: one to interpret the EEG-based implicit report, one to interpret the IAT path responses, and a final one to generate the overall neuroprofile. We also improved the recommendation logic after real-world use. In the first version, role suggestions were more LLM-driven. After launching it at an event with thousands of users and later positioning it for recruiters as a decision-support layer, we realised the recommendations needed to be more explainable. So I refined the second version by mapping cognitive features to role-relevant abilities and using a curated role list, so the AI selected from a controlled structure instead of freely generating roles.\n\nSo for me, end-to-end means I was involved from product definition and hardware selection all the way to signal processing, backend workflows, frontend experience, AI interpretation, report generation, validation thinking, and iteration after real users interacted with the product."
  },
  {
    question: "Tell us about your RAG/document assistant project.",
    answer: "I built a local RAG document assistant to explore privacy-focused document search and grounded generation. The workflow included PDF ingestion, OCR support, text chunking, embedding generation, hybrid BM25 and vector retrieval, and a chat interface that generated answers from retrieved document context.\n\nThe reason I built it locally was to reduce unnecessary data exposure and to make the system more controllable. It also helped me understand how important retrieval quality, chunking, source grounding, and evaluation are when using GenAI in document-heavy workflows."
  },
  {
    question: "Tell us about your KU Leuven work.",
    answer: "At KU Leuven, I am working on structured pipelines for multi-channel EEG datasets related to early Alzheimer's diagnosis. My work involves preprocessing, feature extraction, validation, and downstream analysis workflows.\n\nThe main value I bring there is translating neuroscience research requirements into reproducible software workflows. In research settings, the code and the process can easily become difficult to reproduce, so I focus on clear inputs and outputs, validation steps, and pipeline structure."
  },
  {
    question: "How do you handle sensitive data and GDPR?",
    answer: "My practical experience comes from working with data-sensitive workflows at Mindspeller, where I also served as Data Protection Officer. I supported GDPR-aware access control, responsible data handling, and privacy-conscious product workflows.\n\nFrom an engineering point of view, I try to think about data minimisation, access boundaries, role-based permissions, traceability, and avoiding unnecessary exposure of sensitive inputs. For AI workflows, I also think it is important to be careful about what is sent to external APIs, how outputs are stored, and whether users understand the limits of generated content."
  },
  {
    question: "What technical tools have you used?",
    answer: "My strongest hands-on stack is Python, Vue.js, JavaScript, REST APIs, MySQL, Docker, GitLab CI/CD, AWS, Linux, and Datadog. For AI workflows, I have used OpenAI GPT models, Anthropic Claude, Google AI APIs, local RAG systems, Streamlit, OpenSearch, Sentence Transformers, and Ollama.\n\nI have more experience with Vue than React, but the core frontend concepts transfer well: component structure, state, API integration, user workflows, and validation logic. I would be comfortable adapting to React where needed."
  },
  {
    question: "How do you deal with production issues?",
    answer: "I try to debug from the system level rather than only looking at the visible error. I look at what changed, where the failure appears, whether it is frontend, backend, database, API, deployment, infrastructure, or data-related, and then narrow it down with logs and reproduction steps.\n\nOne example was a production-critical CI/CD failure caused by runtime and operating system deprecation. Instead of making large application-level changes, I upgraded the execution environment and adjusted the pipeline so that the system could continue running with minimal disruption."
  },
  {
    question: "What do you know about digital twins / personalised medicine?",
    answer: "My understanding is that digital twins in healthcare are personalised computational representations that integrate different types of data to support prediction, prevention, diagnosis, or treatment decisions. What interests me is that they require more than a model. They need data integration, quality control, interpretability, validation, user trust, and clear clinical or research purpose.\n\nI do not claim to be an expert in digital twins yet, but my experience with biomedical data pipelines, AI-assisted reporting, and healthcare software makes me excited to work in that direction."
  },
  // ── FROM: vito_introductory_interview_prep_workspace_2.md ────────────────
  {
    question: "How did your three-agent neuroprofiling system work?",
    answer: "The neuroprofiling platform used AI as an interpretation layer on top of structured inputs, not as a free-form decision maker.\n\nThe system had three main interpretation agents. The first agent interpreted the EEG-based implicit report. It worked from processed EEG-derived features and converted those structured outputs into a more readable interpretation. The second agent interpreted the semantic IAT path responses, which captured patterns from user responses and helped compare implicit and explicit behavior. The third agent combined the outputs of the first two agents to generate the final neuroprofile.\n\nThe important design decision was that the AI did not start from nothing. It worked from structured intermediate outputs. That made the workflow easier to control, easier to explain, and easier to refine compared with asking one model to generate a full profile directly from raw or loosely structured data.\n\nKey point: I used AI as an interpretation layer inside a structured workflow, not as the source of truth."
  },
  {
    question: "Why did you use multiple agents instead of one prompt?",
    answer: "I used multiple agents because the workflow had different types of interpretation. The EEG-derived report and the semantic IAT path were not the same kind of input, so combining everything into one prompt would have made the system harder to control and debug.\n\nBy separating the workflow into agents, each step had a clearer responsibility. One agent focused on the implicit EEG-related interpretation, one focused on the IAT response interpretation, and the final agent synthesized both into the overall neuroprofile.\n\nThis made the system more modular. If one part of the output was weak, I could inspect whether the issue came from EEG interpretation, IAT interpretation, or final synthesis. It also made iteration easier when we refined the recommendation logic in the second version.\n\nKey point: Multiple agents were used for separation of responsibility, traceability, and easier debugging."
  },
  {
    question: "How did you validate AI-generated reports?",
    answer: "I treated validation as a workflow problem, not just an output review problem. First, I looked at input quality: whether the required data was available, whether the session data was usable, and whether the structured intermediate outputs made sense.\n\nThen I checked whether the AI output was consistent with the structured inputs. For example, the report should not introduce claims that were not supported by the EEG-derived features, IAT responses, or the predefined mapping logic.\n\nI also used manual review and iteration. After the first version was used in a real setting, we saw that open-ended role generation was too difficult to explain. That led to the second version, where the recommendation logic became more controlled through curated role mapping.\n\nKey point: I did not validate AI by asking whether the text sounded good. I checked whether it stayed faithful to structured inputs and whether the output was explainable."
  },
  {
    question: "How did you reduce hallucination or uncontrolled output?",
    answer: "The main way was to reduce how much freedom the model had. In the first version, some outputs were more open-ended, especially role suggestions. After real-world use, we realised that this was not controlled enough.\n\nSo in the second version, I moved toward a more structured approach. Cognitive features were mapped to role-relevant abilities, and the system used a curated role list. The AI then selected and explained from that controlled structure instead of freely inventing roles.\n\nIn general, my approach is to give the model structured inputs, clear boundaries, predefined output formats, and limited decision space. For sensitive workflows, I would also include human review and logging of intermediate outputs.\n\nKey point: I controlled hallucination by constraining the model with structured inputs, curated options, and clearer output boundaries."
  },
  {
    question: "Why did you move from LLM-generated roles to curated role mapping?",
    answer: "The first version gave us useful feedback, but it also showed that open-ended role generation was not explainable enough. If a model freely suggests a role, it can sound convincing, but it becomes difficult to explain why that role was chosen.\n\nFor the second version, I wanted the recommendation logic to be more transparent. So the approach became: extract or define cognitive features, map them to abilities relevant for different roles, use a curated role list, and let the AI select top recommendations from that controlled space.\n\nThat made the output easier to explain and more appropriate for a product that could be used in a recruitment-related context as a decision-support layer.\n\nKey point: The shift from open generation to curated mapping was about explainability, control, and responsible use."
  },
  {
    question: "What makes an AI workflow explainable?",
    answer: "For me, explainability starts before the final AI output. The workflow should make it clear what inputs were used, what transformations happened, what rules or mappings were applied, and what role the AI played.\n\nIn the neuroprofiling product, explainability improved when role suggestions were not simply generated freely. By mapping cognitive features to role-relevant abilities and using a curated role list, the recommendation could be tied back to a structured logic.\n\nIn healthcare or medical software, I would take this further. I would document the intended use, input data, processing steps, model role, expected outputs, limitations, validation approach, and human oversight points.\n\nKey point: Explainability is not only about explaining the final text. It is about making the whole workflow traceable."
  },
  {
    question: "How would you document this system for a medical software context?",
    answer: "I would begin with intended use, because that determines the level of risk and the kind of documentation needed. Then I would document the user requirements, system requirements, data flow, model role, inputs and outputs, validation steps, known limitations, and human review points.\n\nFor an AI workflow, I would also document what is deterministic and what is AI-assisted. That distinction matters because deterministic logic can be tested differently from generated output.\n\nI would include test cases for normal inputs, missing data, poor-quality data, edge cases, repeated runs, and unsafe or unsupported outputs. I would also document how changes to prompts, mappings, models, or data processing affect the system behavior.\n\nKey point: Medical software documentation should connect intended use, requirements, risk, validation, traceability, and change control."
  },
  {
    question: "What would change if this system were used for clinical decision support?",
    answer: "If the system moved into clinical decision support, the expectations would change significantly. The first thing would be to clarify the intended use and claims. A self-insight or decision-support product is very different from software that influences diagnosis, treatment, or clinical decision-making.\n\nIf clinical use were intended, I would expect much stronger requirements around risk analysis, validation, clinical evidence, documentation, traceability, human oversight, data protection, and change control. The AI output would need clear limitations and should not silently make high-impact decisions.\n\nI would also be much more careful about performance evaluation, dataset representativeness, failure modes, and how clinicians interact with the output.\n\nKey point: Clinical decision support requires a different level of validation, evidence, documentation, and risk control."
  },
  {
    question: "What is your understanding of SaMD / MDSW?",
    answer: "My understanding is that SaMD or medical device software is software that has a medical intended purpose, such as supporting diagnosis, prevention, monitoring, prediction, prognosis, treatment, or alleviation of disease.\n\nThe key issue is intended use. The same technical system can fall into a different category depending on the claims made and how the output is used. If software is only for general wellness or internal research, the regulatory expectations may be different. But if it supports medical decisions, then risk classification, validation, clinical evidence, technical documentation, and post-market considerations become much more important.\n\nI would describe myself as regulatory-aware rather than a regulatory specialist, but I understand why intended use, risk, traceability, and validation are central.\n\nKey point: Intended use drives whether software becomes medical software and what regulatory expectations apply."
  },
  {
    question: "How do you translate user requirements into system requirements?",
    answer: "I start by mapping the workflow in practical terms. Who is the user? What problem are they trying to solve? What data enters the system? What output do they need? What decisions are automated? What needs human review? What can fail?\n\nFrom there, I convert the user need into system behavior. For example, if the user needs a reliable report, the system requirements may include input validation, required data checks, processing steps, report generation logic, error handling, access control, and output review.\n\nIn my Mindspeller work, many ideas started as broad product or research needs. My job was often to turn those into data flows, backend logic, frontend workflows, validation steps, and documentation.\n\nKey point: I convert vague needs into workflows, then workflows into system behavior and testable requirements."
  },
  {
    question: "How would you test an AI healthcare prototype?",
    answer: "I would test it at multiple levels. First, I would test the non-AI parts: data ingestion, preprocessing, API behavior, database storage, access control, and frontend behavior.\n\nThen I would test the AI workflow separately. I would check whether the model receives the right inputs, whether the output follows the expected format, whether it stays grounded in the provided data, whether it behaves consistently across similar cases, and whether it handles missing or poor-quality inputs safely.\n\nFor healthcare-related prototypes, I would also test safety and usability: whether the output overclaims, whether limitations are clear, whether human review is needed, and whether the output could be misinterpreted.\n\nKey point: AI healthcare testing should include technical correctness, output quality, safety, usability, and traceability."
  },
  {
    question: "What is RAG, and where would it help in regulatory workflows?",
    answer: "RAG stands for retrieval-augmented generation. Instead of asking a model to answer only from its internal knowledge, the system first retrieves relevant information from a document collection and then generates an answer grounded in that retrieved context.\n\nIn regulatory workflows, RAG could be useful for searching guidance documents, standards, internal procedures, technical documentation, or previous evidence. It can help users find relevant sections and generate draft summaries or requirement mappings.\n\nBut I would be careful with it. In regulatory contexts, the generated answer should not be treated as final authority. The system should show sources, support traceability, and include human review. Retrieval quality is also important because if the wrong documents are retrieved, the generated answer may still sound convincing but be wrong.\n\nKey point: RAG is useful for source-grounded support, but regulatory use needs citations, retrieval checks, and human review."
  },
  {
    question: "How do you handle sensitive health-related data?",
    answer: "I think about sensitive data from the start of the workflow. The main questions are: what data is truly necessary, who needs access, where is it stored, whether it is sent to external services, how long it is retained, and how outputs are controlled.\n\nIn my previous role, I worked with GDPR-aware workflows and access control, and I also had DPO responsibilities. From an engineering point of view, I try to apply data minimisation, role-based access, audit-friendly handling, and careful separation between raw data, processed features, and generated outputs.\n\nFor AI workflows, I would be especially careful about sending sensitive data to external APIs. Depending on the use case, I would consider anonymisation, pseudonymisation, local processing, contractual safeguards, or human review before any high-impact use.\n\nKey point: Sensitive data handling is not only a legal concern. It affects architecture, access control, model choice, storage, logging, and review."
  },
  {
    question: "What are your gaps in regulatory knowledge, and how are you addressing them?",
    answer: "My main gap is that I have not yet owned a full medical software regulatory submission or certification process. I am familiar with MDR and SaMD concepts, and I have practical experience with documentation, validation logic, GDPR-aware workflows, and sensitive data handling, but I would not claim to be a regulatory specialist yet.\n\nWhat I am trying to build is the translation layer between regulation and engineering. I want to understand how requirements from MDR, IVDR, AI Act, and medical software guidance become practical development activities: user requirements, system requirements, risk controls, validation plans, technical documentation, traceability, and post-deployment monitoring.\n\nThat is one of the reasons I am interested in this VITO role. It would allow me to contribute as a hands-on AI/software engineer while growing deeper into regulatory-ready healthcare software.\n\nKey point: I am honest about not being a regulatory specialist yet, but I understand the engineering mindset needed for regulated healthcare software."
  }
];

/* ---- DOM Element Cache ---- */
const el = {
  fileInput:        document.getElementById("fileInput"),
  rawInput:         document.getElementById("rawInput"),
  importBtn:        document.getElementById("importBtn"),
  clearAllBtn:      document.getElementById("clearAllBtn"),
  importStatus:     document.getElementById("importStatus"),
  filterSelect:     document.getElementById("filterSelect"),
  cardList:         document.getElementById("cardList"),
  flashcardWrapper: document.getElementById("flashcardWrapper"),
  flashcard:        document.getElementById("flashcard"),
  flashQuestion:    document.getElementById("flashQuestion"),
  flashAnswer:      document.getElementById("flashAnswer"),
  showAnswerBtn:    document.getElementById("showAnswerBtn"),
  showAnswerLabel:  document.getElementById("showAnswerLabel"),
  nextFlashBtn:     document.getElementById("nextFlashBtn"),
  flashcardEmpty:   document.getElementById("flashcardEmpty"),
  flashcardDate:    document.getElementById("flashcardDate"),
  flashCounter:     document.getElementById("flashCounter"),
  loadVitoBtn:      document.getElementById("loadVitoBtn"),
  countdownValue:   document.getElementById("countdownValue"),
  statTotal:        document.getElementById("statTotal"),
  statUnread:       document.getElementById("statUnread"),
  statRevisit:      document.getElementById("statRevisit"),
  statCompleted:    document.getElementById("statCompleted"),
  progressBar:      document.getElementById("progressBar"),
  progressLabel:    document.getElementById("progressLabel"),
  // Sync UI
  syncDot:          document.getElementById("syncDot"),
  syncBarMsg:       document.getElementById("syncBarMsg"),
  syncToggleBtn:    document.getElementById("syncToggleBtn"),
  syncDrawer:       document.getElementById("syncDrawer"),
  gistPatInput:     document.getElementById("gistPatInput"),
  gistIdInput:      document.getElementById("gistIdInput"),
  syncConnectBtn:   document.getElementById("syncConnectBtn"),
  syncPullBtn:      document.getElementById("syncPullBtn"),
  syncPushBtn:      document.getElementById("syncPushBtn"),
  syncDisconnectBtn:document.getElementById("syncDisconnectBtn"),
  syncStatus:       document.getElementById("syncStatus"),
};

/* ---- State ---- */
let cards      = loadCards();
let flashState = loadFlashState();

/* ============================================================
   STORAGE
   ============================================================ */
function loadCards() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  gist.schedulePush();
}
function loadFlashState() {
  try { return JSON.parse(localStorage.getItem(FLASH_STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveFlashState() {
  localStorage.setItem(FLASH_STORAGE_KEY, JSON.stringify(flashState));
}

/* ============================================================
   CLOUD SYNC — GitHub Gist
   ============================================================ */
const gist = {
  pat:       localStorage.getItem(GIST_PAT_KEY)  || "",
  id:        localStorage.getItem(GIST_ID_KEY)   || "",
  status:    "disconnected",
  pushTimer: null,

  isReady()  { return !!(this.pat && this.id); },

  saveConfig(pat, id) {
    this.pat = pat;
    this.id  = id;
    pat ? localStorage.setItem(GIST_PAT_KEY, pat) : localStorage.removeItem(GIST_PAT_KEY);
    id  ? localStorage.setItem(GIST_ID_KEY,  id)  : localStorage.removeItem(GIST_ID_KEY);
  },

  headers() {
    return {
      "Authorization":        `Bearer ${this.pat}`,
      "Accept":               "application/vnd.github+json",
      "Content-Type":         "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
  },

  _payload() {
    return JSON.stringify({
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify({ cards, flashState, lastSynced: new Date().toISOString() }, null, 2)
        }
      }
    });
  },

  async connect() {
    if (!this.pat) { renderSyncUI("Enter a Personal Access Token first."); return; }
    this.status = "syncing";
    renderSyncUI();
    try {
      const auth = await fetch("https://api.github.com/user", { headers: this.headers() });
      if (!auth.ok) throw new Error(`GitHub auth failed (${auth.status}). Check your token.`);

      if (this.id) {
        await this._doPull();
      } else {
        const r = await fetch("https://api.github.com/gists", {
          method:  "POST",
          headers: this.headers(),
          body:    JSON.stringify({
            description: "IVT Practice Tracker — Interview Prep Data",
            public:      false,
            files:       { [GIST_FILENAME]: { content: JSON.stringify({ cards, flashState, lastSynced: new Date().toISOString() }, null, 2) } }
          })
        });
        if (!r.ok) throw new Error(`Failed to create Gist (${r.status}).`);
        const data = await r.json();
        this.saveConfig(this.pat, data.id);
        this.status = "ok";
        el.gistIdInput.value = data.id;
        renderSyncUI(`New Gist created — copy the ID above to use on other devices.`);
      }
    } catch (e) {
      this.status = "error";
      renderSyncUI(e.message);
    }
  },

  async _doPull() {
    const r = await fetch(`https://api.github.com/gists/${this.id}`, { headers: this.headers() });
    if (!r.ok) throw new Error(`Could not fetch Gist (${r.status}). Check the Gist ID.`);
    const data = await r.json();
    const file = data.files[GIST_FILENAME];
    if (!file) throw new Error(`File "${GIST_FILENAME}" not found in Gist. Wrong Gist ID?`);
    const remote = JSON.parse(file.content);
    if (Array.isArray(remote.cards)) {
      cards      = remote.cards;
      flashState = remote.flashState || {};
      // Always refresh VITO answers from source MD — fixes stale Gist data
      const existingMap = new Map(cards.map((c) => [c.question.toLowerCase().trim(), c]));
      let refreshed = 0;
      VITO_SAMPLE_QA.forEach((qa) => {
        const key = qa.question.toLowerCase().trim();
        if (existingMap.has(key) && existingMap.get(key).answer !== qa.answer) {
          existingMap.get(key).answer = qa.answer;
          refreshed++;
        }
      });
      localStorage.setItem(STORAGE_KEY,       JSON.stringify(cards));
      localStorage.setItem(FLASH_STORAGE_KEY, JSON.stringify(flashState));
      if (refreshed > 0) this.schedulePush(); // propagate corrected answers back to Gist
      renderCards();
      renderFlashcard();
      renderStats();
    }
    const ts = remote.lastSynced ? new Date(remote.lastSynced).toLocaleString() : "unknown";
    this.status = "ok";
    renderSyncUI(`Pulled · last cloud save: ${ts}`);
  },

  async pull() {
    if (!this.isReady()) return;
    this.status = "syncing";
    renderSyncUI();
    try       { await this._doPull(); }
    catch (e) { this.status = "error"; renderSyncUI(e.message); }
  },

  async push() {
    if (!this.isReady()) return;
    this.status = "syncing";
    renderSyncUI();
    try {
      const r = await fetch(`https://api.github.com/gists/${this.id}`, {
        method:  "PATCH",
        headers: this.headers(),
        body:    this._payload()
      });
      if (!r.ok) throw new Error(`Gist update failed (${r.status}).`);
      this.status = "ok";
      renderSyncUI(`Synced at ${new Date().toLocaleTimeString()}`);
    } catch (e) {
      this.status = "error";
      renderSyncUI(e.message);
    }
  },

  schedulePush() {
    if (!this.isReady()) return;
    clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => this.push(), 1500);
  },

  async init() {
    if (!this.pat) { renderSyncUI(); return; }
    el.gistPatInput.value = this.pat;
    el.gistIdInput.value  = this.id;
    if (this.id) {
      this.status = "syncing";
      renderSyncUI();
      try       { await this._doPull(); }
      catch (e) { this.status = "error"; renderSyncUI(e.message); }
    } else {
      renderSyncUI("Token saved but no Gist ID. Click Connect to create one.");
    }
  }
};

function renderSyncUI(msg = "") {
  const { syncDot, syncBarMsg, syncPullBtn, syncPushBtn, syncStatus } = el;
  const cls = { disconnected: "", syncing: "syncing", ok: "ok", error: "error" }[gist.status] || "";

  syncDot.className = `sync-dot${cls ? " " + cls : ""}`;
  syncPullBtn.disabled = !gist.isReady();
  syncPushBtn.disabled = !gist.isReady();

  if (gist.status === "disconnected") {
    syncBarMsg.textContent = "Not synced — progress is local to this browser only.";
  } else if (gist.status === "syncing") {
    syncBarMsg.textContent = "Syncing…";
  } else if (gist.status === "ok") {
    syncBarMsg.textContent = `☁ Synced via GitHub Gist${msg ? " · " + msg : ""}`;
  } else {
    syncBarMsg.textContent = `Sync error${msg ? ": " + msg : ""}`;
  }

  if (syncStatus) {
    syncStatus.textContent = msg;
    syncStatus.style.color = gist.status === "ok" ? "var(--green)"
                           : gist.status === "error" ? "var(--red)"
                           : "var(--amber)";
  }
}

/* ============================================================
   PARSING & NORMALIZATION
   ============================================================ */
function generateId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `card-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeCards(parsedCards) {
  return parsedCards
    .map((card) => ({
      id:       generateId(),
      question: (card.question || "").trim(),
      answer:   (card.answer   || "").trim(),
      status:   "unread"
    }))
    .filter((card) => card.question && card.answer);
}

function parseCards(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) return [];

  try {
    const json = JSON.parse(trimmed);
    if (Array.isArray(json)) {
      return json
        .map((item) => ({ question: item.question || item.q || "", answer: item.answer || item.a || "" }))
        .filter((item) => item.question && item.answer);
    }
  } catch { /* continue */ }

  const matches = [];
  let match = QA_BLOCK_REGEX.exec(trimmed);
  while (match !== null) {
    matches.push({ question: match[1].trim(), answer: match[2].trim() });
    match = QA_BLOCK_REGEX.exec(trimmed);
  }
  QA_BLOCK_REGEX.lastIndex = 0;
  if (matches.length > 0) return matches;

  return trimmed
    .split(/\n\s*\n+/)
    .map((block) => {
      const [firstLine, ...rest] = block.split("\n");
      return {
        question: (firstLine || "").replace(/^[-*]\s*/, "").trim(),
        answer:   rest.join("\n").trim()
      };
    })
    .filter((item) => item.question && item.answer);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ============================================================
   STATS & COUNTDOWN
   ============================================================ */
function renderStats() {
  const total     = cards.length;
  const completed = cards.filter((c) => c.status === "completed").length;
  const revisit   = cards.filter((c) => c.status === "revisit").length;
  const unread    = cards.filter((c) => c.status === "unread").length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  el.statTotal.textContent     = total;
  el.statCompleted.textContent = completed;
  el.statRevisit.textContent   = revisit;
  el.statUnread.textContent    = unread;
  el.progressBar.style.width   = `${pct}%`;
  el.progressLabel.textContent = `${pct}% done`;
}

function updateCountdown() {
  const now  = new Date();
  const diff = INTERVIEW_DATE - now;

  if (diff <= 0) {
    el.countdownValue.textContent = "Today!";
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    el.countdownValue.textContent = `${days}d ${hours}h`;
  } else if (hours > 0) {
    el.countdownValue.textContent = `${hours}h ${mins}m`;
  } else {
    el.countdownValue.textContent = `${mins}m`;
  }
}

/* ============================================================
   FLASHCARD
   ============================================================ */
function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function shuffle(values) {
  const copy = values.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function ensureDailyFlashcards() {
  const today = getTodayKey();
  if (flashState.date === today && Array.isArray(flashState.ids) && flashState.ids.length > 0) return;

  const priority = cards.filter((c) => c.status !== "completed");
  const source   = priority.length > 0 ? priority : cards;
  const ids      = shuffle(source.map((c) => c.id)).slice(0, DAILY_LIMIT);

  flashState = { date: today, ids, index: 0, flipped: false };
  saveFlashState();
}

function renderFlashcard() {
  ensureDailyFlashcards();

  if (!cards.length || !flashState.ids || flashState.ids.length === 0) {
    el.flashcardWrapper.classList.add("hidden");
    el.flashcardEmpty.classList.remove("hidden");
    el.flashcardDate.textContent = "";
    el.flashCounter.textContent  = "";
    return;
  }

  const total   = flashState.ids.length;
  const current = flashState.index % total;
  el.flashCounter.textContent = `${current + 1} / ${total}`;
  el.flashcardDate.textContent = `Session · ${flashState.date || getTodayKey()}`;

  const cardId = flashState.ids[current];
  const card   = cards.find((c) => c.id === cardId);

  if (!card) {
    flashState.index = 0;
    saveFlashState();
    renderFlashcard();
    return;
  }

  el.flashQuestion.textContent = card.question;
  el.flashAnswer.textContent   = card.answer;

  if (flashState.flipped) {
    el.flashcard.classList.add("flipped");
    el.showAnswerLabel.textContent = "Hide Answer";
  } else {
    el.flashcard.classList.remove("flipped");
    el.showAnswerLabel.textContent = "Show Answer";
  }

  el.flashcardWrapper.classList.remove("hidden");
  el.flashcardEmpty.classList.add("hidden");
}

/* ============================================================
   PRACTICE CARDS
   ============================================================ */
function renderCards() {
  const filter  = el.filterSelect.value;
  const visible = cards.filter((c) => filter === "all" || c.status === filter);

  el.cardList.innerHTML = "";

  if (visible.length === 0) {
    el.cardList.innerHTML = `<li class="empty-state"><span class="empty-icon">▶_</span>No cards for this filter.</li>`;
    return;
  }

  visible.forEach((card) => {
    const li = document.createElement("li");
    li.className = `card status-${card.status}`;
    li.dataset.id = card.id;
    li.innerHTML = `
      <p class="card-question"><span class="card-q-label">Q</span>${escapeHtml(card.question)}</p>
      <p class="card-answer"><span class="card-a-label">A</span>${escapeHtml(card.answer)}</p>
      <div class="card-footer">
        <span class="badge badge-${card.status}">${card.status}</span>
        <div class="card-actions">
          <button class="btn-card btn-card-done"    data-id="${card.id}" data-status="completed">✓ Done</button>
          <button class="btn-card btn-card-revisit" data-id="${card.id}" data-status="revisit">↩ Revisit</button>
          <button class="btn-card btn-card-reset"   data-id="${card.id}" data-status="unread">○ Unread</button>
          <button class="btn-card btn-card-edit"    data-id="${card.id}">✎ Edit</button>
        </div>
      </div>
    `;
    el.cardList.appendChild(li);
  });
}

/* ============================================================
   IMPORT
   ============================================================ */
function importCardsFromText(rawText) {
  const parsed     = parseCards(rawText);
  const normalized = normalizeCards(parsed);

  if (normalized.length === 0) {
    el.importStatus.textContent = "No valid cards found. Use Q:/A: pairs or JSON [{question,answer}].";
    el.importStatus.style.color = "var(--red)";
    return;
  }

  cards = cards.concat(normalized);
  saveCards();
  flashState = {};
  saveFlashState();

  el.importStatus.textContent = `✓ Imported ${normalized.cards} cards.`;
  el.importStatus.style.color = "var(--green)";
  el.importStatus.textContent = `✓ Imported ${normalized.length} card${normalized.length === 1 ? "" : "s"}.`;
  renderCards();
  renderFlashcard();
  renderStats();
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
el.importBtn.addEventListener("click", () => {
  importCardsFromText(el.rawInput.value);
  el.rawInput.value = "";
});

el.fileInput.addEventListener("change", async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const text = await file.text();
  importCardsFromText(text);
  el.fileInput.value = "";
});

el.clearAllBtn.addEventListener("click", () => {
  cards      = [];
  flashState = {};
  saveCards();
  saveFlashState();
  el.importStatus.textContent = "All cards cleared.";
  el.importStatus.style.color = "var(--text-muted)";
  renderCards();
  renderFlashcard();
  renderStats();
});

el.loadVitoBtn.addEventListener("click", () => {
  // Build a map of existing cards by normalised question text
  const existingMap = new Map(cards.map((c) => [c.question.toLowerCase().trim(), c]));

  let added = 0, updated = 0;
  VITO_SAMPLE_QA.forEach((qa) => {
    const key = qa.question.toLowerCase().trim();
    if (existingMap.has(key)) {
      // Update the answer of the existing card to match the MD source
      existingMap.get(key).answer = qa.answer;
      updated++;
    } else {
      cards = cards.concat(normalizeCards([qa]));
      added++;
    }
  });

  saveCards();
  flashState = {};
  saveFlashState();

  const parts = [];
  if (added)   parts.push(`${added} added`);
  if (updated) parts.push(`${updated} answers updated`);
  el.importStatus.textContent = parts.length
    ? `⚡ VITO questions: ${parts.join(", ")}.`
    : "VITO questions already up to date.";
  el.importStatus.style.color = "var(--cyan)";
  renderCards();
  renderFlashcard();
  renderStats();
});

/* Flashcard flip */
function toggleFlip() {
  flashState.flipped = !flashState.flipped;
  saveFlashState();
  renderFlashcard();
}

el.showAnswerBtn.addEventListener("click", toggleFlip);
el.flashcard.addEventListener("click",     toggleFlip);

el.nextFlashBtn.addEventListener("click", () => {
  if (!flashState.ids || flashState.ids.length === 0) return;
  flashState.index  = (flashState.index + 1) % flashState.ids.length;
  flashState.flipped = false;
  saveFlashState();
  renderFlashcard();
});

el.filterSelect.addEventListener("change", renderCards);

/* Card status update */
el.cardList.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-id]");
  if (!btn) return;
  const id     = btn.dataset.id;
  const target = cards.find((c) => c.id === id);
  if (!target) return;

  if (btn.classList.contains("btn-card-edit")) {
    openCardEditor(btn.closest(".card"), target);
    return;
  }

  target.status = btn.dataset.status;
  saveCards();
  renderCards();
  renderFlashcard();
  renderStats();
});

function openCardEditor(li, card) {
  // Already editing
  if (li.querySelector(".card-edit-form")) return;

  // Hide normal view, inject editor
  li.innerHTML = `
    <div class="card-edit-form">
      <label class="field-label">Question</label>
      <textarea class="card-edit-q sync-input" rows="2">${escapeHtml(card.question)}</textarea>
      <label class="field-label" style="margin-top:0.6rem">Answer</label>
      <textarea class="card-edit-a sync-input" rows="8">${escapeHtml(card.answer)}</textarea>
      <div class="card-edit-actions">
        <button class="btn btn-primary btn-sm btn-save-edit">Save</button>
        <button class="btn btn-ghost btn-sm btn-cancel-edit">Cancel</button>
        <button class="btn btn-danger btn-sm btn-delete-card">Delete card</button>
      </div>
    </div>
  `;

  const qEl   = li.querySelector(".card-edit-q");
  const aEl   = li.querySelector(".card-edit-a");
  qEl.focus();

  li.querySelector(".btn-save-edit").addEventListener("click", () => {
    const newQ = qEl.value.trim();
    const newA = aEl.value.trim();
    if (!newQ || !newA) return;
    card.question = newQ;
    card.answer   = newA;
    saveCards();
    renderCards();
    renderFlashcard();
    renderStats();
  });

  li.querySelector(".btn-cancel-edit").addEventListener("click", () => {
    renderCards();
  });

  li.querySelector(".btn-delete-card").addEventListener("click", () => {
    if (!confirm(`Delete this card?\n\n"${card.question.slice(0, 80)}…"`)) return;
    cards = cards.filter((c) => c.id !== card.id);
    saveCards();
    renderCards();
    renderFlashcard();
    renderStats();
  });
}

/* Keyboard shortcuts */
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

  if (e.code === "Space") {
    e.preventDefault();
    toggleFlip();
  } else if (e.code === "ArrowRight" || e.code === "KeyN") {
    el.nextFlashBtn.click();
  } else if (e.code === "Digit1") {
    markCurrentFlashcard("completed");
  } else if (e.code === "Digit2") {
    markCurrentFlashcard("revisit");
  }
});

function markCurrentFlashcard(status) {
  if (!flashState.ids || flashState.ids.length === 0) return;
  const id   = flashState.ids[flashState.index % flashState.ids.length];
  const card = cards.find((c) => c.id === id);
  if (!card) return;
  card.status = status;
  saveCards();
  renderCards();
  renderStats();
  /* Briefly show status feedback */
  el.importStatus.textContent = `Marked as ${status}.`;
  el.importStatus.style.color = status === "completed" ? "var(--green)" : "var(--amber)";
}

/* ============================================================
   INIT
   ============================================================ */
renderCards();
renderFlashcard();
renderStats();
updateCountdown();
setInterval(updateCountdown, 30_000);
gist.init();

/* ---- Sync event listeners ---- */
el.syncToggleBtn.addEventListener("click", () => {
  el.syncDrawer.classList.toggle("hidden");
});

el.syncConnectBtn.addEventListener("click", async () => {
  const pat = el.gistPatInput.value.trim();
  const id  = el.gistIdInput.value.trim();
  if (!pat) { el.syncStatus.textContent = "Enter your GitHub Personal Access Token."; return; }
  gist.saveConfig(pat, id);
  await gist.connect();
});

el.syncPullBtn.addEventListener("click", () => gist.pull());
el.syncPushBtn.addEventListener("click", () => gist.push());

el.syncDisconnectBtn.addEventListener("click", () => {
  gist.saveConfig("", "");
  gist.status = "disconnected";
  el.gistPatInput.value = "";
  el.gistIdInput.value  = "";
  renderSyncUI();
});
