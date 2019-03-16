<template>
  <div class="side task-info" v-if="task">
    <div class="page-header">
      <div
        class="flexrow header-title"
      >
        <div class="title flexrow-item">
          <router-link :to="taskEntityPath">
            {{ task ? title : 'Loading...' }}
          </router-link>
        <validation-tag
          class="flexrow-item title"
          style="margin-left: 0.1em;"
          :task="task"
          :is-static="true"
        />
        </div>
        <task-type-name
          class="flexrow-item task-type"
          :task-type="currentTaskType"
          :production-id="currentProduction.id"
          v-if="currentTaskType"
        />
      </div>
      <div
        class="flexrow task-information"
      >
        <!--<button-simple
          class="flexrow-item set-thumbnail-button"
          icon="image"
          :disabled="!isSetThumbnailAllowed"
          :title="$t('tasks.set_preview')"
          @click="setCurrentPreviewAsEntityThumbnail"
          v-if="isCurrentUserManager"
        />-->
        <subscribe-button
          class="flexrow-item"
          :subscribed="isAssigned || isSubscribed"
          @click="toggleSubscribe"
          v-if="!isAssigned"
        />
      </div>
    </div>
    <button class="button is-primary" @click="newTaskVersion(task.id, user.id)">{{ $t('tasks.new_version') }}</button>

        <router-link
          class="button"
          style="float: right;"
          :to="taskPath"
        >
          {{ $t('main.history') }}
        </router-link>

    <div class="table-body" style="margin-top: 1em;">
        <table class="table">
          <tbody>
            <tr>
              <td class="field-label">{{ $t('tasks.fields.due_date') }}</td>
              <td>
                {{ formatDate(task.due_date) }}
              </td>
            </tr>
            <tr>
              <td class="field-label">{{ $t('tasks.fields.start_date') }}</td>
              <td>
                {{ formatDate(task.start_date) }}
              </td>
            </tr>
            <tr>
            <td class="field-label">{{ $t('tasks.fields.real_start_date') }}</td>
              <td>
                {{ formatDate(task.real_start_date) }}
              </td>
            </tr>
            <tr>
              <td class="field-label">{{ $t('tasks.fields.real_end_date') }}</td>
              <td>
                {{ formatDate(task.real_end_date) }}
              </td>
            </tr>
          </tbody>
      </table>
    </div>
    <div class="task-columns" ref="task-columns">
      <div class="task-column preview-column" v-if="taskPreviews && taskPreviews.length > 0">
        <div class="preview-column-content">
          <div class="preview-picture">
            <div
              v-if="isMoviePreview"
            >
              <video-player
                :preview="currentPreview"
                :entity-preview-files="taskEntityPreviews"
                :task-type-map="taskTypeMap"
                :light="true"
                @annotationchanged="onAnnotationChanged"
                ref="preview-movie"
              />
            </div>

            <div
              class="preview-standard-file"
              v-else-if="isStandardPreview"
            >
              <a
                class="button"
                ref="preview-file"
                :href="currentPreviewDlPath"
              >
                <download-icon class="icon" />
                <span class="text">
                  {{ $t('tasks.download_pdf_file', {extension}) }}
                </span>
              </a>
            </div>

            <model-viewer
              class="model-viewer"
              :preview-url="currentPreviewPath"
              :preview-dl-path="currentPreviewDlPath"
              :light="true"
              v-else-if="is3DModelPreview"
            />

            <picture-viewer
              :preview="currentPreview"
              :light="true"
              @annotation-changed="onAnnotationChanged"
              @add-preview="onAddExtraPreview"
              ref="preview-picture"
              v-else-if="isPicturePreview"
            />
            <!--<div
              class="no-preview"
              v-if="!taskPreviews || taskPreviews.length === 0"
            >
              <em>{{ $t('tasks.no_preview') }}</em>
            </div>-->
          </div>

        </div>
      </div>

      <div v-if="this.taskWorkingFiles.length > 0" class="task-column workfiles-column">
        <div>
            <h2>{{ $t('tasks.working_files') }}</h2>
            <div class="task-column workfile">
              {{ this.taskWorkingFiles[0].name }}
            </div>
            <combobox
              :label="'Version'"
              :options="taskWorkingFiles.map(obj => { var rObj = {}; rObj['label'] = obj['revision']; rObj['value'] = obj['id']; return rObj;})"
              v-model="selectedVersion"
              @input="printSelectedVersion"
            />
          <button class="button is-primary" @click="checkoutWorkingFile(selectedVersion, task.id, user.id)">{{ $t('tasks.checkout_version') }}</button>
          <button style="float: right; background-color: #c51515;" class="button is-primary" @click="deleteWorkingFile(selectedVersion)">{{ $t('tasks.delete_version') }}</button>
        </div>
      </div>

      <div class="task-column comments-column">
        <div>
          <div>
            <add-comment
              ref="add-comment"
              :user="user"
              :task="task"
              :task-status="taskStatusForCurrentUser"
              :light="true"
              :is-loading="loading.addComment"
              :attached-file-name="attachedFileName"
              :is-error="errors.addComment"
              @add-comment="addComment"
              @add-preview="onAddPreviewClicked"
              @file-drop="selectFile"
              v-if="isCommentingAllowed"
            />

            <div
              class="comments"
              v-if="taskComments.length > 0 && !loading.task"
            >
              <comment
                :key="'comment' + comment.id"
                :comment="comment"
                :light="true"
                :add-preview="onAddPreviewClicked"
                v-for="comment in taskComments"
              />
            </div>
            <div class="no-comment" v-else-if="!loading.task">
              <em>
                {{ $t('tasks.no_comment')}}
              </em>
            </div>
          </div>
        </div>

        <div class="has-text-centered" v-if="loading.task">
          <spinner />
        </div>
      </div>
    </div>

    <add-preview-modal
      ref="add-preview-modal"
      :active="modals.addPreview"
      :is-loading="loading.addPreview"
      :is-error="errors.addPreview"
      @cancel="onClosePreview"
      @fileselected="selectFile"
      @confirm="onClosePreview"
    />

    <add-preview-modal
      ref="add-extra-preview-modal"
      :active="modals.addExtraPreview"
      :is-loading="loading.addExtraPreview"
      :is-error="errors.addExtraPreview"
      :form-data="addExtraPreviewFormData"
      extensions=".png,.jpg"
      @cancel="onCloseExtraPreview"
      @fileselected="selectFile"
      @confirm="createExtraPreview"
    />

  </div>
  <div class="side task-info has-text-centered" v-else>
    No task selected.
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment-timezone'
import {
  ChevronLeftIcon,
  DownloadIcon,
  ImageIcon
} from 'vue-feather-icons'
import {
  getTaskEntityPath,
  getTaskPath,
  getTaskTypeStyle
} from '../../lib/helpers'

import filesApi from '../../store/api/files'
import tasksApi from '../../store/api/tasks'
import AddComment from '../widgets/AddComment'
import AddPreviewModal from '../modals/AddPreviewModal'
import ButtonLink from '../widgets/ButtonLink'
import ButtonSimple from '../widgets/ButtonSimple'
import Combobox from '../widgets/Combobox'
import Comment from '../widgets/Comment'
import ModelViewer from '../previews/ModelViewer'
import PeopleName from '../widgets/PeopleName'
import PictureViewer from '../previews/PictureViewer'
import Spinner from '../widgets/Spinner'
import SubscribeButton from '../widgets/SubscribeButton'
import TaskTypeName from '../widgets/TaskTypeName'
import ValidationTag from '../widgets/ValidationTag'
import VideoPlayer from '../previews/VideoPlayer'

export default {
  name: 'task-info',
  components: {
    AddComment,
    Combobox,
    AddPreviewModal,
    ButtonLink,
    ButtonSimple,
    Comment,
    ChevronLeftIcon,
    DownloadIcon,
    ImageIcon,
    ModelViewer,
    PeopleName,
    PictureViewer,
    Spinner,
    SubscribeButton,
    TaskTypeName,
    ValidationTag,
    VideoPlayer
  },

  props: {
    task: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      addExtraPreviewFormData: null,
      selectedVersion: '',
      addExtraPreviewData: null,
      attachedFileName: '',
      currentPreviewPath: '',
      currentPreviewDlPath: '',
      isSubscribed: false,
      taskComments: [],
      taskWorkingFiles: [],
      uniqueWorkingFileNames: [],
      taskPreviews: [],
      errors: {
        addComment: false,
        addPreview: false,
        addExtraPreview: false,
        task: false
      },
      loading: {
        addComment: false,
        addPreview: false,
        addExtraPreview: false,
        task: false
      },
      modals: {
        addPreview: false,
        addExtraPreview: false
      },
      otherPreviews: []
    }
  },

  mounted () {
    this.loadTaskData()
  },

  computed: {
    ...mapGetters([
      'currentEpisode',
      'currentProduction',
      'getTaskComment',
      'getTaskComments',
      'getTaskWorkingFile',
      'getTaskWorkingFiles',
      'getTaskPreviews',
      'isCurrentUserManager',
      'isSingleEpisode',
      'isTVShow',
      'personMap',
      'previewFormData',
      'taskEntityPreviews',
      'taskStatusForCurrentUser',
      'taskTypeMap',
      'user'
    ]),

    title () {
      if (this.task) {
        const type = this.task.entity_type_name
        let entityName =
          this.task.full_entity_name || this.task.entity_name
        if (this.isSingleEpisode && type === 'Shot') {
          entityName = entityName
            .split('/')
            .splice(1)
            .join('/')
        }
        return `${entityName}`
      } else {
        return 'Loading...'
      }
    },

    isAssigned () {
      if (this.task) {
        return this.task.assignees.some((assigneeId) => {
          return assigneeId === this.user.id
        })
      } else {
        return false
      }
    },

    isCommentingAllowed () {
      return this.isCurrentUserManager || this.task.assignees.find(
        (personId) => personId === this.user.id
      )
    },

    isSetThumbnailAllowed () {
      return this.currentPreviewId &&
        this.task &&
        this.task.entity &&
        this.currentPreviewId !== this.task.entity.preview_file_id
    },

    currentTaskType () {
      return this.task ? this.taskTypeMap[this.task.task_type_id] : null
    },

    currentPreview () {
      return this.taskPreviews &&
        this.taskPreviews.length > 0 ? this.taskPreviews[0] : null
    },

    currentPreviewId () {
      return this.taskPreviews &&
        this.taskPreviews.length > 0 ? this.taskPreviews[0].id : null
    },

    extension () {
      return this.taskPreviews &&
        this.taskPreviews.length > 0 ? this.taskPreviews[0].extension : ''
    },

    isStandardPreview () {
      return this.taskPreviews && this.taskPreviews.length > 0 &&
        ['pdf', 'ma', 'mb', 'rar', 'zip', 'blend'].includes(this.extension)
    },

    isMoviePreview () {
      if (this.taskPreviews && this.taskPreviews.length > 0) {
        let currentPreview = this.taskPreviews[0]
        return currentPreview && currentPreview.extension === 'mp4'
      } else {
        return false
      }
    },

    isPicturePreview () {
      return this.taskPreviews &&
       this.taskPreviews.length > 0 && this.extension === 'png'
    },

    is3DModelPreview () {
      return this.taskPreviews &&
       this.taskPreviews.length > 0 && this.extension === 'obj'
    },

    moviePath () {
      let previewId = null
      if (!previewId && this.taskPreviews && this.taskPreviews.length > 0) {
        previewId = this.taskPreviews[0].id
      }
      return `/api/movies/originals/preview-files/${previewId}.mp4`
    },

    taskStatusOptionsForCurrentUser () {
      if (this.isCurrentUserManager) {
        return this.taskStatusOptions
      } else {
        return this.taskStatusOptions.filter(status => status.isArtistAllowed)
      }
    },

    tasktypeStyle () {
      return getTaskTypeStyle(this.task)
    },

    taskPath () {
      return getTaskPath(
        this.task,
        this.currentProduction,
        this.isTVShow,
        this.currentEpisode,
        this.taskTypeMap
      )
    },

    taskEntityPath () {
      const episodeId = this.$route.params.episode_id
      return getTaskEntityPath(this.task, episodeId)
    }
  },

  methods: {
    ...mapActions([
      'addCommentExtraPreview',
      'commentTask',
      'commentTaskWithPreview',
      'loadPreviewFileFormData',
      'loadTask',
      'loadTaskComments',
      'loadTaskSubscribed',
      'refreshPreview',
      'setPreview',
      'subscribeToTask',
      'unsubscribeFromTask',
      'updatePreviewAnnotation',
      'loadTaskWorkingFiles'
    ]),

    formatDate (date) {
      if (date) return moment(date).format('YYYY-MM-DD')
      else return ''
    },

    loadTaskData () {
      if (this.task) {
        this.loading.task = true
        this.errors.task = false
        this.loadTaskComments({
          taskId: this.task.id,
          entityId: this.task.entity_id,
          callback: (err) => {
            if (err) {
              console.log(err)
              this.errors.task = true
            } else {
              this.loadTaskSubscribed({
                taskId: this.task.id,
                callback: (err, subscribed) => {
                  if (err) console.log(err)
                  this.loading.task = false
                  this.reset()
                  this.isSubscribed = subscribed
                }
              })
            }
          }
        })

        this.loadTaskWorkingFiles({
          taskId: this.task.id,
          callback: (err) => {
            this.loading.task = false
            if (err) {
              console.log(err)
              this.errors.task = true
            } else {
              this.reset()
            }
          }
        })
      }
    },

    editPath (taskId) {
      return this.getPath('edit-task', taskId)
    },

    deletePath (taskId) {
      return this.getPath('delete-task', taskId)
    },

    newTaskVersion (taskId, userId) {
      let newVersion = tasksApi.newTaskVersion(taskId, userId)
      this.reset()
      return newVersion
    },

    checkoutWorkingFile (workingFileId, taskId, userId) {
      filesApi.checkoutWorkingFile(workingFileId, taskId, userId)
      return true
    },

    deleteWorkingFile (workingFileId) {
      console.log(workingFileId)
      filesApi.deleteWorkingFile(workingFileId)
      return true
    },

    printSelectedVersion () {
      console.log(this.selectedVersion)
    },

    getPath (section, taskId) {
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

      if (taskId) {
        route.params.task_id = taskId
      }

      return route
    },

    addComment (comment, taskStatusId) {
      const finalize = (err, preview) => {
        if (err) {
          this.errors.addComment = true
        } else {
          this.$refs['add-preview-modal'].reset()
          this.reset()
          this.attachedFileName = ''
        }
        this.loading.addComment = false
      }
      const params = {
        taskId: this.task.id,
        taskStatusId: taskStatusId,
        commentText: comment,
        comment: comment,
        callback: finalize
      }
      this.loading.addComment = true
      this.errors.addComment = false
      if (this.attachedFileName) {
        this.commentTaskWithPreview(params)
      } else {
        this.commentTask(params)
      }
    },

    reset () {
      this.taskComments = this.getTaskComments(this.task.id)
      this.taskWorkingFiles = this.getTaskWorkingFiles(this.task.id)
      this.taskPreviews = this.getTaskPreviews(this.task.id)
      this.setOtherPreviews()
      this.currentPreviewPath = this.getOriginalPath()
      this.currentPreviewDlPath = this.getOriginalDlPath()
      this.$nextTick(() => {
        if (this.$refs['add-comment']) this.$refs['add-comment'].focus()
      })
    },

    getOriginalPath () {
      let previewId = this.currentPreviewId
      const extension = this.extension ? this.extension : 'png'
      return `/api/pictures/originals/preview-files/${previewId}.${extension}`
    },

    getOriginalDlPath () {
      let previewId = this.currentPreviewId
      return `/api/pictures/originals/preview-files/${previewId}/download`
    },

    setOtherPreviews () {
      this.otherPreviews = this.taskPreviews.filter((p) => {
        return (
          p.id !== this.currentPreviewId &&
          p.extension === 'mp4'
        )
      })
      return this.otherPreviews
    },

    selectFile (formData) {
      this.loadPreviewFileFormData(formData)
      this.attachedFileName = formData.get('file').name
    },

    createExtraPreview () {
      this.errors.addExtraPreview = false
      this.loading.addExtraPreview = true
      this.addCommentExtraPreview({
        taskId: this.task.id,
        commentId: this.taskComments[0].id,
        previewId: this.taskPreviews[0].id,
        callback: (err, preview) => {
          this.loading.addExtraPreview = false
          if (err) {
            this.errors.addExtraPreview = true
          } else {
            this.$refs['add-extra-preview-modal'].reset()
            this.reset()
            setTimeout(() => {
              this.$refs['preview-picture'].displayLast()
            }, 0)
            this.modals.addExtraPreview = false
          }
        }
      })
    },

    onPreviewAdded (eventData) {
      const taskId = eventData.task_id
      const commentId = eventData.comment_id
      const previewId = eventData.preview_file_id
      const revision = eventData.revision
      const extension = eventData.extension
      const comment = this.$store.getters.getTaskComment(taskId, commentId)

      if (
        comment &&
        (
          comment.previews.length === 0 ||
          comment.previews[0].id !== previewId
        ) &&
        taskId === this.task.id
      ) {
        this.$store.commit('ADD_PREVIEW_END', {
          preview: {
            id: previewId,
            revision,
            extension: extension
          },
          taskId,
          commentId,
          comment
        })
        this.reset()
      }
    },

    onAnnotationChanged ({ preview, annotations }) {
      const taskId = this.task.id
      this.updatePreviewAnnotation({ taskId, preview, annotations })
    },

    onAddPreviewClicked (comment) {
      this.modals.addPreview = true
    },

    onAddExtraPreview () {
      this.modals.addExtraPreview = true
    },

    onClosePreview () {
      this.modals.addPreview = false
    },

    onCloseExtraPreview () {
      this.modals.addExtraPreview = false
    },

    setCurrentPreviewAsEntityThumbnail () {
      this.setPreview({
        taskId: this.task.id,
        entityId: this.task.entity.id,
        previewId: this.currentPreviewId,
        callback: () => {}
      })
    },

    toggleSubscribe () {
      if (this.task && !this.isAssigned) {
        if (this.isSubscribed) {
          this.unsubscribeFromTask(this.task.id)
          this.isSubscribed = false
        } else {
          this.subscribeToTask(this.task.id)
          this.isSubscribed = true
        }
      }
    }
  },

  watch: {
    task () {
      this.attachedFileName = ''
      this.loadTaskData()
    }
  },

  socket: {
    events: {
      'preview-file:add-file' (eventData) {
        this.onPreviewAdded(eventData)
      },

      'preview_file:update' (eventData) {
        const preview = this.taskPreviews.filter((preview) => {
          return preview.id === eventData.preview_file_id
        })
        if (preview) {
          this.refreshPreview({
            taskId: this.task.id,
            previewId: eventData.preview_file_id
          }).then(() => {
            if (this.$refs['preview-movie']) {
              if (!this.$refs['preview-movie'].isDrawing) {
                this.$refs['preview-movie'].reloadAnnotations()
              }
            } else if (this.$refs['preview-picture']) {
              if (!this.$refs['preview-picture'].isDrawing) {
                this.$refs['preview-picture'].reset()
              }
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dark .add-comment,
.dark .comment,
.dark .preview-column-content,
.dark .no-comment {
  background: #46494F;
  border-color: $dark-grey;
  box-shadow: 0px 0px 6px #333;
}

.dark .no-preview {
  padding: 0.5em;
}

.dark .preview-picture {
  border: 1px solid $dark-grey;
}

.dark .side {
  background: #36393F;
}

.side {
  background: #F8F8F8;
  height: 100%;
}

.add-comment {
  padding: 0.5em;
  margin-bottom: 0.5em;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.task_info_due_date {
  margin: 10px;
  margin-left: 0px;
}

.page-header {
  padding: 0;
  margin-top: 0;
}

.header-title .flexrow-item {
  margin-bottom: 0.5em;
}

.title {
  margin: 0;
  flex: 1;
  font-size: 1.3em;
  line-height: 1.5em;
}

.title a {
  color: inherit;
}

.history-button {
  color: $white-grey;
  flex: 1;
}

.no-comment {
  background: white;
  padding: 1em;
  border-radius: 5px;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.task-columns {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.task-column {
  margin-top: 1em;
}
.title {
  font-size: 1.3em;
  line-height: 1.5em;
}

.comment {
  border-top: 1px solid $white-grey;
  border-bottom: 1px solid $white-grey;
  border-right: 1px solid $white-grey;
  margin-top: 0.1em;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.dark .workfiles-column {
  background: #46494F;
  border-color: #25282E;
  box-shadow: 0px 0px 6px #333;
}

.workfile {
  background: #4E5159;
  border-color: #25282E;
  color: #EEEEEE;
  border-radius: 3px;
  margin-left: 0.1em;
  margin-top: 0.3em;
  padding: 0.3em;
  border: 1px solid #25282E;
}

.workfiles-column {
  border-radius: 5px;
  padding: 0.5em;
  margin-bottom: 0.5em;
}

.add-preview-button {
  margin-top: 0.5em;
  width: 100%;
}

.no-comment {
  background: white;
  box-shadow: 0px 0px 6px #E0E0E0;
}

.comments {
  padding-bottom: 1em;
}

.preview-colum-content {
  box-shadow: 0px 0px 6px #E0E0E0;
}

.preview-standard-file {
  text-align: center;
  padding: 1em;
}

.model-viewer {
  padding: 0.3em;
}

.set-thumbnail-button {
  margin-right: 0.2em;
}
.dark .table-body {
  border: 1px solid $dark-grey;
}
</style>
