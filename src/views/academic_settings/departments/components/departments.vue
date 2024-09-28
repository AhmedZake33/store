<template>
  <div>
    <Edit
      :inline="true"
      v-if="params.status == 1 || params.status == 2"
      :params="params"
      @hide="hide()"
    ></Edit>
    <DataTable
      v-else
      :tabNum="tabNum"
      :title="title"
      :total="total"
      apiLink="departments"
      :allowSearch="true"
      :filter="filter"
      :loading="load['departments']"
      @Refresh="refresh"
      @reset="reset"
      @Export="Export"
      importBtn
      exportPermission="export_department"
    >
      <template #action>
        <b-button
          v-if="faculty_id && hasPermission('add_department') && inline"
          :to="{ name: 'department_add', params: { faculty_id: faculty_id } }"
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
          class="btn-icon"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
        <b-button
          v-else-if="hasPermission('add_department')"
          v-b-tooltip.hover="$t('Global.add')"
          :to="{ name: 'department_add' }"
          variant="primary"
          class="btn-icon mr-1"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>
      <template v-if="lookups['departments'] && !inside" #filter>
        <b-col cols="6" md="4">
          <v-select
            :filter="fuseSearch"
            v-model="filter.faculty_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups['departments'] && lookups['departments'].faculties"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.faculty')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{ option.name || option.name_local }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col
          cols="6"
          md="4"
          v-if="
            hasPermission('restore_department') ||
            hasPermission('delete_department')
          "
        >
          <v-select
            v-model="filter.removed"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="getStatusList(true)"
            class="w-100"
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
      <template #customTable>
        <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
          :items="items"
          responsive
          striped
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="getLoadText(load['departments'])"
        >
          <template #cell(name)="data">
            <b-link
              v-if="$i18n.locale == 'en'"
              :to="{ name: 'department', params: { id: data.item.id } }"
              class="font-weight-bold"
            >
              {{ data.item ? data.item.name : "_" }}
            </b-link>
            <b-link
              :to="{ name: 'department', params: { id: data.item.id } }"
              v-if="$i18n.locale == 'ar'"
            >
              {{ data.item ? data.item.name_local : "_" }}
            </b-link>
          </template>
          <template #cell(department_id)="data">
            <span class="font-weight-bold">
              {{ data.item ? data.item.staff_count : "_" }}
            </span>
          </template>
          <template #cell(faculty_id)="data">
            <div v-if="data.item.faculty">
              <b-link
                v-if="$i18n.locale == 'en'"
                :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
                class="font-weight-bold d-block"
              >
                {{ data.item.faculty ? data.item.faculty.name : "_" }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'ar'"
                :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
                class="font-weight-bold d-block"
              >
                {{ data.item.faculty ? data.item.faculty.name_local : "_" }}
              </b-link>
            </div>
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
              <!--                        <feather-icon v-if="faculty_id && inline" v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon"-->
              <!--                                      style="cursor: pointer" @click="params = {status:2, faculty_id:faculty_id , id:data.item.id}"/>-->
              <b-link
                :to="{
                  name: 'department',
                  params: { id: data.item.id },
                  query: { inline: true },
                }"
              >
                <feather-icon
                  v-if="
                    hasPermission('edit_department') && data.item.removed == 0
                  "
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  style="cursor: pointer"
                />
              </b-link>
              <feather-icon
                v-if="
                  hasPermission('delete_department') && data.item.removed == 0
                "
                v-b-tooltip.hover="$t('Global.delete')"
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
    <Modal
      :hint="$t('Global.departmentsImportMessage')"
      :link="'/departments/import_migrated_departments'"
      :title="$t('Global.importMigrationData')"
      :show="importMigrationModal"
    ></Modal>
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
  BPopover,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable.vue";
import Edit from "@/views/academic_settings/departments/edit";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { getToken } from "@/utils/auth";
import { required } from "@validations";
import Modal from "@/views/components/common/Modal.vue";

export default {
  name: "Departments",
  components: {
    Modal,
    Edit,
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
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    excel_name: null,
    faculty_id: null,
    noStatus: Boolean,
    inside: Boolean,
    inline: false,
    tabNum: null,
  },
  data() {
    return {
      filter: {
        removed: 0,
        export: 0,
        faculty_id: null,
      },
      // filter: {export: 0},
      params: {},

      // sort:{}
    };
  },
  computed: {
    ...mapGetters({
      items: "departments/items",
      total: "departments/total",
      load: "app/generalLoad",
      lookups: "app/stateLookups",
      dependentLookups:"app/dependentLookups",
      needDrop: "app/needDrop",
    }),
    fieldsData() {
      let fields = [
        {
          key: "code",
          label: this.$t("Global.code"),
          sortable: true,
        },
        {
          key: "name",
          label: this.$t("Global.name"),
          sortable: true,
        },
        {
          key: "faculty_id",
          label: this.$t("Global.faculty"),
          sortable: true,
        },
        {
          key: "instructors_count",
          label: this.$t("Global.staff_count"),
          sortable: true,
        },
        {
          key: "courses_count",
          label: this.$t("Global.courses_count"),
          sortable: true,
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
      if (this.noStatus) {
        fields = fields.filter(function (obj) {
          return !["status"].includes(obj.key);
        });
      }
      if (this.faculty_id) {
        fields = fields.filter(function (obj) {
          return !["faculty"].includes(obj.key);
        });
      }

      return fields;
    },
  },
  methods: {
    ...mapActions({
      exportExcel: "departments/export",
      getLookups: "app/lookupsAction",
      exportTemplate: "departments/exportMigrationTemplate",
    }),
    hide(){
      this.params['status'] = 3
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
    saveBread(index) {
      this.updateFilterQueryParams({ bread: index });
    },
    refresh(query) {
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      query = { ...query, department_id: this.faculty_id };
      this.$store.dispatch("departments/departments", { query: query });
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
          this.$store.dispatch("departments/remove", id).then((_) => {
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
    open(id) {
      window.open(
        this.$router.resolve({ name: "department_edit", params: { id: id } })
          .href,
        "_blank"
      );
    },

    Export(query) {
      // let payload = {query: {...query, language: this.$i18n.locale}};
      query = {
        ...query,
        language: this.$i18n.locale,
        excel_name: this.excel_name,
      };
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      this.exportExcel(query);
      this.filter.export = 0;
    },

    exportMigrationTemplate() {
      this.exportTemplate();
    },
  },
  watch: {
    "$route.query.tabNum"() {
      this.params.status = 3;
    },
  },
  beforeMount(){
    this.getLookups({link:"departments",query:{lookups:'yes'}})
  }
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
