import re

with open('prisma/schema.prisma', 'r') as f:
    lines = f.readlines()

new_lines = []

for line in lines:
    if 'leads           Lead[]' in line: continue
    if 'leads       Lead[]' in line: continue
    if 'assignedLeads      Lead[]' in line: continue
    if 'createdLeads       Lead[]' in line: continue
    if 'leadActivities     LeadActivity[]' in line: continue
    if 'leadNotes          LeadNote[]' in line: continue
    if 'leadDocuments      LeadDocument[]' in line: continue
    if 'followUps          LeadFollowUp[]' in line: continue
    if 'meetingsOrganized  LeadMeeting[]' in line: continue
    if 'assignmentHistory  LeadAssignmentHistory[]' in line: continue
    if 'leadConversions    LeadConversion[]' in line: continue
    
    # Also ignore the line about url in datasource
    if 'url      = env("DATABASE_URL")' in line: continue

    new_lines.append(line)

with open('prisma/schema.prisma', 'w') as f:
    f.writelines(new_lines)

print("Done")
