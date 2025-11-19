# TOC Agent Registry - AI Tarot Decision Assistant

## Project Context

**Project**: AI Tarot Decision Assistant
**Domain**: Wellness Tech / Decision Support / AI Applications
**Stage**: MVP Development (Day 1-12)
**Architecture**: MERN Stack + React Native + Chrome Extension

---

## Available TOC Agents

### 1. mu2-toc-implementation
**Purpose**: MVB execution, feature implementation, testing
**When to use**:
- Implementing specific features from roadmap
- Building UI components
- Writing backend API endpoints
- Integration work

**Example invocations**:
```
Task: mu2-toc-implementation "implement daily reading API endpoint with OpenAI integration"
Task: mu2-toc-implementation "build card display component with flip animation"
Task: mu2-toc-implementation "integrate Stripe subscription checkout flow"
```

---

### 2. mu2-toc-unified-intelligence
**Purpose**: Deep analysis, pattern recognition, constraint identification
**When to use**:
- Analyzing technical constraints
- Identifying performance bottlenecks
- Researching best practices
- Design decision analysis

**Example invocations**:
```
Task: mu2-toc-unified-intelligence "analyze OpenAI API cost optimization strategies"
Task: mu2-toc-unified-intelligence "identify potential security vulnerabilities in auth flow"
Task: mu2-toc-unified-intelligence "research best practices for React Native performance"
```

---

### 3. mu2-toc-autotoc-engine
**Purpose**: Recursive improvement, learning from results, system optimization
**When to use**:
- After sprint retrospectives
- Optimizing development processes
- Learning from production issues
- Improving code patterns

**Example invocations**:
```
Task: mu2-toc-autotoc-engine "analyze Day 1 velocity and optimize Day 2 planning"
Task: mu2-toc-autotoc-engine "learn from beta testing feedback and improve UX patterns"
Task: mu2-toc-autotoc-engine "optimize AI prompt engineering based on user ratings"
```

---

### 4. mu2-toc-capability-intelligence
**Purpose**: Resource discovery, capability analysis, tool selection
**When to use**:
- Evaluating third-party libraries
- Discovering development tools
- Analyzing technology choices
- CASCADE resource management

**Example invocations**:
```
Task: mu2-toc-capability-intelligence "find best MongoDB schema design tools"
Task: mu2-toc-capability-intelligence "evaluate push notification service options"
Task: mu2-toc-capability-intelligence "discover Chrome extension testing frameworks"
```

---

### 5. mu2-toc-coordinator (Current)
**Purpose**: Orchestrating multi-agent workflows, routing complex requests
**When to use**:
- Complex tasks requiring multiple agents
- Strategic planning involving analysis + implementation
- Cross-cutting concerns

**Example invocations**:
```
# The coordinator is already active for this session
# Use for complex orchestration needs
```

---

## Project-Specific Agent Guidelines

### For Daily Development Tasks

**Pattern 1: Feature Implementation**
```
1. Read PRD section for feature context
2. Check technical constraints
3. Invoke mu2-toc-implementation with clear MVB scope
```

**Pattern 2: Problem Solving**
```
1. Invoke mu2-toc-unified-intelligence for analysis
2. Review recommendations
3. Invoke mu2-toc-implementation for solution
```

**Pattern 3: Tool Selection**
```
1. Invoke mu2-toc-capability-intelligence for discovery
2. Review options with team
3. Document decision in CASCADE/EXPERT/
```

---

## Constraint-Aware Agent Usage

### C1: OpenAI API Dependency (HIGH)
**Primary Agent**: mu2-toc-implementation (fallback system)
**Support Agent**: mu2-toc-unified-intelligence (cost optimization)

### C2: MongoDB Scaling (MEDIUM-HIGH)
**Primary Agent**: mu2-toc-unified-intelligence (query optimization)
**Support Agent**: mu2-toc-capability-intelligence (tool discovery for monitoring)

### C3: App Store Approval (MEDIUM)
**Primary Agent**: mu2-toc-unified-intelligence (policy analysis)
**Support Agent**: mu2-toc-implementation (compliance implementation)

### C4: Extension Permissions (MEDIUM)
**Primary Agent**: mu2-toc-implementation (permission UX)
**Support Agent**: mu2-toc-unified-intelligence (user trust patterns)

### RC3: 12-Day Timeline (HIGH)
**Primary Agent**: mu2-toc-autotoc-engine (velocity optimization)
**Support Agent**: mu2-toc-coordinator (priority orchestration)

---

## Sprint-Based Agent Strategy

### Day 1-4 (Foundation)
**Focus**: mu2-toc-implementation (80%), mu2-toc-capability-intelligence (20%)
- Heavy implementation of core features
- Tool and library selection
- Infrastructure setup

### Day 5-8 (Multi-Platform)
**Focus**: mu2-toc-implementation (60%), mu2-toc-unified-intelligence (30%), mu2-toc-autotoc-engine (10%)
- Cross-platform development
- Performance analysis and optimization
- Learning from mobile/extension challenges

### Day 9-10 (AI & Analytics)
**Focus**: mu2-toc-unified-intelligence (50%), mu2-toc-implementation (50%)
- AI personalization research and implementation
- Analytics pattern analysis
- Machine learning optimization

### Day 11-12 (Launch)
**Focus**: mu2-toc-autotoc-engine (40%), mu2-toc-implementation (40%), mu2-toc-unified-intelligence (20%)
- System optimization
- Performance tuning
- Learning from beta testing
- Launch preparation analysis

---

## Success Metrics Per Agent

### mu2-toc-implementation
- Feature completion velocity: 5-7 features per sprint
- Bug introduction rate: <2 bugs per feature
- Code quality: Linting 100%, test coverage >80%
- MVB success rate: 95%+ features meeting acceptance criteria

### mu2-toc-unified-intelligence
- Analysis depth: Identify 3+ actionable insights per request
- Recommendation quality: 80%+ recommendations implemented
- Constraint identification: 100% accuracy in flagging risks
- Research efficiency: Reduce decision time by 50%

### mu2-toc-autotoc-engine
- Velocity improvement: 10%+ per sprint optimization
- Pattern reuse: 50%+ patterns applied to new features
- Learning cycle: <24 hours from feedback to optimization
- System coherence: 0 architectural drift incidents

### mu2-toc-capability-intelligence
- Tool discovery: 90%+ optimal tool selection
- Resource mapping: Complete CASCADE coverage
- Integration success: 95%+ new tools integrate smoothly
- Time savings: 30%+ reduction in tool evaluation time

---

## Agent Communication Protocol

### Request Format
```
Task: [agent-name] "[clear, specific request with context]"
```

### Context Handoff
When passing between agents, include:
1. Previous agent's findings
2. Relevant constraint IDs (e.g., C1, RC3)
3. CASCADE level context (L0-L3)
4. Success criteria

### Example Multi-Agent Workflow
```
# Step 1: Analysis
Task: mu2-toc-unified-intelligence "analyze best approach for real-time reading sync between web and mobile, considering C7 (cross-platform) and performance requirements"

# Step 2: Resource Discovery
Task: mu2-toc-capability-intelligence "find libraries and tools for real-time sync implementation based on analysis findings"

# Step 3: Implementation
Task: mu2-toc-implementation "implement real-time sync system using recommended approach and tools, with C7 constraints in mind"

# Step 4: Optimization
Task: mu2-toc-autotoc-engine "analyze sync implementation results and optimize for reduced latency and battery usage"
```

---

## CASCADE Integration

### Universal Level (Cross-Project)
- **Agent**: mu2-toc-capability-intelligence
- **Focus**: Reusable patterns, shared tools, general best practices

### Project Level (AI Tarot Specific)
- **Agent**: mu2-toc-implementation + mu2-toc-unified-intelligence
- **Focus**: Project-specific features, constraints, architecture

### User Level (Team Workflow)
- **Agent**: mu2-toc-autotoc-engine
- **Focus**: Team velocity, personal productivity, workflow optimization

---

## Emergency Protocols

### Blocker Encountered
```
1. Immediate: mu2-toc-unified-intelligence (analyze blocker, identify workarounds)
2. Short-term: mu2-toc-implementation (implement workaround)
3. Long-term: mu2-toc-autotoc-engine (learn pattern to prevent recurrence)
```

### Timeline Risk
```
1. Assessment: mu2-toc-coordinator (evaluate scope vs. timeline)
2. Optimization: mu2-toc-autotoc-engine (identify velocity improvements)
3. Scope Adjustment: mu2-toc-unified-intelligence (analyze feature priority)
```

### Quality Issue
```
1. Root Cause: mu2-toc-unified-intelligence (deep analysis)
2. Fix: mu2-toc-implementation (implement solution)
3. Prevention: mu2-toc-autotoc-engine (update quality gates)
```

---

## Knowledge Capture Guidelines

After using any agent:
1. Document insights in CASCADE/EXPERT/
2. Update constraints if new ones discovered
3. Add patterns to CASCADE/L3-PATTERNS/ if reusable
4. Update roadmap if timeline/scope affected

---

**Document Version**: 1.0
**Last Updated**: 2025-11-07
**Review**: Daily during sprint planning
