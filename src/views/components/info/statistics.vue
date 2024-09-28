<template>
    <b-overlay :show="loading" rounded="sm">
        <b-row v-if="widths">
            <b-col v-for="(item, i) in mapOrder(transform(items, only, except),only,'key')" :key="i"
                   class="m-0 w-100 " :md="widths[i]" sm="12">
                <statistic-card-horizontal class="w-100" :icon="icon ? icon : 'TrendingUpIcon'" :color="colors[i]"
                                           :statistic="item.value ? item.value.toLocaleString() : 0"
                                           :statistic-title="$t(`Global.${item.key}`)"
                                           :egpIcon="egpIcon"
                />
            </b-col>
        </b-row>

        <b-row v-else>
            <b-col v-for="(item, i) in mapOrder(transform(items, only, except),only,'key')" :key="i"
                   class="m-0 w-100 ">
                <statistic-card-horizontal class="w-100" :icon="icon ? icon : 'TrendingUpIcon'" :color="colors[i]"
                                           :statistic="item.value ? item.value.toLocaleString() : 0"
                                           :statistic-title="$t(`Global.${item.key}`)"
                                           :egpIcon="egpIcon"
                />
            </b-col>
        </b-row>

    </b-overlay>
</template>

<script>
    import {BCard, BCol, BRow, BImg, BOverlay} from 'bootstrap-vue';
    import StatisticCardHorizontal from '@core/components/statistics-cards/StatisticCardHorizontal';

    export default {
        name: 'statistics',
        components: {
            StatisticCardHorizontal,
            BCard,
            BCol,
            BImg,
            BRow,
            BOverlay,
        },
        props: {
            items: [],
            only: [],
            except: [],
            name: Object,
            loading: false,
            title: String,
            code: String,
            icon: null,
            widths: false,
            egpIcon:{type:Boolean, default:false}
        },
        data() {
            return {
                colors: ['warning', 'danger', 'success', 'primary', 'warning', 'danger', 'success', 'primary', 'warning', 'danger', 'success',],
            };
        },
        methods: {
            mapOrder(array, order, key) {
                if (array) {
                    if (!order) return array
                    array.sort((a, b) => {
                        const A = a[key]
                        const B = b[key]
                        if (order.indexOf(A) > order.indexOf(B)) {
                            return 1
                        }
                        return -1
                    })

                    return array
                }
                return [];
            },
            sortedData(data) {
                if (data) {
                    return data.sort(function (a, b) {
                        if (a.key < b.key) {
                            return -1;
                        }
                        if (a.key > b.key) {
                            return 1;
                        }
                        return 0;
                    });
                }
            },
        },
    };
</script>

<style scoped></style>
