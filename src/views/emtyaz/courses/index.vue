<template>
    <div>
        <DataTable :total="total" :allow-search="true"
        :filter="filter" :loading="load"
        @reset="filter = {  }"
        @Refresh="init"
        :tab-num="tabNum" :params-loaded="paramsLoaded">
        <template #action>
            
            <template>
                <b-button
                    
                        v-b-tooltip.hover="$t('Global.add')"
                        variant="primary"
                        class="btn-icon"
                        @click = "add"
                >
                    <feather-icon icon="PlusIcon"/>
                </b-button>
            </template>
        </template>
        <template  #filter>
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
            <b-table   :items="items"
                      responsive striped :fields="grades_fields" primary-key="id" show-empty
                      :empty-text="$t('Global.empty_text')">
                <template #cell(actions)="data">
                    <div>
                        <feather-icon v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon"
                                      style="cursor: pointer"  @click="onEditClick(data.item)"
                                      v-if="hasPermission('edit_course')"/>
                                      {{ data.id }}
                        <feather-icon v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon"
                                      style="cursor: pointer" class="text-danger mr-1"
                                      @click="trash(data.item.id)"
                                     />
                    </div>
                    
                </template>
            </b-table>
        </template>
        </DataTable>
        <b-modal
                ref="my-modal"
                no-close-on-backdrop
                v-model="emtyazTrainingType"
                :title="$t('Global.emtyaz_training_type')"
                size="lg"
              >
                <validation-observer ref="c">
                  <b-form :class="load ? 'disabled_all' : ''">
                    <div class="row">
                      <b-col md="6">
                        <b-form-group :label="$t('Global.name')" label-for="name">
                          <validation-provider
                            #default="{ errors }"
                            name="name"
                            rules="required|english"
                          >
                            <b-form-input
                            @keypress="
                        sanitizeEnglish($event);
                        sanitizeNumber($event);
                      "
                              id="name"
                              type="text"
                              v-model="trainingType.name"
                              :state="errors.length > 0 ? false : null"
                            />
                            <small
                              class="text-danger"
                              v-for="(error, index) in errors"
                              :key="index"
                            >
                              {{
                                $i18n.locale == "ar"
                                  ? `حقل ${$t("Global.name")} مطلوب`
                                  : error
                              }}
                            </small>
                          </validation-provider>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                        <b-form-group :label="$t('Global.name_local')" label-for="name_local">
                          <validation-provider
                            #default="{ errors }"
                            name="name_local"
                            rules="required|arabic"
                          >
                            <b-form-input  @keypress="
                        sanitizeArabic($event);
                        sanitizeNumber($event);
                      "
                              id="name_local"
                              type="text"
                              v-model="trainingType.name_local"
                              :state="errors.length > 0 ? false : null"
                            />
                            <small
                              class="text-danger"
                              v-for="(error, index) in errors"
                              :key="index"
                            >
                            {{
                      $i18n.locale == "ar"
                      ? `حقل ${$t("Global.name_local_name")} مطلوب`
                      :  ` ${$t("Global.name_local_name")} is required`
                    }}
                            </small>
                          </validation-provider>
                        </b-form-group>
                        </b-col>
                       
                        <b-col md="6">
                          <b-form-group :label="$t('Global.bylaw')" label-for="emtyaz_type-input" invalid-feedback="Start At is required">
                          <validation-provider #default="{ errors }" name="emtyaz_type" rules="required">
                          <v-select
                            :filter = "fuseSearch"
                            v-model="trainingType.bylaw_id"
                            :reduce="(val) => val.id"
                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                            :options="bylawEmtiazTrainingType"
                            class="w-100 mb-2"
                            :label="getSelectLabel()"
                            @search="fetchEmtiazTrainingBylaw"
                            :placeholder="$t('Global.name')"
                            :disabled = "isEmtiazBylawDisabled"
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
                        <b-form-group :label="$t('Global.weeks')" label-for="week">
                          <validation-provider
                            #default="{ errors }"
                            name="week"
                            rules="required"
                          >
                            <b-form-input
                              id="week"
                              type="number"
                              v-model="trainingType.weeks"
                              :state="errors.length > 0 ? false : null"
                            />
                            <small
                              class="text-danger"
                              v-for="(error, index) in errors"
                              :key="index"
                            >
                              {{
                                $i18n.locale == "ar"
                                  ? `حقل ${$t("Global.week")} مطلوب`
                                  : error
                              }}
                            </small>
                          </validation-provider>
                        </b-form-group>
                      </b-col>
                      <b-col md="6">
                      <b-form-group :label="$t('Global.mandatory')" label-for="type-input" invalid-feedback="type is required">
                          <validation-provider #default="{ errors }" name="type">
                            <b-form-checkbox
                            switch
                              id="type"
                              name="type"
                              v-model="checked"
                            >
                            </b-form-checkbox>
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
                        @click="submitEmtyazTrainingType"
                      >
                        {{ $t("Global.save") }}
                      </b-button>
                      <b-button
                        type="reset"
                        variant="outline-secondary"
                        @click = "cancelEmtyazTrainingType"
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
import DataTable from '@/views/components/table/DataTable';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import vSelect from "vue-select";
import { mapActions, mapGetters } from 'vuex';
  import {
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
    BFormCheckbox,
    BTable,
    BTr,
    BTh
    } from 'bootstrap-vue';
export default {

    components: {
        ValidationProvider,
        ValidationObserver,
        vSelect,
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
        BFormCheckbox,
        BTable,
        BTr,
        BTh,
        TabTable,
        DataTable
    },
    data(){
        return {
          edit:false,
          paramsLoaded:true,
          checked:false,
          bylawEmtiazTrainingType:[],
          emtyazTrainingType:false,
          trainingType:{
            id:null,
            name:null,
            name_local:null,
            weeks:null,
            mandatory:null,
            bylaw_id:null,
          },
          mandatoryOption:[{id:0,name:'No',name_local:'لا'},{id:1,name:'Yes',name_local:'نعم'}],
          filter: {
            mandatory: null,
            order_direction: "DESC",
          },
        }
    },
    methods:{
      add(){
        this.trainingType = {
                  id:null,
                  name:null,
                  name_local:null,
                  weeks:null,
                  mandatory:null,
                  bylaw_id:this.trainingType.bylaw_id,
                };
          this.edit = false,
          this.checked = false;
          this.emtyazTrainingType = true;
      },
      ...mapActions({
          getLookups: "app/GET_LOOKUPS",
          putTrainingType:'Emtyaz/putTrainingType',
        }),
        cancelEmtyazTrainingType(){
          this.trainingType = {
                  id:null,
                  name:null,
                  name_local:null,
                  weeks:null,
                  mandatory:null,
                  // bylaw_id:this.trainingType.bylaw_id,
                };
          this.checked = false;
          this.emtyazTrainingType = false;
        },
        onEditClick(data) {
          this.trainingType.id = data.id;
          this.trainingType.name = data.name;
          this.trainingType.name_local = data.name_local;
          this.trainingType.weeks = data.period;
          this.trainingType.mandatory = data.mandatory;
          this.trainingType.bylaw_id = data.bylaw_id;
          this.checked = data.mandatory === 'Yes' ? true : false;
          this.emtyazTrainingType = true;
          this.edit=true;
        },
        
        fetchEmtiazTrainingBylaw(search,load) {
        if ( !this.waitFetchTraining) {
          this.waitFetchTraining = true;
          load(true);
          const query = {
            bylaw_emtyaz_training_types: search,
          };

          this.getLookups(query).then((response) => {
            this.bylawEmtiazTrainingType = response.success.bylaw_emtyaz_training_type;
            load(false);
            this.waitFetchTraining = false;
          });
        }
      },
      submitEmtyazTrainingType() {
        this.$refs.c.validate().then(success => {
        if(success){
          // this.checked?this.course.mandatory = 1:this.course.mandatory = 0 ;
          if(this.trainingType.id){
              this.trainingType.mandatory = this.checked  ? 1 : 0
              let payload = {course:Object.assign({}, this.trainingType, {id: undefined}) , id:this.trainingType.id};
              this.putTrainingType(payload).then(() => {
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
                this.trainingType = {
                  id:null,
                  name:null,
                  name_local:null,
                  weeks:null,
                  mandatory:null,
                  bylaw_id:null,
                }
                this.init({ bylaw_id: this.$route.params.id ? this.$route.params.id : null, otherParams: 'value' });
                this.emtyazTrainingType = false;
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
            this.trainingType.mandatory = this.checked  ? 1 : 0
            let payload = {course:Object.assign({}, this.trainingType, {id: undefined}) }
            this.putTrainingType(payload).then(() => {
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
              this.init({ bylaw_id: this.$route.params.id ? this.$route.params.id : null, otherParams: 'value' });
              this.emtyazTrainingType = false;
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
              error,
          showConfirmButton: false,
          timer: 1500,
          });
        }
        });
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

        init(query){

            query.bylaw_id = this.$route.params.id?this.$route.params.id:null
            this.$store.dispatch('Emtyaz/courses',{query : query})
            .then((res) => {
              this.paramsLoaded = false;
              this.bylawEmtiazTrainingType = res.meta.lookup.bylaw_emtyaz_training_type;
              this.trainingType.bylaw_id = res.data[0].bylaw_id;
            })
            .catch(() => {})
        },
        openEdit(id , bylaw){
          // :to="{ name: 'emtyaz_course_add'}"
          this.$router.push({
            name:"emtyaz_course_show",
            params:{id:id , bylaw:Number(bylaw)}
          });

        }
        
    },
    mounted(){
        this.init({ bylaw_id: this.$route.params.id ? this.$route.params.id : null, otherParams: 'value' });
    },
    computed:{
      ...mapGetters({
      items:    "Emtyaz/items",
      total:    "Emtyaz/totalCourses",
      load:     "Emtyaz/load",
    }),
    isEmtiazBylawDisabled() {
          // Disable the second v-select if the first one is not selected
          return !this.edit;
        },
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
          key: 'mandatory',
          // label: 'type',
          label: this.$t('Global.mandatory'),
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
    }
}
</script>