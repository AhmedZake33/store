<template>
  <div>
    <edit-component :name="title">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save">
            <div class="row d- flex justify-content-center" v-if="load">
                <b-spinner class="align-middle"></b-spinner>
              <div class="text-center text-black my-2">
              </div>
            </div>
            <b-row v-else>
              <!-- exams -->
              <b-col md="6" v-if="examId == null || $route.name == 'edit_exam_schedule'">
                <b-form-group
                  class="left_right"
                  :label="$t('exams')"
                  label-for="exams-input"
                  v-if="lookups"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="exams"
                    rules="required"
                  >
                    <v-select
                      v-model="form.exam_id"
                      :label="getSelectLabel()"
                      :options="lookups.exams"
                      :reduce="(val) => val.id"
                    >
                    <template slot="option" slot-scope="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name}}
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name}}
                    </template>
                    </v-select>
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'exams')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              
              <!-- Date -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.exam_date')"
                  label-for="date-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="exam date"
                    rules="required"
                  >
                    <flat-pickr
                        v-model="form.exam_date"
                        class="form-control"
                        :config="{ enableTime: false }"
                    />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'exam date')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Start -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.start_time')"
                  label-for="offerings-input"
                  v-if="lookups.slots"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="start time"
                    rules="required"
                  >
                    <v-select
                      v-model="form.start_slot_id"
                      :disabled="!form.exam_date"
                      :label="getSelectLabel()"
                      :options="lookups.slots"
                      :reduce="(val) => val.id"
                    >
                    <template slot="option" slot-scope="option">
                        {{ option.title }}
                      </template>
                      <template slot="selected-option" slot-scope="option">
                        {{ option.title }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'start_time')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Number Of Slots -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$i18n.locale == 'ar' ? 'عدد الفترات' : 'Number of Slots'"
                  label-for="offerings-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="number of slots"
                    rules="required"
                  >
                    <v-select
                      v-model="form.num_of_slots"
                      :label="getSelectLabel()"
                      :disabled="!form.start_slot_id"
                      :options="options"
                      :reduce="(val) => val"
                    >
                    
                    </v-select>
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'num_of_slots')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <!-- Locations -->
              <b-col md="6">
                <b-form-group
                  class="left_right"
                  :label="$t('Global.locations')"
                  label-for="offerings-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="locations"
                    rules="required"
                  >
                    <v-select
                      v-if=" !locations || locations.locations == 0 "
                      :disabled="true"
                      :label="getSelectLabel()"
                      :options="[]"
                    />
                    <v-select
                      v-else
                      v-model="form.location_ids"
                      multiple
                      :label="getSelectLabel()"
                      :options="locations.locations"
                      :reduce="(val) => val.id"
                    >
                      <template slot="option" slot-scope="option">
                        {{ $i18n.locale == 'ar' ? option.name_local + `(${option.occupied_capacity}/${option.exam_capacity})` : option.name + `(${option.occupied_capacity}/${option.exam_capacity})`}}
                      </template>
                      <template slot="selected-option" slot-scope="option">
                        {{ $i18n.locale == 'ar' ? option.name_local + `(${option.occupied_capacity}/${option.exam_capacity})` : option.name +  `(${option.occupied_capacity}/${option.exam_capacity})`}}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'locations')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12 mt-3">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  class="mr-1"
                >
                  {{ $i18n.locale == 'ar' ? 'حفظ' : 'Save' }}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  variant="outline-secondary"
                  @click="cancel"
                >
                  {{ $i18n.locale == 'ar' ? 'الغاء' : 'Cancel' }}
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </template>
    </edit-component>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { mapGetters, mapActions } from "vuex";
import { required } from "@validations";
import { PlusIcon, DeleteIcon } from "vue-feather-icons";
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
  BFormTextarea,
  BSpinner,
  BPopover,
  BFormDatepicker,
  BFormCheckbox,
} from "bootstrap-vue";
import { forEach } from 'postcss-rtl/lib/affected-props';

export default {
  name: "edit",
  components: {
    EditComponent,
    vSelect,
    ValidationErrors,
    required,
    DeleteIcon,
    PlusIcon,
    ValidationProvider,
    ValidationObserver,
    BForm,
    BFormGroup,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BFormTextarea,
    BSpinner,
    BPopover,
    localize,
    BFormDatepicker,
    BFormCheckbox,
    flatPickr
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      flag: false,
      errorsdata: {},
      examDateState: null,
      form: {
        offering_id: null,
        exam_date: null,
        start_slot_id: null,
        num_of_slots: null,
        location_ids: [],
        exam_id: null
      },
    };
  },
  watch:{
    handleChangedData(newVal, oldVal){
      const dataHolder = (newVal.split("|"))
      dataHolder.includes("null") ? this.flag = false : this.flag = true
      if(this.flag == true){
        this.$store.dispatch("examsSchedules/getAvailableLocations" , { 
          query: { 
            exam_date: this.form.exam_date, 
            start_slot_id: this.form.start_slot_id, 
            num_of_slots: this.form.num_of_slots, 
            locations: 'locations'
          }, 
          examId: this.form.exam_id

        }).then(_=>{
          this.flag = false
          // this.$store.state.examsSchedules.locations = null
        }); 
      }else{
        this.$store.state.examsSchedules.locations = null
        this.form.location_ids = []
      }
    },
    'form.start_slot_id'(newVal,oldVal){
      oldVal != null ? this.form.num_of_slots = null : false
    }
  },
  computed: {
    ...mapGetters({
      lookups: "examsSchedules/lookups",
      exams: "examsSchedules/exams",
      item: "examsSchedules/item",
      locations: "examsSchedules/locations",
      load: "examsSchedules/load",
    }),
    offering_id_param() {
      return this.$route.query.offering_id ? this.$route.query.offering_id : null;
    },
    schedule_id_param() {
      return this.$route.query.id ? this.$route.query.id : null;
    },
    // exam_id_param() {
    //   return this.$route.query.exam_id ? this.$route.query.exam_id : null;
    // },
    handleChangedData() {
      return `${this.form.num_of_slots +`|`+ this.form.exam_date +`|`+ this.form.start_slot_id}`;
    },
    title() {
      return this.id ? this.$t("Edit Exam Schedule") : this.$t("Add Exam Schedule");
    },
    options(){
      let slotsIDs = this.lookups.slots.map(object => object.id)
      let start_slot_id = slotsIDs.indexOf(this.form.start_slot_id)
      let opts = [];
      let count =   this.form.start_slot_id ? 
                    this.lookups.slots.length - start_slot_id : null
      for(let i = 1; i <= count ; i++){
        opts.push(i);
      }
      if(opts.length == 0 ||  this.form.num_of_slots > opts.length){
        this.form.num_of_slots = null
      }
      return opts
    }
  },
  props: {
    inline: { default: false, Type: Boolean },
  },
  methods: {
    ...mapActions({
      getItem: "examsSchedules/get",
    }),
    init() {
      if (this.schedule_id_param) {
        this.getItem(this.schedule_id_param).then((_) => {
          this.form.exam_id = this.item.exam.id;
          this.form.offering_id = this.item.offering_id;
          this.form.exam_date = this.item.exam_date;
          this.form.start_slot_id = this.item.start_slot_id;
          this.form.num_of_slots = this.item.num_of_slots;
          this.item.location_ids.forEach((el)=>{
            this.form.location_ids.push(el)
          })
        });
      }
    },
    cancel() {
      this.$router.push({ path: `/offering/${this.offering_id_param}?tabNum=7`});
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.form.offering_id = this.offering_id_param ? this.offering_id_param : null
          // this.form.exam_id = this.exam_id_param ? this.exam_id_param : null
          const payload = {id: this.schedule_id_param, query: this.form };
          this.$store
            .dispatch("examsSchedules/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                text: `${this.$t("successMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                this.$emit("refresh");
                return this.$emit("hide");
              }
              this.$router.push({ path: `/offering/${this.offering_id_param}?tabNum=7`});
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        }
      });
    },
    
  },
  mounted() {
    this.$store.dispatch("examsSchedules/lookups"  , { query: {offerings: 'offerings' , slots: 'slots'} , examId: this.form.exam_id } ); ///////////////////////
    this.$store.state.examsSchedules.locations = null
    this.init();
  },
};
</script>
<style scoped lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>