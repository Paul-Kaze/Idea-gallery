# Workflow Patterns

## Sequential Workflows

For complex tasks, break operations into clear, sequential steps:

```markdown
Filling a PDF form involves these steps:

1. Analyze the form (run analyze_form.py)
2. Create field mapping (edit fields.json)
3. Validate mapping (run validate_fields.py)
4. Fill the form (run fill_form.py)
5. Verify output (run verify_output.py)
```

## Conditional Workflows

For tasks with branching logic, guide through decision points:

```markdown
1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below

2. Creation workflow: [steps]
3. Editing workflow: [steps]
```

## Antigravity Task-Aligned Workflows

Align complex skill workflows with Antigravity's task boundary system:

```markdown
## Workflow

1. **PLANNING phase** (call task_boundary with Mode=PLANNING)
   - Research requirements
   - Create implementation_plan.md
   - Get user approval via notify_user

2. **EXECUTION phase** (call task_boundary with Mode=EXECUTION)
   - Implement changes
   - Update task.md progress

3. **VERIFICATION phase** (call task_boundary with Mode=VERIFICATION)
   - Run tests / validate
   - Create walkthrough.md
```
