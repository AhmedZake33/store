<template>
  <div class="new_edit">
    <!-- type {{ typeof(course.faculty) == 'object'?'this is objwct':"not object" }} -->
    <!-- course: {{ course }} -->
    <!-- data {{ data }} -->
    <b-overlay
    :show="load"
    rounded="sm"
    >
      <validation-observer ref="simpleRules">
        <b-form ref="course" @submit.stop.prevent="save">
          <ShowComponent :data="data">
                <template #edit>
                  <div class="mb-2">
                    <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon"
                                  class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_department')"/>
                  </div>
                </template>

                <template #name="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.name`) }}
                  </th>
                  <td>
                    <div>
                      <template>
                      <span>
                        <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                          <validation-provider #default="{ errors }" name="name" rules="english|required">
                            <b-form-input :placeholder="$t('Global.name')"
                                          id="name-input" v-model="course.name"/>
                            <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>              
                          </validation-provider>
                        </b-form-group>
                      </span>
                      </template>
                    </div>
                  </td>
                </template>

                <template #name_local="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.name_local`) }}
                  </th>
                  <td>
                    <div>
                      <template>
                      <span>
                        <b-form-group label-for="nameAr-input" invalid-feedback="Name is required">
                          <validation-provider #default="{ errors }" name="name_local" rules="arabic|required">
                            <b-form-input :placeholder="$t('Global.name_local')" @keypress="sanitizeArabic($event)"
                                          id="nameAr-input" v-model="course.name_local"/>
                            <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                          </validation-provider>
                        </b-form-group>
                      </span>
                      </template>
                    </div>
                  </td>
                </template>

                <template #faculty="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.faculty`) }}
                  </th>
                  <td>
                    <b-form-group label-for="code-input" invalid-feedback="Name is required">
                      <validation-provider #default="{ errors }" name="faculty_id" rules="required">
                        <v-select
                            v-if="options"
                            :placeholder="$t('Global.faculty')"
                            v-model="course.faculty"
                            :filter="fuseSearch"
                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="options.faculties"
                            :clearable="false"
                            input-id="code-input"
                            :reduce="val => val.id"
                        >
                          <template v-slot:option="option">
                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                              <span v-else>{{ name }}</span>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t('noMatching') }}
                          </template>
                        </v-select>
                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                      </validation-provider>
                      <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important">{{
                          errorsdata ? (errorsdata.faculty_id ? errorsdata.faculty_id[0].ar : '') : ''
                        }}</small>
                      <small v-else class="danger" style="color: red !important">
                        {{ errorsdata ? (errorsdata.faculty_id ? errorsdata.faculty_id[0].en : '') : '' }}
                      </small>
                    </b-form-group>
                  </td>
                </template>

                <template #bylaw="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.bylaw`) }}
                  </th>
                  <td>
                    <b-form-group label-for="code-input"
                                  invalid-feedback="Name is required">
                      <validation-provider #default="{ errors }" name="bylaw_id" rules="required">
                        <v-select
                            :filter="fuseSearch"
                            :placeholder="$t('Global.bylaw')"
                            :disabled="course.faculty?false:true"
                            v-if="options"
                            v-model="course.bylaw"
                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="options.bylaws"
                            :clearable="false"
                            input-id="code-input"
                            :reduce="val => val.id"
                        >
                          <template v-slot:option="option">
                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                              <span v-else>{{ name }}</span>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t('noMatching') }}
                          </template>
                        </v-select>
                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                      </validation-provider>
                      <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important">{{
                          errorsdata ? (errorsdata.bylaw_id ? errorsdata.bylaw_id[0].ar : '') : ''
                        }}</small>
                      <small v-else class="danger" style="color: red !important">
                        {{ errorsdata ? (errorsdata.bylaw_id ? errorsdata.bylaw_id[0].en : '') : '' }}
                      </small>
                    </b-form-group>
                  </td>
                </template>

                <template #mandatory="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.mandatory`) }}
                  </th>
                  <td>
                    <div>
                      <template>
                      <span>
                        <b-form-group label-for="type-input" invalid-feedback="type is required">
                          <validation-provider #default="{ errors }" name="type">
                            <b-form-checkbox
                            switch
                              id="type"
                              v-model="checked"
                              name="type"
                            >
                            </b-form-checkbox>
                          </validation-provider>
                        </b-form-group>
                      </span>
                      </template>
                    </div>
                  </td>
                </template>

                <template #period="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.period`) }}
                  </th>
                  <td>
                    <div>
                      <template>
                      <span>
                        <b-form-group label-for="period-input" invalid-feedback="period is required">
                          <validation-provider #default="{ errors }" name="period" rules="required">
                            <b-form-input type="number" :placeholder="$t('Global.period')" @keypress="sanitizeArabic($event)"
                                          id="period-input" v-model="course.period"/>
                            <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>  
                          </validation-provider>
                        </b-form-group>
                      </span>
                      </template>
                    </div>
                  </td>
                </template>

                <template #starts_at="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.start_at`) }}
                  </th>
                  <td>
                    <div>
                      <template>
                      <span>
                        <b-form-group label-for="starts_at-input" invalid-feedback="Start At is required">
                          <validation-provider #default="{ errors }" name="starts_at" rules="required">
                            <b-form-datepicker
                            :label-no-date-selected="$t('Global.no_selected')"
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            id="starts_at"
                            ref="starts_at"
                            v-model="course.starts_at"
                            :placeholder="$t('start_at')"
                        />
                            <!-- <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>   -->
                          </validation-provider>
                        </b-form-group>
                      </span>
                      </template>
                    </div>
                  </td>
                </template>

                <template #ends_at="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.end_at`) }}
                  </th>
                  <td>
                    <div>
                      <template>
                      <span>
                        <b-form-group label-for="ends_at-input" invalid-feedback="End At is required">
                          <validation-provider #default="{ errors }" name="ends_at" rules="required">
                            <b-form-datepicker
                            :label-no-date-selected="$t('Global.no_selected')"
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            id="ends_at"
                            ref="ends_at"
                            v-model="course.ends_at"
                            :placeholder="$t('end_at')"
                        />
                            <!-- <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>   -->
                          </validation-provider>
                        </b-form-group>
                      </span>
                      </template>
                    </div>
                  </td>
                </template>

                
                
          </ShowComponent>
          <!-- <b-col cols="12" md="4" class="mb-1">
                        <b-form-datepicker
                            :label-no-date-selected="$t('Global.no_selected')"
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            id="date_from"
                            ref="date_from"
                            v-model="filter.date_from"
                            :placeholder="$t('date_from')"
                        />
                        </b-col>
                        <b-col cols="12" md="4" class="mb-1">
                        <b-form-datepicker
                            :label-no-date-selected="$t('Global.no_selected')"
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            id="date_to"
                            ref="date_to"
                            v-model="filter.date_to"
                            :placeholder="$t('date_to')"
                        />
                    </b-col> -->
          <b-row>
            <b-col md="12">
              <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1">
                {{ $t('Global.save') }}
              </b-button>
              <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary"
                        @click="cancel">
                {{ $t('Global.cancel') }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </b-overlay>  
  </div>
</template>


<script>  
import { BFormDatepicker,BCol, BLink, BRow, BCard, BTabs, BTab, BTable,BDropdown,BOverlay,BDropdownItem, BTr, BTh, BForm, BFormInput, BFormGroup, BModal, BFormCheckbox } from 'bootstrap-vue';
import {mapGetters, mapActions} from 'vuex';
import Ripple from 'vue-ripple-directive';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import vSelect from 'vue-select';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, email, regex } from '@validations';
import ShowComponent from '@/views/components/info/show';
import {EventBus} from '../../../main';
export default {
  name: 'add',
  components: {
    BLink,
    BCol,
    BDropdown, BDropdownItem,
    BRow,
    BCard,
    BTabs,
    BTab,
    BTable,
    BTr,
    BTh,
    BForm,
    BOverlay,
    BFormInput,
    BModal,
    BFormGroup,
    ValidationErrors,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    localize,
    BFormCheckbox,
    ShowComponent,
    BFormDatepicker,
  },
  directives: {
    Ripple,
  },
  props: {
    data: {default: {}, type: [Array, Object]},
    id: {default: null, type: Number},
  },
 
    data(){
        return {
          checked:false,
           filter:{},
           ruleForm:{},
           show: true,
           course : {
            name:null,
            name_local:null,
            faculty:null,
            bylaw:null,
            mandatory:null,
            period:null,
            type:null,
            starts_at:null,
            ends_at:null,
           },
           errorsdata: {},

        }
    },
    methods:{
      ...mapActions({
        lookups: 'app/GET_LOOKUPS',
        getItem:'Emtyaz/show',
        putCourse:'Emtyaz/putCourse',
       
      }),
      cancel(){
        this.$router.go(-1);
      },
      save(){
        this.$refs.simpleRules.validate().then(success => {
        if(success){
          this.checked?this.course.mandatory = 1:this.course.mandatory = 0 ;
          if(this.id){
              let payload = {course:Object.assign({}, this.course, {id: undefined}) , id:this.id};
              this.putCourse(payload).then(() => {
                this.$swal({
                icon: "success",
                title:
                  this.$i18n.locale == "en"
                    ? "success update course"
                    : "تم التعديل بنجاح",
                showConfirmButton: false,
                timer: 1500,
              });
                this.$router.go(-1);
              }).catch(()=>{
                this.$swal({
                icon: "error",
                title:
                    this.$t('Global.errorMessage'),
                showConfirmButton: false,
                timer: 1500,
                });
              });
          }else{
            let payload = {course:Object.assign({}, this.course, {id: undefined}) }
            this.putCourse(payload).then(() => {
              this.$swal({
                icon: "success",
                title:
                this.$i18n.locale == "en"
                  ? "success Add course"
                  : "تم الاضافة بنجاح",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.go(-1);
            }).catch(()=>{
              this.$swal({
              icon: "error",
              title:
                
                this.$t('Global.errorMessage'),
                
              showConfirmButton: false,
              timer: 1500,
              });
            });
          }
        }else{
          this.$swal({
          icon: "error",
          title:
              this.$t('Global.errorMessage'),
          showConfirmButton: false,
          timer: 1500,
          });
        }
        });
        
      },
       
      init(){
          if(this.$route.params.bylaw){
            this.$store.dispatch('bylaws/get', this.$route.params.bylaw).then((response)=> {
              this.course.faculty = response.data.faculty.id
              this.course.bylaw = response.data.id
            });
          }
          if(this.id){
            this.course = this.data
            this.checked = this.course.mandatory ==1 ? true:false;
          }
          this.$store.dispatch('Emtyaz/courses')
          .then((res) => {
              // this.items = res
          })
          .catch(() => {});
          let query = {bylaws: true, emtyaz_faculties: true,faculty_id: this.course.faculty};
          this.lookups(query);
      }
    },
    mounted(){
        this.init();
    },
    created() {
      EventBus.$on('errorsdata', data => {
        this.errorsdata = data;
      });
  } ,
    computed:{
      ...mapGetters({
      items:    "Emtyaz/items",
      total:    "Emtyaz/totalCourses",
      load:     "app/load",
      options: 'app/lookups',
      }),
      grades_fields() {
        return [
          {
            key: 'name',
            label: this.$t('Global.name'),
          },
          {
            key: 'name_local',
            // label: 'name_local',
            label: this.$t('Global.name_local'),
          },
          {
            key: 'period',
            // label: 'period',
            label: this.$t('Global.period'),
            
          },
          {
            key: 'type',
            // label: 'type',
            label: this.$t('Global.type'),
          },
          {
            key: 'starts_at',
            // label: 'starts_at',
            label: this.$t('Global.start'),
          },
          {
            key: 'ends_at',
            // label: 'ends_at',
            label: this.$t('Global.end'),
          },
          {
            key: 'actions',
            label: this.$t('Global.actions'),
            thClass: 'customAction',
            tdClass: 'customWidth',
          },
        ];
      },
      fields() {
        let field = [
          {
            key: 'name',
            label: this.$t('Global.name'),
            thStyle: {width: '30%'},
          },
          {
            key: 'name_local',
            label: 'name_local',
          },
          {
            key: 'period',
            label: 'period',
          },
          {
            key: 'type',
            label: 'type',
          },
        ];
        return field;
      },
    },
    watch:{
      data(newValue){
        if(newValue){
          this.course = newValue
        }
      },
      'course.bylaw'(newValue){
        // alert(newValue)
      },
      'course.faculty'(newValue , oldValue){
        if(oldValue){
          this.course.bylaw = null
        }
        let query = {bylaws: true, emtyaz_faculties: true,faculty_id: newValue};
        this.lookups(query);
      }
    } 
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-wizard.scss';
@import '@core/scss/vue/libs/vue-select.scss';

.wizard-btn,
.wizard-icon-container {
  background-color: #054978 !important;
  border-color: #054978 !important;
}

.stepTitle.active {
  color: #054978 !important;
}
</style>