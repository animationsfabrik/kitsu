<template>
<button
  class="level-item button"
  @click="hideAdditionalInfo"
  v-if="isShowAdditionalInfo"
  style="background: none; border: none;"
>
  <eye-off-icon class="icon is-small"></eye-off-icon>
  <span class="text is-hidden-touch">{{ $t('tasks.hide_additional_info') }}</span>
</button>
<button
  class="level-item button"
  @click="showAdditionalInfo"
  v-else
  style="background: none; border: none;"
>
  <eye-icon class="icon is-small"></eye-icon>
  <span class="text is-hidden-touch">{{ $t('tasks.show_additional_info') }}</span>
</button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  EyeIcon,
  EyeOffIcon
} from 'vue-feather-icons'

export default {
  name: 'show-additional-info-button',
  components: {
    EyeIcon,
    EyeOffIcon
  },

  props: {
  },

  computed: {
    ...mapGetters([
      'isShowAdditionalInfo'
    ])
  },

  methods: {
    ...mapActions([
      'showAdditionalInfo',
      'hideAdditionalInfo'
    ])
  },

  mounted () {
    if (this.$cookie.get('show-additional-info') === 'false') {
      this.hideAdditionalInfo()
    } else {
      this.showAdditionalInfo()
    }
  },

  watch: {
    isShowAdditionalInfo () {
      this.$cookie.set(
        'show-additional-info',
        this.isShowAdditionalInfo,
        { expires: '1M' }
      )
    }
  }

}
</script>
