<template>
  <div>
    <b-card class="mb-0">
      <b-tabs
        v-model="tabIndex"
        vertical
        nav-wrapper-class="nav-hidden"
        align="left"
      >
        <b-tab>
          <template #title>
            <feather-icon icon="BookOpenIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template
          >
        </b-tab>

        <b-row v-if="item" class="custom_flex">
          <b-col cols="12">
            <b-card-header
              class="mt-0 pt-0 p-0 abc"
              style="justify-content: end"
            >
              <div>
                <!-- Accept(3): if status is: Request(1) -->
                <b-button
                  v-if="item.status == 1 || item.status == 4"
                  :class="load ? 'disabled_all btn-icon' : 'btn-icon'"
                  variant="primary"
                  style="margin-bottom: 10px; margin-right: 10px"
                  @click="applyStatusAction(3)"
                >
                  {{ $t("Accept") }}
                </b-button>

                <!-- Reject(4): if status is: Request(1), Waiting for Payment(2), Accepted(3) -->
                <b-button
                  v-if="
                    item.status == 1 || item.status == 2 || item.status == 3
                  "
                  class="btn-icon"
                  variant="danger"
                  style="margin-bottom: 10px; margin-right: 10px"
                  @click="
                    openUpdateStudentStatusModal({
                      status_id: 4,
                      title: $t('Reject'),
                      show_reason: true,
                      show_approved_num_of_weeks: false,
                    })
                  "
                >
                  {{ $t("Reject") }}
                </b-button>

                <!-- Approve(6): if status is: Accepted(3), Finished(5), Disapproved(7) -->
                <b-button
                  v-if="
                    item.status == 3 || item.status == 5 || item.status == 7
                  "
                  class="btn-icon"
                  variant="success"
                  style="margin-bottom: 10px; margin-right: 10px"
                  @click="
                    openUpdateStudentStatusModal({
                      status_id: 6,
                      title: $t('Approve'),
                      show_reason: false,
                      show_approved_num_of_weeks: true,
                    })
                  "
                >
                  {{ $t("Approve") }}
                </b-button>

                <!-- Disapprove(7): if status is: Accepted(3), Finished(5), Approved(6) -->
                <b-button
                  v-if="
                    item.status == 3 || item.status == 5 || item.status == 6
                  "
                  class="btn-icon"
                  variant="danger"
                  style="margin-bottom: 10px; margin-right: 10px"
                  @click="
                    openUpdateStudentStatusModal({
                      status_id: 7,
                      title: $t('Disapprove'),
                      show_reason: true,
                      show_approved_num_of_weeks: false,
                    })
                  "
                >
                  {{ $t("Disapprove") }}
                </b-button>

                <!-- Final Disapprove(8): if status is: Accepted(3), Finished(5), Approved(6), Disapproved(7) -->
                <b-button
                  v-if="
                    item.status == 3 ||
                    item.status == 5 ||
                    item.status == 6 ||
                    item.status == 7
                  "
                  class="btn-icon"
                  variant="danger"
                  style="margin-bottom: 10px; margin-right: 10px"
                  @click="
                    openUpdateStudentStatusModal({
                      status_id: 8,
                      title: $t('Final Disapprove'),
                      show_reason: true,
                      show_approved_num_of_weeks: false,
                    })
                  "
                >
                  {{ $t("Final Disapprove") }}
                </b-button>

                <!-- Reset -->
                <b-button
                  v-if="
                    (item.status != 1 &&
                      item.status != 2 &&
                      item.status != 3 &&
                      item.status != 4 &&
                      item.status != 5 &&
                      item.status == 6) ||
                    item.status == 7 ||
                    item.status == 8
                  "
                  class="btn-icon"
                  variant="primary"
                  style="margin-bottom: 10px; margin-right: 10px"
                  @click="applyStatusAction(5)"
                >
                  {{ $t("Global.reset") }}
                </b-button>
              </div>
            </b-card-header>
            <!-- Data -->
            <table class="table table-striped custom_table text_nobreak">
              <tbody v-if="item" style="text-align: initial">
                <!-- Student Name and code -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.name`) }}
                  </th>
                  <td>
                    <b-link
                      :to="{
                        name: 'student-show',
                        params: { id: item.student_id },
                      }"
                      class="font-weight-bold d-block text-nowrap"
                      target="_blank"
                    >
                      {{ item.code }} :
                      {{ $i18n.locale == "en" ? item.name : item.name_local }}
                    </b-link>
                  </td>
                </tr>
                <!-- Term -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.term`) }}
                  </th>
                  <td>
                    <b-link
                      :to="{
                        name: 'term',
                        params: { id: item.training.term.id },
                      }"
                      class="font-weight-bold d-block text-nowrap"
                      target="_blank"
                    >
                      {{
                        $i18n.locale == "en"
                          ? item.training.term.name
                          : item.training.term.name_local
                      }}
                    </b-link>
                  </td>
                </tr>
                <!-- Training -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Training`) }}
                  </th>
                  <td>
                    <b-link
                      :to="{
                        name: 'show_training',
                        params: { id: item.training_id },
                      }"
                      class="font-weight-bold d-block text-nowrap"
                      target="_blank"
                    >
                      {{
                        $i18n.locale == "en"
                          ? item.training.name
                          : item.training.name_local
                      }}
                    </b-link>
                  </td>
                </tr>
                <!-- Description -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.description`) }}
                  </th>
                  <td>
                    {{ item.training.description }}
                  </td>
                </tr>
                <!-- Organization -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.Organization`) }}
                  </th>
                  <td>
                    <span v-if="item.training.organization">
                      {{
                        $i18n.locale == "en"
                          ? item.training.organization.name
                          : item.training.organization.name_local
                      }}
                    </span>
                    <span v-else>{{ item.training.organization_other }}</span>
                  </td>
                </tr>
                <!-- Source -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Source`) }}
                  </th>
                  <td>
                    {{ item.training.source }}
                  </td>
                </tr>
                <!-- Number of weeks -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Training Weeks`) }}
                  </th>
                  <td>
                    {{ item.training.num_of_weeks }}
                  </td>
                </tr>
                <!-- Approved weeks -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Approved Weeks`) }}
                  </th>
                  <td>
                    {{ item.weeks }}
                  </td>
                </tr>
                <!-- Start Date -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Start Date`) }}
                  </th>
                  <td>
                    {{ item.training.start_at }}
                  </td>
                </tr>
                <!-- End Date -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`End Date`) }}
                  </th>
                  <td>
                    {{ item.training.end_at }}
                  </td>
                </tr>
                <!-- Files -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Files`) }}
                  </th>
                  <td>
                    <span v-for="document in item.documents" :key="document.id">
                      <a
                        class="text-capitalize"
                        style="cursor: pointer"
                        target="_blank"
                        :href="document.url"
                      >
                        <feather-icon
                          icon="FileIcon"
                          size="18"
                          class="align-middle text-body"
                        />
                        {{ document.title }}
                      </a>
                    </span>
                  </td>
                </tr>
                <!-- Status -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.status`) }}
                  </th>
                  <td>
                    <b-badge
                      pill
                      v-if="item.status_object"
                      :variant="`${item.status_object.color_class}`"
                      class="text-capitalize"
                    >
                      {{
                        $i18n.locale == "en"
                          ? item.status_object.name
                          : item.status_object.name_local
                      }}
                    </b-badge>
                  </td>
                </tr>
                <!-- Payment status -->
                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t("Payment Status") }}
                  </th>
                  <td>
                    <b-badge
                      pill
                      v-if="item.payment && item.payment.status_object"
                      :variant="`${item.payment.status_object.color_class}`"
                      class="text-capitalize"
                    >
                      {{
                        $i18n.locale == "en"
                          ? item.payment.status_object.name
                          : item.payment.status_object.name_local
                      }}
                    </b-badge>
                    <b-badge
                      v-else
                      pill
                      :variant="'danger'"
                      class="text-capitalize"
                    >
                      {{ $t("None") }}</b-badge
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>
      </b-tabs>
    </b-card>

    <!-- Update the status of the training -->
    <b-modal
      id="updateStudentStatusModal"
      ref="updateStudentStatusModal"
      no-close-on-backdrop
      size="lg"
      centered
      :title="modal_data.title"
    >
      <validation-observer ref="updateStudentStatusRules">
        <form ref="updateStudentStatusForm">
          <div class="row">
            <div class="col">
              <!-- Reason -->
              <b-form-group
                v-if="modal_data.show_reason"
                class="left_right"
                :label="$t('Global.reason')"
              >
                <validation-provider #default="{ errors }" rules="required">
                  <b-form-input
                    id="reason"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :state="errors.length > 0 ? false : null"
                    v-model="reason"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'reason')"
                  />
                </validation-provider>
              </b-form-group>
              <!-- Approved Weeks -->
              <b-form-group
                v-if="modal_data.show_approved_num_of_weeks"
                class="left_right"
                :label="$t('Approved Weeks')"
              >
                <validation-provider #default="{ errors }" rules="required">
                  <b-form-input
                    id="approved_num_of_weeks"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :state="errors.length > 0 ? false : null"
                    :type="'number'"
                    v-model="approved_num_of_weeks"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'approved_num_of_weeks')
                    "
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
              :class="load ? 'disabled_all mr-1' : 'mr-1'"
              @click="submitUpdateStudentStatusModal()"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="$refs.updateStudentStatusModal.hide()"
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
import { mapGetters } from "vuex";
import {
  BLink,
  BTab,
  BTabs,
  BCard,
  BForm,
  BFormGroup,
  BFormInput,
  BCardHeader,
  BOverlay,
  BCol,
  BRow,
  BCardText,
  BBadge,
} from "bootstrap-vue";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";

export default {
  name: "show",
  components: {
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    localize,
    BLink,
    BTab,
    BTabs,
    BCard,
    BForm,
    BFormGroup,
    BFormInput,
    BCardHeader,
    BOverlay,
    BCol,
    BRow,
    BCardText,
    BBadge,
  },
  data() {
    return {
      item: null,
      approved_num_of_weeks: null,
      reason: null,
      status_id: null,
      tabIndex: 0,
      loading: false,
      errorsdata: {},
      modal_data: {
        title: "",
        show_reason: false,
        show_approved_num_of_weeks: false,
      },
      statuses: {},
    };
  },
  computed: {
    ...mapGetters({
      load: "trainings/load",
    }),
    training_student_id() {
      return this.$route.params.training_student_id
        ? this.$route.params.training_student_id
        : null;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store
        .dispatch("trainings/studentTraining", this.training_student_id)
        .then((response) => {
          this.item = response.data;
        });
    },
    //open the modal
    openUpdateStudentStatusModal(data) {
      //reset
      this.approved_num_of_weeks = null;
      this.reason = null;
      this.status_id = null;
      this.errorsdata = {};

      this.status_id = data.status_id;
      this.modal_data.title = data.title;
      this.modal_data.show_reason = data.show_reason;
      this.modal_data.show_approved_num_of_weeks =
        data.show_approved_num_of_weeks;
      this.$refs.updateStudentStatusModal.show();
    },
    submitUpdateStudentStatusModal() {
      this.$refs.updateStudentStatusRules.validate().then((success) => {
        if (success) {
          this.applyStatusAction(this.status_id);
        }
      }); //end of validation
    },
    applyStatusAction(status_id) {
      var payload = {};
      //Need approved weeks: Reject(4), Disapprove(7), Final Disapprove(8)
      if (status_id == 4 || status_id == 7 || status_id == 8) {
        payload.reason = this.reason;
      }
      //Approve (6)
      if (status_id == 6) {
        payload.approved_num_of_weeks = this.approved_num_of_weeks;
      }

      payload.status_id = status_id;
      payload.training_student_id = this.training_student_id;

      this.$store
        .dispatch("trainings/updateStudentTrainingStatus", payload)
        .then((response) => {
          this.$refs.updateStudentStatusModal.hide();
          this.init();
          this.$swal({
            icon: "success",
            text: `${this.$t("Global.successMessage")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          if (error.response.status == 422) {
            const errors = [error.response.data.errors];
            errors.forEach((error) => {
              this.errorsdata = error;
            });
          }
          this.$swal({
            icon: "error",
            text: `${this.$t("Global.errorMessage")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }, //end applyStatusAction fun
  },
};
</script>

<style scoped></style>
