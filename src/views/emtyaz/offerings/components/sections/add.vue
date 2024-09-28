<template>
  <div class="new_edit">
  
     <b-overlay :show="show" rounded="sm" no-fade>

    <edit-component  :add="params && params.status == 1" >
    <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form @submit.stop.prevent="save" ref="form">
            <b-row>
            
               <!--  <b-col md="6">
                  <b-form-group
                    :label="$t('english_name')"
                    label-for="mc-section"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="section"
                      rules="required|english"
                    >
                      <b-form-input
                        
                        id="mc-section"
                        type="text"
                        v-model="form.name"
                        :state="errors.length > 0 ? false : null"
                        class="left_right"
                      />
                     
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
                </b-col>  -->
              <!--  <b-col md="6">
                  <b-form-group
                    :label="$t('Global.name_arabic')"
                    label-for="mc-section"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="section"
                      rules="arabic"
                    >
                      <b-form-input
                        
                        id="mc-section"
                        type="text"
                        v-model="form.name_local"
                        :state="errors.length > 0 ? false : null"
                        class="right_left"
                      />
                     
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
                </b-col>  -->
             <b-col md="6" lg="12" class="mb-1">
             <div class="demo-inline-spacing">
                <b-form-radio
                  v-model="form.type"
                  name="some-radio9"
                  value="0"
                  class="custom-control-primary"
                >
                 {{ $t("Global.add_multi_seactions") }} ({{ $t("Global.default") }})
                </b-form-radio>
                 <b-form-radio
                  v-model="form.type"
                  name="some-radio9"
                  value="1"
                  class="custom-control-primary"
                  :disabled="noGroups"

                >
                   {{ $t("Global.add_sections_to_group") }}
                </b-form-radio>
             </div>
             </b-col>
              <b-col md="6" v-if="form.type==0">
                <b-form-group
                  :label="$t('Global.num_group')"
                  label-for="mc-group"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="num_groups"
                    rules="number|required|positive"
                  >
                    <b-form-input
                      id="mc-group"
                      v-model="form.num_groups"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                    <ValidationErrors  :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'num_groups')" />

                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6" v-if="form.type==1">
                <b-form-group
                  :label="$t('Group Name')" 
                  label-for="mc-group"
                >
                  <validation-provider
                    #default="{ errors }"
                      name="group"
                      rules="required"
                  >
                    <v-select
                    
                       id="mc-group"
                       v-model="form.group_id"
                      :filter="fuseSearch"
                      :options="offeringGroups"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :reduce="val => val.id"
                      
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    />
                    
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.num_section_per_group')"
                  label-for="mc-section"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="num_sections"
                    rules="number|required|positive"
                  >
                    <b-form-input
                      id="mc-section"
                      v-model="form.num_sections"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                    <ValidationErrors  :frontend-errors="errors"  />

                  </validation-provider>
                </b-form-group>
                </b-col>
             

              <b-col md="6">
                <b-form-group
                  :label="$t('Global.quota_per_section')"
                  label-for="mc-quota"
                >
                  <validation-provider
                  #default="{ errors }"
                  name="quota"
                  rules="required|integer|positive"
                >
                  <b-form-input 
                    id="mc-quota"
                    dir=" $i18n.locale == 'en'? ltr : rtl"
                    v-model="form.quota"
                    :state="errors.length > 0 ? false : null"
                  />
                 
                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>

              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.over_quota_per_section')"
                  label-for="mc-over-quota"
                > 
                  <validation-provider
                  #default="{ errors }"
                  name="over quota"
                  rules="required|integer|positive"
                >
                  <b-form-input
                    id="mc-over-quota"
                    dir=" $i18n.locale == 'en'? ltr : rtl"
                    v-model="form.over_quota"
                    :state="errors.length > 0 ? false : null"
                  />
                    <ValidationErrors :frontend-errors="errors" />
                  </validation-provider>
                </b-form-group>
              </b-col>
              
               <b-col cols="12">
                <hr />
              </b-col>
              <!-- submit and reset -->
              
                    <b-col md="12">
                        <b-button
                          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                          type="submit"
                          variant="primary"
                          class="mr-1"
                        >
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button
                          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                          type="reset"
                          variant="outline-secondary"
                          @click="cancel"
                        >
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </b-col>
            </b-row>
          </b-form>
        </validation-observer>
        
      </template>
    </edit-component>
     </b-overlay>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  BButton,
  BCard,
  BCardGroup,
  BCardText,
  BCardHeader,
  BCol,
  BForm,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BListGroup,
  BListGroupItem,
  BRow,
  BFormTextarea,
 BOverlay,
 BFormRadio ,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import draggable from "vuedraggable";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from '@/views/components/common/ValidationErrors';
import {required,integer} from '@validations'
import { EventBus } from '@/main';

export default {
  title: "Edit",
  components: {
    BCard,
    BCol,
    BCardText,
    BFormTextarea,
    BCardGroup,
    BCardHeader,
    BListGroup,
    BListGroupItem,
    BRow,
    draggable,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    ToastificationContent,
    ValidationProvider,
    ValidationObserver,
    localize,
    BOverlay,
    ValidationErrors,
    BFormRadio ,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      // item: 'sections/item',
       item: 'sections/item',
      load: 'sections/load',
    }),
    id() {
      //if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
   name() {
     /*   if(this.item)
      {
        
           let header =   this.$t('Global.add_section') + ' - ' + this.course_code  + ' ' + this.course_name

        return header

      }
      else  */
         return this.$t('Global.add_section')
       
    
    },
   /*  query() {
      const data = {
        bylaw_id: this.form.bylaw_id,
        instructors: true,
      };
      return data;
    }, */
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
  },
  data() {
    return {
      form:{
        offering_id:null,
        type: 0,
        num_groups: null, //@multi section
        group_id:null, //@single section add
        num_sections:null,
        quota:null,
        over_quota:null,
      },
      status:null,
      students_count:0,
      course_name: null,
      course_code: null,
      show: true,
      lookups: [],
      lookupModules: {
       groups:true
      },
      loading: false,
      offeringGroups:[],
      noGroups:true,
      errorsdata: {},

      
      
    };
  },
  mounted() {
    this.init();
    //this.getItem(this.$route.params.id)
    //this.getLookups(this.lookupModules);
    //this.getItem(this.id);
  },

  methods: {
    ...mapActions({
      getItem: 'sections/get',
      submitItem: 'sections/addSection',
      getOffering:'offerings/get',
      getLookups: 'app/GET_LOOKUPS',
      groupsLookup:'offerings/groupsLookup',
    }),
   
      init() {
       this.getLookups(this.lookupModules).then(data => {
        this.lookups = data.success
      })
      this.groupsLookup(this.$route.params.id).then(response=>{
        if(response.length > 0)
          {
            this.noGroups = false
          }
        this.offeringGroups=response
       
      })
      
      this.getOffering(this.$route.params.id).then(value =>{
        this.status=value.data.status.name
        this.students_count=value.data.students_count
        this.course_name = value.data.course && this.$i18n.locale == 'en' ? value.data.course.name : value.data.course.name_local
        this.course_code = value.data?.course?.code
        this.show=false
      })
     
      /* if (this.id) {
        this.getItem(this.id).then((data)=>{
          this.form.offering_id=this.item.offering.id;
          this.form.quota=this.item.quota;
          this.form.over_quota=this.item.over_quota;
          this.form.section=this.item.section;
          this.form.group=this.item.group;

        });
      }else{
        this.form={
          offering_id:null
        };
        this.$refs.form.reset();
      } */
      
    },
   save(){
       this.$refs.simpleRules.validate().then((success) => {
       if (success) {
         if( this.$route.params.id){
        this.form.offering_id=Number(this.$route.params.id)
      }else{
        this.form.offering_id=Number(this.item.offering.id)
      }
      var msg 
      if(this.form.type == 0)
      {
        if(this.$i18n.locale == 'en')
        {
          msg = 'You will add ' + this.form.num_groups + ' '+ 'Group and '+ this.form.num_sections + ' '+ 'section'+ ' ' + 'in each Group'
        }
        else
        {
          msg =  'سوف تضيف ' + this.form.num_groups + ' '+ 'مجموعة و '+ this.form.num_sections + ' '+ 'فصل'+ ' ' + 'في كل مجموعة'
        }

      }
      else if(this.form.type == 1) {
        if(this.$i18n.locale == 'en')
        {
          msg ='You will add ' +  this.form.num_sections + ' '+ 'sections in Group' 
        }
        else {
          msg = 'سوف تضيف ' +  this.form.num_sections + ' '+ 'فصل في المجموعة'
        }
      }
      const payload ={ query: this.form}
      this.$swal({
          title: `${this.$t('Global.deleteTitle')}`,
          text: msg  ,
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: `${this.$t('Global.cancel')}`,
          confirmButtonText: `${this.$t('Global.yes')}`,
          customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
                },
          buttonsStyling: false,
            }).then(result => {
              if (result.value) {
                this.show = true
                  this.submitItem(payload.query).then((response) => {
                  if(response.status=='success'){
                    this.$swal({
                    icon: 'success',
                    title: `${this.$t('Global.saved')}`,
                      showConfirmButton: false,
                      timer: 1500,
                    });
                    if (this.inline) {
                      EventBus.$emit('changeIt', 'cancel');
                        this.$emit("hide");
                      }
                      // this.$router.push({name: 'sections',query:{offering_id:this.form.offering_id}})
                  }
                });
                    }
                });
                this.show = false
      
     

       }
       })
     
    },
    cancel() {
      if (this.inline) {
        EventBus.$emit('changeIt', 'cancel');
        return this.$emit("hide");
      }
      //this.$router.push({name: 'instructors'})
    },
    
  },
};
</script>

<style scoped></style>
