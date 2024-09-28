<template>
    <b-card no-body>
        <b-card-header v-if="title" class="text-white p-0 w-100">
            <b-row class="mb-1 d-flex justify-content-between w-100 align-items-center">
                <div class="mx-2 my-1">
                    <h3 class="m-0">{{ title }}</h3>
                </div>
                <div>
                    <b-button v-if="add" class="btn-icon" @click="$emit('add', null, 3)"
                              v-b-tooltip.hover="$t('Global.add')" variant="primary">
                        <feather-icon icon="PlusIcon"/>
                    </b-button>
                    <b-button  @click="downloadPDF($i18n.locale)" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_pdf')"
                        variant="primary" >
                <feather-icon icon="FileTextIcon"/>
                
              </b-button>
                </div>
            </b-row>
        </b-card-header>
        <b-table show-empty :busy="loading" :items="items" :fields="fieldsData" striped responsive>
            <template #table-busy>
                <div class="text-center text-black my-2">
                    <b-spinner class="align-middle"/>
                </div>
            </template>
            <template #cell(faculty)="data">
                <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold "
                        :to="{ name: 'faculty', params: { id: data.item.faculty.id } }">
                    {{ data.item ? ((data.item.faculty.name)? data.item.faculty.name :data.item.faculty.name_local )
                    : '_' }}
                </b-link>
                <b-link v-if="$i18n.locale == 'ar'" class="font-weight-bold "
                        :to="{ name: 'faculty', params: { id: data.item.faculty.id } }">
                    {{ data.item ? ((data.item.faculty.name_local)? data.item.faculty.name_local
                    :data.item.faculty.name ) : '_' }}
                </b-link>
                <div v-if="data.item.program">
                    (
                    <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold "
                            :to="{ name: 'program', params: { id: data.item.program.id } }">
                        {{ data.item ? ((data.item.program.name)? data.item.program.name :data.item.program.name_local )
                        : '_' }}
                    </b-link>
                    <b-link v-if="$i18n.locale == 'ar'" class="font-weight-bold "
                            :to="{ name: 'program', params: { id: data.item.program.id } }">
                        {{ data.item ? ((data.item.program.name_local)? data.item.program.name_local
                        :data.item.program.name ) : '_' }}
                    </b-link>
                    )
                </div>
                <small class="text-muted">{{ data.item.faculty.code }}</small>
            </template>

            <template #cell(total)="data">
                <div>
                    {{data.item.total}} / {{data.item.total_required}}
                </div>
            </template>

            <template #cell(certificates)="data">
                <b-badge v-for="(certificate , i) in data.item.list" :key="i" pill variant="primary"
                         class="text-capitalize">
                      <b-badge  pill variant="success">
                           {{ certificate.count }}
                      </b-badge>
                    <span v-if="$i18n.locale == 'ar' && certificate.type" pill variant="success"
                             class="text-capitalize">
                        {{certificate.type.name_local}}
                    </span>
                    <span v-if="$i18n.locale == 'en' && certificate.type" pill variant="success"
                             class="text-capitalize">
                        {{certificate.type.name}}
                    </span>
                </b-badge>
            </template>
        </b-table>
    </b-card>
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
        BSpinner,
        BTr,
        BCardHeader,
        BTh
    } from 'bootstrap-vue';
    import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
    import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
    import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';
    import {mapActions} from 'vuex';
    import request from '@/utils/request';
    import fileDownload from 'js-file-download';
    import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

    export default {
        components: {
            BTr,
            BTh,
            BCardHeader,
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
            BOverlay,
        },
        props: {
            items: null,
            fields: [],
            inner: [],
            add: Boolean,
            title: String,
            type: String,
            loading: false,
            noDetails: Boolean,
            head: Boolean,
            table: {default: 3, type: Number},
            head_tuition: Boolean,
            settings: Boolean,
           
        },
        methods: {
            async  downloadPDF(lang){
                this.$toast({
                component: ToastificationContent,
                props: {
                    icon: 'FileTextIcon',
                    text: this.$t('Global.downloading_report_in_progress'),
                    variant: 'info',
                },
                }, {
                position: 'top-center',
                timeout: false,
                closeOnClick: false,
                draggable: false,
                });
                await request.get(`/reports/applicants-pdf?lang=${lang}` , { responseType: 'blob' }).then(res=>{

                fileDownload(res,'Applicants-Report.pdf')


                }).catch(err=>{

                }).finally(()=>{
                document.querySelector('.toastification-close-icon').click();
                })
                },
        },
        computed: {
            fieldsData() {
                let data = [
                    ...this.fields,
                    {
                        key: 'show_details',
                        thClass: 'customAction',
                        tdClass: 'customDetailsWidth',
                    },
                ];
                if (this.noDetails) {
                    data = data.filter(obj => !['show_details'].includes(obj.key));
                }
                return data;
            },
        },
    };
</script>
