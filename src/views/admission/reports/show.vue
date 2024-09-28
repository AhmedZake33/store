<template>
    <b-overlay :show="load" rounded="sm">


    <b-row>
            <b-col sm="12">
          
                <TabTable
                        v-if="items && items.term"
                        no-details
                        class="mt-0"
                        :loading="load"
                        :title="$i18n.locale == 'ar' ?  items.term.name_local :  items.term.name"
                        :fields="facultyFields"
                        :items="items.faculties"                        
                >
                </TabTable>
            </b-col>
            <b-col sm="12">
                <TabTable
                        v-if="items && items.term"
                        no-details
                        class="mt-0"
                        :loading="load"
                        :title="$i18n.locale == 'ar' ?  items.term.name_local :  items.term.name"
                        :fields="certificatesFields"
                        :items="items.certificates"
                >
                </TabTable>
            </b-col>
    </b-row>
    </b-overlay>
</template>

<script>
    import {
        BTabs,
        BTab,
        BCard,
        BCol,
        BRow,
        BBadge,
        BAlert,
        BLink,
        BAvatar,
        BCardBody,
        BButtonGroup,
        BButton,
        BModal,
        BInputGroup,
        BFormTextarea,
        BImg,
        BFormGroup,
        BOverlay,
        BForm,
    } from 'bootstrap-vue'
    import TabTable from "@/views/admission/reports/components/table";
    import {mapGetters} from "vuex";

    export default {
        name: 'Show',
        components: {
            TabTable,
            BTabs,
            BTab,
            BOverlay,
            BCard,
            BCol,
            BRow,
            BBadge,
            BAlert,
            BLink,
            BCardBody,
            BAvatar,
            BButtonGroup,
            BButton,
            BImg,
            BModal,
            BInputGroup,
            BFormTextarea,
            BFormGroup,
            BForm,
        },
        methods: {
      
        },
        computed: {
            ...mapGetters({
                items: 'applicants/faculty_reports',
                load: 'applicants/load',
                lookups: 'applicants/lookups'
            }),
            facultyFields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty/program'),
                        thStyle: {width: '20%'},
                    },
                    {
                        key: 'INCOMPLETE',
                        label: this.$t('Global.INCOMPLETE'),
                    },
                    {
                        key: 'SUBMITTED',
                        label: this.$t('Global.SUBMITTED'),
                    },
                    {
                        key: 'FEEDBACK',
                        label: this.$t('Global.FEEDBACK'),
                    },
                    {
                        key: 'UPDATED',
                        label: this.$t('Global.UPDATED'),
                    },
                    {
                        key: 'REVIEWED',
                        label: this.$t('Global.REVIEWED'),
                    },
                    {
                        key: 'DISTRIBUATION_REQUIRED',
                        label: this.$t('Global.DISTRIBUATION_REQUIRED'),
                    },
                    {
                        key: 'REJECTED',
                        label: this.$t('Global.REJECTED'),
                    },
                    {
                        key: 'FINAL_FEES_REQUIRED',
                        label: this.$t('Global.FINAL_FEES_REQUIRED'),
                    },
                    {
                        key: 'APPROVED',
                        label: this.$t('Global.APPROVED'),
                    },
                    {
                        key: 'total',
                        label: this.$t('Global.total/required'),
                    },

                ]
            },
            certificatesFields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty/program'),
                        thStyle: {width: '20%'},
                    },
                    {
                        key: 'certificates',
                        label: this.$t('Global.certificates'),
                    },

                ]
            },
        },
        data() {
            return {}
        },
        mounted() {
            this.init();
            
        },
        methods: {
            init() {
                this.$store.dispatch('applicants/reports')
            }
        }
    }
</script>

<style scoped></style>
