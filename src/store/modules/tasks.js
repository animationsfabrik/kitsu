import async from 'async'

import tasksApi from '../api/tasks'
import peopleApi from '../api/people'
import playlistsApi from '../api/playlists'
import { sortByName, sortValidationColumns } from '../../lib/sorting'
import personStore from './people'
import taskTypeStore from './tasktypes'

import {
  LOAD_ASSETS_START,
  LOAD_SHOTS_START,
  LOAD_ASSETS_END,
  LOAD_SHOTS_END,

  LOAD_TASK_END,
  LOAD_TASK_STATUSES_END,
  LOAD_TASK_COMMENTS_END,
  LOAD_TASK_WORKING_FILES_END,
  LOAD_TASK_ENTITY_PREVIEW_FILES_END,
  LOAD_TASK_SUBSCRIBE_END,
  LOAD_SEQUENCE_SUBSCRIBE_END,

  NEW_TASK_COMMENT_END,
  NEW_TASK_END,
  EDIT_TASK_END,

  NEW_TASK_WORKING_FILE_END,

  CREATE_TASKS_END,
  DELETE_TASK_END,
  EDIT_COMMENT_END,
  DELETE_COMMENT_END,

  PREVIEW_FILE_SELECTED,
  ADD_PREVIEW_START,
  ADD_PREVIEW_END,
  CHANGE_PREVIEW_END,
  UPDATE_PREVIEW_ANNOTATION,

  ADD_SELECTED_TASK,
  ADD_SELECTED_TASKS,
  REMOVE_SELECTED_TASK,
  CLEAR_SELECTED_TASKS,
  ASSIGN_TASKS,
  UNASSIGN_TASKS,

  SET_PREVIEW,
  SET_IS_SHOW_ASSIGNATIONS,
  SET_IS_SHOW_TASKS,
  SET_IS_SHOW_DUE_DATES,
  SET_IS_SHOW_INFOS,
  SET_IS_SHOW_SEQUENCE_STATS,
  SET_DISPLAYED_TASKS,
  DELETE_PREVIEW_END,

  LOAD_PERSON_TASKS_END,
  USER_LOAD_TODOS_END,

  SAVE_TASK_SEARCH_END,
  REMOVE_TASK_SEARCH_END,

  RESET_ALL
} from '../mutation-types'

const initialState = {
  taskMap: {},
  taskStatusMap: {},
  assetValidationColumns: [],
  shotValidationColumns: [],

  taskStatuses: [],
  taskComments: {},
  taskWorkingFiles: {},
  taskPreviews: {},
  taskEntityPreviews: {},
  selectedTasks: {},
  selectedValidations: {},
  taskSearchQueries: [],

  dueDate: 5,

  nbSelectedTasks: 0,
  nbSelectedValidations: 0,
  isShowAssignations: true,
  isShowTasks: true,
  isShowDueDates: true,
  isShowInfos: true,
  isShowSequenceStats: true,

  isSavingCommentPreview: false,
  previewFormData: null
}

const state = {
  ...initialState
}

const helpers = {
  getPerson (personId) {
    return personStore.getters.getPerson(
      personStore.state, personStore.getters
    )(personId)
  },

  getTaskType (taskTypeId) {
    return taskTypeStore.state.taskTypeMap[taskTypeId]
  }
}

const getters = {
  taskMap: (state) => state.taskMap,
  getTaskComments: (state, getters) => (id) => state.taskComments[id],
  getTaskWorkingFiles: (state, getters) => (id) => state.taskWorkingFiles[id],
  getTaskPreviews: (state, getters) => (id) => state.taskPreviews[id],

  getTaskComment: (state, getters) => (taskId, commentId) => {
    return state.taskComments[taskId].find(
      (comment) => comment.id === commentId
    )
  },

  getTaskWorkingFile: (state, getters) => (taskId, workingFileId) => {
    return state.taskWorkingFiles[taskId].find(
      (workingFile) => workingFile.id === workingFileId
    )
  },

  getTaskStatus: (state, getters) => (id) => {
    return state.taskStatuses.find(
      (taskStatus) => taskStatus.id === id
    )
  },

  taskStatusOptions: state => state.taskStatuses.map((status) => {
    return {
      label: status.short_name,
      value: status.id,
      color: status.color,
      isArtistAllowed: status.is_artist_allowed
    }
  }),

  selectedTasks: state => state.selectedTasks,
  nbSelectedTasks: state => state.nbSelectedTasks,
  nbSelectedValidations: state => state.nbSelectedValidations,
  taskSearchQueries: state => state.taskSearchQueries,
  isShowAssignations: state => state.isShowAssignations,
  isShowTasks: state => state.isShowTasks,
  isShowDueDates: state => state.isShowDueDates,
  isShowInfos: state => state.isShowInfos,
  isShowSequenceStats: state => state.isShowSequenceStats,
  displayedTasks: state => state.displayedTasks,
  taskEntityPreviews: state => state.taskEntityPreviews,
  previewFormData: state => state.previewFormData,
  isSavingCommentPreview: state => state.isSavingCommentPreview,
  dueDate: state => state.dueDate,

  assetValidationColumns: (state, getters) => {
    return sortValidationColumns(
      Object.values(state.assetValidationColumns), getters.taskTypeMap
    )
  },

  shotValidationColumns: (state, getters) => {
    return sortValidationColumns(
      Object.values(state.shotValidationColumns), getters.taskTypeMap
    )
  }
}

const actions = {
  loadTaskStatuses ({ commit, state }, callback) {
    tasksApi.getTaskStatuses((err, taskStatus) => {
      if (!err) commit(LOAD_TASK_STATUSES_END, taskStatus)
      if (callback) callback(err)
    })
  },

  loadTask ({ commit, state }, { taskId, callback }) {
    tasksApi.getTask(taskId, (err, task) => {
      if (!err) {
        commit(LOAD_TASK_END, task)
      }
      if (callback) callback(err, task)
    })
  },

  loadTaskSubscribed ({ commit, state }, { taskId, callback }) {
    tasksApi.getTaskSubscribed(taskId, (err, subscribed) => {
      if (!err) {
        commit(LOAD_TASK_SUBSCRIBE_END, { taskId, subscribed })
      }
      if (callback) callback(err, subscribed)
    })
  },

  subscribeToTask ({ commit, state }, taskId) {
    return new Promise((resolve, reject) => {
      tasksApi.subscribeToTask(taskId, (err) => {
        if (err) {
          reject(err)
        } else {
          commit(LOAD_TASK_SUBSCRIBE_END, { taskId, subscribed: true })
          resolve()
        }
      })
    })
  },

  subscribeToSequence ({ commit, state }, { sequenceId, taskTypeId }) {
    return new Promise((resolve, reject) => {
      tasksApi.subscribeToSequence(sequenceId, taskTypeId, (err) => {
        if (err) {
          reject(err)
        } else {
          commit(LOAD_SEQUENCE_SUBSCRIBE_END, {
            sequenceId,
            taskTypeId,
            subscribed: true
          })
          resolve()
        }
      })
    })
  },

  unsubscribeFromTask ({ commit, state }, taskId) {
    return new Promise((resolve, reject) => {
      tasksApi.unsubscribeFromTask(taskId, (err) => {
        if (err) {
          reject(err)
        } else {
          commit(LOAD_TASK_SUBSCRIBE_END, { taskId, subscribed: false })
          resolve()
        }
      })
    })
  },

  unsubscribeFromSequence ({ commit, state }, { sequenceId, taskTypeId }) {
    return new Promise((resolve, reject) => {
      tasksApi.unsubscribeFromSequence(sequenceId, taskTypeId, (err) => {
        if (err) {
          reject(err)
        } else {
          commit(LOAD_SEQUENCE_SUBSCRIBE_END, {
            sequenceId,
            taskTypeId,
            subscribed: false
          })
          resolve()
        }
      })
    })
  },

  loadTaskComments (
    { commit, state, dispatch },
    { taskId, entityId, callback }
  ) {
    tasksApi.getTaskComments(taskId, (err, comments) => {
      if (err) {
        callback(err)
      } else {
        commit(LOAD_TASK_COMMENTS_END, { comments, taskId })
        dispatch('loadTaskEntityPreviewFiles', { callback, entityId })
      }
    })
  },

  loadTaskWorkingFiles (
    { commit, state },
    { taskId, callback }
  ) {
    tasksApi.getTaskWorkingFiles(taskId, (err, workingFiles) => {
      if (err) {
        callback(err)
      } else {
        commit(LOAD_TASK_WORKING_FILES_END, { workingFiles, taskId })
      }
    })
  },

  loadTaskEntityPreviewFiles ({ commit, state }, { callback, entityId }) {
    const entity = { id: entityId }
    playlistsApi.getEntityPreviewFiles(entity, (err, previewFiles) => {
      commit(LOAD_TASK_ENTITY_PREVIEW_FILES_END, previewFiles)
      if (callback) callback(err)
    })
  },

  commentTask ({ commit, state }, { taskId, taskStatusId, comment, callback }) {
    tasksApi.commentTask({ taskId, taskStatusId, comment }, (err, comment) => {
      if (!err) {
        commit(NEW_TASK_COMMENT_END, { comment, taskId })
      }
      if (callback) callback(err, comment)
    })
  },

  loadComment ({ commit, state }, { commentId, callback }) {
    tasksApi.getTaskComment({ id: commentId }, (err, comment) => {
      if (!err) {
        commit(NEW_TASK_COMMENT_END, { comment, taskId: comment.object_id })
      }
      if (callback) callback(err, comment)
    })
  },

  loadWorkingFile ({ commit, state }, { workingFileId, callback }) {
    tasksApi.getTaskWorkingFile({ id: workingFileId }, (err, workingFile) => {
      if (!err) {
        commit(NEW_TASK_WORKING_FILE_END, { workingFile, taskId: workingFile.object_id })
      } else { console.log(err) }
      if (callback) callback(err, workingFile)
    })
  },

  createTasks (
    { commit, state },
    payload
  ) {
    const data = {
      task_type_id: payload.task_type_id,
      type: payload.type,
      project_id: payload.project_id
    }
    tasksApi.createTasks(data, (err, tasks) => {
      if (payload.callback) payload.callback(err, tasks)
    })
  },

  createSelectedTasks (
    { commit, state },
    { type, projectId, callback }
  ) {
    async.eachSeries(Object.keys(state.selectedValidations), (key, next) => {
      const validationInfo = state.selectedValidations[key]
      const data = {
        entity_id: validationInfo.entity.id,
        task_type_id: validationInfo.column.id,
        type: type,
        project_id: projectId
      }
      tasksApi.createTask(data, (err, tasks) => {
        commit(CREATE_TASKS_END, tasks)
        tasks.forEach((task) => {
          commit(REMOVE_SELECTED_TASK, validationInfo)
          task.assigneesInfo = []
          validationInfo.task = task
          commit(ADD_SELECTED_TASK, validationInfo)
        })
        next(err, tasks[0])
      })
    }, callback)
  },

  deleteSelectedTasks ({ commit, state }) {
    return new Promise((resolve, reject) => {
      const selectedTaskIds = Object.keys(state.selectedTasks)
      async.eachSeries(selectedTaskIds, (taskId, next) => {
        const task = state.taskMap[taskId]
        tasksApi.deleteTask(task, (err) => {
          if (!err) commit(DELETE_TASK_END, task)
          next(err)
        })
      }, (err) => {
        if (err) reject(err)
        else {
          resolve()
        }
      })
    })
  },

  deleteAllTasks ({ commit, state }, { projectId, taskTypeId }) {
    return new Promise((resolve, reject) => {
      tasksApi.deleteAllTasks(projectId, taskTypeId, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  },

  createTask (
    { commit, state, rootGetters },
    { entityId, projectId, taskTypeId, type }
  ) {
    return new Promise((resolve, reject) => {
      const data = {
        entity_id: entityId,
        task_type_id: taskTypeId,
        type: type,
        project_id: projectId
      }
      tasksApi.createTask(data, (err, tasks) => {
        if (err) {
          reject(err)
        } else {
          commit(NEW_TASK_END, tasks[0])
          resolve()
        }
      })
    })
  },

  changeSelectedTaskStatus ({ commit, state }, { taskStatusId, callback }) {
    async.eachSeries(Object.keys(state.selectedTasks), (taskId, next) => {
      const task = state.taskMap[taskId]
      if (task && task.task_status_id !== taskStatusId) {
        actions.commentTask({ commit, state }, {
          taskId: taskId,
          taskStatusId: taskStatusId,
          comment: '',
          callback: (err) => {
            next(err)
          }
        })
      } else {
        next()
      }
    }, (err) => {
      commit(CLEAR_SELECTED_TASKS)
      callback(err)
    })
  },

  changeSelectedPriorities (
    { commit, state, rootGetters },
    { priority, callback }
  ) {
    async.eachSeries(Object.keys(state.selectedTasks), (taskId, next) => {
      const task = state.taskMap[taskId]
      const taskType = rootGetters.taskTypeMap[task.task_type_id]

      if (task && task.priority !== priority) {
        tasksApi.updateTask(taskId, { priority }, (err, task) => {
          if (!err) {
            commit(EDIT_TASK_END, { task, taskType })
          }
          next(err)
        })
      } else {
        next()
      }
    }, (err) => {
      callback(err)
    })
  },

  changeSelectedDueDates ({ commit, state, rootGetters }, duedate) {
    return new Promise((resolve, reject) => {
      async.eachSeries(Object.keys(state.selectedTasks), (taskId, next) => {
        const task = state.taskMap[taskId]
        const taskType = rootGetters.taskTypeMap[task.task_type_id]

        if (task && task.due_date !== duedate) {
          tasksApi.updateTask(taskId, { 'due_date': duedate }, (err, task) => {
            if (!err) {
              commit(EDIT_TASK_END, { task, taskType })
            }
            next(err)
          })
        } else {
          next()
        }
      }, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  },

  changeSelectedEstimations ({ commit, state, rootGetters }, estimation) {
    return new Promise((resolve, reject) => {
      async.eachSeries(Object.keys(state.selectedTasks), (taskId, next) => {
        const task = state.taskMap[taskId]
        const taskType = rootGetters.taskTypeMap[task.task_type_id]
        if (task && task.estimation !== estimation) {
          tasksApi.updateTask(taskId, { estimation }, (err, task) => {
            if (!err) {
              commit(EDIT_TASK_END, { task, taskType })
            }
            next(err)
          })
        } else {
          next()
        }
      }, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  },

  getTask ({ commit, rootGetters }, { taskId, callback }) {
    tasksApi.getTask(taskId, (err, task) => {
      if (!err) {
        const taskType = rootGetters.taskTypeMap[task.task_type_id]
        commit(EDIT_TASK_END, { task, taskType })
      }
      if (callback) callback(err)
    })
  },

  deleteTask ({ commit }, { task, callback }) {
    tasksApi.deleteTask(task, (err) => {
      if (!err) {
        commit(DELETE_TASK_END, task)
      }
      if (callback) callback(err)
    })
  },

  editTaskComment ({ commit }, { taskId, comment, callback }) {
    tasksApi.editTaskComment(comment, (err, comment) => {
      if (!err) {
        commit(EDIT_COMMENT_END, { taskId, comment })
      }
      if (callback) callback(err)
    })
  },

  deleteTaskComment ({ commit, rootState }, { taskId, commentId, callback }) {
    const todoStatus = rootState.taskStatus.taskStatus.find((taskStatus) => {
      return taskStatus.short_name === 'todo'
    })
    tasksApi.deleteTaskComment(taskId, commentId, (err) => {
      if (!err) {
        commit(DELETE_COMMENT_END, {
          commentId,
          taskId,
          taskStatusMap: rootState.taskStatus.taskStatusMap,
          todoStatus
        })
      }
      if (callback) callback(err)
    })
  },

  commentTaskWithPreview (
    { commit, getters, state },
    { taskId, commentText, taskStatusId, callback }
  ) {
    const data = { taskId, taskStatusId, comment: commentText }
    commit(ADD_PREVIEW_START)
    tasksApi.commentTask(data, (err, comment) => {
      if (err) {
        callback(err)
      } else {
        const previewData = {
          taskId,
          commentId: comment.id
        }
        tasksApi.addPreview(previewData, (err, preview) => {
          if (err && callback) {
            callback(err)
          } else {
            tasksApi.uploadPreview(preview.id, state.previewFormData, (err, preview) => {
              if (!err) {
                commit(NEW_TASK_COMMENT_END, {comment, taskId})
                commit(ADD_PREVIEW_END, {
                  preview,
                  taskId,
                  commentId: comment.id,
                  comment
                })
              }
              if (callback) callback(err, preview)
            })
          }
        })
      }
    })
  },

  addCommentExtraPreview (
    { commit, getters, state },
    { taskId, commentId, previewId, callback }
  ) {
    tasksApi.addExtraPreview(previewId, taskId, commentId, (err, preview) => {
      if (err && callback) {
        callback(err)
      } else {
        tasksApi.uploadPreview(preview.id, state.previewFormData, (err) => {
          if (!err) {
            const comment = getters.getTaskComment(taskId, commentId)
            preview.extension = 'png'
            commit(ADD_PREVIEW_END, {
              preview,
              taskId,
              commentId,
              comment
            })
          }
          if (callback) callback(err, preview)
        })
      }
    })
  },

  deleteTaskPreview ({ commit, state }, { taskId, commentId, previewId }) {
    return new Promise((resolve, reject) => {
      tasksApi.deletePreview(taskId, commentId, previewId)
        .then(() => {
          commit(DELETE_PREVIEW_END, { taskId, previewId })
          resolve()
        })
        .catch(reject)
    })
  },

  changeCommentPreview ({ commit, state }, {
    comment, preview, taskId, callback
  }) {
    const fileName = state.previewFormData.get('file').name
    const extension = fileName.slice(fileName.length - 4)
    preview.extension = extension

    tasksApi.uploadPreview(preview.id, state.previewFormData, (err) => {
      if (!err) {
        commit(CHANGE_PREVIEW_END, { comment, preview })
      }
      if (callback) callback(err, extension)
    })
  },

  setPreview ({ commit, state }, { taskId, entityId, previewId, callback }) {
    const taskMap = state.taskMap
    tasksApi.setPreview(entityId, previewId, (err, entity) => {
      if (err && callback) {
        callback(err)
      } else if (callback) {
        commit(SET_PREVIEW, { taskId, entityId, previewId, taskMap })
        callback(err, entity)
      }
    })
  },

  updatePreviewAnnotation ({ commit, state }, {
    taskId, preview, annotations
  }) {
    return new Promise((resolve, reject) => {
      tasksApi.updatePreviewAnnotation(preview, annotations)
        .then((updatedPreview) => {
          commit(UPDATE_PREVIEW_ANNOTATION, {
            taskId,
            preview,
            annotations
          })
          resolve()
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        })
    })
  },

  refreshPreview ({ commit, state }, { taskId, previewId }) {
    return new Promise((resolve, reject) => {
      tasksApi.getPreviewFile(previewId)
        .then((preview) => {
          commit(UPDATE_PREVIEW_ANNOTATION, {
            taskId,
            preview,
            annotations: preview.annotations
          })
          resolve()
        })
        .catch(reject)
    })
  },

  assignSelectedTasks ({ commit, state }, { personId, callback }) {
    const selectedTaskIds = Object.keys(state.selectedTasks)
    tasksApi.assignTasks(personId, selectedTaskIds, (err) => {
      if (!err) commit(ASSIGN_TASKS, { selectedTaskIds, personId })
      if (callback) callback(err)
    })
  },

  unassignSelectedTasks ({ commit, state }, { personId, callback }) {
    const selectedTaskIds = Object.keys(state.selectedTasks)
    tasksApi.unassignTasks(selectedTaskIds, (err) => {
      if (!err) commit(UNASSIGN_TASKS, selectedTaskIds)
      if (callback) callback(err)
    })
  },

  setDisplayedTasks ({ commit, state }, displayedTasks) {
    commit(SET_DISPLAYED_TASKS, displayedTasks)
  },

  showAssignations ({ commit, state }) {
    commit(SET_IS_SHOW_ASSIGNATIONS, true)
  },

  hideAssignations ({ commit, state }) {
    commit(SET_IS_SHOW_ASSIGNATIONS, false)
  },

  showTasks ({ commit, state }) {
    commit(SET_IS_SHOW_TASKS, true)
  },

  hideTasks ({ commit, state }) {
    commit(SET_IS_SHOW_TASKS, false)
  },

  showInfos ({ commit, state }) {
    commit(SET_IS_SHOW_INFOS, true)
  },

  showSequenceStats ({ commit, state }) {
    commit(SET_IS_SHOW_SEQUENCE_STATS, true)
  },

  hideSequenceStats ({ commit, state }) {
    commit(SET_IS_SHOW_SEQUENCE_STATS, false)
  },

  hideInfos ({ commit, state }) {
    commit(SET_IS_SHOW_INFOS, false)
  },

  showDueDates ({ commit, state }) {
    commit(SET_IS_SHOW_DUE_DATES, true)
  },

  hideDueDates ({ commit, state }) {
    commit(SET_IS_SHOW_DUE_DATES, false)
  },

  loadPreviewFileFormData ({ commit }, previewFormData) {
    commit('PREVIEW_FILE_SELECTED', previewFormData)
  },

  addSelectedTask ({ commit }, task) {
    commit(ADD_SELECTED_TASK, task)
  },

  addSelectedTasks ({ commit }, selection) {
    commit(ADD_SELECTED_TASKS, selection)
  },

  clearSelectedTasks ({ commit }, selection) {
    commit(CLEAR_SELECTED_TASKS, selection)
  },

  removeSelectedTask ({ commit }, task) {
    commit(REMOVE_SELECTED_TASK, task)
  },

  saveTaskSearch ({ commit, rootGetters }, { searchQuery, entityType }) {
    return new Promise((resolve, reject) => {
      const query = state.taskSearchQueries.find(
        (query) => query.name === searchQuery
      )
      const production = rootGetters.currentProduction

      if (!query) {
        peopleApi.createFilter(
          'task',
          searchQuery,
          searchQuery,
          production.id,
          entityType,
          (err, searchQuery) => {
            commit(SAVE_TASK_SEARCH_END, { searchQuery, production })
            if (err) {
              reject(err)
            } else {
              resolve(searchQuery)
            }
          }
        )
      } else {
        resolve()
      }
    })
  },

  removeTaskSearch ({ commit, rootGetters }, searchQuery) {
    return new Promise((resolve, reject) => {
      const production = rootGetters.currentProduction
      peopleApi.removeFilter(searchQuery, (err) => {
        commit(REMOVE_TASK_SEARCH_END, { searchQuery, production })
        if (err) reject(err)
        else resolve()
      })
    })
  }
}

const mutations = {
  [LOAD_ASSETS_START] (state, assets) {
    state.assetValidationColumns = []
  },

  [LOAD_ASSETS_END] (state, { production, assets, personMap, userFilters }) {
    const validationColumns = {}
    state.taskMap = {}
    assets.forEach((asset) => {
      asset.validations = {}
      asset.tasks.forEach((task) => {
        const taskType = helpers.getTaskType(task.task_type_id)
        if (!validationColumns[taskType.name]) {
          validationColumns[taskType.name] = task.task_type_id
        }

        if (task.assignees.length > 1) {
          task.assignees = task.assignees.sort((a, b) => {
            return personMap[a].name.localeCompare(personMap[b].name)
          })
        }

        asset.validations[task.task_type_id] = task.id
        task.episode_id = asset.source_id
        state.taskMap[task.id] = task
      })
      asset.tasks = asset.tasks.map((task) => {
        return task.id
      })
    })
    state.assetValidationColumns = validationColumns
    if (userFilters.task && userFilters.task[production.id]) {
      state.taskSearchQueries = userFilters.task[production.id]
    } else {
      state.taskSearchQueries = []
    }
  },

  [LOAD_SHOTS_START] (state, assets) {
    state.shotValidationColumns = {}
  },

  [LOAD_SHOTS_END] (state, { production, shots, personMap, userFilters }) {
    const validationColumns = {}
    state.taskMap = {}
    shots.forEach((shot) => {
      shot.validations = {}
      shot.tasks.forEach((task) => {
        const taskType = helpers.getTaskType(task.task_type_id)
        if (!validationColumns[taskType.name]) {
          validationColumns[taskType.name] = task.task_type_id
        }

        if (task.assignees.length > 1) {
          task.assignees = task.assignees.sort((a, b) => {
            return personMap[a].name.localeCompare(personMap[b])
          })
        }

        shot.validations[task.task_type_id] = task.id
        task.episode_id = shot.episode_id
        state.taskMap[task.id] = task
      })
      shot.tasks = shot.tasks.map((task) => {
        return task.id
      })
    })
    state.shotValidationColumns = validationColumns
    if (userFilters.task && userFilters.task[production.id]) {
      state.taskSearchQueries = userFilters.task[production.id]
    } else {
      state.taskSearchQueries = []
    }
  },

  [LOAD_TASK_END] (state, task) {
    Object.assign(task, {
      project_name: task.project.name,
      entity_type_name: task.entity_type.name
    })
    if (task.entity_type.name === 'Shot') {
      if (task.episode) {
        task.entity_name = `${task.episode.name} / ${task.sequence.name} / ${task.entity.name}`
      } else {
        task.entity_name = `${task.sequence.name} / ${task.entity.name}`
      }
    } else {
      task.entity_name = `${task.entity_type.name} / ${task.entity.name}`
    }
    state.taskMap[task.id] = task
  },

  [LOAD_TASK_ENTITY_PREVIEW_FILES_END] (state, previewFiles) {
    state.taskEntityPreviews = previewFiles
  },

  [LOAD_TASK_COMMENTS_END] (state, { taskId, comments }) {
    comments.forEach((comment) => {
      comment.person = personStore.helpers.addAdditionalInformation(
        comment.person
      )
    })
    state.taskComments[taskId] = comments
    state.taskPreviews[taskId] = comments.reduce((previews, comment) => {
      if (comment.previews && comment.previews.length > 0) {
        const preview = comment.previews[0]
        preview.previews = comment.previews.map((p) => {
          return {
            id: p.id,
            annotations: p.annotations
          }
        })

        previews.push(preview)
        return previews
      } else {
        return previews
      }
    }, [])
  },

  [LOAD_TASK_WORKING_FILES_END] (state, { taskId, workingFiles }) {
    state.taskWorkingFiles[taskId] = workingFiles
  },

  [LOAD_TASK_STATUSES_END] (state, taskStatuses) {
    state.taskStatuses = sortByName(taskStatuses)
    state.taskStatuses.forEach((taskStatus) => {
      state.taskStatusMap[taskStatus.id] = taskStatus
    })
  },

  [LOAD_TASK_SUBSCRIBE_END] (state, { taskId, subscribed }) {},

  [NEW_TASK_WORKING_FILE_END] (state, { workingFile, taskId }) {
    const task = state.taskMap[taskId]

    if (!state.taskWorkingFiles[taskId]) state.taskWorkingFiles[taskId] = []
    if (!state.taskWorkingFiles[taskId].find((wf) => wf.id === workingFile.id)) {
      state.taskWorkingFiles[taskId].unshift(workingFile)
    }

    if (task) {
      Object.assign(task, {
        last_working_file: workingFile
      })
    }
  },

  [NEW_TASK_COMMENT_END] (state, { comment, taskId }) {
    const task = state.taskMap[taskId]
    if (comment.task_status === undefined) {
      const getTaskStatus = getters.getTaskStatus(state, getters)
      comment.task_status = getTaskStatus(comment.task_status_id)
    }

    if (comment.person === undefined) {
      const getPerson = personStore.getters.getPerson(
        personStore.state, personStore.getters
      )
      comment.person = getPerson(comment.person_id)
    }

    comment.person = personStore.helpers.addAdditionalInformation(
      comment.person
    )

    if (!state.taskComments[taskId]) state.taskComments[taskId] = []
    if (!state.taskComments[taskId].find((cmt) => cmt.id === comment.id)) {
      state.taskComments[taskId].unshift(comment)
    }

    if (task) {
      Object.assign(task, {
        task_status_id: comment.task_status_id,
        last_comment: comment
      })
    }
  },

  [DELETE_TASK_END] (state, task) {
    state.taskComments[task.id] = undefined
    state.taskPreviews[task.id] = undefined
    state.taskMap[task.id] = undefined
  },

  [DELETE_COMMENT_END] (state, {
    taskId,
    commentId,
    taskStatusMap,
    todoStatus
  }) {
    const task = state.taskMap[taskId]
    let newStatus = todoStatus
    state.taskComments[taskId] = [...state.taskComments[taskId]].splice(1)
    state.taskPreviews[taskId] = [...state.taskPreviews[taskId]].splice(1)

    if (state.taskComments[taskId].length > 0) {
      const newStatusId = state.taskComments[taskId][0].task_status_id
      newStatus = taskStatusMap[newStatusId]
    }

    if (task) {
      Object.assign(task, {
        task_status_id: newStatus.id,
        task_status_priority: newStatus.priority
      })
    }
  },

  [EDIT_COMMENT_END] (state, { taskId, comment }) {
    state.taskComments[taskId][0].text = comment.text
  },

  [PREVIEW_FILE_SELECTED] (state, formData) {
    state.previewFormData = formData
  },

  [ADD_PREVIEW_START] (state) {
    state.isSavingCommentPreview = true
  },

  [ADD_PREVIEW_END] (state, { preview, taskId, commentId, comment }) {
    state.isSavingCommentPreview = false
    const newPreview = {
      id: preview.id,
      feedback: false,
      revision: preview.revision,
      extension: preview.extension
    }

    const existingPreview = state.taskPreviews[taskId].find(
      (p) => p.revision === preview.revision
    )

    if (existingPreview) {
      const existingSubPreview =
        existingPreview.previews.find((p) => p.id === newPreview.id)
      if (!existingSubPreview) {
        existingPreview.previews.push(newPreview)
      }
    } else {
      newPreview.previews = [{ ...newPreview }]
      state.taskPreviews[taskId] =
        [newPreview].concat(state.taskPreviews[taskId])

      comment.preview = newPreview
      comment.previews = [newPreview]
    }
  },

  [DELETE_PREVIEW_END] (state, { taskId, previewId }) {
    state.taskPreviews[taskId].forEach((p) => {
      const index =
        p.previews.findIndex((subPreview) => subPreview.id === previewId)
      if (index >= 0) {
        p.previews.splice(index, 1)
      }
    })
  },

  [UPDATE_PREVIEW_ANNOTATION] (state, { taskId, preview, annotations }) {
    let oldPreview = null
    state.taskPreviews[taskId].forEach((p) => {
      p.previews.forEach((subPreview) => {
        if (subPreview.id === preview.id) {
          oldPreview = subPreview
        }
      })

      if (p.id === preview.id) {
        p.annotations = annotations
      }
    })

    if (oldPreview) {
      oldPreview.annotations = annotations
    }
  },

  [CHANGE_PREVIEW_END] (state, { preview, comment }) {
    const taskId = comment.object_id

    const newPreview = {
      id: preview.id,
      feedback: false,
      revision: preview.revision,
      extension: preview.extension
    }
    state.taskPreviews[taskId].shift()
    state.taskPreviews[taskId] =
      [newPreview].concat(state.taskPreviews[taskId])
  },

  [ADD_SELECTED_TASK] (state, validationInfo) {
    if (validationInfo.task) {
      state.selectedTasks[validationInfo.task.id] = validationInfo.task
      state.nbSelectedTasks = Object.keys(state.selectedTasks).length
    } else {
      const taskTypeId = validationInfo.column.id
      const entityId = validationInfo.entity.id
      const validationKey = `${entityId}-${taskTypeId}`
      state.selectedValidations[validationKey] = validationInfo
      state.nbSelectedValidations =
        Object.keys(state.selectedValidations).length
    }
  },

  [ADD_SELECTED_TASKS] (state, selection) {
    const tmpSelectedTasks = JSON.parse(JSON.stringify(state.selectedTasks))
    const tmpSelectedValidations =
      JSON.parse(JSON.stringify(state.selectedValidations))
    let isValidationChanged = false
    selection.forEach((validationInfo) => {
      if (validationInfo.task) {
        tmpSelectedTasks[validationInfo.task.id] = validationInfo.task
      } else {
        const taskTypeId = validationInfo.column.id
        const entityId = validationInfo.entity.id
        const validationKey = `${entityId}-${taskTypeId}`
        tmpSelectedValidations[validationKey] = validationInfo
        isValidationChanged = true
      }
    })
    state.selectedTasks = tmpSelectedTasks
    state.nbSelectedTasks = Object.keys(state.selectedTasks).length
    if (isValidationChanged) {
      state.selectedValidations = tmpSelectedValidations
      state.nbSelectedValidations =
        Object.keys(state.selectedValidations).length
    }
  },

  [REMOVE_SELECTED_TASK] (state, validationInfo) {
    if (validationInfo.task) {
      delete state.selectedTasks[validationInfo.task.id]
      state.nbSelectedTasks = Object.keys(state.selectedTasks).length
    } else {
      const taskTypeId = validationInfo.column.id
      const entityId = validationInfo.entity.id
      const validationKey = `${entityId}-${taskTypeId}`
      delete state.selectedValidations[validationKey]
      state.nbSelectedValidations = Object.keys(state.selectedValidations).length
    }
  },

  [CLEAR_SELECTED_TASKS] (state) {
    state.selectedTasks = {}
    state.nbSelectedTasks = 0
    state.selectedValidations = {}
    state.nbSelectedValidations = 0
  },

  [CREATE_TASKS_END] (state, tasks) {
    tasks.forEach((task) => {
      state.taskMap[task.id] = task
    })
  },

  [NEW_TASK_END] (state, task) {
    state.taskMap[task.id] = task
  },

  [EDIT_TASK_END] (state, { task }) {
    const currentTask = state.taskMap[task.id]
    if (currentTask) {
      Object.assign(state.taskMap[task.id], {
        task_status_id: task.task_status_id,
        task_status_short_name:
          state.taskStatusMap[task.task_status_id].short_name,
        priority: task.priority,
        estimation: task.estimation,
        duration: task.duration,
        real_start_date: task.real_start_date,
        end_date: task.end_date,
        real_end_date: task.end_date,
        last_comment_date: task.last_comment_date,
        retake_count: task.retake_count,
        due_date: task.due_date.slice(0, 10)
      })
    }
  },

  [ASSIGN_TASKS] (state, { selectedTaskIds, personId }) {
    selectedTaskIds.forEach((taskId) => {
      const task = state.taskMap[taskId]
      if (task &&
          !task.assignees.find((assigneeId) => assigneeId === personId)) {
        task.assignees.push(personId)
      }
    })
  },

  [UNASSIGN_TASKS] (state, selectedTaskIds) {
    selectedTaskIds.forEach((taskId) => {
      const task = state.taskMap[taskId]
      task.assignees = []
      task.assigneesInfo = []
    })
  },

  [SET_PREVIEW] (state, { taskId, previewId }) {
    if (state.taskMap[taskId]) {
      state.taskMap[taskId].entity.preview_file_id = previewId
    }
  },

  [SET_DISPLAYED_TASKS] (state, displayedTasks) {
    state.displayedTasks = displayedTasks
  },

  [SET_IS_SHOW_ASSIGNATIONS] (state, isShowAssignations) {
    state.isShowAssignations = isShowAssignations
  },

  [SET_IS_SHOW_TASKS] (state, isShowTasks) {
    state.isShowTasks = isShowTasks
  },

  [SET_IS_SHOW_DUE_DATES] (state, isShowDueDates) {
    state.isShowDueDates = isShowDueDates
  },

  [SET_IS_SHOW_INFOS] (state, isShowInfos) {
    state.isShowInfos = isShowInfos
  },

  [SET_IS_SHOW_SEQUENCE_STATS] (state, isShowSequenceStats) {
    state.isShowSequenceStats = isShowSequenceStats
  },

  [LOAD_PERSON_TASKS_END] (state, { tasks }) {
    tasks.forEach((task) => {
      if (task.last_comment.person_id) {
        const person = helpers.getPerson(task.last_comment.person_id)
        task.last_comment.person = person
      }
      state.taskMap[task.id] = task
    })
  },

  [USER_LOAD_TODOS_END] (state, { tasks }) {
    tasks.forEach((task) => {
      if (task.last_comment.person_id) {
        const person = helpers.getPerson(task.last_comment.person_id)
        task.last_comment.person = person
      }

      state.taskMap[task.id] = task
    })
  },

  [SAVE_TASK_SEARCH_END] (state, { searchQuery }) {
    if (!state.taskSearchQueries.includes(searchQuery)) {
      state.taskSearchQueries.push(searchQuery)
      state.taskSearchQueries = sortByName(state.taskSearchQueries)
    }
  },

  [REMOVE_TASK_SEARCH_END] (state, { searchQuery }) {
    const queryIndex = state.taskSearchQueries.findIndex(
      (query) => query.name === searchQuery.name
    )
    if (queryIndex >= 0) {
      state.taskSearchQueries.splice(queryIndex, 1)
    }
  },

  [RESET_ALL] (state, shots) {
    Object.assign(state, { ...initialState })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
