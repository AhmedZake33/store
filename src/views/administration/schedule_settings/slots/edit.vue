<template>
    <div>
        <edit-component :name="title">
            <template #inputs>
                <validation-observer ref="simpleRules">
                    <b-form
                        ref="form"
                        @submit.stop.prevent="save"
                    >
                        <div v-if="load" style="
                            position: absolute;
                            width: 100%;
                            top:0;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            background-color: #fff;
                            opacity: 0.8;
                            text-align: center;
                            z-index: 999;
                            "
                        >
                            <b-spinner variant="primary" style="position: absolute;top: 70px;z-index: 1000" />
                        </div>
                        <b-row v-else>
                            <b-col md="6">
                                <b-form-group
                                    class="left_right"
                                    :label="$t('Global.period')"
                                    label-for="period-input"
                                >
                                <validation-provider
                                    #default="{ errors }"
                                    name="period"
                                    rules="required"
                                >
                                    <b-form-input
                                        id="period-input"
                                        v-model="form.period"
                                    />
                                    <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'name')"/>
                                </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group
                                    :state="regularStartDateState"
                                    :label="$t('Global.start_time')"
                                    label-for="regular-date-start-input"
                                >
                                    <validation-provider
                                        #default="{ errors }"
                                        name="Regular Start DATE"
                                        rules="required"
                                    >
                                        <!-- <flat-pickr
                                            id="regular-date-start-input"
                                            v-model="form.regular_time_start"
                                            class="form-control"
                                            :config="{  enableTime: true, dateFormat: 'Y-m-d H:i' }"
                                        /> -->
                                            <!-- altInput: true, altFormat: 'F j, Y', -->

                                            <flat-pickr
                                                v-model="form.regular_time_start"
                                                class="form-control"
                                                :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i K',}"
                                            />
                                        <small v-if="errors.length" class="text-danger">
                                        {{ validation(null, 0).message }}
                                        </small>
                                    </validation-provider>
                                    <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important"> {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].ar : '') : '' }}</small>
                                    <small v-else class="danger" style="color: red !important">
                                        {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].en : '') : '' }}
                                    </small>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group
                                    :state="regularEndDateState"
                                    :label="$t('Global.end_time')"
                                    label-for="regular-date-end-input"
                                >
                                    <validation-provider #default="{ errors }" name="End DATE" rules="required">
                                        <!-- <flat-pickr
                                            id="regular-date-end-input"
                                            v-model="form.regular_time_end"
                                            :style="[regularFlag ? {'background-color':'#eee'}:{'background-color':'#fff'}]"
                                            class="form-control"
                                            :disabled="regularFlag"
                                            :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' , minDate: form.regular_time_start}"
                                            :min="form.regular_time_start"
                                        /> -->
                                        <flat-pickr
                                            v-model="form.regular_time_end"
                                            class="form-control"
                                            :style="[regularFlag ? {'background-color':'#eee'}:{'background-color':'#fff'}]"
                                            :disabled="regularFlag"
                                            :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i K',  minDate: form.regular_time_start}"
                                        />
                                        <small v-if="errors.length" class="text-danger">
                                        {{ validation(null, 0).message }}
                                        </small>
                                    </validation-provider>
                                    <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important"> {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].ar : '') : '' }}</small>
                                    <small v-else class="danger" style="color: red !important">
                                        {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].en : '') : '' }}
                                    </small>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group :state="ramadanStartDateState"
                                    :label="$t('Global.ramadan_time_start')"
                                    label-for="ramadan-date-start-input"
                                >
                                    <!-- <validation-provider
                                        #default="{ errors }"
                                        name="Ramadan Start DATE"
                                        rules="required"
                                    > -->
                                        <!-- <flat-pickr
                                            id="ramadan-date-start-input"
                                            v-model="form.ramadan_time_start"
                                            class="form-control"
                                            :config="{ enableTime: true, dateFormat: 'Y-m-d H:i'}"
                                        /> -->
                                        <flat-pickr
                                            v-model="form.ramadan_time_start"
                                            class="form-control"
                                            :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i K',}"
                                        />
                                        <!-- <small v-if="errors.length" class="text-danger">
                                        {{ validation(null, 0).message }}
                                        </small> -->
                                    <!-- </validation-provider>
                                    <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important"> {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].ar : '') : '' }}</small>
                                    <small v-else class="danger" style="color: red !important">
                                        {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].en : '') : '' }}
                                    </small> -->
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group
                                    :state="ramadanEndDateState"
                                    :label="$t('Global.ramadan_time_end')"
                                    label-for="ramadan-date-end-input"
                                >
                                    <!-- <validation-provider
                                        #default="{ errors }"
                                        name="Ramadan End DATE"
                                        rules="required"
                                    > -->
                                        <!-- <flat-pickr
                                            id="ramadan-date-end-input"
                                            v-model="form.ramadan_time_end"
                                            :style="[ramadanFlag ? {'background-color':'#eee'}:{'background-color':'#fff'}]"
                                            class="form-control"
                                            :disabled="ramadanFlag"
                                            :config="{ enableTime: true, dateFormat: 'Y-m-d H:i', minDate: form.ramadan_time_start}"
                                        /> -->
                                        <flat-pickr
                                            v-model="form.ramadan_time_end"
                                            class="form-control"
                                            :disabled="ramadanFlag"
                                            :style="[ramadanFlag ? {'background-color':'#eee'}:{'background-color':'#fff'}]"
                                            :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i K', minDate: form.ramadan_time_start}"
                                        />
                                        <!-- <small v-if="errors.length" class="text-danger">
                                        {{ validation(null, 0).message }}
                                        </small> -->
                                    <!-- </validation-provider>
                                    <small v-if="$i18n.locale == 'ar'" class="danger" style="color: red !important"> {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].ar : '') : '' }}</small>
                                    <small v-else class="danger" style="color: red !important">
                                        {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].en : '') : '' }}
                                    </small> -->
                                </b-form-group>
                            </b-col>
                            <!-- submit and reset -->
                            <b-col md="12 mt-3">
                                <b-button
                                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                                    type="submit"
                                    variant="primary"
                                    class="mr-1"
                                >
                                    {{ $t('Global.save') }}
                                </b-button>
                                <b-button
                                    v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                                    type="reset"
                                    variant="outline-secondary"
                                    @click="cancel"
                                >
                                    {{ $t('Global.cancel') }}
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-form>
                </validation-observer>
            </template>
        </edit-component>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import EditComponent from '@/views/components/table/Edit'
import ValidationErrors from '@/views/components/common/ValidationErrors';
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { mapGetters, mapActions } from 'vuex'
import { required } from '@validations'
import { PlusIcon, DeleteIcon } from 'vue-feather-icons';
import { BCard, BRow, BCol, BFormGroup, BFormInput, BForm, BButton, BFormTextarea, BSpinner, BFormDatepicker, BPopover} from 'bootstrap-vue'
import { forEach } from 'postcss-rtl/lib/affected-props';

export default {
    name:'edit',
    components:{
        EditComponent,
        vSelect,
        ValidationErrors,
        required,
        DeleteIcon,
        PlusIcon,
        flatPickr,
        ValidationProvider,
        ValidationObserver,
        BForm,
        BFormGroup,
        BCard,
        BRow,
        BCol,
        BFormInput,
        BButton,
        BFormTextarea,
        BSpinner,
        BPopover,
        BFormDatepicker,
        localize,
    },
    directives: {
        Ripple,
    },
    computed:{
        ...mapGetters({
            lookups: 'slots/lookups',
            item: 'slots/item',
            load: 'slots/load',
        }),
        id() {
            return this.$route.params.id ? this.$route.params.id : null
        },
        title(){
            return this.id
                ? this.$t('Global.slot_edit')
                : this.$t('Global.slot_add')
        }
    },
    watch: {
        'form.regular_time_start':{
            handler(newVal,oldVal) {
                this.regularFlag= ( newVal != null ? false :  true )
            },
            deep: true
        },
        'form.ramadan_time_start':{
            handler(newVal,oldVal) {
                this.ramadanFlag= ( newVal != null ? false :  true )
            },
            deep: true
        },
    },
    data(){
        return{
            errorsdata: {},
            dateNtim: null,
            regularFlag: true,
            ramadanFlag: true,
            sliceFlag: true,
            regularStartDateState: null,
            regularEndDateState: null,
            ramadanStartDateState: null,
            ramadanEndDateState: null,
            form:{
                period: null,
                regular_time_start: null,
                regular_time_end: null,
                ramadan_time_start: null,
                ramadan_time_end: null
            }
        }
    },
    methods:{
        ...mapActions({
            //getLookups: 'slots/slots',
            getItem: 'slots/get',
        }),
        init(){
            //this.getLookups()
            if (this.id) {
                this.getItem(this.id).then(_ => {
                    this.form.period = this.item.period
                    this.form.regular_time_start = this.item.regular_time_start
                    this.form.regular_time_end = this.item.regular_time_end
                    this.form.ramadan_time_start = this.item.ramadan_time_start
                    this.form.ramadan_time_end = this.item.ramadan_time_end
                })
            }
        },
        cancel(){
            this.$router.push({ name: 'schedule-settings', query: {tabNum: 2 } })
        },
        save(){
            this.$refs.simpleRules.validate().then(success =>{
                if (success) {
                    if(this.sliceFlag){
                        this.form.regular_time_start = this.form.regular_time_start.slice(0, -3);
                        this.form.regular_time_end = this.form.regular_time_end.slice(0, -3);
                        this.form.ramadan_time_start = this.form.ramadan_time_start.slice(0, -3);
                        this.sliceFlag = false
                    }

                    this.form.ramadan_time_end = this.form.ramadan_time_end.slice(0, -3);
                    const payload = { id: this.id, query: this.form }
                    this.$store.dispatch('slots/put', payload ).then(response => {
                    this.$swal({
                                icon: 'success',
                                title: `${this.$t('Global.saved')}`,
                                showConfirmButton: false,
                                timer: 1500,
                            })
                        this.$router.push({ name: 'schedule-settings', query: {tabNum: 2 } })

                    }).catch(error => {
                        this.$swal({
                            icon: 'error',
                            text: `${this.$t('Global.errorMessage')}`,
                            showConfirmButton: false,
                            timer: 1500,
                        })
                    })
                }
            })
        }
    },
    mounted() {
        this.init()
    }
}
</script>

<style scoped lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
