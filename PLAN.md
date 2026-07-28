0# Complete Field Force Execution Workflow - Implementation Plan

## Information Gathered

### Current State
1. **Prisma Schema**: Task model has status (PENDING|IN_PROGRESS|COMPLETED|CANCELLED), metadata JSON field, basic fields
2. **Backend**: FieldForce module has CRUD for tasks, attendance, visits, expenses. Dashboard module has metrics for visits/orders but NOT tasks
3. **Frontend**: FieldForceDashboard shows tasks from `useFieldForce`, TasksPage lists tasks, TaskDetail shows task details
4. **Geo**: No geo-fence validation exists. Check-in/out just saves location without validation
5. **Maps**: No Google Maps integration
6. **Status Lifecycle**: Only 4 statuses, not the full 8-step flow

### Issues identified from code analysis
1. Dashboard statistics show 0 because dashboard service doesn't query task metrics at all
2. Geo-fencing is completely absent - no proximity validation
3. No route planning or navigation support
4. Task status lifecycle only has 4 states, not 8
5. No execution tracking (arrival time, check-in/out per task, delivery tracking)
6. Manager's assigned tasks page works but needs live updates

---

## Implementation Plan

### Phase 1: Backend - Prisma Schema Extension
**Files to modify:**
- `backend/prisma/schema.prisma` - Extend Task model with new fields

**Changes:**
- Add new TaskStatus enum values: `ACCEPTED`, `ARRIVED`, `CHECKED_IN`, `DELIVERY_IN_PROGRESS`, `CHECKED_OUT`
- Add to Task model: `startedAt`, `arrivedAt`, `checkedInAt`, `checkedOutAt`, `checkInLocation`, `checkOutLocation`, `distanceTraveled`, `paymentStatus`, `paymentAmount`, `customerSignature`, `photos` (JSON array)
- Add migration

### Phase 2: Backend - Geo-Fencing & Task Workflow
**Files to modify:**
- `backend/src/modules/field-force/field-force.service.js`
- `backend/src/modules/field-force/field-force.repository.js`
- `backend/src/modules/field-force/field-force.controller.js`
- `backend/src/modules/field-force/field-force.routes.js`
- `backend/src/modules/field-force/field-force.validation.js`

**Changes:**
- Add `updateTaskStatus` method with status transition validation
- Add geo-fence validation (Haversine formula, 100m radius)
- Add `acceptTask`, `startTask`, `arriveAtTask`, `checkInToTask`, `startDelivery`, `checkOutFromTask` endpoints
- Add `startNavigation` endpoint that returns route data
- Add `verifyProximity` helper function
- Update validation schemas for new endpoints

### Phase 3: Backend - Dashboard Task Metrics
**Files to modify:**
- `backend/src/modules/dashboard/dashboard.repository.js`
- `backend/src/modules/dashboard/dashboard.service.js`

**Changes:**
- Add `getTaskMetrics` to dashboard repository
- Add task metrics to executive, team, and user dashboards

### Phase 4: Frontend - API & Hooks Extension
**Files to modify:**
- `frontend/src/api/fieldForce.api.js` - Add new API methods
- `frontend/src/hooks/useFieldForce.js` - Add task status tracking

**Changes:**
- Add `acceptTask`, `startTask`, `arriveAtTask`, `checkInToTask`, `startDelivery`, `checkOutFromTask`, `verifyProximity` API methods
- Update hook to track task execution state

### Phase 5: Frontend - Executive Task Detail Page (Complete Redesign)
**Files to modify:**
- `frontend/src/pages/field-force/TasksPage.jsx` - Add task execution actions
- Create: `frontend/src/pages/field-force/TaskExecutionPage.jsx` - New page for task execution workflow

**Changes:**
- Complete task execution UI with:
  - Task info header with status badge
  - Google Maps view with current location + destination
  - Route display with distance/time
  - Step-by-step workflow (Accept → Start → Navigate → Arrive → Check-In → Deliver → Check-Out → Complete)
  - Geo-fence validation before check-in
  - Photo upload
  - Signature capture
  - Payment collection
  - Visit notes

### Phase 6: Frontend - Google Maps Integration
**File to create:**
- `frontend/src/components/field-force/RouteMap.jsx`

**Changes:**
- Google Maps component showing:
  - Current location marker (blue dot)
  - Destination marker (red pin from task metadata)
  - Route polyline
  - Distance and travel time info window
  - "Open in Google Maps" navigation button

### Phase 7: Frontend - Dashboard Real Data
**Files to modify:**
- `frontend/src/pages/field-force/FieldForceDashboard.jsx`

**Changes:**
- Dashboard already uses `useFieldForce` hook which fetches real tasks
- Need to ensure `visitSummary`, `taskSummary` are computed from actual task data (they already are in `useFieldForce`)
- Dashboard statistics already show live data from the hook

### Phase 8: Manager View Updates
**Files to modify:**
- `frontend/src/pages/team/TaskDetail.jsx` - Add full execution log view

**Changes:**
- Show execution timeline with timestamps
- Show GPS logs, photos, notes, payment info

---

## Files to Create
1. `frontend/src/pages/field-force/TaskExecutionPage.jsx` - Main task execution page
2. `frontend/src/components/field-force/RouteMap.jsx` - Google Maps component
3. `frontend/src/components/field-force/ProximityChecker.jsx` - Geo-fence status component

## Files to Modify
1. `backend/prisma/schema.prisma` - Extended Task model
2. `backend/src/modules/field-force/field-force.service.js` - New workflow methods
3. `backend/src/modules/field-force/field-force.repository.js` - New DB queries
4. `backend/src/modules/field-force/field-force.controller.js` - New endpoints
5. `backend/src/modules/field-force/field-force.routes.js` - New routes
6. `backend/src/modules/field-force/field-force.validation.js` - New validations
7. `backend/src/modules/dashboard/dashboard.repository.js` - Task metrics
8. `backend/src/modules/dashboard/dashboard.service.js` - Task metrics
9. `frontend/src/api/fieldForce.api.js` - New API calls
10. `frontend/src/hooks/useFieldForce.js` - Enhanced task tracking
11. `frontend/src/pages/field-force/TasksPage.jsx` - Task list actions
12. `frontend/src/pages/field-force/FieldForceDashboard.jsx` - Enhanced dashboard
13. `frontend/src/pages/team/TaskDetail.jsx` - Manager view with execution log
14. `frontend/src/routes/AppRoutes.jsx` - Add new route
