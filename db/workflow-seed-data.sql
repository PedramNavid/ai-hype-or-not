-- Insert sample users
INSERT INTO users (email, name, bio, github_username, twitter_username) VALUES
('harper@example.com', 'Harper Reed', 'Solo developer exploring LLM workflows for rapid prototyping', 'harperreed', 'harper'),
('hamel@example.com', 'Hamel Husain', 'ML engineer focused on practical LLM evaluation systems', 'hamelhusain', 'HamelHusain'),
('alex@example.com', 'Alex Chen', 'Full-stack developer using AI tools to accelerate development', 'alexchen', 'alexchen_dev');

-- Insert sample workflows
INSERT INTO workflows (title, slug, description, author_id, workflow_type, difficulty_level, time_estimate, content, is_featured, status, published_at) VALUES
(
  'Greenfield Development with LLMs: From Idea to MVP',
  'greenfield-development-llm-workflow',
  'A comprehensive workflow for building new projects from scratch using LLMs for spec development, planning, and implementation',
  1,
  'greenfield',
  'intermediate',
  '2-3 hours',
  '# Greenfield Development with LLMs

This workflow helps you go from a rough idea to a working MVP using LLMs at every stage of the development process.

## Overview

Building new projects with LLMs requires a structured approach that leverages their strengths while avoiding common pitfalls. This workflow has been refined through dozens of projects and consistently delivers results.

## Prerequisites

- Basic programming knowledge
- Access to Claude or GPT-4
- A code editor with AI integration (Cursor/Aider recommended)
- Git for version control

## The Three-Phase Approach

### Phase 1: Idea Honing and Specification

The first phase focuses on transforming your rough idea into a detailed specification. This is where LLMs excel - helping you think through edge cases and implementation details you might have missed.

```
Prompt Template:
"I want to build [YOUR IDEA]. Ask me one question at a time to help develop a thorough, step-by-step specification. Focus on:
- Core functionality
- User workflows
- Technical constraints
- Success criteria"
```

### Phase 2: Planning and Architecture

Once you have a solid spec, use the LLM to create an implementation plan. Break the project into small, testable chunks that can be built iteratively.

```
Prompt Template:
"Given this specification: [PASTE SPEC]
Draft a detailed, step-by-step blueprint for building this project. Break it into:
1. Minimal viable features (MVP)
2. Iterative enhancements
3. Testing approach
4. Potential challenges and solutions"
```

### Phase 3: Implementation

Now comes the actual coding. Use your preferred AI coding tool (Cursor, Aider, etc.) to implement each piece of the plan.

```
Prompt Template:
"Implement [SPECIFIC FEATURE] based on this plan: [PASTE RELEVANT SECTION]
Requirements:
- Write clean, maintainable code
- Include error handling
- Add appropriate comments
- Suggest tests for this feature"
```

## Key Techniques

### 1. Iterative Development
Never try to build everything at once. Start with the absolute minimum and add features incrementally.

### 2. Test-Driven Approach
Have the LLM write tests first, then implement features to pass those tests.

### 3. Regular Checkpoints
After each feature, commit your code and test thoroughly before moving on.

## Common Pitfalls to Avoid

- **Over-ambitious first iterations**: Keep your MVP truly minimal
- **Skipping the spec phase**: A good spec saves hours of implementation time
- **Not testing LLM output**: Always review and test generated code
- **Ignoring error handling**: Ask specifically for robust error handling

## Tools and Setup

### Recommended Stack
- **LLM**: Claude 3.5 or GPT-4
- **IDE**: Cursor or VSCode with Copilot
- **CLI Tool**: Aider for complex refactoring
- **Version Control**: Git with conventional commits

### Tool Configuration
```bash
# Aider setup
pip install aider-chat
aider --model claude-3-5-sonnet

# Cursor settings
{
  "ai.model": "claude-3.5",
  "ai.temperature": 0.3
}
```

## Real-World Example

Let me walk through building a simple task tracker:

1. **Idea Honing**: Started with "I want a task tracker" and through Q&A developed specs for tags, priorities, and keyboard shortcuts
2. **Planning**: Broke it into 5 iterations: basic CRUD, tags, priorities, keyboard nav, persistence
3. **Implementation**: Built each feature in ~30 minutes using Aider

Total time: 3 hours from idea to deployed app.

## Conclusion

This workflow transforms LLMs from code completion tools into true development partners. The key is structure - giving the LLM clear context and boundaries at each stage.

Remember: LLMs are tools, not magic. They amplify your abilities but still require your expertise and judgment.',
  TRUE,
  'published',
  CURRENT_TIMESTAMP - INTERVAL '5 days'
),
(
  'Building a LLM-as-Judge Evaluation System',
  'llm-judge-evaluation-system',
  'Create domain-specific evaluation systems for your AI products using LLMs as judges with binary decision making',
  2,
  'testing',
  'advanced',
  '3-4 hours',
  '# Building a LLM-as-Judge Evaluation System

Stop using generic evaluation metrics. Build domain-specific evaluation systems that actually drive business results.

## The Problem with Generic Evals

Most teams adopt off-the-shelf evaluation tools without thinking critically about their specific domain needs. This leads to metrics that look good on paper but don''t correlate with actual product success.

## The Binary Decision Approach

Instead of complex scoring systems, focus on binary decisions:
- Did this conversation achieve its intended outcome? YES/NO
- Would a domain expert approve this response? YES/NO
- Does this code run without errors? YES/NO

## Implementation Steps

### Step 1: Define Your Success Criteria

Work with domain experts to define what "success" means for your specific use case.

```python
# Example: Customer support chatbot
SUCCESS_CRITERIA = {
    "issue_resolved": "Did the bot successfully resolve the customer''s issue?",
    "tone_appropriate": "Was the bot''s tone professional and empathetic?",
    "accurate_info": "Was all information provided accurate and up-to-date?"
}
```

### Step 2: Create Evaluation Prompts

Design prompts that help LLMs make consistent binary decisions.

```python
JUDGE_PROMPT = """
You are evaluating a customer support conversation.

Conversation:
{conversation}

Question: {criterion_question}

Provide a binary answer (YES/NO) and a brief explanation (2-3 sentences).

Response format:
ANSWER: [YES/NO]
EXPLANATION: [Your reasoning]
"""
```

### Step 3: Implement Critique Shadowing

Have domain experts evaluate a subset of conversations and use their judgments to calibrate the LLM judge.

```python
def shadow_expert_evaluation(conversation, expert_judgment):
    llm_judgment = evaluate_with_llm(conversation)
    
    if llm_judgment != expert_judgment:
        # Log disagreement for analysis
        log_disagreement(conversation, expert_judgment, llm_judgment)
        
    return calculate_agreement_rate()
```

### Step 4: Iterative Refinement

Use disagreements between LLM and expert judgments to refine your prompts.

## Multi-Turn Conversation Evaluation

For complex interactions, evaluate at multiple levels:

1. **Turn-level**: Is each individual response appropriate?
2. **Goal-level**: Does the conversation achieve its objective?
3. **Experience-level**: Is the overall experience positive?

## Practical Example: Code Review Bot

```python
class CodeReviewEvaluator:
    def __init__(self):
        self.criteria = {
            "finds_bugs": "Did the review identify actual bugs or issues?",
            "actionable": "Are the suggestions specific and actionable?",
            "respectful": "Is the feedback constructive and respectful?"
        }
    
    def evaluate_review(self, code, review):
        results = {}
        for criterion, question in self.criteria.items():
            results[criterion] = self.judge_binary(code, review, question)
        return results
    
    def judge_binary(self, code, review, question):
        # Implementation details...
        pass
```

## Key Principles

1. **Start Simple**: Begin with basic binary evaluations before adding complexity
2. **Domain Expertise**: One expert is better than many for consistency
3. **Iterate Quickly**: Use evaluation results to improve immediately
4. **Measure Impact**: Track how evaluation improvements affect user outcomes

## Common Mistakes

- Using arbitrary 1-10 scales instead of binary decisions
- Evaluating without clear success criteria
- Ignoring domain-specific requirements
- Over-engineering the evaluation system

## Tools and Resources

- **LLM Judge**: Claude 3.5 or GPT-4
- **Logging**: Structured logging for analysis
- **Visualization**: Simple dashboards for tracking agreement rates
- **Version Control**: Track prompt evolution

Remember: The goal isn''t perfect evaluation, it''s evaluation that drives meaningful improvements in your product.',
  TRUE,
  'published',
  CURRENT_TIMESTAMP - INTERVAL '3 days'
),
(
  'Refactoring Legacy Code with AI Assistance',
  'refactoring-legacy-code-ai',
  'A systematic approach to modernizing legacy codebases using LLMs for analysis, planning, and implementation',
  3,
  'refactoring',
  'intermediate',
  '4-6 hours',
  '# Refactoring Legacy Code with AI Assistance

Transform your legacy codebase into modern, maintainable code using AI tools strategically.

## Overview

Refactoring legacy code is one of the most challenging tasks developers face. LLMs can dramatically accelerate this process when used with the right workflow.

## Phase 1: Codebase Analysis

### Step 1: Generate Context

Use tools like Repomix to create a comprehensive snapshot of your codebase.

```bash
# Install repomix
npm install -g repomix

# Generate codebase summary
repomix --output codebase-context.md
```

### Step 2: Identify Problem Areas

```
Prompt:
"Analyze this codebase summary and identify:
1. Code smells and anti-patterns
2. Areas with high complexity
3. Outdated dependencies or practices
4. Missing tests or documentation

Prioritize issues by impact and effort required."
```

## Phase 2: Planning the Refactor

### Step 1: Create a Refactoring Roadmap

Break down the refactoring into manageable chunks that can be completed independently.

### Step 2: Define Success Metrics

- Test coverage increase
- Complexity reduction
- Performance improvements
- Developer experience improvements

## Phase 3: Implementation

### Incremental Refactoring Approach

Never refactor everything at once. Use this iterative process:

1. **Isolate**: Extract the code to be refactored
2. **Test**: Write tests for current behavior
3. **Refactor**: Use AI to modernize the code
4. **Verify**: Ensure tests still pass
5. **Integrate**: Merge changes back

### Example: Modernizing a Legacy API

```javascript
// Legacy code
function getUserData(callback) {
    db.query("SELECT * FROM users WHERE id = ?", [userId], function(err, results) {
        if (err) {
            callback(err, null);
        } else {
            processUserData(results, function(err, processed) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, processed);
                }
            });
        }
    });
}

// AI-assisted refactor to modern async/await
async function getUserData(userId) {
    try {
        const results = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
        const processed = await processUserData(results);
        return processed;
    } catch (error) {
        throw new Error(`Failed to get user data: ${error.message}`);
    }
}
```

## Best Practices

1. **Maintain Backward Compatibility**: Use adapters when needed
2. **Test Extensively**: Have AI generate comprehensive test suites
3. **Document Changes**: Keep a refactoring log
4. **Review Carefully**: AI suggestions need human oversight

## Tools for Legacy Refactoring

- **Analysis**: Repomix, CodeScene
- **Refactoring**: Cursor, Aider
- **Testing**: Jest, Vitest with AI-generated tests
- **Documentation**: AI-powered doc generators

This workflow has helped teams reduce refactoring time by 60-70% while improving code quality metrics across the board.',
  FALSE,
  'published',
  CURRENT_TIMESTAMP - INTERVAL '7 days'
);

-- Insert workflow steps for the greenfield workflow
INSERT INTO workflow_steps (workflow_id, step_number, title, description, prompt_template) VALUES
(1, 1, 'Idea Honing', 'Transform your rough idea into a detailed specification through guided Q&A', 'I want to build [YOUR IDEA]. Ask me one question at a time to help develop a thorough specification.'),
(1, 2, 'Create Implementation Plan', 'Break down the spec into actionable development tasks', 'Given this specification: [PASTE SPEC], draft a step-by-step blueprint for building this project.'),
(1, 3, 'Build MVP', 'Implement the minimal viable features using AI assistance', 'Implement [SPECIFIC FEATURE] with clean code, error handling, and appropriate comments.'),
(1, 4, 'Iterate and Enhance', 'Add features incrementally with testing', 'Add [ENHANCEMENT] to the existing codebase, maintaining consistency with current patterns.');

-- Insert workflow tools
INSERT INTO workflow_tools (workflow_id, tool_name, tool_category, is_required) VALUES
(1, 'Claude', 'LLM', TRUE),
(1, 'Cursor', 'IDE', FALSE),
(1, 'Aider', 'CLI', FALSE),
(1, 'Git', 'Version Control', TRUE),
(2, 'Claude', 'LLM', TRUE),
(2, 'Python', 'Language', TRUE),
(2, 'Jupyter', 'Environment', FALSE),
(3, 'Repomix', 'Analysis', TRUE),
(3, 'Aider', 'CLI', TRUE),
(3, 'Jest', 'Testing', FALSE);

-- Insert some sample saves
INSERT INTO workflow_saves (workflow_id, user_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 3);

-- Insert sample comments
INSERT INTO workflow_comments (workflow_id, user_id, content) VALUES
(1, 2, 'This workflow has completely changed how I approach new projects. The idea honing phase is particularly valuable.'),
(1, 1, 'Glad you found it helpful! The key is really taking time in that first phase to think through all the details.'),
(2, 3, 'The binary decision approach is brilliant. We implemented this for our chatbot and saw immediate improvements.');

-- Update view counts
UPDATE workflows SET view_count = 342 WHERE id = 1;
UPDATE workflows SET view_count = 189 WHERE id = 2;
UPDATE workflows SET view_count = 97 WHERE id = 3;