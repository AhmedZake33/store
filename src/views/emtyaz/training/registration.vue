<template>
    <div>
        <DataTable :total="total" :allow-search="true"
        :filter="filter" :loading="load"
        @reset="reset"
        @Refresh="init"
        >
       
        <template #action>
            
            <!-- <template>
                <b-button
                        v-b-tooltip.hover="$t('Global.add')"
                        variant="primary"
                        class="btn-icon"
                        @click = "add"
                >
                    <feather-icon icon="PlusIcon"/>
                </b-button>
            </template> -->
        </template>
        <template  #filter>
          <b-col  cols="12" md="4">
            <v-select v-model="filter.year" :filter="fuseSearch" :clearable="true"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="year"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'" class="w-100 mb-2" :reduce="val => val.id"
                      :placeholder="$t('Global.academic_year')">
              <template v-slot:option="option">
                {{ option.start_year +' / '+ option.end_year }}
              </template>
              <template #selected-option="{ name, name_local }">
                <div style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                  <strong v-else>{{ name }}</strong>
                </div>
              </template>
              <template #no-options>
                {{ $t('noMatching') }}
              </template>
            </v-select>
          </b-col>
          <b-col cols="12" md="4">
            <b-form-datepicker
                            :label-no-date-selected="$t('Global.no_selected')"
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            id="starts_at"
                            ref="starts_at"
                            v-model="filter.starts_at"
                            :placeholder="$t('Global.start_at')"
                        />
          </b-col>
          <b-col cols="12" md="4">
            <b-form-datepicker
                            :label-no-date-selected="$t('Global.no_selected')"
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            id="ends_at"
                            ref="ends_at"
                            v-model="filter.ends_at"
                            :placeholder="$t('Global.end_at')"
                        />
          </b-col>
          <b-col cols="12" md="4">
            <v-select v-model="filter.mandatory" :filter="fuseSearch" :clearable="true"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="mandatoryOption"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'" class="w-100 mb-2" :reduce="val => val.id"
                      :placeholder="$t('Global.mandatory')">
              <template v-slot:option="option">
                {{ option.name }}
              </template>
              <template #selected-option="{ name, name_local }">
                <div style="display: flex; align-items: baseline">
                  <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                  <strong v-else>{{ name }}</strong>
                </div>
              </template>
              <template #no-options>
                {{ $t('noMatching') }}
              </template>
            </v-select>
            </b-col>
        </template>
        <template #customTable>
            <div class="bg-gray p-0 mb-1"
                  style=" padding-left: 0rem !important; padding-right: 0rem !important">
               
            </div>
            <b-table  :items="items"
                      responsive striped :fields="grades_fields" primary-key="id" show-empty
                      :empty-text="$t('Global.empty_text')">
                <!-- <template #cell(actions)="data">
                    <div>
                        <feather-icon 
                        v-b-tooltip.hover="$t('Global.edit')" 
                        icon="EditIcon"
                        style="cursor: pointer"  
                        @click="onEditClick(data.item)"
                        v-if="hasPermission('edit_course')"/>

                                      {{ data.id }}
                        <feather-icon v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon"
                                      style="cursor: pointer" class="text-danger mr-1"
                                      @click="trash(data.item.id)"
                                     />
                    </div>
                    
                </template> -->
                
                <template #cell(emtyaz)="data">
                   
                    <div class="d-flex" v-if="data.item.emtyaz_training.emtyaz_type.bylaw">
                        <span>
                        {{
                        $i18n.locale == "ar"
                            ? data.item.emtyaz_training.emtyaz_type.name_local
                            : data.item.emtyaz_training.emtyaz_type.name
                        }},

                        {{
                        $i18n.locale == "ar"
                            ? data.item.emtyaz_training.emtyaz_type.bylaw.name_local
                            : data.item.emtyaz_training.emtyaz_type.bylaw.name
                        }},
                        {{$i18n.locale == "en" ? 'Academic Year' : 'السنة الدراسية'}}:{{data.item.emtyaz_training.year.name}},
                        {{$i18n.locale == "en" ? 'Start Date' : 'تاريخ البداية'}}:{{data.item.emtyaz_training.starts_at}},
                        {{$i18n.locale == "en" ? 'End Date' : 'تاريخ النهاية'}} 
                      
                         : {{
                            data.item.emtyaz_training.starts_at

                        }},
                        <span v-for="status in data.item.status" :key="status">
                          <b-badge
                            :variant="getEmtyazRegistrationStatusBadgeColor(status.id)"
                            style="margin-left: 3px"
                          >
                            {{ $i18n.locale == "en" ? status.en : status.ar }}
                          </b-badge>
                        </span>
                        </span>
                    </div>
                </template>
                <template #cell(id)="data">
                  <div v-if="data.item.student">
                    <b-link
                      :to="{
                        name: 'emtyaz_advising_registration',
                        params: { id: data.item.student.id },
                      }"
                    >
                      {{ data.item.id }}
                    </b-link>
                  </div>
                </template>
                <template #cell(student)="data">
                    <div v-if="data.item.student">
                    <div class="d-flex">
                        {{
                        $i18n.locale == "ar"
                            ? data.item.student.name_local
                            : data.item.student.name
                        }}
                    </div>
                    </div>
                </template>
                <template #cell(name)="data">
                    <div v-if="data.item.emtyaz_training.emtyaz_type.bylaw">
                    <div class="d-flex">
                        {{
                        $i18n.locale == "ar"
                            ? data.item.emtyaz_training.emtyaz_type.name_local
                            : data.item.emtyaz_training.emtyaz_type.name
                        }}
                    </div>
                    </div>
                </template>
                <template #cell(mandatory)="data">
                    <div v-if="data.item.emtyaz_training.emtyaz_type.bylaw">
                    <div class="d-flex">
                        {{
                        $i18n.locale == "ar"
                            ? data.item.emtyaz_training.emtyaz_type.mandatory_local
                            : data.item.emtyaz_training.emtyaz_type.mandatory
                        }}
                    </div>
                    </div>
                </template>
                <template #cell(starts_at)="data">
                    <div v-if="data.item.emtyaz_training">
                    <div class="d-flex">
                        {{
                            data.item.emtyaz_training.starts_at

                        }}
                    </div>
                    </div>
                </template>
                <template #cell(ends_at)="data">
                    <div v-if="data.item.emtyaz_training">
                    <div class="d-flex">
                        {{
                        data.item.emtyaz_training.ends_at
                        }}
                    </div>
                    </div>
                </template>
                <template #cell(capacity)="data">
                    <div v-if="data.item.emtyaz_training">
                    <div class="d-flex">
                        {{
                        data.item.emtyaz_training.capacityCount
                        }}
                    </div>
                    </div>
                </template>
                <template #cell(year)="data">
                    <div v-if="data.item.emtyaz_training.year">
                    <div class="d-flex">
                        {{
                          data.item.emtyaz_training.year.name
                        }}
                    </div>
                    </div>
                </template>
                <template #cell(period)="data">
                    <div v-if="data.item.emtyaz_training.emtyaz_type.bylaw">
                    <div class="d-flex">
                        {{
                        data.item.emtyaz_training.emtyaz_type.period
                        }}
                    </div>
                    </div>
                </template>
            </b-table>
        </template>

        </DataTable> 
        <b-modal
                ref="my-modal"
                no-close-on-backdrop
                v-model="dueDateModel"
                :title="$t('Global.emtyaz_training')"
                size="lg"
              >
                <validation-observer ref="c">
                  <b-form :class="load ? 'disabled_all' : ''">
                    <div class="row">
                      <b-col md="6">
                        <b-form-group :label="$t('Global.start_at')" label-for="starts_at-input" invalid-feedback="Start At is required">
                          <validation-provider #default="{ errors }" name="starts_at" rules="required">
                            <b-form-datepicker
                            :label-no-date-selected="$t('Global.no_selected')"
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            id="starts_at"
                            ref="starts_at"
                            v-model="startsAt"
                            :placeholder="$t('start_at')"
                        />
                            <!-- <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>   -->
                          </validation-provider>
                          
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group :label="$t('Global.end_at')" label-for="ends_at-input" invalid-feedback="End At is required">
                          <validation-provider #default="{ errors }" name="ends_at" rules="required">
                            <b-form-datepicker
                            :label-no-date-selected="$t('Global.no_selected')"
                            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                            id="ends_at"
                            ref="ends_at"
                            v-model="endsAt"
                            :placeholder="$t('endat')"
                        />
                            <!-- <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>   -->
                          </validation-provider>
                        </b-form-group>
                        </b-col>
                       
                        <b-col md="6">
                          <b-form-group :label="$t('Global.type')" label-for="emtyaz_type-input" invalid-feedback="Start At is required">
                          <validation-provider #default="{ errors }" name="emtyaz_type" rules="required">
                          <v-select
                            :filter = "fuseSearch"
                            v-model="name.id"
                            :reduce="(val) => val.id"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="EmtiazTrainingType"
                            class="w-100 mb-2"
                            :label="getSelectLabel()"
                            @search="fetchEmtiazTraining"
                            :placeholder="$t('Global.name')"
                          >
                          <template v-slot:option="option">
                            {{ option.name }}
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                          </v-select>
                          </validation-provider>
                          </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group :label="$t('Global.capacity')" label-for="capacity">
                          <validation-provider
                            #default="{ errors }"
                            name="capacity"
                            rules="required"
                          >
                            <b-form-input
                              id="capacity"
                              type="number"
                              v-model="capacity"
                              :state="errors.length > 0 ? false : null"
                            />
                            <small
                              class="text-danger"
                              v-for="(error, index) in errors"
                              :key="index"
                            >
                              {{
                                $i18n.locale == "ar"
                                  ? `حقل ${$t("Global.capacity")} مطلوب`
                                  : error
                              }}
                            </small>
                          </validation-provider>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                          <b-form-group :label="$t('Global.academic_year')" label-for="emtyaz_year-input" invalid-feedback="Emtyaz Year is required">
                          <validation-provider #default="{ errors }" name="emtyaz_year" rules="required">
                          <v-select
                            :filter = "fuseSearch"
                            v-model="year_training.id"
                            :reduce="(val) => val.id"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="year"
                            class="w-100 mb-2"
                            :label="getSelectLabel()"
                            @search="fetchEmtiazTrainingYear"
                            :placeholder="$t('Global.academic_year')"
                          >
                          <template v-slot:option="option">
                            {{ option.start_year + ' / '+ option.end_year }}
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                          </v-select>
                          </validation-provider>
                          </b-form-group>
                      </b-col>
                  <!-- <pre>{{ EmtiazTrainingType }} , {{ name }}</pre> -->

                    </div>
                  </b-form>
                </validation-observer>
                <template #modal-footer>
                  <b-row :class="load ? 'disabled_all' : ''">
                    <b-col md="12">
                      <b-button
                        type="submit"
                        variant="primary"
                        class="mr-1"
                        @click="submitDueDate"
                      >
                        {{ $t("Global.save") }}
                      </b-button>
                      <b-button
                        type="reset"
                        variant="outline-secondary"
                        @click="cancel"
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
import TabTable from '@/views/students/student/components/TabTable';
import { required, email, regex } from '@validations';
import DataTable from '@/views/components/table/DataTable';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import vSelect from "vue-select";
import { mapActions, mapGetters } from 'vuex';
  import {
    BFormDatepicker,
    BTab,
    BTabs,
    BCard,
    BLink,
    BCol,
    BRow,
    BAvatar,
    BModal,
    BForm,
    BFormInput,
    BFormGroup,
    BDropdown,
    BDropdownItem,
    BBadge,
    BFormCheckbox,
    BTable,
    BTr,
    BTh
    } from 'bootstrap-vue';
export default {
    components: {
        BFormDatepicker,
        vSelect,
        BTab,
        BTabs,
        BCard,
        ValidationProvider,
        ValidationObserver,
        BLink,
        BCol,
        BRow,
        BAvatar,
        BModal,
        BForm,
        BFormInput,
        BFormGroup,
        BDropdown,
        BDropdownItem,
        BFormCheckbox,
        BTable,
        BTr,
        BTh,
        BBadge,
        TabTable,
        DataTable
    },
    props: {
      tabNum: null,
    },
    data(){
        return {
          mandatoryOption:[{id:0,name:'No',name_local:'لا'},{id:1,name:'Yes',name_local:'نعم'}],
          dueDateModel: false,
          id:null,
          year:[],
          year_training:{},
          name :{},
          EmtiazTrainingType:[],
          emtyaz_id:null,
          waitFetchTraining:false,
          capacity:null,
        // this.trainingType = data.emtyaz_type.name;
          startsAt : null,
          endsAt : null,
          selectedRow:
          {
            id:null,
            name:null,
            name_local:null
          },
          filter: {
            year:null,
            starts_at:null,
            ends_at:null,
            mandatory:null,
            order_direction: "DESC",
          },
        }
    },
    mounted(){
        this.init();


    },
    methods:{
      reset(){
        this.filter = {
            year:null,
            starts_at:null,
            ends_at:null,
            mandatory:null,
            order_direction: "DESC",
          };
          this.resetFilterQueryParams(this.filter);
      },
      add(){
        this.id = null;
          this.name = {'name':null,'id':null};
          this.emtyaz_id = null;
          this.year_training = {'name':null,'id':null};
          // this.trainingType = data.emtyaz_type.name;
          this.capacity = null;
          this.startsAt = null;
          this.endsAt = null;
          this.dueDateModel = true;
      },
      fetchEmtiazTraining(search,load) {
        if ( !this.waitFetchTraining) {
          this.waitFetchTraining = true;
          load(true);
          const query = {
            emtyaz_training_types: search,
          };

          this.getLookups(query).then((response) => {
            this.EmtiazTrainingType = response.success.emtyaz_training_type;
            load(false);
            this.waitFetchTraining = false;
          });
        }
      },
      fetchEmtiazTrainingYear(search,load) {
        if ( !this.waitFetchTraining) {
          this.waitFetchTraining = true;
          load(true);
          const query = {
            academic_years: search,
          };

          this.getLookups(query).then((response) => {
            this.year = response.success.academic_years;
            load(false);
            this.waitFetchTraining = false;
          });
          console.log(this.year);
        }
      },
      handleSelection() {
        alert()
        console.log('Selected value:');
        // Do something with the selected value
      },
      
        ...mapActions({
          getLookups: "app/GET_LOOKUPS",
          putCourse:'Emtyaz/putCourse',
        }),
        init(query){

            this.$store.dispatch('Emtyaz/registrations',{query : query})
            .then((res) => {
              console.log('lookup',res.meta.lookup.year);
              this.EmtiazTrainingType = res.meta.lookup.training_types;
              this.year = res.meta.lookup.year;
            })
            .catch(() => {});
        },
        openEdit(id , bylaw){
          // :to="{ name: 'emtyaz_course_add'}"
          this.$router.push({
            name:"emtyaz_course_show",
            params:{id:id , bylaw:Number(bylaw)}
          });
        },
        cancel(){
          this.id = null;
          this.name = {'name':null,'id':null};
          this.emtyaz_id = null;
          this.year_training = {'name':null,'id':null};
          // this.trainingType = data.emtyaz_type.name;
          this.capacity = null;
          this.startsAt = null;
          this.endsAt = null;
          this.dueDateModel = false;
        },
        submitDueDate() {
          let course = {
                emtyaz_type_id:this.name.id,
                mandatory:1,
                starts_at:this.startsAt,
                ends_at:this.endsAt,
                capacity:this.capacity,
                year_id:this.year_training.id
              };
        this.$refs.c.validate().then(success => {
        if(success){

          // this.checked?this.course.mandatory = 1:this.course.mandatory = 0 ;
          if(this.id){

              let payload = {course:Object.assign({}, course, {id: undefined}) , id:this.id};
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
                // this.$router.go(-1);
                this.init();
                this.dueDateModel = false;
              }).catch((error)=>{
                this.$swal({
                icon: "error",
                title:
                  this.$t('Global.errorMessage'),
                showConfirmButton: false,
                timer: 1500,
                });
              });
          }else{
            let payload = {course:Object.assign({}, course, {id: undefined}) }
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
              // this.$router.go(-1);
              this.init();
              this.dueDateModel = false;
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
          console.log('Validation errors:', this.$refs.c.errors);
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
      onEditClick(data) {
        
        this.id = data.id;
        this.name = {'name':data.emtyaz_type.name,'id':data.emtyaz_type.id};
        this.year_training = {'name':data.year? data.year.name : null ,'id':data.year ? data.year.id : null};
        this.emtyaz_id = data.emtyaz_type.id;
        // this.trainingType = data.emtyaz_type.name;
        this.capacity = data.capacity;
        this.startsAt = data.starts_at;
        this.endsAt = data.ends_at;
        console.log(this.year_training.name);
        this.dueDateModel = true;
      },
      fetchEmtyazOptions(search) {
      let query = {
        search_search_emtyaz_type_keyword: search,
      };
      if (search.length > 1) {
        this.lookupsMethod(query)
          .then((res) => {
            this.emtyazType = res.success.emtyaz_type;
          })
          .catch((err) => {
          });
      }
    },
    trash(id){
          this.$swal({
                    title: `${this.$t('Global.deleteTitle')}`,
                    text: `${this.$t('Global.deleteText')}`,
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    confirmButtonText: `${this.$t('Global.deleteBtn')}`,
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-outline-danger ml-1',
                    },
                    buttonsStyling: false,
                }).then(result => {
                    if (result.value) {
                      this.$store.dispatch('Emtyaz/deleteTrainingType',{id:id}).then(_ => {
                            this.init();
                            this.$swal({
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                                title: this.$t('Global.deleted'),
                            });
                        });
                    }
                });
       },
    },
    computed:{
        ...mapGetters({
        items:    "Emtyaz/items",
        total:    "Emtyaz/totalCourses",
        load:     "Emtyaz/load",
        options: 'Emtyaz/lookups',
        }),
        grades_fields() {
          return [
          {
              key: 'id',
              label: this.$t('Global.id'),
            },
            {
              key: 'student',
              label: this.$t('Global.student_name'),
            },
            // {
            //   key: 'name',
            //   label: this.$t('Global.name'),
            // },
            // {
            //   key: 'name_local',
            //   // label: 'name_local',
            //   label: this.$t('Global.name_local'),
            // },
            {
              key: 'emtyaz',
              label: this.$t('Global.emtyaz'),
            },
            // {
            //   key: 'period',
            //   // label: 'period',
            //   label: this.$t('Global.weeks'),
              
            // },
            {
              key: 'mandatory',
              // label: 'type',
              label: this.$t('Global.mandatory'),
            },
            // {
            //   key: 'starts_at',
            //   // label: 'type',
            //   label: this.$t('Global.start_at'),
            // },
            // {
            //   key: 'ends_at',
            //   // label: 'type',
            //   label: this.$t('Global.end_at'),
            // },
            {
              key: 'capacity',
              // label: 'type',
              label: this.$t('Global.capacity'),
            },
            // {
            //   key: 'year',
            //   // label: 'type',
            //   label: this.$t('Global.year'),
            // },
            // {
            //   key: 'status',
            //   // label: 'type',
            //   label: this.$t('Global.status'),
            // },
            // {
            //   key: 'actions',
            //   label: this.$t('Global.actions'),
            //   thClass: 'customAction',
            //   tdClass: 'customWidth',
            // },
          ];
        },
    }
}
</script>