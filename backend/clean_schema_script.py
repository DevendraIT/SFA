import re

def clean_schema():
    with open('prisma/schema.prisma', 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove AI Lead Engine (Phase 5) models and enums
    # It starts at "// ==================================================\n// PHASE 5 — AI Lead Engine"
    # and ends at "// ==================================================\n// PHASE 6 — Field Force"
    content = re.sub(r'// ==================================================\n// PHASE 5 — AI Lead Engine.*?(?=(// ==================================================\n// PHASE 6 — Field Force))', '', content, flags=re.DOTALL)

    # Remove Campaign Management (Phase 6 Campaign Management)
    # Starts at "// PHASE 6 — Campaign Management"
    content = re.sub(r'// ==================================================\n// PHASE 6 — Campaign Management.*', '', content, flags=re.DOTALL)

    # Remove WorkflowSettings from Phase 10
    content = re.sub(r'model WorkflowSettings \{.*?\}', '', content, flags=re.DOTALL)

    # Remove fields from Organization
    lines = content.split('\n')
    new_lines = []
    skip_fields = ['prospects', 'importJobs', 'emailCampaigns', 'emailActivities', 'aiAnalyses', 'emailTemplates', 'workflowSettings', 'campaigns']
    
    in_org = False
    in_user = False
    for line in lines:
        if line.startswith('model Organization {'):
            in_org = True
            new_lines.append(line)
            continue
        elif line.startswith('model User {'):
            in_user = True
            new_lines.append(line)
            continue
            
        if in_org and line.startswith('}'):
            in_org = False
        if in_user and line.startswith('}'):
            in_user = False

        skip_this = False
        if in_org:
            for field in skip_fields:
                if line.strip().startswith(field + ' '):
                    skip_this = True
                    break
        if in_user:
            user_skip = ['uploadedImportJobs', 'createdCampaigns', 'createdTemplates', 'campaignsCreated', 'campaignsUpdated']
            for field in user_skip:
                if line.strip().startswith(field + ' '):
                    skip_this = True
                    break
                    
        if not skip_this:
            new_lines.append(line)

    with open('prisma/schema.prisma', 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

if __name__ == '__main__':
    clean_schema()
    print("Schema cleaned")
