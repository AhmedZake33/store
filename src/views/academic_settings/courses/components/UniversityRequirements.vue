<template>
<div>
  <DataTable
    :tabNum="tabNum"
    :basicTable="true"
    :browse="true"
    :total="total"
    apiLink="courses"
    :allow-search="false"
    :filter="filter"
    :loading="load['courses']"
    @reset="reset"
    @Refresh="refresh"
  >
    <!-- exportPermission="export_course" -->
    
    <template #customTable>
      <div
        class="bg-gray p-0 mb-1"
        style="padding-left: 0rem !important; padding-right: 0rem !important"
      >
        <div class="d-flex justify-content-between" v-if="title">
          <strong class="font-medium-3">
            {{ title }}
          </strong>

        </div>
      </div>
      <b-table
        @sort-changed="sortingChanged"
        no-local-sorting
        :items="items"
        responsive
        striped
        :fields="fieldsData"
        primary-key="id"
        show-empty
        :empty-text="getLoadText(load['courses'])"
      >
        <template #cell(name)="data">
            {{
              $i18n.locale == 'ar'
                ? data.item.name_local
                : data.item.name
            }}
        </template>
        <template #cell(actions)="data">
          <div class="d-flex text-center">
            <feather-icon
              @click="openEditModal(data.item)"
              v-b-tooltip.hover="$t('Global.edit')"
              icon="EditIcon"
              style="cursor: pointer"
              v-if="hasPermission('edit_course')"
            />
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>

  <b-modal
    no-close-on-backdrop
    hide-footer
    ref="my-modal"
    v-model="editModal"
    :title="$t('Global.semester')"
    @hide="resetEditModal()"
  >
    <div :class="loading ? 'disabled_all' : ''" class="demo-vertical-spacing">
      <validation-observer ref="simpleForm">
        <b-form>
          <b-col cols="12" md="12">
            <b-form-group :label="$t('Global.course')" label-for="mc-course">
              <validation-provider
                #default="{ errors }"
                name="course_id"
                rules="required"
              >
                <b-form-input
                  id="name"
                  v-model=" $i18n.locale == 'ar' ? name_local : name"
                  disabled
                  :state="errors.length > 0 ? false : null"
                />
                <!-- <v-select
                  :class="errors.length > 0 ? 'custom_invalid' : ''"
                  v-model="course_id"
                  :filter="fuseSearch"
                  :options="options.courses"
                  :reduce="(val) => val.id"
                  disabled
                  class="w-100"
                >
                  <template #no-options>
                    {{ $t("noMatching") }}
                  </template>
                  <template v-slot:option="option">
                    {{
                      $i18n.locale == "ar"
                        ? option.code + ":" + option.name_local
                        : option.code + ":" + option.name
                    }}
                  </template>
                  <template #selected-option="{ name, name_local, code }">
                    <div style="display: flex; align-items: baseline">
                      <div v-if="$i18n.locale == 'ar'">{{
                        code + ":" + name_local || code + ":" + name
                      }}</div>
                      <div v-else>{{
                        code + ":" + name || code + ":" + name_local
                      }}</div>
                    </div>
                  </template>
                </v-select> -->
                <small v-if="errors.length" class="text-danger">{{
                  validation(null, 0).message
                }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="12">
            <b-form-group :label="$t('Global.semester')" label-for="semester">
              <validation-provider
                #default="{ errors }"
                name="semester"
                :rules="'required'"
              >
                <v-select
                  v-model="semester"
                  :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                  :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
                  class="w-100 mb-2"
                  :reduce="(val) => val"
                  >\
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
    <div class="mt-3 mb-1" :class="loading ? 'disabled_all' : ''">
      <b-col cols="12" md="12">
        <div class="d-flex justify-content-end">
          <b-button
            type="submit"
            variant="primary"
            class="mr-1"
            @click="editCourseSemester()"
          >
            {{ $t("Global.save") }}
          </b-button>
          <b-button
            type="reset"
            variant="outline-primary"
            @click="resetEditModal()"
          >
            {{ $t("Global.cancel") }}
          </b-button>
        </div>
      </b-col>
    </div>
  </b-modal>
</div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BFormFile,
  BForm,
  BAlert,
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
  BTr,
  BTh,
} from "bootstrap-vue";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import TableFilters from "@/views/components/common/TableFilters";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { required, email } from "@validations";
import { EventBus } from "../../../../main";
import { getToken } from "@/utils/auth";

export default {
  name: "UniversityRequirements",
  components: {
    TableFilters,
    DataTable,
    BCard,
    vSelect,
    BTr,
    BTh,
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
    BAlert,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    BFormGroup,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    excel_name: null,
    hide_courses: [],
    bylaw_id: Number,
    program_id: Number,
    faculty_id: Number,
    department_id: Number,
    faculty_dep_id: Number,
    faculty_id_course: Number,
    noStatus: Boolean,
    inline: false,
    tabNum: Number,
    plus: Boolean,
    course_type: Number,
    course_stage: Number,
    fromCoursesPage: false,
  },
  data() {
    return {
      editModal: false,
      id: null,
      type: null,
      course_id: null,
      semester: null,
      name: null,
      name_local: null,
      filter:{},
    };
  },

  computed: {
    ...mapGetters({
      items: "courses/universityRequirements",
      total: "courses/totalUniversityRequirements",
      load: "app/generalLoad",
      loading: "app/load",
      lookups: "app/stateLookups",
      dependentLookups: "app/dependentLookups",
      options: "students/lookups",
      needDrop: "app/needDrop",
    }),

    fieldsData() {
      return [
          {
            key: "code",
            label: this.$t("Global.code"),
            sortable: false,
          },
          {
            key: "name",
            label: this.$t("Global.name"),
            sortable: false,
          },
          {
            key: "semester",
            label: this.$t("Global.term"),
            sortable: false,
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
      exportTemplate: "courses/exportMigrationTemplate",
      lookupsApi: "students/lookup",
      saveData: "programs/sync",
      // update: "programs/updateRequirements",
      coursesLookups: 'students/lookup',
    }),
    refresh(query) {
      if (this.bylaw_id) {
        query = { ...query, bylaw_id: this.bylaw_id };
      }
      if (this.program_id) {
        query = { ...query, program_id: this.program_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      if (this.department_id) {
        query = { ...query, department_id: this.depfrtment_id };
      }
      this.$store.dispatch("courses/universityRequirements", { id: this.program_id, query: query })
    },
    reset() {
      this.filter = {}
    },
    openEditModal(item) {
      let query = { courses: true, levels: true, bylaw_id: item.bylaw.id };
      this.coursesLookups(query).then(_=>{
        this.type = item.type
        this.course_id = item.id
        this.name = item.name
        this.name_local = item.name_local
        this.semester = item.semester
        this.id = item.type == "program_course" ? item.program_course_id : item.pool_course_id
      }).finally(_=>{
        this.editModal = true;
      });
    },
    editCourseSemester(){
      this.$refs.simpleForm.validate().then((success) => {
        if (success) {
          const payload = {
            program_id: this.program_id,
            type: this.type,
            id: this.id,
            query: {course_id: this.course_id , semester: this.semester},
          };
          this.$store.dispatch("programs/updateRequirements", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.resetEditModal();
              this.refresh();
            })
            .catch((error) => {});
        }
      });
    },
    resetEditModal(){
      this.course_id = null;
      this.semester = null;
      this.type = null;
      this.id = null;
      this.editModal = false;
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
      if (this.program_id) {
        query = { ...query, program_id: this.program_id };
      }
      if (this.faculty_id) {
        query = { ...query, faculty_id: this.faculty_id };
      }
      if (this.department_id) {
        query = { ...query, department_id: this.department_id };
      }

      this.$store.dispatch("courses/exportUniversityRequirements", query).then((_) => {
        this.filter.export = 0;
      });
    },
  }
}
</script>

<style scoped>

</style>
