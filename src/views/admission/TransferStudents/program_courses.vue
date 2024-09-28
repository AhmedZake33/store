<template>
  <div>
    <DataTable
      :total="total"
      :loading="load"
      :allow-search="true"
      program_courses
      @Refresh="refresh"
      :filter="filter"
      :paramsLoaded="paramsLoaded"
    >
      <template #customTable>
        <b-form>
          <validation-observer ref="totalForm">
            <b-table
              class="position-relative"
              :items="items"
              responsive
              :fields="fields"
              primary-key="course_id"
              show-empty
              :empty-text="$t('Global.empty_text')"
            >
              <template #cell(select)="data">
                <b-form-checkbox
                  v-model="selectedCourseIds"
                  :value="data.item.id"
                >
                </b-form-checkbox>
              </template>
              <template #cell(course)="data">
                {{ getTranslatedName(data.item) }}
              </template>
              <template #cell(code)="data">
                {{ data.item.code }}
              </template>
              <template #cell(max_total)="data">
                {{ data.item.max_total }}
              </template>
              <template #cell(credit_hours)="data">
                {{ data.item.credit_hours }}
              </template>
              <!-- <template #cell(total)="data">
                    <b-form-group v-if="selectedCourseIds.includes(data.item.course_id)"  label-for="total" invalid-feedback="">
                      <validation-provider #default="{ errors }" name="total" rules="required">
                          <b-form-input  type="number"  id="name-input" v-model="selected['courseId-'+data.item.course_id]" :state="errors.length > 0 ? false : null" />
                          <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                      </validation-provider>
                    </b-form-group>
                  </template> -->
            </b-table>
          </validation-observer>
        </b-form>
      </template>
    </DataTable>
    <b-col cols="12" md="12" :class="loadingSaveBulk ? 'disabled_all' : ''">
      <div class="d-flex justify-content-end">
        <b-button
          type="submit"
          variant="primary"
          class="mt-0 mr-1"
          @click="bulk()"
        >
          {{ $t("Global.save") }}
        </b-button>
        <b-button type="reset" variant="outline-primary" @click="hideModal">
          {{ $t("Global.cancel") }}
        </b-button>
      </div>
    </b-col>
  </div>
</template>
<script>
import {
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BPagination,
  BOverlay,
  BModal,
  VBModal,
  BPopover,
  BFormCheckbox,
  BFormGroup,
  BForm,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { number } from "@/@core/utils/validations/validations";

export default {
  name: "programCourses",
  components: {
    DataTable,
    vSelect,
    BRow,
    BCol,
    BOverlay,
    BFormInput,
    BButton,
    BTable,
    BPagination,
    BModal,
    VBModal,
    BPopover,
    BFormCheckbox,
    ValidationProvider,
    BFormGroup,
    BForm,
    ValidationObserver,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    programId: number,
    relatedCourseId: number,
    applicant_id: Number,
  },
  data() {
    return {
      loadingSaveBulk: false,
      selected: [],
      selectedCourseIds: [],
      filter: {},
      paramsLoaded: true,
      init:true
    };
  },

  computed: {
    ...mapGetters({
      items: "externalTransfer/avalibleCourses",
      total: "externalTransfer/totalCourses",
      load: "externalTransfer/load",
      needDrop:'app/needDrop',
    }),

    fields: function () {
      return [
        {
          key: "select",
          lable: this.$t("SelectAll"),
        },
        {
          key: "course",
          label: this.$t("course"),
          sortable: false,
          thStyle: { width: "30%" },
        },
        {
          key: "code",
          label: this.$t("code"),
          sortable: false,
        },
        {
          key: "credit_hours",
          label: this.$t("Credit Hours"),
          sortable: false,
        },

        {
          key: "max_total",
          label: this.$t("Max Total"),
          sortable: false,
        },
      ];
    },
  },

  methods: {
    ...mapActions({
      getProgramCourses: "externalTransfer/getProgramCourses",
      addTransferTempCourse: "externalTransfer/addTransferTempCourse",
      getTempCourseEquivalenceDetails:
        "externalTransfer/getTempCourseEquivalenceDetails",
    }),
    refresh(query = {}) {
      let payload = {
        id: this.applicant_id,
        query: {
          ...query,
          program_id: this.programId,
          related_course_id: this.relatedCourseId,
        },
      };
      this.getProgramCourses(payload).then((d) => {
        this.paramsLoaded=false;
        let payload = {
          id: this.applicant_id,
          related_course_id: this.relatedCourseId,
        };
        if(this.init){
          this.getTempCourseEquivalenceDetails(payload).then((data) => {
            this.courses = data.courses_selected;
            data.data.forEach((element) => {
              //this.selected['courseId-'+element.course_id]=element.total
              this.selectedCourseIds.push(element.course_id);
            });
            this.init = false
          });
        }
      })
    },

    bulk() {
      this.$nextTick((_) => {
        this.$refs.totalForm.validate().then((success) => {
          if (success) {
            this.loadingSaveBulk = true;
            let payload = {
              query: {
                // selected_courses:{...this.selected},
                related_course_id: this.relatedCourseId,
                selected_courses_ids: this.selectedCourseIds,
              },
              id: this.applicant_id,
            };

            this.addTransferTempCourse(payload)
              .then((response) => {
                // this.selected = [];
                this.RefreshParent();
                this.$swal({
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                  title: this.$t("Global.saved"),
                });
                this.hideModal();
              })
              .catch((error) => {
                this.errorToast(error.title);
              })
              .finally(() => {
                this.loadingSaveBulk = false;
              });
          }
        });
      });
    },
    hideModal() {
      this.$emit("hideModal");
    },
    RefreshParent() {
      this.$emit("RefreshParent");
    },
  },
  watch: {},
};
</script>
<style scoped>
.form-control {
  border: 0;
  box-shadow: 0 3px 10px 0 rgb(34 41 47 / 10%) !important;
  background: transparent !important;
  background-color: transparent !important;
  padding: 0.2rem 0.5rem !important;
  height: 1.75rem !important;
}
.form-group {
  margin-bottom: 0rem !important;
  margin-top: 0rem !important;
}
</style>
