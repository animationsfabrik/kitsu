<template>
<div class="data-list">
  <div class="table-header-wrapper">
    <table class="table table-header" ref="headerWrapper">
      <thead>
        <tr>
          <th class="name" ref="th-sequence">
            {{ $t('shots.fields.sequence') }}
          </th>
          <th class="description">{{ $t('shots.fields.description') }}</th>
          <th
            class="validation"
            :style="getValidationStyle(columnId)"
            :key="columnId"
            v-for="columnId in sortedValidationColumns"
            v-if="!isLoading"
          >
            <router-link
              :to="taskTypePath(columnId)"
            >
              {{ taskTypeMap[columnId].name }}
            </router-link>
          </th>
          <th class="actions">
          </th>
        </tr>
      </thead>
    </table>
  </div>

  <table-info
    :is-loading="isLoading"
    :is-error="isError"
  />

  <div
    class="has-text-centered"
    v-if="isEmptyList && !isCurrentUserClient && !isLoading"
  >
    <p class="info">
      <img src="../../assets/illustrations/empty_shot.png" />
    </p>
    <p class="info">{{ $t('sequences.empty_list') }}</p>
    <button-link
      class="level-item big-button"
      :text="$t('shots.new_sequences')"
      :path="manageShotPath"
    >
    </button-link>
  </div>
  <div
    class="has-text-centered"
    v-if="isEmptyList && isCurrentUserClient && !isLoading"
  >
    <p class="info">
      <img src="../../assets/illustrations/empty_shot.png" />
    </p>
    <p class="info">{{ $t('sequences.empty_list_client') }}</p>
  </div>

  <div
    ref="body"
    class="table-body"
    v-scroll="onBodyScroll"
    v-if="!isLoading"
  >
    <table class="table">
      <tbody ref="body-tbody">
        <tr
          :key="entry.id"
          v-for="entry in entries"
        >

          <td class="name">
            <router-link to="shots">
              {{ entry.name }}
            </router-link>
          </td>

          <td class="description">
            {{ entry.description }}
          </td>

          <td
            class="validation"
            :style="getValidationStyle(columnId)"
            :key="columnId"
            v-for="columnId in sortedValidationColumns"
          >
            <div v-if="isStats(entry, taskTypeMap[columnId])">
              <div style="float: left;">
                <pie-chart
                  width="70px"
                  height="50px"
                  :legend="false"
                  :colors="chartColors(entry, taskTypeMap[columnId])"
                  :data="chartData(entry, taskTypeMap[columnId])"
                  v-if="isStats(entry, taskTypeMap[columnId])"
                />
              </div>
              <div style="overflow: hidden" v-if="isShowSequenceStats">
                <table class="table">
                  <thead class="table-header">
                    <tr>
                      <th class="status">
                      </th>
                      <th class="entities">
                        {{ $t('sequences.fields.entities') }}
                      </th>
                      <th class="percent">
                        {{ $t('sequences.fields.percent') }}
                      </th>
                      <th class="frames">
                        {{ $t('sequences.fields.frames') }}
                      </th>
                      <th class="seconds">
                        {{ $t('sequences.fields.seconds') }}
                      </th>
                      <th class="minutes">
                        {{ $t('sequences.fields.minutes') }}
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>

              <table-info
                :is-loading="isLoading"
                :is-error="isError"
              />

              <div class="table-body" v-if="chartData(entry, taskTypeMap[columnId]).length > 0 && isShowSequenceStats">
                <table class="table">
                  <tbody>
                    <tr v-for="data in chartData(entry, taskTypeMap[columnId])" :key="data[0]" :style="'background-color: ' + data[3] + ';'">
                      <td class="status">
                        {{ data[0] }}
                      </td>
                      <td class="entities">
                        {{ data[1] }}
                      </td>
                      <td class="percent">
                        {{ Math.round(data[1] / chartTotal(entry, taskTypeMap[columnId]) * 100) }}%
                      </td>
                      <td class="frames">
                        {{ data[2] }}
                      </td>
                      <td class="seconds">
                        {{ Math.round(data[2]/entry.fps*10)/10 }}
                      </td>
                      <td class="minutes">
                        {{ Math.round(data[2]/entry.fps/60*10)/10 }}
                      </td>
                   </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </td>
          <row-actions v-if="isCurrentUserManager"
            :entry="entry"
            :edit-route="editPath(entry.id)"
            :delete-route="deletePath(entry.id)"
          />

          <td class="actions" v-else>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <p
    class="has-text-centered nb-sequences"
    v-if="!isEmptyList && !isLoading"
  >
    {{ displayedSequencesLength }}
    {{ $tc('sequences.number', displayedSequencesLength) }}
  </p>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { entityListMixin } from './base'
import RowActions from '../widgets/RowActions'
import ButtonLink from '../widgets/ButtonLink'
import PageTitle from '../widgets/PageTitle'
import TableInfo from '../widgets/TableInfo'
import ValidationTag from '../widgets/ValidationTag'

export default {
  name: 'sequence-list',
  mixins: [entityListMixin],

  props: [
    'entries',
    'isLoading',
    'isError',
    'sequenceStats',
    'validationColumns'
  ],

  data () {
    return {
      busy: false,
      lastSelection: null
    }
  },

  components: {
    ButtonLink,
    PageTitle,
    RowActions,
    TableInfo,
    ValidationTag
  },

  computed: {
    ...mapGetters([
      'currentProduction',
      'currentEpisode',
      'displayedSequencesLength',
      'isDarkTheme',
      'isCurrentUserClient',
      'isCurrentUserManager',
      'isTVShow',
      'sequenceSearchText',
      'taskTypeMap',
      'taskStatusMap',
      'isShowSequenceStats'
    ]),

    isEmptyList () {
      return this.entries &&
             this.entries.length === 0 &&
             !this.isLoading &&
             !this.isError &&
             (!this.sequenceSearchText || this.sequenceSearchText.length === 0)
    },

    manageShotPath () {
      return this.getPath('manage-shots')
    }
  },

  methods: {
    ...mapActions([
      'displayMoreSequences',
      'loadMoreSequences'
    ]),

    chartColors (entry, column) {
      const stats = this.sequenceStats[entry.id][column.id]
      const taskStatusIds = Object.keys(stats)
      return taskStatusIds.map((key) => {
        const data = this.sequenceStats[entry.id][column.id][key]
        let color = data.name === 'todo' ? '#5F626A' : data.color
        return color
      })
    },

    chartData (entry, column) {
      let data = Object.keys(this.sequenceStats[entry.id][column.id]).map((key) => {
        const data = this.sequenceStats[entry.id][column.id][key]
        this.sequenceStats[entry.id][column.id][key]['color'] = data.name === 'todo' ? '#5F626A' : data.color
        this.sequenceStats[entry.id][column.id][key]['priority'] = this.taskStatusMap[data.task_status_id].priority

        return [
          this.sequenceStats[entry.id][column.id][key].name,
          this.sequenceStats[entry.id][column.id][key].value,
          this.sequenceStats[entry.id][column.id][key].frames,
          this.sequenceStats[entry.id][column.id][key].color,
          this.sequenceStats[entry.id][column.id][key].priority
        ]
      })
      data.sort((a, b) => a[4] > b[4])
      return data
    },

    chartTotal (entry, column) {
      let total = 0
      for (var key in this.sequenceStats[entry.id][column.id]) {
        total = total + this.sequenceStats[entry.id][column.id][key].value
      }
      return total
    },

    isStats (entry, column) {
      return this.sequenceStats[entry.id] &&
             this.sequenceStats[entry.id][column.id]
    },

    onHeaderScroll (event, position) {
      this.$refs.tableWrapper.scrollLeft = position.scrollLeft
    },

    onBodyScroll (event, position) {
      this.$refs.headerWrapper.style.left = `-${position.scrollLeft}px`
      this.$emit('scroll', position.scrollTop)
      const maxHeight =
        this.$refs.body.scrollHeight - this.$refs.body.offsetHeight
      if (maxHeight < (position.scrollTop + 100)) {
        this.loadMoreSequences()
      }
    },

    loadMoreSequences () {
      this.displayMoreSequences()
      this.$nextTick(this.resizeHeaders)
    },

    setScrollPosition (scrollPosition) {
      if (this.$refs.body) {
        this.$refs.body.scrollTop = scrollPosition
      }
    },

    resizeHeaders () {
      if (this.$refs['body-tbody'] &&
          this.$refs['body-tbody'].children.length > 0) {
        const sequenceWidth =
          this.$refs['body-tbody'].children[0].children[0].offsetWidth
        this.$refs['th-sequence'].style = `min-width: ${sequenceWidth}px`
      }
    },

    editPath (sequenceId) {
      return this.getPath('edit-sequence', sequenceId)
    },

    deletePath (sequenceId) {
      return this.getPath('delete-sequence', sequenceId)
    },

    taskTypePath (taskTypeId) {
      let route = {
        name: 'task-type',
        params: {
          production_id: this.currentProduction.id,
          task_type_id: taskTypeId,
          type: 'shots'
        }
      }

      if (this.isTVShow && this.currentEpisode) {
        route.name = `episode-task-type`
        route.params.episode_id = this.currentEpisode.id
      }

      return route
    },

    getPath (section, sequenceId) {
      let route = {
        name: section,
        params: {
          production_id: this.currentProduction.id
        }
      }

      if (this.isTVShow && this.currentEpisode) {
        route.name = `episode-${section}`
        route.params.episode_id = this.currentEpisode.id
      }

      if (sequenceId) {
        route.params.sequence_id = sequenceId
      }
      return route
    }
  }
}
</script>

<style lang="scss" scoped>
.episode {
  min-width: 100px;
  width: 100px;
}

.table-header {
  display: table;
  border-bottom-color: $white-grey;
  border-bottom-width: 2px;
  border-bottom-style: solid;
}

.name {
  min-width: 100px;
  width: 100px;
  font-weight: bold;
}

.name a {
  color: inherit;
}

td.name {
  font-size: 1.2em;
}

.description {
  min-width: 200px;
  width: 200px;
}

.validation {
  width: 480px;
  min-width: 480px;
  max-width: 480px;
  word-wrap: break-word;
}

.actions {
  min-width: 100px;
}

th.actions {
  padding: 0.4em;
}

.status {
  max-width: 60px;
  min-width: 60px;
}

.entities {
  max-width: 50px;
  min-width: 50px;
}

.percent {
  max-width: 50px;
  min-width: 50px;
}

.frames {
  max-width: 50px;
  min-width: 50px;
}

.seconds {
  max-width: 45px;
  min-width: 45px;
}

.minutes {
  max-width: 50px;
  min-width: 50px;
}
</style>
