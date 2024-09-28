<template>
  <div>
    <DataTable
      :title="title"
      :total="total"
      :allowSearch="true"
      :filter="filter"
      :loading="load"
      @Refresh="refresh"
      @reset="reset"
    >
      <template #action>
        <b-button
          v-if="hasPermission('add_training') && id != null"
          @click="showAddStudentToTrainingModal()"
          class="btn-icon"
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>
      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative"
          :items="items"
          responsive
          :fields="fields"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <!-- Student Name -->
          <template #cell(student_code)="data">
            <b-link
              :to="{
                name: 'student-show',
                params: { id: data.item.student_id },
              }"
              class="font-weight-bold d-block text-nowrap"
              target="_blank"
            >
              {{ data.item ? data.item.student_code : "_" }}
            </b-link>
          </template>
          <!-- Student Name -->
          <template #cell(student_name)="data">
            <b-link
              :to="{
                name: 'student-show',
                params: { id: data.item.student_id },
              }"
              class="font-weight-bold d-block text-nowrap"
              target="_blank"
            >
              {{ data.item ? data.item.student_name : "_" }}
            </b-link>
          </template>
          <!-- Training title -->
          <template #cell(training_title)="data">
            <b-link
              :to="{
                name: 'show_training',
                params: { id: data.item.training_id },
              }"
              class="font-weight-bold d-block text-nowrap"
              target="_blank"
            >
              {{ data.item ? data.item.training_title : "_" }}
            </b-link>
          </template>
          <!-- status -->
          <template #cell(status)="data">
            <b-badge
              pill
              v-if="data.item.status && lookups"
              :variant="`${
                getStatusObject(lookups.statuses, data.item.status).color_class
              }`"
              class="text-capitalize"
            >
              {{
                $i18n.locale == "ar"
                  ? getStatusObject(lookups.statuses, data.item.status)
                      .name_local
                  : getStatusObject(lookups.statuses, data.item.status).name
              }}
            </b-badge>
          </template>
          <!-- Details -->
          <template #cell(decision_by)="data">
            <!-- payment status -->
            <div class="d-flex flex-wrap">
              <strong style="padding: 1px"
                >{{ $t("Payment Status") }}: &nbsp;
              </strong>
              <b-badge
                pill
                v-if="data.item.payment_status_id && lookups"
                :variant="`${
                  getStatusObject(
                    lookups.payment_statuses,
                    data.item.payment_status_id
                  ).color_class
                }`"
                class="text-capitalize"
              >
                {{
                  $i18n.locale == "ar"
                    ? getStatusObject(
                        lookups.payment_statuses,
                        data.item.payment_status_id
                      ).name_local
                    : getStatusObject(
                        lookups.payment_statuses,
                        data.item.payment_status_id
                      ).name
                }}
              </b-badge>
              <b-badge v-else pill :variant="'danger'" class="text-capitalize">
                {{ $t("None") }}</b-badge
              >
            </div>
            <!-- number of weeks -->
            <div class="d-flex flex-wrap">
              <strong style="padding: 1px"
                >{{ $t("number of weeks") }}: &nbsp;
              </strong>
              {{ data.item.approved_weeks }}
            </div>
            <!-- Staff Name -->
            <div class="d-flex flex-wrap">
              <strong style="padding: 1px"
                >{{ $t("Decision By") }}: &nbsp;
              </strong>
              <b-link
                :to="{
                  name: 'user-show',
                  params: { id: data.item.decision_by },
                }"
                class="font-weight-bold d-block text-nowrap"
                target="_blank"
              >
                {{ data.item ? data.item.decision_by_name : "_" }}
              </b-link>
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
              <b-link
                :to="{
                  name: 'show_student_training',
                  params: {
                    training_student_id: data.item.id,
                  },
                }"
              >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  class="text-primary"
                />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <!-- Add student to the training -->
    <b-modal
      id="add_student_to_training_modal"
      ref="add_student_to_training_modal"
      no-close-on-backdrop
      size="lg"
      centered
      :title="$t('Add Student to the Training')"
    >
      <validation-observer ref="addAddStudentToTrainingRules">
        <form ref="aadd_student_to_training_form">
          <!-- Student -->
          <div class="row">
            <div class="col" v-if="lookups">
              <b-form-group class="left_right" :label="$t('Global.student')">
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    v-model="form.student_id"
                    name="student_id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="students"
                    :label="getSelectLabel()"
                    class="w-100"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.student')"
                    :filter="fuseSearch"
                    @keypress.native="customAutocompleteStds($event)"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.code + " " + option.name_local
                          : option.code + " " + option.name
                      }}
                    </template>
                    <template #selected-option="{ code, name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        {{ code }}
                        {{ $i18n.locale == "ar" ? name_local : name }}
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("Search in students") }}
                    </template>
                  </v-select>
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'student_id')
                    "
                  />
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <!-- Status -->
          <div class="row">
            <div class="col" v-if="lookups">
              <b-form-group class="left_right" :label="$t('Global.status')">
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    name="status"
                    v-model="form.status"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups.statuses"
                    :label="getSelectLabel()"
                    class="w-100"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.status')"
                    :filter="fuseSearch"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar" ? option.name_local : option.name
                      }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'"
                          >{{ name_local }}
                        </strong>
                        <strong v-else>{{ name }} </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>

                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'status')"
                  />
                </validation-provider>
              </b-form-group>
            </div>
          </div>
        </form>
      </validation-observer>
      <template #modal-footer>
        <b-row>
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              @click="submitStudentToTraining()"
              :class="load ? 'disabled_all mr-1' : 'mr-1'"
            >
              <span v-if="!load"> {{ $t("Global.save") }}</span>
              <b-spinner
                v-if="load"
                small
                :label="$t('Global.loading')"
              ></b-spinner>
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="$refs.add_student_to_training_modal.hide()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
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
  BFormGroup,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required } from "@validations";

export default {
  name: "students",
  components: {
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
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
  },
  data() {
    return {
      form: {
        status: null,
        student_id: null,
        training_id: null,
      },
      items: [],
      lookups: null,
      total: 0,
      filter: {},
      students: [],
    };
  },
  computed: {
    ...mapGetters({
      load: "trainings/load",
      needDrop:'app/needDrop',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    fields: function () {
      return [
        {
          key: "student_code",
          label: this.$t("Global.code"),
          sortable: true,
        },
        {
          key: "student_name",
          label: this.$t("Global.name"),
          sortable: true,
        },
        {
          key: "training_title",
          label: this.$t("Training"),
          sortable: true,
        },
        {
          key: "status",
          label: this.$t("Global.status"),
          sortable: true,
        },
        {
          key: "decision_by",
          label: this.$t("Global.details"),
          sortable: true,
        },
        {
          key: "actions",
          label: this.$t("Global.action"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
  },
  methods: {
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
    getStatusObject(statuses, status_id) {
      let status = null;
      statuses.forEach((element) => {
        element.id == status_id ? (status = element) : null;
      });
      return status;
    },
    showAddStudentToTrainingModal() {
      this.errorsdata = {};
      this.form.status = null;
      this.form.student_id = null;
      this.form.training_id = null;
      this.$refs.add_student_to_training_modal.show();
    },
    submitStudentToTraining() {
      this.$refs.addAddStudentToTrainingRules.validate().then((success) => {
        if (success) {
          this.form.training_id = this.id;
          this.$store
            .dispatch("trainings/addStudentToTraining", this.form)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$refs.add_student_to_training_modal.hide();
              this.refresh();
            })
            .catch((error) => {
              if (error.response.status == 422) {
                const errors = [error.response.data.errors];
                errors.forEach((error, index) => {
                  const error_data = Object.values(error)[index][0];
                  this.errorsdata = error;
                });
              } else {
                this.$swal({
                  icon: "error",
                  title:
                    this.$i18n.locale == "en"
                      ? "There Is An Error"
                      : "يوجد خطأ",

                  showConfirmButton: false,
                  timer: 3000,
                });
              }
            });
        }
      });
    },
    customAutocompleteStds(event) {
      // search_for_student
      this.$store
        .dispatch("trainings/searchForStudent", {
          keyword: event.target.value,
        })
        .then((response) => {
          this.students = response;
        });
    },
    refresh(query) {
      //from the filter
      // if (this.term_id) {
      //   query = { ...query, term_id: this.term_id };
      // }

      // //from the url query
      // if (this.$route.query && this.$route.query.term_id) {
      //   query = { ...query, term_id: this.$route.query.term_id };
      // }

      query = { training_id: this.id };
      this.$store
        .dispatch("trainings/trainingStudents", { query: query })
        .then((response) => {
          this.items = response.data;
          this.total = response.meta.count;
          this.lookups = response.meta.lookup;
        });
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
