# CRM Integration Module - Enterprise Modular Monolith

## Overview
The CRM Integration module provides seamless integration with popular CRM systems including Salesforce, HubSpot, Pipedrive, Zoho CRM, Microsoft Dynamics 365, and Freshworks CRM.

## Features
- **Multi-CRM Support**: Supports 6+ major CRM platforms
- **Real-time Sync**: Bidirectional data synchronization
- **Webhook Integration**: Real-time event processing
- **Field Mapping**: Flexible field mapping system
- **Audit Trails**: Complete integration activity logging
- **Error Handling**: Robust error handling and retry mechanisms

## Module Structure

```
crm-integration/
├── controllers/
│   └── CRMController.js           # HTTP request handlers
├── services/
│   ├── CRMService.js              # Main business logic
│   ├── CRMAPIClient.js            # CRM API communication
│   ├── WebhookService.js          # Webhook processing
│   ├── SyncService.js             # Data synchronization
│   └── MappingService.js          # Field mapping logic
├── repositories/
│   └── CRMRepository.js           # Database operations
├── routes/
│   └── crm.routes.js              # Route definitions
├── validators/
│   └── crm.validation.js          # Input validation schemas
├── constants/
│   └── crm.constants.js           # Module constants
├── permissions/
│   └── crm.permissions.js         # Permission definitions
├── dto/
│   └── crm.dto.js                 # Data transfer objects
├── helpers/
│   └── crm.helpers.js             # Utility functions
├── middleware/
│   └── crm.middleware.js          # Custom middleware
├── events/
│   └── crm.events.js              # Event system
├── tests/
│   └── crm.test.js                # Test suite
├── index.js                       # Main module exports
├── export.js                      # External API exports
└── README.md                      # This file
```

## API Endpoints

### Configuration
- `POST /api/v1/crm/configure` - Configure CRM integration
- `POST /api/v1/crm/test-connection` - Test CRM connection
- `GET /api/v1/crm/status` - Get integration status

### Synchronization
- `POST /api/v1/crm/sync` - Initiate data sync
- `GET /api/v1/crm/sync/status` - Get sync status
- `GET /api/v1/crm/sync/logs` - Get sync logs

### Field Mappings
- `GET /api/v1/crm/mappings` - Get field mappings
- `PUT /api/v1/crm/mappings` - Update field mappings

### Integration Control
- `POST /api/v1/crm/toggle` - Pause/resume integration
- `POST /api/v1/crm/webhook/{crmType}` - Webhook endpoint

## Supported CRM Systems

| CRM System | Authentication | Sync Types | Webhooks |
|------------|---------------|------------|----------|
| Salesforce | OAuth2 | Full, Incremental | ✓ |
| HubSpot | API Key | Full, Incremental | ✓ |
| Pipedrive | API Token | Full, Incremental | ✓ |
| Zoho CRM | OAuth2 | Full, Incremental | ✓ |
| Dynamics 365 | OAuth2 | Full, Incremental | ✓ |
| Freshworks | API Key | Full, Incremental | ✓ |

## Configuration Example

```javascript
{
  "crmType": "salesforce",
  "apiUrl": "https://instance.salesforce.com",
  "apiKey": "your-api-key",
  "enableWebhooks": true,
  "syncSchedule": "0 */6 * * *",
  "settings": {
    "batchSize": 100,
    "retryAttempts": 3,
    "timeoutMs": 30000
  }
}
```

## Field Mapping Example

```javascript
{
  "leadMappings": {
    "firstName": "FirstName",
    "lastName": "LastName", 
    "email": "Email",
    "company": "Company",
    "phone": "Phone"
  },
  "contactMappings": {
    "firstName": "FirstName",
    "lastName": "LastName",
    "email": "Email"
  }
}
```

## Events

The module emits various events for integration monitoring:

- `configuration.updated` - CRM configuration changed
- `sync.started` - Synchronization began
- `sync.completed` - Synchronization finished
- `sync.failed` - Synchronization failed
- `webhook.received` - Webhook event received
- `api.error` - API communication error

## Error Handling

The module includes comprehensive error handling:

- **Authentication Errors**: Invalid credentials, expired tokens
- **Rate Limiting**: API quota exceeded handling
- **Network Errors**: Connection timeouts, network failures
- **Validation Errors**: Invalid data format detection
- **CRM-Specific Errors**: Platform-specific error parsing

## Security Features

- **Webhook Signature Verification**: Validates incoming webhooks
- **Credential Encryption**: Secure storage of API keys
- **Rate Limiting**: Prevents API abuse
- **Audit Logging**: Complete activity tracking
- **Permission-Based Access**: Role-based access control

## Dependencies

- `axios` - HTTP client for API calls
- `crypto` - Webhook signature verification
- `zod` - Input validation
- `prisma` - Database operations

## Usage

```javascript
import { CRMService, CRM_CONSTANTS } from './modules/crm-integration/index.js';

// Initialize service
const crmService = new CRMService(/* dependencies */);

// Configure CRM
await crmService.configure({
  crmType: 'salesforce',
  apiUrl: 'https://instance.salesforce.com',
  apiKey: 'your-api-key'
}, user);

// Initiate sync
await crmService.initiateSync('FULL', user);
```

## Testing

Run the test suite:

```javascript
import { CRMTestRunner } from './tests/crm.test.js';

// Run all tests
await CRMTestRunner.runAllTests();

// Run specific suite
await CRMTestRunner.runSuite('testCRMConfiguration');
```

## Future Enhancements

- Additional CRM platform support
- Advanced field transformation rules
- Real-time sync monitoring dashboard
- Bulk data import/export tools
- Custom webhook endpoints
- Integration analytics and reporting