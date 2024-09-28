<template>
  <div>
    <DataTable
        :total="total"
        :allowSearch="true"
        :filter="filter"
        :loading="load"
        @Refresh="refresh"
        @reset="reset"
        @Export="exportMigrationTemplate"
    >
      <template #action>
        <b-button
            class="btn-icon"
            v-b-tooltip.hover="$t('Global.add')"
            variant="primary"
            @click="newBuilding()"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
        <b-button v-b-tooltip.hover="$t('Global.export_excel')"
                  v-if="hasPermission('access_building')" class="btn-icon ml-1"
                  variant="primary" @click="filter.export = 1">
          <feather-icon icon="FileTextIcon"/>
        </b-button>
        <b-button v-b-tooltip.hover="$t('Global.importMigrationData')"
                  :class="'ml-1'"
                  class="btn-icon" variant="primary" @click="toggleMigrationModal"
                  v-if="hasPermission('import_migrationData') || hasPermission('import_halls_migrationData')">
          <feather-icon icon="UploadCloudIcon"/>
        </b-button>
      </template>
      <template #filter></template>
      <template #customTable>
        <b-table
            @sort-changed="sortingChanged"
            no-local-sorting
            class="position-relative"
            :items="items"
            responsive
            :fields="fields"
            primary-key="id"
            show-empty
            :empty-text="getLoadText(load)"
        >
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template #cell(actions)="data">
            <div>
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
              <feather-icon
                  v-if="hasPermission('edit_building')"
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  class="text-primary"
                  style="cursor: pointer"
                  @click="editBuilding(data.item.id)"
              />
              <feather-icon
                  v-b-tooltip.hover="$t('Global.delete')"
                  v-if="hasPermission('delete_building')"
                  icon="Trash2Icon"
                  style="cursor: pointer"
                  class="text-danger"
                  @click="remove(data.item.id)"
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>
    <b-modal no-close-on-backdrop ref="my-modal" v-model="importMigrationModal" hide-footer
             :title="$t('Global.importMigrationData')">
      <div :class="load ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <b-col md="12">
          <validation-observer ref="importForm">
            <b-form-group class="left_right" :label="$t('Global.upload_files')">
              <validation-provider #default="{ errors }" :rules="'required'">
                <b-form-file multiple accept=".xlsx" v-model="migrationFiles" :placeholder="$t('Global.upload_files')"
                             :drop-placeholder="$t('Global.upload_files')"/>
                <ValidationErrors :default-message="true" :frontend-errors="errors"/>
              </validation-provider>
            </b-form-group>
            <p class="text-dark font-small-3">
              <b class="text-danger">* {{ $t('Global.Hints') }}</b>: {{ $t('Global.hallsImportMessage') }}
            </p>
          </validation-observer>
        </b-col>
      </div>
      <div class="mt-2" :class="load ? 'disabled_all' : ''">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" class="mr-1" @click="uploadMigrationData">
              {{ $t('Global.save') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="importMigrationModal = false">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>

    <b-modal
        ref="my-modal"
        size="lg"
        v-model="statusModal"
        hide-footer
        :title="$t('Global.import_progress')"
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
    >
      <div class="demo-vertical-spacing">
        <b-form>
          <b-col
              cols="12"
              md="12"
              class="height-250 overflow-y-scroll"
              v-if="status_messages.length"
          >
            <div
                class="bg-gray"
                v-for="(status_message, index) in status_messages"
                :key="index" v-if="typeof status_message.class !== undefined"
            >
              <b-alert :variant="status_message.class" show>
                <div class="alert-body">
                  <span>
                    {{ (index + 1) + "- " + status_message.message }}
                  </span>
                </div>
              </b-alert>
            </div>
          </b-col>
        </b-form>
      </div>
      <div class="mt-2" v-if="showCloseButton">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
                type="reset"
                variant="outline-primary"
                @click="statusModal = false"
            >
              {{ $t("Global.close") }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import {
  BCol,
  BTable,
  BPagination,
  BSpinner,
  BFormFile,
  BForm,
  BFormGroup,
  BAlert,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import {mapActions, mapGetters} from "vuex";
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import {getToken} from "@/auth/utils";
import { required } from '@validations'

export default {
  name: "buildings",
  components: {
    BPagination,
    DataTable,
    BTable,
    BSpinner,
    BCol,
    BFormFile,
    BForm,
    BFormGroup,
    BAlert,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
  },
  data() {
    return {
      filter: {export: 0, removed: 0},
      paramsLoaded: true,
      importMigrationModal: false,
      migrationFiles: [],
      statusModal: false,
      status_messages: [],
      showCloseButton: false,
    };
  },
  computed: {
    ...mapGetters({
      items: "buildings/items",
      total: "buildings/total",
      load: "buildings/load",
      lookups: "buildings/lookups",
      needDrop:'app/needDrop',
    }),
    fields: function () {
      return [
        {
          key: "name",
          sortable: true,
          label: this.$t("name"),
          // thStyle: { width: "15%" },
        },
        {
          key: "locations",
          sortable: true,
          label: this.$t("Locations Number"),
          // thStyle: { width: "15%" },
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
  },

  methods: {
    ...mapActions({
      exportTemplate: 'buildings/exportMigrationTemplate',
    }),
    refresh(query) {
      this.$store.dispatch("buildings/buildings", {query: query}).then((data) => {
        this.paramsLoaded = false;
      });
    },
    reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
    newBuilding() {
      this.$router.push({
        name: "add_building",
      });
    },
    editBuilding(id) {
      this.$router.push({
        name: "edit_building",
        params: {
          id: id,
        },
      });
    },
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch("buildings/remove", id).then((_) => {
            this.refresh();
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
          });
        }
      });
    },
    toggleMigrationModal() {
      this.importMigrationModal = !this.importMigrationModal;
    },
    exportMigrationTemplate(query) {
      let payload = {};
      payload.search_text = query.keywords;
      this.$store.dispatch('buildings/exportMigrationTemplate', payload).then(_ => {
        this.filter.export = 0;
      });
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
              let url = process.env.VUE_APP_BASE_URL + "/buildings/import_migrated_halls";
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
