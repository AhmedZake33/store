<template>
    <b-overlay :show="show" rounded="sm" no-fade>
   
       <div>
           <add v-if="status =='Draft' && hasPermission('add_sections') && params.status == 2"
               :inline="true" :params="params" @hide="params.status = 3"/>
   
          <!--  <addMulti v-else-if="status =='Draft' && hasPermission('add_sections') && params.status == 4"
               :inline="true" :params="params" @hide="params.status = 3"/> -->
   
           <EditSection v-else-if="status =='Draft' && hasPermission('edit_sections') && params.status == 5"
               :inline="true" :params="params" @hide="params.status = 3"/>
   
           <DataTable
                v-else
               :total="total"
               :filter="filter"
               :loading="loading"
               @Refresh="refresh"
               :allow-search="lookups && !lookups.selected_offering"
               :allowActions="true"
               :titleFontSize="16"
       
     >
           <template
                       v-if="lookups && !lookups.selected_offering "
                       #filter
                       >
                       <b-col
                           cols="12"
                           md="4"
                       >
                           <v-select
                           v-model="filter.term_id"
                           :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                           :options="lookups.terms"
                           class="w-100 mb-2"
                           :reduce="(val) => val.id"
                           :placeholder="$t('Global.term')"
                           >
                           <template v-slot:option="option">
                               {{
                               $i18n.locale == 'ar'
                                   ? option.name_local
                                   : option.name
                               }}
                           </template>
                           <template
                               #selected-option="{
                               name,
                               name_local
                               }"
                           >
                               <div style="display: flex; align-items: baseline">
                               <strong
                                   v-if="$i18n.locale == 'ar'"
                               >{{ name_local }} </strong>
                               <strong
                                   v-else
                               >{{ name }}</strong>
                               </div>
                           </template>
                           <template #no-options>
                           {{ $t('noMatching') }}
                           </template>
                           </v-select>
                       </b-col>
                       <b-col
                           cols="12"
                           md="4"
                       >
                           <v-select
                           v-model="filter.faculty_id"
                           :filter="fuseSearch"
                           :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                           :options="lookups.faculties"
                           class="w-100 mb-2"
                           :reduce="(val) => val.id"
                           :placeholder="'Faculties'"
                           >
                           <template v-slot:option="option">
                               {{
                               $i18n.locale == 'ar'
                                   ? option.faculty_name_local
                                   : option.faculty_name
                               }}
                           </template>
                           <template
                               #selected-option="{
                               faculty_name,
                               faculty_name_local,
                               }"
                           >
                               <div style="display: flex; align-items: baseline">
                               <strong
                                   v-if="$i18n.locale == 'ar'"
                               >{{ faculty_name_local }}</strong>
                               <strong
                                   v-else
                               >{{ faculty_name }}</strong>
                               </div>
                           </template>
                           <template #no-options>
                   {{ $t('noMatching') }}
                   </template>
                       </v-select>
                           </b-col>
                           <b-col
                               cols="12"
                               md="4"
                           >
                               <v-select
                               v-model="filter.bylaw_id"
                               :filter="fuseSearch"
                               :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                               :options="lookups.bylaws"
                               class="w-100 mb-2"
                               :reduce="(val) => val.id"
                               :placeholder="$t('Global.bylaws')"
                               >
                               <template v-slot:option="option">
                                   {{
                                   $i18n.locale == 'ar'
                                       ? option.bylaw_name_local
                                       : option.bylaw_name
                                   }}
                               </template>
                               <template
                                   #selected-option="{
                                   bylaw_name,
                                   bylaw_name_local,
                                   faculty_name,
                                   faculty_name_local,
                                   }"
                               >
                                   <div style="display: flex; align-items: baseline">
                                   <strong
                                       v-if="$i18n.locale == 'ar'"
                                   >{{ bylaw_name_local }} - {{ faculty_name_local }}</strong>
                                   <strong
                                       v-else
                                   >{{ bylaw_name }} - {{ faculty_name }}</strong>
                                   </div>
                               </template>
                               <template #no-options>
                       {{ $t('noMatching') }}
                       </template>
                   </v-select>
                       </b-col>
                       <b-col
                           cols="12"
                           md="4"
                       >
                           <v-select
                           v-model="filter.program_id"
                           :filter="fuseSearch"
                           :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                           :options="lookups.programs"
                           class="w-100 mb-2"
                           :reduce="(val) => val.id"
                           :placeholder="$t('Global.programs')"
                           >
                           <template v-slot:option="option">
                               {{
                               $i18n.locale == 'ar' ? option.program_name_local : option.program_name
                               }}
                           </template>
                           <template
                               #selected-option="{
                               program_name,
                               program_name_local
                               }"
                           >
                               <div style="display: flex; align-items: baseline">
                               <strong
                                   v-if="$i18n.locale == 'ar'"
                               >{{ program_name }} </strong>
                               <strong
                                   v-else
                               >{{ program_name_local }}</strong>
                               </div>
                           </template>
   
                           <template #no-options>
                   {{ $t('noMatching') }}
                   </template>
                   </v-select>
                       </b-col>
                       <b-col
                           cols="12"
                           md="4"
                       >
                           <v-select
                           v-model="filter.level_id"
                           :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                           :options="lookups.levels"
                           class="w-100 mb-2"
                           :reduce="(val) => val.id"
                           :placeholder="$t('Global.level')"
                           >
                           <template v-slot:option="option">
                               {{
                               $i18n.locale == 'ar'
                                   ? option.name_local
                                   : option.name
                               }}
                           </template>
                           <template
                               #selected-option="{
                               name,
                               name_local
                               }"
                           >
                               <div style="display: flex; align-items: baseline">
                               <strong
                                   v-if="$i18n.locale == 'ar'"
                               >{{ name_local }} </strong>
                               <strong
                                   v-else
                               >{{ name }}</strong>
                               </div>
                           </template>
                           <template #no-options>
                   {{ $t('noMatching') }}
                   </template>
                   </v-select>
                       </b-col>
           </template>
           <template #action>
                       
                     <!--   <b-button v-if="status =='Draft' && hasPermission('add_sections')"
                           class="btn-icon mb-1 mr-1"
                           variant="primary"
                           v-b-tooltip.hover="$t('Global.add_multi_seactions')"
                           @click="params = {status:4, offering_id: offering_id}; addMultiClicked()"
                       >
                           <feather-icon
                           icon="GridIcon"
                           />
                       </b-button>
                       <b-button v-else
                           class="btn-icon disabled_all mb-1 mr-1"
                           variant="primary"
                           style="cursor:not-allowed;"    
                           v-b-tooltip.hover="$t('Global.add_multi_seactions')"
                       >
                           <feather-icon
                           icon="GridIcon"
                           />
                       </b-button> -->
   
                       <b-button v-if="status =='Draft' && hasPermission('add_sections')"
                           class="btn-icon mb-1 "
                           variant="primary"
                           @click="params = {status:2, offering_id: offering_id}; addClicked()"
                            v-b-tooltip.hover="$t('Global.add')"
                       >
                           <feather-icon
                           icon="PlusIcon"
                           />
                       </b-button>
                       
                       <b-button v-else
                           class="btn-icon disabled_all mb-1 "
                           variant="primary"
                       v-b-tooltip.hover="$t('Global.add')"
                       style="cursor:not-allowed;"
                       >
                           <feather-icon
                           icon="PlusIcon"
                           />
                       </b-button>
                       
           </template>
           <template #customTable>
                       <b-table
                           :sort-desc.sync="filter.order_direction" :sort-by.sync="filter.order_by"
                           class="position-relative font-small-2"
                           :items="items"
                           responsive
                           :fields="fields"
                           primary-key="id"
                           show-empty
                           :empty-text="$t('Global.empty_text')"
                       >
                      
                           <template #cell(section)="data">
                               <div
                                   v-if="$i18n.locale == 'en'"
                                   class="font-weight-bold d-block"
                               >
                                   {{ data.item.name ? data.item.name: data.item.name_local ? data.item.name_local: '-' }}
                               </div>
                               <span
                                   v-if="$i18n.locale == 'ar'"
                                   class="font-small-4"
                               >
                               {{ data.item.name_local ? data.item.name_local:data.item.name ? data.item.name: '-' }}
                               </span>
                           </template>
                           <template #cell(group)="data">
                               <span
                                   v-if="$i18n.locale == 'en'"
                                   class="font-weight-bold d-block"
                               >
                                   {{ data.item.group ? data.item.group.name:  data.item.group.name_local ?  data.item.group.name_local :'-' }}
                               </span>
                               <span
                                   v-if="$i18n.locale == 'ar'"
                                   class="font-small-4"
                               >
                               {{ data.item.group ? data.item.group.name_local:  data.item.group.name ?  data.item.group.name :'-' }}
                               </span>
                           </template>
                           <template #cell(actions)="data">
                           <div>
                               <b-link
                                   :to="{ name: 'registrations', query: { section_id: data.item.id } }">
                               <feather-icon
                                   icon="UsersIcon"
                                   v-b-tooltip.hover="$t('Global.registrations')"
                                   class="text-primary"
                               />
                               </b-link>
                               <b-link v-if="hasPermission('edit_sections') && status =='Draft'" 
                               @click="params = {status:5, offering_id: offering_id, section_id: data.item.id}; editClicked(data.item)" >
                               <feather-icon
                                   icon="EditIcon"
                                   v-b-tooltip.hover="$t('Global.edit')"
                                   class="text-primary"
                               />
                               </b-link>
                               <b-link v-else>
                               <feather-icon
                                   icon="EditIcon"
                                   v-b-tooltip.hover="$t('Global.edit')"
                                   class="text-secondary"
                                   style="cursor:not-allowed;"
                               />
                               </b-link>
                               <b-link v-if="hasPermission('delete_sections')">
                               <feather-icon
                                   icon="Trash2Icon"
                                   v-b-tooltip.hover="$t('Global.delete')"
                                   class="text-danger"
                                   @click="deleteItem(data.item.id)"
                               />
                               </b-link>
                               <b-link v-else>
                               <feather-icon
                                   icon="Trash2Icon"
                                   v-b-tooltip.hover="$t('Global.delete')"
                                   class="text-secondary"
                                   style="cursor:not-allowed;"
                               />
                               </b-link>
                           </div>
                           </template>
                       </b-table>
           </template>
          </DataTable>
          
       </div>
    </b-overlay>
   </template>
   
   <script>
       import {
           BCard,
           BRow,
           BCol,
           BFormInput,
           BButton,
           BTable,
           BMedia,
           BAvatar,
           BLink,
           BBadge,
           BDropdown,
           BDropdownItem,
           BPagination,
           BOverlay,
           BCardHeader,
           BCardBody,
           BModal,
           VBModal,
           BPopover,
       } from 'bootstrap-vue'
       import {mapActions, mapGetters} from 'vuex'
       import Ripple from 'vue-ripple-directive'
       import vSelect from 'vue-select'
       import Edit from '@/views/academic_settings/programs/edit'
       import Add from '@/views/study/offerings/components/sections/add';
       import addMulti from '@/views/study/offerings/components/sections/addMulti-old.vue'
       import EditSection from '@/views/study/offerings/components/sections/edit.vue'
       import DataTable from '@/views/components/table/DataTable'
       import { EventBus } from '@/main';
   
   
       export default {
           name: 'Programs',
           components: {
               DataTable,
               BCard,
               Add,
               vSelect,
               BRow,
               BCol,
               Edit,
               BOverlay,
               BCardHeader,
               BCardBody,
               BFormInput,
               BButton,
               BTable,
               BMedia,
               BAvatar,
               BLink,
               BBadge,
               BDropdown,
               BDropdownItem,
               BPagination,
               BModal,
               VBModal,
               BPopover,
               addMulti,
               EditSection,
           },
           directives: {
               'b-modal': VBModal,
               Ripple,
           },
           props: {
               term_id: null,
               offering_id: null,
               program_id: null,
               level_id: null,
               title: String,
               bylaw_id: null,
               course_id: null,
               faculty_id: null,
               action_hide: Boolean,
               //noStatus: Boolean,
               inline: false,
               faculty:Object,
               faculty_id_course: null,
               instructors:null,
           },
           data() {
               return {
                   //filter: {export: 0, removed: 0, bylaw_id: null},
                   params: {},
                   newInstructors:null,
                   filter: { removed: 0 },
                   offering_id:0,
                   status:null,
                   students_count: null,
                   loading: false,
                   show: true,
                   changeName:null,
   
               }
           },
           computed: {
               ...mapGetters({
                   items: 'sections/items',
                   total: 'sections/total',
                   load: 'sections/load',
                   lookups: 'sections/lookups',
               }),
               fields() {
                   let fields = [
                       /* {
                       key: 'id',
                       sortable: true,
                       label: this.$t("Global.id"),
                       }, */
                       {
                       key: 'section',
                       sortable: true,
                       label: this.$t("Global.section"),
                       },
                       {
                       key: 'group',
                       sortable: true,
                       label: this.$t("Global.group"),
                       },
                   
                       {
                       key: 'quota',
                       sortable: true,
                       label: this.$t("Global.quota"),
                       },
                       {
                       key: 'over_quota',
                       sortable: true,
                       label: this.$t("Global.over_quota"),
                       },
                       {
                       key: 'taken',
                       sortable: false,
                       label: this.$t("Global.taken"),
                       },
                       {
                       key: 'actions',
                       thClass: 'customAction',
                       tdClass: 'customWidth',
                       label: this.$t("Global.actions"),
                       },
         ];
         if(this.lookups && this.lookups.selected_offering == null){
           fields =
               [
                 {
                   key: 'id',
                   sortable: true,
                 },
                 {
                   key: 'offering',
                   sortable: true,
                 },
                 {
                   key: 'level',
                   sortable: true,
                 },
                 ...fields
               ];
         }
         return fields;
   
             },
             filteredName(){
               if(this.lookups && this.lookups.selected_offering != null){
                   // to load breadcrump student code
                   //this.$store.commit('app/UPDATE_PAGE_DETAILS', {...this.lookups.selected_offering.course,active:true}, {root: true});
                   // this.$store.commit('app/SET_PATH', [
                   //     {name:this.$t('sections'),route:'sections'},
                   //     {name:this.titlePage,active:true}
                   // ]);
               // return this.$t('offering')+": "+this.getTranslatedName(this.lookups.selected_offering.course);
                   return this.titlePage
               }else{
                   return '';
               }
               },
               titlePage(){
                       return this.lookups.selected_offering.course.code + " ( " + this.lookups.selected_offering.course.bylaw.code + " ) :" + this.getTranslatedName(this.lookups.selected_offering.course) + " - " +this.getTranslatedName(this.lookups.selected_offering.term) + ' ( ' +this.lookups.selected_offering.id + ' ) '
   
               },
   
               getInstructors()
               {
               if(this.newInstructors)
               {
                   return this.newInstructors
               }
               let instructors = this.instructors
               return instructors
               }
               
           },
            mounted() {
               this.getOffering(this.$route.params.id).then(value =>{
               this.status=value.data.status.name
               this.students_count=value.data.students_count
               this.show=false
           })
               this.getInstructors
               
           },
           methods: {
               ...mapActions({
                   getSections: 'sections/sections',
                   deleteSection: 'sections/remove',
                   getOffering:'offerings/get',
   
               }),
                addClicked() {
                   this.changeName = "addSection"
                   EventBus.$emit('changeIt', this.changeName);
                      },
                addMultiClicked() {
                   this.changeName = "addMultiSection"
                   EventBus.$emit('changeIt', this.changeName);
                      },
                editClicked(section) {
                   this.changeName = "editSection"
                   EventBus.$emit('changeIt', this.changeName);
                   if(this.$i18n.locale=='en')
                   { 
                       let name = section.name? section.name :section.name_local?section.name_local: '-' 
                       EventBus.$emit('passData', name);
                   }
                   else if(this.$i18n.locale=='ar')
                   {
                       let name = section.name_local? section.name_local :section.name?section.name: '-' 
                       EventBus.$emit('passData', name);
                   }
                  
                      },
              
              
              refresh(query) {
               this.loading=true
               if (this.bylaw_id) {
                   query = { ...query, bylaw_id: this.bylaw_id }
               }
               if (this.term_id) {
                   query = { ...query, term_id: this.term_id }
               }
               if (this.program_id) {
                   query = { ...query, program_id: this.program_id }
               }
               if (this.faculty_id) {
                   query = { ...query, faculty_id: this.faculty_id }
               }
               if (this.$route.params && this.$route.params.id) {
                   query = { ...query, offering_id: this.$route.params.id }
                   this.offering_id=this.$route.params.id
                   
               }
               this.getSections({ query }).then(_=>{
                   this.loading = false
               })
               },
               deleteItem(id) {
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
                       this.deleteSection(id).then(_ => {
                           this.refresh()
                           this.$swal({
                           icon: 'success',
                           title: this.$i18n.locale=='en'? 'Deleted!' : 'تم المسح',
                           text:  this.$i18n.locale=='en'? 'ٍSection has been deleted.' : 'تم مسح الفصل',
                           showConfirmButton: false,
                           timer: 1500,
                           })
                       })
                       .catch((error) => {
                           let message =
                           error.response.data.errors.length > 0
                               ? error.response.data.errors[0].title
                               : this.$t("Global.errorMessage");
                           this.$swal({
                           icon: "error",
                           text: message,
                           showConfirmButton: true,
                           timer: 3000,
                           });
                       });
                       }
                   })
       },
              
           },
           watch: {
              /*  'filter.faculty_id'() {
                   this.filter.bylaw_id = 0;
               } */
           }
       }
   </script>
   
   <style lang="scss" scoped>
       .per-page-selector {
           width: 90px;
       }
   </style>
   
   <style lang="scss">
       @import '@core/scss/vue/libs/vue-select.scss';
   </style>
   