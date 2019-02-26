<template>
<button
  :class="{
    'level-item': true,
    button: true,
    'is-toggle': true,
    'is-on': isShowSequenceStats
  }"
  :title="$t(isShowSequenceStats ? 'tasks.hide_sequence_stats' : 'tasks.show_sequence_stats')"
  @click="toggleSequenceStats"
  style="background: none; border: none; box-shadow: none;"
>
  <eye-off-icon v-if="isShowSequenceStats" class="icon is-small"></eye-off-icon>
  <eye-icon v-else class="icon is-small"></eye-icon>
  <span class="text is-hidden-touch">{{ $t(isShowSequenceStats ? 'tasks.hide_sequence_stats': 'tasks.show_sequence_stats') }}</span>
</button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  EyeIcon,
  EyeOffIcon
} from 'vue-feather-icons'

export default {
  name: 'show-sequence-stats-button',
  components: {
    EyeIcon,
    EyeOffIcon
  },

  props: {
  },

  computed: {
    ...mapGetters([
      'isShowSequenceStats'
    ])
  },

  methods: {
    ...mapActions([
      'showSequenceStats',
      'hideSequenceStats'
    ]),

    toggleSequenceStats () {
      if (this.isShowSequenceStats) {
        this.hideSequenceStats()
      } else {
        this.showSequenceStats()
      }
    }
  },

  mounted () {
    if (localStorage.getItem('show-sequence-stats') === 'false') {
      this.hideSequenceStats()
    } else {
      this.showSequenceStats()
    }
  },

  watch: {
    isShowSequenceStats () {
      localStorage.setItem(
        'show-sequence-stats',
        this.isShowSequenceStats,
        {expires: '1M'}
      )
    }
  }
}
</script>
