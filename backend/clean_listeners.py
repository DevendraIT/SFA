import os
import re

def clean_listeners(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the export function register*Listeners() { ... }
    # and replace its body with nothing
    
    # Simple approach: comment out any line starting with EventBus
    lines = content.split('\n')
    in_eventbus_block = False
    new_lines = []
    
    for line in lines:
        if 'EventBus.on(' in line:
            in_eventbus_block = True
            new_lines.append('  // ' + line.strip())
            continue
            
        if in_eventbus_block:
            new_lines.append('  // ' + line.strip())
            # rudimentary check for end of block
            if line.strip() == '});':
                in_eventbus_block = False
        else:
            new_lines.append(line)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

def main():
    listeners = [
        r'src\modules\target-performance\target-performance.listeners.js',
        r'src\modules\notifications\notifications.listeners.js',
        r'src\modules\field-force\field-force.listeners.js',
        r'src\modules\dashboard\dashboard.listeners.js'
    ]
    for listener in listeners:
        if os.path.exists(listener):
            clean_listeners(listener)

if __name__ == '__main__':
    main()
