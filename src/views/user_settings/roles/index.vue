<template>
  <div>
    <b-card no-body>
      <b-card-header class="text-white pb-2 w-100">
        <b-row no-gutter class="d-flex justify-content-between w-100 m-0">
          <b-col cols="12" md="6" sm="2">
            <div class="d-flex">
              <b-input-group class="input-group-merge">
                <b-input-group-prepend is-text>
                  <feather-icon icon="SearchIcon" class="pointer" />
                </b-input-group-prepend>
                <b-form-input v-model="search_text" :placeholder="$t('Global.search_text')" @input="search" />
              </b-input-group>
            </div>
          </b-col>

          <div class="d-flex">
            <b-button @click="openDialog()" v-b-tooltip.hover="$t('Global.add')" variant="primary" class="btn-icon">
              <feather-icon icon="PlusIcon" />
            </b-button>
          </div>

        </b-row>
      </b-card-header>
      <b-row>
        <b-col cols="12">
          <b-table :items="items" :fields="fields" striped responsive class="position-relative" primary-key="id" show-empty :empty-text="$t('Global.empty_text')" :per-page="perPage" :current-page="currentPage">
            <template #cell(name)="row">
              <b-link :to="{ name: 'roles-show', params: { id: row.item.id } }" class="font-weight-bold">
                {{ row.item.name }}
              </b-link>
              <!--                          <strong class="text-primary" style="cursor: pointer"  v-model="row.detailsShowing" @click="row.toggleDetails">{{row.item.name}}</strong>-->
            </template>
            <template #cell(actions)="row">
              <div class="align-items-center">
                <feather-icon @click="openDialog(row.item)" v-b-tooltip.hover="$t('Global.edit')" class="pointer text-primary" icon="EditIcon" />
                <feather-icon v-if="row.item.users_count <= 0 && row.item.excepted != 1" @click="deleteRole(row.item.id)" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" />
                <feather-icon v-if="row.item.users_count > 0 || row.item.excepted == 1" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: not-allowed" class="text-dark" />
              </div>
            </template>
          </b-table>
        </b-col>
        <b-col cols="12">
          <div class="mx-2 mb-2">
            <b-row>
              <b-col cols="12" sm="6" class="d-flex align-items-center justify-content-center justify-content-sm-start">
                <!-- <div class="mx-1">
                                    <label>{{ $t('Global.show') }}</label>
                                    <v-select v-model="perPage"
                                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                              :options="pageOptions" :clearable="false"
                                              class="per-page-selector d-inline-block mx-50"/>
                                </div> -->
                <div class="mx-1">
                  <label>{{ $t('Global.Showing') }}</label>
                  <v-select :searchable="false" v-model="perPage" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="pageOptions" :clearable="false" class="per-page-selector d-inline-block mx-50 pointer" /> <label>{{ $t('Global.entries') }} </label>
                  <label class="mx-05"
                    >{{ $t('Global.from') }} {{ meta.from + 1 }}
                    {{ $t('Global.to') }}
                    {{ perPage >= meta.of ? meta.of.toString().replace(/^0+/, '') : meta.to.toString().replace(/^0+/, '') }}
                    {{ $t('Global.of') }} {{ meta.of }}
                  </label>
                </div>
                <div></div>
              </b-col>
              <!-- Pagination -->
              <b-col cols="12" sm="6" class="d-flex align-items-center justify-content-center justify-content-sm-end">
                <b-pagination v-if="items" :total-rows="items.length" v-model="currentPage" :per-page="perPage" first-number last-number class="mb-0 mt-1 mt-sm-0" prev-class="prev-item" next-class="next-item">
                  <template #prev-text>
                    <feather-icon icon="ChevronLeftIcon" size="18" />
                  </template>
                  <template #next-text>
                    <feather-icon icon="ChevronRightIcon" size="18" />
                  </template>
                </b-pagination>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </b-card>
    <b-modal v-model="roleDialog" centered id="modal-prevent-closing" ref="my-modal" :title="$t('Global.submit_role_name')" :cancel-title="$t('Global.cancel')" :ok-title="$t('Global.save')" cancel-variant="outline-secondary" @show="resetModal" @hidden="resetModal" @ok="handleOk">
      <validation-observer ref="simpleRules">
        <form :class="addLoad ? 'disabled_all' : ''" ref="form" @submit.stop.prevent="handleSubmit">
          
          <b-col md="12">
            <b-form-group :label="$t('Global.english_name')" label-for="name-input" invalid-feedback="Name is required">
              <validation-provider #default="{ errors }" name="name" rules="english|required">
                <b-form-input id="name-input" v-model="form.new_role" :state="errors.length > 0 ? false : null" @keypress="sanitizeEnglish($event)" />
                <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'new_role')" />
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group :label="$t('Global.arabic_name')" label-for="nameAr-input">
              <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                <b-form-input id="nameAr-input" v-model="form.name_local" class="right_left" :state="errors.length > 0 ? false : null" @keypress="sanitizeArabic($event)" />
                <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group :label="$t('Global.flags')" label-for="flags">
              <validation-provider #default="{ errors }" name="flags">
                <v-select :clearable="false" multiple :class="errors.length > 0 ? 'custom_invalid' : ''" v-if="flags" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="form.flags" :options="flags" class="w-100" :reduce="val => val.id">
                  <template v-slot:option="option">
                    {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                  </template>
                  <template #selected-option="{ name, name_local }">
                    <div style="display: flex; align-items: baseline">
                      <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                      <span v-else>{{ name }}</span>
                    </div>
                  </template>
                  <template #no-options>
                    {{ $t('noMatching') }}
                  </template>
                </v-select>
                <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name_local')" />
              </validation-provider>
            </b-form-group>
          </b-col>
          <!-- <b-col md="12">
            <b-form-group class="custom_inline" label="Types">
              <b-form-checkbox v-model="checked" name="check-button" switch> </b-form-checkbox>
            </b-form-group>
          </b-col>
          <b-col md="12" v-if="checked">
            <b-form-radio-group v-model="type" :options="types" class="mb-3" value-field="value" text-field="name" disabled-field="notEnabled"></b-form-radio-group>
          </b-col> -->
        </form>
      </validation-observer>
    </b-modal>
    
  </div>
</template>

<script>
import {
  BModal,
  BTable,
  BFormRadio,
  BFormRadioGroup,
  VBModal,
  BPopover,
  BFormCheckbox,
  BFormGroup,
  BCardText,
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BInputGroup,
  BInputGroupPrepend,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import { mapGetters } from 'vuex';
import Cookies from 'js-cookie';
import { PlusIcon, DeleteIcon } from 'vue-feather-icons';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required } from '@validations';
import DataTable from '@/views/components/table/DataTable';
import Multiselect from "@/views/components/common/Multiselect.vue";

export default {
  components: {
    Multiselect,
    DataTable,
    BCard,
    BPopover,
    BInputGroup,
    BFormRadio,
    BFormRadioGroup,
    BInputGroupPrepend,
    PlusIcon,
    ValidationObserver,
    ValidationProvider,
    localize,
    ValidationErrors,
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
    BTable,
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
      checked: false,
      perPage: 10,
      pageOptions: [5, 10, 20, 25, 50, 100],
      totalRows: 1,
      currentPage: 1,
      search_text: '',
      name: '',
      role_id: null,
      nameState: null,
      roleState: null,
      popoverShow: false,
      submittedNames: [],
      Permissions: [],
      Auth: JSON.parse(Cookies.get('user')),
      disabled: true,
      role_name: '',
      role: null,
      items: [],
      errorsdata: null,
      new_role: '',
      permissionDialog: false,
      permission_id: null,
      type: 1,
      types: [
        { value: 4, name: this.$t('Global.TECHING_STAFF') },
        { value: 2, name: this.$t('Global.CONTROL_TEAM') },
        { value: 1, name: this.$t('Global.ADMIN') },
        { value: 3, name: this.$t('Global.PROGRAM_COORDINATOR') },
      ],
      form: {
        new_role: '',
        name_local: null,
        flags: []
      },
      permissionForm: {
        label_name: '',
        label_name_local: '',
      },
      roleDialog: false,
      message: null,
      changed: true,
    };
  },
  watch: {
    role: function (role) {
      if (role) {
        this.$store.dispatch('roles/getRolePermissions', role.id).then(response => {
          this.Permissions = this.$store.getters['roles/rolePermissions'];
          this.disabled = false;
        });
      } else {
        this.Permissions = [];
      }
    },
  },
  computed: {
    ...mapGetters({
      permissionsGroups: 'roles/permissionsGroups',
      roles: 'roles/roles',
      flags: 'roles/flags',
      load: 'roles/rolesLoad',
      addLoad: 'roles/addLoad',
    }),
    meta() {
      return {
        from: this.perPage * (this.currentPage - 1),
        to: this.perPage * (this.currentPage - 1) + this.perPage,
        of: this.roles ? this.roles.length : '',
      };
    },
    fields() {
      let fields = [
        {
          key: 'name',
          label: this.$t('Global.english_name'),
        },
        {
          key: 'name_local',
          label: this.$t('Global.name_arabic'),
        },
        {
          key: 'users_count',
          label: this.$t('Global.users'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      return fields;
    },
  },
  mounted() {
    this.refresh();
  },
  methods: {
    search() {
      if (this.search_text) {
        this.items = this.roles.filter(str => {
          if ((str.name && str.name.toLowerCase().includes(this.search_text.toLowerCase())) || (str.name_local && str.name_local.toLowerCase().includes(this.search_text.toLowerCase()))) {
            return str;
          }
        });
      } else {
        this.items = this.roles;
      }
    },
    openDialog(data) {
      this.role_id = null;
      this.form = {};
      if (data) {
        console.log(data)
        this.form.new_role = data.name;
        this.form.name_local = data.name_local;
        this.form.flags = data.flags;
        this.type = data.type || 0;
        this.checked = data.type ? true : false;
        this.role_id = data.id;
      }
      this.roleDialog = true;
    },
    shortName(name) {
      var nameArr = name.split(' ');
      return nameArr[0].toLowerCase();
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    openPermission(permission) {
      this.permission_id = permission.id;
      this.permissionForm.label_name_local = permission.label_name_local;
      this.permissionForm.label_name = permission.label_name;
      this.permissionDialog = true;
    },
    checkruleFormValidity() {
      const valid = this.$refs.ruleForm.checkValidity();
      this.roleState = valid;
      return valid;
    },
    resetModal() {
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    permissionOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.savePermission();
    },
    deleteRole(id) {
      if (id) {
        this.$swal({
          title: `${this.$t('Global.deleteTitle')}`,
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: `${this.$t('Global.cancel')}`,
          confirmButtonText: `${this.$t('Global.deleteBtn')}`,
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
        })
          .then(result => {
            if (result.value) {
              this.popoverShow = false;
              this.$store.dispatch('roles/deleteRole', id).then(response => {
                this.refresh();
                this.$swal({
                  icon: 'success',
                  title: this.$t('Global.Deleted'),
                  showConfirmButton: false,
                  timer: 1500,
                });
                // this.$store.dispatch('roles/getRoles').then(response => {
                //     this.role = '';
                //     this.disabled = true;
                //     this.role_name = '';
                // });
                // this.$store.dispatch('roles/getAuthUserRolesPermissions', this.Auth.id);
              });
            }
          })
          .catch(error => {});
      }
    },
    updateRole() {
      if (this.role) {
        this.$store
          .dispatch('roles/updateRole', {
            id: this.role.id,
            data: {
              name: this.role.name,
              name_local: this.role.name_local,
              type: this.checked ? this.type : 0,
              permissions: this.Permissions,
            },
          })
          .then(response => {
            this.refresh();
            // this.$store.dispatch('roles/getRoles').then(response => {
            //     this.role = {id: this.role.id, type: 'role', name: this.role.name};
            //     this.changed = true;
            // });
            // this.$store.dispatch('roles/getAuthUserRolesPermissions', this.Auth.id);
            this.$swal({
              icon: 'success',
              title: this.$t('Global.Saved'),
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      this.addRole();
      // this.$nextTick(() => {
      //   this.$refs['my-modal'].toggle('#toggle-btn');
      // });
    },

    savePermission() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          this.$store
            .dispatch('roles/savePermission', {
              id: this.permission_id,
              data: this.permissionForm,
            })
            .then(response => {
              this.permissionDialog = false;
              this.refresh();
              this.$swal({
                icon: 'success',
                title: this.$t('Global.Saved'),
                showConfirmButton: false,
                timer: 1500,
              });
              this.permissionForm.label_name = null;
              this.permissionForm.label_name_local = null;
            })
            .catch(error => {
              console.log(error)
              this.errorToast(this.$t('role_exist'));
            });
        }
      });
    },
    addRole() {
      // console.log(this.form.flags);
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          if (this.form.new_role !== '') {
            this.roleDialog = false;
            this.$store
              .dispatch('roles/addRole', {
                id: this.role_id,
                data: {
                  name: this.form.new_role,
                  name_local: this.form.name_local,
                  flags: this.form.flags,
                  type: this.checked ? this.type : 0,
                },
              })
              .then(response => {
                this.message = null;
                this.role = this.$store.getters['roles/newRole'];
                this.$swal({
                  icon: 'success',
                  title: this.$t('Global.Saved'),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.form.new_role = null;
                this.form.name_local = null;
                this.roleDialog = false;
                this.refresh();
              })
              .catch(error => {
                console.log(error.response.data.errors[0])
                this.form.new_role = null;
                this.roleDialog = false;
                this.form.name_local = null;
                this.errorToast(error.response.data.errors[0].code);
              });
          }
        }
      });
    },
    refresh() {
      this.$store.dispatch('roles/getRoles').then(_ => {
        this.items = this.roles;
      });
    },
    addStatus(value) {
      let ids = Array.from(value, (item) => item.id);
      this.form.flags = ids.filter((n) => n);
    },
    remove(removedOption) {
      const objWithIdIndex = this.form.flags.findIndex(
        (obj) => obj === removedOption.id
      );
      if (objWithIdIndex > -1) {
        this.form.flags.splice(objWithIdIndex, 1);
      }
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
