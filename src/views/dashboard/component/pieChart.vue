<template>
  <vue-apex-charts type="pie" :label="label" :height="400" :options="pieChart.chartOptions" :series="data"></vue-apex-charts>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
const  themeColors= [ '#054978', '#f57f21', '#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E','#FF9F43']
const label = ['Team A', 'Team B', 'Team C', 'Team D', 'Team F']
const series = [44, 55, 13, 43, 10]
export default{

components:{
     VueApexCharts,
},
 props: {
    data: [Object,Array],
    label: [Object,Array],
    
    
  },
  data() {
    return {
     
      pieChart: {
        series: series,
        chartOptions: {
         labels:this.label,
          colors: themeColors,
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        }
      }
    }
  }

  }
</script>