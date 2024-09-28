<template>
  <div>
  <DataTable
    apiLink="faculties"
    :total="total"
    :allow-search="true"
    :filter="filter"
    @reset="reset"
    :loading="load['faculties']"
    @Refresh="refresh"
    @Export="Export"
    exportPermission="export_faculty"
    importBtn
  >
    <template #filter>
      <b-col
        cols="12"
        md="4"
        v-if="
          hasPermission('restore_faculty') || hasPermission('delete_faculty')
        "
      >
        <v-select
          v-model="filter.removed"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="getStatusList(true)"
          class="w-100 mt-1"
          :reduce="(val) => val.value"
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
    <template #action>
      <b-button
        v-b-tooltip.hover="$t('Global.add')"
        :to="{ name: 'faculty_add' }"
        class="btn-icon mr-1" 
        variant="primary"
        v-if="hasPermission('add_faculty')"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>
   
      <b-button v-b-tooltip.hover="$t('Global.importMigrationData')"
                  :class="'mx-1'"
                  class="btn-icon" variant="primary" @click="toggleMigrationModal"
                  v-if="hasPermission('import_migrationData')">
          <feather-icon icon="UploadCloudIcon"/>
        </b-button>
    </template>
    <template #customTable>
      <b-table
        @sort-changed="sortingChanged"
        no-local-sorting
        :items="items"
        :fields="fields"
        responsive
        striped
        primary-key="id"
        show-empty
        :empty-text="load['faculties'] ? $t('Global.inProgress')  :$t('Global.empty_text')"
      >
        <template #cell(name)="data">
          <b-link
            v-if="$i18n.locale == 'en'"
            :to="{ name: 'faculty', params: { id: data.item.id } }"
            class="font-weight-bold"
          >
            {{
              data.item
                ? data.item.name
                  ? data.item.name
                  : data.item.name_local
                : "_"
            }}
          </b-link>
          <b-link
            v-if="$i18n.locale == 'ar'"
            :to="{ name: 'faculty', params: { id: data.item.id } }"
          >
            {{
              data.item
                ? data.item.name_local
                  ? data.item.name_local
                  : data.item.name
                : "_"
            }}
          </b-link>
        </template>
        <template #cell(type)="data">
          <span
            v-if="$i18n.locale == 'en'"
            class="font-weight-bold"
          >
            {{
              data.item
                ? data.item.name
                  ? data.item.type.name
                  : data.item.type.name_local
                : "_"
            }}
          </span>
          <span
            v-if="$i18n.locale == 'ar'"
          >
            {{
              data.item
                ? data.item.type.name_local
                  ? data.item.type.name_local
                  : data.item.type.name
                : "_"
            }}
          </span>
        </template>
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${getStatus(data.item.removed).color}`"
            class="text-capitalize"
          >
            {{ getStatus(data.item.removed).name }}
          </b-badge>
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
            <b-link
              :to="{
                name: 'faculty',
                params: { id: data.item.id },
                query: { inline: true },
              }"
            >
              <feather-icon
                v-if="hasPermission('edit_faculty')"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer"
              />
            </b-link>
            <feather-icon
              v-b-tooltip.hover="$t('Global.delete')"
              v-if="hasPermission('delete_faculty')"
              icon="Trash2Icon"
              style="cursor: pointer; margin-top: 4.5px"
              class="text-danger"
              @click="remove(data.item.id)"
            />
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>

  <Modal :hint="$t('Global.departmentsImportMessage')" :link="'/faculties/import'" :title="$t('Global.importMigrationData')" :show="importMigrationModal"></Modal>


  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BFormGroup,
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
  BAlert,
  BForm
} from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import Modal from "@/views/components/common/Modal.vue";
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import {getToken} from "@/utils/auth";
import { required } from '@validations';

export default {
  name: "Faculties",
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
    BFormGroup,
    BFormFile,
    BForm,
    BAlert,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  data() {
    return {
      nameState: null,
      nameLocalState: null,
      codeState: null,
      filter: { export: 0, removed: 0},
      name: null,
      name_local: null,
      code: null,
      changed: true,
      message: null,
      migrationFiles: [],
      statusModal: false,
      status_messages: [],
      showCloseButton: false,
    };
  },
  computed: {
    ...mapGetters({
      items: "faculties/items",
      total: "faculties/total",
      load: "app/generalLoad",
      lookups: "faculties/lookups",
      needDrop:'app/needDrop',
    }),
    fields() {
      return [
        { key: "code", sortable: true, label: this.$t("Global.code"),thStyle: { width: "9%" }, },
        { key: "name", label: this.$t("Global.name"), sortable: true },
        {
          key: "departments_count",
          label: this.$t("Global.departments"),
          sortable: true,
          thStyle: { width: "10%" },
        },
        {
          key: "bylaws_count",
          label: this.$t("Global.bylaws"),
          sortable: true,
          thStyle: { width: "10%" },
        },
        // {
        //   key: "active_courses_count",
        //   label: this.$t("Global.courses"),
        //   sortable: true,
        //   thStyle: { width: "10%" },
        // },
        {
          key: "programs_count",
          label: this.$t("Global.programs"),
          sortable: true,
          thStyle: { width: "10%" },
        },
        {
          key: "instructors_count",
          label: this.$t("Global.staff"),
          thStyle: { width: "10%" },
          sortable: true,
        },
        {
          key: "type",
          label: this.$t("Global.type"),
          thStyle: { width: "10%" },
        },
        // {
        //   key: "students_count",
        //   label: this.$t("Global.students"),
        //   sortable: true,
        //   thStyle: { width: "10%" },
        // },
        // {
        //   key: "graduated_students_count",
        //   label: this.$t("Global.graduated_count"),
        //   sortable: true,
        //   thStyle: { width: "10%" },
        // },
        // {
        //   key: "current_students_count",
        //   label: this.$t("Global.current_count"),
        //   sortable: true,
        //   thStyle: { width: "10%" },
        // },
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
      exportExcel: "faculties/export",
    }),
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
    changeStatus() {
      this.changed = false;
    },
    refresh(query) {
      this.$store.dispatch("faculties/faculties", { query })
    },
    resetModal() {
      this.nameState = null;
      this.nameLocalState = null;
      this.codeState = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      this.add();
      this.$nextTick(() => {
        this.$refs["my-modal"].toggle("#toggle-btn");
      });
    },
    add() {
      if (this.name !== "" && this.name_local !== "" && this.code !== "") {
        this.$store
          .dispatch("faculties/put", {
            name: this.name,
            name_local: this.name_local,
            code: this.code,
          })
          .then((response) => {
            this.$swal({
              icon: "success",
              title: this.$t("Global.saved"),
              showConfirmButton: false,
              timer: 1500,
            });
            this.name = null;
          });
      }
    },
    open(id) {
      window.open(
        this.$router.resolve({ name: "faculty_edit", params: { id } }).href,
        "_blank"
      );
    },
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
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
          this.$store.dispatch("faculties/remove", id).then((_) => {
            this.refresh(this.filter);
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
    Export(query) {
      // let payload = {query: {...query, language: this.$i18n.locale}};
      query = { ...query, language: this.$i18n.locale };
      this.exportExcel(query);
      this.filter.export = 0;
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
@import "@core/scss/vue/libs/vue-select.scss";
</style>
