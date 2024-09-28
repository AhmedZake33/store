<template>
  <DataTable :total="total" :allow-search="true" :filter="filter" :loading="load"
             @reset="filter = { export: 0, removed: 0 }" @Refresh="refresh" @Export="Export"
             :paramsLoaded="paramsLoaded"
  >
    <template #filter v-if="lookups">
      <!--      <b-col cols="12" md="4">-->
      <!--        <v-select v-model="filter.country_id" :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.countries" label="name" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.country')" />-->
      <!--      </b-col>-->
      <!--      {{lookups}}-->
      <b-col cols="12" md="4">
        <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.type"
                  :options="lookups.types" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.type')"
        >
          <template slot="selected-option" slot-scope="option">
            <span class="text-capitalize">
            {{ $i18n.locale == 'ar' && option.name_local ? option.name_local : option.name ? option.name : '' }}
            </span>
          </template>
          <template v-slot:option="option">
            <span class="text-capitalize">
            {{ $i18n.locale == 'ar' && option.name_local ? option.name_local : option.name ? option.name : '' }}
            </span>
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4">
        <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                  v-model="filter.role_id" :options="lookups.roles" class="w-100" :reduce="val => val.id"
                  :placeholder="$t('Global.role')"
        >
          <template slot="selected-option" slot-scope="option">
            <span>
            {{ $i18n.locale == 'ar' && option.name_local ? option.name_local : option.name ? option.name : '' }}
            </span>
          </template>
          <template v-slot:option="option">
            {{ $i18n.locale == 'ar' && option.name_local ? option.name_local : option.name ? option.name : '' }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4" v-if="hasPermission('restore_user') || hasPermission('delete_user')">
        <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                  v-model="filter.removed" :options="getStatusList(true)" class="w-100" :reduce="val => val.value"
                  :placeholder="$t('Global.status')"
        >
          <template slot="selected-option" slot-scope="option">
            <span>
              {{ $t(`Global.${option.label}`) }}
            </span>
          </template>
          <template v-slot:option="option">
            {{ $t(`Global.${option.label}`) }}
          </template>
        </v-select>
      </b-col>
    </template>
    <template #customTable>
      <b-table @sort-changed="sortingChanged"
               no-local-sorting :items="items" responsive
               striped :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')"
      >
        <template #cell(name)="data">
          <b-media vertical-align="center" class="d-flex align-items-center">
            <template #aside>
              <b-avatar size="32" :text="avatarText(data.item.name)" :src="user_photo(data.item.archive_id)"/>
            </template>
            <b-link v-if="$i18n.locale == 'en'" :to="{ name: 'user-show', params: { id: data.item.id } }"
                    class="font-weight-bold d-block text-nowrap text-truncate"
            >
              {{ data.item ? data.item.name : '_' }}
            </b-link>
            <b-link v-if="$i18n.locale == 'ar'" :to="{ name: 'user-show', params: { id: data.item.id } }">
              {{ data.item ? data.item.name_local : '_' }}
            </b-link>
          </b-media>
        </template>
        <template #cell(status)="data">
          <b-badge pill :variant="`light-${getStatus(data.item.removed).color}`" class="text-capitalize">
            {{ getStatus(data.item.removed).name }}
          </b-badge>
        </template>
        <template #cell(type)="data">
          <span class="text-capitalize">
            {{ data.item.type ? data.item.type.name : '-' }}
          </span>
        </template>
        <template #cell(actions)="data">
          <div class="align-items-center">
            <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
            >
              <template #button-content>
                <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                />
              </template>
            </b-dropdown>
            <b-link v-b-tooltip.hover="$t('Global.access')" v-if="hasPermission('edit_roles')"
                    :to="{ name: 'user-access', params: { id: data.item.id } }" class="mx-0"
            >
              <feather-icon icon="KeyIcon"/>
            </b-link>
            <!-- <feather-icon icon="KeyIcon" class="text-primary" style="cursor: pointer"  :to="{ name: 'user-access' }"/> -->

            <b-link v-if="hasPermission('edit_users')" v-b-tooltip.hover="$t('Global.edit')"
                    class="mx-0 d-inline-flex"
                    :to="{ name: `${getEditLink(data.item)}-show`, params: { id: data.item.id },query:{inline:true} }"
            >
              <feather-icon icon="EditIcon" style="cursor: pointer"/>
            </b-link>
            <feather-icon v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer"
                          class="text-danger" v-if="data.item.removed == 0 && hasPermission('delete_users')"
                          @click="remove(data.item.id)"
            />
            <feather-icon v-b-tooltip.hover="$t('Global.restore')" icon="RepeatIcon" style="cursor: pointer"
                          v-else-if="hasPermission('delete_users')" @click="restore(data.item.id)"
            />
          </div>
        </template>
      </b-table>
      <b-modal id="modalPopover" v-model="dialog" no-close-on-backdrop size="lg" :title="title">
        <validation-observer ref="simpleRules">
          <b-form :class="load ? 'disabled_all' : ''">
            <div class="row">
              <b-col md="12">
                <b-form-group :label="$t('faculties')" label-for="faculty">
                  <validation-provider #default="{ errors }" name="faculties_ids" rules="required">
                    <v-select v-model="ruleForm.faculties_ids" :filter="fuseSearch" :label="getSelectLabel()"
                              :reduce="re => re.id" :class="errors.length > 0 ? 'custom_invalid' : ''"
                              :options="allLookups ? allLookups.faculties : []" multiple
                    />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row :class="load ? 'disabled_all' : ''">
            <b-col md="12">
              <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1"
                        @click="submit"
              >
                {{ $t('Global.save') }}
              </b-button>
              <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary"
                        @click="dialog = false"
              >
                {{ $t('Global.cancel') }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </template>
    <template #action>
      <b-button :to="{ name: 'user-add' }" v-if="hasPermission('add_users')" v-b-tooltip.hover="$t('Global.add')"
                variant="primary" class="btn-icon mr-1"
      >
        <feather-icon icon="PlusIcon"/>
      </b-button>
      <b-button v-b-tooltip.hover="$t('Global.export_excel')" class="btn-icon" variant="primary"
                @click="filter.export = 1" v-if="hasPermission('export_users')"
      >
        <feather-icon icon="FileTextIcon"/>
      </b-button>
    </template>
  </DataTable>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
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
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
  BFormGroup,
  BForm
} from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import { avatarText } from '@core/utils/filter'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required, email } from '@validations'
import DataTable from '@/views/components/table/DataTable'

export default {
  components: {
    DataTable,
    BFormGroup,
    BCard,
    vSelect,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BForm,
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
    BModal,
    VBModal,
    BPopover,
    ValidationProvider,
    ValidationObserver,
    localize,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      lookupModules: {
        faculties: true,
        bylaws: true,
        programs: true,
      },
      allLookups: null,
      dialog: false,
      filter: {
        export: 0,
        removed: 0,
        type: null,
        role_id: null
      },
      ruleForm: {
        faculties_ids: [],
      },
      user_id: null,
      user_name: null,
      paramsLoaded: true,
    }
  },
  computed: {
    ...mapGetters({
      items: 'users/items',
      total: 'users/total',
      load: 'users/load',
      needDrop: 'app/needDrop',
      lookups: 'users/lookups',
    }),
    title() {
      if (this.user_name) {
        return this.$t('Global.userAccessControl') + ' ( ' + this.user_name + ' )'
      } else {
        return this.$t('Global.userAccessControl')
      }
    },
    fields() {
      let fields = [
        {
          key: 'code',
          label: this.$t('Global.code'),
          sortable: true,
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
        },

        {
          key: 'email',
          label: this.$t('Global.email'),
          sortable: true,
        },
        {
          key: 'mobile',
          label: this.$t('Global.mobile'),
          sortable: true,
        },
        {
          key: 'type',
          label: this.$t('Global.type'),
          sortable: true,
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]

      return fields
    },
  },
  methods: {
    ...mapActions({
      setAccessControl: 'users/setAccessControl',
      exportExcel: 'users/export',
    }),
    // fetchLookups() {
    //   this.getLookups(this.lookupModules).then(data => {
    //     this.allLookups = data.success;
    //   });
    // },
    getEditLink(item) {
      if (item && item.type) {
        if (item.type.type == 1) {
          return 'staff'
        } else if (item.type.type == 2) {
          return 'employee'
        } else {
          return 'users'
        }
      }
    },
    openDialog(item) {
      this.user_id = item.id
      this.user_name = item.name
      this.ruleForm.faculties_ids = item?.access?.faculties_ids
      this.dialog = true
    },
    open(id) {
      return this.$router.push({
        name: 'user-show',
        params: { id },
        query: { inline: true }
      })
    },
    refresh(query) {
      if (this.type) {
        query = {
          ...query,
          type: this.type
        }
      }
      this.$store.dispatch('users/users', { query })
          .then(() => {
            this.paramsLoaded = false
          })
    },
    submit() {
      this.$refs.simpleRules
          .validate()
          .then(success => {
            if (success) {
              const payload = {
                query: { faculties_ids: this.ruleForm.faculties_ids },
                id: this.user_id,
              }
              this.setAccessControl(payload)
                  .then(response => {
                    this.$swal({
                      icon: 'success',
                      title: `${this.$t('Global.saved')}`,
                      showConfirmButton: false,
                      timer: 2000,
                    })
                    this.refresh()
                    this.dialog = false
                    this.user_id = null
                    this.user_name = null
                  })
                  .catch(error => {
                    // this.$toast({
                    //   component: ToastificationContent,
                    //   position: 'top-right',
                    //   props: {
                    //     title: 'Error',
                    //     variant: 'danger',
                    //     text: `${error || $t('Global.errorMessage')}`,
                    //   },
                    // })
                    this.dialog = false
                    this.user_id = null
                    this.user_name = null
                  })
            }
          })
          .catch(_ => {
            const query = {
              payload: { faculties_ids: this.ruleForm.faculties_ids },
              id: this.user_id,
            }
            this.setAccessControl({ query })
                .then(response => {
                  this.$swal({
                    icon: 'success',
                    title: `${this.$t('Global.saved')}`,
                    showConfirmButton: false,
                    timer: 2000,
                  })
                  this.refresh()
                  this.dialog = false
                  this.user_id = null
                })
                .catch(error => {
                  // this.$toast({
                  //   component: ToastificationContent,
                  //   position: 'top-right',
                  //   props: {
                  //     title: 'Error',
                  //     variant: 'danger',
                  //     text: `${error || $t('Global.errorMessage')}`,
                  //   },
                  // })
                  this.dialog = false
                  this.user_id = null
                })
          })
    },
    remove(userId) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
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
              this.$store.dispatch('users/remove', userId)
                  .then(_ => {
                    this.refresh(this.filter)
                    this.$swal({
                      icon: 'success',
                      title: this.$t('Global.deleted'),
                      showConfirmButton: false,
                      timer: 1500,
                    })
                  })
            }
          })
    },

    open_role(id) {
      window.open(this.$router.resolve({
        name: 'user-role',
        params: { id: id }
      }).href, '_blank')
    },
    restore(userId) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.active_message')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.Activate')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      })
          .then(result => {
            if (result.value) {
              this.$store.dispatch('users/restore', userId)
                  .then(_ => {
                    this.refresh()
                    this.$swal({
                      icon: 'success',
                      title: `${this.$t('Global.saved')}`,
                      showConfirmButton: false,
                      timer: 1500,
                    })
                  })
            }
          })
    },
    Export(query) {
      const payload = {
        ...query,
        language: this.$i18n.locale
      }
      this.exportExcel(payload)
          .then(() => this.filter.export = 0)
          .catch(() => this.filter.export = 0)

    },
  },
  mounted() {
    // this.fetchLookups();
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
