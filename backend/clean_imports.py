import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove imports
    content = re.sub(r'import\s+EventBus\s+from\s+[\'"].*?workflow-automation/events/EventBus\.js[\'"];?\n?', '', content)
    content = re.sub(r'import\s+\{\s*WORKFLOW_EVENTS\s*\}\s+from\s+[\'"].*?workflow-automation/constants/workflow\.events\.js[\'"];?\n?', '', content)
    content = re.sub(r'import\s+\{\s*startWorkflowEngine\s*\}\s+from\s+[\'"].*?workflow-automation/index\.js[\'"];?\n?', '', content)
    
    # Remove EventBus.emit(...) blocks
    # We'll use a regex that catches EventBus.emit(..., {...}) 
    content = re.sub(r'EventBus\.emit\([^)]+\);\n?', '', content)
    
    # Also remove startWorkflowEngine()
    content = re.sub(r'startWorkflowEngine\(\);\n?', '', content)

    # Some files might just be listeners registration, e.g. .listeners.js
    # If the file becomes empty or just has imports, we'll leave it as is for now.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    src_dir = os.path.join('src')
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.js'):
                clean_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
