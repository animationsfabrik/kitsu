<template>
<td class="name">
  <div class="people-name">
    <!--<people-avatar class="avatar" :person="entry"></people-avatar>-->
    <people-name class="people-name" :person="entry"></people-name>
  </div>
</td>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PeopleAvatar from '../widgets/PeopleAvatar'
import PeopleName from '../widgets/PeopleName'

export default {
  name: 'people-name-cell',
  components: {
    PeopleName,
    PeopleAvatar
  },
  props: [
    'entry'
  ],
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

<style lang="scss" scoped>
.people-name {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.people-name {
  margin-left: 0em;
}
</style>
