<template>
  <div class="navbar">
    <div class="sidebarfixed">
      <div>
        <router-link
           class="home-link"
           to="/"
        >
          <div
            class="company-logo has-text-centered"
          >
            <img
              :src="logoPath"
              class="imglogo"
              v-if="organisation && organisation.has_avatar"
            />
            <img
              src="../../assets/kitsu.png"
              v-else
            />
            <h2 class="subtitle sidebar-title" style="margin: 0px;">Intranet 2.0</h2>
          </div>
        </router-link>

        <div :class="{
          'nav-item': true,
        }">
          <div class="level">
            <div class="level-item">
              <combobox
                class="context-selector"
                style="margin: 0px;"
                :options="openProductionOptions"
                :is-top="true"
                v-model="currentProductionId"
              />
            </div>
          </div>
        </div>

        <section>
         <div v-if="!isCurrentUserClient">
           <h2>{{ $t('main.user')}}</h2>
           <p class="menu_sublink">
            <router-link :to="{ name: 'notifications' }">
                -{{ $t('notifications.title') }}
            </router-link>
           </p>
           <p class="menu_sublink">
             <router-link :to="{name: 'todos'}">
                -{{ $t("tasks.my_tasks") }}
             </router-link>
           </p>
           <p class="menu_sublink">
             <router-link :to="{name: 'productions'}">
                -{{ $t("productions.title") }}
             </router-link>
           </p>
         </div>

         <div v-if="isCurrentUserAdmin">
           <h2>{{ $t('productions.production_management') }}</h2>

           <p class="menu_sublink">
             <router-link :to="{name: 'sequences', params: { production_id: currentProduction.id }}">
              -{{ $t("productions.sequence_management") }}
             </router-link>
           </p>

           <p class="menu_sublink">
             <router-link :to="{name: 'shots', params: { production_id: currentProduction.id }}">
              -{{ $t("productions.shot_management") }}
             </router-link>
           </p>

           <p class="menu_sublink">
             <router-link :to="{name: 'assets', params: { production_id: currentProduction.id }}">
              -{{ $t("productions.asset_management") }}
             </router-link>
           </p>

           <p class="menu_sublink">
             <router-link :to="{name: 'breakdown', params: { production_id: currentProduction.id }}">
              -{{ $t('breakdown.title') }}
             </router-link>
           </p>

           <p class="menu_sublink">
             <router-link :to="{name: 'playlists', params: { production_id: currentProduction.id }}">
              -{{ $t('playlists.title') }}
             </router-link>
           </p>

           <p class="menu_sublink">
             <router-link :to="{name: 'team', params: { production_id: currentProduction.id }}">
              -{{ $t('people.team') }}
             </router-link>
           </p>

           <br>

           <p class="menu_sublink">
             <router-link :to="{name: 'contacts'}">
             {{ $t('contacts.title') }}
             </router-link>
           </p>

           <p class="menu_sublink">
             <router-link :to="{name: 'timesheets'}">
             {{ $t('timesheets.title') }}
             </router-link>
           </p>
         </div>

         <div v-if="isCurrentUserAdmin">
           <h2>{{ $t('productions.task_management') }}</h2>

           <p v-for="task in taskTypes" :key="task.task_type_id" class="menu_sublink">
             <router-link :to="{name: 'task-type', params: { task_type_id: task.id, production_id: currentProduction.id, type: task.for_shots ? 'shots' : 'assets' }}">
              -{{ task.name }}
             </router-link>
           </p>
         </div>

         <div v-if="isCurrentUserAdmin">
           <h2>{{ $t('productions.production_planning')}}</h2>
           <p class="menu_sublink">
             <router-link :to="{name: 'people'}">
             -{{ $t('people.title') }}
             </router-link>
           </p>
           <p class="menu_sublink">
             <router-link to="/task-types">
              -{{ $t('productions.task_type_planning') }}
             </router-link>
           </p>
           <p class="menu_sublink">
             <router-link to="/task-status" class="task-status-link">
              -{{ $t('productions.task_status_planning') }}
             </router-link>
           </p>
           <p class="menu_sublink">
             <router-link to="/asset-types">
              -{{ $t('productions.asset_type_planning') }}
             </router-link>
           </p>
           <!--<p class="menu_sublink">
             <router-link :to="{name: 'custom-actions'}">
              -{{ $t('custom_actions.title') }}
             </router-link>
           </p>-->
           <p class="menu_sublink">
             <router-link :to="{name: 'settings'}">
               -{{ $t("settings.title") }}
             </router-link>
           </p>
         </div>

        </section>
      </div>
    </div>
    <!--<div id="c-mask"
         v-bind:class="{'is-active': !isSidebarHidden}"
    >
    </div>-->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BellIcon } from 'vue-feather-icons'

import Combobox from '../widgets/Combobox'
import PeopleAvatar from '../widgets/PeopleAvatar'
import PeopleName from '../widgets/PeopleName'

export default {
  name: 'sidebar',
  components: {
    BellIcon,
    Combobox,
    PeopleName,
    PeopleAvatar
  },
  data () {
    return {
      title: '',
      logoPath: '',
      currentProductionId: this.$route.params.production_id,
      currentEpisodeId: this.$route.params.episode_id,
      currentProjectSection: this.getCurrentSectionFromRoute(),
      silent: false
    }
  },

  mounted () {
    this.setProductionFromRoute()
    this.reset()
  },

  computed: {
    ...mapGetters([
      'isSidebarHidden',
      'isCurrentUserClient',
      'isCurrentUserCGArtist',
      'isCurrentUserManager',
      'isCurrentUserAdmin',
      'organisation'
      'isCurrentUserAdmin',
      'openProductionOptions',
      'assetsPath',
      'currentEpisode',
      'currentProduction',
      'episodes',
      'episodeOptions',
      'isDarkTheme',
      'isSidebarHidden',
      'isUserMenuHidden',
      'isTVShow',
      'isNewNotification',
      'openProductions',
      'openProductionOptions',
      'productionMap',
      'user',
      'taskTypes'
    ])
  },

  methods: {
    ...mapActions([
      'clearEpisodes',
      'loadEpisodes',
      'loadNotification',
      'logout',
      'setProduction',
      'setCurrentEpisode',
      'toggleDarkTheme',
      'toggleUserMenu'
    ]),

    reset () {
      this.title = this.organisation.name
      this.logoPath = `/api/pictures/thumbnails/organisations/` +
        `${this.organisation.id}.png?t=` + new Date().toISOString()
    },

    onLogoutClicked () {
      this.logout((err, success) => {
        if (err) console.log(err)
        this.toggleUserMenu()
        if (success) this.$router.push('/login')
      })
    },

    getCurrentSectionFromRoute () {
      let name = ''
      const segments = this.$route.path.split('/')
      if (this.isTVShow) {
        name = segments[5]
      }
      if (!name) {
        name = segments[3]

        if (name === 'episodes' && segments.length === 6) {
          name = segments[5]
        }
      }

      if (name === 'asset-types') name = 'assetTypes'
      return name
    },

    updateRoute () {
      const sectionFromRoute = this.getCurrentSectionFromRoute()
      let section = this.currentProjectSection

      const isProperContext =
        section &&
        this.$route.path.indexOf('manage') < 0

      const isContextChanged =
        section !== sectionFromRoute ||
        this.$route.params.production_id !== this.currentProductionId ||
        (
          this.currentEpisodeId &&
          this.$route.params.episode_id &&
          this.$route.params.episode_id !== this.currentEpisodeId
        )

      if (isProperContext && isContextChanged) {
        if (section === 'assetTypes') section = 'production-asset-types'
        this.pushContextRoute(section)
      }

      return this.$route.path
    },

    pushContextRoute (section) {
      let episodeId = this.currentEpisodeId
      let isTVShow = !!this.currentEpisodeId

      let route = {
        name: section,
        params: {
          production_id: this.currentProductionId
        }
      }

      if (
        this.productionMap[this.currentProductionId] &&
        (
          this.$route.params.production_id !== this.currentProductionId ||
          !episodeId
        )
      ) {
        episodeId =
          this.productionMap[this.currentProductionId].first_episode_id
        isTVShow =
          this.productionMap[this.currentProductionId].production_type === 'tvshow'
      }

      const isEpisodeContext =
        isTVShow &&
        section !== 'team' &&
        section !== 'episodes'

      if (isEpisodeContext) {
        route.name = `episode-${section}`
        route.params.episode_id = episodeId
      } else if (section === 'episodes' && !isTVShow) {
        route.name = 'assets'
      }

      if (
        route.params.production_id
      ) {
        this.$router.push(route)
      }
    },

    clearContext () {
      this.silent = true
      this.currentProductionId = null
      this.currentEpisodeId = null
      this.currentProjectSection = null
      this.setCurrentEpisode(null)
      this.setProduction(null)
      this.silent = false
    },

    setProductionFromRoute () {
      const routeProductionId = this.$route.params.production_id
      const routeEpisodeId = this.$route.params.episode_id
      if (!this.currentProduction ||
          this.currentProductionId !== routeProductionId ||
          this.currentProduction.id !== routeProductionId
      ) {
        this.setProduction(routeProductionId)
        if (this.isTVShow) {
          this.loadEpisodes(() => {
            this.setEpisodeFromRoute()
            this.updateComboFromRoute()
          })
        } else {
          this.updateComboFromRoute()
        }
      } else if (
        this.episodes.length < 2 &&
        this.isTVShow &&
        (
          !this.currentEpisode ||
          this.currentEpisode.id !== routeEpisodeId
        )
      ) {
        // This loading is required when the production is the first production
        // it is already set as current production but episodes are not
        // loaded.
        this.loadEpisodes(() => {
          this.setEpisodeFromRoute()
          this.updateComboFromRoute()
        })
      } else {
        if (this.assetsPath.name === 'open-productions' && routeProductionId) {
          this.setProduction(routeProductionId)
        }
        this.setEpisodeFromRoute()
        this.updateComboFromRoute()
      }
    },

    setEpisodeFromRoute () {
      const routeEpisodeId = this.$route.params.episode_id
      if (this.isTVShow) {
        if (
          !this.currentEpisode ||
          this.currentEpisodeId !== routeEpisodeId ||
          this.currentEpisode.id !== routeEpisodeId
        ) {
          this.setCurrentEpisode(routeEpisodeId)
        }
      } else {
        this.silent = true
        this.clearEpisodes()
        this.currentEpisodeId = null
        this.silent = false
      }
    },

    updateContext (productionId) {
      if (!productionId) {
        this.clearContext()
      } else {
        this.setProductionFromRoute()
      }
    },

    updateComboFromRoute () {
      const productionId = this.$route.params.production_id
      const episodeId = this.$route.params.episode_id
      const section = this.getCurrentSectionFromRoute()

      this.silent = true
      this.currentProductionId = productionId
      this.currentEpisodeId = episodeId
      this.currentProjectSection = section
      this.silent = false
    }
  },

  watch: {
    $route () {
      const productionId = this.$route.params.production_id
      this.updateContext(productionId)
    },

    currentProductionId () {
      if (!this.silent) this.updateRoute()
    },

    currentEpisodeId () {
      if (!this.silent) this.updateRoute()
    },

    currentProjectSection () {
      if (!this.silent) this.updateRoute()
    },

    organisation () {
      this.reset()
    }
  },

  socket: {
    events: {
      'notifications:new' (eventData) {
        if (this.user.id === eventData.person_id) {
          const notificationId = eventData.notification_id
          this.loadNotification(notificationId)
        }
      },

      'person:update' (eventData) {
        if (this.user.id === eventData.person_id) {
          this.$refs.avatar.reloadAvatar()
        }
      }
    }
      'toggleSidebar'
    ]),

    reset () {
      this.title = this.organisation.name
      this.logoPath = `/api/pictures/thumbnails/organisations/` +
        `${this.organisation.id}.png?t=` + new Date().toISOString()
    }
  },

  watch: {
    organisation () {
      this.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.dark .sidebarfixed {
  background-color: #2F3136;
  color: $white-grey;
}

.menu_sublink {
  font-size: 12px;
}

.context-selector {
  font-size: 12px;
  width: 180px;
  height: 30px;
}

.sidebarfixed {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 215px;
  background-color: #464646;
  padding: 20px 1em 1em 1em;
  overflow-y: auto;
  z-index: 205;
  box-shadow: 1px 0px 6px rgba(0,0,0,0.2);
  transition-property: all;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.imglogo {
  max-width: 80%;
  padding: 10px;
}

aside.hidden {
  left: -200px;
}

.sidebarfixed p a {
  font-size: 1.2em;
  text-transform: uppercase;
  color: $grey;
}

.sidebarfixed section {
  margin-bottom: 2em;
}

.sidebar-title {
  margin-top: 0.5em;
  margin-bottom: 1.5em;
  text-align: center;
  font-size: 1.6em;
}

.company-logo {
  width: 150px;
  margin: auto;
}

#c-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 0;
  height: 0;
  background-color: #000;
  opacity: 0;
}

#c-mask.is-active {
  width: 100%;
  height: 100%;
}

h2 {
  margin-top: 2em;
}

@media screen and (max-width: 768px) {
  .company-logo img {
    width: 40px;
    margin: 0;
    flex: 1;
  }

  .home-link {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .home-link h2 {
    margin-bottom: 0;
  }
}
</style>
