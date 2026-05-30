1. Python / backend services

Possible questions:

Why Python for AI and data pipelines?
How did your backend services communicate with the frontend?
How did you structure APIs?
How did you handle failures from external AI APIs?
How did you validate inputs and outputs?

Strong angle:

I used Python because it fit both sides of the work: backend API development and data/AI workflows. It allowed me to connect preprocessing, AI API calls, database operations, and reporting logic in one stack. For production workflows, I tried to separate deterministic logic from generated AI outputs so the system was easier to test and debug.

2. REST APIs / JSON

Possible questions:

What is REST?
Why REST APIs?
How did you design API endpoints?
How did frontend and backend communicate?
How did you handle bad responses or missing data?

Strong angle:

I used REST APIs because they gave a clear boundary between the frontend workflows and backend processing. The frontend could trigger sessions, retrieve status, display reports, or send user responses, while the backend handled processing, storage, AI orchestration, and validation. JSON was useful because it kept the data exchange structured and easy to inspect.

3. MySQL / data storage

Possible questions:

Why MySQL?
What kind of data did you store?
How did you design tables?
SQL vs NoSQL?
How did you protect sensitive data?

Strong angle:

MySQL was appropriate because much of the product data was structured: users, sessions, responses, report metadata, access roles, and workflow states. If we had highly flexible document-like data or massive unstructured logs, a NoSQL or search-based system could make sense, but for transactional product workflows, relational storage was easier to reason about and validate.

4. Docker / GitLab CI/CD / deployment

Possible questions:

Why Docker?
What is CI/CD?
How did your deployment pipeline work?
What broke in production and how did you fix it?
Why not Kubernetes?

Strong angle:

Docker helped make the runtime environment reproducible. GitLab CI/CD helped automate build and deployment steps, so changes were less manual and easier to track. We did not need a complex Kubernetes setup for everything because the system scale and team size did not justify that overhead. My priority was reliable deployment with the least unnecessary complexity.

If they ask something like ECS vs EKS, use this logic:

ECS is simpler if you are already on AWS and want managed container orchestration with less Kubernetes overhead. EKS gives more portability and Kubernetes ecosystem flexibility, but it also adds operational complexity. For a small team or focused service deployment, ECS can be the more practical choice. For a larger multi-service platform with Kubernetes expertise, EKS may be better.

5. AWS / S3

Even if this is not central, prepare it because his example mentions S3.

Possible question:

What is S3?
What is an S3 endpoint?
Why use S3 instead of storing files in a database?

Good answer:

S3 is object storage. I would use it for files or large objects such as reports, raw exports, documents, images, or model artifacts rather than storing them directly in a relational database. An S3 endpoint is the network endpoint used to access S3. In a cloud architecture, especially inside a VPC, using an endpoint can allow services to access S3 privately without routing traffic over the public internet.

6. LLM APIs / AI workflows

Possible questions:

How did you use LLMs?
Why use agents?
How did you avoid hallucination?
Why not let the LLM generate everything?
How did you validate AI output?

Strong angle:

I used LLMs as an interpretation layer, not as the source of truth. The structured data came from the workflow first: EEG-derived features, IAT responses, predefined mappings, and report logic. The AI helped convert structured outputs into clearer explanations. After V1, I moved away from free role generation toward curated role mapping, because that made the recommendation logic more explainable and controlled.

This is very important for VITO because their work is not “cool AI demo.” It is AI that must be tested, documented, explainable, and trustworthy in healthcare contexts.

7. RAG / document assistant

Possible questions:

What is RAG?
Why RAG instead of fine-tuning?
What are embeddings?
What is chunking?
What is hybrid search?
How would you evaluate a RAG system?

Strong answer:

RAG is useful when the knowledge is document-specific, changing, or needs traceability. Instead of fine-tuning the model to memorize information, we retrieve relevant document chunks and generate an answer grounded in those chunks. Fine-tuning can help with behavior or style, but RAG is usually better when the question is about source-grounded factual answers.

8. Local models vs external APIs

Possible questions:

Why use OpenAI/Claude instead of local models?
When would you use Ollama/local models?
What about privacy?

Strong answer:

External APIs are useful when quality, reliability, and development speed matter. Local models are useful when privacy, cost control, offline use, or data governance are more important. In healthcare settings, I would not choose automatically. I would first look at data sensitivity, performance requirements, auditability, deployment constraints, and whether the model output needs to be validated or reviewed.

9. Vue.js / React

The role may mention React or modern web frameworks. You know Vue, so frame it correctly.

Possible question:

You used Vue. Can you work with React?
Why Vue?
What transfers?

Strong answer:

My production experience is stronger in Vue, but the core frontend concepts transfer: component structure, state management, API integration, form validation, conditional rendering, and user workflow design. I would need some ramp-up for React-specific patterns, but I am comfortable building frontend systems and connecting them to backend workflows.

10. GDPR / sensitive data

Possible questions:

How do you handle sensitive data?
What would you do differently in healthcare?
How do you design access control?
What data should go to an AI API?

Strong answer:

I try to think about data minimization, access control, role separation, auditability, and whether sensitive inputs need to be sent to external services at all. In AI workflows, I would be especially careful about what is passed into a model, how outputs are stored, whether users understand the limitations, and whether human review is needed before any high-impact decision.