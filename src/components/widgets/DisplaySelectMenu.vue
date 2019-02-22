<template>
  <div class="header-menu hidden">
    <show-due-dates-button class="level-item"/>
    <show-tasks-button class="level-item"/>
    <show-assignations-button class="level-item"/>
    <show-infos-button class="level-item"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ShowDueDatesButton from './ShowDueDatesButton'
import ShowTasksButton from './ShowTasksButton'
import ShowAssignationsButton from './ShowAssignationsButton'
import ShowInfosButton from './ShowInfosButton'

export default {
  name: 'display-select-menu',

  components: {
    ShowDueDatesButton,
    ShowTasksButton,
    ShowAssignationsButton,
    ShowInfosButton
  },

  props: {
    isMinimized: {
      type: Boolean,
      default: false
    },
    isCurrentUserAdmin: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
    }
  },

  computed: {
    ...mapGetters([
    ])
  },

  methods: {
    ...mapActions([
    ])
  }
}
</script>

<style scoped>
.dark .header-menu {
  background-color: #36393F;
  box-shadow: 0px 2px 6px #333;
}
.header-menu {
  position: absolute;
  background: white;
  width: 118px;
  box-shadow: 0px 2px 6px #CCC;
  top: 90px;
  z-index: 100;
}

.header-menu div {
  cursor: pointer;
}

.header-menu div {
  padding: 0.5em;
}
</style>
