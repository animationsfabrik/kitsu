import client from './client'

export default {

  getContacts (callback) {
    client.get('/api/data/contacts', callback)
  },

  getContact (contactId, callback) {
    client.get(`/api/data/contacts/${contactId}`, callback)
  },

  newContact (contact, callback) {
    const data = {
      first_name: contact.first_name,
      last_name: contact.last_name,
      company: contact.company,
      address: contact.address,
      email: contact.email.trim(),
      phone: contact.phone,
      mobile: contact.mobile,
      role: contact.role
    }
    client.post(`/api/data/contacts/new`, data, callback)
  },

  updateContact (contact, callback) {
    const data = {
      first_name: contact.first_name,
      last_name: contact.last_name,
      company: contact.company,
      address: contact.address,
      email: contact.email.trim(),
      phone: contact.phone,
      mobile: contact.mobile,
      role: contact.role
    }
    client.put(`/api/data/contacts/${contact.id}`, data, callback)
  },

  updateSevdeskContacts (token, callback) {
    client.post(`/api/data/contacts/update-sevdesk?token=` + token, '', callback)
  },

  deleteContact (contactId, callback) {
    client.del(`/api/data/contacts/${contactId}`, callback)
  }
}
