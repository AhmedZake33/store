<template>
    <div>
      <DataTable
          :total="total"
          :allowSearch="false"
          :filter="filter"
          :loading="load"
          @Refresh="refresh"
          @reset="reset"
      >
        <template #action>
          <b-button
              v-if="hasPermission('add_currency_bank')"
              class="btn-icon"
              v-b-tooltip.hover="$t('Global.add')"
              variant="primary"
              @click="newCurrency()"
          >
            <feather-icon icon="PlusIcon"/>
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
              :fields="fieldsCurrency"
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
                    v-if="hasPermission('edit_currency_bank')"
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    class="text-primary"
                    style="cursor: pointer"
                    @click="editCurrency(data.item.id)"
                />
                <feather-icon
                    v-b-tooltip.hover="$t('Global.delete')"
                    v-if="hasPermission('delete_currency_bank')"
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
    name: "index",
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
        migrationFiles: [],
        statusModal: false,
        status_messages: [],
        showCloseButton: false,
      };
    },
    computed: {
      ...mapGetters({
        items: "currencies/items",
        total: "currencies/total",
        load: "currencies/load",
        lookups: "currencies/lookups",
        needDrop:'app/needDrop',
      }),
      fieldsCurrency: function () {
        return [
          {
            key: "name",
            sortable: true,
            label: this.$t("name"),
            // thStyle: { width: "15%" },
          },
          {
            key: "name_local",
            sortable: true,
            label: this.$t("Global.name_local"),
            // thStyle: { width: "15%" },
          },
          {
            key: "code",
            sortable: true,
            label: this.$t("Global.code"),
            // thStyle: { width: "15%" },
          },
          // {
          //   key: "actions",
          //   label: this.$t("Global.actions"),
          //   thClass: "customAction",
          //   tdClass: "customWidth",
          // },
        ];
      },
    },
  
    methods: {
      ...mapActions({
        exportTemplate: 'buildings/exportMigrationTemplate',
      }),
      refresh(query) {
        this.$store.dispatch("currencies/currencies", {query: query}).then((data) => {
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
      newCurrency() {
        this.$router.push({
          name: "add_currency",
        });
      },
      editCurrency(id) {
        this.$router.push({
          name: "edit_currency",
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
            this.$store.dispatch("currencies/remove", id).then((_) => {
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
  