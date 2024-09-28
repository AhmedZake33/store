<template>
  <div>
    <edit-component :name="title">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="formRequest" @submit.stop.prevent="save">
            <b-row>
                  <b-col md="6">
                      <b-form-group v-if="options" :label="$t('Global.term')" label-for="term-input" >
                        <validation-provider
                            #default="{ errors }"
                            name="term"
                            rules="required"
                        >
                          <v-select
                                  v-model="formRequest.term_id"
                                  :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                  :options="options.terms"
                                  :clearable="false"
                                  input-id="term-input"
                                  :reduce="(val) => val.id"
                          >
                              <template v-slot:option="option">
                                  {{
                                  $i18n.locale == "ar"
                                  ? option.name_local +' '+ option.code
                                  : option.name +' '+ option.code
                                  }}
                              </template>
                              <template #selected-option="{ name, name_local,code }">
                                  <div style="display: flex; align-items: baseline">
                                      <strong v-if="$i18n.locale == 'ar'"
                                      >{{ name_local }} {{code}}
                                      </strong>
                                      <strong v-else>{{ name }} {{code}}</strong>
                                  </div>
                              </template>
                              <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                          <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                          <ValidationErrors :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                  </b-col>
                  <b-col md="6">
                      <b-form-group
                          :label="$t('Minimum GPA')"
                          label-for="min_gpa"
                      > 
                        <validation-provider
                          #default="{ errors }"
                          name="GPA"
                          rules="required|between:0,4"
                          >
                          <b-form-input
                          id="min_gpa"
                          v-model="formRequest.min_gpa"
                          type="number"
                          :state="errors.length > 0 ? false : null"
                          />
                          
                          <ValidationErrors :frontend-errors="errors" />
                        </validation-provider>
                      </b-form-group>
                  </b-col>
            
              <b-col md="6">
                  <b-form-group v-if="options" :label="$t('Global.stage_group')" label-for="stage-group" >
                    <validation-provider
                        #default="{ errors }"
                        name="stage group"
                        rules="required"
                    >
                      <v-select
                              v-model="formRequest.stage_group_id"
                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                              :options="options.stage_groups"
                              :clearable="false"
                              input-id="stage-group"
                              :reduce="(val) => val.id"
                      >
                          <template v-slot:option="option" >
                              {{
                              $i18n.locale == "ar"
                              ? option.name_local 
                              : option.name
                              }}
                          </template>
                          <template #selected-option="{ name, name_local}">
                              <div  style="display: flex; align-items: baseline">
                                  <strong v-if="$i18n.locale == 'ar'"
                                  >{{ name_local }}
                                  </strong>
                                  <strong v-else>{{ name }}</strong>
                              </div>
                              
                          </template>
                          <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                      <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
              </b-col>
                  <b-col md="6">
                  <b-form-group v-if="options" :label="$t('Global.stage_code')" label-for="stage-code" >
                    <validation-provider
                        #default="{ errors }"
                        name="stage code"
                        rules="required"
                    >
                      <v-select
                              v-model="formRequest.stage_code_id"
                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                              :options="options.stage_codes"
                              :clearable="false"
                              input-id="stage-code"
                              :reduce="(val) => val.id"
                      >
                          <template v-slot:option="option">
                              {{
                              $i18n.locale == "ar"
                              ? option.name_local 
                              : option.name
                              }}
                          </template>
                          <template #selected-option="{ name, name_local}">
                              <div style="display: flex; align-items: baseline">
                                  <strong v-if="$i18n.locale == 'ar'"
                                  >{{ name_local }}
                                  </strong>
                                  <strong v-else>{{ name }}</strong>
                              </div>
                              
                          </template>
                          <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                      <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
              </b-col>
              
              <b-col md="6">
                  <b-form-group v-if="options" :label="$t('Global.faculty')" label-for="faculty-input" >
                    <validation-provider
                        #default="{ errors }"
                        name="faculty"
                        rules="required"
                    >
                      <v-select
                              v-model="formRequest.faculty_id"
                              :filter="fuseSearch"
                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                              :options="options.faculties"
                              :clearable="false"
                              input-id="faculty-input"
                              :reduce="(val) => val.id"
                      >
                          <template v-slot:option="option">
                              {{
                              $i18n.locale == "ar"
                              ? option.name_local 
                              : option.name
                              }}
                          </template>
                          <template #selected-option="{ name, name_local}">
                              <div style="display: flex; align-items: baseline">
                                  <strong v-if="$i18n.locale == 'ar'"
                                  >{{ name_local }}
                                  </strong>
                                  <strong v-else>{{ name }}</strong>
                              </div>
                              
                          </template>
                          <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                      <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
              </b-col>
              <b-col md="6">
                  <b-form-group v-if="options" :label="$t('bylaw')" label-for="bylaw-input" >
                    <validation-provider
                        #default="{ errors }"
                        name="bylaw"
                        rules="required"
                    >
                      <v-select
                              v-model="formRequest.bylaw_id"
                              :filter="fuseSearch"
                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                              :options="options.bylaws"
                              :clearable="false"
                              input-id="bylaw-input"
                              :reduce="(val) => val.id"
                      >
                          <template v-slot:option="option">
                              {{
                              $i18n.locale == "ar"
                              ? option.name_local 
                              : option.name
                              }}
                          </template>
                          <template #selected-option="{ name, name_local}">
                              <div style="display: flex; align-items: baseline">
                                  <strong v-if="$i18n.locale == 'ar'"
                                  >{{ name_local }}
                                  </strong>
                                  <strong v-else>{{ name }}</strong>
                              </div>
                              
                          </template>
                          <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                      <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
              </b-col>
              <b-col md="6">
                    <b-form-group v-if="options" :label="$t('program')" label-for="program-input" >
                      <b-form-checkbox
                      v-model="allPrograms"
                      style="font-size: 0.2rem; padding-bottom: 1rem;"
                      :value="true"
                      
                      
                    >
                      All Programs
                    </b-form-checkbox>
                      <v-select
                              v-model="formRequest.programs"
                              :filter="fuseSearch"
                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                              :options="options.programs"
                              :clearable="false"
                              multiple
                              :disabled="allPrograms"
                              input-id="program-input"
                              :reduce="(val) => val.id"
                      >
                          <template v-slot:option="option">
                              {{
                              $i18n.locale == "ar"
                              ? option.name_local 
                              : option.name
                              }}
                          </template>
                          <template #selected-option="{ name, name_local}">
                              <div style="display: flex; align-items: baseline">
                                  <strong v-if="$i18n.locale == 'ar'"
                                  >{{ name_local }}
                                  </strong>
                                  <strong v-else>{{ name }}</strong>
                              </div>  
                          </template>
                          <template #no-options>
                            {{ $t('noMatching') }}
                        </template>
                      <template #no-options>
  {{ $t('noMatching') }}
</template>
</v-select>        
                  </b-form-group>    
              </b-col>
              <b-col md="6">
                <b-form-group  v-if="options" :label="$t('Date From/To')" label-for="date-input" style=" padding-top: 2.4rem;">
                  <validation-provider
                      #default="{ errors }"
                      name="range date"
                      rules="required"
                  >
                    <flat-pickr
                      v-model="formRequest.rangeDate"
                      class="form-control primary"
                      :config="{ mode: 'range'}"
                      id="date-input"
                    />
                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col>

          
              <!-- submit and reset -->
              <b-col md="12">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  class="mr-1"
                >
                  {{$t('Global.submit')}}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  variant="outline-secondary"
                  @click="cancel"
                >
                  {{$t('Global.cancel')}}
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
import { mapGetters, mapActions } from "vuex";
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BFormDatepicker
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import EditComponent from "@/views/components/table/Edit";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import flatPickr from 'vue-flatpickr-component'
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate'
import {required,between} from '@validations'
import ValidationErrors from "@/views/components/common/ValidationErrors";

export default {
  title: "add_term_stage",
  components: {
    EditComponent,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    vSelect,
    BFormDatepicker,
    flatPickr,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    localize

  },
 

  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: "termStages/item",
      load: "termStages/load",
      options: 'students/lookups',

    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id
        ? this.$t("Global.term_stage_edit")
        : this.$t("Global.term_stage_add");
    },
    query() {
    let data = {
        terms: this.item.term_id ? this.item.term_id : true,
        term_id: this.item.term_id,
        stage_groups:this.item.stage_group_id ? this.item.stage_group_id : true,
        stage_group_id:this.item.stage_group_id,
        stage_codes:this.item.stage_code_id ? this.item.stage_code_id : true,
        stage_code_id:this.item.stage_code_id,
        bylaws: this.item.bylaw_id ? this.item.bylaw_id : true,
        bylaw_id: this.item.bylaw_id,
        faculties: this.item.faculty_id ? this.item.faculty_id : true,
        faculty_id: this.item.faculty_id,
        programs: this.item.program_id ? this.item.program_id : true,
        program_id: this.item.program_id,
        
    }
    return data;
    },
  
  },
  data() {
    return {
      message: null,
      allPrograms:true ,
      formRequest:{
        term_id:null,
        bylaw_id:null,
        min_gpa:null,
        faculty_id:null,
        stage_group_id:null,
        stage_code_id:null,
        start_date:null,
        end_date:null,
        rangeDate:null
      } ,
      errorsdata: {},
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    ...mapActions({
      getItem: "termStages/get",
      lookups: 'students/lookup',

    }),
    init() {
        this.lookups(this.query);

      if (this.id) {
        this.getItem(this.id).then((_) => {

          this.formRequest.term_id = this.item.term.id;
          this.formRequest.bylaw_id=this.item.bylaw.id;
          this.formRequest.min_gpa=this.item.min_gpa;
          this.formRequest.faculty_id=this.item.faculty.id;
          this.formRequest.stage_group_id=this.item.stage_code.term_stage_group.id;
          this.formRequest.stage_code_id=this.item.stage_code.id;
          this.formRequest.rangeDate=this.item.start_date+" to "+this.item.end_date;
        
        });
      }
    },
    cancel(){
      this.$router.go(-1);
    },
    save() {
         this.$refs.simpleRules.validate().then(success => {
          if (success) {
            const myArray = this.formRequest.rangeDate.split(" ");
            this.formRequest.start_date = myArray[0];
            this.formRequest.end_date = myArray[2];
            this.allPrograms ? this.item.programs=[]:''
            const payload = { id: this.id, query: this.formRequest };

            this.$store
            .dispatch("termStages/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: (payload.id ? "Term Stage Updated!":"Term Stage Added!"),
                text: (payload.id ? "Term Stage Edited Successfully.":"Term Stage Added Successfully."),
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.go(-1);
            })
            .catch((error) => {
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                // this.showToast(this.$i18n.locale = 'ar' ? 'خطأ في البيانات' : 'Data Errors', 8000, error_data.ar, 'danger')
                this.errorsdata = error;
              });
            });
              }
             })
        
    },
  },
   watch: {
            'item.stage_group_id': function (val) {
                this.lookups(this.query);
            },
            'item.faculty_id': function (val) {
                this.lookups(this.query);
            },
            'item.bylaw_id': function (val) {
                this.lookups(this.query);
            },
            'item.programs': function (val) {
                if(val.length){
                  this.allPrograms=false;
                }else{
                  this.allPrograms=true;
                }
            },
          
        },
};
</script>

<style lang="scss">

@import '@core/scss/vue/libs/vue-flatpicker.scss';

  .dayContainer .flatpickr-day.inRange{
     box-shadow: none !important; 
  }
  .dayContainer .flatpickr-day.inRange{
       background: #DCDCDC !important; 
       border-color:#054978  !important; 
  }
  
</style>