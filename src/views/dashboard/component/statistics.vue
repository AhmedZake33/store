<template>
  <!-- v-if="hasPermission('admin_system')" -->

  <div>
    <b-row>
      <b-col cols="12">
        <Statistics v-if="counts" :items="{...counts,...counts.users_count}" :only="['student_count', 'Instructors','faculties_count', 'bylaws_count', 'courses_count', 'programs_count']"></Statistics>
      </b-col>
    </b-row>
<!-- <b-row class="d-flex justify-content-between">
<Statistics v-if="counts" :items="counts.users_count" :only="['Students', 'Instructors']" icon="UserIcon"></Statistics> 
  <Statistics v-if="counts" :items="{...counts,...counts.users_count}" :only="['Students', 'Instructors','faculties_count', 'bylaws_count', 'courses_count', 'programs_count']"></Statistics>
</b-row> -->
    <b-row>
      <b-col cols="6">
  <b-card>
    <div class="d-flex align-items-center justify-content-between">
      <div class="d-flex">
        <feather-icon size="21" class="mr-2" icon="UserIcon" />
        <h4>{{$t('Global.studying_students')}}</h4>
      </div>
      
      <router-link :to="{ name: 'students-report' }" class="text-decoration-none">
        <feather-icon size="21" class="mr-2" icon="BookOpenIcon"></feather-icon>
        <!-- {{$t('Global.details')}} -->
      </router-link>


    </div>
    <chartjs-component-bar-chart :options="chartOptionsStudents" :height="400" :data="students" v-if="students" />
  </b-card>
</b-col>


      <b-col cols="6">
        <b-card>
          <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex">
            <feather-icon size="21" class="mr-2" icon="UserIcon"/>
            <h4>{{$t('Global.Instructors')}}</h4>
          </div>
          <div class="d-flex justify-content-end">
            <!-- <b-button variant="outline-primary">
              <router-link :to="{ name: 'staff-report' }" class="text-decoration-none">
                {{$t('Global.details')}}
              </router-link>
            </b-button> -->
            <router-link :to="{ name: 'staff-report' }" class="text-decoration-none">
              <feather-icon size="21" class="mr-2" icon="BookOpenIcon"></feather-icon>
            </router-link>
          </div>
        </div>
            <chartjs-component-bar-chart :options="chartOptions" :key="key" :height="400" :data="instructors" v-if="instructors" >
            </chartjs-component-bar-chart>
        </b-card>
      </b-col>

    </b-row>
    <b-row class="h-100">
  <b-col cols="12" class="d-flex">
    <b-card class="w-100">
      <div class="d-flex flex-column h-100">
        
        <div class="d-flex align-items-center">
          <h4 class="ml-2">{{$t('Global.eg_payments')}}</h4>
          
        </div>
        <div class="d-flex justify-content-end">
            
        </div>
        <div class="flex-grow-1">
          <chartjs-component-bar-chart :options="optionsStackBar" :key="key" :height="400" :data="PaymentData" v-if="payment" >
            </chartjs-component-bar-chart>
        </div> 
      </div>
    </b-card>
    <b-card class="w-100">
      <div class="d-flex flex-column h-100">
        <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <h4 class="ml-2">{{$t('Global.us_payments')}}</h4>
            
          </div>
          <div class="d-flex justify-content-end">
              <!-- <b-button variant="outline-primary">
                <router-link :to="{ name: 'Financial-report' }" class="text-decoration-none">
                  {{$t('Global.details')}}
                </router-link>
              </b-button> -->
              <router-link :to="{ name: 'Financial-report' }" class="text-decoration-none">
                <feather-icon size="21" class="mr-2" icon="BookOpenIcon"></feather-icon>
            </router-link>
          </div>
        </div>
        <!-- <div class="d-flex align-items-center">
          <p>in thousand dollar </p>
        </div> -->
        <div class="flex-grow-1">
           <!-- <chartjs-component-line-chart
            :height="450"
            :data="PaymentData"
            :options="options"
            v-if="payment"
          /> -->
          <chartjs-component-bar-chart :options="optionsStackBar" :height="400" :data="PaymentDataDollar" :key="key" v-if="paymentDollar" >
            </chartjs-component-bar-chart>
        </div> 
      </div>
    </b-card>
  </b-col>
  <b-col cols="12" class="d-flex">
    <b-card class="w-100">
      <div class="d-flex flex-column h-100">
        <div class="d-flex align-items-center">
          <feather-icon size="21" icon="TrendingUpIcon"/>
          <h4 class="ml-2">{{$t('Global.users_activities')}}</h4>
        </div>
        <div class="flex-grow-1">
          <chartjs-component-line-chart :options="options" :height="310" :data="ActivitiesData" v-if="activities" />
        </div>
      </div>
    </b-card>
  </b-col>
</b-row>


  </div>
</template>

<script>
import { BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BCol, BRow, BImg, BButton, BMedia, BMediaAside, BAvatar, BMediaBody } from 'bootstrap-vue';

import pieChartCategory from '@/views/dashboard/component/pieChart.vue';
import AppEchartStackedArea from '@core/components/charts/echart/AppEchartStackedArea.vue'
import ChartjsComponentBarChart from '@/views/components/charts-components/ChartjsComponentBarChart.vue';
import ChartjsComponentLineChart from '@/views/components/charts-components/ChartjsComponentLineChart.vue';
import Statistics from '@/views/components/info/statistics';
// import chartjsData from './chartjsData'

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
  green:'rgb(0,190,0)',
  red:'rgb(255,0,0)',
  labelColor: '#746D69',
  grid_line_color: 'rgba(200, 200, 200, 0.2)',
  second_color: '#f57f21',
};

export default {
  components: {
    ChartjsComponentLineChart,
    AppEchartStackedArea,
    BCard,
    BCol,
    BImg,
    BRow,
    BCardHeader,
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
      total:0,
      totalInstructor:0,
      key:0,
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
        legend: {
          display: false,
        },
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
              stacked: true, // Enable stacking
              gridLines: {
                color: chartColors.grid_line_color,
                zeroLineColor: chartColors.grid_line_color,
              },
              ticks: {
                // stepSize: 1,
                beginAtZero: true,
                fontColor: chartColors.labelColor,
              },
            },
          ],
        },
      },
      optionsStackBar: {
        elements: {
          rectangle: {
            borderWidth: 2,
            borderSkipped: 'bottom',
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        legend: {
          display: true,
          
        },
        tooltips: {
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          displayColors: false, // Hide the small square symbol
          shadowBlur: 8,
          shadowColor: chartColors.tooltipShadow,
          backgroundColor: $themeColors.light,
          titleFontColor: $themeColors.dark,
          bodyFontColor: $themeColors.dark,
          
          // mode: 'index',
          callbacks: {
            label:(tooltipItem, data) => {
              var totalData = data.datasets[1].data[tooltipItem.index];
              var paidData = data.datasets[0].data[tooltipItem.index];
              const dataset = data.datasets[tooltipItem.datasetIndex];
              // Format the values as desired (e.g., with commas or additional text)
              var totalLabel = totalData.toLocaleString();
              var paidLabel = paidData.toLocaleString();

              // if (tooltipItem.datasetIndex === 0) {
              //   return this.$i18n.locale === "en"
              //   ? "Paid"+': '+paidLabel
              //   : "المدفوع" +': ' + paidLabel;
              // } else {
              //   return this.$i18n.locale === "en"
              //   ? "Unpaid"+': '+ totalLabel
              //   : "غير مدفوع" +': ' + totalLabel;
              // }\
              return (
                dataset.data[tooltipItem.index].toFixed(0) +' ' +dataset.label
              );
            }
            },
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
              beginAtZero:true,
              // stacked: true, // Enable stacking
              gridLines: {
                display: true,
                color: chartColors.grid_line_color,
                zeroLineColor: chartColors.grid_line_color,
              },
              ticks: {
                stepSize: 10,
                fontColor: chartColors.labelColor,
              },
            },
          ],
        },
      },
      chartOptions: {
        elements: {
          rectangle: {
            borderWidth: 2,
            borderSkipped: 'bottom',
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        legend: {
          display: true,
          reverse: true,
        },
        tooltips: {
          // Updated default tooltip UI
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          displayColors: false, // Hide the small square symbol
          shadowBlur: 8,
          shadowColor: chartColors.tooltipShadow,
          backgroundColor: $themeColors.light,
          titleFontColor: $themeColors.dark,
          bodyFontColor: $themeColors.dark,
          callbacks: {
            label:(tooltipItem, data)=> {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            if (this.faculty && this.faculty.instructors_per_faculty) {
              const instructors = this.faculty.instructors_per_faculty[tooltipItem.index];
              const countProf = instructors.professor;
              const realCount = countProf.toLocaleString(); // Format the count as needed
              const countAssoProf = instructors.Associate_professor;
              const realCountAssoProf = countAssoProf.toLocaleString(); // Format the count as needed
              const countLecturer = instructors.Lecturer;
              const realCountLec = countLecturer.toLocaleString(); // Format the count as needed
              const countAssiLecturer = instructors.Assistant_Lecturer;
              const realCountAssiLec = countAssiLecturer.toLocaleString(); // Format the count as needed
              const countDemo = instructors.Demonstrator;
              const realCountDemo = countDemo.toLocaleString(); // Format the count as needed
              return (
                dataset.data[tooltipItem.index] +' ' +dataset.label
              );
            }
              return '';
            // return realCount + ' students';
          }
          },
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
              beginAtZero:true,
              gridLines: {
                color: chartColors.grid_line_color,
                zeroLineColor: chartColors.grid_line_color,
              },
              ticks: {
                stepSize: 20,

                fontColor: chartColors.labelColor,
              },
            },
          ],
        },
      },
      chartOptionsStudents: {
        elements: {
          rectangle: {
            borderWidth: 2,
            borderSkipped: 'bottom',
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        legend: {
          display: false,
        },
        tooltips: {
          // Updated default tooltip UI
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          shadowBlur: 8,
          shadowColor: chartColors.tooltipShadow,
          backgroundColor: $themeColors.light,
          titleFontColor: $themeColors.dark,
          bodyFontColor: $themeColors.dark,
          callbacks: {
            label:(tooltipItem, data)=> {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              if (this.faculty && this.faculty.studnets_per_faculty) {
                const count = this.faculty.studnets_per_faculty[tooltipItem.index].students_count;
                const totalStudents = this.total;
                const percentage = ((count / totalStudents) * 100).toFixed(0);
                
                // return percentage + '% of students ,'+count+' number of students';
                return this.$i18n.locale === "en"
                ? percentage + '%, '+count
                : percentage+ '%,'+count
              }
              return '';
            // return realCount + ' students';
          }
          },
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
              beginAtZero:true,
              gridLines: {
                color: chartColors.grid_line_color,
                zeroLineColor: chartColors.grid_line_color,
              },
              ticks: {
                beginAtZero: true,
                // stepSize: 20,
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
      faculty: 'dashboard/faculty',
      activities: 'dashboard/activities',
      payment: 'dashboard/payment',
      paymentDollar:'dashboard/paymentDollar',
    }),
    ActivitiesData() {
      if (this.activities) {
        return {
          labels:  Array.from(this.activities  , el=> el.label),
          datasets: [
            {
              data: Array.from(this.activities  , el=> el.count),
              backgroundColor: chartColors.second_color,
              borderColor: 'transparent',
            },
          ],
        };
      }
    },
     PaymentData() {
      if (this.payment) {

        const totalData = Array.from(this.payment, (el) => el.total_amount / 1000000);
        const paidData = Array.from(this.payment, (el) => el.total_paid / 1000000);
        
           return {
          labels:  Array.from(this.payment  , el=> el.date),
          datasets: [
            {
              data: paidData,
              backgroundColor: chartColors.green,
              borderColor: 'transparent',
              label:this.$t('Global.paid'),
              stack: 'Total',
            },
            {
              data: totalData,
              backgroundColor: chartColors.red,
              label:this.$t('Global.unpaid'),
              stack: 'Total',
              borderColor: 'transparent',
            },
          ],

        };
      }
     },
     PaymentDataDollar() {
      if (this.paymentDollar) {

        const totalData = Array.from(this.paymentDollar, (el) => el.total_amount / 1000);
        const paidData = Array.from(this.paymentDollar, (el) => el.total_paid / 1000);
        
           return {
          labels:  Array.from(this.paymentDollar  , el=> el.date),
          datasets: [
            
            {
              data: paidData,
              backgroundColor: chartColors.green,
              borderColor: 'transparent',
              label:this.$t('Global.paid'),
              stack: 'Total',
            },
            {
              data: totalData,
              backgroundColor: chartColors.red,
              label:this.$t('Global.unpaid'),
              stack: 'Total',
              borderColor: 'transparent',
            },
          ],

        };
      }
     },
    programs() {
      if (this.faculty && this.faculty.programs_per_faculty) {
        return {
          labels:  Array.from(this.faculty.programs_per_faculty  , el=> el.name),
          datasets: [
            {
              data: Array.from(this.faculty.programs_per_faculty  , el=> el.programs_count),
              backgroundColor: chartColors.second_color,
              borderColor: 'transparent',
            },
          ],
        };
      }
    },
    instructors() {
      if (this.faculty && this.faculty.instructors_per_faculty) {
        this.totalInstructor = this.faculty.instructors_per_faculty.reduce((sum, el) => sum + el.instructors_count, 0);
        return {
          labels:  Array.from(this.faculty.instructors_per_faculty  , el=> el.name),
          datasets: [        
          {
              label: this.$t('Global.demonstrator'),
              data: this.faculty.instructors_per_faculty.map(el => ((el.Demonstrator))),
              backgroundColor: chartColors.infoColorShade,
              borderColor: 'transparent',
              stack: 'inst',
            },
            {
              label: this.$t('Global.assistant_lecturer'),
              data: this.faculty.instructors_per_faculty.map(el => ((el.Assistant_Lecturer))),
              backgroundColor: chartColors.greyColor,
              borderColor: 'transparent',
              stack: 'inst',
            },
            {
              label: this.$t('Global.assistant_professor'),
              data: this.faculty.instructors_per_faculty.map(el => ((el.Lecturer))),
              backgroundColor: chartColors.successColorShade,
              borderColor: 'transparent',
              stack: 'inst',
            },
            {
              label:this.$t('Global.associate_professor'),
              data: this.faculty.instructors_per_faculty.map(el => ((el.Associate_professor))),
              backgroundColor: chartColors.second_color,
              borderColor: 'transparent',
              stack: 'inst',
            },
            {
              label: this.$t('Global.professor'),
              data: this.faculty.instructors_per_faculty.map(el => ((el.professor))),
              backgroundColor: chartColors.green,
              borderColor: 'transparent',
              stack: 'inst',
            },
          ],
        };
      }
    },
    students() {
    if (this.faculty && this.faculty.studnets_per_faculty ) {
      this.total = this.faculty.studnets_per_faculty.reduce((sum, el) => sum + el.students_count, 0);
      return {
        labels: this.faculty.studnets_per_faculty.map(el => el.name),
        datasets: [
          {
            data: this.faculty.studnets_per_faculty.map(el => ((el.students_count).toFixed(2))),
            backgroundColor: chartColors.second_color,
            borderColor: 'transparent',
          },
        ],
      };
    }
    return null;
  },

    courses() {
      if (this.faculty && this.faculty.courses_per_faculty) {
        return {
          labels:  Array.from(this.faculty.courses_per_faculty  , el=> el.name),
          datasets: [
            {
              data: Array.from(this.faculty.courses_per_faculty  , el=> el.courses_count),
              backgroundColor: chartColors.second_color,
              borderColor: 'transparent',
            },
          ],
        };
      }
    },
        courses() {
      if (this.faculty && this.faculty.courses_per_faculty) {
        return {
          labels:  Array.from(this.faculty.courses_per_faculty  , el=> el.name),
          datasets: [
            {
              data: Array.from(this.faculty.courses_per_faculty  , el=> el.courses_count),
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
      this.$store.dispatch('dashboard/paymentPerMonth');
      // this.$store.dispatch('dashboard/paymentPerMonth');
    },
    init(){
      // this.PaymentDataDollar
      this.key +=1;
    }
  },
  watch:{
    '$i18n.locale': function(){
        this.init();
      }
  },
  beforeMount(){

    this.getStatistic();
  },
  mounted() {
  },
};
</script>
