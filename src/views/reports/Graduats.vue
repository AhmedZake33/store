<template>
    <b-overlay :show="load" rounded="sm">
    <b-row>
        
        <b-col sm="12" >
            <b-row class="my-2 d-flex text-capitalize justify-content-between w-100 align-items-center ">
                <div class="mx-2 my-1">
                    <h3 class="m-0">{{ this.$t("Global.undergraduated_graduated_report") }}</h3>
                </div>
                <div>
                    
                  <b-button @click="downloadExcel($i18n.locale,'UG')" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_excel')" variant="primary">
              <feather-icon icon="FileTextIcon" />
            </b-button>
              <b-button  @click="downloadPDF($i18n.locale)" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_pdf')"
                        variant="primary" >
                <feather-icon icon="FileTextIcon"/>
                
              </b-button>
                  <b-button @click="toggleYear = !toggleYear" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.filter')"
                        variant="primary">
                        <feather-icon icon="SlidersIcon" />
                  </b-button>
                  <b-button  v-b-tooltip.hover="$t('Global.reset')" class="btn-icon ml-1" variant="primary" @click="reset">
                    <feather-icon icon="RotateCwIcon" />
                  </b-button>
                </div>
            </b-row>
            <b-row v-if="toggleYear"
          class="my-2 years d-flex text-capitalize justify-content-start w-100 align-items-left ">

          <b-col cols="12" md="4">

          <v-select  :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="type" :options="types" class="w-100 bg-white" clearable label="start_year"
              :reduce="(val) => val.id" :placeholder="$t('Global.type')">
               <template   v-slot:option="option">
                <span >
                  {{  option.name }}
                </span>
                
              </template> 
               <template #selected-option="{ name}">
                {{  name }}
              </template>
              <template #no-options>
                {{ $t('noMatching') }}
              </template>
            </v-select>

            
          </b-col>



        </b-row>
        </b-col>
        
            <b-col sm="12">
                <TabTable   
                       :load="load"
                      :items="tableDataWithOverallSum" :fields="[
                
                        { key: 'faculty', label: this.$t('Global.faculty') },
                        { key: 'total_students', label: this.$t('Global.total_undergraduate_graduate') },
                        
                    
                    ]" :inner="[
                        {key: 'bylaw', label: this.$t('Global.bylaw')},
                        { key: 'program', label: this.$t('Global.programs') },
                        { key: 'total_students', label: this.$t('Global.total_students') },
                        
            
              ]" />
            </b-col>
       
        
    </b-row>
    <b-row>
        
          <b-col sm="12" >
             <b-row class="my-2 d-flex text-capitalize justify-content-between w-100 align-items-center ">
                 <div class="mx-2 my-1">
                     <h3 class="m-0">{{ this.$t("Global.postgraduated_graduated_report") }}</h3>
                 </div>
                 <div>
                  <b-button @click="downloadExcel($i18n.locale,'PG')" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_excel')" variant="primary">
              <feather-icon icon="FileTextIcon" />
            </b-button>
                 </div>
             </b-row>
         </b-col>
        
             <b-col sm="12">
                 <TabTable   
                        :load="load"
                       :items="tableDataWithOverallSumPG" :fields="[
                
                 { key: 'faculty', label: this.$t('Global.faculty') },
                 { key: 'total_students', label: this.$t('Global.total_postgraduate_graduate')},
                
               
               ]" :inner="[
                 { key: 'program', label: this.$t('Global.bylaw') },
                 { key: 'total_students', label: this.$t('Global.program')},
               ]" />
             </b-col>
       
        
     </b-row> 
    </b-overlay>
</template>

<script>
    import {
        BTabs,
        BTab,
        BCard,
        BCol,
        BRow,
        BBadge,
        BAlert,
        BLink,
        BAvatar,
        BCardBody,
        BButtonGroup,
        BButton,
        BModal,
        BInputGroup,
        BFormTextarea,
        BImg,
        BFormGroup,
        BOverlay,
        BForm,
    } from 'bootstrap-vue'
    import TabTable from "@/views/reports/components/TabTableGrad";
    import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
    import vSelect from 'vue-select';
    import request from '@/utils/request';
    import fileDownload from 'js-file-download';

    export default {
        name: 'Show',
        components: {
            vSelect,
            TabTable,
            BTabs,
            BTab,
            BOverlay,
            BCard,
            BCol,
            BRow,
            BBadge,
            BAlert,
            BLink,
            BCardBody,
            BAvatar,
            BButtonGroup,
            BButton,
            BImg,
            BModal,
            BInputGroup,
            BFormTextarea,
            BFormGroup,
            BForm,
        },
        data() {
            return {
                faculties : '',
                type: '',
                facultiesPG : '',
                facultiesUG : '',
                types: [],
                toggleYear: false,
                load : true
            }
        },
        mounted() {
            
            this.getFaculties()
            this.getTypes()
        },
        methods: {

 
          reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
          calculateOverallSum() {
            let totalStudentsSum = 0;
            if (Array.isArray(this.facultiesUG)) {
              for (const faculty of this.facultiesUG) {
                totalStudentsSum += faculty.graduate;
              }
            }
            return { total_students: totalStudentsSum };
          },
          calculateOverallSumPG() {
            let totalStudentsSum = 0;
            if (Array.isArray(this.facultiesPG)) {
              for (const faculty of this.facultiesPG) {
                totalStudentsSum += faculty.graduate;
              }
            }
            return { total_students: totalStudentsSum };
          },

            slideToggle() {
              $(".years").slideToggle();
              // if (year) {
              //   url = `/reports/students?year=${year}`
              // }
            },
            async getTypes() {
              await request.get("/reports/graduatedYears").then(res => {
                this.types = res.data;
              }).catch(err => {
              })
            },
             getFaculties(year = null){
              
              let url = `/reports/graduateReport`

              if (year) {
                url = `/reports/graduateReport?year=${year}`
              }
              request.get(url).then(res=>{
                this.facultiesUG = res.data.UG
                this.facultiesPG = res.data.PG
                

              }).catch(err=>{
              }).finally(()=>{
                  this.load = false
              })
            },
            async  downloadPDF(lang){

              console.log(this.type);
              
              this.$toast({
                component: ToastificationContent,
                props: {
                  icon: 'FileTextIcon',
                  text: this.$t('Global.downloading_report_in_progress'),
                  variant: 'info',
                },
              }, {
                position: 'top-center',
                timeout: false,
                closeOnClick: false,
                draggable: false,
              });
              await request.get(`/reports/graduate-pdf?grad=${this.type}&lang=${lang}` , { responseType: 'blob' }).then(res=>{

              fileDownload(res,'Graduates-Report.pdf')


              }).catch(err=>{

              }).finally(()=>{
              document.querySelector('.toastification-close-icon').click();
              })
            },
            downloadExcel(lang,grad){
            this.$toast({
              component: ToastificationContent,
              props: {
                icon: 'FileTextIcon',
                text: this.$t('Global.downloading_report_in_progress'),
                variant: 'info',
              },
            }, {
              position: 'top-center',
              timeout: false,
              closeOnClick: false,
              draggable: false,
            });

            request.get(`/reports/graduatedReport-excel?lang=${lang}&grad=${grad}` , { responseType: 'blob' }).then(res=>{
              
              fileDownload(res,"Registrations.xls")
    
            }).catch(err=>{
              
            }).finally(()=>{
              document.querySelector('.toastification-close-icon').click();
              
            })
      }
            
        },
        computed: {
          
          tableDataWithOverallSum() {
            const overallSum = this.calculateOverallSum();
            const overallSumRow = {
              name: 'Total Sum',
              name_local:'المجموع',
              graduate: overallSum.total_students,
            };

            if (Array.isArray(this.facultiesUG)) {
              return [...this.facultiesUG, overallSumRow];
            } else {
              return [overallSumRow];
            }
          },
          tableDataWithOverallSumPG() {
            const overallSum = this.calculateOverallSumPG();
            const overallSumRow = {
              name: 'Total Sum',
              name_local:'المجموع',
              graduate: overallSum.total_students,
            };

            if (Array.isArray(this.facultiesPG)) {
              return [...this.facultiesPG, overallSumRow];
            } else {
              return [overallSumRow];
            }
          },
        },
    };
</script>

<style scoped></style>
