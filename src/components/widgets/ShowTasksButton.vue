<template>
<button
  class="level-item button"
  @click="hideTasks"
  v-if="isShowTasks"
  style="background: none; border: none;"
>
  <eye-off-icon class="icon is-small"></eye-off-icon>
  <span class="text is-hidden-touch">{{ $t('tasks.hide_tasks') }}</span>
</button>
<button
  class="level-item button"
  @click="showTasks"
  v-else
  style="background: none; border: none;"
>
  <eye-icon class="icon is-small"></eye-icon>
  <span class="text is-hidden-touch">{{ $t('tasks.show_tasks') }}</span>
</button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  EyeIcon,
  EyeOffIcon
} from 'vue-feather-icons'

export default {
  name: 'show-tasks-button',
  components: {
    EyeIcon,
    EyeOffIcon
  },

  props: {
  },

  computed: {
    ...mapGetters([
      'isShowTasks'
    ])
  },

  methods: {
    ...mapActions([
      'showTasks',
      'hideTasks'
    ])
  },

  mounted () {
    if (this.$cookie.get('show-tasks') === 'false') {
      this.hideTasks()
    } else {
      this.showTasks()
    }
  },

  watch: {
    isShowTasks () {
      this.$cookie.set(
        'show-tasks',
        this.isShowTasks,
        { expires: '1M' }
      )
    }
  }

}
</script>
