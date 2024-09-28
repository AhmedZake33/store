<template>
    <app-collapse type="margin">
        <app-collapse-item :type="type" @show="init()" :title="title">
            <b-table show-empty :busy="loading" :items="items" :fields="[...fields, 'show_details']" striped responsive>
                <template #table-busy>
                    <div class="text-center text-black my-2">
                        <b-spinner class="align-middle"></b-spinner>
                    </div>
                </template>
                <template #cell(show_details)="row">
                    <div @click="row.toggleDetails" class="pointer d-flex justify-content-center">
                        <feather-icon icon="EyeIcon"/>
                    </div>
                </template>
                <template #cell(program)="data">
                    <b-link class="font-weight-bold d-block text-nowrap">
                        {{ data.item.program ? `${data.item.level? data.item.level.name : '-' } -
                        ${data.item.program.name} - ${data.item.program.bylaw? data.item.program.bylaw.name : '-'}` : '-' }}
                    </b-link>
                </template>
                <template #cell(term)="data">
                    <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold d-block text-nowrap">
                        {{ data.item.term ? data.item.term.name : '-' }}
                    </b-link>
                    <span v-if="$i18n.locale == 'ar'">
              {{ data.item.term ? data.item.term.name_local : '-' }}
            </span>
                </template>
                <template #cell(course)="data">
                    <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold d-block text-nowrap">
                        {{ data.item.course ? shortMyText(data.item.course.name) : '-' }}
                    </b-link>
                    <span v-if="$i18n.locale == 'ar'">
              {{ data.item.course && $i18n.locale == 'ar' ? data.item.course.name_local : '-' }}
            </span>
                </template>
                <template #row-details="row">
                    <b-table show-empty :items="row.item.grades" :fields="inner" striped responsive>
                        <template #cell(code)="data">
                            <b-link class="font-weight-bold d-block text-nowrap">
                                {{ data.item.course ? data.item.course.code : '-' }}
                            </b-link>
                        </template>
                        <template #cell(status)="data">
                            <b-link v-for="(stat, i) in data.item.status" :key="i"
                                    class="font-weight-bold d-flex text-nowrap">
                                {{ stat }},
                            </b-link>
                        </template>
                        <template #cell(marks)="data">
                            <b-link v-for="(mark, i) in data.item.marks" :key="i"
                                    class="font-weight-bold d-flex text-nowrap">
                                {{ mark.mark? `${mark.mark.name} (${mark.value})` : ''}},
                            </b-link>
                        </template>
                        <template #cell(grade_type)="data">
                            <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold d-block text-nowrap">
                                {{ data.item.grade_type ? data.item.grade_type.name : '-' }}
                            </b-link>
                            <span v-if="$i18n.locale == 'ar'">
                  {{ data.item.grade_type && $i18n.locale == 'ar' ? data.item.grade_type.name_local : '-' }}
                </span>
                        </template>
                        <template #cell(term)="data">
                            <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold d-block text-nowrap">
                                {{ data.item.term ? data.item.term.name : '-' }}
                            </b-link>
                            <span v-if="$i18n.locale == 'ar'">
                  {{ data.item.term && $i18n.locale == 'ar' ? data.item.term.name_local : '-' }}
                </span>
                        </template>
                        <template #cell(course)="data">
                            <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold d-block text-nowrap">
                                {{ data.item.course ? shortMyText(data.item.course.name) : '-' }}
                            </b-link>
                            <span v-if="$i18n.locale == 'ar'">
                  {{ data.item.course && $i18n.locale == 'ar' ? data.item.course.name_local : '-' }}
                </span>
                        </template>
                    </b-table>
                </template>
            </b-table>
        </app-collapse-item>
    </app-collapse>
</template>

<script>
    import {
        BTable,
        BOverlay,
        BFormCheckbox,
        BButton,
        BCard,
        BRow,
        BCol,
        BAvatar,
        BBadge,
        BLink,
        BSpinner
    } from 'bootstrap-vue';
    import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
    import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
    import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';

    export default {
        components: {
            BTable,
            BLink,
            BButton,
            BFormCheckbox,
            BCard,
            BSpinner,
            BRow,
            BCol,
            BBadge,
            BAvatar,
            BCardActions,
            AppCollapse,
            AppCollapseItem,
            BOverlay
        },
        props: {
            items: null,
            fields: [],
            inner: [],
            title: String,
            type: String,
            loading: false,
        },
    };
</script>
