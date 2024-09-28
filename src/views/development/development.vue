<template>
  <b-row>
    <b-col md="4">
      <b-link @click="downloadExcelWrongStudents('WrongStudents')">
        <statistic-card-horizontal icon="TrendingUpIcon" color="primary" statistic="Missing Students"
                                   statistic-title="Extract Students With Missing Data"/>
      </b-link>
    </b-col>
    <b-col md="4">
      <b-link @click="downloadExcelWrongStudents('WrongFacutlies')">
        <statistic-card-horizontal icon="TrendingUpIcon" color="primary" :statistic="$t('Faculty')"
                                   statistic-title="Students With Wrong Faculty"/>
      </b-link>
    </b-col>
    <b-col md="4">
      <b-link @click="downloadExcelWrongStudents('WrongRegistrations')">
        <statistic-card-horizontal icon="TrendingUpIcon" color="primary" statistic="Wrong Registration"
                                   statistic-title="Extract Registrations With Wrong Data"/>
      </b-link>
    </b-col>
    <b-col md="4">
      <b-link @click="downloadExcelWrongStudents('MissingOffers')">
        <statistic-card-horizontal icon="TrendingUpIcon" color="primary" statistic="Missing Offers"
                                   statistic-title="Offerings With No Credit Hours Or Max Total"/>
      </b-link>
    </b-col>
    <b-col md="4">
      <b-link @click="downloadExcelWrongStudents('WrongLevels')">
        <statistic-card-horizontal icon="TrendingUpIcon" color="primary" :statistic="$t('Levels')"
                                   statistic-title="Extract Students with wrong levels"/>
      </b-link>
    </b-col>
    <b-col md="4">
      <b-link @click="downloadExcelWrongStudents('InconsistentStudents')">
        <statistic-card-horizontal icon="TrendingUpIcon" color="primary" statistic="Inconsistent Students"
                                   statistic-title="Extract Students with inconsistent data"/>
      </b-link>
    </b-col>

    <b-col md="4">
      <b-link @click="exportOfferingsStatuses">
        <statistic-card-horizontal icon="TrendingUpIcon" color="primary" statistic="Offerings Statuses"
                                   statistic-title="Export offerings statuses"/>
      </b-link>
    </b-col>
  </b-row>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import StatisticCardHorizontal from "@core/components/statistics-cards/StatisticCardHorizontal";
import {BCard, BCol, BImg, BRow, BLink} from "bootstrap-vue";
import request from '@/utils/request';
import fileDownload from 'js-file-download';

export default {
  name: "management",
  components: {StatisticCardHorizontal, BCard, BCol, BImg, BRow, BLink},

  methods: {
    handleClick() {
    },
    downloadExcelWrongStudents(wrong) {
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
      request.get(`developments/wrong-students-excel?wrong=${wrong}`, {responseType: 'blob'}).then(res => {

        if (wrong == 'WrongStudents') {
          fileDownload(res, "Missing-Data-Students.csv")
        }
        if (wrong == 'WrongFacutlies') {
          fileDownload(res, "Wrong-Faculty.csv")
        }
        if (wrong == 'WrongLevels') {
          fileDownload(res, "Wrong-Levels.csv")
        }
        if (wrong == 'InconsistentStudents') {
          fileDownload(res, "Inconsistent-Studnets.csv")
        }
        if (wrong == 'WrongRegistrations') {
          fileDownload(res, "Wrong-Registrations.csv")
        }
        if (wrong == 'MissingOffers') {
          fileDownload(res, "Missing-Offers.csv")
        }
      }).catch(err => {
        console.error('Error:', err);
      }).finally(() => {
        document.querySelector('.toastification-close-icon').click();
      })
    },
    exportOfferingsStatuses() {
      request.post('/developments/offering-statuses')
          .then(response => {
            fileDownload(response, "Offerings Statuses.csv")
          })
          .catch(error => {
            console.error(error);
          });
    }
  }
};
</script>

<style scoped>

</style>