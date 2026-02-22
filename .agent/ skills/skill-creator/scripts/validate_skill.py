#!/usr/bin/env python3
"""
Skill Validator for Antigravity - Validates skill structure and SKILL.md format

Usage:
    validate_skill.py <path/to/skill-folder>

Example:
    validate_skill.py .agent/skills/my-skill
"""

import sys
import re
from pathlib import Path

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False


def parse_frontmatter_simple(content):
    """Parse YAML frontmatter without the yaml library."""
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return None, "Invalid frontmatter format"

    frontmatter_text = match.group(1)
    result = {}

    for line in frontmatter_text.strip().split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if ':' in line:
            key, _, value = line.partition(':')
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            result[key] = value

    return result, None


def validate_skill(skill_path):
    """
    Validate a skill directory structure and SKILL.md format.

    Args:
        skill_path: Path to the skill folder

    Returns:
        (valid: bool, message: str)
    """
    skill_path = Path(skill_path)

    # Check SKILL.md exists
    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return False, "SKILL.md not found"

    # Read content
    content = skill_md.read_text()
    if not content.startswith('---'):
        return False, "No YAML frontmatter found"

    # Extract frontmatter
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "Invalid frontmatter format"

    frontmatter_text = match.group(1)

    # Parse YAML frontmatter
    if HAS_YAML:
        try:
            frontmatter = yaml.safe_load(frontmatter_text)
            if not isinstance(frontmatter, dict):
                return False, "Frontmatter must be a YAML dictionary"
        except yaml.YAMLError as e:
            return False, f"Invalid YAML in frontmatter: {e}"
    else:
        frontmatter, err = parse_frontmatter_simple(content)
        if err:
            return False, err

    # Allowed properties
    ALLOWED_PROPERTIES = {'name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility'}

    unexpected_keys = set(frontmatter.keys()) - ALLOWED_PROPERTIES
    if unexpected_keys:
        return False, (
            f"Unexpected key(s) in frontmatter: {', '.join(sorted(unexpected_keys))}. "
            f"Allowed: {', '.join(sorted(ALLOWED_PROPERTIES))}"
        )

    # Check required fields
    if 'name' not in frontmatter:
        return False, "Missing 'name' in frontmatter"
    if 'description' not in frontmatter:
        return False, "Missing 'description' in frontmatter"

    # Validate name
    name = frontmatter.get('name', '')
    if not isinstance(name, str):
        return False, f"Name must be a string, got {type(name).__name__}"
    name = name.strip()

    if name:
        if not re.match(r'^[a-z0-9-]+$', name):
            return False, f"Name '{name}' should be kebab-case (lowercase letters, digits, hyphens only)"
        if name.startswith('-') or name.endswith('-') or '--' in name:
            return False, f"Name '{name}' cannot start/end with hyphen or contain consecutive hyphens"
        if len(name) > 64:
            return False, f"Name too long ({len(name)} chars). Maximum: 64"

    # Validate description
    description = frontmatter.get('description', '')
    if not isinstance(description, str):
        return False, f"Description must be a string, got {type(description).__name__}"
    description = description.strip()

    if description:
        if '<' in description or '>' in description:
            return False, "Description cannot contain angle brackets (< or >)"
        if len(description) > 1024:
            return False, f"Description too long ({len(description)} chars). Maximum: 1024"

    # Check for TODO placeholders
    if '[TODO' in content:
        print("⚠️  Warning: SKILL.md still contains [TODO] placeholders")

    # Validate body has content after frontmatter
    body = content[match.end():].strip()
    if not body:
        return False, "SKILL.md body is empty"

    # Line count check
    line_count = len(content.split('\n'))
    if line_count > 500:
        print(f"⚠️  Warning: SKILL.md is {line_count} lines (recommended: <500). Consider splitting into reference files.")

    return True, "Skill is valid! ✅"


def main():
    if len(sys.argv) != 2:
        print("Usage: validate_skill.py <skill_directory>")
        print("\nExample:")
        print("  validate_skill.py .agent/skills/my-skill")
        sys.exit(1)

    skill_path = sys.argv[1]
    print(f"🔍 Validating skill: {skill_path}\n")

    valid, message = validate_skill(skill_path)
    print(message)
    sys.exit(0 if valid else 1)


if __name__ == "__main__":
    main()
