#!/usr/bin/env python3
"""Fix unescaped apostrophes in single-quoted TypeScript string literals in supplements.ts"""
import re

with open('src/data/supplements.ts', 'r') as f:
    content = f.read()

# Find all single-quoted string values (description, name fields)
# Replace curly apostrophes and straight apostrophes inside single-quoted strings
# Strategy: replace all ' (right single quote / apostrophe) with \'
# But we need to be careful not to break the string delimiters

# Replace curly/smart apostrophes with escaped straight apostrophe
content = content.replace('\u2019', "\\'")  # Right single quotation mark
content = content.replace('\u2018', "\\'")  # Left single quotation mark

# Now find description: '...' patterns and escape internal apostrophes
# Use a regex to find single-quoted strings and escape internal apostrophes
def fix_single_quoted_string(m):
    inner = m.group(1)
    # Replace unescaped apostrophes (not already escaped)
    fixed = re.sub(r"(?<!\\)'", "\\'", inner)
    return f"'{fixed}'"

# This is complex - instead, convert all description/name single-quoted strings to template literals
# Find lines with description: '...' and convert to backtick strings
lines = content.split('\n')
fixed_lines = []
for line in lines:
    # Check if line has a single-quoted string with an apostrophe issue
    # Match: key: 'value with apostrophe's'
    if "'" in line and ': ' in line:
        # Count single quotes - if odd number, there's an unescaped apostrophe
        # Find the string value part
        match = re.match(r"^(\s+\w+:\s+)'(.*)'(,?\s*)$", line)
        if match:
            prefix, value, suffix = match.groups()
            # Check if value contains unescaped apostrophes (not preceded by backslash)
            if re.search(r"(?<!\\)'", value):
                # Escape them
                value = re.sub(r"(?<!\\)'", "\\'", value)
                line = f"{prefix}'{value}'{suffix}"
    fixed_lines.append(line)

content = '\n'.join(fixed_lines)

with open('src/data/supplements.ts', 'w') as f:
    f.write(content)

print("Fixed apostrophes in supplements.ts")

# Verify by checking for common problem patterns
problems = []
for i, line in enumerate(content.split('\n'), 1):
    # Look for description: 'text with unescaped apostrophe
    if re.search(r"description: '.*[^\\]'.*[^\\]'", line):
        problems.append(f"Line {i}: {line[:100]}")

if problems:
    print(f"Still found {len(problems)} potential issues:")
    for p in problems[:5]:
        print(f"  {p}")
else:
    print("No apostrophe issues detected!")
