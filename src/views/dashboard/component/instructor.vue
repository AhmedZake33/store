<template>
  <div>
    <b-row cols="12">
      <b-col cols="12">
        <Statistics :items="data" :only="['my_courses', 'my_Students', 'advise_Students', 'register_students']" icon="UserIcon"></Statistics>
      </b-col>
      <!-- <b-col v-for="(item, i) in items" :key="i" md="3" class="m-0 pl-1 pr-0">
                <statistic-card-horizontal :icon="item.icon"  :statistic="item.name" :statistic-title="item.name"/>
            </b-col> -->
    </b-row>
    <b-row>
      <!-- <b-col cols="6">
        <b-card>
          <div class="d-flex">
            <feather-icon size="21" class="mr-2" icon="TrendingUpIcon" />
            <h4>Calender</h4>
          </div> -->
          <!-- <full-calendar ref="refCalendar" :options="calendarOptions" class="full-calendar" /> -->
        <!-- </b-card>
      </b-col> -->
      <!-- <b-col
        md="6"
      >
        <ecommerce-transactions :data="transactionData" />
      </b-col> -->
    </b-row>
  </div>
</template>

<script>
import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal';
import Statistics from '@/views/components/info/statistics';
import FullCalendar from '@fullcalendar/vue';
import EcommerceTransactions from './EcommerceTransactions.vue'
import { mapGetters } from "vuex";
import { BCol, BRow, BCard ,BAlert, BButton} from 'bootstrap-vue';
import { heightFade } from '@core/directives/animations'
import Ripple from 'vue-ripple-directive'
import { getAuth } from '@/utils/auth';

export default {
  name: 'instructor',
  components: { StatisticCardHorizontal, Statistics,EcommerceTransactions, FullCalendar, BCol, BCard, BRow, BAlert, BButton },
  directives: {
    'height-fade': heightFade,
    Ripple,
  },
  data() {
    return {
        transactionData:[
        {mode:'wallet',types:'Add Money',payment:132},
        {mode:'wallet',types:'Add Money',payment:121,deduction:true},
        {mode:'wallet',types:'Refund',payment:12,deduction:false},
        ],
        calendarOptions: [
          {
            color: 'primary',
            label: 'Lecture',
            label_local: 'محاضرة',
          },
          {
            color: 'success',
            label: 'Lab',
            label_local: 'معمل',
          },
          {
            color: 'warning',
            label: 'Tutorial',
            label_local: 'دورة تعليمية',
          },
        ],
    }
  },

  computed: {
    data: function () {
      return {
        my_courses: '-',
        my_Students: '-',
        advise_Students: '-',
        register_students: '-',
      };
    },
    items: function () {
      return [
        {
          name: this.$t('Global.advising'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.archive'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.courses'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.financial'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.quality'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.researches'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.services'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.exam_print'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.news'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.schedule'),
          icon: 'UsersIcon',
          route: 'advising',
        },
        {
          name: this.$t('Global.chat'),
          icon: 'UsersIcon',
          route: 'advising',
        },
      ];
    },
  },
  
};
</script>

<style scoped>
.alert.alert-dismissible .alert-body {
    padding: 0.71rem 1rem 0.71rem 1rem;
}
</style>
