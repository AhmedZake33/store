<template>
  <div>
    <DataTable apiLink="employees" :total="total" :allowSearch="true" :filter="filter" :loading="load['employees']" @Refresh="refresh" @Export="Export" importBtn exportPermission="export_employee">
      <template #filter>
        <!-- <b-col cols="12" md="4">
          <v-select :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.country_id" :options="lookups.countries" label="name" class="w-100" :reduce="val => val.id" placeholder="All Countries" />
        </b-col> -->
        <b-col cols="12" md="4" v-if="hasPermission('restore_employee') || hasPermission('delete_employee') ">
          <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.removed"
                    :options="getStatusList(true)" class="w-100" :reduce="val => val.value" placeholder="Users Status">
            <template slot="selected-option" slot-scope="option">
            <strong>
              {{ $t(`Global.${option.label}`) }}
            </strong>
            </template>
            <template v-slot:option="option">
              {{ $t(`Global.${option.label}`) }}
            </template>
          </v-select>
        </b-col>
      </template>
      <template #customTable>
        <b-table @sort-changed="sortingChanged"
          no-local-sorting class="position-relative"
                 :items="items" responsive :fields="fields" primary-key="id" show-empty
                 :empty-text="load['employeeslookup'] ? $t('Global.inProgress') : $t('Global.empty_text')">
          <template #cell(name)="data">
            <b-media vertical-align="center" class="d-flex align-items-center">
              <!-- <template #aside>
                <b-avatar size="32" :text="avatarText(data.item.name)"
                          :src="photo(data.item.archive_id)"/>
              </template> -->
              <b-link v-if="$i18n.locale == 'en' && data.item && data.item.name" :to="{ name: 'employee-show', params: { id: data.item.id } }"
                      class="font-weight-bold d-block text-nowrap text-truncate">
                {{ data.item.name ? data.item.name : '_' }}
              </b-link>
              <b-link :to="{ name: 'employee-show', params: { id: data.item.id } }" v-if="$i18n.locale == 'ar' && data.item && data.item.name_local">
                {{ data.item.name_local ? shortMyText(data.item.name_local) : '_' }}
              </b-link>
            </b-media>
          </template>
          <template #cell(code)="data">
            <div v-if="data.item && data.item.code">
              {{ data.item.code }}
            </div>
          </template>
          <!-- <template #cell(email)="data" class="text-truncate">
            <div>
              {{ data.item.user_email ? data.item.user_email : '_' }}
            </div>
          </template>
          <template #cell(mobile)="data">
            <div>
              {{ data.item.user_mobile ? data.item.user_mobile : '_' }}
            </div>
          </template>
          <template #cell(status)="data">
            <b-badge pill :variant="`light-${getStatus(data.item.user_removed).color}`" class="text-capitalize">
              {{ getStatus(data.item.user_removed).name }}
            </b-badge>
          </template> -->
          <template #cell(actions)="data">
            <div class=" align-items-center">
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
              <b-link v-b-tooltip.hover="$t('Global.edit')"
                      :to="{ name: 'employee-show', params: { id: data.item.id },query:{inline:true} }" class="mx-0">
                <feather-icon icon="EditIcon"/>
              </b-link>
              <feather-icon v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer"
                            class="text-danger" v-if="data.item.user_removed == 0" @click="remove(data.item.id)"/>
              <feather-icon v-b-tooltip.hover="$t('Global.restore')" icon="RepeatIcon" style="cursor: pointer" v-else
                            @click="restore(data.item.id)"/>
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
        <b-button :to="{ name: 'employee-add' }" v-b-tooltip.hover="$t('Global.add')" variant="primary"
                  class="btn-icon mr-1">
          <feather-icon icon="PlusIcon"/>
        </b-button>
        <!-- <b-button v-b-tooltip.hover="$t('Global.export_excel')" v-if="hasPermission('export_employee')" class="btn-icon"
                  variant="primary" @click="filter.export = 1">
          <feather-icon icon="FileTextIcon"/>
        </b-button> -->
        <!-- <b-button v-b-tooltip.hover="$t('Global.importMigrationData')"
                  :class="'ml-1'"
                  class="btn-icon" variant="primary" @click="toggleMigrationModal"
                  v-if="hasPermission('import_migrationData') || hasPermission('import_halls_migrationData')">
          <feather-icon icon="UploadCloudIcon"/>
        </b-button> -->
        <!--        <b-button v-b-tooltip.hover="$t('Global.exportMigrationDataTemplate')"
                          :class="'ml-1'"
                          class="btn-icon" variant="primary" @click="exportMigrationTemplate"
                          v-if="hasPermission('import_migrationData')">
                  <feather-icon icon="DownloadCloudIcon"/>
                </b-button>-->
      </template>
    </DataTable>
    <Modal :hint="$t('Global.importMigrationData')" :link="'/employees/import_migrated_employees'" :title="$t('Global.importMigrationData')" :show="importMigrationModal"></Modal>

  </div>
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
  BFormFile,
  BForm,
  BFormGroup,
  BAlert,
} from 'bootstrap-vue';
import Modal from "@/views/components/common/Modal.vue"
import DataTable from '@/views/components/table/DataTable';
import {mapActions, mapGetters} from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import {avatarText} from '@core/utils/filter';
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import {getToken} from "@/utils/auth";
import { required } from '@validations'

export default {
  components: {
    Modal,
    DataTable,
    BCard,
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
  data() {
    return {
      filter: {export: 0, removed: 0},
      // importMigrationModal: false,
      migrationFiles: [],
      statusModal: false,
      status_messages: [],
      showCloseButton: false,

    };
  },
  computed: {
    ...mapGetters({
      items: 'employees/items',
      total: 'employees/total',
      needDrop:'app/needDrop',
      load: 'app/generalLoad',
      lookups: 'app/stateLookups',
    }),
    fields() {
      return [
        {
          key: 'code',
          label: this.$t('Global.code'),
          sortable: true,
          thStyle: {width: '10%'},
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
        },
        // {
        //   key: 'email',
        //   label: this.$t('Global.email'),
        //   sortable: true,
        //   thStyle: {width: '10%'},
        // },
        // {
        //   key: 'mobile',
        //   label: this.$t('Global.mobile'),
        //   sortable: true,
        // },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      exportExcel: 'employees/export',
      exportTemplate: 'employees/exportMigrationTemplate',
    }),
    refresh(query) {
      query = {...query, type: this.type};
      this.$store.dispatch('employees/employees', {query: query})
    },
    remove(userId) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCloseButton: true,
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
          this.$store.dispatch('users/remove', userId).then(_ => {
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
        showCloseButton: true,
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

    Export(query) {
      const payload = {...query, language: this.$i18n.locale};
      this.exportExcel(payload);
      this.filter.export = 0;
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
              let url = process.env.VUE_APP_BASE_URL + "/employees/import_migrated_employees";
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
