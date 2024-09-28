<template>
    <div v-if="hasPermission('access_report_financials')">
        <b-overlay :show="load" rounded="sm">


            <b-card>
                <b-card-body>
                    <b-col sm="12">
                        <b-row class="my-2 d-flex text-capitalize justify-content-between w-100 align-items-center ">
                            <div class="mx-2 my-1">
              <h3  class="m-0">
                {{ labelUndergrade }}
              </h3>
            </div>
                            <div>
                                <b-button @click="toggleProgram = !toggleProgram" class="btn-icon ml-1"
                                    v-b-tooltip.hover="$t('Global.filter')" variant="primary">
                                    <feather-icon icon="SlidersIcon" />
                                </b-button>
                                <b-button @click="reset()" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.reset')"
                                    variant="primary">
                                    <feather-icon icon="RefreshCcwIcon" />
                                </b-button>
                                <b-button v-if="hasPermission('access_PDF_financials')" @click="downloadPDF('ug')"
                                    class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_pdf')" variant="primary">
                                    <feather-icon icon="FileTextIcon" />

                                </b-button>


                            </div>
                        </b-row>
                        <b-row v-if="toggleProgram"
                            class="my-2 years d-flex text-capitalize justify-content-start w-100 align-items-left ">
                            <b-col cols="12" md="4">
                                <v-select :program_filter="fuseSearch"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    v-model="program_filter.stage" :options="stages" class="w-100" clearable label="name"
                                    :reduce="val => val.id" :placeholder="$t('Global.stage')">
                                    <template slot="selected-option" slot-scope="option">
                                        <span v-if="$i18n.locale == 'ar'">
                                            {{ option.name_local || option.name }}
                                        </span>
                                        <span v-else>
                                            {{ option.name + ' ( ' + option.code + ' )' || option.name_local }}
                                        </span>
                                    </template>
                                    <template v-slot:option="option">
                                        {{ $i18n.locale == 'ar' ? option.name_local : option.name + ' ( ' + option.code + '
                                                                                ) ' }}
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>
                            <b-col cols="12" md="4" class="mb-1">
                                <v-select :program_filter="fuseSearch"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    v-model="program_filter.level" :options="level" label="name" class="w-100"
                                    :reduce="(val) => val.level_number" :placeholder="$t('levels')">
                                    <template #selected-option="{ name, name_local }">
                                        <div style="display: flex; align-items: baseline">
                                            <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                                            <strong v-else>{{ name }} </strong>
                                        </div>
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                            {{
                                                $i18n.locale == "en"
                                                ? option.name
                                                    ? option.name
                                                    : option.name_local
                                                : option.name_local
                                                    ? option.name_local
                                                    : option.name
                                            }}
                                        </div>
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>
                            <b-col cols="12" md="4">

                                <v-select :program_filter="fuseSearch"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    v-model="program_form.academicYear" :options="years" class="w-100 bg-white" clearable
                                    label="start_year" :reduce="(val) => val.id" :placeholder="$t('Global.academic_year')">
                                    <template v-slot:option="option">
                                        <span>
                                            {{ option.start_year && option.end_year ? option.start_year + ' / ' +
                                                option.end_year
                                                : '' }}
                                        </span>

                                    </template>
                                    <template #selected-option="{ start_year, end_year }">
                                        {{ start_year && end_year ? start_year + ' / ' + end_year : '' }}
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>


                            </b-col>
                            <b-col cols="12" md="4">
                                <v-select :program_filter="fuseSearch"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" id="currency"
                                    v-model="program_filter.currency" :options="currency" label="currency" class="w-100"
                                    :reduce="(val) => val.id" :placeholder="$t('currency')">
                                    <template #selected-option="{ name, name_local }">
                                        <div style="display: flex; align-items: baseline">
                                            <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                                            <strong v-else>{{ name }} </strong>
                                        </div>
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                            {{
                                                $i18n.locale == "en"
                                                ? option.name
                                                    ? option.name
                                                    : option.name_local
                                                : option.name_local
                                                    ? option.name_local
                                                    : option.name
                                            }}
                                        </div>
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>
                            <b-col cols="12" md="4" class="mb-1">
                                <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" id="date_from" ref="date_from"
                                    v-model="program_filter.date_from" :placeholder="$t('date_from')" />
                            </b-col>
                            <b-col cols="12" md="4" class="mb-1">
                                <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" id="date_to" ref="date_to"
                                    v-model="program_filter.date_to" :placeholder="$t('date_to')" />
                            </b-col>



                        </b-row>
                    </b-col>
                    <b-col sm="12">
                        <TabTable :head="true" :load="load" :label="labelUndergrade" :items="tableDataWithOverallSum"
                            :fields="fields" :Grad="true" :levels="false" :inner="innerFields" />
                    </b-col>
                </b-card-body>
            </b-card>

            <b-card>
                <b-card-body>
                    <b-col sm="12">
                        <b-row class="my-2 d-flex text-capitalize justify-content-between w-100 align-items-center ">
                            <div class="mx-2 my-1">
              <h3  class="m-0">
                {{ labellevel }}
              </h3>
            </div>

                            <div>
                                <b-button @click="toggleLevel = !toggleLevel" class="btn-icon ml-1"
                                    v-b-tooltip.hover="$t('Global.filter')" variant="primary">
                                    <feather-icon icon="SlidersIcon" />
                                </b-button>
                                <b-button @click="reset()" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.reset')"
                                    variant="primary">
                                    <feather-icon icon="RefreshCcwIcon" />
                                </b-button>
                                <b-button v-if="hasPermission('access_PDF_financials')" @click="downloadLevelsPDF('ug')"
                                    class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_pdf')" variant="primary">
                                    <feather-icon icon="FileTextIcon" />

                                </b-button>


                            </div>
                        </b-row>
                        <b-row v-if="toggleLevel"
                            class="my-2 years d-flex text-capitalize justify-content-start w-100 align-items-left ">
                            <b-col cols="12" md="4">
                                <v-select :levels_filter="fuseSearch"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="levels_filter.stage"
                                    :options="stages" class="w-100" clearable label="name" :reduce="val => val.id"
                                    :placeholder="$t('Global.stage')">
                                    <template slot="selected-option" slot-scope="option">
                                        <span v-if="$i18n.locale == 'ar'">
                                            {{ option.name_local || option.name }}
                                        </span>
                                        <span v-else>
                                            {{ option.name + ' ( ' + option.code + ' )' || option.name_local }}
                                        </span>
                                    </template>
                                    <template v-slot:option="option">
                                        {{ $i18n.locale == 'ar' ? option.name_local : option.name + ' ( ' + option.code + '
                                                                                ) ' }}
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>
                            <b-col cols="12" md="4" class="mb-1">
                                <v-select :levels_filter="fuseSearch"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="levels_filter.level"
                                    :options="level" label="name" class="w-100" :reduce="(val) => val.level_number"
                                    :placeholder="$t('levels')">
                                    <template #selected-option="{ name, name_local }">
                                        <div style="display: flex; align-items: baseline">
                                            <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                                            <strong v-else>{{ name }} </strong>
                                        </div>
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                            {{
                                                $i18n.locale == "en"
                                                ? option.name
                                                    ? option.name
                                                    : option.name_local
                                                : option.name_local
                                                    ? option.name_local
                                                    : option.name
                                            }}
                                        </div>
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>
                            <b-col cols="12" md="4">

                                <v-select :levels_filter="fuseSearch"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    v-model="levels_form.academicYear" :options="years" class="w-100 bg-white" clearable
                                    label="start_year" :reduce="(val) => val.id" :placeholder="$t('Global.academic_year')">
                                    <template v-slot:option="option">
                                        <span>
                                            {{ option.start_year && option.end_year ? option.start_year + ' / ' +
                                                option.end_year
                                                : '' }}
                                        </span>

                                    </template>
                                    <template #selected-option="{ start_year, end_year }">
                                        {{ start_year && end_year ? start_year + ' / ' + end_year : '' }}
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>


                            </b-col>
                            <b-col cols="12" md="4">
                                <v-select :levels_filter="fuseSearch"
                                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" id="currency"
                                    v-model="levels_filter.currency" :options="currency" label="currency" class="w-100"
                                    :reduce="(val) => val.id" :placeholder="$t('currency')">
                                    <template #selected-option="{ name, name_local }">
                                        <div style="display: flex; align-items: baseline">
                                            <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                                            <strong v-else>{{ name }} </strong>
                                        </div>
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                            {{
                                                $i18n.locale == "en"
                                                ? option.name
                                                    ? option.name
                                                    : option.name_local
                                                : option.name_local
                                                    ? option.name_local
                                                    : option.name
                                            }}
                                        </div>
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>
                            <b-col cols="12" md="4" class="mb-1">
                                <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" id="date_from" ref="date_from"
                                    v-model="levels_filter.date_from" :placeholder="$t('date_from')" />
                            </b-col>
                            <b-col cols="12" md="4" class="mb-1">
                                <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" id="date_to" ref="date_to"
                                    v-model="levels_filter.date_to" :placeholder="$t('date_to')" />
                            </b-col>



                        </b-row>
                    </b-col>
                    <b-col sm="12">
                        <TabTable :head="true" :load="load" :label="labellevel" :items="tableDataWithOverallSumLevel"
                            :fields="fields" :levels="true" :Grad="false" :inner="innerFieldsLevels" />
                    </b-col>
                </b-card-body>
            </b-card>

            <b-card>
                <b-card-header>
                    <b-row class="my-2 d-flex text-capitalize justify-content-between align-items-center w-100">
                        <!-- Additional content goes here -->
                    </b-row>
                </b-card-header>

                <b-card-body>
                    <b-col sm="12">
                        <b-row class="my-2 d-flex text-capitalize justify-content-between w-100 align-items-center ">
                            <div class="mx-2 my-1">
              <h3  class="m-0">
                {{ labelGrad }}
              </h3>
            </div>

                            <div>
                                <b-button @click="toggleGraduates = !toggleGraduates" class="btn-icon ml-1"
                                    v-b-tooltip.hover="$t('Global.filter')" variant="primary">
                                    <feather-icon icon="SlidersIcon" />
                                </b-button>
                                <b-button @click="reset()" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.reset')"
                                    variant="primary">
                                    <feather-icon icon="RefreshCcwIcon" />
                                </b-button>
                                <b-button v-if="hasPermission('access_PDF_financials')" @click="downloadPDF('ug')"
                                    class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_pdf')" variant="primary">
                                    <feather-icon icon="FileTextIcon" />

                                </b-button>


                            </div>
                        </b-row>
                        <b-row v-if="toggleGraduates"
                            class="my-2 years d-flex text-capitalize justify-content-start w-100 align-items-left ">
                            <b-col cols="12" md="4">
                                <v-select :graduates_filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    v-model="graduates_filter.stage" :options="stages" class="w-100" clearable label="name"
                                    :reduce="val => val.id" :placeholder="$t('Global.stage')">
                                    <template slot="selected-option" slot-scope="option">
                                        <span v-if="$i18n.locale == 'ar'">
                                            {{ option.name_local || option.name }}
                                        </span>
                                        <span v-else>
                                            {{ option.name + ' ( ' + option.code + ' )' || option.name_local }}
                                        </span>
                                    </template>
                                    <template v-slot:option="option">
                                        {{ $i18n.locale == 'ar' ? option.name_local : option.name + ' ( ' + option.code + '
                                                                                ) ' }}
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>

                            <b-col cols="12" md="4" class="mb-1">
                                <v-select :graduates_filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    v-model="graduates_filter.level" :options="level" label="name" class="w-100"
                                    :reduce="(val) => val.level_number" :placeholder="$t('levels')">
                                    <template #selected-option="{ name, name_local }">
                                        <div style="display: flex; align-items: baseline">
                                            <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                                            <strong v-else>{{ name }} </strong>
                                        </div>
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                            {{
                                                $i18n.locale == "en"
                                                ? option.name
                                                    ? option.name
                                                    : option.name_local
                                                : option.name_local
                                                    ? option.name_local
                                                    : option.name
                                            }}
                                        </div>
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>
                            <b-col cols="12" md="4">

                                <v-select :graduates_filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    v-model="graduates_form.academicYear" :options="years" class="w-100 bg-white" clearable
                                    label="start_year" :reduce="(val) => val.id" :placeholder="$t('Global.academic_year')">
                                    <template v-slot:option="option">
                                        <span>
                                            {{ option.start_year && option.end_year ? option.start_year + ' / ' +
                                                option.end_year
                                                : '' }}
                                        </span>

                                    </template>
                                    <template #selected-option="{ start_year, end_year }">
                                        {{ start_year && end_year ? start_year + ' / ' + end_year : '' }}
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>


                            </b-col>
                            <b-col cols="12" md="4">
                                <v-select :graduates_filter="fuseSearch" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                    id="currency" v-model="graduates_filter.currency" :options="currency" label="currency"
                                    class="w-100" :reduce="(val) => val.id" :placeholder="$t('currency')">
                                    <template #selected-option="{ name, name_local }">
                                        <div style="display: flex; align-items: baseline">
                                            <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                                            <strong v-else>{{ name }} </strong>
                                        </div>
                                    </template>
                                    <template slot="option" slot-scope="option">
                                        <div class="d-center">
                                            {{
                                                $i18n.locale == "en"
                                                ? option.name
                                                    ? option.name
                                                    : option.name_local
                                                : option.name_local
                                                    ? option.name_local
                                                    : option.name
                                            }}
                                        </div>
                                    </template>
                                    <template #no-options>
                                        {{ $t('noMatching') }}
                                    </template>
                                </v-select>
                            </b-col>
                            <b-col cols="12" md="4" class="mb-1">
                                <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" id="date_from" ref="date_from"
                                    v-model="graduates_filter.date_from" :placeholder="$t('date_from')" />
                            </b-col>
                            <b-col cols="12" md="4" class="mb-1">
                                <b-form-datepicker :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" id="date_to" ref="date_to"
                                    v-model="graduates_filter.date_to" :placeholder="$t('date_to')" />
                            </b-col>



                        </b-row>
                    </b-col>
                    <b-col sm="12">
                        <TabTable :head="true" :load="load" :label="labelGrad" :items="tableDataWithOverallSumEgGrad"
                            :fields="fieldsGrads" :levels="false" :inner="innerFieldsGrads" />
                    </b-col>
                </b-card-body>
            </b-card>

        </b-overlay>


    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import request from '@/utils/request';
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
    BFormDatepicker,
    BForm,
} from 'bootstrap-vue'
import vSelect from 'vue-select';
import TabTable from "@/views/reports/components/financialTable";
import Ripple from 'vue-ripple-directive'
export default {
    name: 'Financial',
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
        BFormDatepicker,
        BLink,
        BCardBody,
        BLink,
        BAvatar,
        BButtonGroup,
        BButton,
        BImg,
        BModal,
        BInputGroup,
        BFormTextarea,
        BFormGroup,
        BForm,
        vSelect
    },
    directives: {
        // 'b-modal': VBModal,
        Ripple,
    },
    data() {
        return {
            labelUndergrade: this.$t('Global.Students Payments Report Per Program'),
            labelGrad: this.$t('Global.Graduates Payments Report'),
            labellevel: this.$t('Global.Students Payments Report Per Level'),
            labellevelUSD: "Students Payments Report Per Level",
            years: [],
            level: [],
            initialChange: true,
            levels_initialChange: true,
            graduates_initialChange: true,
            toggleProgram: false,
            toggleLevel: false,
            toggleGraduates: false,
            program_form: {
                academicYear: null,
                level: null,
            },
            program_filter: {
                date_from: null,
                date_to: null,
                currency: null,
                stage: null,
            },
            levels_form: {
                academicYear: null,
                level: null,
            },
            levels_filter: {
                date_from: null,
                date_to: null,
                currency: null,
                stage: null,
            },
           graduates_form: {
                academicYear: null,
                level: null,
            },
           graduates_filter: {
                date_from: null,
                date_to: null,
                currency: null,
                stage: null,
            },

        }
    },
    mounted() {
        this.stages()
        this.getcurrency().then(_ => {
            this.init()
        })

        this.getYears()

    },
    watch: {
        'program_filter.currency': function (n, o) {
            if (this.initialChange) {
                this.initialChange = false;
                return;
            }

            if (n) {
                this.getFinancial(this.program_form.academicYear, this.program_filter.date_from, this.program_filter.date_to, this.program_form.level, this.program_filter.currency, this.program_filter.stage);
            } else {
                this.getFinancial();
            }
        },
        'program_filter.stage': function (n) {
            if (n) {
                this.getFinancial(this.program_form.academicYear, this.program_filter.date_from, this.program_filter.date_to, this.program_form.level, this.program_filter.currency, this.program_filter.stage);
                return
            }
            this.getFinancial()
        },
        'program_form.academicYear': function (n) {
            if (n) {
                this.getFinancial(this.program_form.academicYear, this.program_filter.date_from, this.program_filter.date_to, this.program_form.level, this.program_filter.currency, this.program_filter.stage);
                return
            }
            this.getFinancial()
        },
        'program_filter.date_from': function (n) {
            if (n) {
                this.getFinancial(this.program_form.academicYear, this.program_filter.date_from, this.program_filter.date_to, this.program_form.level, this.program_filter.currency, this.program_filter.stage);
                return
            }
            this.getFinancial()
        },
        'program_filter.level': function (n) {
            if (n) {
                this.getFinancial(this.program_form.academicYear, this.program_filter.date_from, this.program_filter.date_to, this.program_form.level, this.program_filter.currency, this.program_filter.stage);
                return
            }
            this.getFinancial()
        },
        'program_filter.date_to': function (n) {
            if (n) {
                this.getFinancial(this.program_form.academicYear, this.program_filter.date_from, this.program_filter.date_to, this.program_form.level, this.program_filter.currency, this.program_filter.stage);
                return
            }
            this.getFinancial()
        },
        'levels_filter.currency': function (n, o) {
            if (this.levels_initialChange) {
                this.levels_initialChange = false;
                return;
            }

            if (n) {
                this.getLevelsFinancial(this.levels_form.academicYear, this.levels_filter.date_from, this.levels_filter.date_to, this.levels_form.level, this.levels_filter.currency, this.levels_filter.stage);
            } else {
                this.getLevelsFinancial();
            }
        },
        'levels_filter.stage': function (n) {
            if (n) {
                this.getLevelsFinancial(this.levels_form.academicYear, this.levels_filter.date_from, this.levels_filter.date_to, this.levels_form.level, this.levels_filter.currency, this.levels_filter.stage);
                return
            }
            this.getLevelsFinancial()
        },
        'levels_form.academicYear': function (n) {
            if (n) {
                this.getLevelsFinancial(this.levels_form.academicYear, this.levels_filter.date_from, this.levels_filter.date_to, this.levels_form.level, this.levels_filter.currency, this.levels_filter.stage);
                return
            }
            this.getLevelsFinancial()
        },
        'levels_filter.date_from': function (n) {
            if (n) {
                this.getLevelsFinancial(this.levels_form.academicYear, this.levels_filter.date_from, this.levels_filter.date_to, this.levels_form.level, this.levels_filter.currency, this.levels_filter.stage);
                return
            }
            this.getLevelsFinancial()
        },
        'levels_filter.level': function (n) {
            if (n) {
                this.getLevelsFinancial(this.levels_form.academicYear, this.levels_filter.date_from, this.levels_filter.date_to, this.levels_form.level, this.levels_filter.currency, this.levels_filter.stage);
                return
            }
            this.getLevelsFinancial()
        },
        'levels_filter.date_to': function (n) {
            if (n) {
                this.getLevelsFinancial(this.levels_form.academicYear, this.levels_filter.date_from, this.levels_filter.date_to, this.levels_form.level, this.levels_filter.currency, this.levels_filter.stage);
                return
            }
            this.getLevelsFinancial()
        },
        'graduates_filter.currency': function (n, o) {
            if (this.graduates_initialChange) {
                this.graduates_initialChange = false;
                return;
            }

            if (n) {
                this.getGraduatesFinancial(this.graduates_form.academicYear, this.graduates_filter.date_from, this.graduates_filter.date_to, this.graduates_form.level, this.graduates_filter.currency, this.graduates_filter.stage);
            } else {
                this.getGraduatesFinancial();
            }
        },
        'graduates_filter.stage': function (n) {
            if (n) {
                this.getGraduatesFinancial(this.graduates_form.academicYear, this.graduates_filter.date_from, this.graduates_filter.date_to, this.graduates_form.level, this.graduates_filter.currency, this.graduates_filter.stage);
                return
            }
            this.getGraduatesFinancial()
        },
        'graduates_form.academicYear': function (n) {
            if (n) {
                this.getGraduatesFinancial(this.graduates_form.academicYear, this.graduates_filter.date_from, this.graduates_filter.date_to, this.graduates_form.level, this.graduates_filter.currency, this.graduates_filter.stage);
                return
            }
            this.getGraduatesFinancial()
        },
        'graduates_filter.date_from': function (n) {
            if (n) {
                this.getGraduatesFinancial(this.graduates_form.academicYear, this.graduates_filter.date_from, this.graduates_filter.date_to, this.graduates_form.level, this.graduates_filter.currency, this.graduates_filter.stage);
                return
            }
            this.getGraduatesFinancial()
        },
        'graduates_filter.level': function (n) {
            if (n) {
                this.getGraduatesFinancial(this.graduates_form.academicYear, this.graduates_filter.date_from, this.graduates_filter.date_to, this.graduates_form.level, this.graduates_filter.currency, this.graduates_filter.stage);
                return
            }
            this.getGraduatesFinancial()
        },
        'graduates_filter.date_to': function (n) {
            if (n) {
                this.getGraduatesFinancial(this.graduates_form.academicYear, this.graduates_filter.date_from, this.graduates_filter.date_to, this.graduates_form.level, this.graduates_filter.currency, this.graduates_filter.stage);
                return
            }
            this.getGraduatesFinancial()
        },
        '$i18n.locale': function () {
            this.init()
        }
    },
    computed: {
        ...mapGetters({
            load: "Report/load",
            financial: "Report/financial",
            levelsfinancial: "Report/levelsfinancial",
            graduatesfinancial: "Report/graduatesfinancial",
        }),
        fields() {
            return [
                {
                    key: 'faculty',
                    label: this.$t('Global.faculty'),
                    thStyle: { width: '20%' },
                },
                {
                    key: 'eg_paid_studing',
                    label: this.$t('Global.paid'),
                    formatter: (value) => (value !== null ? value.toLocaleString() : ""),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_unpaid_studing',
                    label: this.$t('Global.unpaid'),
                    formatter: (value) => (value !== null ? value.toLocaleString() : ""),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_studing',
                    label: this.$t('Global.total'),
                    formatter: (value) => (value !== null ? value.toLocaleString() : ""),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'E_wallet',
                    label: this.$t('Global.E_wallet'),
                    formatter: (value) => (value !== null ? value.toLocaleString() : ""),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_paid_studing',
                    label: this.$t('Global.paid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_partiallypaid_studing',
                    label: this.$t('Global.partiallypaid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_notpaid_studing',
                    label: this.$t('Global.unpaid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_studing',
                    label: this.$t('Global.total'),
                    thStyle: { width: '10%' },
                },



            ]

        },
        innerFieldsLevels() {
            return [
                {
                    key: 'programs',
                    label: this.$t('Global.level'),
                    thStyle: { width: '20%' },
                },
                {
                    key: 'eg_paid_studing',
                    label: this.$t('Global.paid'),
                    formatter: (value) => value.toLocaleString(),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_unpaid_studing',
                    label: this.$t('Global.unpaid'),
                    formatter: (value) => value.toLocaleString(),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_studing',
                    label: this.$t('Global.total'),
                    formatter: (value) => value.toLocaleString(),
                    thStyle: { width: '10%' },
                },


                {
                    key: 'eg_total_students_paid_studing',
                    label: this.$t('Global.paid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_partiallypaid_studing',
                    label: this.$t('Global.partiallypaid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_notpaid_studing',
                    label: this.$t('Global.unpaid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_studing',
                    label: this.$t('Global.total'),
                    thStyle: { width: '10%' },
                },
            ]
        },
        fieldsGrads() {
            return [
                {
                    key: 'faculty',
                    label: this.$t('Global.faculty'),
                    thStyle: { width: '20%' },
                },
                {
                    key: 'eg_paid_grad',
                    label: this.$t('Global.paid'),

                    formatter: (value) => value.toLocaleString()
                },
                {
                    key: 'eg_unpaid_grad',
                    label: this.$t('Global.unpaid'),
                    formatter: (value) => value.toLocaleString()
                },
                {
                    key: 'eg_total_grad',
                    label: this.$t('Global.total'),
                    formatter: (value) => value.toLocaleString()
                },
                {
                    key: 'E_wallet',
                    label: '',
                    formatter: (value) => (value !== null ? value.toLocaleString() : ""),

                },
                {
                    key: 'eg_paid_grad_students',
                    label: this.$t('Global.paid'),

                },

                {
                    key: 'eg_partiallypaid_grad_students',
                    label: this.$t('Global.partiallypaid'),

                },
                {
                    key: 'eg_notpaid_grad_students',
                    label: this.$t('Global.unpaid'),
                },
                {
                    key: 'eg_total_grad_students',
                    label: this.$t('Global.total'),

                },



            ]

        },
        innerFields() {
            return [
                {
                    key: 'programs',
                    label: this.$t('Global.program'),
                    thStyle: { width: '20%' },
                },
                {
                    key: 'eg_paid_studing',
                    label: this.$t('Global.paid'),
                    formatter: (value) => value.toLocaleString(),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_unpaid_studing',
                    label: this.$t('Global.unpaid'),
                    formatter: (value) => value.toLocaleString(),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_studing',
                    label: this.$t('Global.total'),
                    formatter: (value) => value.toLocaleString(),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'E_wallet',
                    label: this.$t('Global.E_wallet'),
                    formatter: (value) => (value !== null ? value.toLocaleString() : ""),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_paid_studing',
                    label: this.$t('Global.paid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_partiallypaid_studing',
                    label: this.$t('Global.partiallypaid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_notpaid_studing',
                    label: this.$t('Global.unpaid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_total_students_studing',
                    label: this.$t('Global.total'),
                    thStyle: { width: '10%' },
                },


            ]

        },
        innerFieldsGrads() {
            return [
                {
                    key: 'programs',
                    label: this.$t('Global.program'),
                    thStyle: { width: '20%' },
                },
                {
                    key: 'eg_paid_grad',
                    label: this.$t('Global.paid'),
                },
                {
                    key: 'eg_unpaid_grad',
                    label: this.$t('Global.unpaid'),

                },
                {
                    key: 'eg_total_grad',
                    label: this.$t('Global.total'),

                },
                {
                    key: 'eg_paid_grad_students',
                    label: this.$t('Global.paid'),
                },
                {
                    key: 'eg_partiallypaid_grad_students',
                    label: this.$t('Global.partiallypaid'),
                    thStyle: { width: '10%' },
                },
                {
                    key: 'eg_notpaid_grad_students',
                    label: this.$t('Global.unpaid'),
                },
                {
                    key: 'eg_total_grad_students',
                    label: this.$t('Global.total'),
                },


            ]

        },
        tableDataWithOverallSum() {
            let financial = this.collectData(this.convertToArray(this.financial.eg_data))
            let otherFacutly = this.collectData(this.convertToArray(this.financial.eg_data_Other))
            const overallSum = this.calculateOverallSum(financial);
            let lang;
            if (this.$i18n.locale == 'en') {
                lang = 'Total Sum'
            } else {
                lang = 'المجموع'
            }
            const overallSumRow = {

                faculty: lang,
                faculty_local: 'المجموع',
                eg_paid_studing: overallSum.paid_sum,
                eg_unpaid_studing: overallSum.unpaid_sum,
                eg_total_studing: overallSum.total_sum,
                E_wallet: overallSum.E_wallet,
                eg_total_students_paid_studing: overallSum.paid_student_sum,
                eg_total_students_partiallypaid_studing: overallSum.partiallypaid_student_sum,
                eg_total_students_notpaid_studing: overallSum.unpaid_student_sum,
                eg_total_students_studing: overallSum.total_student_sum,
            };

            if (Array.isArray(financial)) {
                return [...financial, overallSumRow];
            } else {
                return [overallSumRow];
            }
        },
        // tableDataWithOverallSumLevel() {
        //     let financial = this.collectData(this.convertToArray(this.levelsfinancial.eg_data_level))
        //     // let otherFacutly = this.collectData(this.convertToArray(this.financial.eg_data_Other))
        //     const overallSumLevels = this.calculateOverallSum(financial);
        //     let lang;
        //     if (this.$i18n.locale == 'en') {
        //         lang = 'Total Sum'
        //     } else {
        //         lang = 'المجموع'
        //     }
        //     const overallSumRowlevels = {

        //         faculty: lang,
        //         faculty_local: 'المجموع',
        //         eg_paid_studing: overallSumLevels.paid_sum,
        //         eg_unpaid_studing: overallSumLevels.unpaid_sum,
        //         eg_total_studing: overallSumLevels.total_sum,
        //         eg_total_students_paid_studing: overallSumLevels.paid_student_sum,
        //         eg_total_students_partiallypaid_studing: overallSumLevels.partiallypaid_student_sum,
        //         eg_total_students_notpaid_studing: overallSumLevels.unpaid_student_sum,
        //         eg_total_students_studing: overallSumLevels.total_student_sum,
        //         E_wallet: overallSumLevels.E_wallet
        //     };

        //     if (Array.isArray(financial)) {
        //         return [...financial, overallSumRowlevels];
        //     } else {
        //         return [overallSumRowlevels];
        //     }
        // },

        tableDataWithOverallSumEgGrad() {
            let financial = this.collectDataGrad(this.convertToArray(this.graduatesfinancial.eg_data_G))
            const overallSumGraduates = this.calculateOverallSumGrad(financial);
            let lang;
            if (this.$i18n.locale == 'en') {
                lang = 'Total Sum'
            } else {
                lang = 'المجموع'
            }
            const overallSumRowGraduates = {

                faculty: lang,
                faculty_local: 'المجموع',
                eg_paid_grad: overallSumGraduates.paid_sum,
                eg_unpaid_grad: overallSumGraduates.unpaid_sum,
                eg_total_grad: overallSumGraduates.total_sum,
                eg_paid_grad_students: overallSumGraduates.paid_student_sum,
                eg_partiallypaid_grad_students: overallSumGraduates.partiallypaid_student_sum,
                eg_notpaid_grad_students: overallSumGraduates.unpaid_student_sum,
                eg_total_grad_students: overallSumGraduates.total_student_sum,
                E_wallet: overallSumGraduates.E_wallet,
            };

            if (Array.isArray(financial)) {
                return [...financial, overallSumRowGraduates];
            } else {
                return [overallSumRowGraduates];
            }
        },

    },
    methods: {
        downloadPDF(type) {
            let query = {
                'data': this.program_form.academicYear,
                'level': this.program_form.level,
                'currency': this.program_filter.currency,
                'stage': this.program_filter.stage,
                'date_from': this.program_filter.date_from,
                'date_to': this.program_filter.date_to,
                'lang': this.$i18n.locale,
                'type': type
            };
            this.downloadReport(query, type)
        },
        downloadLevelsPDF(type) {
            let query = {
                'data': this.levels_form.academicYear,
                'level': this.levels_form.level,
                'currency': this.levels_filter.currency,
                'stage': this.levels_filter.stage,
                'date_from': this.levels_filter.date_from,
                'date_to': this.levels_filter.date_to,
                'lang': this.$i18n.locale,
                'type': type
            };
            this.downloadLevelsReport(query, type)
        },
        reset() {
            let terms = [
                "term_id",
                "admission_term_id",
                "admission_term_PG_id",
                "admission_term_UG_id",
                "control_term_id",
                "exam_term_id",
                "transfer_term_id",
            ];
            let query = { ...this.$route.query, ...{} };
            let currentTerm = terms.find((el) => {
                return Object.keys(query).some((qu) => {
                    return el == qu;
                });
            });
            Object.keys(query).forEach((key) => {
                if (key != currentTerm && key != "removed" && key != "export") {
                    this.filter[key] = null;
                }
            });
            this.resetFilterQueryParams(terms);
        },
        init() {
            this.program_filter.currency = this.program_filter.currency ? this.program_filter.currency : 1;
            this.levels_filter.currency = this.levels_filter.currency ? this.levels_filter.currency : 1;
            this.graduates_filter.currency = this.graduates_filter.currency ? this.graduates_filter.currency : 1;
            let query = {
                'lang': this.$i18n.locale,
                'currency': this.program_filter.currency ? this.program_filter.currency : 1
            };
            this.getItem(query);
            this.getLevelsItem(query);
            this.getGraduatesItem(query);
        },
        ...mapActions('Report', {
            getItem: 'getFinancial',
            getLevelsItem: 'getLevelsFinancial',
            getGraduatesItem: 'getGraduatesFinancial',
            downloadReport: "downloadReport",
            downloadLevelsReport: "downloadLevelsReport",
        }),
        getFinancial(data, date_from, date_to) {
            let query = {
                'data': data,
                'date_from': date_from,
                'date_to': date_to,
                'stage': this.program_filter.stage,
                'currency': this.program_filter.currency,
                'lang': this.$i18n.locale
            };
            this.getItem(query);
        },
        getLevelsFinancial(data, date_from, date_to) {
            let query = {
                'data': data,
                'date_from': date_from,
                'date_to': date_to,
                'stage': this.levels_filter.stage,
                'currency': this.levels_filter.currency,
                'lang': this.$i18n.locale
            };
            this.getLevelsItem(query);
        },
        getGraduatesFinancial(data, date_from, date_to) {
            let query = {
                'data': data,
                'date_from': date_from,
                'date_to': date_to,
                'stage': this.graduates_filter.stage,
                'currency': this.graduates_filter.currency,
                'lang': this.$i18n.locale
            };
            this.getGraduatesItem(query);
        },
        async getYears() {
            await request.get("/reports/years").then(res => {
                this.years = res.data
                this.level = res.meta.lookups
            }).catch(err => {
            })
        },
        async getcurrency() {
            await request.get("/reports/currency").then(res => {
                this.currency = res.data
            }).catch(err => {
            })
        },
        async stages() {
            await request.get("/reports/stages").then(res => {
                this.stages = res.data
            }).catch(err => {
            })
        },
        calculateOverallSum(financials) {
            let paidSum = 0;
            let unpaidSum = 0;
            let totalSum = 0;
            let paidStudentSum = 0;
            let E_wallet = 0;
            let partiallypaidStudentSum = 0;
            let unpaidStudentSum = 0;
            let totalStudentSum = 0;


            if (Array.isArray(financials)) {
                for (const financial of financials) {
                    paidSum += financial.eg_paid_studing;
                    unpaidSum += financial.eg_unpaid_studing;
                    totalSum += financial.eg_total_studing;
                    E_wallet += financial.E_wallet;
                    paidStudentSum += financial.eg_total_students_paid_studing;
                    partiallypaidStudentSum += financial.eg_total_students_partiallypaid_studing;
                    unpaidStudentSum += financial.eg_total_students_notpaid_studing;
                    totalStudentSum += financial.eg_total_students_studing;
                }
            }
            return {
                paid_sum: paidSum, unpaid_sum: unpaidSum, total_sum: totalSum,
                paid_student_sum: paidStudentSum, partiallypaid_student_sum: partiallypaidStudentSum,
                unpaid_student_sum: unpaidStudentSum, total_student_sum: totalStudentSum, E_wallet: E_wallet
            };
        },


        calculateOverallSumGrad(financials) {
            let paidSum = 0;
            let unpaidSum = 0;
            let totalSum = 0;
            let paidStudentSum = 0;
            let partiallypaidStudentSum = 0;
            let unpaidStudentSum = 0;
            let totalStudentSum = 0;


            if (Array.isArray(financials)) {
                for (const financial of financials) {
                    paidSum += financial.eg_paid_grad;
                    unpaidSum += financial.eg_unpaid_grad;
                    totalSum += financial.eg_total_grad;
                    paidStudentSum += financial.eg_paid_grad_students;
                    partiallypaidStudentSum += financial.eg_partiallypaid_grad_students;
                    unpaidStudentSum += financial.eg_notpaid_grad_students;
                    totalStudentSum += financial.eg_total_grad_students;
                }
            }
            return {
                paid_sum: paidSum, unpaid_sum: unpaidSum, total_sum: totalSum,
                paid_student_sum: paidStudentSum, partiallypaid_student_sum: partiallypaidStudentSum,
                unpaid_student_sum: unpaidStudentSum, total_student_sum: totalStudentSum
            };
        },
    }
}
</script>
