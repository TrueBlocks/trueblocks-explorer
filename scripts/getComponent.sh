#!/bin/bash

# getComponent.sh - Extract React component from TypeScript files
# Usage: ./scripts/getComponent.sh <ComponentName>

if [ $# -ne 1 ]; then
    echo "Usage: $0 <ComponentName>"
    echo "Example: $0 Text"
    exit 1
fi

COMPONENT_NAME="$1"

# Check if frontend directory exists
if [ ! -d "./frontend" ]; then
    echo "Error: ./frontend directory not found"
    exit 1
fi

# Use Python for more reliable parsing
python3 << EOF
import os
import re
import sys

component_name = "$COMPONENT_NAME"

def extract_components(file_path, component_name):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert newlines to spaces as requested
        content = content.replace('\n', ' ')
        
        # Pattern for self-closing tags: <ComponentName ... />
        self_closing_pattern = f'<{component_name}(?:\\\\s[^>]*)?/>'
        
        # Pattern for opening/closing tags: <ComponentName ...>...</ComponentName>
        # This uses a non-greedy match to handle nested components
        paired_pattern = f'<{component_name}(?:\\\\s[^>]*)?>(.*?)</{component_name}>'
        
        found = False
        
        # Find self-closing tags
        for match in re.finditer(self_closing_pattern, content):
            full_tag = match.group(0)
            # Extract only up to the first >
            opening_tag = full_tag.split('>')[0] + '>'
            # Replace multiple spaces with single space
            opening_tag = re.sub(r' +', ' ', opening_tag)
            print(opening_tag)
            found = True
        
        # Find paired opening/closing tags
        for match in re.finditer(paired_pattern, content, re.DOTALL):
            full_tag = match.group(0)
            # Extract only up to the first >
            opening_tag = full_tag.split('>')[0] + '>'
            # Replace multiple spaces with single space
            opening_tag = re.sub(r' +', ' ', opening_tag)
            print(opening_tag)
            found = True
            
        return found
        
    except Exception as e:
        # Silently ignore files that can't be read
        return False

# Find all .ts and .tsx files
for root, dirs, files in os.walk('./frontend'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            file_path = os.path.join(root, file)
            extract_components(file_path, component_name)

EOF