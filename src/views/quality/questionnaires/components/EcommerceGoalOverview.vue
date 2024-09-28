<template>
  <b-card
    v-if="data"
    class="m-0"
    no-body
  >
    <b-card-header class="p-0">
      <h4 class="mb-1">
        {{$i18n.locale == 'ar' ? 'الإحصائيات' : 'Statistics'}}
      </h4>
    </b-card-header>

    <!-- apex chart -->
    <vue-apex-charts
      type="radialBar"
      height="70%"
      class="m-0"
      :options="goalOverviewRadialBar"
      :series="data.series"
    />
    <b-row class="text-center mx-0">
      <b-col
        cols="12"
        class="border-top d-flex align-items-between flex-column py-1"
      >
        <b-card-text class="mb-0">
          {{$i18n.locale == 'ar' ? 'مشاركون' : 'Participants'}}
        </b-card-text>
        <h3 class="font-weight-bolder mb-0">
          {{ data.participants }}
        </h3>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BRow, BCol, BCardText,
} from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'

const $strokeColor = '#ebe9f1'
const $textHeadingColor = '#5e5873'
const $goalStrokeColor2 = '#51e5a8'
export default {
  components: {
    VueApexCharts,
    BCard,
    BCardHeader,
    BRow,
    BCardText,
    BCol,
  },
  props: {
    data: {
      type: Object,
      participants: Number,
      default: () => {},
    },
  },
  watch:{
    '$i18n.locale'(val){
      let lang = val == 'ar' ? 'نتيجة' : 'Score'
      this.goalOverviewRadialBar.labels[0] = lang
    }
  },
  data() {
    return {
      goalOverviewRadialBar: {
        chart: {
          height: 200,
          type: 'radialBar',
          sparkline: {
            enabled: true,
          },
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1,
          },
        },
        colors: [$goalStrokeColor2],
        plotOptions: {
          radialBar: {
            offsetY: -12,
            startAngle: -150,
            endAngle: 150,
            hollow: {
              size: '67%',
            },
            track: {
              background: $strokeColor,
              strokeWidth: '120%',
            },
            dataLabels: {
              name: {
                show: true,
                offsetY: 30,
              },
              value: {
                color: $textHeadingColor,
                offsetY: -10,
                fontSize: '2.20rem',
                fontWeight: '600',
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: [$themeColors.success],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: 'round',
        },
        grid: {
          padding: {
            bottom: 10,
          },
        },
        labels: [this.$i18n.locale == 'ar' ? 'نتيجة' : 'Score'],
      },
    }
  },
}
</script>
