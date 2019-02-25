<template>
<button
 :class="{
    'level-item': true,
    button: true,
    'is-toggle': true,
    'is-on': isShowAssignations
  }"
  :title="$t(isShowAssignations ? 'tasks.hide_assignations' : 'tasks.show_assignations')"
  @click="toggleAssignations"
  style="background: none; border: none; box-shadow: none;"
>
  <eye-off-icon v-if="isShowAssignations" class="icon is-small"></eye-off-icon>
  <eye-icon v-else class="icon is-small"></eye-icon>
  <span class="text is-hidden-touch">{{ $t(isShowAssignations ? 'tasks.hide_assignations' : 'tasks.show_assignations') }}</span>
</button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  EyeIcon,
  EyeOffIcon
} from 'vue-feather-icons'

export default {
  name: 'show-assignations-button',
  components: {
    EyeIcon,
    EyeOffIcon
  },

  props: {},

  computed: {
    ...mapGetters([
      'isShowAssignations'
    ])
  },

  methods: {
    ...mapActions([
      'showAssignations',
      'hideAssignations'
    ]),

    toggleAssignations () {
      if (this.isShowAssignations) {
        this.hideAssignations()
      } else {
        this.showAssignations()
      }
    }
  },

  mounted () {
    if (localStorage.getItem('show-assignations') === 'false') {
      this.hideAssignations()
    } else {
      this.showAssignations()
    }
  },

  watch: {
    isShowAssignations () {
      localStorage.setItem(
        'show-assignations',
        this.isShowAssignations,
        {expires: '1M'}
      )
    }
  }
}
</script>
