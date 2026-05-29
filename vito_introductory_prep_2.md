## VITO Technical Question Pack: AI Software Engineer & Regulatory Innovation

This section prepares for a technical-style introductory interview. The focus is not DevOps depth. The focus is AI workflow design, healthcare software, validation, documentation, responsible AI, and regulatory-aware development.

---

## 1. How did your three-agent neuroprofiling system work?

### Draft answer

The neuroprofiling platform used AI as an interpretation layer on top of structured inputs, not as a free-form decision maker.

The system had three main interpretation agents. The first agent interpreted the EEG-based implicit report. It worked from processed EEG-derived features and converted those structured outputs into a more readable interpretation. The second agent interpreted the semantic IAT path responses, which captured patterns from user responses and helped compare implicit and explicit behavior. The third agent combined the outputs of the first two agents to generate the final neuroprofile.

The important design decision was that the AI did not start from nothing. It worked from structured intermediate outputs. That made the workflow easier to control, easier to explain, and easier to refine compared with asking one model to generate a full profile directly from raw or loosely structured data.

### Key point to land

I used AI as an interpretation layer inside a structured workflow, not as the source of truth.

---

## 2. Why did you use multiple agents instead of one prompt?

### Draft answer

I used multiple agents because the workflow had different types of interpretation. The EEG-derived report and the semantic IAT path were not the same kind of input, so combining everything into one prompt would have made the system harder to control and debug.

By separating the workflow into agents, each step had a clearer responsibility. One agent focused on the implicit EEG-related interpretation, one focused on the IAT response interpretation, and the final agent synthesized both into the overall neuroprofile.

This made the system more modular. If one part of the output was weak, I could inspect whether the issue came from EEG interpretation, IAT interpretation, or final synthesis. It also made iteration easier when we refined the recommendation logic in the second version.

### Key point to land

Multiple agents were used for separation of responsibility, traceability, and easier debugging.

---

## 3. How did you validate AI-generated reports?

### Draft answer

I treated validation as a workflow problem, not just an output review problem. First, I looked at input quality: whether the required data was available, whether the session data was usable, and whether the structured intermediate outputs made sense.

Then I checked whether the AI output was consistent with the structured inputs. For example, the report should not introduce claims that were not supported by the EEG-derived features, IAT responses, or the predefined mapping logic.

I also used manual review and iteration. After the first version was used in a real setting, we saw that open-ended role generation was too difficult to explain. That led to the second version, where the recommendation logic became more controlled through curated role mapping.

### Key point to land

I did not validate AI by asking whether the text sounded good. I checked whether it stayed faithful to structured inputs and whether the output was explainable.

---

## 4. How did you reduce hallucination or uncontrolled output?

### Draft answer

The main way was to reduce how much freedom the model had. In the first version, some outputs were more open-ended, especially role suggestions. After real-world use, we realised that this was not controlled enough.

So in the second version, I moved toward a more structured approach. Cognitive features were mapped to role-relevant abilities, and the system used a curated role list. The AI then selected and explained from that controlled structure instead of freely inventing roles.

In general, my approach is to give the model structured inputs, clear boundaries, predefined output formats, and limited decision space. For sensitive workflows, I would also include human review and logging of intermediate outputs.

### Key point to land

I controlled hallucination by constraining the model with structured inputs, curated options, and clearer output boundaries.

---

## 5. Why did you move from LLM-generated roles to curated role mapping?

### Draft answer

The first version gave us useful feedback, but it also showed that open-ended role generation was not explainable enough. If a model freely suggests a role, it can sound convincing, but it becomes difficult to explain why that role was chosen.

For the second version, I wanted the recommendation logic to be more transparent. So the approach became: extract or define cognitive features, map them to abilities relevant for different roles, use a curated role list, and let the AI select top recommendations from that controlled space.

That made the output easier to explain and more appropriate for a product that could be used in a recruitment-related context as a decision-support layer.

### Key point to land

The shift from open generation to curated mapping was about explainability, control, and responsible use.

---

## 6. What makes an AI workflow explainable?

### Draft answer

For me, explainability starts before the final AI output. The workflow should make it clear what inputs were used, what transformations happened, what rules or mappings were applied, and what role the AI played.

In the neuroprofiling product, explainability improved when role suggestions were not simply generated freely. By mapping cognitive features to role-relevant abilities and using a curated role list, the recommendation could be tied back to a structured logic.

In healthcare or medical software, I would take this further. I would document the intended use, input data, processing steps, model role, expected outputs, limitations, validation approach, and human oversight points.

### Key point to land

Explainability is not only about explaining the final text. It is about making the whole workflow traceable.

---

## 7. How would you document this system for a medical software context?

### Draft answer

I would begin with intended use, because that determines the level of risk and the kind of documentation needed. Then I would document the user requirements, system requirements, data flow, model role, inputs and outputs, validation steps, known limitations, and human review points.

For an AI workflow, I would also document what is deterministic and what is AI-assisted. That distinction matters because deterministic logic can be tested differently from generated output.

I would include test cases for normal inputs, missing data, poor-quality data, edge cases, repeated runs, and unsafe or unsupported outputs. I would also document how changes to prompts, mappings, models, or data processing affect the system behavior.

### Key point to land

Medical software documentation should connect intended use, requirements, risk, validation, traceability, and change control.

---

## 8. What would change if this system were used for clinical decision support?

### Draft answer

If the system moved into clinical decision support, the expectations would change significantly. The first thing would be to clarify the intended use and claims. A self-insight or decision-support product is very different from software that influences diagnosis, treatment, or clinical decision-making.

If clinical use were intended, I would expect much stronger requirements around risk analysis, validation, clinical evidence, documentation, traceability, human oversight, data protection, and change control. The AI output would need clear limitations and should not silently make high-impact decisions.

I would also be much more careful about performance evaluation, dataset representativeness, failure modes, and how clinicians interact with the output.

### Key point to land

Clinical decision support requires a different level of validation, evidence, documentation, and risk control.

---

## 9. What is your understanding of SaMD / MDSW?

### Draft answer

My understanding is that SaMD or medical device software is software that has a medical intended purpose, such as supporting diagnosis, prevention, monitoring, prediction, prognosis, treatment, or alleviation of disease.

The key issue is intended use. The same technical system can fall into a different category depending on the claims made and how the output is used. If software is only for general wellness or internal research, the regulatory expectations may be different. But if it supports medical decisions, then risk classification, validation, clinical evidence, technical documentation, and post-market considerations become much more important.

I would describe myself as regulatory-aware rather than a regulatory specialist, but I understand why intended use, risk, traceability, and validation are central.

### Key point to land

Intended use drives whether software becomes medical software and what regulatory expectations apply.

---

## 10. How do you translate user requirements into system requirements?

### Draft answer

I start by mapping the workflow in practical terms. Who is the user? What problem are they trying to solve? What data enters the system? What output do they need? What decisions are automated? What needs human review? What can fail?

From there, I convert the user need into system behavior. For example, if the user needs a reliable report, the system requirements may include input validation, required data checks, processing steps, report generation logic, error handling, access control, and output review.

In my Mindspeller work, many ideas started as broad product or research needs. My job was often to turn those into data flows, backend logic, frontend workflows, validation steps, and documentation.

### Key point to land

I convert vague needs into workflows, then workflows into system behavior and testable requirements.

---

## 11. How would you test an AI healthcare prototype?

### Draft answer

I would test it at multiple levels. First, I would test the non-AI parts: data ingestion, preprocessing, API behavior, database storage, access control, and frontend behavior.

Then I would test the AI workflow separately. I would check whether the model receives the right inputs, whether the output follows the expected format, whether it stays grounded in the provided data, whether it behaves consistently across similar cases, and whether it handles missing or poor-quality inputs safely.

For healthcare-related prototypes, I would also test safety and usability: whether the output overclaims, whether limitations are clear, whether human review is needed, and whether the output could be misinterpreted.

### Key point to land

AI healthcare testing should include technical correctness, output quality, safety, usability, and traceability.

---

## 12. What is RAG, and where would it help in regulatory workflows?

### Draft answer

RAG stands for retrieval-augmented generation. Instead of asking a model to answer only from its internal knowledge, the system first retrieves relevant information from a document collection and then generates an answer grounded in that retrieved context.

In regulatory workflows, RAG could be useful for searching guidance documents, standards, internal procedures, technical documentation, or previous evidence. It can help users find relevant sections and generate draft summaries or requirement mappings.

But I would be careful with it. In regulatory contexts, the generated answer should not be treated as final authority. The system should show sources, support traceability, and include human review. Retrieval quality is also important because if the wrong documents are retrieved, the generated answer may still sound convincing but be wrong.

### Key point to land

RAG is useful for source-grounded support, but regulatory use needs citations, retrieval checks, and human review.

---

## 13. How do you handle sensitive health-related data?

### Draft answer

I think about sensitive data from the start of the workflow. The main questions are: what data is truly necessary, who needs access, where is it stored, whether it is sent to external services, how long it is retained, and how outputs are controlled.

In my previous role, I worked with GDPR-aware workflows and access control, and I also had DPO responsibilities. From an engineering point of view, I try to apply data minimisation, role-based access, audit-friendly handling, and careful separation between raw data, processed features, and generated outputs.

For AI workflows, I would be especially careful about sending sensitive data to external APIs. Depending on the use case, I would consider anonymisation, pseudonymisation, local processing, contractual safeguards, or human review before any high-impact use.

### Key point to land

Sensitive data handling is not only a legal concern. It affects architecture, access control, model choice, storage, logging, and review.

---

## 14. What are your gaps in regulatory knowledge, and how are you addressing them?

### Draft answer

My main gap is that I have not yet owned a full medical software regulatory submission or certification process. I am familiar with MDR and SaMD concepts, and I have practical experience with documentation, validation logic, GDPR-aware workflows, and sensitive data handling, but I would not claim to be a regulatory specialist yet.

What I am trying to build is the translation layer between regulation and engineering. I want to understand how requirements from MDR, IVDR, AI Act, and medical software guidance become practical development activities: user requirements, system requirements, risk controls, validation plans, technical documentation, traceability, and post-deployment monitoring.

That is one of the reasons I am interested in this VITO role. It would allow me to contribute as a hands-on AI/software engineer while growing deeper into regulatory-ready healthcare software.

### Key point to land

I am honest about not being a regulatory specialist yet, but I understand the engineering mindset needed for regulated healthcare software.

---

## Bonus: If they ask about a technology I have not used deeply

### Draft answer

I have not used that deeply in production, so I would not overclaim it. My understanding is that it is used for [brief purpose]. In my previous work, the system constraints did not require that level of tooling, so I used [what you used instead]. But I understand why it would be useful in larger healthcare or research systems, and I would be comfortable learning it if it is part of VITO’s stack.

### Example: Apache Spark

I have not used Apache Spark directly in production, so I would not overclaim that experience. My understanding is that Spark is useful for distributed processing of large datasets when single-machine processing is not enough. In my work, the data pipelines were smaller and more workflow-oriented, so Python-based processing was enough. But if VITO works with large-scale clinical, omics, or real-world datasets, I can see why Spark or similar distributed processing tools would be useful, and I would be comfortable learning it.

### Example: FHIR / OMOP

I am familiar with FHIR and OMOP conceptually rather than from deep implementation. My understanding is that FHIR is mainly about standardized exchange of healthcare data through resources and APIs, while OMOP is a common data model often used for observational health data and analytics. I would be careful not to overstate my experience, but I understand why interoperability and standardized data models matter for healthcare AI.

---

## Rapid answer pattern for technical questions

Use this structure:

I used [technology/method] for [purpose]. I chose it because [reason]. The tradeoff was [limitation]. If the system had different constraints, I would consider [alternative].

### Example

I used a multi-agent structure for the neuroprofiling report because the workflow had different types of interpretation. The tradeoff is that multiple agents can make the system more complex to monitor, but it gave clearer separation between EEG interpretation, IAT interpretation, and final synthesis. If the use case were simpler, one structured prompt might be enough. For a higher-risk healthcare setting, I would add stronger evaluation, logging, and human review.
