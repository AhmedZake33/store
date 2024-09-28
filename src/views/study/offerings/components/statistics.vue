<template>
  <div>
    <b-overlay :show="load" rounded="sm">
      <b-row>
9        <div class="w-100">
          <b-card>
            <div class="d-flex">
              <feather-icon size="21" class="mr-2" icon="TrendingUpIcon" />
              <h4 class="mb-2">{{ $t('Global.grade_destribution') }}</h4>
            </div>
            <chartjs-component-bar-chart :options="options" :height="400" :data="programs" v-if="programs" />
          </b-card>
        </div>

        <div class="w-100">
          <b-card>
            <b-table outlined :empty-text="$t('Global.empty_text')" show-empty :items="tempGrades" :fields="fieldsData" striped responsive="sm">
              <template #cell(Absent)="data">
                <span>
                  {{ data.item.count ? data.item.count : '-' }}
                </span>
              </template>
            </b-table>
          </b-card>
        </div>

        <div class="w-100">
          <b-card>
            <div class="d-flex">
              <feather-icon size="21" class="mr-2" icon="UsersIcon" />
              <h4>{{ $t('Global.gradeDetials') }}</h4>
            </div>
            <chartjs-component-bar-chart :options="options" :height="400" :data="gradesDetails" v-if="gradesDetails" />
          </b-card>
        </div>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import { BCard, BOverlay, BCardHeader, BTable, BCardTitle, BCardText, BCardBody, BCol, BRow, BImg, BButton, BMedia, BMediaAside, BAvatar, BMediaBody } from 'bootstrap-vue';

import pieChartCategory from '@/views/dashboard/component/pieChart.vue';
import ChartjsComponentBarChart from '@/views/components/charts-components/ChartjsComponentBarChart.vue';
import ChartjsComponentLineChart from '@/views/components/charts-components/ChartjsComponentLineChart.vue';
import Statistics from '@/views/components/info/statistics';

import { mapGetters } from 'vuex';

import { $themeColors } from '@themeConfig';
// colors
const chartColors = {
  mainColor: '#054978',
  primaryColorShade: '#836AF9',
  yellowColor: '#ffe800',
  successColorShade: '#28dac6',
  warningColorShade: '#ffe802',
  warningLightColor: '#FDAC34',
  infoColorShade: '#299AFF',
  greyColor: '#4F5D70',
  blueColor: '#2c9aff',
  blueLightColor: '#84D0FF',
  greyLightColor: '#EDF1F4',
  tooltipShadow: 'rgba(0, 0, 0, 0.25)',
  lineChartPrimary: '#666ee8',
  lineChartDanger: '#ff4961',
  labelColor: '#746D69',
  grid_line_color: 'rgba(200, 200, 200, 0.2)',
  second_color: '#f57f21',
};

export default {
  components: {
    BCard,
    BCol,
    BImg,
    BRow,
    BTable,
    BCardHeader,
    BOverlay,
    BCardTitle,
    BCardText,
    BCardBody,
    BButton,
    BMedia,
    BMediaAside,
    BAvatar,
    BMediaBody,
    Statistics,
    ChartjsComponentBarChart,
    pieChartCategory,
    ChartjsComponentLineChart,
  },
  data() {
    return {
      data: null,
      fieldsData: [
        {
          key: 'name',
          label: this.$t('Name'),
        },
        {
          key: 'count',
          label: this.$t('Count'),
        },
      ],
      tempGrades: [
        { count: 1, name: 'Absent' },
        { count: 2, name: 'Weak' },
        { count: 6, name: 'Pass' },
        { count: 2, name: 'Good' },
        { count: 1, name: 'Very Good' },
        { count: 3, name: 'Excellent' },
      ],
      options: {
        elements: {
          rectangle: {
            borderWidth: 2,
            borderSkipped: 'bottom',
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,

        tooltips: {
          // Updated default tooltip UI
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          shadowBlur: 8,
          shadowColor: chartColors.tooltipShadow,
          backgroundColor: $themeColors.light,
          titleFontColor: $themeColors.dark,
          bodyFontColor: $themeColors.dark,
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                display: true,
                color: chartColors.grid_line_color,
                zeroLineColor: chartColors.grid_line_color,
              },
              scaleLabel: {
                display: false,
              },
              ticks: {
                fontColor: chartColors.labelColor,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              gridLines: {
                color: chartColors.grid_line_color,
                zeroLineColor: chartColors.grid_line_color,
              },
              ticks: {
                stepSize: 1,

                fontColor: chartColors.labelColor,
              },
            },
          ],
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      counts: 'dashboard/counts',
      offering_statistics: 'dashboard/offering_statistics',
      activities: 'dashboard/activities',
      payment: 'dashboard/payment',
      load: 'app/load',
    }),
    paymentData() {
      if (this.payment) {
        return {
          labels: Array.from(this.payment, el => el.label),
          datasets: [
            {
              data: Array.from(this.payment, el => el.total / 1000),
              backgroundColor: chartColors.mainColor,
              borderColor: 'transparent',
            },
          ],
        };
      }
    },
    ActivitiesData() {
      if (this.activities) {
        return {
          labels: Array.from(this.activities, el => el.label),
          datasets: [
            {
              data: Array.from(this.activities, el => el.count),
              backgroundColor: chartColors.second_color,
              borderColor: 'transparent',
            },
          ],
        };
      }
    },
    programs() {
      if (this.offering_statistics) {
        let dataShow = [];
        this.offering_statistics.forEach((element, i) => {
          let data = [element.programs_count];
          dataShow.push({ label: element.name, data: data, backgroundColor: chartColors.second_color, borderColor: 'transparent' });
        });
        return {
          labels: Array.from(this.tempGrades, el => el.name),
          datasets: [
            {
              label: 'Count',
              data: Array.from(this.tempGrades, el => el.count),
              backgroundColor: chartColors.second_color,
              borderColor: 'transparent',
            },
          ],
          //   datasets: [
          //     {
          //       label:'adad',
          //       data: Array.from(this.faculty.programs_per_faculty, el => el.programs_count),
          //       backgroundColor: chartColors.second_color,
          //       borderColor: 'transparent',
          //     },
          //   ],
        };
      }
    },

    gradesDetails() {
      if (this.faculty && this.faculty.programs_per_faculty) {
        let dataShow = [];
        this.faculty.programs_per_faculty.forEach((element, i) => {
          let data = [element.programs_count];
          dataShow.push({ label: element.name, data: data, backgroundColor: chartColors.second_color, borderColor: 'transparent' });
        });
        return {
          labels: Array.from(this.tempGrades, el => el.name),
          datasets: [
            {
              label: 'Work',
              data: Array.from(this.tempGrades, el => el.count),
              backgroundColor: chartColors.second_color,
              borderColor: 'transparent',
            },
            {
              label: 'MCQ Exam',
              data: Array.from(this.tempGrades, el => el.count).slice(0, 2),
              backgroundColor: chartColors.warningColorShade,
              borderColor: 'transparent',
            },
            {
              label: 'Extra',
              data: Array.from(this.tempGrades, el => el.count),
              backgroundColor: chartColors.primaryColorShade,
              borderColor: 'transparent',
            },
            {
              label: 'Clemency',
              data: Array.from(this.tempGrades, el => el.count),
              backgroundColor: chartColors.mainColor,
              borderColor: 'transparent',
            },
          ],
          //   datasets: [
          //     {
          //       label:'adad',
          //       data: Array.from(this.faculty.programs_per_faculty, el => el.programs_count),
          //       backgroundColor: chartColors.second_color,
          //       borderColor: 'transparent',
          //     },
          //   ],
        };
      }
    },

    courses() {
      if (this.faculty && this.faculty.courses_per_faculty) {
        return {
          labels: Array.from(this.faculty.courses_per_faculty, el => el.name),
          datasets: [
            {
              data: Array.from(this.faculty.courses_per_faculty, el => el.courses_count),
              backgroundColor: chartColors.second_color,
              borderColor: 'transparent',
            },
          ],
        };
      }
    },
  },
  methods: {
    getStatistic() {
      this.$store.dispatch('dashboard/counts');
      this.$store.dispatch('dashboard/faculty');
      this.$store.dispatch('dashboard/Activities');
      this.$store.dispatch('dashboard/offering_statistics',this.$route.params.id);
    },
  },
  mounted() {
    this.getStatistic();
  },
};
</script>
