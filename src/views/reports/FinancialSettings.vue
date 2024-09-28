<template>
    <b-overlay  rounded="sm">
      <b-row>
  
        <b-col sm="12">
          <b-row class="my-2 d-flex text-capitalize justify-content-between w-100 align-items-center ">
            <div class="mx-2 my-1">
              <h3 class="m-0">{{ this.$t("Global.Payment_setting_faculty") }}</h3>
            </div>
            <div>
              <b-button @click="toggleYear = !toggleYear" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.filter')"
                variant="primary">
                <feather-icon icon="SlidersIcon" />
              </b-button>
              <b-button @click="downloadPDF($i18n.locale)" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export')" variant="primary">
                <feather-icon icon="FileTextIcon" />
              </b-button>
  
            </div>
          </b-row>
          <b-row v-if="toggleYear"
            class="my-2 years d-flex text-capitalize justify-content-start w-100 align-items-left ">
  
            <b-col cols="12" md="4">
  
              <v-select  :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="form.academicYear" :options="years" class="w-100 bg-white" clearable label="start_year"
                :reduce="(val) => val.id" :placeholder="$t('Global.year')">
                 <template   v-slot:option="option">
                  <span >
                    {{  option.start_year && option.end_year ? option.start_year +' / ' + option.end_year : ''}}
                  </span>
                  
                </template> 
                 <template #selected-option="{ start_year , end_year}">
                  {{  start_year && end_year ? start_year +' / ' + end_year : '' }}
                </template>
                <template #no-options>
                  {{ $t('noMatching') }}
                </template>
              </v-select>
            </b-col>
              <b-col cols="12" md="4">
              <v-select multiple :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="form.faculty" :options="faculties" class="w-100 bg-white" clearable label="faculty"
                :reduce="(val) => val.id" :placeholder="$t('Global.faculty')">
                 <template   v-slot:option="option">
                  <span >
                    {{  $i18n.locale == 'ar'  ? option.name_local : option.name }}
                  </span>
                  
                </template>
                 <template #selected-option="{ name,name_local }">
                  {{  $i18n.locale == 'ar'  ? name_local : name }}
                </template>
                <template #no-options>
                  {{ $t('noMatching') }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="12" md="4">
              <v-select multiple :filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                v-model="form.level" :options="levels" class="w-100 bg-white" clearable label="start_year"
                :reduce="(val) => val.level_number" :placeholder="$t('Global.level')">
                 <template   v-slot:option="option">
                  <span >
                    {{  $i18n.locale == 'ar'  ? option.name_local : option.name }}
                  </span>
                  
                </template>
                 <template #selected-option="{ name,name_local }">
                  {{  $i18n.locale == 'ar'  ? name_local : name }}
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
                                  v-model="form.starts_at"
                                  :placeholder="$t('Global.start_at')"
                              />
            </b-col>
            <b-col cols="12" md="4">
                  <b-form-datepicker
                                  :label-no-date-selected="$t('Global.no_selected')"
                                  :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                                  id="ends_at"
                                  ref="ends_at"
                                  v-model="form.ends_at"
                                  :placeholder="$t('Global.end_at')"
                              />
            </b-col>
          </b-row>
          <b-col sm="12">
          <div v-if="nationalityload">
          <TabTableNE :data = "NationalityUG" :lang = "$i18n.locale" :key="tableKey" :removeSum="true"/>
        </div>
        </b-col>
        </b-col>
  
 
  
  
      </b-row>
      <b-row>
  

  
  
  
  </b-row>
  

      
    </b-overlay>
  </template>
  
  <script>
    import {
      BFormDatepicker,
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
    import TabTable from "@/views/reports/components/TabTable";
    import TabTableNE from "@/views/reports/components/TabTableNEU";
    import vSelect from 'vue-select';
    import request from '@/utils/request';
    import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
    import fileDownload from 'js-file-download'
  
    export default {
      name: 'Show',
      components: {
        BFormDatepicker,
        TabTableNE,
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
        vSelect
      },
      data() {
        return {
          faculties: '',
          facultiesPG: '',
          facultiesUG: '',
          tableKey: 0,
          nonEgyptians:'',
          totalPG : '',
          totalUG : '',
          totalNEUG : '',
          levels : [],
          loadNEGU:'',
          NationalityUG : [],
          nationalityload : false,
          years: [],
          form: {
            academicYear : null,
            faculty:[],
            starts_at:null,
            ends_at:null,
            level:[],
          },
          toggleYear: false,
          load: true,
  
        }
      },
      mounted() {
        // this.getFaculties()
        // this.getNonEgyptian()
        this.getFinancialSettings();
        this.getYears();
        this.getFaculties();
        this.getLevels();
      },
      methods: {
        slideToggle() {
          $(".years").slideToggle();
        },
        async getYears() {
          await request.get("/reports/years").then(res => {
            this.years = res.data
          }).catch(err => {
          })
        },
        async getFaculties() {
          await request.post("lookups/get",{ faculties: true }).then(res => {
            this.faculties = res.success.faculties;
            console.log(this.faculties);
          }).catch(err => {
          })
        },
        async getLevels() {
          await request.post("lookups/get",{ max_bylawLevel: true }).then(res => {
            this.levels = res.success.levels;
            console.log(this.faculties);
          }).catch(err => {
          })
        },
        // async getFaculties(id = null) {
  
        //   let url = `/reports/students`
  
        //   if (id) {
  
        //     url = `/reports/students?year=${id}`
        //   }
        //   this.load = true
        //   await request.get(url).then(res => {
  
        //     this.facultiesUG = res.data.UG
        //     this.facultiesPG = res.data.PG
        //     this.totalPG = res.data.totalPG
        //     this.totalUG = res.data.totalUG
  
            
        //     // document.querySelector('.toastification-close-icon').click();
  
        //   }).catch(err => {
        //   }).finally(() => {
        //     this.load = false
        //     // document.querySelector('.toastification-close-icon').click();
        //   })
        // },
        async getFinancialSettings(year = null,faculty = null){
          this.$toast({
            component: ToastificationContent,
            props: {
              icon: 'FileTextIcon',
              text: this.$t('Global.loading_report_in_progress'),
              variant: 'info',
            },
          }, {
            position: 'top-center',
            timeout: false,
            closeOnClick: false,
            draggable: false,
          });
          let url = `reports/financial-setting`
  
          // if (year) {
          //   url = `reports/nationalityReport`
          // }
          request.post(url,{ faculty_id: this.form.faculty , year_id: this.form.academicYear , starts_at : this.form.starts_at , ends_at : this.form.ends_at , lang : this.$i18n.locale , level_number : this.form.level}).then(res=>{
            this.NationalityUG = res.data.NEUG
            this.tableKey++;
            this.nationalityload = true
            document.querySelector('.toastification-close-icon').click();
        
          }).catch(err=>{
          }).finally(()=>{
              this.load = false
              document.querySelector('.toastification-close-icon').click();
          })
        },
        async getNonEgyptian(id = null) {
  
          let url = `/reports/nonEgyptian`
  
          if (id) {
  
            url = `/reports/nonEgyptian?year=${id}`
          }
          this.loadNEGU = true
          await request.get(url).then(res => {
  
            this.nonEgyptians = res.data.NEUG
            this.totalNEUG = res.data.totalNEUG
  
  
          }).catch(err => {
          }).finally(() => {
            this.loadNEGU = false
          })
        },
        downloadPDF(lang){
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
  
           request.get(`reports/download/financial-setting-pdf/${lang}` , { responseType: 'blob' }).then(res=>{
            
            fileDownload(res,"Students Report.pdf")
   
          }).catch(err=>{
            
          }).finally(()=>{
            document.querySelector('.toastification-close-icon').click();
            
          })
        },
        downloadPDFNon(lang){
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
  
           request.get(`/reports/nonEgyptians/students-pdf?lang=${lang}` , { responseType: 'blob' }).then(res=>{
            
            fileDownload(res,"Students Report.pdf")
   
          }).catch(err=>{
            
          }).finally(()=>{
            document.querySelector('.toastification-close-icon').click();
            
          })
        }
  
      },
      
      watch: {
          '$i18n.locale': function(){
              this.getFinancialSettings(this.form.academicYear,this.form.faculty)
              return
            },
          'form.academicYear': function (n) {
          if (n) {
            this.getFinancialSettings(this.form.academicYear,this.form.faculty)
            return 
          }
            this.getFaculties()
            this.getYears()
          
        },
        'form.faculty': function (n) {
          if (n) {
            this.getFinancialSettings(this.form.academicYear,this.form.faculty)
            return 
          }
            this.getFaculties()
            this.getYears()
          
        },
        'form.level': function (n) {
          if (n) {
            this.getFinancialSettings(this.form.academicYear,this.form.faculty)
            return 
          }
            this.getFaculties()
            this.getYears()
          
        },
        'form.starts_at': function (n) {
          if (n) {
            this.getFinancialSettings(this.form.academicYear,this.form.faculty)
            return 
          }
            this.getFaculties()
            this.getYears()
          
        },
        'form.ends_at': function (n) {
          if (n) {
            this.getFinancialSettings(this.form.academicYear,this.form.faculty)
            return 
          }
            this.getFaculties()
            this.getYears()
          
        } 
      }
  
    }
  </script>
  
  
  <style lang="scss">
    .unicon {
      align-items: center;
      cursor: pointer;
  
      svg {
        fill: #054978;
        width: 15px;
        height: 15px;
        margin-top: 4px;
      }
    }
  
    .Vue-Toastification__container.top-center .Vue-Toastification__toast.Vue-Toastification__toast--default .Vue-Toastification__toast-component-body {
      .toastification small.text-body {
        color: darkred !important
      }
    }
  </style>
  
  <style lang="scss" scoped>
    .per-page-selector {
      width: 90px;
    }
  </style>
  
  <style lang="scss">
    @import '@core/scss/vue/libs/vue-select.scss';
  
    .tab-content.col {
      overflow: auto;
    }
  
    .toastification-close-icon {
      visibility: hidden !important
    }
  </style>