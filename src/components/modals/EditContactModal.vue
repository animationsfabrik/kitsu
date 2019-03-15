<template>

<div :class="{
  'modal': true,
  'is-active': active
}">
  <div class="modal-background"></div>
  <div class="modal-content">
    <div class="box">

      <h1 class="title" v-if="contactToEdit.id !== undefined">
        {{ $t("contacts.edit_title") }} {{ contactName }}
      </h1>
      <h1 class="title" v-else>
        {{ $t("contacts.new_person") }}
      </h1>

      <form v-on:submit.prevent>
        <text-field
          :label="$t('contacts.fields.first_name')"
          :disabled="isLdap"
          ref="name-field"
          @enter="confirmClicked()"
          v-model="form.first_name"
        />
        <text-field
          :label="$t('contacts.fields.last_name')"
          :disabled="isLdap"
          @enter="confirmClicked()"
          v-model="form.last_name"
        />
        <text-field
          :label="$t('contacts.fields.company')"
          @enter="confirmClicked()"
          v-model="form.company"
        />
        <text-field
          :label="$t('contacts.fields.email')"
          :disabled="isLdap"
          @enter="confirmClicked()"
          v-model="form.email"
        />
        <text-field
          :label="$t('contacts.fields.phone')"
          @enter="confirmClicked()"
          v-model="form.phone"
        />
        <text-field
          :label="$t('contacts.fields.mobile')"
          @enter="confirmClicked()"
          v-model="form.mobile"
        />
        <text-field
          :label="$t('contacts.fields.address')"
          @enter="confirmClicked()"
          v-model="form.address"
        />
        <combobox
          :label="$t('contacts.fields.role')"
          :options="roleOptions"
          localeKeyPrefix="contacts.role."
          @enter="confirmClicked()"
          v-model="form.role"
        />
      </form>

      <p class="has-text-right">
        <a
          :class="{
            button: true,
            'is-primary': true,
            'is-loading': isLoading
          }"
          :disabled="!isValidEmail"
          @click="confirmClicked">
          {{ $t("main.confirmation") }}
        </a>
        <router-link
          :to="cancelRoute"
          class="button is-link">
          {{ $t("main.cancel") }}
        </router-link>
      </p>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TextField from '../widgets/TextField'
import Combobox from '../widgets/Combobox'

export default {
  name: 'edit-modal',
  props: [
    'onConfirmClicked',
    'text',
    'active',
    'cancelRoute',
    'isLoading',
    'isError',
    'errorText'
  ],

  data () {
    return {
      isValidEmail: false,
      form: {
        first_name: '',
        last_name: '',
        company: 'Animationsfabrik GmbH',
        address: '',
        email: '',
        phone: '',
        mobile: '',
        role: 'client'
      },

      roleOptions: [
        {label: 'client', value: 'client'},
        {label: 'supplier', value: 'supplier'}
      ]
    }
  },

  components: {
    TextField,
    Combobox
  },

  computed: {
    ...mapGetters([
      'isLdap',
      'contactToEdit',
      'contacts'
    ]),

    contactName () {
      if (this.contactToEdit !== undefined) {
        return this.contactToEdit.first_name + ' ' + this.contactToEdit.last_name
      } else {
        return ''
      }
    }
  },

  methods: {
    ...mapActions([]),

    confirmClicked () {
      this.form.active =
        this.form.active === 'true' || this.form.active === true
      if (this.form.email) {
        this.$emit('confirm', this.form)
      }
    },

    resetForm () {
      if (this.contactToEdit) {
        this.form = {
          first_name: this.contactToEdit.first_name,
          last_name: this.contactToEdit.last_name,
          company: this.contactToEdit.company,
          address: this.contactToEdit.address,
          phone: this.contactToEdit.phone,
          mobile: this.contactToEdit.mobile,
          email: this.contactToEdit.email,
          role: this.contactToEdit.role,
          active: !this.contactToEdit.id || this.contactToEdit.active ? 'true' : 'false'
        }
      }
      this.checkEmailValidity()
    },

    checkEmailValidity () {
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const isExist = this.contacts.some((p) => {
        return p.email === this.form.email && (
          !this.contactToEdit || this.contactToEdit.email !== p.email
        )
      })
      this.isValidEmail =
        this.form.email &&
        regex.test(this.form.email) &&
        !isExist
    }
  },

  watch: {
    contactToEdit () {
      this.resetForm()
    },

    active () {
      if (this.active) {
        this.resetForm()
        setTimeout(() => {
          this.$refs['name-field'].focus()
        }, 100)
      }
    },

    'form.email' () {
      this.checkEmailValidity()
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-content .box p.text {
  margin-bottom: 1em;
}
.is-danger {
  color: #ff3860;
  font-style: italic;
}
.title {
  border-bottom: 2px solid #DDD;
  padding-bottom: 0.5em;
  margin-bottom: 1.2em;
}
</style>
