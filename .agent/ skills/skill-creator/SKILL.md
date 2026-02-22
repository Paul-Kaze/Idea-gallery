---
name: skill-creator
description: Guide for creating effective Antigravity skills. Use when users want to create a new skill (or update an existing skill) that extends Antigravity's capabilities with specialized knowledge, workflows, or tool integrations. Skills are stored in .agent/skills/ directories.
---

# Skill Creator for Antigravity

Create effective skills that extend Antigravity's capabilities with specialized knowledge, workflows, and tools.

## About Skills

Skills are modular, self-contained packages that provide:

1. **Specialized workflows** - Multi-step procedures for specific domains
2. **Tool integrations** - Instructions for working with specific file formats, APIs, or Antigravity tools
3. **Domain expertise** - Company-specific knowledge, schemas, business logic
4. **Bundled resources** - Scripts, references, and assets for complex and repetitive tasks

## Core Principles

### Concise is Key

The context window is a shared resource. Only add context Antigravity doesn't already have. Challenge each piece of information: "Does this justify its token cost?"

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

Match specificity to task fragility:

- **High freedom** (text instructions): Multiple valid approaches, context-dependent decisions
- **Medium freedom** (pseudocode/parameterized scripts): Preferred pattern exists, some variation acceptable
- **Low freedom** (specific scripts, few parameters): Fragile operations, consistency critical

### Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name + description required)
│   └── Markdown instructions
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts)
```

#### SKILL.md (required)

- **Frontmatter** (YAML): `name` and `description` fields (required). The `description` is the primary triggering mechanism — include WHAT the skill does and WHEN to use it.
- **Body** (Markdown): Instructions loaded after skill triggers.

#### Bundled Resources (optional)

##### scripts/
Executable code for tasks requiring deterministic reliability or repeatedly rewritten.
- Token efficient, deterministic, may be executed without loading into context
- Scripts may still be read by Antigravity for patching or environment-specific adjustments

##### references/
Documentation loaded as needed to inform Antigravity's process.
- Keeps SKILL.md lean, loaded only when needed
- For files >10k words, include grep search patterns in SKILL.md
- Information should live in either SKILL.md or references, not both

##### assets/
Files used within the output, not loaded into context.
- Templates, images, icons, boilerplate code, fonts, sample documents

#### What NOT to Include

Do NOT create extraneous files: README.md, INSTALLATION_GUIDE.md, QUICK_REFERENCE.md, CHANGELOG.md, etc. Only include files an AI agent needs to do the job.

### Progressive Disclosure

Three-level loading system:

1. **Metadata (name + description)** — Always in context (~100 words)
2. **SKILL.md body** — When skill triggers (<5k words)
3. **Bundled resources** — As needed (unlimited since scripts can execute without reading)

Keep SKILL.md body under 500 lines. Split content into separate files when approaching this limit. Always reference split files from SKILL.md with clear guidance on when to read them.

**Key principle:** Keep only core workflow and selection guidance in SKILL.md. Move variant-specific details into reference files.

**Patterns for splitting content**: See [references/progressive-disclosure-patterns.md](references/progressive-disclosure-patterns.md) for examples.

## Antigravity-Specific Considerations

When creating skills for Antigravity, keep these unique capabilities in mind:

### Available Tools

Antigravity has access to tools that skills can leverage:

- **`browser_subagent`** — Perform browser actions (clicking, typing, navigating). Skills that involve web automation should instruct how to compose browser subagent tasks.
- **`generate_image`** — Generate images from text prompts. Skills involving visual output can reference this.
- **`run_command`** — Execute shell commands. Skills with scripts should note `SafeToAutoRun` considerations.
- **`task_boundary`** — Structure complex work into phases (PLANNING → EXECUTION → VERIFICATION). Skills with multi-step workflows should align with this pattern.
- **File tools** (`view_file`, `write_to_file`, `replace_file_content`, `multi_replace_file_content`) — Standard file operations.
- **Search tools** (`grep_search`, `find_by_name`, `search_web`) — Code and web search.
- **`read_url_content`** — Fetch content from URLs.

### Artifact System

Antigravity uses an artifact system for communicating with users during tasks:
- `task.md` — Task checklist
- `implementation_plan.md` — Technical plans requiring user approval
- `walkthrough.md` — Post-completion summaries

Skills involving complex multi-step work should mention using artifacts for planning/verification.

### Workflow Integration

Skills can also complement Antigravity's workflow system (`.agent/workflows/`). If a skill involves a repeatable process, consider whether a companion workflow is appropriate.

## Skill Creation Process

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (run `scripts/init_skill.py`)
4. Edit the skill (implement resources and write SKILL.md)
5. Validate the skill (run `scripts/validate_skill.py`)
6. Iterate based on real usage

### Step 1: Understanding the Skill with Concrete Examples

Skip only when usage patterns are clearly understood.

Gather concrete examples of how the skill will be used. Ask targeted questions:

- "What functionality should this skill support?"
- "Can you give examples of how this skill would be used?"
- "What would a user say that should trigger this skill?"

Avoid overwhelming users with too many questions at once.

### Step 2: Planning Reusable Skill Contents

Analyze each example by:

1. Considering how to execute from scratch
2. Identifying what scripts, references, and assets would help when executing repeatedly

Examples:
- Rotating PDFs repeatedly → `scripts/rotate_pdf.py`
- Frontend webapp boilerplate → `assets/hello-world/` template
- Querying BigQuery schemas → `references/schema.md`

### Step 3: Initializing the Skill

When creating a new skill from scratch, run:

```bash
python3 .agent/skills/skill-creator/scripts/init_skill.py <skill-name> --path <output-directory>
```

The script creates a skill directory with:
- SKILL.md template with proper frontmatter and TODO placeholders
- Example `scripts/`, `references/`, and `assets/` directories

Skip this step if updating an existing skill.

### Step 4: Edit the Skill

Remember: the skill is for another instance of Antigravity to use. Include information that would be beneficial and non-obvious.

#### Design Pattern References

Consult these based on your skill's needs:

- **Multi-step processes**: See [references/workflows.md](references/workflows.md) for sequential workflows and conditional logic
- **Specific output formats or quality standards**: See [references/output-patterns.md](references/output-patterns.md) for template and example patterns

#### Start with Reusable Skill Contents

Implement the scripts, references, and assets identified in Step 2. Test scripts by running them. Delete unneeded example files.

#### Update SKILL.md

**Frontmatter guidelines:**

- `name`: kebab-case skill name
- `description`: Primary triggering mechanism. Include WHAT the skill does AND specific triggers/contexts for WHEN to use it. All "when to use" info must be in the description — the body loads only after triggering.

Do not include other fields in YAML frontmatter.

**Body guidelines:**
- Use imperative/infinitive form
- Reference bundled resources with clear guidance on when to read them

### Step 5: Validating a Skill

Validate the skill structure:

```bash
python3 .agent/skills/skill-creator/scripts/validate_skill.py <path/to/skill-folder>
```

The validator checks:
- YAML frontmatter format and required fields
- Skill naming conventions
- Description completeness
- File organization

Fix any validation errors before considering the skill complete.

### Step 6: Iterate

After using the skill on real tasks:

1. Notice struggles or inefficiencies
2. Identify how SKILL.md or bundled resources should be updated
3. Implement changes and test again
