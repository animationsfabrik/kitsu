<template>
<div :class="{
  'modal': true,
  'update-sevdesk-contacts-modal': true,
  'is-active': active
}">
  <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="text">{{ text }}</p>
        <text-field
          label="Token"
          ref="token-field"
          v-model="token"
        />
        <p class="is-danger" v-if="isError">{{ errorText }}</p>
        <p class="has-text-right">
          <a
            :class="{
              button: true,
              'is-danger': true,
              'is-loading': isLoading
            }"
            @click="runConfirmation()">
            {{ $t("main.confirmation") }}
          </a>
          <router-link
            :to="cancelRoute"
            class="button is-link"
            v-if="cancelRoute"
          >
            {{ $t("main.cancel") }}
          </router-link>
          <button
            class="button is-link"
            @click="$emit('cancel')"
            v-else
          >
            {{ $t("main.cancel") }}
          </button>
        </p>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Combobox from '../widgets/Combobox'
import TextField from '../widgets/TextField'

export default {
  name: 'update-sevdesk-contacts-modal',
  components: {
    Combobox,
    TextField
  },

  props: [
    'text',
    'active',
    'cancelRoute',
    'isLoading',
    'isError',
    'errorText'
  ],

  data () {
    return {
      token: ''
    }
  },

  created () {
    this.resetForm()
  },

  mounted () {
  },

  computed: {
    ...mapGetters([
      'productions',
      'productionStatus',
      'productionStatusOptions'
    ])
  },

  methods: {
    ...mapActions([
    ]),

    runConfirmation () {
      console.log(this.token)
      this.$emit('confirm', this.token)
    },

    onFileSelected (formData) {
      this.formData = formData
      this.$emit('fileselected', formData)
    },

    resetForm () {
    }
  },

  watch: {
    active () {
      if (this.active) {
        setTimeout(() => {
          this.$refs.nameField.focus()
          this.formData = null
          if (this.$refs.fileField) this.$refs.fileField.reset()
        }, 100)
      }
    }
  }
}
</script>

<style scoped>
.title {
  border-bottom: 2px solid #DDD;
  padding-bottom: 0.5em;
  margin-bottom: 1.2em;
}
</style>
