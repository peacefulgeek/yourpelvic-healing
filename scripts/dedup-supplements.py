#!/usr/bin/env python3
"""Deduplicate supplement entries in supplements.ts, keeping the first occurrence of each id."""
import re

with open('src/data/supplements.ts', 'r') as f:
    content = f.read()

# Extract the array content between `export const supplements: Supplement[] = [` and `];`
array_match = re.search(
    r'(export const supplements: Supplement\[\] = \[)(.*?)(\];\n\nexport default supplements;)',
    content,
    re.DOTALL
)
if not array_match:
    print("ERROR: Could not find supplements array")
    exit(1)

prefix = content[:array_match.start(2)]
suffix = content[array_match.end(2):]
array_body = array_match.group(2)

# Split into individual entries by finding `  {` at start of line followed by `    id:`
# We'll use a different approach: split on the pattern `  },\n  {` or `  },\n  // ─`
# Actually, let's parse by finding each object block

# Find all entry blocks - each starts with `  {` and ends with `  },`
entries = []
seen_ids = set()
unique_entries = []

# Use regex to find all { ... } blocks at the top level of the array
# Each entry is a dict-like block starting with `  {\n` and ending with `  },\n`
pattern = re.compile(r'  \{[^{}]*?\n  \},', re.DOTALL)
comment_pattern = re.compile(r'\n  // ─+[^\n]*\n')

# Get all matches with their positions
all_matches = list(pattern.finditer(array_body))
print(f"Found {len(all_matches)} total entries")

for match in all_matches:
    entry_text = match.group(0)
    id_match = re.search(r"id: '([^']+)'", entry_text)
    if id_match:
        entry_id = id_match.group(1)
        if entry_id not in seen_ids:
            seen_ids.add(entry_id)
            unique_entries.append(entry_text)

print(f"Unique entries: {len(unique_entries)}")

# Now rebuild the array body with category comments
# We'll rebuild without comments first, then add category groupings
categories = {}
for entry_text in unique_entries:
    cat_match = re.search(r"category: '([^']+)'", entry_text)
    if cat_match:
        cat = cat_match.group(1)
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(entry_text)

# Rebuild with category headers
new_array_body = '\n'
for cat, entries in categories.items():
    header = cat.upper().replace(' ', ' ').replace('&', '&')
    new_array_body += f'\n  // ─── {header} {"─" * max(1, 60 - len(header))}─\n'
    for entry in entries:
        new_array_body += entry + '\n'

new_content = prefix + new_array_body + suffix

with open('src/data/supplements.ts', 'w') as f:
    f.write(new_content)

# Verify
final_count = len(re.findall(r"^\s+id:", new_content, re.MULTILINE))
final_ids = re.findall(r"id: '([^']+)'", new_content)
from collections import Counter
dupes = {k:v for k,v in Counter(final_ids).items() if v > 1}
print(f"Final count: {final_count}")
if dupes:
    print(f"Remaining duplicates: {dupes}")
else:
    print("No duplicates - clean!")
