/**
 * CRM Mapping Service - Enterprise Modular Monolith
 */

import { AppError } from '../../../shared/response.js';
import { CRM_CONSTANTS } from '../constants/crm.constants.js';
import { validateFieldMapping } from '../validators/crm.validation.js';

export class MappingService {
  constructor(crmRepository) {
    this.crmRepository = crmRepository;
  }

  /**
   * Get field mappings for organization
   */
  async getMappings(organizationId) {
    const mappings = await this.crmRepository.getMappings(organizationId);
    
    // If no custom mappings exist, return default mappings
    if (!mappings || Object.keys(mappings).length === 0) {
      const config = await this.crmRepository.getConfiguration(organizationId);
      if (config && config.crmType) {
        return this.getDefaultMappings(config.crmType);
      }
    }

    return mappings;
  }

  /**
   * Update field mappings
   */
  async updateMappings(organizationId, mappingsData) {
    // Get CRM configuration to validate mappings
    const config = await this.crmRepository.getConfiguration(organizationId);
    if (!config) {
      throw AppError.notFound('CRM configuration not found');
    }

    // Validate mappings structure
    await this.validateMappings(mappingsData);

    // Validate each entity mapping
    for (const [entityType, mapping] of Object.entries(mappingsData)) {
      if (mapping && typeof mapping === 'object') {
        validateFieldMapping(config.crmType, entityType, mapping);
      }
    }

    // Save mappings
    const result = await this.crmRepository.saveMappings(organizationId, mappingsData);
    
    return result;
  }

  /**
   * Get default mappings for CRM type
   */
  getDefaultMappings(crmType) {
    return CRM_CONSTANTS.DEFAULT_MAPPINGS[crmType] || {
      lead: this.getGenericLeadMapping(),
      contact: this.getGenericContactMapping(),
      opportunity: this.getGenericOpportunityMapping(),
    };
  }

  /**
   * Transform data using mappings
   */
  async transformDataToSFA(organizationId, entityType, crmData) {
    const mappings = await this.getMappings(organizationId);
    const entityMappings = mappings[`${entityType}Mappings`] || mappings[entityType];

    if (!entityMappings) {
      throw AppError.badRequest(`No mappings found for entity type: ${entityType}`);
    }

    const transformedData = {};

    // Transform each field according to mappings
    for (const [sfaField, crmField] of Object.entries(entityMappings)) {
      if (crmData[crmField] !== undefined) {
        transformedData[sfaField] = this.transformFieldValue(
          crmData[crmField], 
          sfaField, 
          entityType
        );
      }
    }

    return transformedData;
  }

  /**
   * Transform SFA data to CRM format
   */
  async transformDataToCRM(organizationId, entityType, sfaData) {
    const mappings = await this.getMappings(organizationId);
    const entityMappings = mappings[`${entityType}Mappings`] || mappings[entityType];

    if (!entityMappings) {
      throw AppError.badRequest(`No mappings found for entity type: ${entityType}`);
    }

    const transformedData = {};

    // Reverse transform each field
    for (const [sfaField, crmField] of Object.entries(entityMappings)) {
      if (sfaData[sfaField] !== undefined) {
        transformedData[crmField] = this.transformFieldValue(
          sfaData[sfaField], 
          crmField, 
          entityType
        );
      }
    }

    return transformedData;
  }

  /**
   * Validate field mappings
   */
  async validateMappings(mappingsData) {
    if (!mappingsData || typeof mappingsData !== 'object') {
      throw AppError.badRequest('Mappings data must be an object');
    }

    const allowedEntityTypes = ['lead', 'contact', 'opportunity', 'leadMappings', 'contactMappings', 'opportunityMappings'];
    
    for (const entityType of Object.keys(mappingsData)) {
      if (!allowedEntityTypes.includes(entityType)) {
        throw AppError.badRequest(`Invalid entity type: ${entityType}`);
      }

      const mapping = mappingsData[entityType];
      if (mapping && typeof mapping !== 'object') {
        throw AppError.badRequest(`Mapping for ${entityType} must be an object`);
      }
    }

    return true;
  }

  /**
   * Get field mapping suggestions based on CRM type
   */
  async getMappingSuggestions(organizationId, crmType) {
    const suggestions = {
      lead: this.getLeadFieldSuggestions(crmType),
      contact: this.getContactFieldSuggestions(crmType),
      opportunity: this.getOpportunityFieldSuggestions(crmType),
    };

    return suggestions;
  }

  /**
   * Auto-generate mappings based on field names
   */
  async autoGenerateMappings(organizationId, crmType, crmFields) {
    const autoMappings = {};

    // Lead field auto-mapping
    if (crmFields.leads) {
      autoMappings.leadMappings = this.autoMapFields(
        this.getGenericLeadMapping(),
        crmFields.leads,
        crmType
      );
    }

    // Contact field auto-mapping
    if (crmFields.contacts) {
      autoMappings.contactMappings = this.autoMapFields(
        this.getGenericContactMapping(),
        crmFields.contacts,
        crmType
      );
    }

    // Opportunity field auto-mapping
    if (crmFields.opportunities) {
      autoMappings.opportunityMappings = this.autoMapFields(
        this.getGenericOpportunityMapping(),
        crmFields.opportunities,
        crmType
      );
    }

    return autoMappings;
  }

  // Private helper methods
  getGenericLeadMapping() {
    return {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      phone: 'phone',
      company: 'company',
      jobTitle: 'jobTitle',
      status: 'status',
      source: 'source',
    };
  }

  getGenericContactMapping() {
    return {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      phone: 'phone',
      company: 'company',
      jobTitle: 'jobTitle',
    };
  }

  getGenericOpportunityMapping() {
    return {
      name: 'name',
      amount: 'amount',
      stage: 'stage',
      probability: 'probability',
      expectedCloseDate: 'expectedCloseDate',
    };
  }

  transformFieldValue(value, fieldName, entityType) {
    // Handle specific field transformations
    if (fieldName === 'phone' && value) {
      return this.normalizePhoneNumber(value);
    }

    if (fieldName === 'email' && value) {
      return value.toLowerCase().trim();
    }

    if (fieldName === 'amount' && value) {
      return parseFloat(value) || 0;
    }

    if (fieldName.includes('Date') && value) {
      return new Date(value);
    }

    return value;
  }

  normalizePhoneNumber(phone) {
    // Remove all non-numeric characters except +
    return phone.replace(/[^\d+]/g, '');
  }

  getLeadFieldSuggestions(crmType) {
    const commonFields = {
      firstName: ['FirstName', 'first_name', 'fname', 'givenName'],
      lastName: ['LastName', 'last_name', 'lname', 'surname', 'familyName'],
      email: ['Email', 'email_address', 'emailAddress', 'mail'],
      phone: ['Phone', 'phone_number', 'phoneNumber', 'mobile'],
      company: ['Company', 'company_name', 'companyName', 'account'],
      jobTitle: ['Title', 'job_title', 'jobTitle', 'position'],
    };

    // Add CRM-specific suggestions
    if (crmType === 'salesforce') {
      return {
        ...commonFields,
        status: ['Status', 'LeadStatus'],
        source: ['LeadSource'],
      };
    }

    return commonFields;
  }

  getContactFieldSuggestions(crmType) {
    return this.getLeadFieldSuggestions(crmType);
  }

  getOpportunityFieldSuggestions(crmType) {
    const commonFields = {
      name: ['Name', 'title', 'deal_name', 'dealName'],
      amount: ['Amount', 'value', 'deal_value', 'dealValue'],
      stage: ['Stage', 'StageName', 'deal_stage', 'dealStage'],
      probability: ['Probability', 'win_probability', 'winProbability'],
    };

    if (crmType === 'salesforce') {
      return {
        ...commonFields,
        expectedCloseDate: ['CloseDate'],
      };
    }

    return commonFields;
  }

  autoMapFields(genericMapping, crmFields, crmType) {
    const autoMapping = {};
    const suggestions = this.getLeadFieldSuggestions(crmType);

    for (const [sfaField, defaultCrmField] of Object.entries(genericMapping)) {
      // First try exact match
      if (crmFields.includes(defaultCrmField)) {
        autoMapping[sfaField] = defaultCrmField;
        continue;
      }

      // Try suggestions
      const fieldSuggestions = suggestions[sfaField] || [];
      const matchedField = fieldSuggestions.find(suggestion => 
        crmFields.includes(suggestion)
      );

      if (matchedField) {
        autoMapping[sfaField] = matchedField;
      }
    }

    return autoMapping;
  }
}