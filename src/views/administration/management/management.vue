<template>
    <b-row>
        <b-col md="4">
            <b-link :to="{name:'admission'}">
                <statistic-card-horizontal icon="TrendingUpIcon" color="primary" statistic="Settings" statistic-title="Settings Management"/>
            </b-link>
        </b-col>
<!--        <b-col md="4">
            <b-link :to="{name:'stages'}">
                <statistic-card-horizontal icon="TrendingUpIcon" color="primary" :statistic="$t('Semester Stages')" :statistic-title="$t('Semester Stages Management')"/>
            </b-link>
        </b-col>-->
      <!--   <b-col md="4">
            <b-link :to="{name:'marks'}">
                <statistic-card-horizontal icon="TrendingUpIcon" color="primary" :statistic="$t('marks')" :statistic-title="$t('marks_management')"/>
            </b-link>
        </b-col> -->
        <b-col md="4">
            <b-link :to="{name:'markCategories'}">
                <statistic-card-horizontal icon="TrendingUpIcon" color="primary" :statistic="$t('mark_categories')" :statistic-title="$t('mark_categories_management')"/>
            </b-link>
        </b-col>
        <!-- <b-col md="4">
            <b-link :to="{name:'groups'}">
                <statistic-card-horizontal icon="TrendingUpIcon" color="primary" :statistic="$t('groups')" :statistic-title="$t('groups_management')"/>
            </b-link>
        </b-col> -->
    </b-row>
</template>

<script>
    import StatisticCardHorizontal from "@core/components/statistics-cards/StatisticCardHorizontal";
    import {BCard, BCol, BImg, BRow , BLink} from "bootstrap-vue";

    export default {
        name: "management",
        components: {StatisticCardHorizontal ,BCard, BCol, BImg, BRow ,BLink}
    }
</script>

<style scoped>

</style>