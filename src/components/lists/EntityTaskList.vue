<template>
<div class="data-list">

  <div style="overflow: hidden">
    <table class="table table-header" ref="headerWrapper">
      <thead>
        <tr>
          <th class="type">
            {{ $t('tasks.fields.task_type') }}
          </th>
          <th class="status">
            {{ $t('tasks.fields.task_status') }}
          </th>
          <th class="assignees">
            {{ $t('tasks.fields.assignees') }}
          </th>
          <th class="due_date">
            {{ $t('tasks.fields.due_date') }}
          </th>
          <th class="real_start_date">
            {{ $t('tasks.fields.real_start_date') }}
          </th>
          <th class="real_end_date">
            {{ $t('tasks.fields.real_end_date') }}
          </th>
        </tr>
      </thead>
    </table>
  </div>

  <table-info
    :is-loading="isLoading"
    :is-error="isError"
  />

  <div class="table-body" style="overflow: hidden" v-scroll="onBodyScroll" v-if="entries.length > 0">
    <table class="table">
      <tbody>
        <tr v-for="task in entriesSorted()" :key="getTaskType(task).priority" :style="'background-color: ' + darkenColor(taskStatusMap[getTask(task).task_status_id].color) + ';'">
          <task-type-name
            class="type"
            :entry="getTaskType(task)"
            :production-id="currentProduction.id"
            v-if="getTaskType(task)"
          >
          </task-type-name>
          <td class="status">
            <validation-tag
              :task="getTask(task)"
              v-if="getTask(task)"
            />
          </td>
          <td class="assignees">
            <div class="flexrow">
              <div
                class="avatar-wrapper"
                :key="personId"
                v-for="personId in getAssignees(task)"
              >
                {{ personMap[personId].name }}
                <!--<people-avatar
                  class="person-avatar flexrow-item"
                  :key="task.id + '-' + personId"
                  :person="personMap[personId]"
                  :size="30"
                  :font-size="15"
                />-->
              </div>
            </div>
          </td>
          <td class="due_date">
            {{ getTask(task).due_date !== 'None' ? formatDate(getTask(task).due_date) : '' }}
          </td>
          <td class="real_start_date">
            {{ getTask(task).real_start_date !== 'None' ? formatDate(getTask(task).real_start_date) : ''}}
          </td>
          <td class="real_end_date">
            {{ getTask(task).real_end_date !== 'None' ? formatDate(getTask(task).real_end_date) : '' }}
          </td>
       </tr>
      </tbody>
    </table>
  </div>

</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import moment from 'moment-timezone'
import colors from '../../lib/colors'
import TaskTypeName from '../cells/TaskTypeName'
import TableInfo from '../widgets/TableInfo'
import ValidationTag from '../widgets/ValidationTag'
import PeopleAvatar from '../widgets/PeopleAvatar'
import LastCommentCell from '../cells/LastCommentCell'

export default {
  name: 'todos-list',

  components: {
    TableInfo,
    TaskTypeName,
    PeopleAvatar,
    ValidationTag,
    LastCommentCell
  },

  props: {
    entries: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isError: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([
      'currentProduction',
      'personMap',
      'taskMap',
      'taskTypeMap',
      'taskStatusMap'
    ])
  },

  methods: {
    ...mapActions([
    ]),

    darkenColor (color) {
      return colors.darkenColor(color)
    },

    onBodyScroll (event, position) {
      this.$refs.headerWrapper.style.left = `-${position.scrollLeft}px`
    },

    formatDate (date) {
      if (date) return moment(date).format('YYYY-MM-DD')
      else return ''
    },

    getTask (task) {
      if (typeof (task) === 'string') {
        return this.taskMap[task]
      } else {
        return task
      }
    },

    getTaskType (entry) {
      const task = this.getTask(entry)
      return task ? this.taskTypeMap[task.task_type_id] : null
    },

    getAssignees (entry) {
      const task = this.getTask(entry)
      return task ? task.assignees : []
    },

    getDueDate (entry) {
      const task = this.getTask(entry)
      return task.due_date ? this.formatDate(task.due_date) : []
    },

    getLastComment (entry) {
      const task = this.getTask(entry)
      return task ? task.id : []
    },

    entriesSorted () {
      for (var i = 0; i < this.entries.length; i++) {
        this.entries[i]['taskpriority'] = this.getTaskType(this.entries[i]).priority
      }
      return _.orderBy(this.entries, 'taskpriority')
    }
  }
}
</script>

<style lang="scss" scoped>
.data-list {
}

.type {
  max-width: 150px;
  min-width: 150px;
}

.status {
  max-width: 100px;
  min-width: 100px;
}

.assignees {
  max-width: 150px;
  min-width: 150px;
}

.due_date {
  max-width: 150px;
  min-width: 150px;
}

.real_start_date {
  max-width: 150px;
  min-width: 150px;
}

.real_end_date {
  max-width: 150px;
  min-width: 150px;
}

.last_comment {
  max-width: 200px;
  min-width: 200px;
}

.flexrow-item {
  margin-right: 0.3em;
}

.avatar-wrapper {
  margin-right: 0.5em;
}
</style>
