<template>
  <div>
    <DataTable
      :total="total"
      :allow-search="true"
      :filter="filter"
      style="text-transform: capitalize"
      :allow-actions="true"
      :loading="load"
      :browse="true"
      @Refresh="refresh"
      @reset="reset()"
      :paramsLoaded="paramsLoaded"
    >
      <template #action>
        <b-button
          v-if="hasPermission('edit_settings_scholarship')"
          v-b-tooltip.hover="$t('Global.add')"
          class="btn-icon"
          variant="primary"
          @click="showModal(null, true)"
        >
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>
      <template #customTable>
        <b-table
          :busy="load"
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative"
          :items="items"
          responsive
          striped
          :fields="fields"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle" />
            </div>
          </template>

          <template #cell(actions)="data">
            <div>
              <feather-icon
                v-if="hasPermission('edit_settings_scholarship') && data.item.cannot_delete == 0"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer; margin-left: 3px"
                class="text-primary mr-1"
                @click="showModal(data.item, true)"
              />
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                v-if="hasPermission('delete_settings_scholarship') && data.item.cannot_delete == 0"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
                @click="
                  remove(data.item.id, data.item.payment_setting_scholarship_id)
                "
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <TabTable
      no-details
      customDelete
      :title2="$t('Excellence Scholarships')"
      class="mt-2"
      :loading="load"
      :fields="gpaFields"
      :items="chItems"
      @update="updateGradesRange"
      @refresh="init"
      @removeRange="removeRange"
    >
      <template #action>
        <div>
          <b-button
            v-if="hasPermission('edit_settings_scholarship')"
            v-b-tooltip.hover="$t('Global.add')"
            variant="primary"
            class="btn-icon"
            @click="rangeForm = {}; range_id = null; openRangeDialog() "
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </div>
      </template>
    </TabTable>

    <div class="all-modals">
      <b-modal
        id="modal-prevent-closing"
        v-model="modal"
        ref="my-modal"
        size="lg"
        :title="modalTitle"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <EditScholarship
          :yearId="yearId"
          :input="inputData"
          @hideModal="hideModal()"
          @refresh="refresh()"
        />
      </b-modal>
      <b-modal
        id="modalRange"
        v-model="dialog_range"
        no-close-on-backdrop
        size="lg"
        :title="$t('Excellence Scholarships')"
      >
        <validation-observer ref="rangeForm_rule">
          <b-form :class="load ? 'disabled_all' : ''">
            <div class="row">
              <!-- <b-col md="6">
                <b-form-group 
                  :label="$t('Global.min_gpa')" 
                  label-for="GPA"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="GPA"
                    rules="required|between:0,4"
                  >
                    <b-form-input
                      id="gpa"
                      v-model="rangeForm.min_gpa"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col> -->
              <b-col md="6">
                <b-form-group 
                  :label="$t('Global.min_gpa')" 
                  label-for="GPA"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="GPA"
                    rules="required|between:0,4"
                  >
                    <b-form-input
                      id="gpa"
                      v-model="rangeForm.min_gpa"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group 
                  :label="$t('Global.max_gpa')" 
                  label-for="GPA"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="GPA"
                    rules="required|between:0,4"
                  >
                    <b-form-input
                      id="gpa"
                      v-model="rangeForm.max_gpa"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t(`Percentage Discount on Administrative Fees`)"
                  label-for="max_ch_value"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Percentage Discount on Administrative Fees"
                    rules="required|between:0,100"
                  >
                    <b-form-input
                      id="max_ch_value"
                      v-model="rangeForm.percentage_discount_administrative"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t(`Percentage Discount on Other Fees`)"
                  label-for="max_courses"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Percentage Discount on Other Fees"
                    rules="required|between:0,100"
                  >
                    <b-form-input
                      id="max_courses"
                      v-model="rangeForm.percentage_discount_other_fees"
                      type="number"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row :class="load ? 'disabled_all' : ''">
            <b-col md="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submitSettings"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="dialog_range = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </div>
  </div>
</template>
<script>
import DataTable from "@/views/components/table/DataTable";
import {
  BTable,
  BLink,
  BCol,
  BSpinner,
  BRow,
  BFormGroup,
  BFormInput,
  BForm,
} from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import EditScholarship from "@/views/system/years/components/ScholarshipsSetting/EditScholarship.vue";
import vSelect from "vue-select";
import TabTable from "@/views/students/student/components/TabTable";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";

export default {
  name: "Accounts",
  components: {
    DataTable,
    ValidationProvider,
    ValidationErrors,
    BFormInput,
    BForm,
    ValidationObserver,
    localize,
    TabTable,
    BTable,
    BLink,
    EditScholarship,
    vSelect,
    BCol,
    BSpinner,
    BFormGroup,
    BRow,
  },
  directives: {
    Ripple,
  },
  props: {
    yearId: null,
  },
  data() {
    return {
      filter: {},
      paramsLoaded: true,
      list: [],
      chList: [],
      load: false,
      range_id: null,
      inputData: null,
      modal: false,
      modalTitle: "",
      rangeForm: {},
      dialog_range: false,
      payment_setting_scholarship_id: null
    };
  },
  computed: {
    fields() {
      return [
        {
          key: "name",
          sortable: false,
          label: this.$t("name_custom"),
        },
        {
          key: "name_local",
          sortable: false,
          label: this.$t("name_local"),
        },
        {
          key: "percentage_administrative",
          sortable: false,
          label: this.$t("Percentage Administrative"),
        },
        {
          key: "percentage_other_fees",
          sortable: false,
          label: this.$t("Percentage Other Fees"),
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thStyle: { width: "10%" },
        },
      ];
    },
    gpaFields() {
      return [
        {
          key: "label_range",
          tdClass: "border-right",
          thClass: "border-right",
          label: this.$t("GPA Range"),
        },
        
        {
          key: "percentage_administrative",
          label: this.$t("Percentage Administrative"),
          thClass: "border-right",
          tdClass: "border-right",
        },
        
        {
          key: "percentage_other_fees",
          label: this.$t("Percentage Other Fees"),
          thClass: "border-right",
          tdClass: "border-right",
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
    },
    items() {
      return this.list;
    },
    chItems() {
      return this.chList;
    },
    total() {
      return this.totalItems;
    },
  },
  methods: {
    ...mapActions({
      getScholarship: "yearPayments/getScholarship",
      automaticScholarships: "yearPayments/getAutomaticScholarship",
      removeScholarship: "yearPayments/removeScholarship",
      editGradesRangeScolarship: "yearPayments/updateGradesRangeScolarship",
    }),
    refresh(query) {
      const payload = { yearId: this.yearId, query: query };
      this.getScholarship(payload)
        .then((res) => {
          this.list = res;
          this.paramsLoaded = false;
        })
        .finally(() => {
          this.load = false;
        });

      this.automaticScholarships(payload)
        .then((res) => {
          this.chList = res;
          this.paramsLoaded = false;
        })
        .finally(() => {
          this.load = false;
        });
    },
    showModal(data, showEdit = false) {
      if (data) {
        this.modalTitle = "Edit Scholarship";
      } else {
        this.modalTitle = "Add Scholarship";
      }
      this.inputData = data;
      this.modal = true;
    },
    hideModal() {
      this.modal = false;
    },
    remove(scholarshipId, payment_setting_scholarship_id) {
      const payload = {
        yearId: this.yearId,
        scholarshipId,
        payment_setting_scholarship_id: payment_setting_scholarship_id,
      };
      this.$swal({
        title: this.$t("Global.deleteTitle"),
        text: this.$t("Global.deleteText"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("Global.cancel"),
        confirmButtonText: this.$t("Global.deleteBtn"),
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.load = true;
          this.removeScholarship(payload).finally((_) => {
            this.refresh();
          });
        }
      });
    },
    init() {},
    openRangeDialog() {
      this.dialog_range = true;
    },
    resetModal() {},
    removeRange(data) {
      const payload = {
        yearId: this.yearId,
        scholarshipId: data.id,
        payment_setting_scholarship_id: data.payment_setting_scholarship_id,
      };
      this.$swal({
        title: this.$t("Global.deleteTitle"),
        text: this.$t("Global.deleteText"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("Global.cancel"),
        confirmButtonText: this.$t("Global.deleteBtn"),
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.load = true;
          this.removeScholarship(payload).finally((_) => {
            this.refresh();
          });
        }
      });
    },
    updateGradesRange(data) {
      this.rangeForm = {...data};
      this.rangeForm.percentage_discount_administrative = data.percentage_administrative
      this.rangeForm.percentage_discount_other_fees = data.percentage_other_fees
      this.range_id = data.id;
      this.payment_setting_scholarship_id = data.payment_setting_scholarship_id
      this.openRangeDialog();
    },
    submitSettings() {
      this.$refs.rangeForm_rule.validate().then((success) => {
        if (success) {
          this.rangeForm.payment_setting_scholarship_id = this.range_id ? this.payment_setting_scholarship_id : null
          const payload = {
              yearId: this.yearId,
              scholarshipId: this.range_id ? this.range_id : null,
              data: this.rangeForm,
            }
            this.editGradesRangeScolarship(payload).then(res => {
              this.refresh()
              this.dialog_range = false;
              this.rangeForm = {}
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              })
            })
        }
      });
    },
  },
};
</script>

<style>
</style>
