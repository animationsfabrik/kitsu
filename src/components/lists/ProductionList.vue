<template>
<div class="data-list">
  <div style="overflow: hidden">
    <table class="table table-header" ref="headerWrapper">
      <thead>
        <tr>
          <th class="project">&nbsp;</th>
          <th class="name">{{ $t('productions.fields.name') }}</th>
          <th class="type">{{ $t('productions.fields.type') }}</th>
          <th class="fps">{{ $t('productions.fields.fps') }}</th>
          <th class="ratio">{{ $t('productions.fields.ratio') }}</th>
          <th class="resolution">{{ $t('productions.fields.resolution') }}</th>
          <th class="actions"></th>
        </tr>
      </thead>
    </table>
  </div>

  <table-info
    :is-loading="isLoading"
    :is-error="isError"
  >
  </table-info>

  <div class="table-body" v-scroll="onBodyScroll">
    <table class="table splitted-table">
      <tbody>
        <tr class="type-header">
          <td colspan="30">
            {{ $t('productions.status.open') }}
          </td>
        </tr>
        <tr v-for="entry in openProductions" :key="entry.id">
          <production-name-cell
            class="project"
            :only-avatar="true"
            :entry="entry"
            :last-production-screen="lastProductionScreen"
          />
          <production-name-cell
            class="name"
            :with-avatar="false"
            :entry="entry"
            :last-production-screen="lastProductionScreen"
          />
          <td class="type">
            {{ $t('productions.type.' + (entry.production_type || 'short')) }}
          </td>
          <td class="fps">
            {{ entry.fps }}
          </td>
          <td class="ratio">
            {{ entry.ratio }}
          </td>
          <td class="resolution">
            {{ entry.resolution }}
          </td>
          <row-actions
            :entry-id="entry.id"
            :edit-route="{
              name: 'edit-production',
              params: {production_edit_id: entry.id}
            }"
            :delete-route="{
              name: 'delete-production',
              params: {production_delete_id: entry.id}
            }"
          />
          <td class="additional-buttons">
            <router-link :to="'/productions/createfs/' + entry.id" class="button">
             Fs
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table splitted-table">
      <tbody>
        <tr class="type-header">
          <td colspan="30">
            {{ $t('productions.status.closed') }}
          </td>
        </tr>
        <tr v-for="entry in closedProductions" :key="entry.id">
          <production-name-cell
            class="project"
            :only-avatar="true"
            :entry="entry"
            :no-link="true"
            :last-production-screen="lastProductionScreen"
          />
          <production-name-cell
            class="name"
            :with-avatar="false"
            :entry="entry"
            :last-production-screen="lastProductionScreen"
          />
          <td class="type">
            {{ $t('productions.type.' + (entry.production_type || 'short')) }}
          </td>
          <td class="fps">
            {{ entry.fps }}
          </td>
          <td class="ratio">
            {{ entry.ratio }}
          </td>
          <td class="resolution">
            {{ entry.resolution }}
          </td>
          <row-actions
            :entry-id="entry.id"
            :edit-route="{
              name: 'edit-production',
              params: {production_edit_id: entry.id}
            }"
            :delete-route="{
              name: 'delete-production',
              params: {production_delete_id: entry.id}
            }"
          />
        </tr>
      </tbody>
    </table>
  </div>

  <p class="has-text-centered nb-productions">
    {{ entries.length }} {{ $tc('productions.number', entries.length) }}
  </p>

</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProductionNameCell from '../cells/ProductionNameCell'
import RowActions from '../widgets/RowActions'
import TableInfo from '../widgets/TableInfo'
import ButtonLink from '../widgets/ButtonLink'

export default {
  name: 'production-list',
  props: [
    'entries',
    'isLoading',
    'isError'
  ],

  data () {
    return {}
  },

  components: {
    ProductionNameCell,
    RowActions,
    TableInfo,
    ButtonLink
  },

  computed: {
    ...mapGetters([
      'openProductions',
      'currentProduction',
      'lastProductionScreen'
    ]),

    closedProductions () {
      return this.entries.filter(p => p.project_status_name === 'Closed')
    },
    createFsPath (pid) {
      return this.getPath('create-folder-structure', pid)
    }
  },

  methods: {
    ...mapActions([
    ]),

    // Convert a database status to a locale key.
    getStatusLocale (originalStatus) {
      const statusMap = {
        Active: 'productions.status.open', // Shotgun compatibility
        Open: 'productions.status.open',
        Closed: 'productions.status.closed'
      }
      return statusMap[originalStatus]
    },
    onBodyScroll (event, position) {
      this.$refs.headerWrapper.style.left = `-${position.scrollLeft}px`
    },
    getPath (section, pid) {
      let route = {
        name: section,
        params: {
          production_id: pid
        }
      }
      if (this.isTVShow && this.currentEpisode) {
        route.name = `episode-${section}`
        route.params.episode_id = this.currentEpisode.id
      }
      return route
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  min-width: 60px;
  width: 60px;
}

.name {
  min-width: 250px;
  width: 250px;
}

.type {
  min-width: 120px;
  width: 120px;
}

.status {
  min-width: 100px;
  width: 100px;
}

.actions {
  min-width: 100px;
}

.additional-buttons {
  margin: 0px;
  text-align: right;
  font-size: 14px;
  font-weight: 400;
  display: table-cell;
  width: 1px;
  padding-right: 10px;
}

.fps,
.ratio,
.resolution {
  width: 100px;
  min-width: 100px;
}

</style>
