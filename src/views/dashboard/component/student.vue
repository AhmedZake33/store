<template>
    <b-row cols="12">
        <b-col cols="12">
            <Statistics :items="items" :except="[]" icon="UserIcon"></Statistics>
        </b-col>
        <b-col cols="12">
            <Statistics :items="items_2" :except="[]" icon="UserIcon"></Statistics>
        </b-col>

        <b-col cols="6">
            <b-card>
                <div class="d-flex">
                    <feather-icon size="21" class="mr-2" icon="CommandIcon"/>
                    <h4>GPA</h4>
                </div>
                <chartjs-component-bar-chart :options="options" :height="400" :data="courses" v-if="courses"/>
            </b-card>
        </b-col>
        <b-col md="6">
            <ecommerce-transactions :data="transactionData"/>
        </b-col>
    </b-row>
</template>

<script>
    import {
        BCard,
        BCardHeader,
        BCardTitle,
        BCardText,
        BCardBody,
        BCol,
        BRow,
        BImg,
        BButton,
        BMedia,
        BMediaAside,
        BAvatar,
        BMediaBody
    } from 'bootstrap-vue';
    import Statistics from '@/views/components/info/statistics';
    import {$themeColors} from '@themeConfig';

    import ChartjsComponentBarChart from '@/views/components/charts-components/ChartjsComponentBarChart.vue';
    import EcommerceTransactions from "@/views/dashboard/component/EcommerceTransactions";
    import {mapGetters} from "vuex";

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
        name: "student",
        components: {
            EcommerceTransactions,
            Statistics,
            ChartjsComponentBarChart,
            BCard,
            BCardHeader,
            BCardTitle,
            BCardText,
            BCardBody,
            BCol,
            BRow,
            BImg,
            BButton,
            BMedia,
            BMediaAside,
            BAvatar,
            BMediaBody
        },
        data() {
            return {
                data: null,
                transactionData: [
                    {mode: 'wallet', types: 'Add Money', payment: 132},
                    {mode: 'wallet', types: 'Add Money', payment: 121, deduction: true},
                    {mode: 'wallet', types: 'Refund', payment: 12, deduction: false},
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
                    borderRadius:0,
                    legend: {
                        display: true,
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
                dashboard: 'students/dashboard',
            }),
            items: function () {
                if (this.dashboard && this.dashboard.current) {
                    return {
                        passed_courses: this.dashboard.passed_courses,
                        cgpa: this.dashboard.current.cumulative_gpa,
                        weeks: 20,
                    }
                }

            },
            items_2: function () {

                return {
                    warning: 20,
                    current_courses: 10
                }

            },
            courses() {
                if (this.dashboard && this.dashboard.grade_terms) {
                    let labels = Array.from(this.dashboard.grade_terms, el => el.name);
                    if (this.$i18n.locale == 'ar') {
                        labels = Array.from(this.dashboard.grade_terms, el => el.name_local);
                    }
                    return {
                        labels: labels,
                        datasets: [
                            {
                                type: "line",
                                data: Array.from(this.dashboard.grade_terms, el => el.cumulative_gpa),
                                fill: false,
                                label:"CGPA",
                                lineTension: 0,
                                borderColor: chartColors.second_color,
                                // backgroundColor: chartColors.second_color,

                            },
                            {
                                type: "bar",
                                label:"GPA",
                                data: Array.from(this.dashboard.grade_terms, el => el.gpa),
                                backgroundColor: chartColors.mainColor,
                            },

                        ],
                    };
                }
            },
        },
        methods: {
            getStatistic() {
                this.$store.dispatch('students/dashboard', {id:this.authUser().id});
            },
        },
        mounted() {
            this.getStatistic();
        }
    }
</script>

<style scoped>

</style>
