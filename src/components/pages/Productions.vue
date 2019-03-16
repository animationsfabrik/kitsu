<template>
  <div class="productions page fixed-page">
    <div class="level page-header">
      <div class="level-left">
        <page-title :text="$t('productions.title')" />
      </div>
      <div class="level-right">
        <div class="level-item">
          <button-link
            class="level-item"
            :text="$t('productions.new_production')"
            icon="plus"
            path="/productions/new"
          />
        </div>
      </div>
    </div>

    <production-list
      :entries="productions"
      :is-loading="isProductionsLoading"
      :is-error="isProductionsLoadingError"
    />

    <edit-production-modal
      :active="modals.isNewDisplayed"
      :is-loading="editProduction.isLoading"
      :is-error="editProduction.isError"
      :cancel-route="'/productions'"
      :production-to-edit="productionToEdit"
      @fileselected="onProductionPictureSelected"
      @confirm="confirmEditProduction"
    />

    <create-folder-structure-modal
      :active="modals.isCreateFSDisplayed"
      :is-loading="createFolderStructure.isLoading"
      :is-error="createFolderStructure.isError"
      :cancel-route="'/productions'"
      :text="createFSText()"
      :folder-structure-to-create="folderStructureToCreate"
      @confirm="confirmCreateFolderStructure"
    />

    <delete-modal
      :active="modals.isDeleteDisplayed"
      :is-loading="deleteProduction.isLoading"
      :is-error="deleteProduction.isError"
      :cancel-route="'/productions'"
      :text="deleteText()"
      :error-text="$t('productions.delete_error')"
      @confirm="confirmDeleteProduction"
    />

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProductionList from '../lists/ProductionList'
import EditProductionModal from '../modals/EditProductionModal'
import DeleteModal from '../widgets/DeleteModal'
import ButtonLink from '../widgets/ButtonLink'
import PageTitle from '../widgets/PageTitle'
import CreateFolderStructureModal from '../modals/CreateFolderStructureModal'

export default {
  name: 'productions',

  components: {
    ButtonLink,
    DeleteModal,
    CreateFolderStructureModal,
    EditProductionModal,
    PageTitle,
    ProductionList
  },

  data () {
    return {
      modals: {
        isNewDisplayed: false,
        isDeleteDisplayed: false,
        isCreateFSDisplayed: false
      },
      folderStructureToCreate: null,
      productionToDelete: null,
      productionToEdit: null,
      choices: []
    }
  },

  computed: {
    ...mapGetters([
      'deleteProduction',
      'editProduction',
      'createFolderStructure',
      'getProduction',
      'isProductionsLoading',
      'isProductionsLoadingError',
      'productionAvatarFormData',
      'productions'
    ])
  },

  created () {
    this.loadProductions((err) => {
      if (!err) this.handleModalsDisplay()
    })
  },

  methods: {
    ...mapActions([
      'loadProductions',
      'storeProductionPicture',
      'uploadProductionAvatar'
    ]),

    confirmCreateFolderStructure (form) {
      this.$store.dispatch('createFolderStructure', {
        production: this.folderStructureToCreate,
        callback: (err) => {
          if (!err) this.modals.isCreateFSDisplayed = false
        }
      })
    },

    confirmEditProduction (form) {
      let action = 'newProduction'
      const isEditing = this.productionToEdit && this.productionToEdit.id
      if (this.productionToEdit && this.productionToEdit.id) {
        action = 'editProduction'
        form.id = this.productionToEdit.id
      }

      this.$store.dispatch(action, {
        data: form,
        callback: (err) => {
          if (!err) {
            if (isEditing && this.productionAvatarFormData) {
              this.uploadProductionAvatar(form.id)
                .then(() => {
                  this.modals.isNewDisplayed = false
                  this.$router.push('/productions')
                })
            } else {
              this.modals.isNewDisplayed = false
              this.$router.push('/productions')
            }
          }
        }
      })
    },

    confirmDeleteProduction () {
      this.$store.dispatch('deleteProduction', {
        production: this.productionToDelete,
        callback: (err) => {
          if (!err) this.modals.isDeleteDisplayed = false
        }
      })
    },

    deleteText () {
      const production = this.productionToDelete
      if (production) {
        return this.$t('productions.delete_text', { name: production.name })
      } else {
        return ''
      }
    },

    createFSText () {
      return this.$t('productions.createfs_text')
    },

    handleModalsDisplay () {
      const path = this.$store.state.route.path

      if (path.indexOf('new') > 0) {
        this.productionToEdit = {}
        this.modals.isNewDisplayed = true
      } else if (path.indexOf('edit') > 0) {
        const productionId = this.$store.state.route.params.production_edit_id
        this.productionToEdit = this.getProduction(productionId)
        this.modals.isNewDisplayed = true
      } else if (path.indexOf('delete') > 0) {
        const productionId = this.$store.state.route.params.production_delete_id
        this.productionToDelete = this.getProduction(productionId)
        this.modals.isDeleteDisplayed = true
      } else if (path.indexOf('createfs') > 0) {
        const productionId = this.$store.state.route.params.folder_structure_create_id
        this.folderStructureToCreate = this.getProduction(productionId)
        this.modals.isCreateFSDisplayed = true
      } else {
        this.modals.isNewDisplayed = false
        this.modals.isDeleteDisplayed = false
        this.modals.isCreateFSDisplayed = false
      }
    },

    onProductionPictureSelected (formData) {
      this.storeProductionPicture(formData)
    }
  },

  watch: {
    $route () { this.handleModalsDisplay() }
  },

  metaInfo () {
    return {
      title: `${this.$t('productions.title')} - Intranet`
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
