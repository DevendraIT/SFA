with open('prisma/schema.prisma', 'r') as f:
    lines = f.readlines()
new_lines = [l for l in lines if 'leads        Lead[]' not in l]
with open('prisma/schema.prisma', 'w') as f:
    f.writelines(new_lines)
print('Done')
