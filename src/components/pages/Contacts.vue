<template>
  <div class="people page fixed-page">
    <div class="level page-header">
      <div class="level-left">
        <page-title class="flexrow-item" :text="$t('contacts.title')" />
      </div>

      <div class="level-right">
        <div class="level-item">
          <button-link v-if="isCurrentUserAdmin"
            class="level-item"
            :is-responsive="true"
            icon="refresh"
            path="/contacts/update"
          />
          <button-link v-if="isCurrentUserAdmin"
            class="level-item"
            :text="$t('contacts.new_contact')"
            :is-responsive="true"
            icon="plus"
            path="/contacts/new"
          />
        </div>
      </div>
    </div>

    <search-field
      class="search"
      ref="contacts-search-field"
      :can-save="false"
      @change="onSearchChange"
    />

    <contacts-list
      :entries="displayedContacts"
      :is-loading="isContactsLoading"
      :is-error="isContactsLoadingError"
    />

    <edit-contact-modal
      :active="isEditContactsModalShown"
      :is-loading="isEditContactsLoading"
      :is-error="isEditContactsLoadingError"
      :cancel-route="'/contacts'"
      @confirm="confirmEditContacts"
    />

    <delete-modal
      :active="isDeleteContactsModalShown"
      :is-loading="isDeleteContactsLoading"
      :is-error="isDeleteContactsLoadingError"
      :cancel-route="'/contacts'"
      :text="deleteText"
      :error-text="$t('contacts.delete_error')"
      @confirm="confirmDeleteContacts"
    />

    <update-sevdesk-contacts-modal
      :active="isUpdateSevdeskContactsModalShown"
      :is-loading="isUpdateSevdeskContactsLoading"
      :is-error="isUpdateSevdeskContactsLoadingError"
      :cancel-route="'/contacts'"
      :text="$t('contacts.update_sevdesk')"
      :error-text="$t('contacts.update_error')"
      @confirm="confirmUpdateSevdeskContacts"
    />

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ContactsList from '../lists/ContactsList'
import DeleteModal from '../widgets/DeleteModal'
import EditContactModal from '../modals/EditContactModal'
import ButtonLink from '../widgets/ButtonLink'
import ButtonHrefLink from '../widgets/ButtonHrefLink'
import PageTitle from '../widgets/PageTitle'
import SearchField from '../widgets/SearchField'
import UpdateSevdeskContactsModal from '../modals/UpdateSevdeskContactsModal'

export default {
  name: 'contacts',
  components: {
    ContactsList,
    DeleteModal,
    EditContactModal,
    ButtonLink,
    ButtonHrefLink,
    PageTitle,
    SearchField,
    UpdateSevdeskContactsModal
  },

  data () {
    return {
      csvColumns: [
        'First Name',
        'Last Name',
        'Email',
        'Phone'
      ]
    }
  },

  created () {
    this.loadContacts(() => {
      this.handleModalsDisplay()
    })
  },

  watch: {
    '$route' (to, from) {
      this.handleModalsDisplay()
    }
  },

  computed: {
    ...mapGetters([
      'displayedContacts',
      'isContactsLoading',
      'isContactsLoadingError',

      'isEditContactsModalShown',
      'isEditContactsLoading',
      'isEditContactsLoadingError',

      'isDeleteContactsModalShown',
      'isDeleteContactsLoading',
      'isDeleteContactsLoadingError',

      'isUpdateSevdeskContactsModalShown',
      'isUpdateSevdeskContactsLoading',
      'isUpdateSevdeskContactsLoadingError',

      'contactToDelete',
      'contactToEdit',

      'isCurrentUserAdmin'
    ]),

    deleteText () {
      const contact = this.contactToDelete
      if (contact !== undefined) {
        const contactName = `${contact.first_name} ${contact.last_name}`
        return this.$t('contact.delete_text', {contactName: contactName})
      } else {
        return ''
      }
    }
  },

  methods: {
    ...mapActions([
      'loadContacts',
      'contactsSearchChange'
    ]),

    addContactFilter (newFilter) {
    },

    removeContactFilter (newFilter) {
    },

    confirmEditContacts (form) {
      let action = 'editContacts'
      if (this.contactToEdit.id === undefined) {
        action = 'newContacts'
      }
      this.$store.dispatch(action, {
        data: form,
        callback: (err) => {
          if (!err) {
            this.$router.push('/contacts')
          }
        }
      })
    },

    confirmDeleteContacts () {
      this.$store.dispatch('deleteContacts', (err) => {
        if (!err) {
          this.$router.push('/contacts')
        }
      })
    },

    confirmUpdateSevdeskContacts (token) {
      this.$store.dispatch('updateSevdeskContacts', {
        token: token,
        callback: (err) => {
          if (!err) {
            this.$router.push('/contacts')
          }
        }
      })
    },

    showDeleteModalIfNeeded (path, contactId) {
      if (path.indexOf('delete') > 0) {
        this.$store.dispatch('showContactDeleteModal', contactId)
      } else {
        this.$store.dispatch('hideContactDeleteModal', contactId)
      }
    },

    showEditModalIfNeeded (path, contactId) {
      if (path.indexOf('new') > 0) {
        this.$store.dispatch('showContactEditModal')
      } else if (path.indexOf('edit') > 0) {
        this.$store.dispatch('showContactEditModal', contactId)
      } else {
        this.$store.dispatch('hideContactEditModal', contactId)
      }
    },

    showUpdateModalIfNeeded (path) {
      if (path.indexOf('update') > 0) {
        this.$store.dispatch('showUpdateSevdeskContactsModal')
      } else {
        this.$store.dispatch('hideUpdateSevdeskContactsModal')
      }
    },

    handleModalsDisplay () {
      const path = this.$store.state.route.path
      const contactId = this.$store.state.route.params.contact_id
      this.showDeleteModalIfNeeded(path, contactId)
      this.showEditModalIfNeeded(path, contactId)
      this.showUpdateModalIfNeeded(path)
    },

    onSearchChange () {
      this.contactsSearchChange(this.$refs['contacts-search-field'].getValue())
    }
  },

  metaInfo () {
    return {
      title: `${this.$t('contacts.title')} - Intranet`
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  margin-top: 2em;
}
</style>
