<template>
    <section id="dashboard-ecommerce">
        <div class="demo-spacing-0" v-if="showDismissibleAlerts">
            <!-- alert -->
            <div class="text-center text-black my-2" v-if="load">
                <b-spinner class="align-middle"></b-spinner>
            </div>
            <div v-else>
                <b-alert v-for="questionnaire in activeQuestionnaires" :key="questionnaire.id"
                    v-model="showDismissibleAlert" variant="warning" class="mb-1">
                    <!-- :dismissible="questionnaire.status.id == 1 ? true : false" -->
                    <div class="alert-body d-flex py-1">
                        <div class="alert-body text-dark">
                            {{ $i18n.locale == 'ar' ? `[${questionnaire.questionnaire_type.name_local}] برجاء ملئ
                            الاستبيان `: `[${questionnaire.questionnaire_type.name}] Please fill out the questionnaire `
                            }}
                        </div>
                        <b-button variant="primary"
                            @click="$router.push({ name: 'questionnaire_form', params: { id: questionnaire.id } })">
                            {{ $i18n.locale == 'ar' ? 'ملئ' : 'Fill' }}
                        </b-button>
                    </div>
                </b-alert>
            </div>

            <!-- button -->
            <!-- <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-1"
            @click="showDismissibleAlert = !showDismissibleAlert"
            >
            {{ showDismissibleAlert ? 'Hide' : 'Show' }} dismissible alert
            </b-button> -->
        </div>

        <statistics v-if="hasPermission('admin_system')" />
        <instructor v-else></instructor>
        <!--       <student></student>-->
    </section>
</template>

<script>
import statistics from './component/statistics'
import Instructor from "@/views/dashboard/component/instructor";
import Student from "@/views/dashboard/component/student";
import { mapGetters } from "vuex";
import { BCol, BRow, BSpinner, BCard, BAlert, BButton } from 'bootstrap-vue';
import { getAuth } from '@/auth/utils';

export default {
    components: {
        Student,
        Instructor,
        BRow,
        BCol,
        statistics,
        BAlert,
        BButton,
        BCard,
        BSpinner
    },
    data() {
        return {
            showDismissibleAlert: true,
            showDismissibleAlerts: false,
            checkMandatory: false,
        }
    },
    computed: {
        ...mapGetters({
            activeQuestionnaires: "questionnaires/items",
            load: "questionnaires/load",
        }),
        userData() {
            return getAuth()
        }
    },
    mounted() {
        this.$store.dispatch("questionnaires/getActiveQuestionnaires").then(_ => {
            this.showDismissibleAlerts = this.activeQuestionnaires.length > 0 ? true : false;

            if (this.activeQuestionnaires.length > 0 && this.activeQuestionnaires.some(e => e.type.id == 2)) {
                document.addEventListener('contextmenu', function (event) {
                    event.preventDefault();
                });
                document.addEventListener('click', function (event) {
                    if (event.ctrlKey) {
                        event.preventDefault();
                    }
                });
            }

            this.$router.beforeEach((to, from, next) => {
                if (this.activeQuestionnaires.some(e => e.type.id == 2) && to.name != 'questionnaire_form' && to.name != 'dashboard') {

                    to.name == 'questionnaire_form' ? next() : next({ name: 'dashboard' });
                } else {

                    next();
                }
            });
        });
    },





}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '@core/scss/vue/libs/chart-apex.scss';
</style>
