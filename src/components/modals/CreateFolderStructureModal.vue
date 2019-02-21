<template>
<div :class="{
  'modal': true,
  'create-folder-structure-modal': true,
  'is-active': active
}">
  <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="text">{{ text }}</p>
        <p class="is-danger" v-if="isError">{{ errorText }}</p>
        <p class="has-text-right">
          <a
            :class="{
              button: true,
              'is-danger': true,
              'is-loading': isLoading
            }"
            @click="$emit('confirm')">
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
import FileUpload from '../widgets/FileUpload'
import TextField from '../widgets/TextField'

export default {
  name: 'create-folder-structure-modal',
  components: {
    Combobox,
    FileUpload,
    TextField
  },

  props: [
    'text',
    'active',
    'cancelRoute',
    'isLoading',
    'isError',
    'errorText',
    'folderStructureToCreate'
  ],

  data () {
    const data = {
      formData: null
    }

    if (this.folderStructureToCreate) {
      data.form = {
        project_id: this.folderStructureToCreate
      }
    }

    return data
  },

  created () {
    this.resetForm()
  },

  mounted () {
    if (this.productions.length > 0) {
      this.form.project_id = this.productions[0].id
    }
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
      this.$emit('confirm', this.form)
    },

    onFileSelected (formData) {
      this.formData = formData
      this.$emit('fileselected', formData)
    },

    resetForm () {
      if (this.folderStructureToCreate) {
        this.form = {
          project_id: this.folderStructureToCreate
        }
      }
    }
  },

  watch: {
    folderStructureToCreate () {
      this.resetForm()
    },

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
