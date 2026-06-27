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
    answer: "I can explain my background through the thread that has guided most of my choices.\n\nI started in biomedical engineering, but my interest became serious during my bachelor’s when one of my professors encouraged me to take up research projects and helped me understand the kind of impact biomedical work can have when it reaches a real patient, clinician, or healthcare worker. My bachelor’s thesis became my first real exposure to that. It started as a proof of concept, but I had the chance to help scale it into a working prototype, and that eventually helped the startup position itself for incubation and funding.\n\nThat experience was very important because it showed me two things. First, I wanted to stay close to healthcare impact. Second, I was still not strong enough technically to contribute at the level I wanted. Being around founders, engineers, and researchers made me realise that if I wanted to build meaningful biomedical systems, I had to level up.\n\nThat is one reason I came to KU Leuven for my master’s. Even there, I chose a thesis in collaboration with Barco on 3D augmented-reality-based tele-proctoring for minimally invasive surgery. The motivation was still the same: I wanted my work to be closer to real healthcare use.\n\nNear the end of my master’s, when I started applying for jobs, I realised another gap. Biomedical knowledge alone was not enough. The final product may be a healthcare application, but to build it, you need software development, systems thinking, product understanding, data workflows, documentation, validation, and the ability to work with unclear requirements.\n\nThat is why I accepted the Mindspeller opportunity after my internship. The initial path was to start with the mother company’s B2B neuromarketing work, with the longer-term direction of contributing to the assistive communication product for locked-in ALS patients. The work eventually kept me mostly on the B2B and product-development side, but it gave me exactly the kind of intense hands-on engineering foundation I needed.\n\nWhen I started, I knew very little about full-stack development. There were client tickets already waiting, so I had to learn and contribute at the same time. I spent nights learning the stack, understanding the existing system, fixing issues, and slowly becoming productive. Over time, I became much stronger and started owning larger workflows: custom semantic networks tailored to client asset suites, AI-assisted internal data-cleaning tools, backend and frontend workflows, deployment, documentation, and support.\n\nLater, when the B2B side was not scaling commercially the way we wanted, we started moving toward a B2C neurotechnology product. That is where the neuroprofiling and AI reporting platform came in. It brought together many layers: EEG workflow design, hardware constraints, signal processing, semantic response paths, schema-like structured outputs, deterministic logic, AI-assisted interpretation, report generation, validation thinking, and user-facing explanation.\n\nWhat that taught me is that building AI systems is not just about connecting a model. The difficult part is designing the whole workflow around it: what data comes in, how it is standardised, what should be deterministic, where AI can help, how the output is checked, how the user understands it, and how the system can be documented and improved.\n\nSo for me, it is about moving into the environment where I think my way of working makes the most sense: taking complex research ideas, building the software around them, testing what works, documenting what matters, and helping them move closer to real-world healthcare use., applying my skills to where my passion lies. That research-to-application bridge is where I want to build my career, and that is why VITO feels like a very meaningful opportunity."
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
  },
  // ── FROM: prep_3.md ─────────────────────────────────────────────────────
  {
    question: "Why Python for AI and data pipelines?",
    answer: "I used Python because it fit both sides of the work: backend API development and data/AI workflows. It allowed me to connect preprocessing, AI API calls, database operations, and reporting logic in one stack. For production workflows, I tried to separate deterministic logic from generated AI outputs so the system was easier to test and debug."
  },
  {
    question: "What is REST and why did you use REST APIs?",
    answer: "REST is an architectural style where the client and server communicate over HTTP using standard methods like GET, POST, PATCH, and DELETE, with stateless requests and structured responses.\n\nI used REST APIs because they gave a clear boundary between the frontend workflows and backend processing. The frontend could trigger sessions, retrieve status, display reports, or send user responses, while the backend handled processing, storage, AI orchestration, and validation. JSON was useful because it kept the data exchange structured and easy to inspect."
  },
  {
    question: "How did frontend and backend communicate in your projects?",
    answer: "The frontend made HTTP requests to REST API endpoints. The backend returned JSON responses. The frontend could trigger sessions, retrieve status, display reports, or send user responses, while the backend handled processing, storage, AI orchestration, and validation. I kept a clear boundary between the two layers so they could be developed, tested, and deployed independently."
  },
  {
    question: "Why MySQL and how did you design the data model?",
    answer: "MySQL was appropriate because much of the product data was structured: users, sessions, responses, report metadata, access roles, and workflow states. I designed tables around the core workflow entities and their relationships, using foreign keys and normalisation where it helped with consistency and query clarity.\n\nIf we had highly flexible document-like data or massive unstructured logs, a NoSQL or search-based system could make sense, but for transactional product workflows, relational storage was easier to reason about and validate."
  },
  {
    question: "SQL vs NoSQL — how do you decide?",
    answer: "I start with the data shape and access patterns. If the data is structured, relational, and transactional — users, sessions, workflow states, access roles — SQL is usually easier to validate and reason about. If the data is highly variable, document-like, or the access patterns are very read-heavy at massive scale, NoSQL may be a better fit.\n\nFor the products I worked on, relational storage was the right choice. The data had clear structure, integrity constraints mattered, and the team could reason about the schema and queries."
  },
  {
    question: "Why Docker and what problem did it solve?",
    answer: "Docker helped make the runtime environment reproducible. Without it, the same code could behave differently depending on system libraries, Python versions, or environment configuration. By containerising the application, I could make sure that what ran in development matched what ran in production.\n\nIt also made deployment and handover easier. Instead of documenting all the environment setup steps, the Dockerfile captured them."
  },
  {
    question: "What is CI/CD and how did your pipeline work?",
    answer: "CI/CD stands for continuous integration and continuous deployment. The pipeline automatically builds, tests, and deploys the application when changes are pushed to the repository.\n\nI used GitLab CI/CD to automate build and deployment steps, so changes were less manual and easier to track. When a change was pushed, the pipeline ran checks, built the container image, and deployed to the target environment. This reduced manual errors and made the deployment process more consistent and auditable."
  },
  {
    question: "Why not Kubernetes? ECS vs EKS?",
    answer: "We did not need a complex Kubernetes setup because the system scale and team size did not justify that overhead. My priority was reliable deployment with the least unnecessary complexity.\n\nIf the question is ECS vs EKS: ECS is simpler if you are already on AWS and want managed container orchestration with less Kubernetes overhead. EKS gives more portability and Kubernetes ecosystem flexibility, but it also adds operational complexity. For a small team or focused service deployment, ECS can be the more practical choice. For a larger multi-service platform with Kubernetes expertise, EKS may be better."
  },
  {
    question: "What is S3 and why use it instead of a database?",
    answer: "S3 is object storage from AWS. I would use it for files or large objects such as reports, raw exports, documents, images, or model artifacts rather than storing them directly in a relational database. A database is designed for structured, queryable records — not for large binary files or flat documents.\n\nAn S3 endpoint is the network endpoint used to access S3. In a cloud architecture, especially inside a VPC, using a VPC endpoint can allow services to access S3 privately without routing traffic over the public internet, which improves both security and latency."
  },
  {
    question: "How did you use LLMs in your workflows?",
    answer: "I used LLMs as an interpretation layer, not as the source of truth. The structured data came from the workflow first: EEG-derived features, IAT responses, predefined mappings, and report logic. The AI helped convert structured outputs into clearer explanations.\n\nAfter V1, I moved away from free role generation toward curated role mapping, because that made the recommendation logic more explainable and controlled.\n\nThis matters especially for VITO because the work is not a cool AI demo. It is AI that must be tested, documented, explainable, and trustworthy in healthcare contexts."
  },
  {
    question: "Why use agents instead of a single prompt?",
    answer: "Agents are useful when a workflow has distinct steps with different responsibilities, data, or logic. A single prompt trying to do everything becomes harder to control, debug, and iterate on.\n\nIn the neuroprofiling system, each agent had a clear input and output. That made it easier to identify where problems came from and to improve specific steps without rewriting everything."
  },
  {
    question: "Why RAG instead of fine-tuning?",
    answer: "RAG is useful when the knowledge is document-specific, changing, or needs traceability. Instead of fine-tuning the model to memorise information, we retrieve relevant document chunks and generate an answer grounded in those chunks.\n\nFine-tuning can help with behaviour or style, but RAG is usually better when the question is about source-grounded factual answers. It is also easier to update — you change the document collection rather than retrain the model."
  },
  {
    question: "What are embeddings and how do they work in RAG?",
    answer: "Embeddings are numerical representations of text that capture semantic meaning. Texts with similar meaning are close together in the embedding space, which allows a retrieval system to find chunks that are semantically relevant to a query — not just those that share exact keywords.\n\nIn a RAG pipeline, document chunks are embedded and stored in a vector index. At query time, the query is also embedded and the nearest chunks are retrieved to provide context for the model."
  },
  {
    question: "What is chunking and why does it matter in RAG?",
    answer: "Chunking is the process of splitting documents into smaller pieces before embedding and indexing them. It matters because retrieval quality depends on whether the retrieved chunks are relevant and focused enough to answer the question.\n\nChunks that are too large may retrieve irrelevant surrounding text. Chunks that are too small may lose important context. The right chunking strategy depends on the document type, query patterns, and embedding model limits."
  },
  {
    question: "What is hybrid search in RAG?",
    answer: "Hybrid search combines vector search — which is semantically aware — with keyword search such as BM25, which is better at exact term matching. The results from both are merged and re-ranked.\n\nIt is useful because neither method alone is always best. Exact terminology such as medical codes, drug names, or regulatory references may be missed by pure vector search but caught by keyword search. Combining them improves retrieval coverage and precision."
  },
  {
    question: "How would you evaluate a RAG system?",
    answer: "I would evaluate at several levels. First, retrieval quality: are the right chunks being retrieved for a given question? Second, answer quality: is the generated answer faithful to the retrieved context? Third, end-to-end: does the system give correct, grounded, and useful answers for real user questions?\n\nFor healthcare or regulatory use, I would also check whether the system correctly signals uncertainty, shows source references, and handles cases where no relevant information is found — rather than hallucinating an answer."
  },
  {
    question: "When would you use local models instead of external APIs like OpenAI or Claude?",
    answer: "External APIs are useful when quality, reliability, and development speed matter more than data control. Local models are useful when privacy, cost control, offline use, or data governance are more important.\n\nIn healthcare settings, I would not choose automatically. I would first look at data sensitivity, performance requirements, auditability, deployment constraints, and whether the model output needs to be validated or reviewed. For anything involving identifiable or sensitive health data, local or on-premise processing may be required regardless of model performance."
  },
  {
    question: "You have Vue experience. Can you work with React?",
    answer: "My production experience is stronger in Vue, but the core frontend concepts transfer: component structure, state management, API integration, form validation, conditional rendering, and user workflow design.\n\nI would need some ramp-up for React-specific patterns such as hooks and the ecosystem around them, but I am comfortable building frontend systems, connecting them to backend workflows, and reasoning about user-facing behaviour. The learning curve is manageable."
  },
  {
    question: "What data should go to an AI API and how do you design access control?",
    answer: "I try to think about data minimisation first: does the AI actually need this field, or can we work with anonymised or aggregated data instead? For sensitive inputs, I would consider anonymisation, pseudonymisation, or on-premise processing before deciding to send data to an external API.\n\nFor access control, I think about role-based permissions, audit logging, clear boundaries between who can read, write, or trigger high-impact actions, and separation between raw data, processed features, and generated outputs.\n\nIn AI workflows, I would be especially careful about what is passed into a model, how outputs are stored, whether users understand the limitations, and whether human review is needed before any high-impact decision."
  },
  // ── FROM: prep4.md — Neuroprofiling AI Deep-Dive ────────────────────────
  {
    question: "Was the neuroprofiling AI system a RAG system?",
    answer: "It was not RAG in the strict technical sense because there was no runtime retrieval from a vector database or document store. But it followed a similar grounding principle: the model should not answer from general memory.\n\nInstead of retrieving context dynamically, each agent received a structured context and instruction package, along with the relevant structured inputs from the EEG or IAT workflow. So I would describe it as a context-constrained interpretation workflow, not RAG.\n\nStrong line: It was RAG-like in philosophy, but not RAG in architecture."
  },
  {
    question: "Why not use RAG for the neuroprofiling platform?",
    answer: "RAG is useful when the system needs to retrieve changing or document-specific information from a large knowledge base. In this case, the challenge was different. We were not asking the model to search across documents. We already had the relevant structured inputs from the workflow.\n\nThe challenge was interpretation: how to convert EEG-derived features, IAT response patterns, and curated mappings into a coherent report. So a structured prompt-and-agent workflow made more sense than retrieval.\n\nIf the system later needed to reference regulatory documents, scientific literature, or internal knowledge bases dynamically, then RAG would become much more relevant.\n\nStrong line: RAG solves retrieval. My problem was controlled interpretation."
  },
  {
    question: "Why use long 400 to 500-line prompts? Isn't that fragile?",
    answer: "I would not describe them as casual long prompts. They were closer to structured interpretation protocols. Each agent had a defined role, interpretation boundaries, expected input structure, output format, rules for what it could and could not claim, and enough context to reduce unsupported generation.\n\nThat said, long prompts can become fragile if they are not managed properly. In a more mature or regulated setting, I would treat prompts like versioned software artifacts: they should be version-controlled, tested with regression cases, reviewed after changes, and linked to expected output behavior.\n\nStrong line: The issue is not prompt length by itself. The issue is whether the prompt is structured, testable, and version-controlled."
  },
  {
    question: "Why not fine-tune a model instead of using structured prompts?",
    answer: "Fine-tuning would make sense if we had a large, high-quality set of reviewed input-output examples and wanted the model to consistently learn a specific style or interpretation behavior.\n\nAt that stage, the system was still evolving. We were refining the product logic, interpretation boundaries, and recommendation method. Structured prompting gave faster control and easier iteration. It also made it easier to change the interpretation rules after real-world feedback.\n\nFine-tuning also does not automatically solve traceability or hallucination. For this use case, constraining the model with structured inputs, curated mappings, and explicit output rules was more practical.\n\nStrong line: Fine-tuning teaches behavior. It does not automatically give traceability."
  },
  {
    question: "Were the neuroprofiling agents autonomous?",
    answer: "They were not autonomous agents in the sense of freely planning and taking actions across tools. They were role-specific AI interpretation modules inside a controlled workflow.\n\nI called them agents because each had a defined responsibility, context, input type, and output role. One interpreted the EEG-based implicit report, one interpreted the IAT response path, and one synthesized both into the final neuroprofile.\n\nSo technically, it was more of an orchestrated multi-agent interpretation pipeline than an open-ended autonomous agent system.\n\nStrong line: They were bounded agents, not autonomous decision-makers."
  },
  {
    question: "What exactly did the AI interpret in the neuroprofiling system?",
    answer: "The AI interpreted structured intermediate outputs, not raw signals directly. The EEG-processing layer produced features or structured outputs from the session. The IAT/semantic path produced response patterns. The agents then interpreted these outputs within predefined boundaries.\n\nThe model's role was to translate structured evidence into readable explanations, not to discover the evidence by itself.\n\nStrong line: The AI interpreted processed evidence, not raw reality."
  },
  {
    question: "Why not use deterministic rules for the whole report?",
    answer: "Some parts should be deterministic, especially scoring logic, mappings, eligibility rules, formatting constraints, and validation checks. But the final report also needed language that could synthesize multiple signals into a coherent explanation for non-technical users.\n\nA fully rule-based report would be easier to control, but it could become rigid and hard to read. A fully LLM-generated report would be flexible, but too unconstrained. So I used a hybrid approach: deterministic structure first, AI-assisted interpretation second.\n\nStrong line: The right design was not rules versus AI. It was rules before AI."
  },
  {
    question: "How did you decide what should be deterministic and what should be AI-assisted?",
    answer: "Anything that affected evidence, scoring, mappings, or data transformation needed to be deterministic or at least structured. The AI was better suited for explanation, synthesis, and user-facing interpretation.\n\nSo the workflow was designed so that the AI did not create the underlying evidence. It explained and synthesized evidence that already existed in structured form.\n\nStrong line: If something defines the evidence, it should not be left to free generation."
  },
  {
    question: "How would you evaluate an AI system where there is no single correct answer?",
    answer: "For interpretive AI systems, evaluation cannot rely only on exact-match accuracy. I would evaluate at multiple levels.\n\nFirst, input fidelity: did the AI use the provided structured inputs correctly? Second, consistency: do similar inputs produce similar interpretations? Third, unsupported claims: does the output introduce conclusions that are not grounded in the data? Fourth, usefulness: is the report understandable for the intended user? Fifth, safety: does the report avoid overclaiming or making high-impact decisions without review?\n\nIn a more mature setting, I would create a test set with representative cases and reviewed expected behavior rather than one exact expected sentence.\n\nStrong line: For interpretive AI, I would evaluate faithfulness, consistency, usefulness, and safety, not just accuracy."
  },
  {
    question: "How would you test the prompts in an AI workflow?",
    answer: "I would treat prompts as part of the software system. That means testing them with normal cases, edge cases, missing-input cases, contradictory-input cases, and poor-quality-data cases.\n\nI would also keep a regression set. If a prompt changes, I would rerun the same test cases and check whether the behavior improved or whether something important broke.\n\nIn a regulated or healthcare setting, I would document prompt versions, model versions, test cases, expected behavior, and known limitations.\n\nStrong line: Prompt changes are software changes. They need regression testing."
  },
  {
    question: "How would you handle model updates from AI providers?",
    answer: "Model updates are a real risk because the same prompt can behave differently after a provider changes the model. I would handle that by pinning model versions where possible, maintaining regression test cases, logging outputs, and reviewing behavior before switching models.\n\nFor a higher-risk healthcare system, I would not silently change the model in production. A model change should trigger evaluation, documentation updates, and possibly revalidation depending on the intended use.\n\nStrong line: In AI systems, the model version is part of the product behavior."
  },
  {
    question: "Why not use a classical ML classifier for role recommendation?",
    answer: "A classifier could be useful if we had a strong labelled dataset connecting input features to validated role outcomes. But in this case, the product was not built from a large supervised dataset with ground-truth career labels.\n\nThe problem was more about structured interpretation and explainable recommendation from limited signals. That is why a curated mapping plus AI-assisted explanation was more appropriate at that stage.\n\nIf later the company collected enough validated outcome data, then a classical ML model or hybrid ranking model could become interesting.\n\nStrong line: A classifier needs reliable labels. We had structured signals and interpretation logic, not ground-truth career outcomes."
  },
  {
    question: "How would you make the recommendation system more explainable?",
    answer: "I would make every recommendation traceable to three layers: input features, role-relevant abilities, and the final role suggestion.\n\nFor example, instead of saying the model recommends this role, the system should be able to say: these structured features were observed, these features map to these abilities, and these abilities are relevant to this role category.\n\nThat creates a clearer explanation chain and reduces the feeling that the AI is making a mysterious judgment.\n\nStrong line: Explainability means showing the path from feature to ability to recommendation."
  },
  {
    question: "What are the risks of using AI in a profiling product?",
    answer: "The main risks are overclaiming, false confidence, bias, unsupported interpretation, and users treating the output as more objective than it really is.\n\nThat is especially important when neurotechnology is involved because users may assume brain-based output is automatically more scientific or definitive. So the system needs careful wording, limitations, review, and explainability.\n\nFor recruitment-related use, the risk is even higher because the output could influence people's opportunities. That is why I would frame it as decision support, not automated decision-making.\n\nStrong line: The more scientific the interface looks, the more careful the claims need to be."
  },
  {
    question: "Would you send sensitive user data to external LLM APIs?",
    answer: "I would not decide that casually. It depends on the data type, consent, contracts, anonymisation, retention policy, and the risk level of the use case.\n\nIn general, for sensitive or health-related data, I would minimize what is sent to external APIs. Where possible, I would send structured, pseudonymized, or reduced inputs rather than raw personal data. For higher-risk healthcare workflows, I would also consider local models or controlled infrastructure if privacy requirements demand it.\n\nStrong line: The model choice is also a data governance decision."
  },
  {
    question: "How would the neuroprofiling AI workflow change in a medical software context?",
    answer: "The first change would be intended use. If the system makes or supports medical claims, the level of evidence and control must increase.\n\nI would expect clearer user and system requirements, risk analysis, traceability, documented validation, clinical or performance evaluation, change control, human oversight, and stronger data governance.\n\nThe AI layer would need to be evaluated not only for quality of language but for safety, consistency, supported claims, and behavior under edge cases.\n\nStrong line: The closer the output gets to patient management, the stronger the evidence and controls need to be."
  },
  {
    question: "What would you improve if you rebuilt the neuroprofiling AI workflow today?",
    answer: "I would formalize evaluation earlier. I would create a test set of representative profiles, edge cases, missing-data cases, and reviewed outputs. I would also make the prompts more modular, version-controlled, and easier to test.\n\nI would improve traceability so that each major statement in the final report can be linked back to structured inputs or mappings. I would also define clearer confidence and limitation language so the system does not overstate what the data can support.\n\nStrong line: I would move from prompt engineering to prompt governance."
  },
  {
    question: "When would you not use GenAI?",
    answer: "I would not use GenAI for decisions that need deterministic, auditable logic unless there is strong validation and human oversight. I also would not use it where the task is simple enough for rules, where the output must be exactly reproducible, or where the system cannot tolerate unsupported language.\n\nIn my view, GenAI is most useful for interpretation, summarization, synthesis, and interaction, but the evidence and decision boundaries should come from structured systems.\n\nStrong line: GenAI is powerful for explanation, but risky as the authority."
  },
  {
    question: "How would you design an AI workflow for VITO's regulatory innovation work?",
    answer: "I would start by identifying the workflow, not the model. For example, if the goal is regulatory documentation support, I would ask: what documents are used, what output is needed, who reviews it, what sources must be cited, and what mistakes are unacceptable?\n\nThen I would likely use a grounded workflow, possibly RAG, because regulatory work needs traceability to source documents. I would combine retrieval, structured templates, human review, output validation, and version control.\n\nI would not position the AI as replacing regulatory judgment. I would position it as assisting document search, requirement mapping, summarization, gap identification, and draft generation under expert review.\n\nStrong line: In regulatory work, AI should accelerate evidence handling, not replace accountability."
  },
  {
    question: "How would you compare different LLMs for a healthcare or regulatory workflow?",
    answer: "I would compare them based on more than general quality. I would test faithfulness to input, consistency, ability to follow structured output formats, behavior with missing or contradictory inputs, privacy constraints, latency, cost, and ease of deployment.\n\nFor healthcare or regulatory workflows, I would also consider whether the model can be versioned, whether outputs can be logged, whether the deployment model fits data governance requirements, and whether there is enough transparency for the intended use.\n\nStrong line: The best model is not always the smartest model. It is the model that fits the workflow risk."
  },
  {
    question: "How would you handle uncertainty in an AI-generated report?",
    answer: "I would avoid presenting interpretive outputs as absolute conclusions. The report should use careful language, show limitations, and distinguish between stronger and weaker signals.\n\nIf input quality is poor or the evidence is insufficient, the system should either reduce the confidence of the interpretation or avoid making certain claims. In a higher-risk setting, uncertainty should be explicit and human review should be part of the workflow.\n\nStrong line: A responsible AI system should know when not to sound confident."
  },
  {
    question: "What is the biggest AI lesson you learned from the neuroprofiling project?",
    answer: "The biggest lesson was that impressive generation is not the same as reliable product behavior.\n\nIn V1, open-ended generation could produce outputs that sounded good, but were harder to justify. In V2, I moved toward structured inputs, curated mappings, clearer agent roles, and bounded interpretation. That made the system less magical but more explainable.\n\nStrong line: The product improved when the AI became less free and more accountable."
  },
  {
    question: "What does responsible AI mean to you?",
    answer: "Responsible AI means the system is designed around its consequences, not only its capabilities. For me, that includes clear intended use, data minimisation, traceable inputs and outputs, validation, bias awareness, human oversight, limitation statements, and careful control over what the model is allowed to claim.\n\nIn healthcare, responsible AI also means knowing the boundary between support and decision-making. The system should help humans understand evidence, but it should not quietly make high-impact decisions without proper validation and governance.\n\nStrong line: Responsible AI is not a disclaimer at the end. It is an architecture choice from the beginning."
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
      localStorage.setItem(STORAGE_KEY,       JSON.stringify(cards));
      localStorage.setItem(FLASH_STORAGE_KEY, JSON.stringify(flashState));
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
