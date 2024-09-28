<template>
    <div>
        <Years @edit="openDialog" :reload="refresh"></Years>
        <b-modal id="modalPopover" v-model="dialog" no-close-on-backdrop size="lg"
                 :title="year_id? $t('Global.edit_year') : $t('Global.add_year')">
            <validation-observer ref="simpleRules1">
                <b-form class="" ref="simpleRules1">
                    <div class="row">
                        <b-col md="6" @click="showOverlay">
                            <b-form-group :label="$t('Global.start_year')" label-for="year-input">
                                <validation-provider #default="{ errors }" name="start_year" rules="required">
                                    <year-picker @change="handlerInput" v-model="ruleForm.start_year"
                                                 :year-disable="'no'" :placeholder="$t('Global.start_year')"/>
                                    <ValidationErrors :frontend-errors="errors"
                                                      :backend-errors="getBackendFieldError(errorsdata, 'year')"
                                                      />
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6" @click="showOverlay">
                            <b-form-group :label="$t('Global.end_year')" label-for="year-input">
                                <validation-provider #default="{ errors }" name="end_year" rules="required">
                                    <b-form-input v-model="ruleForm.start_year? ruleForm.start_year + 1 : ruleForm.end_year" :disabled="true"
                                                  :placeholder="$t('Global.end_year')"/>
                                    <ValidationErrors :frontend-errors="errors"
                                                      :backend-errors="getBackendFieldError(errorsdata, 'year')"/>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <!--                        <b-col md="12">-->
                        <!--                            <b-form-group :label="$t('Global.name')" label-for="name">-->
                        <!--                                <validation-provider #default="{ errors }" name="name" rules="required">-->
                        <!--                                    <b-form-input id="name"-->
                        <!--                                                  v-model="ruleForm.name"-->
                        <!--                                                  :state="errors.length > 0 ? false : null"/>-->
                        <!--                                    <small v-if="errors.length" class="text-danger">{{ validation(null,-->
                        <!--                                        0).message}}</small>-->
                        <!--                                </validation-provider>-->
                        <!--                            </b-form-group>-->
                        <!--                        </b-col>-->
                    </div>
                </b-form>
            </validation-observer>
            <template #modal-footer>
                <b-row>
                    <b-col md="12">
                        <b-button type="submit" variant="primary" class="mr-1" @click="submit">
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button type="reset" variant="outline-secondary" @click="dialog = false">
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-modal>
    </div>
</template>

<script>
    import Years from "@/views/system/years/components/years";
    import {
        BButton,
        BCard,
        BCardBody,
        BCardHeader,
        BCol,
        BForm, BFormDatepicker,
        BFormGroup,
        BFormInput,
        BInputGroup,
        BModal, BRow

    } from "bootstrap-vue";
    import {required, email} from '@validations';
    import {localize, ValidationObserver, ValidationProvider} from "vee-validate";
    import ValidationErrors from "@/views/components/common/ValidationErrors";

    export default {
        name: "index",
        components: {
            Years,
            ValidationErrors,
            BFormDatepicker,
            BFormInput,
            BCard,
            BCol,
            BCardBody,
            BCardHeader,
            BModal,
            BForm,
            BFormGroup,
            BInputGroup,
            BRow,
            BButton,
            ValidationProvider,
            ValidationObserver,
            localize,
        },
        data() {
            return {
                dialog: false,
                refresh: false,
                year_id: null,
                errorsdata: null,
                ruleForm: {
                    start_year: null,
                    end_year: null,
                },
            }
        },
        methods: {
            showOverlay() {
                this.show = true;
                // document.querySelector('.year-picker__year-box').style.display = 'block';
            },
            handlerInput(e) {
                this.ruleForm.end_year = this.ruleForm.start_year + 1;
            },
            hideYear() {
                // document.querySelector('.year-picker__input.year-picker__input--real').classList.remove('year-picker__input--focus');
                // document.querySelector('.year-picker__year-box').style.display = 'none';
                // document.querySelector('.year-picker__input.year-picker__input--real').blur();
            },
            openDialog(item) {
                this.ruleForm = {};
                if (item) {
                    this.ruleForm = {...item}
                    this.year_id = item.id;
                }

                this.dialog = true;
            },
            submit() {
                this.$nextTick(_ => {
                    this.$refs.simpleRules1.validate()
                        .then(success => {
                            if (success) {
                                this.refresh = false;
                                this.ruleForm.end_year = this.ruleForm.start_year + 1;
                                this.$store.dispatch('years/put', {id: this.year_id, query: this.ruleForm}).then(_ => {
                                    this.dialog = false;
                                    this.refresh = true;
                                })
                            }
                        })

                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .per-page-selector {
        width: 90px;
    }
</style>
