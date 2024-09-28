<template>
  <div>
   <b-overlay :show="show" rounded="sm" no-fade>
    <edit-component 
      :name="this.name"
      :loading="false"
      :status="2"
    >
      <template #inputs>
        <validation-observer ref="form">
          <b-form @submit.stop.prevent="save" ref="form">
            <b-row>
            
               <b-col md="6">
                  <b-form-group
                    :label="$t('Section Name')"
                    label-for="mc-section"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="section"
                      rules="required"
                    >
                      <b-form-input
                        
                        id="mc-section"
                        type="text"
                        v-model="form.name"
                        :state="errors.length > 0 ? false : null"
                      />
                     
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    :label="$t('Global.name_arabic')"
                    label-for="mc-section"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="section"
                      rules="required"
                    >
                      <b-form-input
                        
                        id="mc-section"
                        type="text"
                        v-model="form.name_local"
                        :state="errors.length > 0 ? false : null"
                      />
                     
                      <ValidationErrors :frontend-errors="errors" />
                    </validation-provider>
                  </b-form-group>
                </b-col>
                 <b-col md="6">
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
                      :options="lookups.groups"
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
                  :label="$t('Global.quota')"
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
                  :label="$t('Global.over_quota')"
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
import { mapGetters, mapActions } from 'vuex'
import {
  BCard, BRow, BCol, BFormGroup, BFormInput, BFormCheckbox, BForm, BButton,  BOverlay,

} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import EditComponent from '@/views/components/table/Edit'
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate'
import {required,integer} from '@validations'
import ValidationErrors from "@/views/components/common/ValidationErrors";

export default {
  name: 'Edit',
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
    EditComponent,
    vSelect,
    ValidationProvider, 
    ValidationObserver, 
    localize,
    ValidationErrors,
      BOverlay,

  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'sections/item',
      load: 'sections/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    name() {
       if(this.item)
      {
        
           let header =   this.$t('Global.add_section') + ' - ' + this.course_code  + ' ' + this.course_name

        return header

      }
      else 
         return this.$t('Global.add_section')
       
      if(this.id && this.item.offering){
        let heading = this.$t('Global.edit_section') + ' ' + this.item.section + ' ( ' + this.item?.offering?.course?.name + ' ) ';
        // this.$store.commit('app/SET_PATH', [
        //   {name:this.$t('sections'),route:{name:'sections'}},
        //   {name:this.getTranslatedName(this.item.offering.course),route:{name:'sections', query:{offering_id:this.form.offering_id}}},
        //   {name:heading,active:true}
        // ]);
        return heading;
      }
      else{
        return this.$t('Global.add_section')
      }
    },
  },
  watch: {
    
  },
  data() {
    return {
      form:{
        quota:null,
        over_quota:null,
        group_id:null,
        name:null,
        name_local: null,
        offering_id:null
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
    }
  },
  mounted() {
    this.init()

  },
  methods: {
    ...mapActions({
      getItem: 'sections/get',
      submitItem: 'sections/put',
      getOffering:'offerings/get',
      getLookups: 'app/GET_LOOKUPS',
    }),
    init() {
       this.getLookups(this.lookupModules).then(data => {
        this.lookups = data.success
      })
      this.getOffering(this.$route.query.offering_id).then(value =>{
        this.status=value.data.status.name
        this.students_count=value.data.students_count
        this.course_name = value.data.course && this.$i18n.locale == 'en' ? value.data.course.name : value.data.course.name_local
        this.course_code = value.data?.course?.code
        this.show=false
      })
     
      if (this.id) {
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
      }
      
    },
    save(){
      if( this.$route.query.offering_id){
        this.form.offering_id=this.$route.query.offering_id
      }else{
        this.form.offering_id=this.item.offering.id

      }
      const payload = {
                    id: this.params && this.params.status == 1 ? null : this.id,
                    query: this.form,
                }
      this.submitItem(payload).then((response) => {
        if(response.status=='success'){
          this.$swal({
           icon: 'success',
           title: `${this.$t('Global.saved')}`,
            showConfirmButton: false,
            timer: 1500,
          });
             this.$router.push({name: 'sections',query:{offering_id:this.form.offering_id}})
        }
      });
    },
    cancel() {             
       this.$router.go(-1);
    },
    
  },
}
</script>

<style scoped></style>
