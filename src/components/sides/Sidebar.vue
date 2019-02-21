<template>
  <div class="navbar">
    <div class="sidebarfixed">
      <div>
        <router-link
           class="home-link"
           to="/"
           @click="toggleSidebar()"
        >
          <div
            class="company-logo has-text-centered"
          >
            <img class="imglogo" src="../../assets/kitsu.png" />
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
              <strong>
              >
              </strong>
            </div>
          </div>
        </div>

        <section>
         <div v-if="!isCurrentUserClient">
           <h2>{{ $t('main.user')}}</h2>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'todos'}">
                -{{ $t("tasks.my_tasks") }}
             </router-link>
           </p>
           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'productions'}">
                -{{ $t("productions.title") }}
             </router-link>
           </p>
         </div>

         <div v-if="isCurrentUserAdmin">
           <h2>{{ $t('productions.production_management') }}</h2>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'sequences', params: { production_id: currentProduction.id }}">
              -{{ $t("productions.sequence_management") }}
             </router-link>
           </p>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'shots', params: { production_id: currentProduction.id }}">
              -{{ $t("productions.shot_management") }}
             </router-link>
           </p>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'assets', params: { production_id: currentProduction.id }}">
              -{{ $t("productions.asset_management") }}
             </router-link>
           </p>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'breakdown', params: { production_id: currentProduction.id }}">
              -{{ $t('breakdown.title') }}
             </router-link>
           </p>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'playlists', params: { production_id: currentProduction.id }}">
              -{{ $t('playlists.title') }}
             </router-link>
           </p>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'team', params: { production_id: currentProduction.id }}">
              -{{ $t('people.team') }}
             </router-link>
           </p>

           <br>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'people'}">
             {{ $t('people.title') }}
             </router-link>
           </p>

           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'timesheets'}">
             {{ $t('timesheets.title') }}
             </router-link>
           </p>
         </div>

         <div v-if="isCurrentUserAdmin">
           <h2>{{ $t('productions.task_management') }}</h2>

           <p v-for="task in taskTypes" :key="task.task_type_id" @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'shots-task-type', params: { task_type_id: task.id, production_id: currentProduction.id }}">
              -{{ task.name }}
             </router-link>
           </p>
         </div>

         <div v-if="isCurrentUserAdmin">
           <h2>{{ $t('productions.production_planning')}}</h2>
           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link to="/task-types">
              -{{ $t('productions.task_type_planning') }}
             </router-link>
           </p>
           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link to="/task-status" class="task-status-link">
              -{{ $t('productions.task_status_planning') }}
             </router-link>
           </p>
           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link to="/asset-types">
              -{{ $t('productions.asset_type_planning') }}
             </router-link>
           </p>
           <p @click="toggleSidebar()" class="menu_sublink">
             <router-link :to="{name: 'custom-actions'}">
              -{{ $t('custom_actions.title') }}
             </router-link>
           </p>
         </div>

        </section>
      </div>
    </div>
    <!--<div id="c-mask" @click="toggleSidebar()"
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
      currentProductionId: this.$route.params.production_id,
      currentEpisodeId: this.$route.params.episode_id,
      currentProjectSection: this.getCurrentSectionFromRoute(),
      silent: false
    }
  },

  mounted () {
    const userMenu = this.$refs['user-menu']
    const userName = this.$refs['user-name']
    if (userName) {
      const userNameWidth = userName.clientWidth

      if (userNameWidth > 100) {
        userMenu.style.width = `${userNameWidth}px`
        userName.style.width = `${userNameWidth}px`
      }
    }

    this.setProductionFromRoute()
  },

  computed: {
    ...mapGetters([
      'isSidebarHidden',
      'isCurrentUserClient',
      'isCurrentUserCGArtist',
      'isCurrentUserManager',
      'isCurrentUserAdmin'
    ])
  },
  methods: {
    ...mapActions([
      'toggleSidebar'
    ])
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
  background-color: white;
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
  margin-top: 0;
  margin-bottom: 3em;
  text-align: center;
}

.company-logo {
  text-align: center;
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
