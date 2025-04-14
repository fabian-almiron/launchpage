import axios from 'axios';

// GoDaddy API client with placeholders for API credentials
class GoDaddyService {
  constructor() {
    this.apiKey = process.env.GODADDY_API_KEY || 'your-api-key-placeholder';
    this.apiSecret = process.env.GODADDY_API_SECRET || 'your-api-secret-placeholder';
    this.baseUrl = 'https://api.godaddy.com/v1';
  }

  // Get headers with authentication
  getHeaders() {
    return {
      Authorization: `sso-key ${this.apiKey}:${this.apiSecret}`,
      'Content-Type': 'application/json'
    };
  }

  // List domains from the GoDaddy account
  async listDomains() {
    try {
      const response = await axios.get(`${this.baseUrl}/domains`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error listing domains:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get domain details by domain name
  async getDomain(domain) {
    try {
      const response = await axios.get(`${this.baseUrl}/domains/${domain}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error getting domain details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Purchase a new domain (optional)
  async purchaseDomain(domain, contactInfo) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/domains/purchase`,
        {
          domain,
          consent: {
            agreementKeys: ['DNRA'],
            agreedBy: contactInfo.email,
            agreedAt: new Date().toISOString()
          },
          contactAdmin: contactInfo,
          contactBilling: contactInfo,
          contactRegistrant: contactInfo,
          contactTech: contactInfo,
          period: 1
        },
        {
          headers: this.getHeaders()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error purchasing domain:', error.response?.data || error.message);
      throw error;
    }
  }

  // Add DNS record to a domain
  async addDnsRecord(domain, recordType, name, value, ttl = 3600) {
    try {
      // Format DNS record payload based on type
      const records = [
        {
          type: recordType,
          name: name === '@' ? '@' : name,
          data: value,
          ttl
        }
      ];

      // If record is a CNAME and has @ as name, we need to make an A record instead
      if (recordType === 'CNAME' && name === '@') {
        records[0].type = 'A';
      }

      const response = await axios.patch(
        `${this.baseUrl}/domains/${domain}/records`,
        records,
        {
          headers: this.getHeaders()
        }
      );
      return { success: true, domain };
    } catch (error) {
      console.error('Error adding DNS record:', error.response?.data || error.message);
      throw error;
    }
  }

  // Check if domain is available for purchase
  async checkDomainAvailability(domain) {
    try {
      const response = await axios.get(`${this.baseUrl}/domains/available?domain=${domain}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error checking domain availability:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new GoDaddyService(); 