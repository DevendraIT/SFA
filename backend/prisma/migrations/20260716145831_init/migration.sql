-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('MANUAL', 'API', 'REFERRAL', 'WEBSITE', 'SOCIAL_MEDIA', 'EVENT', 'CAMPAIGN', 'OTHER');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "LeadQualification" AS ENUM ('UNQUALIFIED', 'COLD', 'WARM', 'HOT');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATED', 'UPDATED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'ASSIGNED', 'NOTE_ADDED', 'NOTE_EDITED', 'NOTE_DELETED', 'NOTE_PINNED', 'DOCUMENT_UPLOADED', 'DOCUMENT_DELETED', 'FOLLOW_UP_SCHEDULED', 'FOLLOW_UP_COMPLETED', 'FOLLOW_UP_CANCELLED', 'MEETING_SCHEDULED', 'MEETING_UPDATED', 'MEETING_COMPLETED', 'MEETING_CANCELLED', 'SCORE_UPDATED', 'QUALIFICATION_CHANGED', 'CONVERTED', 'EXPORTED', 'DELETED', 'RESTORED');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('GENERAL', 'CONTRACT', 'PROPOSAL', 'PRESENTATION', 'INVOICE', 'IDENTITY', 'OTHER');

-- CreateEnum
CREATE TYPE "FollowUpStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('MANUAL', 'AUTO', 'ROUND_ROBIN', 'TERRITORY_BASED', 'TEAM_BASED', 'REASSIGNED', 'UNASSIGNED');

-- CreateEnum
CREATE TYPE "ConversionType" AS ENUM ('CUSTOMER', 'CONTACT', 'OPPORTUNITY');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('CSV', 'EXCEL');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProspectQualification" AS ENUM ('UNQUALIFIED', 'COLD', 'WARM', 'HOT', 'SPAM', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "EmailEventType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'REPLIED', 'BOUNCED', 'FAILED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "AiSentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "AiIntent" AS ENUM ('NONE', 'MEETING_REQUEST', 'CALL_REQUEST', 'PRICING_REQUEST', 'DEMO_REQUEST', 'MORE_INFO', 'NOT_INTERESTED', 'OUT_OF_OFFICE', 'WRONG_PERSON');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEAVE', 'HALFDAY');

-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('COLD_CALL', 'FOLLOW_UP', 'MEETING', 'DEMO');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('TRAVEL', 'MEALS', 'ACCOMMODATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DarStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED');

-- CreateEnum
CREATE TYPE "TargetMetric" AS ENUM ('REVENUE', 'VISITS', 'NEW_LEADS', 'CONVERSIONS', 'ATTENDANCE', 'DAR', 'ACTIVITIES');

-- CreateEnum
CREATE TYPE "TargetPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "TargetStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL', 'SMS', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ');

-- CreateEnum
CREATE TYPE "CampaignRunStatus" AS ENUM ('Draft', 'Scheduled', 'Running', 'Paused', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "CampaignChannel" AS ENUM ('Email', 'SMS', 'WhatsApp');

-- CreateEnum
CREATE TYPE "EmailProvider" AS ENUM ('SMTP', 'Gmail');

-- CreateEnum
CREATE TYPE "CampaignLeadStatus" AS ENUM ('Pending', 'Queued', 'Sent', 'Delivered', 'Opened', 'Clicked', 'Replied', 'Interested', 'DemoScheduled', 'Qualified', 'Lost', 'Failed');

-- CreateEnum
CREATE TYPE "ReplyType" AS ENUM ('None', 'Interested', 'Demo', 'Pricing', 'NotInterested', 'Other');

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Territory" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "companyId" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Territory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "departmentId" UUID,
    "territoryId" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "organizationId" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "level" INTEGER,
    "parentRoleId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "moduleName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "branchId" UUID,
    "departmentId" UUID,
    "teamId" UUID,
    "territoryId" UUID,
    "managerId" UUID,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerifiedAt" TIMESTAMP(3),
    "emailVerificationOtp" TEXT,
    "emailVerificationExpiresAt" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockoutExpiresAt" TIMESTAMP(3),
    "passwordResetOtp" TEXT,
    "passwordResetExpiresAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID,
    "action" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordHistory" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "assignedToId" UUID,
    "createdById" UUID NOT NULL,
    "territoryId" UUID,
    "branchId" UUID,
    "teamId" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'MANUAL',
    "addressLine1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "priority" "LeadPriority" NOT NULL DEFAULT 'MEDIUM',
    "qualification" "LeadQualification" NOT NULL DEFAULT 'UNQUALIFIED',
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isConverted" BOOLEAN NOT NULL DEFAULT false,
    "convertedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "performedById" UUID,
    "activityType" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadDocument" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "uploadedById" UUID NOT NULL,
    "parentId" UUID,
    "category" "DocumentCategory" NOT NULL DEFAULT 'GENERAL',
    "name" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadFollowUp" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "status" "FollowUpStatus" NOT NULL DEFAULT 'SCHEDULED',
    "reminderSentAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadFollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadMeeting" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "organizerId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "agenda" TEXT,
    "location" TEXT,
    "meetingUrl" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "status" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "outcome" TEXT,
    "meetingNotes" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "participants" JSONB NOT NULL DEFAULT '[]',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadAssignmentHistory" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "assignedToId" UUID,
    "assignedById" UUID NOT NULL,
    "assignmentType" "AssignmentType" NOT NULL,
    "reason" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadAssignmentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadConversion" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "convertedById" UUID NOT NULL,
    "conversionType" "ConversionType" NOT NULL,
    "targetEntityId" UUID,
    "targetEntityType" TEXT,
    "notes" TEXT,
    "convertedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadExportJob" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "requestedById" UUID NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "filters" JSONB NOT NULL,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "status" "ExportStatus" NOT NULL DEFAULT 'PENDING',
    "filePath" TEXT,
    "errorMessage" TEXT,
    "expiresAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadExportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "importJobId" UUID,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qualificationStatus" "ProspectQualification" NOT NULL DEFAULT 'UNQUALIFIED',
    "isConvertedToLead" BOOLEAN NOT NULL DEFAULT false,
    "leadId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportJob" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "uploadedById" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDING',
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "processedRecords" INTEGER NOT NULL DEFAULT 0,
    "failedRecords" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "variables" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "templateId" UUID,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "templateBody" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignProspect" (
    "campaignId" UUID NOT NULL,
    "prospectId" UUID NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignProspect_pkey" PRIMARY KEY ("campaignId","prospectId")
);

-- CreateTable
CREATE TABLE "EmailActivity" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "campaignId" UUID,
    "prospectId" UUID NOT NULL,
    "type" "EmailEventType" NOT NULL,
    "providerMsgId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAnalysis" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "prospectId" UUID NOT NULL,
    "emailActivityId" UUID,
    "sentiment" "AiSentiment" NOT NULL DEFAULT 'NEUTRAL',
    "intent" "AiIntent" NOT NULL DEFAULT 'NONE',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "summary" TEXT,
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "checkInAt" TIMESTAMP(3),
    "checkOutAt" TIMESTAMP(3),
    "checkInLoc" JSONB,
    "checkOutLoc" JSONB,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "durationMins" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "leadId" UUID,
    "title" TEXT NOT NULL,
    "type" "VisitType" NOT NULL DEFAULT 'MEETING',
    "status" "VisitStatus" NOT NULL DEFAULT 'PLANNED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "location" JSONB,
    "notes" TEXT,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "approvedById" UUID,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "date" DATE NOT NULL,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
    "receiptUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyActivityReport" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "totalVisits" INTEGER NOT NULL DEFAULT 0,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT,
    "status" "DarStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyActivityReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID,
    "teamId" UUID,
    "metric" "TargetMetric" NOT NULL,
    "period" "TargetPeriod" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "achievedValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "TargetStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "referenceType" TEXT,
    "referenceId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "variables" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "referenceType" TEXT,
    "referenceId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeatPlan" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeatPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarEvent" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowSettings" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "autoAssign" BOOLEAN NOT NULL DEFAULT true,
    "requireApproval" BOOLEAN NOT NULL DEFAULT true,
    "approvalHierarchy" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessRuleConfig" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "ruleKey" TEXT NOT NULL,
    "ruleValue" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessRuleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "CampaignRunStatus" NOT NULL DEFAULT 'Draft',
    "campaignChannel" "CampaignChannel",
    "category" TEXT,
    "serviceType" TEXT,
    "templateId" UUID,
    "emailProvider" "EmailProvider",
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignLead" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "leadId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "contactName" TEXT,
    "company" TEXT,
    "status" "CampaignLeadStatus" NOT NULL DEFAULT 'Pending',
    "replyType" "ReplyType" NOT NULL DEFAULT 'None',
    "sentAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "repliedAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "CampaignLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignLog" (
    "id" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "leadId" UUID,
    "event" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "providerResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Company_organizationId_code_key" ON "Company"("organizationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_companyId_code_key" ON "Branch"("companyId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Department_branchId_code_key" ON "Department"("branchId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Role_organizationId_name_key" ON "Role"("organizationId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_slug_key" ON "Permission"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_email_key" ON "User"("organizationId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "Lead_organizationId_status_idx" ON "Lead"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Lead_organizationId_assignedToId_idx" ON "Lead"("organizationId", "assignedToId");

-- CreateIndex
CREATE INDEX "Lead_organizationId_qualification_idx" ON "Lead"("organizationId", "qualification");

-- CreateIndex
CREATE INDEX "Lead_organizationId_score_idx" ON "Lead"("organizationId", "score");

-- CreateIndex
CREATE INDEX "Lead_organizationId_deletedAt_idx" ON "Lead"("organizationId", "deletedAt");

-- CreateIndex
CREATE INDEX "Lead_organizationId_source_idx" ON "Lead"("organizationId", "source");

-- CreateIndex
CREATE INDEX "Lead_organizationId_isConverted_idx" ON "Lead"("organizationId", "isConverted");

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_idx" ON "LeadActivity"("leadId");

-- CreateIndex
CREATE INDEX "LeadActivity_organizationId_leadId_idx" ON "LeadActivity"("organizationId", "leadId");

-- CreateIndex
CREATE INDEX "LeadActivity_organizationId_activityType_idx" ON "LeadActivity"("organizationId", "activityType");

-- CreateIndex
CREATE INDEX "LeadNote_leadId_deletedAt_idx" ON "LeadNote"("leadId", "deletedAt");

-- CreateIndex
CREATE INDEX "LeadNote_leadId_isPinned_idx" ON "LeadNote"("leadId", "isPinned");

-- CreateIndex
CREATE INDEX "LeadDocument_leadId_deletedAt_idx" ON "LeadDocument"("leadId", "deletedAt");

-- CreateIndex
CREATE INDEX "LeadDocument_leadId_category_idx" ON "LeadDocument"("leadId", "category");

-- CreateIndex
CREATE INDEX "LeadFollowUp_leadId_idx" ON "LeadFollowUp"("leadId");

-- CreateIndex
CREATE INDEX "LeadFollowUp_organizationId_status_idx" ON "LeadFollowUp"("organizationId", "status");

-- CreateIndex
CREATE INDEX "LeadFollowUp_organizationId_ownerId_dueAt_idx" ON "LeadFollowUp"("organizationId", "ownerId", "dueAt");

-- CreateIndex
CREATE INDEX "LeadMeeting_leadId_idx" ON "LeadMeeting"("leadId");

-- CreateIndex
CREATE INDEX "LeadMeeting_organizationId_status_idx" ON "LeadMeeting"("organizationId", "status");

-- CreateIndex
CREATE INDEX "LeadMeeting_organizationId_organizerId_idx" ON "LeadMeeting"("organizationId", "organizerId");

-- CreateIndex
CREATE INDEX "LeadAssignmentHistory_leadId_idx" ON "LeadAssignmentHistory"("leadId");

-- CreateIndex
CREATE INDEX "LeadAssignmentHistory_organizationId_assignedToId_idx" ON "LeadAssignmentHistory"("organizationId", "assignedToId");

-- CreateIndex
CREATE INDEX "LeadConversion_leadId_idx" ON "LeadConversion"("leadId");

-- CreateIndex
CREATE INDEX "LeadConversion_organizationId_conversionType_idx" ON "LeadConversion"("organizationId", "conversionType");

-- CreateIndex
CREATE INDEX "LeadExportJob_organizationId_requestedById_idx" ON "LeadExportJob"("organizationId", "requestedById");

-- CreateIndex
CREATE INDEX "LeadExportJob_organizationId_status_idx" ON "LeadExportJob"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Prospect_organizationId_qualificationStatus_idx" ON "Prospect"("organizationId", "qualificationStatus");

-- CreateIndex
CREATE INDEX "Prospect_organizationId_isConvertedToLead_idx" ON "Prospect"("organizationId", "isConvertedToLead");

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_organizationId_email_key" ON "Prospect"("organizationId", "email");

-- CreateIndex
CREATE INDEX "ImportJob_organizationId_status_idx" ON "ImportJob"("organizationId", "status");

-- CreateIndex
CREATE INDEX "EmailTemplate_organizationId_idx" ON "EmailTemplate"("organizationId");

-- CreateIndex
CREATE INDEX "EmailCampaign_organizationId_status_idx" ON "EmailCampaign"("organizationId", "status");

-- CreateIndex
CREATE INDEX "EmailActivity_prospectId_type_idx" ON "EmailActivity"("prospectId", "type");

-- CreateIndex
CREATE INDEX "EmailActivity_organizationId_campaignId_idx" ON "EmailActivity"("organizationId", "campaignId");

-- CreateIndex
CREATE INDEX "AiAnalysis_prospectId_idx" ON "AiAnalysis"("prospectId");

-- CreateIndex
CREATE INDEX "Attendance_organizationId_date_idx" ON "Attendance"("organizationId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_date_key" ON "Attendance"("userId", "date");

-- CreateIndex
CREATE INDEX "Visit_organizationId_userId_idx" ON "Visit"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "Visit_leadId_idx" ON "Visit"("leadId");

-- CreateIndex
CREATE INDEX "Expense_organizationId_userId_idx" ON "Expense"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyActivityReport_userId_date_key" ON "DailyActivityReport"("userId", "date");

-- CreateIndex
CREATE INDEX "Target_organizationId_metric_period_idx" ON "Target"("organizationId", "metric", "period");

-- CreateIndex
CREATE INDEX "Notification_organizationId_userId_idx" ON "Notification"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTemplate_name_key" ON "NotificationTemplate"("name");

-- CreateIndex
CREATE INDEX "Task_organizationId_userId_idx" ON "Task"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "BeatPlan_organizationId_userId_idx" ON "BeatPlan"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "CalendarEvent_organizationId_userId_idx" ON "CalendarEvent"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "WorkflowSettings_organizationId_idx" ON "WorkflowSettings"("organizationId");

-- CreateIndex
CREATE INDEX "NotificationPreference_organizationId_userId_idx" ON "NotificationPreference"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessRuleConfig_organizationId_ruleKey_key" ON "BusinessRuleConfig"("organizationId", "ruleKey");

-- CreateIndex
CREATE INDEX "Campaign_organizationId_status_idx" ON "Campaign"("organizationId", "status");

-- CreateIndex
CREATE INDEX "CampaignLead_campaignId_status_idx" ON "CampaignLead"("campaignId", "status");

-- CreateIndex
CREATE INDEX "CampaignLead_leadId_idx" ON "CampaignLead"("leadId");

-- CreateIndex
CREATE INDEX "CampaignLog_campaignId_idx" ON "CampaignLog"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignLog_leadId_idx" ON "CampaignLog"("leadId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Territory" ADD CONSTRAINT "Territory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Territory" ADD CONSTRAINT "Territory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_parentRoleId_fkey" FOREIGN KEY ("parentRoleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordHistory" ADD CONSTRAINT "PasswordHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_territoryId_fkey" FOREIGN KEY ("territoryId") REFERENCES "Territory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadDocument" ADD CONSTRAINT "LeadDocument_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadDocument" ADD CONSTRAINT "LeadDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadDocument" ADD CONSTRAINT "LeadDocument_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LeadDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadFollowUp" ADD CONSTRAINT "LeadFollowUp_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadFollowUp" ADD CONSTRAINT "LeadFollowUp_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadMeeting" ADD CONSTRAINT "LeadMeeting_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadMeeting" ADD CONSTRAINT "LeadMeeting_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadAssignmentHistory" ADD CONSTRAINT "LeadAssignmentHistory_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadAssignmentHistory" ADD CONSTRAINT "LeadAssignmentHistory_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadConversion" ADD CONSTRAINT "LeadConversion_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadConversion" ADD CONSTRAINT "LeadConversion_convertedById_fkey" FOREIGN KEY ("convertedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "ImportJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EmailTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignProspect" ADD CONSTRAINT "CampaignProspect_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignProspect" ADD CONSTRAINT "CampaignProspect_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailActivity" ADD CONSTRAINT "EmailActivity_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailActivity" ADD CONSTRAINT "EmailActivity_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "EmailCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailActivity" ADD CONSTRAINT "EmailActivity_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_emailActivityId_fkey" FOREIGN KEY ("emailActivityId") REFERENCES "EmailActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivityReport" ADD CONSTRAINT "DailyActivityReport_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyActivityReport" ADD CONSTRAINT "DailyActivityReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTemplate" ADD CONSTRAINT "NotificationTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatPlan" ADD CONSTRAINT "BeatPlan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeatPlan" ADD CONSTRAINT "BeatPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarEvent" ADD CONSTRAINT "CalendarEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowSettings" ADD CONSTRAINT "WorkflowSettings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessRuleConfig" ADD CONSTRAINT "BusinessRuleConfig_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLead" ADD CONSTRAINT "CampaignLead_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLead" ADD CONSTRAINT "CampaignLead_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLog" ADD CONSTRAINT "CampaignLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignLog" ADD CONSTRAINT "CampaignLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "CampaignLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
