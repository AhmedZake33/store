<template>
  <div>
    <edit :inline="true" v-if="params.status == 1 || params.status == 2" :params="params"
          @hide="hide()"></edit>
    <DataTable v-else dependentProp="departments" apiLink="instructors" importBtn :title="title" :total="total" :allow-search="true" :tabNum="tabNum"
               :filter="filter"
               :loading="load['instructors']" @reset="filter = { export: 0,department_id:null, removed: 0 }" @Refresh="refresh"
               @Export="Export"
               exportPermission="export_instructor">
      <template v-if="lookups['instructors']" #filter>
        <b-col v-if="!department_id && !faculty_id" cols="12" md="4">
          <v-select v-model="filter.faculty_id" :filter="fuseSearch"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups['instructors'] && lookups['instructors'].faculties"
                    label="name" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.faculty')">
            <template slot="selected-option" slot-scope="option">
            <strong v-if="$i18n.locale == 'ar'">
              {{ option.name_local || option.name }}
            </strong>
            <strong v-else>
              {{ option.name || option.name_local }}
            </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col v-if="!department_id" cols="12" md="4">
          <v-select v-model="filter.department_id" :filter="fuseSearch"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="load['departmentslookup'] ? [] : dependentLookups['departments']"
                    label="name" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.departments')">
            <template slot="selected-option" slot-scope="option">
            <strong v-if="$i18n.locale == 'ar'">
              {{ option.name_local || option.name }}
            </strong>
              <strong v-else>
              {{ option.name || option.name_local }}
            </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #no-options>
              {{ load['departmentslookup']  ? $t("Global.inProgress") : $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4">
          <v-select v-model="filter.rank_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups['instructors'] && lookups['instructors'].ranks" label="name" class="w-100 mb-2" :reduce="val => val.id"
                    :placeholder="$t('Global.rank')">
            <template slot="selected-option" slot-scope="option">
            <strong v-if="$i18n.locale == 'ar'">
              {{ option.name_local || option.name }}
            </strong>
              <strong v-else>
              {{ option.name || option.name_local }}
            </strong>
            </template>
            <template v-slot:option="option">
            <span v-if="$i18n.locale == 'ar'">
              {{ option.name_local || option.name }}
            </span>
              <span v-else>
              {{ option.name || option.name_local }}
            </span>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="12" md="4">
          <v-select v-model="filter.employee_type" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups['instructors'] && lookups['instructors'].employee_types" label="full_time" class="w-100" :reduce="val => val.id"
                    :placeholder="$t('Global.Employment')">
            <template slot="selected-option" slot-scope="option">
            <strong v-if="$i18n.locale == 'ar'">
              {{ option.name_local || option.name }}
            </strong>
              <strong v-else>
              {{ option.name || option.name_local }}
            </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="12" md="4">
          <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    v-model="filter.role_id" :options="lookups['instructors'] && lookups['instructors'].roles" class="w-100" :reduce="val => val.id"
                    :placeholder="$t('Global.role')">
            <template slot="selected-option" slot-scope="option">
            <strong>
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
            </template>
          </v-select>
        </b-col>

        <!--            <b-col v-if="department_id || faculty_id" cols="6" md="4">-->
        <!--                <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.removed"-->
        <!--                          :options="getStatusList(true)" class="w-100" :reduce="val => val.value"-->
        <!--                          :placeholder="$t('Global.status')">-->
        <!--                    <template slot="selected-option" slot-scope="option">-->
        <!--            <span>-->
        <!--              {{ $t(`Global.${option.label}`) }}-->
        <!--            </span>-->
        <!--                    </template>-->
        <!--                    <template v-slot:option="option">-->
        <!--                        {{ $t(`Global.${option.label}`) }}-->
        <!--                    </template>-->
        <!--                </v-select>-->
        <!--            </b-col>-->

        <b-col cols="12" md="4" v-if="hasPermission('restore_instructor') || hasPermission('delete_instructor')">
          <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.removed"
                    :options="getStatusList(true)" class="w-100" :reduce="val => val.value"
                    :placeholder="$t('Global.status')">
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
        <b-table           @sort-changed="sortingChanged"
          no-local-sorting class="position-relative"
                 :items="items" responsive striped :fields="fields" primary-key="id" show-empty
                 :empty-text="load['instructors'] ? $t('Global.inProgress') : $t('Global.empty_text')">
          <template #cell(name)="data">
            <b-media vertical-align="center" class="d-flex align-items-center">
              <template #aside>
                <b-avatar size="32" :src="user_photo(data.item.archive_id)"
                          :text="avatarText(data.item.academic_name)"/>
              </template>
              <b-link v-if="$i18n.locale == 'en'"
                      :to="{ name: 'staff-show', params: { id: data.item.id } }" class="font-weight-bold">
                {{ shortMyText(data.item.academic_name, 50) }}
              </b-link>
              <b-link v-if="$i18n.locale == 'ar'"
                      :to="{ name: 'staff-show', params: { id: data.item.id } }" class="font-weight-bold">
                {{ shortMyText(data.item.academic_name_local, 50) }}
              </b-link>
            </b-media>
          </template>
          <template #cell(code)="data">
            <div>
              {{ data.item.code }}
            </div>
          </template>
          <template #cell(faculty)="data">
            <div v-if="data.item && data.item.faculty && data.item.faculty.name">
              <b-link v-if="$i18n.locale == 'en'"
                      :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
                      class="font-weight-bold">
                {{ data.item.faculty.name ? data.item.faculty.name : '_' }}
              </b-link>
              <b-link v-if="$i18n.locale == 'ar'"
                      :to="{ name: 'faculty', params: { id: data.item.department.faculty.id } }">
                {{ data.item.faculty.name_local ? data.item.faculty.name_local : '_' }}
              </b-link>
            </div>
          </template>
          <template #cell(department)="data">
            <div v-if="data.item && data.item.department && data.item.department.id">
              <b-link v-if="$i18n.locale == 'en'"
                      :to="{name:'department', params: { id: data.item.department.id } }"
                      class="font-weight-bold">
                <!--              {{ data.item.department.faculty ? data.item.department.faculty.name : '_' }} - -->
                {{ data.item.department.name ? data.item.department.name : '_' }}
              </b-link>
              <b-link v-if="$i18n.locale == 'ar'"
                      :to="{name:'department', params: { id: data.item.department.id } }">
                <!--              {{ data.item.department.faculty ? data.item.department.faculty.name_local : '_' }}-->
                {{ data.item.department.name_local ? shortMyText(data.item.department.name_local) : '_' }}
              </b-link>
            </div>
          </template>
          <!-- <template #cell(rank)="data">
            <div v-if="data.item.rank_name">
            <span v-if="$i18n.locale == 'en'" class="font-weight-bold">
              {{ data.item.rank_name }}
            </span>
              <span v-if="$i18n.locale == 'ar'">
              {{ data.item.rank_name_local }}
            </span>
            </div>
          </template> -->
          <!-- <template #cell(employee_type)="data">
            <div v-if="data.item.employee_type_name">
            <span v-if="$i18n.locale == 'en'" class="font-weight-bold">
              {{ data.item.employee_type_name }}
            </span>
              <span v-if="$i18n.locale == 'ar'">
              {{ data.item.employee_type_name_local }}
            </span>
            </div>
          </template> -->
          <!-- <template #cell(status)="data">
            <b-badge pill :variant="`light-${getStatus(data.item.user_removed).color}`" class="text-capitalize">
              {{ getStatus(data.item.user_removed).name }}
            </b-badge>
          </template> -->
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
              <!--                        <b-link -->
              <!--                                v-if="$route.name != 'schedules'"-->
              <!--                                v-b-tooltip.hover="$t('Global.access')"-->
              <!--                                :to="{ name: 'user-access', params: { id: data.item.id } }" class="mx-0">-->
              <!--                            <feather-icon icon="KeyIcon"/>-->
              <!--                        </b-link>-->
              <!-- <b-link :to="{ name: 'staff-show', params: { id: data.item.id } }">
                            <feather-icon icon="EyeIcon" />
                          </b-link> -->
              <b-link v-if="hasPermission('access_offeringSchedule') && $route.name == 'schedules'"
                      @click="openCalendar(data.item.id)">
                <!-- <feather-icon
                    v-b-tooltip.hover="$t('Global.schedule')" icon="CalendarIcon" style="cursor: pointer"
                /> -->
                <feather-icon
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    class="text-primary"
                />
              </b-link>
              <b-link v-b-tooltip.hover="$t('Global.access')"
                      v-if="!faculty_id && hasPermission('edit_roles') && $route.name != 'schedules'"
                      :to="{ name: 'user-access', params: { id: data.item.id } }" class="mx-0">
                <feather-icon icon="KeyIcon"/>
              </b-link>
              <feather-icon v-if="hasPermission('edit_instructor') && $route.name != 'schedules'"
                            v-b-tooltip.hover="$t('Global.edit')"
                            class="pointer" icon="EditIcon" @click="open(data.item.id)"/>
              <feather-icon
                  v-if="hasPermission('delete_instructor') && data.item.user_removed == 0 && $route.name != 'schedules'"
                  v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer"
                  class="text-danger" @click="remove(data.item.user.id)"/>
              <feather-icon
                  v-if="hasPermission('delete_instructor') && data.item.user_removed == 1 && $route.name != 'schedules'"
                  v-b-tooltip.hover="$t('Global.restore')" icon="RepeatIcon" style="cursor: pointer"
                  @click="restore(data.item.user.id)"/>
              <!--            <feather-icon v-if="department_id" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" @click="removeLink(department_id, data.item.id)" />-->
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
        <b-button :to="{ name: 'staff-add' }"
                  v-if="hasPermission('add_instructor')"
                  v-b-tooltip.hover="$t('Global.add')" variant="primary" class="btn-icon mr-1">
          <feather-icon icon="PlusIcon"/>
        </b-button>
        <!-- <b-button v-b-tooltip.hover="$t('Global.export_excel')"
                  v-if="hasPermission('export_instructor') && $route.name != 'schedules'" class="btn-icon"
                  variant="primary" @click="filter.export = 1">
          <feather-icon icon="FileTextIcon"/>
        </b-button> -->
        <!-- <b-button v-b-tooltip.hover="$t('Global.importMigrationData')"
                  :class="'ml-1'"
                  class="btn-icon" variant="primary" @click="toggleMigrationModal"
                  v-if="hasPermission('import_migrationData') || hasPermission('import_halls_migrationData')">
          <feather-icon icon="UploadCloudIcon"/>
        </b-button> -->
      </template>
    </DataTable>

    <Modal :hint="$t('Global.importMigrationData')" :link="'/instructors/import_migrated_instructors'" :title="$t('Global.importMigrationData')" :show="importMigrationModal"></Modal>
  </div>
</template>

<script>
import {
  BFormFile,
  BForm,
  BFormGroup,
  BAlert,
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
  BPopover
} from 'bootstrap-vue';
import Modal from "@/views/components/common/Modal.vue"
import {mapActions, mapGetters} from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import {avatarText} from '@core/utils/filter';
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import Edit from '@/views/user_settings/staff/edit';
import DataTable from '@/views/components/table/DataTable';
import {getToken} from "@/utils/auth";
import { required } from '@validations'

export default {
  components: {
    Modal,
    DataTable,
    BCard,
    Edit,
    vSelect,
    BRow,
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
    BModal,
    VBModal,
    BPopover,
    BFormFile,
    BForm,
    BFormGroup,
    BAlert,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    excel_name: '',
    faculty_id: null,
    department_id: null,
    noStatus: Boolean,
    inline: false,
    tabNum: null
  },
  data() {
    return {
      itemsIN:null,
      filter: {
        removed: 0,
        export: 0,
        department_id: null,
        faculty_id: null,
        employee_type: null,
        rank_id: null
      },
      params: {},
      // importMigrationModal: false,
      migrationFiles: [],
      statusModal: false,
      status_messages: [],
      showCloseButton: false,
    };
  },
  computed: {
    ...mapGetters({
      items: 'instructors/items',
      total: 'instructors/total',
      load: "app/generalLoad",
      needDrop:'app/needDrop',
      lookups: 'app/stateLookups',
      dependentLookups:'app/dependentLookups'
    }),

    fields() {
      let fields = [
        {
          key: 'code',
          label: this.$t('Global.code'),
          sortable: true,
          thStyle: {width: '5%'},
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
          thStyle: {width: '20%'},
        },
        // {
        //   key: 'rank',
        //   label: this.$t('Global.rank'),
        //   sortable: true,
        //   thStyle: {width: '20%'},
        // },
        {
          key: 'faculty',
          label: this.$t('Global.faculty'),
          sortable: true,
        },
        {
          key: 'department',
          label: this.$t('Global.department'),
          sortable: true,
        },
        // {
        //   key: 'employee_type',
        //   label: this.$t('Global.full_time'),
        //   sortable: true,
        // },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      if (this.noStatus) {
        fields = fields.filter(obj => !['status'].includes(obj.key));
      }
      if (this.department_id) {
        fields = fields.filter(obj => !['department', 'faculty'].includes(obj.key));
      }
      if (this.faculty_id) {
        fields = fields.filter(obj => !['faculty'].includes(obj.key));
      }
      return fields;
    },
  },
  methods: {
    ...mapActions({
      removeDepartmentLink: 'instructors/removeDepartmentLink',
      exportTemplate: 'instructors/exportMigrationTemplate',
    }),
    hide(){
      this.params['status'] = 3
    },
    refresh(query) {
      query = {...query, type: this.type};

      if (this.faculty_id) {
        query = {...query, faculty_id: this.faculty_id};
      }

      if (this.department_id) {
        query = {...query, department_id: this.department_id};
      }

      this.$store.dispatch('instructors/instructors', {query})
    },
    open(id) {
      this.$router.push({name: 'staff-show', params: {id: id}, query: {inline: true}});
    },
    openCalendar(id) {
      this.$router.push({
        name: "instructor-schedule",
        params: {
          id,
        },
      });
    },
    Export(query) {
      query = {...query, language: this.$i18n.locale, excel_name: this.excel_name};
      if (this.faculty_id) {
        query = {...query, faculty_id: this.faculty_id};
      }

      if (this.department_id) {
        query = {...query, department_id: this.department_id};
      }

      this.$store.dispatch('instructors/export', query).then(_ => {
        this.filter.export = 0;
      });
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
      }).then(result => {
        if (result.value) {
          this.$store.dispatch('instructors/remove', userId).then(_ => {
            this.refresh();
            this.$swal({
              icon: 'success',
              title: this.$t('Global.deleted'),
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }
      });
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
      }).then(result => {
        if (result.value) {
          this.$store.dispatch('users/restore', userId).then(_ => {
            this.refresh();
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }
      });
    },

    removeLink(parentId, childId) {
      const payload = {department_id: parentId, instructor_id: childId};
      this.removeDepartmentLink(payload)
          .then(data => {
            if (data.status == 'success') {
              this.successToast(this.$t('Instructor Removed From Department Successfully'));
              this.refresh(null);
            }
          })
          .catch(error => {
            this.errorToast(this.$t('error, please try again'));
          });
    },
    // toggleMigrationModal() {
    //   this.importMigrationModal = !this.importMigrationModal;
    // },
    exportMigrationTemplate() {
      this.exportTemplate();
    },
    async uploadMigrationData() {
      this.$refs.importForm.validate().then(success => {
        if (success) {
          this.$swal({
            title: "Are you sure?",
            text: `${this.$t("Global.confirmUpload")}`,
            icon: "warning",
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: `${this.$t("Global.cancel")}`,
            confirmButtonText: `${this.$t("Global.yes_import")}`,
            customClass: {
              confirmButton: "btn btn-primary",
              cancelButton: "btn btn-outline-danger ml-1",
            },
            buttonsStyling: false,
          }).then(async (result) => {
            if (result.value) {
              this.total_message = "";
              this.status_messages = [];
              this.statusModal = true;
              this.showCloseButton = false;

              const data = new FormData();
              for (let i = 0; i < this.migrationFiles.length; i++) {
                let file = this.migrationFiles[i];
                data.append('files[' + i + ']', file);
              }
              let url = process.env.VUE_APP_BASE_URL + "/instructors/import_migrated_instructors";
              const response = await fetch(url, {
                headers: {
                  Authorization: "Bearer " + getToken(),
                },
                method: "POST",
                body: data,
              });
              let isDone = false;
              const reader = response.body
                  .pipeThrough(new TextDecoderStream())
                  .getReader();
              while (!isDone) {
                const {value, done} = await reader.read();
                if (done || isDone) {
                  this.migrationFiles = [];
                  this.toggleMigrationModal();
                  this.refresh();
                  this.showCloseButton = true;
                  this.$swal({
                    icon: "success",
                    title: this.$t("Global.success"),
                    showConfirmButton: true,
                    text: this.$t("Global.import_done_successfully"),
                  });
                  break;
                }

                let allObjects = typeof value !== "undefined" ? value.split("}") : {};
                if (allObjects.length) {
                  for (let i = 0; i < allObjects.length; i++) {
                    if (allObjects[i].trim() !== "" && allObjects[i].trim()) {
                      let object = allObjects[i] + "}";
                      object = JSON.parse(object);
                      if (object.done === false && object.failed === false) {
                        this.setStatusesMessages(object);
                      } else if (object.done === true && object.failed === false) {
                        isDone = true;
                        this.migrationFiles = [];
                        this.toggleMigrationModal();
                        this.refresh();
                        this.showCloseButton = true;
                        this.$swal({
                          icon: "success",
                          title: this.$t("Global.success"),
                          showConfirmButton: true,
                          text: this.$t("Global.import_done_successfully"),
                        });
                      } else if (object.failed === true) {
                        isDone = true;
                        this.migrationFiles = [];
                        this.toggleMigrationModal();
                        this.refresh();
                        this.showCloseButton = true;
                        this.$swal({
                          icon: "error",
                          title: this.$t("Global.failed"),
                          showConfirmButton: true,
                          text: object.message,
                        });
                      }
                    }
                  }
                }
              }
            }
          });
        }
      });
    },
    setStatusesMessages(object) {
      if (typeof object.done !== undefined) {
        let status_message = {};
        status_message.status = object.status;
        status_message.class = object.status ? 'success' : 'danger';
        status_message.message = object.message;
        this.status_messages.push(status_message);
      }
      return true;
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
