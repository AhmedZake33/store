<template>
  <div>
    <b-overlay :show="loading" rounded="sm">
      <b-card no-body>
        <b-card-header class="text-white pb-2 pl-0 w-100">
          <b-row class="d-flex justify-content-between w-100 m-0">
            <b-col cols="12" md="6" sm="2">
              <div class="d-flex">
                <b-input-group class="input-group-merge">
                  <b-input-group-prepend is-text>
                    <feather-icon icon="SearchIcon" class="pointer"/>
                  </b-input-group-prepend>
                  <b-form-input v-model="search_text" :placeholder="$t('Global.search_text')" @input="search"/>
                </b-input-group>
              </div>
            </b-col>
          </b-row>
        </b-card-header>
        <b-row>
          <b-col cols="12">
            <validation-observer ref="totalForm">
              <b-table
                  class="position-relative"
                  :items="courses"
                  responsive
                  striped
                  :fields="fields"
                  primary-key="id"
                  show-empty
                  :per-page="perPage"
                  :current-page="currentPage"
                  :empty-text="$t('Global.empty_text')"
              >
                <template #cell(✓)="data">
                  <b-form-checkbox
                      v-model="selectedCourseIds"
                      :value="data.item.id"
                  >
                  </b-form-checkbox>
                </template>
                <template #cell(course)="data">
                  {{ $i18n.locale == 'ar' ? data.item.full_name_local : data.item.full_name }}
                </template>
                <template #cell(code)="data">
                  {{ data.item.code ? data.item.code : "" }}
                </template>
                <template #cell(max_total)="data">
                  {{ data.item.max_total }}
                </template>
                <template #cell(credit_hours)="data">
                  {{ data.item.credit_hours }}
                </template>
                <template #cell(total)="data">
                  <b-form-group
                      v-if="selectedCourseIds.includes(data.item.id)"
                      label-for="total"
                      invalid-feedback=""
                  >
                    <validation-provider
                        #default="{ errors }"
                        :name="'total' + data.item.id"
                        :rules="`required|between:0,${data.item.max_total}`"
                    >
                      <b-form-input
                          type="number"
                          id="name-input"
                          v-model="selected['courseId-' + data.item.id]"
                          :state="errors.length > 0 ? false : null"
                      />
                      <ValidationErrors
                          :frontend-errors="validationErrorMessage(errors)"
                      />
                    </validation-provider>
                  </b-form-group>
                </template>
              </b-table>
            </validation-observer>
          </b-col>
          <b-col cols="12">
            <div class="mx-2 mb-2">
              <b-row>
                <b-col cols="12" sm="6"
                       class="d-flex align-items-center justify-content-center justify-content-sm-start">
                  <!-- <div class="mx-1">
                                      <label>{{ $t('Global.show') }}</label>
                                      <v-select v-model="perPage"
                                                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                                :options="pageOptions" :clearable="false"
                                                class="per-page-selector d-inline-block mx-50"/>
                                  </div> -->
                  <div class="mx-1">
                    <label>{{ $t('Global.Showing') }}</label>
                    <v-select :searchable="false" v-model="perPage"
                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="pageOptions"
                              :clearable="false" class="per-page-selector d-inline-block mx-50 pointer"/>
                    <label>{{ $t('Global.entries') }} </label>
                    <label class="mx-05"
                    >{{ $t('Global.from') }} {{ meta.from + 1 }}
                      {{ $t('Global.to') }}
                      {{
                        perPage >= meta.of ? meta.of.toString().replace(/^0+/, '') : meta.to.toString().replace(/^0+/, '')
                      }}
                      {{ $t('Global.of') }} {{ meta.of }}
                    </label>
                  </div>
                  <div></div>
                </b-col>
                <!-- Pagination -->
                <b-col cols="12" sm="6" class="d-flex align-items-center justify-content-center justify-content-sm-end">
                  <b-pagination v-if="items" :total-rows="items.length" v-model="currentPage" :per-page="perPage"
                                first-number last-number class="mb-0 mt-1 mt-sm-0" prev-class="prev-item"
                                next-class="next-item">
                    <template #prev-text>
                      <feather-icon icon="ChevronLeftIcon" size="18"/>
                    </template>
                    <template #next-text>
                      <feather-icon icon="ChevronRightIcon" size="18"/>
                    </template>
                  </b-pagination>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </b-card>
      <b-col cols="12" md="12">
        <div :class="loadingSaveBulk ? 'disabled_all':''" class="d-flex justify-content-end">
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
    </b-overlay>
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
  BForm, BInputGroup, BCardHeader, BInputGroupPrepend, BCard,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import {mapGetters, mapActions} from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import {ValidationProvider, ValidationObserver, localize} from "vee-validate";
import {number} from "@/@core/utils/validations/validations";
import {required} from "@validations";
import ValidationErrors from "@/views/components/common/ValidationErrors";

export default {
  name: "programCourses",
  components: {
    BCard,
    BInputGroupPrepend,
    BCardHeader,
    BInputGroup,
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
    ValidationErrors,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    programId: number,
    requestId: number,
    relatedCourseId: number,
  },
  data() {
    return {
      transferId: null,
      loading: false,
      loadingSaveBulk: false,
      selected: [],
      selectedCourseIds: [],
      filter: {},
      validationError: null,
      perPage: 10,
      pageOptions: [10, 20, 25, 50, 100],
      totalRows: 1,
      currentPage: 1,
      search_text: '',
      courses: []
    };
  },

  computed: {
    ...mapGetters({
      items: "internalTransfer/avalibleCourses",
      total: "internalTransfer/totalCourses",
      load: "internalTransfer/load",
    }),
    meta() {
      return {
        from: this.perPage * (this.currentPage - 1),
        to: this.perPage * (this.currentPage - 1) + this.perPage,
        of: this.items ? this.items.length : '',
      };
    },
    fields: function () {
      return [
        {
          key: "✓",
          lable: this.$t("Selected"),
          sortable: false,
        },
        {
          key: "course",
          label: this.$t("course"),
          sortable: false,
          thStyle: {width: "30%"},
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
          key: "total",
          label: this.$t("Total"),
          sortable: false,
          thStyle: {width: "20%"},
        },
        {
          key: "max_total",
          label: this.$t("Max Total"),
          sortable: false,
        },
      ];
    },
  },
  mounted() {
    this.transferId = this.$route.params.transfer_id ? this.$route.params.transfer_id : this.requestId;
    this.refresh();
  },
  methods: {
    ...mapActions({
      getProgramCourses: "internalTransfer/getProgramCourses",
      addTransferTempCourse: "internalTransfer/addTransferTempCourse",
      getTempCourseEquivalenceDetails: "internalTransfer/getTempCourseEquivalenceDetails",
    }),
    search() {
      if (this.search_text) {
        this.courses = this.items.filter(str => {
          if ((str.full_name && str.full_name.toLowerCase().includes(this.search_text.toLowerCase())) || (str.full_name_local && str.full_name_local.toLowerCase().includes(this.search_text.toLowerCase()))
            || (str.code && str.code.toLowerCase().includes(this.search_text.toLowerCase()))) {
            return str;
          }
        });
      } else {
        this.courses = this.items;
      }
    },
    refresh(query = {}) {
      this.loading = true;
      let payload = {
        id: this.transferId,
        query: {
          ...query,
          program_id: this.programId,
          related_course_id: this.relatedCourseId,
        },
      };
      this.getProgramCourses(payload).then((d) => {
        let payload = {
          id: this.transferId,
          related_course_id: this.relatedCourseId,
        };
        this.getTempCourseEquivalenceDetails(payload).then((data) => {
          // this.courses = data.courses_selected
          data.data.forEach((element) => {
            this.selected["courseId-" + element.course_id] = element.total;
            this.selectedCourseIds.push(element.course_id);
          });
          this.loading = false;
        });
        this.courses = this.items
      });
    },

    bulk() {
      this.$nextTick((_) => {
        this.$refs.totalForm.validate().then((success) => {
          if (success) {
            this.loadingSaveBulk = true;
            let payload = {
              query: {
                selected_courses: {...this.selected},
                related_course_id: this.relatedCourseId,
                selected_courses_ids: this.selectedCourseIds,
              },
              id: this.transferId,
            };
            this.addTransferTempCourse(payload)
                .then((data) => {
                  if (data.status == "success") {
                    this.selected = [];
                    this.RefreshParent();
                    this.$swal({
                      icon: "success",
                      timer: 1500,
                      showConfirmButton: false,
                      title: this.$t("Global.saved"),
                    });
                    this.loadingSaveBulk = false;
                    this.hideModal();
                  }
                })
                .catch((error) => {
                  this.selected = [];
                  this.RefreshParent();
                  this.errorToast(
                      this.$i18n.locale == "ar" ? error.title.ar : error.title.en
                  );
                  this.loadingSaveBulk = false;
                  this.hideModal();
                })
                .finally(() => {
                });
          }
        });
      });
    },
    hideModal() {
      this.$emit("hideModal");
    },
    RefreshParent() {
      this.$router.replace({}, () => {
      });
      this.$emit("RefreshParent");
    },
    validationErrorMessage(errors) {
      if (errors[0] && errors[0].includes("between")) {
        errors[0] = this.$t("total must be less than max total");
      } else if (errors[0] && errors[0].includes("required")) {
        errors[0] = this.$t("Validation.selectFiled");
      }
      return errors;
    },
  },
};
</script>
<style scoped>
.form-group .form-control {
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
