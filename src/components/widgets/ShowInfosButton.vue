<template>
<button
  :class="{
    'level-item': true,
    button: true,
    'is-toggle': true,
    'is-on': isShowInfos
  }"
  :title="$t(isShowInfos ? 'tasks.hide_infos' : 'tasks.show_infos')"
  @click="toggleInfos"
  style="background: none; border: none; box-shadow: none;"
>
  <eye-off-icon v-if="isShowInfos" class="icon is-small"></eye-off-icon>
  <eye-icon v-else class="icon is-small"></eye-icon>
  <span class="text is-hidden-touch">{{ $t(isShowInfos ? 'tasks.hide_infos': 'tasks.show_infos') }}</span>
</button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  EyeIcon,
  EyeOffIcon
} from 'vue-feather-icons'

export default {
  name: 'show-infos-button',
  components: {
    EyeIcon,
    EyeOffIcon
  },

  props: {
  },

  computed: {
    ...mapGetters([
      'isShowInfos'
    ])
  },

  methods: {
    ...mapActions([
      'showInfos',
      'hideInfos'
    ]),

    toggleInfos () {
      if (this.isShowInfos) {
        this.hideInfos()
      } else {
        this.showInfos()
      }
    }
  },

  mounted () {
    if (localStorage.getItem('show-infos') === 'false') {
      this.hideInfos()
    } else {
      this.showInfos()
    }
  },

  watch: {
    isShowInfos () {
      localStorage.setItem(
        'show-infos',
        this.isShowInfos,
        {expires: '1M'}
      )
    }
  }
}
</script>
