..# Implementation TODO

## Task 1: Sidebar Cleanup ✅
- [x] Edit `frontend/src/config/navigation.js` - Remove standalone items
- [x] Edit `frontend/src/routes/AppRoutes.jsx` - Remove corresponding routes

## Task 2: Dynamic DAR
- [ ] Edit `backend/prisma/schema.prisma` - Add metadata field to DailyActivityReport
- [ ] Edit `backend/src/modules/field-force/field-force.service.js` - Enhance generateDar()
- [ ] Edit `backend/src/modules/field-force/field-force.repository.js` - Update createDar()
- [ ] Edit `frontend/src/components/field-force/DARCard.jsx` - Show richer data
- [ ] Edit `frontend/src/pages/field-force/DARPage.jsx` - Display dynamic report

## Task 3: Executive Profile
- [ ] Edit `frontend/src/pages/field-force/ProfilePage.jsx` - Enhance with all required info

## Task 4: Dynamic Route & Navigation (HIGHEST PRIORITY)
- [ ] Edit `backend/prisma/schema.prisma` - Add lat/lng fields to Customer model
- [ ] Edit `backend/src/modules/customers/customers.service.js` - Handle lat/lng on create/update
- [ ] Edit `backend/src/modules/customers/customers.controller.js` - Support geocoding if not provided
- [ ] Edit `frontend/src/pages/team/AssignTaskModal.jsx` - Verify geocoding flow works end-to-end

## Task 5: Photo Upload
- [ ] Edit `backend/src/modules/field-force/field-force.controller.js` - Add upload endpoint
- [ ] Edit `backend/src/modules/field-force/field-force.service.js` - Add upload service using Cloudinary
- [ ] Edit `backend/src/modules/field-force/field-force.routes.js` - Add upload route
- [ ] Edit `frontend/src/api/fieldForce.api.js` - Add uploadFile API
- [ ] Edit `frontend/src/pages/field-force/TaskExecutionPage.jsx` - Replace URL input with file upload

