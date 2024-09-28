<template>
  <div>
    <add
      v-if="hasPermission('edit_program') && params.status == 4"
      :inline="true"
      :params="params"
      @hide="hide()"
    />
    <edit
      v-else-if="params.status == 1 || params.status == 2"
      :inline="true"
      :params="params"
      @hide="hide()"
    />
    <DataTable
      v-else
      :title="title"
      :total="total"
      :allow-search="true"
      :filter="filter"
      @reset="reset"
      :loading="load['programs']"
      @Refresh="refresh"
      @Export="Export"
      :tabNum="tabNum"
      importBtn
      apiLink="programs"
      exportPermission="export_program"
    >
      <template #action>
            <b-button
              v-if="bylaw_id && hasPermission('add_program') && inline"
              v-b-tooltip.hover="$t('Global.add')"
              variant="primary"
              class="btn-icon"
              :to="{
                name: 'program_add',
                params: { bylaw_id: bylaw_id, faculty_id: faculty_id_course },
              }"
            >
              <!-- @click="params = { status: 1, faculty_id: faculty_id, bylaw_id: bylaw_id }" -->
              <feather-icon icon="PlusIcon" />
            </b-button>
            <b-button
              v-else-if="hasPermission('add_program')"
              v-b-tooltip.hover="$t('Global.add')"
              :to="{ name: 'program_add' }"
              variant="primary"
              class="btn-icon mr-1"
            >
              <feather-icon icon="PlusIcon" />
            </b-button>
        
       
      </template>
      <template v-if="lookups['programs'] && !noStatus" #filter>
        <b-col v-if="!faculty_id" cols="12" md="4">
          <v-select
            v-model="filter.faculty_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups['programs'] && lookups['programs'].faculties"
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
        <b-col cols="12" md="4">
          <v-select
            v-model="filter.bylaw_id"
            :filter="fuseSearch"
            :disabled="!filter.faculty_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="dependentLookups['bylaws']"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.bylaw')"
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
              {{ load['bylawslookup']  ? $t("Global.inProgress") : $t("noMatching") }}
            </template>
          </v-select>
        </b-col>

        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.stage_id"
            :options="lookups['programs'] && lookups['programs'].stages"
            class="w-100"
            clearable
            label="name"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.stage')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">
                {{ option.name_local || option.name }}
              </strong>
              <strong v-else>
                {{
                  option.name + " ( " + option.code + " )" || option.name_local
                }}
              </strong>
            </template>
            <template v-slot:option="option">
              {{
                $i18n.locale == "ar"
                  ? option.name_local
                  : option.name + " ( " + option.code + " )"
              }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4">
          <v-select
            v-model="filter.graduating_program_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups['programs'] && lookups['programs'].graduating_program"
            label="name"
            class="w-100"
            :class="faculty_id ? '' : 'mt-1'"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.graduating_program')"
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
          cols="12"
          md="4"
          v-if="
            hasPermission('restore_program') || hasPermission('delete_program')
          "
        >
          <v-select
            v-model="filter.removed"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="getStatusList(true)"
            class="w-100"
            :class="faculty_id ? '' : 'mt-1'"
            :reduce="(val) => val.value"
            :placeholder="$t('Global.status')"
          >
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
        <div
          class="bg-gray p-0 mb-1"
          style="padding-left: 0rem !important; padding-right: 0rem !important"
        >
          <div class="d-flex justify-content-between" v-if="innerTitle">
            <strong class="font-medium-3">
              {{ innerTitle }}
            </strong>
          </div>
        </div>
        <b-table
          @sort-changed="sortingChanged"
          no-local-sorting
          :items="items"
          responsive
          striped
          :fields="fields"
          primary-key="id"
          show-empty
          :empty-text="getLoadText(load['programs'])"
        >
          <template #cell(name)="data">
            <b-link
              v-if="$i18n.locale == 'en'"
              :to="{ name: 'program', params: { id: data.item.id } }"
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
              :to="{ name: 'program', params: { id: data.item.id } }"
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
          <template #cell(faculty)="data">
            <b-link
              v-if="$i18n.locale == 'en' && data.item.faculty"
              :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
              class="font-weight-bold"
            >
              {{ data.item ? data.item.faculty.name : "_" }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'ar' && data.item.faculty"
              :to="{ name: 'faculty', params: { id: data.item.faculty.id } }"
            >
              {{ data.item ? data.item.faculty.name_local : "_" }}
            </b-link>
          </template>
          <template #cell(bylaw)="data">
            <template v-if="faculty_id">
              <div v-if="data.item.bylaw">
                <b-link
                  v-if="$i18n.locale == 'en' && data.item.bylaw"
                  :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }"
                  class="font-weight-bold"
                >
                  {{ data.item ? data.item.bylaw.name : "_" }}
                </b-link>
                <b-link
                  v-if="$i18n.locale == 'ar' && data.item.bylaw"
                  :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }"
                >
                  {{ data.item ? data.item.bylaw.name_local : "_" }}
                </b-link>
              </div>
            </template>
            <template v-if="!faculty_id">
              <div v-if="data.item.bylaw">
                <b-link
                  v-if="$i18n.locale == 'en' && data.item.bylaw"
                  :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }"
                  class="font-weight-bold"
                >
                  {{ data.item ? data.item.bylaw.name : "_" }}
                </b-link>
                <b-link
                  v-if="$i18n.locale == 'ar' && data.item.bylaw"
                  :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }"
                >
                  {{ data.item ? data.item.bylaw.name_local : "_" }}
                </b-link>
              </div>
            </template>
          </template> 
          <template #cell(stage)="data">
            <div v-if="data.item.stage">
              <span v-if="$i18n.locale == 'en'">
                {{ data.item.stage.code }}
              </span>
              <span v-else>
                {{ data.item.stage.name_local }}
              </span>
            </div>
          </template>
          <template #cell(course_level)="data">
            <div class="edit_hover">
              <span v-if="data.item.level">
                <!--                            {{ $i18n.locale == 'ar' ? data.item.level.level.name_local : data.item.level.level.name }},-->
                <div>
                  {{ data.item.level.semester }}
                </div>
              </span>
            </div>
          </template>
          <template #cell(graduating_program)="data">
            {{ data.item.graduating_program == 0 ? $t("No") : $t("Yes") }}
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
            <div v-if="course_id && data.item.level">
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
                v-if="offering && hasPermission('admin_system')"
                v-b-tooltip.hover="$t('Global.statistics')"
                icon="EditIcon"
                style="cursor: pointer"
              />
              <feather-icon
                v-b-tooltip.hover="$t('Global.change_semester')"
                icon="EditIcon"
                style="cursor: pointer"
                @click="openDialog(data.item.level)"
                v-if="hasPermission('edit_course')"
              />
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger mr-1"
                @click="trash(data.item.level.id)"
                v-if="
                  hasPermission('delete_course') &&
                  data.item.level.mandatory == 0
                "
              />
              <div class="text-danger mr-2" v-else></div>
            </div>
            <div v-else>
              <b-link
                :to="{
                  name: 'program',
                  params: { id: data.item.id },
                  query: { inline: true },
                }"
              >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  style="cursor: pointer"
                  v-if="hasPermission('edit_program')"
                />
              </b-link>
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer; margin-top: 4.5px"
                class="text-danger"
                @click="remove(data.item.id)"
                v-if="
                  hasPermission('delete_program') &&
                  data.item.current_students_count == 0 &&
                  data.item.graduated_students_count == 0
                "
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>
    <b-modal
      no-close-on-backdrop
      ref="my-modal"
      v-model="levelModal"
      hide-footer
      :title="$t('Global.semester')"
    >
      <div :class="loading ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <validation-observer ref="simpleForm">
          <b-form>
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.semester')" label-for="semester">
                <validation-provider
                  #default="{ errors }"
                  name="semester"
                  :rules="'required'"
                >
                  <v-select
                    v-model="form.semester"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                    class="w-100 mb-2"
                    :reduce="(val) => val"
                  >
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-form>
        </validation-observer>
      </div>
      <div class="mt-2" :class="loading ? 'disabled_all' : ''">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submit()"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-primary"
              @click="levelModal = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>

    <Modal :hint="$t('Global.importMigrationData')" :link="'/programs/import'" :title="$t('Global.importMigrationData')" :show="importMigrationModal"></Modal>

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
    BAlert,
    BFormGroup,
    BFormFile
  } from 'bootstrap-vue';
import { mapActions, mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import Edit from '@/views/academic_settings/programs/edit';
import Add from '@/views/academic_settings/courses/add_courses';
import DataTable from '@/views/components/table/DataTable';
import {ValidationObserver, ValidationProvider} from "vee-validate";
import ValidationErrors from '@/views/components/common/ValidationErrors';
import {getToken} from "@/utils/auth";
import { required } from '@validations';
import Modal from "@/views/components/common/Modal.vue";
export default {
  name: "Programs",
  components: {
    Modal,
    DataTable,
    BCard,
    Add,
    vSelect,
    BRow,
    BCol,
    Edit,
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
    ValidationProvider,
    ValidationObserver,
    BFormGroup,
    ValidationErrors,
    BFormFile,
    BAlert
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    innerTitle: String,
    excel_name: null,
    bylaw_id: null,
    course_id: null,
    faculty_id: null,
    action_hide: Boolean,
    noStatus: Boolean,
    inline: false,
    faculty: Object,
    offering: Boolean,
    faculty_id_course: null,
    tabNum: null,
  },
  data() {
    return {
      form: {
        level_id: null,
        semester: null,
      },
      filter: {
        export: 0,
        removed: 0,
        faculty_id: this.faculty_id ? this.faculty_id : null,
        bylaw_id: null,
        stage: null,
        graduating_program_id: null,
      },
      params: {},
      levelModal: false,
      paramsLoaded: true,
    };
  },
  computed: {
    ...mapGetters({
      items: "programs/items",
      total: "programs/total",
      load: "app/generalLoad",
      loading: "app/load",
      lookups: "app/stateLookups",
      dependentLookups:"app/dependentLookups",
      needDrop: "app/needDrop",
    }),
    fields() {
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
          key: "faculty",
          label: this.$t("Global.faculty"),
          sortable: true,
        },
        {
          key: "bylaw",
          label: this.$t("Global.bylaw"),
          sortable: true,
        },
        {
          key: "stage",
          label: this.$t("Global.stage"),
          sortable: true,
        },
        {
          key: "courses_count",
          label: this.$t("Global.courses"),
          sortable: true,
        },
        // {
        //   key: 'students_count',
        //   label: this.$t('Global.students'),
        //   sortable: true,
        // },
        {
          key: "graduated_students_count",
          label: this.$t("Global.graduated_count"),
          sortable: true,
        },
        {
          key: "current_students_count",
          label: this.$t("Global.current_count"),
          sortable: true,
        },
        {
          key: "graduating_program",
          label: this.$t("Global.graduating_program"),
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
      if (this.noStatus) {
        fields = fields.filter((obj) => !["status"].includes(obj.key));
      }
      if (this.bylaw_id) {
        fields = fields.filter(
          (obj) => !["bylaw", "faculty", "level", "stage"].includes(obj.key)
        );
      }
      if (this.faculty_id) {
        fields = fields.filter(
          (obj) => !["faculty", "actions"].includes(obj.key)
        );
      }
      if (this.course_id) {
        return [
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
            key: "course_level",
            label: this.$t("Global.semester"),
            sortable: true,
          },
          {
            key: "stage",
            label: this.$t("Global.stage"),
            sortable: true,
          },
          {
            key: "courses_count",
            label: this.$t("Global.courses"),
            sortable: true,
          },
          {
            key: "students_count",
            label: this.$t("Global.students"),
            sortable: true,
          },
          {
            key: "status",
            label: this.$t("Global.status"),
          },
          {
            key: "actions",
            label: this.$t("Global.actions"),
            thClass: "customAction",
            tdClass: "customWidth",
          },
        ];
      }
      return fields;
    },
    list() {
      return [
        { label: this.$t("Global.UNDERGRADUATE"), value: 1 },
        { label: this.$t("Global.POSTGRADUATE"), value: 2 },
      ];
    },
    lang() {
      return this.$i18n.locale;
    },
  },
  methods: {
    ...mapActions({
      exportData: "programs/export",
      update: "programs/update",
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
    open(id) {
      window.open(
        this.$router.resolve({ name: "program_edit", params: { id } }).href
      );
    },
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: Number(this.faculty_id) };
      }
      this.$store.dispatch("programs/programs", { query });
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
          this.$store.dispatch("programs/remove", id).then((_) => {
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
    submit() {
      this.$refs.simpleForm.validate().then((success) => {
        if (success) {
          const payload = {
            id: this.id,
            query: this.form,
          };
          this.update(payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.levelModal = false;
              this.refresh();
            })
            .catch((error) => {});
        }
      });
    },
    trash(id) {
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
          this.$store.dispatch("programs/delete", id).then((_) => {
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
    openDialog(data) {
      this.form.level_id = data?.level?.id;
      this.id = data.id;
      this.form.semester = data?.semester;
      this.levelModal = true;
    },
    Export(query) {
      query = {
        ...query,
        language: this.$i18n.locale,
        excel_name: this.excel_name,
      };

      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.course_id) {
        query = { ...query, course_id: this.course_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: Number(this.faculty_id) };
      }

      this.exportData(query);
      this.filter.export = 0;
    },

  },
  watch: {
    // 'filter.faculty_id'() {
    //     this.filter.bylaw_id = 0;
    // }
    lang: function (val) {},
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
