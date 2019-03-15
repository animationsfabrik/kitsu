import contactsApi from '../api/contacts'
import colors from '../../lib/colors'
import { sortPeople } from '../../lib/sorting'
import {
  indexSearch,
  buildContactsIndex
} from '../../lib/indexing'
import {
  getKeyWords
} from '../../lib/filtering'
import {
  LOAD_CONTACTS_START,
  LOAD_CONTACTS_ERROR,
  LOAD_CONTACTS_END,

  EDIT_CONTACTS_START,
  EDIT_CONTACTS_ERROR,
  EDIT_CONTACTS_END,
  SHOW_EDIT_CONTACTS_MODAL,
  HIDE_EDIT_CONTACTS_MODAL,

  NEW_CONTACTS_END,
  CONTACTS_SEARCH_CHANGE,

  DELETE_CONTACTS_START,
  DELETE_CONTACTS_ERROR,
  DELETE_CONTACTS_END,
  SHOW_DELETE_CONTACTS_MODAL,
  HIDE_DELETE_CONTACTS_MODAL,
  SHOW_UPDATE_SEVDESK_CONTACTS_MODAL,
  HIDE_UPDATE_SEVDESK_CONTACTS_MODAL,
  UPDATE_SEVDESK_CONTACTS_START,
  UPDATE_SEVDESK_CONTACTS_END,
  UPDATE_SEVDESK_CONTACTS_ERROR,

  RESET_ALL
} from '../mutation-types'

const helpers = {
  addAdditionalInformation (contact) {
    if (contact) {
      if (contact.first_name && contact.last_name) {
        contact.name = `${contact.first_name} ${contact.last_name}`
        contact.initials = `${contact.first_name[0]}${contact.last_name[0]}`
      } else if (contact.first_name) {
        contact.name = contact.first_name
        contact.initials = contact.first_name[0]
      } else if (contact.last_name) {
        contact.name = contact.last_name
        contact.initials = contact.last_name[0]
      } else if (contact.email) {
        contact.name = contact.email
        contact.initials = contact.email[0]
      } else {
        contact.initials = 'NN'
      }

      contact.initials = contact.initials.toUpperCase()
      contact.color = colors.fromString(contact.name)
    }
    return contact
  }

}

const initialState = {
  contacts: [],
  displayedContacts: [],
  contactsIndex: {},
  contactMap: {},
  isContactsLoading: false,
  isContactsLoadingError: true,

  isEditContactsModalShown: false,
  isEditContactsLoading: false,
  isEditContactsLoadingError: false,
  contactToEdit: {
    role: 'user'
  },

  isDeleteContactsModalShown: false,
  isDeleteContactsLoading: false,
  isDeleteContactsLoadingError: false,
  contactToDelete: undefined,

  isUpdateSevdeskContactsModalShown: false,
  isUpdateSevdeskContactsLoadingError: false,
  isUpdateSevdeskContactsLoading: false,

  contact: {}
}

const state = {
  ...initialState
}

const getters = {
  contacts: state => state.contacts,
  displayedContacts: state => state.displayedContacts,
  contactsIndex: state => state.contactsIndex,
  contactMap: state => state.contactMap,
  isContactsLoading: state => state.isContactsLoading,
  isContactsLoadingError: state => state.isContactsLoadingError,

  isDeleteContactsModalShown: state => state.isDeleteContactsModalShown,
  isDeleteContactsLoading: state => state.isDeleteContactsLoading,
  isDeleteContactsLoadingError: state => state.isDeleteContactsLoadingError,
  contactToDelete: state => state.contactToDelete,

  isEditContactsModalShown: state => state.isEditContactsModalShown,
  isEditContactsLoading: state => state.isEditContactsLoading,
  isEditContactsLoadingError: state => state.isEditContactsLoadingError,
  contactToEdit: state => state.contactToEdit,

  isUpdateSevdeskContactsModalShown: state => state.isUpdateSevdeskContactsModalShown,
  isUpdateSevdeskContactsLoading: state => state.isUpdateSevdeskContactsLoading,
  isUpdateSevdeskContactsLoadingError: state => state.isUpdateSevdeskContactsLoadingError,

  getContact: (state, getters) => (id) => state.contactMap[id],
  getContactOptions: state => state.contacts.map(
    (contact) => {
      return {
        label: `${contact.first_name} ${contact.last_name}`,
        value: contact.id
      }
    }
  )
}

const actions = {

  loadContacts ({ commit, state }, callback) {
    commit(LOAD_CONTACTS_START)
    contactsApi.getContacts((err, contacts) => {
      if (err) {
        commit(LOAD_CONTACTS_ERROR)
      } else {
        commit(LOAD_CONTACTS_END, contacts.map((contact) => {
          return contact
        }))
      }
      if (callback) callback(err)
    })
  },

  loadContact ({ commit, state }, contactId) {
    contactsApi.getContact(contactId, (err, contact) => {
      if (err) console.error(err)
      else if (contact.email) {
        commit(EDIT_CONTACTS_START, contact)
        commit(EDIT_CONTACTS_END, contact)
      }
    })
  },

  newContacts ({ commit, state }, payload) {
    commit(EDIT_CONTACTS_START, payload.data)
    contactsApi.newContact(state.contactToEdit, (err, contact) => {
      if (err) {
        commit(EDIT_CONTACTS_ERROR)
      } else {
        commit(NEW_CONTACTS_END, contact.id)
        commit(EDIT_CONTACTS_END)
        commit(HIDE_EDIT_CONTACTS_MODAL)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  editContacts ({ commit, state }, payload) {
    commit(EDIT_CONTACTS_START, payload.data)
    contactsApi.updateContact(state.contactToEdit, (err, contacts) => {
      if (err) {
        commit(EDIT_CONTACTS_ERROR)
      } else {
        commit(EDIT_CONTACTS_END, state.contactToEdit)
        commit(HIDE_EDIT_CONTACTS_MODAL)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  deleteContacts ({ commit, state }, callback) {
    commit(DELETE_CONTACTS_START)
    contactsApi.deleteContact(state.contactToDelete.id, (err, contacts) => {
      if (err) {
        commit(DELETE_CONTACTS_ERROR)
      } else {
        commit(DELETE_CONTACTS_END, state.contactToDelete)
        commit(HIDE_DELETE_CONTACTS_MODAL)
      }
      if (callback) callback(err)
    })
  },

  updateSevdeskContacts ({ commit, state }, { token, callback }) {
    commit(UPDATE_SEVDESK_CONTACTS_START)
    contactsApi.updateSevdeskContacts(token, (err, contacts) => {
      if (err) {
        commit(UPDATE_SEVDESK_CONTACTS_ERROR)
      }
      commit(UPDATE_SEVDESK_CONTACTS_END)
      if (callback) callback(err)
    })
  },

  showContactEditModal ({ commit, state }, contactId) {
    commit(SHOW_EDIT_CONTACTS_MODAL, contactId)
  },

  hideContactEditModal ({ commit, state }, contactId) {
    commit(HIDE_EDIT_CONTACTS_MODAL, contactId)
  },

  showContactDeleteModal ({ commit, state }, contactId) {
    commit(SHOW_DELETE_CONTACTS_MODAL, contactId)
  },

  hideContactDeleteModal ({ commit, state }, contactId) {
    commit(HIDE_DELETE_CONTACTS_MODAL, contactId)
  },

  showUpdateSevdeskContactsModal ({ commit, state }) {
    commit(SHOW_UPDATE_SEVDESK_CONTACTS_MODAL)
  },

  hideUpdateSevdeskContactsModal ({ commit, state }) {
    commit(HIDE_UPDATE_SEVDESK_CONTACTS_MODAL)
  },

  contactsSearchChange ({ commit }, text) {
    commit(CONTACTS_SEARCH_CHANGE, text)
  }
}

const mutations = {
  [LOAD_CONTACTS_START] (state) {
    state.isContactsLoading = true
    state.isContactsLoadingError = false
    state.contactMap = {}
  },

  [LOAD_CONTACTS_ERROR] (state) {
    state.isContactsLoading = false
    state.isContactsLoadingError = true
  },

  [LOAD_CONTACTS_END] (state, contacts) {
    state.isContactsLoading = false
    state.isContactsLoadingError = false
    state.contacts = sortPeople(contacts)
    state.displayedContacts = state.contacts
    state.contacts.forEach((contact) => {
      contact = helpers.addAdditionalInformation(contact)
      state.contactMap[contact.id] = contact
    })
    state.contactsIndex = buildContactsIndex(state.contacts)
  },

  [DELETE_CONTACTS_START] (state) {
    state.isDeleteContactsLoading = true
    state.isDeleteContactsLoadingError = false
  },

  [DELETE_CONTACTS_END] (state, contact) {
    state.isDeleteContactsLoading = false
    const contactToDeleteIndex = state.contacts.findIndex(
      (p) => p.id === contact.id
    )
    if (contactToDeleteIndex >= 0) {
      state.contacts.splice(contactToDeleteIndex, 1)
    }
    delete state.contactMap[contact.id]
  },

  [DELETE_CONTACTS_ERROR] (state) {
    state.isDeleteContactsLoading = false
    state.isDeleteContactsLoadingError = true
  },

  [SHOW_DELETE_CONTACTS_MODAL] (state, contactId) {
    state.isDeleteContactsModalShown = true
    state.isDeleteContactsLoadingError = false
    state.isDeleteContactsLoading = false
    state.contactToDelete = state.contacts.find(
      (contact) => contact.id === contactId
    )
  },

  [HIDE_DELETE_CONTACTS_MODAL] (state, contactId) {
    state.isDeleteContactsModalShown = false
    state.contactToDelete = undefined
  },

  [SHOW_UPDATE_SEVDESK_CONTACTS_MODAL] (state) {
    state.isUpdateSevdeskContactsModalShown = true
    state.isUpdateSevdeskContactsLoading = false
    state.isUpdateSevdeskContactsLoadingError = false
  },

  [HIDE_UPDATE_SEVDESK_CONTACTS_MODAL] (state) {
    state.isUpdateSevdeskContactsModalShown = false
  },

  [EDIT_CONTACTS_START] (state, data) {
    state.isEditContactsLoading = true
    state.isEditContactsLoadingError = false
    state.contactToEdit = Object.assign(state.contactToEdit, data)
  },

  [NEW_CONTACTS_END] (state, contactId) {
    state.contactToEdit.id = contactId
  },

  [EDIT_CONTACTS_END] (state, form) {
    state.isEditContactsLoading = false
    state.isEditContactsLoadingError = false
    const contactToEditIndex = state.contacts.findIndex(
      (contact) => contact.id === state.contactToEdit.id
    )
    state.contactToEdit = helpers.addAdditionalInformation(state.contactToEdit)
    if (contactToEditIndex >= 0) {
      delete state.contacts[contactToEditIndex]
      state.contactMap[state.contactToEdit.id] = {...state.contactToEdit}
      state.contacts[contactToEditIndex] = state.contactMap[state.contactToEdit.id]
    } else {
      state.contacts = [
        ...state.contacts,
        state.contactToEdit
      ]
      state.contactMap[state.contactToEdit.id] = state.contactToEdit
      state.displayedContacts.push(state.contactToEdit)
      sortPeople(state.contacts)
      sortPeople(state.displayedContacts)
    }
    state.contactToEdit = {
      role: 'user'
    }
  },

  [EDIT_CONTACTS_ERROR] (state) {
    state.isEditContactsLoading = false
    state.isEditContactsLoadingError = true
  },

  [UPDATE_SEVDESK_CONTACTS_START] (state) {
    state.isUpdateSevdeskContactsLoading = true
    state.isUpdateSevdeskContactsLoadingError = false
  },

  [UPDATE_SEVDESK_CONTACTS_END] (state) {
    state.isUpdateSevdeskContactsLoading = false
    state.isUpdateSevdeskContactsLoadingError = false
  },

  [UPDATE_SEVDESK_CONTACTS_ERROR] (state) {
    state.isUpdateSevdeskContactsLoading = false
    state.isUpdateSevdeskContactsLoadingError = true
  },

  [SHOW_EDIT_CONTACTS_MODAL] (state, contactId) {
    state.isEditContactsModalShown = true
    state.isEditContactsLoadingError = false
    state.isEditContactsLoading = false
    if (contactId !== undefined) {
      state.contactToEdit = state.contacts.find(
        (contact) => contact.id === contactId
      )
    } else {
      state.contactToEdit = {
        first_name: '',
        last_name: '',
        company: 'Animationsfabrik GmbH',
        address: '',
        phone: '',
        mobile: '',
        email: '',
        role: 'client'
      }
    }
  },

  [HIDE_EDIT_CONTACTS_MODAL] (state) {
    state.isEditContactsModalShown = false
    state.contactToEdit = {}
  },

  [RESET_ALL] (state, people) {
    Object.assign(state, {...initialState})
  },

  [CONTACTS_SEARCH_CHANGE] (state, text) {
    if (text) {
      const keywords = getKeyWords(text)
      state.displayedContacts = indexSearch(state.contactsIndex, keywords)
    } else {
      state.displayedContacts = state.contacts
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  helpers
}
