<template>
<div class="data-list">
  <div style="overflow: hidden">
    <table class="table table-header" ref="headerWrapper">
      <thead>
        <tr>
          <th class="numbering"></th>
          <th class="name">
            {{ $t("contacts.list.name") }}
          </th>
          <th class="company">
            {{ $t("contacts.list.company") }}
          </th>
          <th class="email">
            {{ $t("contacts.list.email") }}
          </th>
          <th class="phone">
            {{ $t("contacts.list.phone") }}
          </th>
          <th class="mobile">
            {{ $t("contacts.list.mobile") }}
          </th>
          <th class="address">
            {{ $t("contacts.list.address") }}
          </th>
          <th class="role">
            {{ $t("contacts.list.role") }}
          </th>
          <th class="actions"></th>
        </tr>
      </thead>
    </table>
  </div>

  <table-info
    :is-loading="isLoading"
    :is-error="isError"
  />

  <div class="table-body" v-scroll="onBodyScroll">

    <table class="table splitted-table">
      <tbody>
        <tr v-for="(entry, index) in entries" :key="entry.id">
          <td class="numbering"><div style="text-align: center; vertical-align: text-bottom">{{ index + 1 }}</div></td>
          <people-name-cell class="name" :entry="entry" />
          <td class="company">{{ entry.company }}</td>
          <td class="email">{{ entry.email }}</td>
          <td class="phone">{{ entry.phone }}</td>
          <td class="mobile">{{ entry.mobile }}</td>
          <td class="address">{{ entry.address }}</td>
          <td class="role">{{ $t('contacts.role.' + entry.role) }}</td>
          <row-actions
            v-if="isCurrentUserAdmin"
            :entry-id="entry.id"
            :edit-route="{
              name: 'edit-contact',
              params: {contact_id: entry.id}
            }"
            :delete-route="{
              name: 'delete-contact',
              params: {contact_id: entry.id}
            }"
          >
          </row-actions>
          <td class="actions" v-else>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p class="has-text-centered footer-info" v-if="!isLoading">
    {{ entries.length }} {{ $tc('contacts.persons', entries.length) }}
  </p>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PeopleNameCell from '../cells/PeopleNameCell'
import RowActions from '../widgets/RowActions'
import TableInfo from '../widgets/TableInfo'

export default {
  name: 'contacts-list',
  components: {
    PeopleNameCell,
    RowActions,
    TableInfo
  },

  props: [
    'entries',
    'isLoading',
    'isError',
    'onEditClicked',
    'onDeleteClicked'
  ],

  computed: {
    ...mapGetters([
      'isCurrentUserAdmin'
    ])
  },

  methods: {
    ...mapActions([
    ]),

    taskColor (nbTasks) {
      if (nbTasks < 1 || nbTasks > 4) {
        return 'red'
      } else {
        return ''
      }
    },

    onBodyScroll (event, position) {
      this.$refs.headerWrapper.style.left = `-${position.scrollLeft}px`
    }
  }
}
</script>

<style lang="scss" scoped>
.numbering {
  width: 50px;
  min-width: 50px;
}
.name {
  width: 180px;
  min-width: 180px;
}
.email {
  width: 260px;
  min-width: 260px;
}
.company {
  width: 220px;
  min-width: 220px;
}
.address {
  width: 300px;
  min-width: 300px;
}
.mobile {
  width: 160px;
  min-width: 160px;
}
.phone {
  width: 160px;
  min-width: 160px;
}
.role {
  width: 75px;
  min-width: 75px;
}
.actions {
  min-width: 100px;
}

.data-list {
  margin-top: 2em;
}
</style>
