/**
 * CRM API Client - Enterprise Modular Monolith
 * Handles direct communication with various CRM systems
 */

import axios from 'axios';
import { AppError } from '../../../shared/response.js';
import { CRM_CONSTANTS } from '../constants/crm.constants.js';

export class CRMAPIClient {
  constructor() {
    this.clients = new Map();
  }

  /**
   * Get or create HTTP client for specific CRM
   */
  getClient(config) {
    const clientKey = `${config.organizationId}-${config.crmType}`;
    
    if (!this.clients.has(clientKey)) {
      const client = axios.create({
        baseURL: config.apiUrl,
        timeout: CRM_CONSTANTS.API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(config),
        },
      });

      // Add request interceptor
      client.interceptors.request.use(
        (request) => {
          console.log(`CRM API Request: ${request.method?.toUpperCase()} ${request.url}`);
          return request;
        },
        (error) => Promise.reject(error)
      );

      // Add response interceptor
      client.interceptors.response.use(
        (response) => response,
        (error) => {
          console.error('CRM API Error:', error.response?.data || error.message);
          return Promise.reject(this.handleAPIError(error));
        }
      );

      this.clients.set(clientKey, client);
    }

    return this.clients.get(clientKey);
  }

  /**
   * Test connection to CRM
   */
  async testConnection(config) {
    try {
      const client = this.getClient(config);
      const endpoint = this.getTestEndpoint(config.crmType);
      
      const response = await client.get(endpoint);
      
      return {
        success: true,
        message: 'Connection successful',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.response?.data,
      };
    }
  }

  /**
   * Fetch leads from CRM
   */
  async fetchLeads(config, options = {}) {
    const client = this.getClient(config);
    const endpoint = this.getLeadsEndpoint(config.crmType);
    
    const params = {
      limit: options.limit || 100,
      offset: options.offset || 0,
      ...this.buildCRMSpecificParams(config.crmType, options),
    };

    const response = await client.get(endpoint, { params });
    return this.transformLeadsResponse(config.crmType, response.data);
  }

  /**
   * Create lead in CRM
   */
  async createLead(config, leadData) {
    const client = this.getClient(config);
    const endpoint = this.getLeadsEndpoint(config.crmType);
    
    const transformedData = this.transformLeadData(config.crmType, leadData);
    const response = await client.post(endpoint, transformedData);
    
    return this.transformLeadResponse(config.crmType, response.data);
  }

  /**
   * Update lead in CRM
   */
  async updateLead(config, leadId, leadData) {
    const client = this.getClient(config);
    const endpoint = `${this.getLeadsEndpoint(config.crmType)}/${leadId}`;
    
    const transformedData = this.transformLeadData(config.crmType, leadData);
    const response = await client.put(endpoint, transformedData);
    
    return this.transformLeadResponse(config.crmType, response.data);
  }

  /**
   * Delete lead in CRM
   */
  async deleteLead(config, leadId) {
    const client = this.getClient(config);
    const endpoint = `${this.getLeadsEndpoint(config.crmType)}/${leadId}`;
    
    await client.delete(endpoint);
    return { success: true };
  }

  /**
   * Fetch contacts from CRM
   */
  async fetchContacts(config, options = {}) {
    const client = this.getClient(config);
    const endpoint = this.getContactsEndpoint(config.crmType);
    
    const params = {
      limit: options.limit || 100,
      offset: options.offset || 0,
      ...this.buildCRMSpecificParams(config.crmType, options),
    };

    const response = await client.get(endpoint, { params });
    return this.transformContactsResponse(config.crmType, response.data);
  }

  /**
   * Fetch opportunities from CRM
   */
  async fetchOpportunities(config, options = {}) {
    const client = this.getClient(config);
    const endpoint = this.getOpportunitiesEndpoint(config.crmType);
    
    const params = {
      limit: options.limit || 100,
      offset: options.offset || 0,
      ...this.buildCRMSpecificParams(config.crmType, options),
    };

    const response = await client.get(endpoint, { params });
    return this.transformOpportunitiesResponse(config.crmType, response.data);
  }

  // Private helper methods
  getAuthHeaders(config) {
    switch (config.crmType) {
      case 'salesforce':
        return {
          'Authorization': `Bearer ${config.accessToken}`,
        };
      case 'hubspot':
        return {
          'Authorization': `Bearer ${config.apiKey}`,
        };
      case 'pipedrive':
        return {
          'Authorization': `Bearer ${config.apiKey}`,
        };
      default:
        return {
          'Authorization': `Bearer ${config.apiKey}`,
        };
    }
  }

  getTestEndpoint(crmType) {
    const endpoints = {
      salesforce: '/services/data/v52.0/',
      hubspot: '/crm/v3/objects/contacts',
      pipedrive: '/v1/users/me',
      zoho: '/crm/v2/users',
    };
    
    return endpoints[crmType] || '/api/test';
  }

  getLeadsEndpoint(crmType) {
    const endpoints = {
      salesforce: '/services/data/v52.0/sobjects/Lead',
      hubspot: '/crm/v3/objects/contacts',
      pipedrive: '/v1/leads',
      zoho: '/crm/v2/Leads',
    };
    
    return endpoints[crmType] || '/api/leads';
  }

  getContactsEndpoint(crmType) {
    const endpoints = {
      salesforce: '/services/data/v52.0/sobjects/Contact',
      hubspot: '/crm/v3/objects/contacts',
      pipedrive: '/v1/persons',
      zoho: '/crm/v2/Contacts',
    };
    
    return endpoints[crmType] || '/api/contacts';
  }

  getOpportunitiesEndpoint(crmType) {
    const endpoints = {
      salesforce: '/services/data/v52.0/sobjects/Opportunity',
      hubspot: '/crm/v3/objects/deals',
      pipedrive: '/v1/deals',
      zoho: '/crm/v2/Deals',
    };
    
    return endpoints[crmType] || '/api/opportunities';
  }

  buildCRMSpecificParams(crmType, options) {
    switch (crmType) {
      case 'salesforce':
        return {
          q: options.query || "SELECT Id, FirstName, LastName, Email FROM Lead",
        };
      case 'hubspot':
        return {
          properties: options.properties || 'firstname,lastname,email',
        };
      default:
        return {};
    }
  }

  transformLeadsResponse(crmType, data) {
    // Transform CRM-specific response format to standardized format
    switch (crmType) {
      case 'salesforce':
        return data.records?.map(record => ({
          id: record.Id,
          firstName: record.FirstName,
          lastName: record.LastName,
          email: record.Email,
          company: record.Company,
          // ... other fields
        })) || [];
      case 'hubspot':
        return data.results?.map(contact => ({
          id: contact.id,
          firstName: contact.properties?.firstname,
          lastName: contact.properties?.lastname,
          email: contact.properties?.email,
          company: contact.properties?.company,
          // ... other fields
        })) || [];
      default:
        return data;
    }
  }

  transformContactsResponse(crmType, data) {
    // Similar transformation for contacts
    return this.transformLeadsResponse(crmType, data);
  }

  transformOpportunitiesResponse(crmType, data) {
    // Transform opportunities response
    switch (crmType) {
      case 'salesforce':
        return data.records?.map(record => ({
          id: record.Id,
          name: record.Name,
          amount: record.Amount,
          stage: record.StageName,
          // ... other fields
        })) || [];
      default:
        return data;
    }
  }

  transformLeadData(crmType, leadData) {
    // Transform our format to CRM-specific format
    switch (crmType) {
      case 'salesforce':
        return {
          FirstName: leadData.firstName,
          LastName: leadData.lastName,
          Email: leadData.email,
          Company: leadData.company,
          // ... other mappings
        };
      case 'hubspot':
        return {
          properties: {
            firstname: leadData.firstName,
            lastname: leadData.lastName,
            email: leadData.email,
            company: leadData.company,
            // ... other mappings
          },
        };
      default:
        return leadData;
    }
  }

  transformLeadResponse(crmType, data) {
    // Transform CRM response back to our format
    return data;
  }

  handleAPIError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 401:
          return AppError.unauthorized('CRM authentication failed');
        case 403:
          return AppError.forbidden('Insufficient CRM permissions');
        case 404:
          return AppError.notFound('CRM resource not found');
        case 429:
          return AppError.badRequest('CRM API rate limit exceeded');
        default:
          return AppError.internal(`CRM API error: ${message}`);
      }
    }
    
    return AppError.internal(`CRM connection error: ${error.message}`);
  }
}