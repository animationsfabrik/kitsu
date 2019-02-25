<template>
  <div class="sequences page fixed-page">
    <div class="sequence-list-header page-header">
      <div class="level header-title">
        <div class="level-left filters-area">
          <search-field
            ref="sequence-search-field"
            @change="onSearchChange"
          />
        </div>
      </div>
    </div>
    <gantt class="left-container" :tasks="gantttasks"></gantt>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { SearchIcon } from 'vue-feather-icons'
import SequenceList from './lists/SequenceList.vue'
import DeleteModal from './widgets/DeleteModal'
import EditSequenceModal from './modals/EditSequenceModal'
import PageTitle from './widgets/PageTitle'
import SearchField from './widgets/SearchField'
import Gantt from './widgets/Gantt'

export default {
  name: 'production-planning',

  components: {
    SequenceList,
    EditSequenceModal,
    DeleteModal,
    PageTitle,
    SearchField,
    SearchIcon,
    Gantt
  },

  data () {
    return {
      initialLoading: true,
      modals: {
        isNewDisplayed: false,
        isDeleteDisplayed: false
      },
      loading: {
        edit: false,
        del: false
      },
      errors: {
        edit: false,
        del: false
      },
      sequenceToDelete: null,
      sequenceToEdit: null,

      gantttasks: {
        data: [
          { id: 1, text: 'Task #1', start_date: '15_04_2017', duration: 3, progress: 0.6 },
          { id: 2, text: 'Task #2', start_date: '18_04_2017', duration: 3, progress: 0.4 }
        ],
        links: [
          { id: 1, source: 1, target: 2, type: '0' }
        ]
      }
    }
  },

  computed: {
    ...mapGetters([
      'currentEpisode',
      'currentProduction',
      'displayedSequences',
      'isCurrentUserManager',
      'isShotsLoading',
      'isShotsLoadingError',
      'isTVShow',
      'sequences',
      'sequenceMap',
      'sequencesPath',
      'sequenceStats',
      'sequenceSearchText',
      'sequenceListScrollPosition',
      'shotValidationColumns'
    ])
  },

  mounted () {
    setTimeout(() => {
      this.initSequences()
        .then(this.handleModalsDisplay)
        .then(this.resizeHeaders)
        .then(() => {
          this.initialLoading = false
        })
      this.setDefaultSearchText()
      this.setDefaultListScrollPosition()
    }, 100)
  },

  methods: {
    ...mapActions([
      'computeSequenceStats',
      'deleteSequence',
      'editSequence',
      'hideAssignations',
      'initSequences',
      'loadComment',
      'setLastProductionScreen',
      'setSequenceSearch',
      'setSequenceListScrollPosition',
      'showAssignations'
    ]),

    setDefaultSearchText () {
      if (this.sequenceSearchText.length > 0) {
        this.$refs['sequence-search-field'].setValue(this.sequenceSearchText)
      }
    },

    setDefaultListScrollPosition () {
      if (this.$refs['sequence-list']) {
        this.$refs['sequence-list'].setScrollPosition(
          this.sequenceListScrollPosition
        )
      }
    },

    navigateToList () {
      this.$router.push(this.sequencesPath)
    },

    confirmEditSequence (form) {
      this.loading.edit = true
      this.errors.edit = false

      this.editSequence(form)
        .then(() => {
          this.loading.edit = false
          this.resizeHeaders()
          this.navigateToList()
        }).catch(() => {
          this.loading.edit = false
          this.errors.edit = true
        })
    },

    confirmDeleteSequence () {
      this.loading.del = true
      this.deleteSequence(this.sequenceToDelete)
        .then(() => {
          this.loading.del = false
          this.resizeHeaders()
          this.navigateToList()
        }).catch(() => {
          this.loading.del = false
          this.errors.del = true
        })
    },

    resetEditModal () {
      const form = {
        name: ''
      }
      if (this.sequences.length > 0) {
        form.sequence_id = this.sequences[0].id
      }
      if (this.openProductions.length > 0) {
        form.production_id = this.openProductions[0].id
      }
      this.sequenceToEdit = form
    },

    deleteText () {
      const sequence = this.sequenceToDelete
      if (sequence) {
        return this.$t('sequences.delete_text', { name: sequence.name })
      } else {
        return ''
      }
    },

    handleModalsDisplay () {
      const path = this.$store.state.route.path
      const sequenceId = this.$store.state.route.params.sequence_id
      this.errors = {
        edit: false,
        delete: false
      }

      this.modals = {
        isNewDisplayed: false,
        isDeleteDisplayed: false
      }

      if (path.indexOf('edit') > 0) {
        this.sequenceToEdit = this.sequenceMap[sequenceId]
        this.modals.isNewDisplayed = true
      } else if (path.indexOf('delete') > 0) {
        this.sequenceToDelete = this.sequenceMap[sequenceId]
        this.modals.isDeleteDisplayed = true
      }
    },

    onSearchChange (event) {
      const searchQuery = this.$refs['sequence-search-field'].getValue()
      this.setSequenceSearch(searchQuery)
    },

    saveScrollPosition (scrollPosition) {
      this.setSequenceListScrollPosition(scrollPosition)
    },

    resizeHeaders () {
      setTimeout(() => {
        if (this.$refs['sequence-list']) {
          this.$refs['sequence-list'].resizeHeaders()
        }
      }, 0)
    }
  },

  watch: {
    $route () { this.handleModalsDisplay() },

    currentProduction () {
      this.$refs['sequence-search-field'].setValue('')
      this.$store.commit('SET_SEQUENCE_LIST_SCROLL_POSITION', 0)

      if (!this.isTVShow) {
        this.initSequences()
          .then(this.handleModalsDisplay)
          .then(this.resizeHeaders)
      }
    },

    currentEpisode () {
      if (this.isTVShow && this.currentEpisode) {
        this.initSequences()
          .then(this.handleModalsDisplay)
          .then(this.resizeHeaders)
          .then(() => {
            this.initialLoading = false
          })
      }
    }
  },

  socket: {
    events: {
      'comment:new' (eventData) {
        const commentId = eventData.comment_id
        this.loadComment({
          commentId,
          callback: () => {
            this.computeSequenceStats()
          }
        })
      }
    }
  },

  metaInfo () {
    if (this.isTVShow) {
      return {
        title: `${this.currentProduction ? this.currentProduction.name : ''}` +
               ` - ${this.currentEpisode ? this.currentEpisode.name : ''}` +
               ` | ${this.$t('sequences.title')} - Kitsu`
      }
    } else {
      return {
        title: `${this.currentProduction ? this.currentProduction.name : ''}` +
               ` ${this.$t('sequences.title')} - Kitsu`
      }
    }
  }

}
</script>

<style scoped>
.data-list {
  margin-top: 0;
}

.filters-area {
  margin-bottom: 2em;
}

.left-container {
  flex: 1;
}
</style>
