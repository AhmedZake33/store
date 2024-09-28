<template>
  <div>
    <b-row>
      <b-col cols="12" xl="12" lg="12" md="12">
        <div class="custom_actions mr-1">
          <b-dropdown
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            :text="$t('Global.more')"
            right
            size="sm"
            variant="outline-primary"
          >
            <b-dropdown-item
              variant="primary"
              @click="exportBarcodesModal()"
            >
              {{ $t("Global.export_barcodes") }}
            </b-dropdown-item>
            <b-dropdown-item
              variant="primary"
              @click="exportBackupBarcodes()"
            >
              {{ $t("Global.export_backup_barcodes") }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </b-col>
    </b-row>
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
        <!-- Exam -->
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.exam_id"
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.exams"
            :label="getSelectLabel()"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.exam')"
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
        <!-- Offering -->
        <b-col cols="6" md="4">
          <v-select
            name="offering_id"
            v-model="filter.offering_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.offerings"
            :label="getSelectLabel()"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.Offering')"
            :filter="fuseSearch"
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
                {{
                  $i18n.locale == "ar"
                    ? code + " " + name_local
                    : code + " " + name
                }}
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <!-- Location -->
        <!-- <b-col cols="6" md="4">
          <v-select
            v-model="filter.location_id"
            name="location_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.locations"
            :label="getSelectLabel()"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.location')"
            :filter="fuseSearch"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              {{ $i18n.locale == "ar" ? name_local : name }}
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col> -->
        <!-- Student -->
        <b-col cols="6" md="4">
          <v-select
            v-model="filter.student_id"
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
        </b-col>
      </template>

      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative"
          :items="items"
          responsive
          :fields="fields"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #cell(student_name)="data">
            <b-link
              :to="{
                name: 'student-show',
                params: { id: data.item.student_id },
              }"
              class="font-weight-bold d-block text-nowrap"
            >
              <span v-if="$i18n.locale == 'en'">
                {{ data.item ? data.item.student_name : "_" }}
              </span>
              <span v-if="$i18n.locale == 'ar'">
                {{ data.item ? data.item.student_name_local : "_" }}
              </span>
            </b-link>
          </template>

          <template #cell(exam_name)="data">
            <b-link
              :to="{ name: 'exam', params: { id: data.item.exam_id } }"
              class="font-weight-bold d-block text-nowrap"
            >
              <span v-if="$i18n.locale == 'en'">
                {{ data.item ? data.item.exam_name : "_" }}
              </span>
              <span v-if="$i18n.locale == 'ar'">
                {{ data.item ? data.item.exam_name_local : "_" }}
              </span>
            </b-link>
          </template>

          <template #cell(offering_name)="data">
            <b-link
              :to="{ name: 'offering', params: { id: data.item.offering_id } }"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.code }}
              <span v-if="$i18n.locale == 'en'">
                {{ data.item ? data.item.offering_name : "_" }}
              </span>
              <span v-if="$i18n.locale == 'ar'">
                {{ data.item ? data.item.offering_name_local : "_" }}
              </span>
            </b-link>
          </template>

          <template #cell(location_name)="data">
            <b-link
              :to="{ name: 'location', params: { id: data.item.location_id } }"
              class="font-weight-bold d-block text-nowrap"
            >
              <span v-if="$i18n.locale == 'en'">
                {{ data.item ? data.item.location_name : "_" }}
              </span>
              <span v-if="$i18n.locale == 'ar'">
                {{ data.item ? data.item.location_name_local : "_" }}
              </span>
            </b-link>
          </template>

          <template #cell(actions)="data">
            <div v-if="data.item.offering_exam_id == (null || 0)">
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
              <!-- unassigned barcode -->
              <feather-icon
                v-if="hasPermission('attach_examBackupBarcode')"
                @click="showAssignBackupBarcodeModal(data.item.barcode)"
                icon="EditIcon"
                v-b-tooltip.hover="$t('Assign Backup Barcode')"
                style="cursor: pointer"
              />
            </div>
            <div v-else>
              <feather-icon
                v-if="hasPermission('attach_examBackupBarcode')"
                @click="detachBackupBarcodeToStudent(data.item.barcode)"
                icon="RotateCwIcon"
                v-b-tooltip.hover="$t('Reset')"
                style="cursor: pointer; color: red"
              />
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
        <b-button
          v-if="hasPermission('add_examBackupBarcode')"
          @click="showAddBackupBarcodeModal()"
          class="btn-icon"
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>
    </DataTable>

    <!-- Generate new backup barcodes -->
    <b-modal
      id="add_backup_barcode_modal"
      ref="add_backup_barcode_modal"
      no-close-on-backdrop
      size="lg"
      centered
      :title="$t('Add Backup Barcode')"
    >
      <validation-observer ref="addBackupBarcodeModalRules">
        <form ref="add_backup_barcode_form">
          <div class="row">
            <div class="col">
              <b-form-group
                class="left_right"
                :label="$t('Number of Backup Barcodes')"
              >
                <validation-provider #default="{ errors }" rules="required">
                  <b-form-input
                    id="num_of_barcodes"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :state="errors.length > 0 ? false : null"
                    :type="'number'"
                    v-model="num_of_barcodes"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'num_of_barcodes')
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
              class="mr-1"
              @click="submitBackupBarcode()"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="$refs.add_backup_barcode_modal.hide()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <!-- Export barcodes -->
    <b-modal
      id="export_barcode_modal"
      ref="export_barcode_modal"
      no-close-on-backdrop
      size="lg"
      centered
      :title="$t('Global.export_barcodes')"
    >
      <validation-observer ref="exportBarcodeModalRules">
        <form ref="export_barcode_form">
          <div class="row">
            <div class="col">
              <b-form-group
                class="left_right"
                :label="$t('Global.exam')"
              >
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    name="exam_id"
                    v-model="exam_id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups.exams"
                    :label="getSelectLabel()"
                    class="w-100"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.exam')"
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
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'exam_id')
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
              class="mr-1"
              @click="exportBarcodeAction()"
            >
              {{ $t("Global.ok") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="$refs.export_barcode_modal.hide()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    
    <!-- Assign barcode to a student -->
    <b-modal
      id="assign_backup_barcode_modal"
      ref="assign_backup_barcode_modal"
      no-close-on-backdrop
      size="lg"
      centered
      :title="$t('Assign Backup Barcode')"
    >
      <validation-observer ref="assignBackupBarcodeModalRules">
        <form ref="assign_backup_barcode_form" id="assign_backup_barcode_form">
          <!-- barcode -->
          <div class="row">
            <div class="col">
              <b-form-group class="left_right" :label="$t('Barcodes')">
                <validation-provider #default="{ errors }" rules="required">
                  <b-form-input
                    id="barcode"
                    name="barcode"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :state="errors.length > 0 ? false : null"
                    :disabled="'disabled'"
                    v-model="assignBackupBarcodeForm.barcode"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'barcode')
                    "
                  />
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <!-- Exam -->
          <div class="row">
            <div class="col" v-if="lookups">
              <b-form-group class="left_right" :label="$t('Global.exam')">
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    name="exam_id"
                    v-model="assignBackupBarcodeForm.exam_id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups.exams"
                    :label="getSelectLabel()"
                    class="w-100"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.exam')"
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
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'exam_id')
                    "
                  />
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <!-- Offerings -->
          <div class="row">
            <div class="col" v-if="lookups">
              <b-form-group class="left_right" :label="$t('Global.Offering')">
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    name="offering_id"
                    v-model="assignBackupBarcodeForm.offering_id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="offerings()"
                    :label="getSelectLabel()"
                    class="w-100"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.Offering')"
                    :disabled="offerings().length == 0"
                    :filter="fuseSearch"
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
                        {{
                          $i18n.locale == "ar"
                            ? code + " " + name_local
                            : code + " " + name
                        }}
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'offering_id')
                    "
                  />
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <!-- locations -->
          <div class="row">
            <div class="col" v-if="lookups">
              <b-form-group class="left_right" :label="$t('Global.locations')">
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    v-model="assignBackupBarcodeForm.location_id"
                    name="location_id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="locations()"
                    :label="getSelectLabel()"
                    class="w-100"
                    :reduce="(val) => val.id"
                    :disabled="locations().length == 0"
                    :placeholder="$t('Global.location')"
                    :filter="fuseSearch"
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
                        {{
                          $i18n.locale == "ar"
                            ? code + " " + name_local
                            : code + " " + name
                        }}
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="
                      getBackendFieldError(errorsdata, 'location_id')
                    "
                  />
                </validation-provider>
              </b-form-group>
            </div>
          </div>
          <!-- Student -->
          <div class="row">
            <div class="col" v-if="lookups">
              <b-form-group class="left_right" :label="$t('Global.student')">
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    v-model="assignBackupBarcodeForm.student_id"
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
        </form>
      </validation-observer>
      <template #modal-footer>
        <b-row>
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submitAssignBackupBarcode()"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="$refs.assign_backup_barcode_modal.hide()"
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
} from "bootstrap-vue";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required } from "@validations";
import DataTable from "@/views/components/table/DataTable";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";

export default {
  name: "exams_barcodes",
  components: {
    ValidationErrors,
    DataTable,
    required,
    BCard,
    vSelect,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
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
    BModal,
    VBModal,
    BPopover,
    ValidationProvider,
    ValidationObserver,
    localize,
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
      filter: {
        barcode: null,
        offering_id: null,
        exam_id: null,
        student_id: null,
        location_id: null,
      },
      paramsLoaded: true,
      errorsdata: {},
      num_of_barcodes: null,
      exam_id: null,
      assignBackupBarcodeForm: {
        barcode: null,
        exam_id: null,
        offering_id: null,
        location_id: null,
        student_id: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      items: "examsBarcodes/items",
      total: "examsBarcodes/total",
      load: "examsBarcodes/load",
      lookups: "examsBarcodes/lookups",
      needDrop:'app/needDrop',
      students: "examsBarcodes/students",
    }),
    fields: function () {
      return [
        {
          key: "barcode",
          label: this.$t("Global.barcode"),
          sortable: true,
        },
        {
          key: "student_name",
          label: this.$t("Global.student"),
          sortable: true,
        },
        {
          key: "offering_name",
          label: this.$t("Global.Offering"),
          sortable: true,
        },
        {
          key: "exam_name",
          label: this.$t("Global.exam"),
          sortable: true,
        },
        {
          key: "location_name",
          label: this.$t("Global.location"),
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
      exportBarcodes: "examsBarcodes/exportBarcodes",
      exportBackupBarcodes: "examsBarcodes/exportBackupBarcodes",
    }),
    exportBarcodesModal(){
      this.$refs.export_barcode_modal.show();
    },
    offerings() {
      return this.lookups.offerings.filter((offering) => {
        if (
          this.assignBackupBarcodeForm.exam_id != undefined &&
          this.assignBackupBarcodeForm.exam_id == offering.exam_id
        )
          return offering;
      });
    },
    locations() {
      return this.lookups.locations.filter((location) => {
        if (
          this.assignBackupBarcodeForm.offering_id != undefined &&
          this.assignBackupBarcodeForm.offering_id == location.offering_id
        )
          return location;
      });
    },
    customAutocompleteStds(event) {
      // search_for_student
      this.$store.dispatch("examsBarcodes/searchForStudent", {
        keyword: event.target.value,
      });
    },
    showAddBackupBarcodeModal() {
      this.errorsdata = {};
      this.num_of_barcodes = null;
      this.$refs.add_backup_barcode_modal.show();
    },
    submitBackupBarcode() {
      this.$refs.addBackupBarcodeModalRules.validate().then((success) => {
        if (success) {
          const payload = { num_of_barcodes: this.num_of_barcodes };
          this.$store
            .dispatch("examsBarcodes/generateBackupBarcodes", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                this.$emit("refresh");
                return this.$emit("hide");
              }
              this.$refs.add_backup_barcode_modal.hide();
              this.refresh();
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
    showAssignBackupBarcodeModal(barcode) {
      this.assignBackupBarcodeForm = {
        barcode: null,
        exam_id: null,
        offering_id: null,
        location_id: null,
        student_id: null,
      };
      this.assignBackupBarcodeForm.barcode = barcode;
      this.errorsdata = {};
      this.$refs.assign_backup_barcode_modal.show();
    },
    submitAssignBackupBarcode() {
      this.$refs.assignBackupBarcodeModalRules.validate().then((success) => {
        if (success) {
          this.$store
            .dispatch(
              "examsBarcodes/attachBackupBarcodeToStudent",
              this.assignBackupBarcodeForm
            )
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                this.$emit("refresh");
                return this.$emit("hide");
              }
              this.$refs.assign_backup_barcode_modal.hide();
              this.refresh();
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
    detachBackupBarcodeToStudent(barcode) {
      if (barcode != null) {
        this.$swal({
          title: `${this.$t("Global.deleteTitle")}`,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: `${this.$t("Global.cancel")}`,
          confirmButtonText: `${this.$t("Yes, reset it!")}`,
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-outline-danger ml-1",
          },
          buttonsStyling: false,
        }).then((result) => {
          if (result.value) {
            this.popoverShow = false;
            this.$store
              .dispatch("examsBarcodes/detachBackupBarcodeToStudent", barcode)
              .then((response) => {
                this.$swal({
                  icon: "success",
                  title: this.$t("Global.restored"),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.refresh();
              });
          }
        });
      }
    },
    exportBarcodeAction(){
      this.$refs.exportBarcodeModalRules.validate().then((success) => {
        if (success) {
          const payload = { num_of_barcodes: this.num_of_barcodes };
          this.$store
            .dispatch("examsBarcodes/exportBarcodes", { exam_id: this.exam_id })
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                this.$emit("refresh");
                return this.$emit("hide");
              }
              this.$refs.export_barcode_modal.hide();
              this.refresh();
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
      if (this.barcode) {
        query = { ...query, barcode: this.barcode };
      }
      if (this.offering_id) {
        query = { ...query, offering_id: this.offering_id };
      }
      if (this.exam_id) {
        query = { ...query, exam_id: this.exam_id };
      }
      if (this.student_id) {
        query = { ...query, student_id: this.student_id };
      }
      if (this.location_id) {
        query = { ...query, location_id: this.location_id };
      }

      if (this.$route.query && this.$route.query.barcode) {
        query = { ...query, barcode: this.$route.query.barcode };
      }
      if (this.$route.query && this.$route.query.offering_id) {
        query = { ...query, offering_id: this.$route.query.offering_id };
      }
      if (this.$route.query && this.$route.query.exam_id) {
        query = { ...query, exam_id: this.$route.query.exam_id };
      }
      if (this.$route.query && this.$route.query.student_id) {
        query = { ...query, student_id: this.$route.query.student_id };
      }
      if (this.$route.query && this.$route.query.location_id) {
        query = { ...query, location_id: this.$route.query.location_id };
      }

      this.$store
        .dispatch("examsBarcodes/examsBarcodes", { query: query })
        .then((data) => {
          this.paramsLoaded = false;
        });
    },
  },
  watch: {
    "assignBackupBarcodeForm.exam_id": function (newValue) {
      this.assignBackupBarcodeForm.offering_id = null;
    },
    "assignBackupBarcodeForm.offering_id": function (newValue) {
      this.assignBackupBarcodeForm.location_id = null;
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
