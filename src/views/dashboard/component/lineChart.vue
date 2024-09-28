<template>
  <vue-apex-charts type="line" height="350" :options="lineChartSimple.chartOptions" :series="{data}"></vue-apex-charts>
</template>

<script>
  import VueApexCharts from 'vue-apexcharts'
  const  themeColors= ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E']
  const label = ['Team A', 'Team B', 'Team C', 'Team D', 'Team F']
  const series = [44, 55, 13, 43, 10]
  export default{

    components:{
      VueApexCharts,
    },
    props: {
      data: [Object,Array],
      label:[Object,Array]

    },
    data() {
      return {

        lineChartSimple: {

          series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          }],
          chartOptions: {
            chart: {
              height: 350,
              zoom: {
                enabled: false
              }
            },
            colors: themeColors,
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'Product Trends by Month',
              align: 'left'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            xaxis: {
              categories: ['this.label','kh'],
            }
          }
        }
      }
    }

  }
</script>