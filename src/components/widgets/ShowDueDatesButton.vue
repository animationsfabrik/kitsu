<template>
<button
  class="level-item button"
  @click="hideDueDates"
  v-if="isShowDueDates"
  style="background: none; border: none;"
>
  <eye-off-icon class="icon is-small"></eye-off-icon>
  <span class="text is-hidden-touch">{{ $t('tasks.hide_due_dates') }}</span>
</button>
<button
  class="level-item button"
  @click="showDueDates"
  v-else
  style="background: none; border: none;"
>
  <eye-icon class="icon is-small"></eye-icon>
  <span class="text is-hidden-touch">{{ $t('tasks.show_due_dates') }}</span>
</button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  EyeIcon,
  EyeOffIcon
} from 'vue-feather-icons'

export default {
  name: 'show-due-dates-button',
  components: {
    EyeIcon,
    EyeOffIcon
  },

  props: {
  },

  computed: {
    ...mapGetters([
      'isShowDueDates'
    ])
  },

  methods: {
    ...mapActions([
      'showDueDates',
      'hideDueDates'
    ])
  },

  mounted () {
    if (this.$cookie.get('show-due-dates') === 'false') {
      this.hideDueDates()
    } else {
      this.showDueDates()
    }
  },

  watch: {
    isShowDueDates () {
      this.$cookie.set(
        'show-due-dates',
        this.isShowDueDates,
        { expires: '1M' }
      )
    }
  }

}
</script>
