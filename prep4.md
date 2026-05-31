# VITO AI Deep-Dive Question Pack: Neuroprofiling Platform

## Core mental model

The neuroprofiling AI system should be explained as:

**Structured evidence → constrained interpretation → reviewable output**

Not:

**Prompt → magical profile**

The strongest framing:

The AI was not the source of truth. The source of truth was the structured workflow: EEG-derived features, semantic/IAT response patterns, predefined interpretation boundaries, and curated mappings. The AI acted as an interpreter that converted structured evidence into understandable language.

---

## 1. Was this RAG?

### What they may be testing

They want to know whether you are using technical terms precisely.

### Strong answer

It was not RAG in the strict technical sense because there was no runtime retrieval from a vector database or document store. But it followed a similar grounding principle: the model should not answer from general memory.

Instead of retrieving context dynamically, each agent received a structured context and instruction package, along with the relevant structured inputs from the EEG or IAT workflow. So I would describe it as a context-constrained interpretation workflow, not RAG.

### Strong line

It was RAG-like in philosophy, but not RAG in architecture.

---

## 2. Why not use RAG?

### Strong answer

RAG is useful when the system needs to retrieve changing or document-specific information from a large knowledge base. In this case, the main challenge was different. We were not asking the model to search across documents. We already had the relevant structured inputs from the workflow.

The challenge was interpretation: how to convert EEG-derived features, IAT response patterns, and curated mappings into a coherent report. So a structured prompt-and-agent workflow made more sense than retrieval.

If the system later needed to reference regulatory documents, scientific literature, or internal knowledge bases dynamically, then RAG would become much more relevant.

### Strong line

RAG solves retrieval. My problem was controlled interpretation.

---

## 3. Why use long 400 to 500-line prompts? Isn’t that fragile?

### Strong answer

I would not describe them as casual long prompts. They were closer to structured interpretation protocols. Each agent had a defined role, interpretation boundaries, expected input structure, output format, rules for what it could and could not claim, and enough context to reduce unsupported generation.

That said, long prompts can become fragile if they are not managed properly. In a more mature or regulated setting, I would treat prompts like versioned software artifacts: they should be version-controlled, tested with regression cases, reviewed after changes, and linked to expected output behavior.

### Strong line

The issue is not prompt length by itself. The issue is whether the prompt is structured, testable, and version-controlled.

---

## 4. Why not fine-tune a model instead?

### Strong answer

Fine-tuning would make sense if we had a large, high-quality set of reviewed input-output examples and wanted the model to consistently learn a specific style or interpretation behavior.

At that stage, the system was still evolving. We were refining the product logic, interpretation boundaries, and recommendation method. Structured prompting gave faster control and easier iteration. It also made it easier to change the interpretation rules after real-world feedback.

Fine-tuning also does not automatically solve traceability or hallucination. For this use case, constraining the model with structured inputs, curated mappings, and explicit output rules was more practical.

### Strong line

Fine-tuning teaches behavior. It does not automatically give traceability.

---

## 5. Why use multiple agents instead of one large prompt?

### Strong answer

Because the interpretation tasks were different. EEG-derived interpretation, IAT/semantic response interpretation, and final profile synthesis each had different inputs and different responsibilities.

If everything was handled by one large prompt, it would be harder to debug. If the final profile contained a weak claim, we would not know whether the issue came from EEG interpretation, IAT interpretation, or synthesis.

By separating the workflow into agents, each step had a clearer role and a clearer input-output boundary.

### Strong line

The agents were not for hype. They were for separation of responsibility and easier debugging.

---

## 6. Why call them agents? Were they autonomous?

### Strong answer

They were not autonomous agents in the sense of freely planning and taking actions across tools. They were role-specific AI interpretation modules inside a controlled workflow.

I called them agents because each had a defined responsibility, context, input type, and output role. One interpreted the EEG-based implicit report, one interpreted the IAT response path, and one synthesized both into the final neuroprofile.

So technically, it was more of an orchestrated multi-agent interpretation pipeline than an open-ended autonomous agent system.

### Strong line

They were bounded agents, not autonomous decision-makers.

---

## 7. What exactly did the AI interpret?

### Strong answer

The AI interpreted structured intermediate outputs, not raw signals directly. The EEG-processing layer produced features or structured outputs from the session. The IAT/semantic path produced response patterns. The agents then interpreted these outputs within predefined boundaries.

The model’s role was to translate structured evidence into readable explanations, not to discover the evidence by itself.

### Strong line

The AI interpreted processed evidence, not raw reality.

---

## 8. Why not use deterministic rules for the whole report?

### Strong answer

Some parts should be deterministic, especially scoring logic, mappings, eligibility rules, formatting constraints, and validation checks. But the final report also needed language that could synthesize multiple signals into a coherent explanation for non-technical users.

A fully rule-based report would be easier to control, but it could become rigid and hard to read. A fully LLM-generated report would be flexible, but too unconstrained. So I used a hybrid approach: deterministic structure first, AI-assisted interpretation second.

### Strong line

The right design was not rules versus AI. It was rules before AI.

---

## 9. How did you decide what should be deterministic and what should be AI-assisted?

### Strong answer

Anything that affected evidence, scoring, mappings, or data transformation needed to be deterministic or at least structured. The AI was better suited for explanation, synthesis, and user-facing interpretation.

So the workflow was designed so that the AI did not create the underlying evidence. It explained and synthesized evidence that already existed in structured form.

### Strong line

If something defines the evidence, it should not be left to free generation.

---

## 10. How did you control hallucination?

### Strong answer

The main strategy was to reduce freedom. The model received structured inputs, clear role instructions, interpretation boundaries, and expected output formats.

The biggest improvement came after V1. Initially, some outputs, especially role suggestions, were more open-ended. After real-world use, it became clear that this was not explainable enough. In V2, role recommendations were generated from a curated role list and mapped to role-relevant abilities, so the AI selected and explained within a controlled space instead of inventing freely.

### Strong line

The way to reduce hallucination was not to trust the model more. It was to give it less freedom.

---

## 11. How would you evaluate this AI system if there is no single correct answer?

### Strong answer

For interpretive AI systems, evaluation cannot rely only on exact-match accuracy. I would evaluate at multiple levels.

First, input fidelity: did the AI use the provided structured inputs correctly?
Second, consistency: do similar inputs produce similar interpretations?
Third, unsupported claims: does the output introduce conclusions that are not grounded in the data?
Fourth, usefulness: is the report understandable for the intended user?
Fifth, safety: does the report avoid overclaiming or making high-impact decisions without review?

In a more mature setting, I would create a test set with representative cases and reviewed expected behavior rather than one exact expected sentence.

### Strong line

For interpretive AI, I would evaluate faithfulness, consistency, usefulness, and safety, not just accuracy.

---

## 12. How would you test the prompts?

### Strong answer

I would treat prompts as part of the software system. That means testing them with normal cases, edge cases, missing-input cases, contradictory-input cases, and poor-quality-data cases.

I would also keep a regression set. If a prompt changes, I would rerun the same test cases and check whether the behavior improved or whether something important broke.

In a regulated or healthcare setting, I would document prompt versions, model versions, test cases, expected behavior, and known limitations.

### Strong line

Prompt changes are software changes. They need regression testing.

---

## 13. How would you handle model updates?

### Strong answer

Model updates are a real risk because the same prompt can behave differently after a provider changes the model. I would handle that by pinning model versions where possible, maintaining regression test cases, logging outputs, and reviewing behavior before switching models.

For a higher-risk healthcare system, I would not silently change the model in production. A model change should trigger evaluation, documentation updates, and possibly revalidation depending on the intended use.

### Strong line

In AI systems, the model version is part of the product behavior.

---

## 14. Why not use a classical ML classifier for role recommendation?

### Strong answer

A classifier could be useful if we had a strong labelled dataset connecting input features to validated role outcomes. But in this case, the product was not built from a large supervised dataset with ground-truth career labels.

The problem was more about structured interpretation and explainable recommendation from limited signals. That is why a curated mapping plus AI-assisted explanation was more appropriate at that stage.

If later the company collected enough validated outcome data, then a classical ML model or hybrid ranking model could become interesting.

### Strong line

A classifier needs reliable labels. We had structured signals and interpretation logic, not ground-truth career outcomes.

---

## 15. How would you make the recommendation system more explainable?

### Strong answer

I would make every recommendation traceable to three layers: input features, role-relevant abilities, and the final role suggestion.

For example, instead of saying “the model recommends this role,” the system should be able to say: these structured features were observed, these features map to these abilities, and these abilities are relevant to this role category.

That creates a clearer explanation chain and reduces the feeling that the AI is making a mysterious judgment.

### Strong line

Explainability means showing the path from feature to ability to recommendation.

---

## 16. What are the risks of using AI in a profiling product?

### Strong answer

The main risks are overclaiming, false confidence, bias, unsupported interpretation, and users treating the output as more objective than it really is.

That is especially important when neurotechnology is involved because users may assume brain-based output is automatically more scientific or definitive. So the system needs careful wording, limitations, review, and explainability.

For recruitment-related use, the risk is even higher because the output could influence people’s opportunities. That is why I would frame it as decision support, not automated decision-making.

### Strong line

The more scientific the interface looks, the more careful the claims need to be.

---

## 17. Would you send sensitive user data to external LLM APIs?

### Strong answer

I would not decide that casually. It depends on the data type, consent, contracts, anonymisation, retention policy, and the risk level of the use case.

In general, for sensitive or health-related data, I would minimize what is sent to external APIs. Where possible, I would send structured, pseudonymized, or reduced inputs rather than raw personal data. For higher-risk healthcare workflows, I would also consider local models or controlled infrastructure if privacy requirements demand it.

### Strong line

The model choice is also a data governance decision.

---

## 18. How would this change in a medical software context?

### Strong answer

The first change would be intended use. If the system makes or supports medical claims, the level of evidence and control must increase.

I would expect clearer user and system requirements, risk analysis, traceability, documented validation, clinical or performance evaluation, change control, human oversight, and stronger data governance.

The AI layer would need to be evaluated not only for quality of language but for safety, consistency, supported claims, and behavior under edge cases.

### Strong line

The closer the output gets to patient management, the stronger the evidence and controls need to be.

---

## 19. What would you improve if you rebuilt the AI workflow today?

### Strong answer

I would formalize evaluation earlier. I would create a test set of representative profiles, edge cases, missing-data cases, and reviewed outputs. I would also make the prompts more modular, version-controlled, and easier to test.

I would improve traceability so that each major statement in the final report can be linked back to structured inputs or mappings. I would also define clearer confidence and limitation language so the system does not overstate what the data can support.

### Strong line

I would move from prompt engineering to prompt governance.

---

## 20. When would you not use GenAI?

### Strong answer

I would not use GenAI for decisions that need deterministic, auditable logic unless there is strong validation and human oversight. I also would not use it where the task is simple enough for rules, where the output must be exactly reproducible, or where the system cannot tolerate unsupported language.

In my view, GenAI is most useful for interpretation, summarization, synthesis, and interaction, but the evidence and decision boundaries should come from structured systems.

### Strong line

GenAI is powerful for explanation, but risky as the authority.

---

## 21. How would you design an AI workflow for VITO’s regulatory innovation work?

### Strong answer

I would start by identifying the workflow, not the model. For example, if the goal is regulatory documentation support, I would ask: what documents are used, what output is needed, who reviews it, what sources must be cited, and what mistakes are unacceptable?

Then I would likely use a grounded workflow, possibly RAG, because regulatory work needs traceability to source documents. I would combine retrieval, structured templates, human review, output validation, and version control.

I would not position the AI as replacing regulatory judgment. I would position it as assisting document search, requirement mapping, summarization, gap identification, and draft generation under expert review.

### Strong line

In regulatory work, AI should accelerate evidence handling, not replace accountability.

---

## 22. How would you compare different LLMs for this kind of system?

### Strong answer

I would compare them based on more than general quality. I would test faithfulness to input, consistency, ability to follow structured output formats, behavior with missing or contradictory inputs, privacy constraints, latency, cost, and ease of deployment.

For healthcare or regulatory workflows, I would also consider whether the model can be versioned, whether outputs can be logged, whether the deployment model fits data governance requirements, and whether there is enough transparency for the intended use.

### Strong line

The best model is not always the smartest model. It is the model that fits the workflow risk.

---

## 23. How would you handle uncertainty in the final report?

### Strong answer

I would avoid presenting interpretive outputs as absolute conclusions. The report should use careful language, show limitations, and distinguish between stronger and weaker signals.

If input quality is poor or the evidence is insufficient, the system should either reduce the confidence of the interpretation or avoid making certain claims. In a higher-risk setting, uncertainty should be explicit and human review should be part of the workflow.

### Strong line

A responsible AI system should know when not to sound confident.

---

## 24. What is the biggest AI lesson you learned from this project?

### Strong answer

The biggest lesson was that impressive generation is not the same as reliable product behavior.

In V1, open-ended generation could produce outputs that sounded good, but were harder to justify. In V2, I moved toward structured inputs, curated mappings, clearer agent roles, and bounded interpretation. That made the system less magical but more explainable.

### Strong line

The product improved when the AI became less free and more accountable.

---

## 25. If VITO asks: what does “responsible AI” mean to you?

### Strong answer

Responsible AI means the system is designed around its consequences, not only its capabilities. For me, that includes clear intended use, data minimisation, traceable inputs and outputs, validation, bias awareness, human oversight, limitation statements, and careful control over what the model is allowed to claim.

In healthcare, responsible AI also means knowing the boundary between support and decision-making. The system should help humans understand evidence, but it should not quietly make high-impact decisions without proper validation and governance.

### Strong line

Responsible AI is not a disclaimer at the end. It is an architecture choice from the beginning.
