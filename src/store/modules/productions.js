import productionsApi from '../api/productions'
import { sortProductions, sortByName } from '../../lib/sorting'
import { updateModelFromList, removeModelFromList } from '../../lib/helpers'
import {
  LOAD_PRODUCTIONS_START,
  LOAD_PRODUCTIONS_ERROR,
  LOAD_PRODUCTIONS_END,

  LOAD_OPEN_PRODUCTIONS_START,
  LOAD_OPEN_PRODUCTIONS_ERROR,
  LOAD_OPEN_PRODUCTIONS_END,

  LOAD_PRODUCTION_STATUS_START,
  LOAD_PRODUCTION_STATUS_ERROR,
  LOAD_PRODUCTION_STATUS_END,

  EDIT_PRODUCTION_START,
  EDIT_PRODUCTION_ERROR,
  EDIT_PRODUCTION_END,

  DELETE_PRODUCTION_START,
  DELETE_PRODUCTION_ERROR,
  DELETE_PRODUCTION_END,

  CREATE_FOLDER_STRUCTURE_START,
  CREATE_FOLDER_STRUCTURE_ERROR,
  CREATE_FOLDER_STRUCTURE_END,

  RESET_PRODUCTION_PATH,
  SET_CURRENT_PRODUCTION,
  PRODUCTION_PICTURE_FILE_SELECTED,
  PRODUCTION_AVATAR_UPLOADED,

  TEAM_ADD_PERSON,
  TEAM_REMOVE_PERSON,

  ADD_METADATA_DESCRIPTOR_END,
  UPDATE_METADATA_DESCRIPTOR_END,
  DELETE_METADATA_DESCRIPTOR_END,

  RESET_ALL
} from '../mutation-types'

const initialState = {
  productions: [],
  productionMap: {},
  openProductions: [],
  productionStatus: [],
  currentProduction: null,
  productionAvatarFormData: null,

  isProductionsLoading: false,
  isProductionsLoadingError: false,
  isOpenProductionsLoading: false,

  editProduction: {
    isLoading: false,
    isError: false
  },

  deleteProduction: {
    isLoading: false,
    isError: false
  },

  createFolderStructure: {
    isLoading: false,
    isError: false
  },

  assetsPath: { name: 'open-productions' },
  assetTypesPath: { name: 'open-productions' },
  shotsPath: { name: 'open-productions' },
  sequencesPath: { name: 'open-productions' },
  episodesPath: { name: 'open-productions' },
  breakdownPath: { name: 'open-productions' },
  playlistsPath: { name: 'open-productions' },
  teamPath: { name: 'open-productions' }
}

let state = { ...initialState }

const helpers = {
  getProductionComponentPath (routeName, productionId, episodeId) {
    if (episodeId) {
      return {
        name: 'episode-' + routeName,
        params: {
          episode_id: episodeId,
          production_id: productionId
        }
      }
    } else if (productionId) {
      return {
        name: routeName,
        params: {
          production_id: productionId
        }
      }
    } else {
      return { name: 'open-productions' }
    }
  }
}

const getters = {
  productions: state => state.productions,
  productionMap: state => state.productionMap,
  openProductions: state => state.openProductions,
  productionStatus: state => state.productionStatus,

  productionAvatarFormData: state => state.productionAvatarFormData,

  isProductionsLoading: state => state.isProductionsLoading,
  isProductionsLoadingError: state => state.isProductionsLoadingError,
  isOpenProductionsLoading: state => state.isOpenProductionsLoading,

  editProduction: state => state.editProduction,
  deleteProduction: state => state.deleteProduction,
  createFolderStructure: state => state.createFolderStructure,

  assetsPath: state => state.assetsPath,
  assetTypesPath: state => state.assetTypesPath,
  shotsPath: state => state.shotsPath,
  sequencesPath: state => state.sequencesPath,
  episodesPath: state => state.episodesPath,
  breakdownPath: state => state.breakdownPath,
  playlistsPath: state => state.playlistsPath,
  teamPath: state => state.teamPath,

  currentProduction: (state) => {
    if (state.currentProduction) {
      return state.currentProduction
    } else if (state.openProductions.length > 0) {
      return state.openProductions[0]
    } else {
      return null
    }
  },

  isTVShow: (state) => {
    const production = getters.currentProduction(state)
    return production && production.production_type === 'tvshow'
  },

  assetMetadataDescriptors: (state) => {
    if (!state.currentProduction || !state.currentProduction.descriptors) {
      return []
    } else {
      return sortByName(
        state.currentProduction.descriptors
          .filter(d => d.entity_type === 'Asset')
      )
    }
  },

  shotMetadataDescriptors: (state) => {
    if (!state.currentProduction || !state.currentProduction.descriptors) {
      return []
    } else {
      return sortByName(
        state.currentProduction.descriptors
          .filter(d => d.entity_type === 'Shot')
      )
    }
  },

  productionStatusOptions: state => state.productionStatus.map(
    (status) => { return { label: status.name, value: status.id } }
  ),
  openProductionOptions: state => state.openProductions.map(
    (production) => { return { label: production.name, value: production.id } }
  ),

  getProduction: (state, getters) => (id) => {
    return state.productions.find(
      (production) => production.id === id
    )
  },
  getProductionStatus: (state, getters) => (id) => {
    return state.productionStatus.find(
      (productionStatus) => productionStatus.id === id
    )
  }
}

const actions = {

  loadProductionStatus ({ commit, state }, callback) {
    commit(LOAD_PRODUCTION_STATUS_START)
    productionsApi.getProductionStatus((err, productionStatus) => {
      if (err) commit(LOAD_PRODUCTION_STATUS_ERROR)
      else commit(LOAD_PRODUCTION_STATUS_END, productionStatus)
      if (callback) callback(err)
    })
  },

  loadOpenProductions ({ commit, state }, callback) {
    commit(LOAD_OPEN_PRODUCTIONS_START)
    productionsApi.getOpenProductions((err, productions) => {
      if (err) commit(LOAD_OPEN_PRODUCTIONS_ERROR)
      else {
        commit(LOAD_OPEN_PRODUCTIONS_END, productions)
      }
      if (callback) callback(err)
    })
  },

  loadProductions ({ commit, state }, callback) {
    commit(LOAD_PRODUCTIONS_START)
    productionsApi.getProductions((err, productions) => {
      if (err) commit(LOAD_PRODUCTIONS_ERROR)
      else commit(LOAD_PRODUCTIONS_END, productions)
      if (callback) callback(err)
    })
  },

  newProduction ({ commit, state }, { data, callback }) {
    commit(EDIT_PRODUCTION_START, data)
    productionsApi.newProduction(data, (err, production) => {
      if (err) {
        commit(EDIT_PRODUCTION_ERROR)
      } else {
        commit(EDIT_PRODUCTION_END, production)
      }
      if (callback) callback(err, production)
    })
  },

  editProduction ({ commit, state }, payload) {
    commit(EDIT_PRODUCTION_START)
    productionsApi.updateProduction(payload.data, (err, production) => {
      if (err) {
        commit(EDIT_PRODUCTION_ERROR)
      } else {
        commit(EDIT_PRODUCTION_END, production)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  deleteProduction ({ commit, state }, payload) {
    commit(DELETE_PRODUCTION_START)
    const production = payload.production
    productionsApi.deleteProduction(production, (err) => {
      if (err) {
        commit(DELETE_PRODUCTION_ERROR)
      } else {
        commit(DELETE_PRODUCTION_END, production)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  createFolderStructure ({ commit, state }, payload) {
    commit(CREATE_FOLDER_STRUCTURE_START)
    const production = payload.production
    productionsApi.createFolderStructure(production, (err) => {
      if (err) {
        commit(CREATE_FOLDER_STRUCTURE_ERROR)
      } else {
        commit(CREATE_FOLDER_STRUCTURE_END, production)
      }
      if (payload.callback) payload.callback(err)
    })
  },

  setProduction ({ commit, rootGetters }, productionId) {
    commit(SET_CURRENT_PRODUCTION, productionId)
    if (rootGetters.isTVShow) {
      const episode = rootGetters.currentEpisode
      const episodeId = episode ? episode.id : null
      if (productionId && episodeId) {
        commit(RESET_PRODUCTION_PATH, { productionId, episodeId })
      }
    } else {
      if (productionId) {
        commit(RESET_PRODUCTION_PATH, { productionId })
      }
    }
  },

  storeProductionPicture ({ commit }, formData) {
    commit(PRODUCTION_PICTURE_FILE_SELECTED, formData)
  },

  uploadProductionAvatar ({ commit, state }, productionId) {
    return new Promise((resolve, reject) => {
      productionsApi.postAvatar(
        productionId,
        state.productionAvatarFormData,
        (err) => {
          commit(PRODUCTION_AVATAR_UPLOADED, productionId)
          if (err) reject(err)
          else resolve()
        }
      )
    })
  },

  addPersonToTeam ({ commit, state }, person) {
    return new Promise((resolve, reject) => {
      commit(TEAM_ADD_PERSON, person.id)
      return productionsApi.addPersonToTeam(
        state.currentProduction.id,
        person.id
      )
        .then(resolve)
        .catch(reject)
    })
  },

  removePersonFromTeam ({ commit, state }, person) {
    return new Promise((resolve, reject) => {
      commit(TEAM_REMOVE_PERSON, person.id)
      return productionsApi.removePersonFromTeam(
        state.currentProduction.id,
        person.id
      )
        .then(resolve)
        .catch(reject)
    })
  },

  addMetadataDescriptor ({ commit, state }, descriptor) {
    return new Promise((resolve, reject) => {
      if (descriptor.id) {
        return productionsApi.updateMetadataDescriptor(
          state.currentProduction.id,
          descriptor
        )
          .then((descriptor) => {
            commit(UPDATE_METADATA_DESCRIPTOR_END, {
              production: state.currentProduction,
              descriptor
            })
            resolve()
          })
          .catch(reject)
      } else {
        return productionsApi.addMetadataDescriptor(
          state.currentProduction.id,
          descriptor
        )
          .then((descriptor) => {
            commit(ADD_METADATA_DESCRIPTOR_END, {
              production: state.currentProduction,
              descriptor
            })
            resolve()
          })
          .catch(reject)
      }
    })
  },

  deleteMetadataDescriptor ({ commit, state }, descriptorId) {
    return new Promise((resolve, reject) => {
      return productionsApi.deleteMetadataDescriptor(
        state.currentProduction.id,
        descriptorId
      )
        .then(() => {
          commit(DELETE_METADATA_DESCRIPTOR_END, { id: descriptorId })
          resolve()
        })
        .catch(reject)
    })
  },

  refreshMetadataDescriptor ({ commit, state }, descriptorId) {
    return new Promise((resolve, reject) => {
      return productionsApi.getMetadataDescriptor(
        state.currentProduction.id,
        descriptorId
      )
        .then((descriptor) => {
          const descriptorMap = {}
          state.openProductions.forEach((production) => {
            production.descriptors.forEach((desc) => {
              descriptorMap[desc.id] = desc
            })
          })
          if (!descriptorMap[descriptor.id]) {
            commit(ADD_METADATA_DESCRIPTOR_END, {
              production: state.productionMap[descriptor.project_id],
              descriptor
            })
          } else {
            commit(UPDATE_METADATA_DESCRIPTOR_END, {
              production: state.productionMap[descriptor.project_id],
              descriptor
            })
          }
          resolve()
        })
        .catch(reject)
    })
  }

}

const mutations = {
  [LOAD_PRODUCTIONS_START] (state) {
    state.productions = []
    state.isProductionsLoading = true
    state.isProductionsLoadingError = false
  },

  [LOAD_PRODUCTIONS_ERROR] (state) {
    state.productions = []
    state.isProductionsLoading = false
    state.isProductionsLoadingError = true
  },

  [LOAD_PRODUCTIONS_END] (state, productions) {
    state.isProductionsLoading = false
    state.isProductionsLoadingError = false
    state.productions = sortProductions(productions)

    const productionMap = {}
    state.productions.forEach((production) => {
      if (!productionMap[production.id]) {
        productionMap[production.id] = production
      }
    })
    state.productionMap = productionMap
  },

  [LOAD_OPEN_PRODUCTIONS_START] (state) {
    state.isOpenProductionsLoading = true
    state.openProductions = []
  },
  [LOAD_OPEN_PRODUCTIONS_ERROR] (state) {
    state.isOpenProductionsLoading = false
  },
  [LOAD_OPEN_PRODUCTIONS_END] (state, productions) {
    state.isOpenProductionsLoading = false
    state.openProductions = sortByName(productions)

    const productionMap = {}
    productions.forEach((production) => {
      productionMap[production.id] = production
    })
    state.productionMap = productionMap

    if (!state.currentProduction && state.openProductions.length > 0) {
      state.currentProduction = state.openProductions[0]
    }
  },

  [LOAD_PRODUCTION_STATUS_START] (state) {
    state.productionStatus = []
  },
  [LOAD_PRODUCTION_STATUS_ERROR] (state) {
  },
  [LOAD_PRODUCTION_STATUS_END] (state, productionStatus) {
    state.productionStatus = productionStatus
  },

  [EDIT_PRODUCTION_START] (state, data) {
    state.editProduction.isLoading = true
    state.editProduction.isError = false
  },
  [EDIT_PRODUCTION_ERROR] (state) {
    state.editProduction.isLoading = false
    state.editProduction.isError = true
  },

  [EDIT_PRODUCTION_END] (state, newProduction) {
    const production = state.productionMap[newProduction.id]
    const productionStatus = getters.getProductionStatus(state)(
      newProduction.project_status_id
    )
    const openProduction = state.openProductions.find(
      (openProduction) => openProduction.id === newProduction.id
    )
    newProduction.project_status_name = productionStatus.name

    if (production) {
      const openProductionIndex = state.openProductions.findIndex(
        (openProduction) => openProduction.id === newProduction.id
      )
      if (newProduction.project_status_id) {
        // Status changed from open to close
        if (
          openProductionIndex >= 0 &&
          production.project_status_id !== newProduction.project_status_id
        ) {
          state.openProductions.splice(openProductionIndex, 1)
        // Status change from close to open
        } else if (openProductionIndex < 0) {
          state.openProductions.push(production)
          state.openProductions = sortByName(state.openProductions)
        }
      }

      if (
        newProduction.production_type &&
        newProduction.production_type !== production.production_type &&
        newProduction.production_type === 'short'
      ) {
        production.first_episode_id = undefined
        openProduction.first_episode_id = undefined
      }

      Object.assign(production, newProduction)
      if (openProduction) Object.assign(openProduction, newProduction)
    } else {
      state.productions.push(newProduction)
      state.productionMap[newProduction.id] = newProduction
      state.openProductions.push(newProduction)
      state.productions = sortProductions(state.productions)
      state.openProductions = sortByName(state.openProductions)
    }
    state.editProduction = {
      isLoading: false,
      isError: false
    }
  },

  [DELETE_PRODUCTION_START] (state) {
    state.deleteProduction = {
      isLoading: true,
      isError: false
    }
  },
  [DELETE_PRODUCTION_ERROR] (state) {
    state.deleteProduction = {
      isLoading: false,
      isError: true
    }
  },
  [DELETE_PRODUCTION_END] (state, productionToDelete) {
    const productionToDeleteIndex = state.productions.findIndex(
      (production) => production.id === productionToDelete.id
    )
    state.productions.splice(productionToDeleteIndex, 1)

    state.deleteProduction = {
      isLoading: false,
      isError: false
    }
  },

  [CREATE_FOLDER_STRUCTURE_START] (state) {
    state.createFolderStructure = {
      isLoading: true,
      isError: false
    }
  },

  [CREATE_FOLDER_STRUCTURE_ERROR] (state) {
    state.createFolderStructure = {
      isLoading: false,
      isError: true
    }
  },

  [CREATE_FOLDER_STRUCTURE_END] (state) {
    state.createFolderStructure = {
      isLoading: false,
      isError: false
    }
  },

  [PRODUCTION_PICTURE_FILE_SELECTED] (state, formData) {
    state.productionAvatarFormData = formData
  },

  [PRODUCTION_AVATAR_UPLOADED] (state, productionId) {
    const production = state.productionMap[productionId]
    if (production) production.has_avatar = true
  },

  [SET_CURRENT_PRODUCTION] (state, productionId) {
    const production = state.productionMap[productionId]
    state.currentProduction = production
  },

  [RESET_PRODUCTION_PATH] (state, { productionId, episodeId }) {
    state.assetsPath = helpers.getProductionComponentPath(
      'assets', productionId, episodeId)
    state.assetTypesPath = helpers.getProductionComponentPath(
      'production-asset-types', productionId, episodeId)
    state.shotsPath = helpers.getProductionComponentPath(
      'shots', productionId, episodeId)
    state.sequencesPath = helpers.getProductionComponentPath(
      'sequences', productionId, episodeId)
    state.episodesPath = helpers.getProductionComponentPath(
      'episodes', productionId)
    state.breakdownPath = helpers.getProductionComponentPath(
      'breakdown', productionId, episodeId)
    state.playlistsPath = helpers.getProductionComponentPath(
      'playlists', productionId, episodeId)
    state.teamPath = helpers.getProductionComponentPath(
      'team', productionId)
  },

  [TEAM_ADD_PERSON] (state, personId) {
    if (!state.currentProduction.team.find((pId) => pId === personId)) {
      state.currentProduction.team.push(personId)
    }
  },

  [TEAM_REMOVE_PERSON] (state, personId) {
    const personIndex = state.currentProduction.team.findIndex(
      (pId) => pId === personId
    )
    if (personIndex !== null) {
      state.currentProduction.team.splice(personIndex, 1)
    }
  },

  [ADD_METADATA_DESCRIPTOR_END] (state, { production, descriptor }) {
    if (production) {
      if (production.descriptors) {
        production.descriptors.push(descriptor)
      } else {
        production.descriptors = [descriptor]
      }
    }
  },

  [UPDATE_METADATA_DESCRIPTOR_END] (state, { production, descriptor }) {
    if (production) {
      if (production.descriptors) {
        updateModelFromList(production.descriptors, descriptor)
      } else {
        production.descriptors = []
      }
    }
  },

  [DELETE_METADATA_DESCRIPTOR_END] (state, descriptor) {
    const production = state.openProductions.find((production) => {
      return production.descriptors.find((d) => d.id === descriptor.id)
    })

    if (production) {
      production.descriptors =
        removeModelFromList(production.descriptors, descriptor)
    }
  },

  [RESET_ALL] (state) {
    Object.assign(state, { ...initialState })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
