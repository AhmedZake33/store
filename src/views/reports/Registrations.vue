<template>

  <b-overlay :show="load" rounded="sm">
    <b-card>
      <b-row>
        <b-col sm="12">
          <b-row class="my-2 d-flex text-capitalize justify-content-between w-100 align-items-center ">
            <div class="mx-2 my-1">
              <h3 class="m-0">{{ this.$t("Global.undergraduates_registrations") }}</h3>
            </div>
            <div>
              <b-button @click="downloadExcel($i18n.locale,'UG')" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_excel')" variant="primary">
              <feather-icon icon="FileTextIcon" />
            </b-button>
            <b-button @click="downloadPDF($i18n.locale)" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_pdf')" variant="primary">
              <feather-icon icon="FileTextIcon" />
            </b-button>

          </div>
          </b-row>
        </b-col>

        <b-col sm="12">
          <TabTable
              :load="load"
              :items="undergraduates"
              :fields="[
              { key: 'faculty', label: this.$t('Global.faculty'),thClass:'d-none' },
              { key: 'advisors', label: this.$t('Global.advisors'),thClass:'d-none' },
              { key: 'not_registered', label: this.$t('Global.not_registered') },
              { key: 'requested', label: this.$t('Global.requested') },
              { key: 'pending', label: this.$t('Global.pending') },
              { key: 'registered', label: this.$t('Global.registered') },
              { key: 'total_advised_students', label: this.$t('Global.total') },
            ]"
              :inner="[
              { key: 'program', label: this.$t('Global.program') },
              { key: 'not_registered', label: this.$t('Global.not_registered') },
              { key: 'requested', label: this.$t('Global.requested') },
              { key: 'pending', label: this.$t('Global.pending') },
              { key: 'registered', label: this.$t('Global.registered') },
              { key: 'total_advised_students', label: this.$t('Global.total_students') },
            ]"
          />
        </b-col>
      </b-row>
    </b-card>
    <b-card>
      <b-row>
        <b-col sm="12">
          <b-row class="my-2 d-flex text-capitalize justify-content-between w-100 align-items-center ">
            <div class="mx-2 my-1">
              <h3 class="m-0">{{ this.$t("Global.postgraduates_registrations") }}</h3>
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
              :items="postgraduates"
              :fields="[
              { key: 'faculty', label: this.$t('Global.faculty'),thClass:'d-none' },
              { key: 'advisors', label: this.$t('Global.advisors'),thClass:'d-none' },
              { key: 'not_registered', label: this.$t('Global.not_registered') },
              { key: 'requested', label: this.$t('Global.requested') },
              { key: 'pending', label: this.$t('Global.pending') },
              { key: 'registered', label: this.$t('Global.registered') },
              { key: 'total_advised_students', label: this.$t('Global.total') },
            ]"
              :inner="[
              { key: 'program', label: this.$t('Global.programs') },
              { key: 'not_registered', label: this.$t('Global.not_registered') },
              { key: 'requested', label: this.$t('Global.requested') },
              { key: 'pending', label: this.$t('Global.pending') },
              { key: 'registered', label: this.$t('Global.registered') },
              { key: 'total_advised_students', label: this.$t('Global.total_students') },
            ]"
          />
        </b-col>
      </b-row>
    </b-card>
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
import TabTable from "@/views/reports/components/TabTableRegistrations";
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import request from '@/utils/request';
import fileDownload from 'js-file-download'

export default {
  name: 'Show',
  components: {
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
      undergraduates: [],
      postgraduates: [],
      load: true
    }
  },
  mounted() {
    this.getFaculties()
  },
  methods: {
    getFaculties() {
      request.get("reports/registrationsReport").then(res => {
        this.undergraduates = res.data.ug
        this.postgraduates = res.data.pg
      }).catch(err => {

      }).finally(() => {
        this.load = false
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

         request.get(`/reports/registrationsReport-pdf?lang=${lang}` , { responseType: 'blob' }).then(res=>{
          
          fileDownload(res,"Registrations.pdf")
 
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

         request.get(`/reports/registrationsReport-excel?lang=${lang}&grad=${grad}` , { responseType: 'blob' }).then(res=>{
          
          fileDownload(res,"Registrations.xls")
 
        }).catch(err=>{
          
        }).finally(()=>{
          document.querySelector('.toastification-close-icon').click();
          
        })
      }

  }
}
</script>

<style scoped></style>
