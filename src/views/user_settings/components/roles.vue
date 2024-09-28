<template>
  <div>
    <b-card no-body>
      <b-card-header class="pb-50">
        <h5>Roles</h5>
      </b-card-header>
      <b-card-body>
        <b-row class="d-flex justify-content-between">
          <div class="flex-fill mx-1">
            <form ref="ruleForm" @submit.stop.prevent="deleteRole">
              <b-form-group :state="roleState">
                <v-select :reduce="option => option.name" multiple :state="roleState" required placeholder="Roles" v-model="role" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" label="name" :options="roles">
                  <template #option="{ name }">
                    <span> {{ name }}</span>
                  </template>
                  <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                </v-select>
              </b-form-group>
            </form>
          </div>
          <div>
            <b-button @click="updateRolesPermissions" variant="primary"> <feather-icon icon="HomeIcon" class="mr-50" /> <span class="align-middle">Save</span> </b-button>
          </div>
        </b-row>
      </b-card-body>
    </b-card>
    <b-overlay :show="load || addLoad" rounded="sm">
      <b-row>
        <b-col cols="12" class="mb-2" lg="4" md="6" v-for="(permissions, name) in permissionsGroups" :key="name">
          <b-card no-body class="mb-0">
            <b-card-header class="pb-0">
              <h5>{{ name }}</h5>
            </b-card-header>
            <div class="m-2">
              <b-form-checkbox v-if="userRolesPermissions.indexOf(id) !== -1" :disabled="disabled" v-for="(permission, id) in permissions" :value="id" v-model="Permissions" plain :label="id" :key="id"> {{ permission }} </b-form-checkbox>

              <b-form-checkbox v-if="userRolesPermissions.indexOf(id) == -1" v-for="(permission, id) in permissions" :value="id" v-model="Permissions" plain :label="id" :key="id"> {{ permission }} </b-form-checkbox>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import { BModal, VBModal, BPopover, BFormCheckbox, BFormGroup, BCardText, BCard, BRow, BCol, BFormInput, BButton, BMedia, BAvatar, BLink, BBadge, BDropdown, BDropdownItem, BPagination, BOverlay, BCardHeader, BCardBody } from 'bootstrap-vue';

import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import { mapGetters } from 'vuex';
import Cookies from 'js-cookie';
import { PlusIcon, DeleteIcon } from 'vue-feather-icons';
export default {
  components: {
    BCard,
    BPopover,
    PlusIcon,
    vSelect,
    BModal,
    VBModal,
    DeleteIcon,
    BFormCheckbox,
    BCardText,
    BRow,
    BFormGroup,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      name: '',
      nameState: null,
      roleState: null,
      popoverShow: false,
      submittedNames: [],
      Permissions: [],
      Auth: JSON.parse(Cookies.get('user')),
      disabled: true,
      role_name: '',
      role: [],
      new_role: '',
      roleDialog: false,
    };
  },
  watch: {
    // role: function (role) {
    //   if (role) {
    //     this.$store.dispatch('roles/getRolePermissions', role.id).then(response => {
    //       this.Permissions = this.$store.getters['roles/rolePermissions'];
    //       this.disabled = false;
    //     });
    //   } else {
    //     this.Permissions = [];
    //   }
    // },
  },
  computed: {
    ...mapGetters({
      permissionsGroups: 'roles/permissionsGroups',
      userRolesPermissions: 'roles/userRolesPermissions',
      userRoles: 'roles/userRoles',
      roles: 'roles/roles',
      total: 'roles/total',
      load: 'roles/rolesLoad',
      addLoad: 'roles/addLoad',
    }),
  },
  mounted() {
    this.refresh();
  },
  methods: {
    updateRolesPermissions() {
      let direct_permission = this.Permissions.filter(permission => this.$store.getters['roles/userRolesPermissions'].indexOf(permission) === -1);
      let roles = this.role.map(role => {
        if (role.name) {
          return role.name;
        } else {
          return role;
        }
      });
      this.$store
        .dispatch('roles/updateUserRolesPermissions', {
          id: this.$route.params.id,
          data: { roles: roles, permissions: direct_permission },
        })
        .then(response => {
          this.$store.dispatch('roles/getUserRolesPermissions', this.$route.params.id).then(response => {
            this.roles = this.$store.getters['roles/userRoles'];
            this.Permissions = [];
            this.Permissions.push(...this.$store.getters['roles/userRolesPermissions']);
            this.Permissions.push(...this.$store.getters['roles/userPermissions']);
          });
        });
    },

    refresh() {
      this.$store.dispatch('roles/getRoles');
      this.$store.dispatch('roles/getUserRolesPermissions', this.$route.params.id).then(response => {
        this.role = this.userRoles.map(role => {
          return { name: role };
        });
        this.Permissions.push(...this.$store.getters['roles/userRolesPermissions']);
        this.Permissions.push(...this.$store.getters['roles/userPermissions']);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
