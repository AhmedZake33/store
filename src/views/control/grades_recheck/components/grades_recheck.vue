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
    :paramsLoaded="paramsLoaded"
  >
    <template #filter v-if="lookups">
      <b-col cols="6" md="4">
        <v-select
          v-model="filter.status"
          :filter="fuseSearch"
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          :options="lookups.statuses"
          :label="getSelectLabel()"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.status')"
        >
          <template v-slot:option="option">
            {{ $i18n.locale == "ar" ? option.name_local : option.name }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </div>
          </template>
          <template #no-options>
            {{ $t("noMatching") }}
          </template>
        </v-select>
      </b-col>
    </template>
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
        :empty-text="$t('Global.empty_text')"
      >
        <template #cell(student)="data">
          <b-link
            v-if="$i18n.locale == 'ar'"
            v-b-tooltip.hover="
              data.item.student && data.item.student.name
                ? data.item.student.name_local
                : '-'
            "
            class="font-weight-bold d-inline-block"
            :to="{ name: 'student-show', params: { id: data.item.id } }"
          >
            {{
              data.item.student && data.item.student.name_local
                ? data.item.student.name_local
                : "-"
            }}
          </b-link>
          <b-link
            v-if="$i18n.locale == 'en'"
            v-b-tooltip.hover="
              data.item.student && data.item.student.name
                ? data.item.student.name
                : '-'
            "
            class="font-weight-bold d-inline-block"
            :to="{ name: 'student-show', params: { id: data.item.id } }"
          >
            {{
              data.item.student && data.item.student.name
                ? data.item.student.name
                : "-"
            }}
          </b-link>
        </template>

        <!-- Course Code -->
          <template #cell(course)="data">
            {{ data.item.course.code }}:
            {{
              $i18n.locale == "ar"
                ? data.item.course.name_local
                : data.item.course.name
            }}
          </template>

          <!-- Term -->
          <template #cell(term)="data">
            {{
              $i18n.locale == "ar"
                ? data.item.term.name_local
                : data.item.term.name
            }}
          </template>

          <!-- payment_status -->
          <template #cell(payment_status)="data">
            <span v-if="data.item.status.id == 4">
              <!-- STATUS_CANCELED -->
              -
            </span>
            <span v-else-if="data.item.payment_status.id != 1">
              <b-link
                :to="{
                  name: 'PaymentConfirmation',
                  params: { id: data.item.payment_id },
                  query: {
                    returnUrl: $router.resolve({ name: 'grades_recheck' }).href,
                  },
                }"
              >
                {{ $t("Pay Now") }}
              </b-link>
            </span>
            <b-badge
              pill
              v-else
              :variant="`${data.item.payment_status.color_class}`"
              class="text-capitalize"
            >
              {{
                $i18n.locale == "ar"
                  ? data.item.payment_status.name_local
                  : data.item.payment_status.name
              }}
            </b-badge>
          </template>

          <!-- Status -->
          <template #cell(status)="data">
            <b-badge
              pill
              v-if="data.item.status"
              :variant="`${data.item.status.color_class}`"
              class="text-capitalize"
            >
              {{
                $i18n.locale == "ar"
                  ? data.item.status.name_local
                  : data.item.status.name
              }}
            </b-badge>
          </template>

          <!-- Course Type -->
          <template #cell(comments)="data">
            <div v-if="$i18n.locale == 'ar'">
              <p class="m-0">
                {{ 'تعليقات الطالب : ' + (data.item.student_comment ? data.item.student_comment : '_')}}
              </p>
              <p class="m-0">
                {{ 'تعليقات عضو هيئة التدريس : ' + (data.item.instructor_comment ? data.item.instructor_comment : '_')}}
              </p>
              <p class="m-0">
                {{ 'تعليقات الكنترول : ' + (data.item.control_comment ? data.item.control_comment : '_') }}
              </p>
            </div>
            <div v-else>
              <p class="m-0">
                {{ 'Student Comments : ' + (data.item.student_comment ? data.item.student_comment : '_') }}
              </p>
              <p class="m-0">
                {{ 'Instructor Comments : ' + (data.item.instructor_comment ? data.item.instructor_comment : '_') }}
              </p>
              <p class="m-0">
                {{ 'Control Comments : ' + (data.item.control_comment ? data.item.control_comment : '_') }}
              </p>
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
            <!-- <b-link
              :to="{ name: 'show_grades_recheck', params: { id: data.item.id } }"
            >
              <feather-icon
                v-b-tooltip.hover="$t('show')"
                icon="EyeIcon"
                style="cursor: pointer"
              />
            </b-link> -->
            <b-link>
              <feather-icon 
                icon="EditIcon" 
                v-b-tooltip.hover="$t('edit')" 
                variant="primary"
                v-if="hasPermission('edit_students_grades_recheck')"
                @click="openModal(data.item)"
              />
            </b-link>
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
  <b-modal
      id="submitgradesRecheckModal"
      :title="$t('Edit Grades Recheck')"
      :ok-title="$t('Global.save')"
      @ok="handleOk"
      v-model="modal"
      :cancel-title="$t('Global.cancel')"
      @cancel="handleCancel"
      ref="submitgradesRecheckModalRef"
    >
      <validation-observer ref="simpleRules">
        <b-form ref="submitgradesRecheckForm">
          <div class="row">
            <div class="col">
              <!-- Status -->
              <b-form-group class="left_right" :label="$t('Global.status')">
                <validation-provider
                  #default="{ errors }"
                  rules="required"
                  :name="$t('Global.status')"
                  v-if="lookups"
                >
                  <v-select
                    v-model="gradesRecheckForm.status"
                    :filter="fuseSearch"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups.statuses"
                    :label="getSelectLabel()"
                    class="w-100 mb-2"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.status')"
                  >
                    <template v-slot:option="option">
                      {{ $i18n.locale == "ar" ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                        <strong v-else>{{ name }} </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small
                    class="text-danger"
                    v-for="(error,index) in errors"
                    :key="index"
                  >
                    {{$i18n.locale == 'ar' ? 'حقل الحالة مطلوب' : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <!-- Instructor_ Comment -->
              <b-form-group class="left_right" :label="$t('instructor_comment')">
                <validation-provider 
                  #default="{ errors }" 
                  :name="$t('instructor_comment')"
                  rules="required"
                >
                  <b-form-textarea
                    v-model="gradesRecheckForm.instructor_comment"
                    id="instructor_comment"
                    name="instructor_comment"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :placeholder="$t('Global.instructor_comment')"
                    rows="3"
                    max-rows="6"
                  >
                  </b-form-textarea>
                  <small
                    class="text-danger"
                    v-for="(error,index) in errors"
                    :key="index"
                  >
                    {{$i18n.locale == 'ar' ? 'حقل تعليق عضو هيئة التدريس مطلوب' : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <!-- Control Comment -->
              <b-form-group class="left_right" :label="$t('control_comment')">
                <validation-provider 
                  #default="{ errors }" 
                  :name="$t('control_comment')"
                  rules="required"
                >
                  <b-form-textarea
                    v-model="gradesRecheckForm.control_comment"
                    id="control_comment"
                    name="control_comment"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :placeholder="$t('Global.control_comment')"
                    rows="3"
                    max-rows="6"
                  >
                  </b-form-textarea>
                  <small
                    class="text-danger"
                    v-for="(error,index) in errors"
                    :key="index"
                  >
                    {{$i18n.locale == 'ar' ? 'حقل تعليق الكنترول مطلوب' : error }}
                  </small>
                </validation-provider>
              </b-form-group>
            </div>
          </div>
        </b-form>
      </validation-observer>
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
  BForm,
  BFormGroup,
  BFormTextarea,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters , mapActions} from "vuex";
import Ripple from "vue-ripple-directive";
import { required } from "@validations";
import vSelect from "vue-select";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";

export default {
  name: "GradesRecheck",
  components: {
    DataTable,
    BCard,
    vSelect,
    BRow,
    BCol,
    required,
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
    BForm,
    BFormInput,
    BFormGroup,
    BFormTextarea,
    VBModal,
    BPopover,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    localize
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    bylaw_id: null,
    course_id: null,
  },
  data() {
    return {
      filter: { },
      paramsLoaded: true,
      modal: false,
      errorsdata: {},
      id: null,
      gradesRecheckForm: {
        status: null,
        instructor_comment: null,
        control_comment: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      items: "gradesRecheck/items",
      total: "gradesRecheck/total",
      load: "gradesRecheck/load",
      needDrop:'app/needDrop',
      lookups: "gradesRecheck/lookups",
    }),
    fields: function () {
      return [
        {
          key: "student",
          label: this.$t("Global.student"),
          sortable: true,
        },
        {
          key: "course",
          label: this.$t("Global.Course"),
          sortable: true,
        },
        {
          key: "term",
          label: this.$t("Global.semester"),
          sortable: true,
        },
        {
          key: "created_at",
          label: this.$t("Global.date_applied"),
          sortable: true,
        },
        {
          key: "payment_status",
          label: this.$t("Global.payment"),
          sortable: true,
        },
        {
          key: "status",
          label: this.$t("Global.status"),
          sortable: true,
        },
        {
          key: "comments",
          label: this.$t("Global.comments"),
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
    ...mapActions({
      editGradesRecheck: 'gradesRecheck/updateStatus'
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
    refresh(query) {
      query = { ...query };
      this.$store.dispatch("gradesRecheck/gradesRecheck", { query: query }).then((data) => {
        this.paramsLoaded = false;
      });
    },
    handleOk(e) {
      e.preventDefault(); // Prevent modal from closing
      this.$refs.simpleRules.validate().then((result) => {
        if (result == true) {
          this.editGradesRecheck({ query: this.gradesRecheckForm, id: this.id })
            .then((response) => {
              this.$refs.submitgradesRecheckModalRef.toggle();
              this.$swal({
                icon: "success",
                text: `${this.$t("Global.successMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              // this.$refs.exam_specifications_modal.hide();
              this.refresh()
            })
            .catch((error) => {

              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        }
      });
    },
    handleCancel() {
      this.id = null,
      this.gradesRecheckForm.status = null;
      this.gradesRecheckForm.instructor_comment = null;
      this.gradesRecheckForm.control_comment = null;
    },
    openModal(item){
      this.id = item.id
      this.gradesRecheckForm.status = item.status.id
      this.gradesRecheckForm.instructor_comment = item.instructor_comment
      this.gradesRecheckForm.control_comment = item.control_comment
      this.modal = true
    }
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
