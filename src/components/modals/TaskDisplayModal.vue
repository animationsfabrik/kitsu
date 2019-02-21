<template>
<div :class="{
  'modal': true,
  'is-active': active
}">
  <div class="modal-background"></div>
  <div class="modal-content">
    <div class="box">

      <h1 class="title">
        {{ $t("shots.task_display") }}
      </h1>{{ form.displayedTasks }}

      <form v-on:submit.prevent>
        <checkbox :id="taskTypes[0].id" :value="taskTypes[0].id" :v-model="form.displayed_tasks" :label="taskTypes[0].name" />
        <!--<checkbox v-for="task in taskTypes" :id="task.id" :value="task.id" :v-model="form.displayed_tasks" :key="task.id" :label="task.name" />-->
      </form>{{ form.displayedTasks }}

      <div class="has-text-right">
        <a
          :class="{
            button: true,
            'is-primary': true,
            'is-loading': isLoading
          }"
          @click="confirmClicked"
        >
          {{ $t("main.confirmation") }}
        </a>
        <router-link
          :to="cancelRoute"
          class="button is-link"
          v-if="cancelRoute"
        >
          {{ $t("main.close") }}
        </router-link>
        <button
          class="button is-link"
          @click="$emit('cancel')"
          v-else
        >
          {{ $t("main.close") }}
        </button>
        <p class="error has-text-right info-message" v-if="isError">
          {{ $t("shots.edit_fail") }}
        </p>
        <p class="success has-text-right info-message">
          {{ shotSuccessText }}
        </p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { modalMixin } from './base_modal'
import TextField from '../widgets/TextField'
import TextareaField from '../widgets/TextareaField'
import Combobox from '../widgets/Combobox'
import Checkbox from '../widgets/Checkbox'

export default {
  name: 'task-display-modal',
  mixins: [modalMixin],

  components: {
    Combobox,
    Checkbox,
    TextField,
    TextareaField
  },

  props: [
    'onConfirmClicked',
    'text',
    'active',
    'cancelRoute',
    'isError',
    'isLoading',
    'isLoadingStay',
    'isSuccess',
    'shotToEdit',
    'errorText'
  ],

  data () {
    return {
      form: {
        data: {}
      },
      shotSuccessText: ''
    }
  },

  computed: {
    ...mapGetters([
      'currentProduction',
      'getSequenceOptions',
      'getOpenProductionOptions',
      'openProductions',
      'sequences',
      'shots',
      'taskTypes',
      'shotCreated',
      'shotMetadataDescriptors'
    ])
  },

  methods: {
    ...mapActions([
    ]),

    runConfirmation () {
      if (this.isEditing()) {
        this.confirmClicked()
      } else {
        this.confirmAndStayClicked()
      }
    },

    confirmAndStayClicked () {
      this.$emit('confirmAndStay', this.form)
    },

    confirmClicked () {
      this.$emit('confirm', this.form)
    },

    getDescriptorChoicesOptions (descriptor) {
      const values = descriptor.choices.map(c => ({ label: c, value: c }))
      return [{ label: '', value: '' }, ...values]
    },

    isEditing () {
      return this.shotToEdit && this.shotToEdit.id
    },

    resetForm () {
      this.shotSuccessText = ''
      if (!this.isEditing()) {
        if (this.openProductions.length > 0) {
          this.form.project_id =
            this.currentProduction ? this.currentProduction.id : ''
        }
        if (this.sequences.length > 0) {
          this.form.sequence_id = this.sequences[0].id
        }
        this.form.displayed_tasks = ''
      } else {
        this.form = {
          sequence_id: this.shotToEdit.sequence_id,
          displayed_tasks: this.displayedTasks
        }
      }
    }
  },

  mounted () {
    this.resetForm()
  },

  watch: {
    active () {
      this.shotSuccessText = ''
      this.resetForm()
      if (this.active) {
        setTimeout(() => {
          this.$refs.nameField.focus()
        }, 100)
      }
    },

    shotToEdit () {
      this.resetForm()
    }
  }

}
</script>

<style scoped>
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
.info-message {
  margin-top: 1em;
}

.modal-content {
  max-height: 80%;
}
</style>
