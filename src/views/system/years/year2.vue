<template>
    <div>
        <b-card class="mb-0">
            <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
                <b-tab>
                    <template #title>
                        <feather-icon icon="DollarSignIcon"/>
                        <span>{{ $t('Global.academic_calendar') }}</span></template>
                    <edit v-if="edit" :data="item" @hide="cancel()" :inline="true" @refresh="init" class="mb-2"></edit>
                    <div v-else>
                        <ShowComponent v-if="item" :data="item" :only="['name']" :loading="load">
                            <template #edit>
                                <div class="mb-2">
                                    <feather-icon @click="openEdit()"
                                                  style="cursor: pointer" icon="EditIcon" class="font-medium-3"
                                                  v-b-tooltip.hover="$t('Global.edit')"/>
                                </div>
                            </template>

                        </ShowComponent>
                    </div>
                    <terms :items="item.terms" :fields="TERMFields"></terms>
                </b-tab>
                <b-tab>
                    <template #title>
                        <feather-icon icon="SettingsIcon"/>
                        <span>{{ $t('Global.ug_allowable_students') }}</span></template
                    >
                    <TabTable v-if="item" no-details :table="4" class="mt-2" :loading="load"
                              :title="$t('Global.allowable_students')" :fields="fields" settings add
                              :items="item.settings" @add="updateStudentsFees" @update="updateStudentsFees"
                              @remove="remove"/>
                </b-tab>
                <b-tab>
                    <template #title>
                        <feather-icon icon="SettingsIcon"/>
                        <span>{{ $t('Global.pg_allowable_students') }}</span></template
                    >
                    <TabTable v-if="item" no-details :table="4" class="mt-2" :loading="load"
                              :title="$t('Global.pg_allowable_students')" :fields="fields" settings add
                              :items="item.pg_settings" @add="updateStudentsFees" @update="updateStudentsFees"
                              @remove="remove"/>
                </b-tab>
                <b-tab>
                    <template #title>
                        <feather-icon icon="SettingsIcon"/>
                        <span>{{ $t('Global.fall_enrollment_settings') }}</span></template
                    >
                    <TabTable no-details :table="4" class="mt-2" :loading="load"
                              :title="$t('Global.fall_enrollment_settings')" :fields="enrollmentFields" add
                              :items="settings" @add="updateEnrollmentSettings" @update="updateEnrollmentSettings"
                              settings @remove="remove"></TabTable>
                </b-tab>
                <b-tab>
                    <template #title>
                        <feather-icon icon="SettingsIcon"/>
                        <span>{{ $t('Global.spring_enrollment_settings') }}</span></template
                    >
                    <TabTable no-details :table="4" class="mt-2" :loading="load"
                              :title="$t('Global.spring_enrollment_settings')" :fields="enrollmentFields" add
                              :items="settings" @add="updateEnrollmentSettings" @update="updateEnrollmentSettings"
                              settings @remove="remove"></TabTable>
                </b-tab>
                <b-tab>
                    <template #title>
                        <feather-icon icon="SettingsIcon"/>
                        <span>{{ $t('Global.summer_enrollment_settings') }}</span></template
                    >
                    <TabTable no-details :table="4" class="mt-2" :loading="load"
                              :title="$t('Global.summer_enrollment_settings')" :fields="enrollmentFields" add
                              :items="settings" @add="updateEnrollmentSettings" @update="updateEnrollmentSettings"
                              settings @remove="remove"></TabTable>
                </b-tab>
                <!--                <b-tab>-->
                <!--                    <template #title>-->
                <!--                        <feather-icon icon="DollarSignIcon"/>-->
                <!--                        <span>{{ $t('Global.admission_tuition_fees') }}</span></template-->
                <!--                    >-->

                <!--                    <b-row class="mb-1 w-100 align-items-center">-->
                <!--                        <div class="mx-2 d-block w-100">-->
                <!--                            <h3 class="m-0">{{ $t('Global.applicant_file') }}</h3>-->
                <!--                        </div>-->
                <!--                        <div class="mx-2 d-block w-100 text-center">-->
                <!--                            <strong class="w-100 d-flex justify-content-center align-items-center flex-wrap">-->
                <!--                                <div v-if="item && item.applicant_setting">-->
                <!--                                    {{ $t('Global.a_amount') }} :-->
                <!--                                    <small class="text-uppercase text-primary text-bold">-->
                <!--                                        {{ numberWithCommas(item.applicant_setting.value.application_fess) }}-->
                <!--                                    </small>-->
                <!--                                    {{ $t('Global.usd_amount') }} :-->
                <!--                                    <small class="text-uppercase text-primary text-bold">-->
                <!--                                        {{ numberWithCommas(item.applicant_setting.value &&-->
                <!--                                        item.applicant_setting.value.application_fess_usd ?-->
                <!--                                        item.applicant_setting.value.application_fess_usd : '-') }}-->
                <!--                                    </small>-->
                <!--                                    <strong>{{ $t('Global.ttb') }}</strong-->
                <!--                                    >:-->
                <!--                                    <small v-if="item.applicant_setting && item.applicant_setting.value.after"-->
                <!--                                           class="text-uppercase text-primary text-bold"> {{-->
                <!--                                        $t('Global.applicant_after') }}</small>-->
                <!--                                    <span v-else class="text-uppercase text-primary text-bold"> {{ $t('Global.applicant_before') }}</span>-->
                <!--                                </div>-->
                <!--                                <feather-icon icon="EditIcon"-->
                <!--                                              v-if="item && item.applicant_setting && item.applicant_setting.value"-->
                <!--                                              class="mx-2" style="cursor: pointer"-->
                <!--                                              @click="updateApplicantFees(item.applicant_setting, 2)"/>-->
                <!--                                <feather-icon icon="PlusCircleIcon" v-else class="mx-2" style="cursor: pointer"-->
                <!--                                              @click="updateApplicantFees()"/>-->
                <!--                            </strong>-->
                <!--                        </div>-->
                <!--                    </b-row>-->

                <!--                    <TabTable v-if="item" add :head_tuition="true" no-details :table="1" class="mt-0" :loading="load"-->
                <!--                              :title="$t('Global.EGP_tuition_fees_alert')" :fields="EGPFields"-->
                <!--                              :items="item.payment_settings" settings @add="updateTuitionFees"-->
                <!--                              @update="updateTuitionFees" @remove="remove"/>-->

                <!--                    <TabTable v-if="item" :head_tuition="true" no-details :table="3" class="mt-2" settings-->
                <!--                              :loading="load" :title="$t('Global.USD_tuition_fees_alert')" :fields="USDFields"-->
                <!--                              @update="updateTuitionFees" @remove="remove" :items="item.payment_settings"/>-->

                <!--                    <TabTable v-if="item" add no-details class="mt-2" :loading="load" :table="5"-->
                <!--                              :title="$t('Global.admission_exam_fees_alert')" :fields="ExamFields" settings-->
                <!--                              :items="item.exam_settings" @update="updateExamFees" @add="updateExamFees"-->
                <!--                              @remove="remove"/>-->

                <!--                </b-tab>-->
                <!--                <b-tab>-->
                <!--                    <template #title>-->
                <!--                        <feather-icon icon="DollarSignIcon"/>-->
                <!--                        <span>{{ $t('Global.post_graduate_tuition_fees') }}</span></template-->
                <!--                    >-->

                <!--                    <TabTable v-if="item" add :head_tuition="true" no-details :table="1" class="mt-0" :loading="load"-->
                <!--                              :title="$t('Global.EGP_post-graduate_fees_tuition_fees_alert')" :fields="EGPPGFields"-->
                <!--                              :items="item.pg_settings" settings @add="updatePGTuitionFees"-->
                <!--                              @update="updatePGTuitionFees" @remove="remove"/>-->

                <!--                    <TabTable v-if="item" :head_tuition="true" no-details :table="3" class="mt-2" settings-->
                <!--                              :loading="load" :title="$t('Global.USD_post-graduate_fees_tuition_fees_alert')"-->
                <!--                              :fields="USDPGFields"-->
                <!--                              @update="updatePGTuitionFees" @remove="remove" :items="item.pg_settings"/>-->

                <!--                </b-tab>-->
            </b-tabs>
        </b-card>
        <b-modal id="modaPopover" v-model="pg_dialog" no-close-on-backdrop size="lg"
                 :title="is_usd == 3 ? $t('Global.add_setting') : $t('Global.edit_setting')">
            <validation-observer ref="simpleRules1">
                <b-form :class="load ? 'disabled_all' : ''" ref="simpleRules1">
                    <div class="row">
                        <b-col md="6">
                            <b-form-group :label="$t('Global.faculty')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="faculty_id" rules="required">
                                    <v-select v-if="lookups" v-model="form.faculty_id" :filter="fuseSearch"
                                              :class="errors.length > 0 ? 'custom_invalid' : ''"
                                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                              :options="lookups.faculties" :clearable="false" input-id="code-input"
                                              :reduce="val => val.id">
                                        <template v-slot:option="option">
                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                        </template>
                                        <template #selected-option="{ name, name_local }">
                                            <div style="display: flex; align-items: baseline">
                                                <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                                                <span v-else>{{ name }}</span>
                                            </div>
                                        </template>
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('Global.program')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="program_id">
                                    <v-select
                                            v-if="lookups"
                                            v-model="form.program_id"
                                            multiple
                                            :filter="fuseSearch"
                                            :disabled="!form.faculty_id"
                                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                            :options="getTuitionPrograms()"
                                            input-id="code-input"
                                            :reduce="val => val.id"
                                    >
                                        <template v-slot:option="option">
                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                        </template>
                                        <template #selected-option="{ name, name_local }">
                                            <div style="display: flex; align-items: baseline">
                                                <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                                                <strong v-else>{{ name }}</strong>
                                            </div>
                                        </template>
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>

                        <b-col md="6">
                            <b-form-group :label="$t('Global.degree')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="faculty_id" rules="required">
                                    <v-select v-model="pgRuleForm.degree" :filter="fuseSearch"
                                              :class="errors.length > 0 ? 'custom_invalid' : ''"
                                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                              :options="[1,2,4]" :clearable="false" input-id="code-input"
                                              :reduce="val => val">
                                        <!--                                        <template v-slot:option="option">-->
                                        <!--                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}-->
                                        <!--                                        </template>-->
                                        <!--                                        <template #selected-option="{ name, name_local }">-->
                                        <!--                                            <div style="display: flex; align-items: baseline">-->
                                        <!--                                                <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>-->
                                        <!--                                                <span v-else>{{ name }}</span>-->
                                        <!--                                            </div>-->
                                        <!--                                        </template>-->
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('Global.application_fees')" label-for="application_fees">
                                <validation-provider #default="{ errors }" name="application_fees" rules="required">
                                    <b-form-input type="number" id="application_fees"
                                                  v-model="pgRuleForm.application_fees"
                                                  :state="errors.length > 0 ? false : null"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>

                        <template v-if="is_usd == 1 || is_usd == 3">
                            <b-col md="12">
                                <span class="my-3 font-weight-bolder">{{ $t('Global.EGP_post-graduate_fees_tuition_fees_alert') }}</span>
                                <hr/>
                            </b-col>
                            <b-col md="3">
                                <b-form-group :label="$t('Global.first_year')" label-for="first_year">
                                    <validation-provider #default="{ errors }" name="first_instalment" rules="required">
                                        <b-form-input type="number" id="first_year"
                                                      v-model="pgRuleForm.first_year"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="3">
                                <b-form-group :label="$t('Global.second_year')" label-for="second_year">
                                    <validation-provider #default="{ errors }" name="second_year"
                                                         rules="required">
                                        <b-form-input type="number" id="second_year"
                                                      v-model="pgRuleForm.second_year"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="3">
                                <b-form-group :label="$t('Global.third_year')" label-for="third_year">
                                    <validation-provider #default="{ errors }" name="third_year"
                                                         rules="required">
                                        <b-form-input type="number" id="third_year"
                                                      v-model="pgRuleForm.third_year"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="3">
                                <b-form-group :label="$t('Global.total')" label-for="total">
                                    <validation-provider #default="{ errors }" name="total" rules="required">
                                        <b-form-input id="total" disabled :value="totalFees"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                        </template>
                        <template v-if="is_usd == 2 || is_usd == 3">
                            <b-col md="12">
                                <span class="my-3 font-weight-bolder">{{ $t('Global.USD_post-graduate_fees_tuition_fees_alert') }}</span>
                                <hr/>
                            </b-col>
                            <b-col md="3">
                                <b-form-group :label="$t('Global.first_year')" label-for="first_usd_year">
                                    <validation-provider #default="{ errors }" name="first_usd_year"
                                                         rules="required">
                                        <b-form-input type="number" v-model="pgRuleForm.first_usd_year"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="3">
                                <b-form-group :label="$t('Global.second_year')" label-for="second_usd_year">
                                    <validation-provider #default="{ errors }" name="second_usd_year"
                                                         rules="required">
                                        <b-form-input type="number" v-model="pgRuleForm.second_usd_year"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="3">
                                <b-form-group :label="$t('Global.third_year')" label-for="second_usd_year">
                                    <validation-provider #default="{ errors }" name="second_usd_year"
                                                         rules="required">
                                        <b-form-input type="number" v-model="pgRuleForm.third_usd_year"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="3">
                                <b-form-group :label="$t('Global.total')" label-for="total">
                                    <validation-provider #default="{ errors }" name="total" rules="required">
                                        <b-form-input disabled :value="pgRuleForm.third_usd_year"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                        </template>
                    </div>
                </b-form>
            </validation-observer>
            <template #modal-footer>
                <b-row :class="load ? 'disabled_all' : ''">
                    <b-col md="12">
                        <b-button type="submit" variant="primary" class="mr-1" @click="submit">
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button type="reset" variant="outline-secondary" @click="pg_dialog = false">
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-modal>
        <b-modal id="modalPopover" v-model="dialog" no-close-on-backdrop size="lg"
                 :title="is_usd == 3 ? $t('Global.add_setting') : $t('Global.edit_setting')">
            <validation-observer ref="simpleRules1">
                <b-form :class="load ? 'disabled_all' : ''" ref="simpleRules1">
                    <div class="row">
                        <b-col md="6">
                            <b-form-group :label="$t('Global.faculty')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="faculty_id" rules="required">
                                    <v-select v-if="lookups" v-model="form.faculty_id" :filter="fuseSearch"
                                              :class="errors.length > 0 ? 'custom_invalid' : ''"
                                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                              :options="lookups.faculties" :clearable="false" input-id="code-input"
                                              :reduce="val => val.id">
                                        <template v-slot:option="option">
                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                        </template>
                                        <template #selected-option="{ name, name_local }">
                                            <div style="display: flex; align-items: baseline">
                                                <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                                                <span v-else>{{ name }}</span>
                                            </div>
                                        </template>
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('Global.program')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="program_id">
                                    <v-select
                                            v-if="lookups"
                                            v-model="form.program_id"
                                            :filter="fuseSearch"
                                            :disabled="!form.faculty_id"
                                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                            :options="getTuitionPrograms()"
                                            input-id="code-input"
                                            :reduce="val => val.id"
                                    >
                                        <template v-slot:option="option">
                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                        </template>
                                        <template #selected-option="{ name, name_local }">
                                            <div style="display: flex; align-items: baseline">
                                                <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                                                <strong v-else>{{ name }}</strong>
                                            </div>
                                        </template>
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>

                        <template v-if="is_usd == 1 || is_usd == 3">
                            <b-col md="12">
                                <span class="my-3 font-weight-bolder">{{ $t('Global.EGP_tuition_fees_alert') }}</span>
                                <hr/>
                            </b-col>
                            <b-col md="6">
                                <b-form-group :label="$t('Global.first')" label-for="first_instalment">
                                    <validation-provider #default="{ errors }" name="first_instalment" rules="required">
                                        <b-form-input type="number" id="first_instalment"
                                                      v-model="ruleForm.first_instalment"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group :label="$t('Global.second')" label-for="second_instalment">
                                    <validation-provider #default="{ errors }" name="second_instalment"
                                                         rules="required">
                                        <b-form-input type="number" id="second_instalment"
                                                      v-model="ruleForm.second_instalment"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group :label="$t('Global.total')" label-for="total">
                                    <validation-provider #default="{ errors }" name="total" rules="required">
                                        <b-form-input id="total" disabled :value="totalFees"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                        </template>
                        <template v-if="is_usd == 2 || is_usd == 3">
                            <b-col md="12">
                                <span class="my-3 font-weight-bolder">{{ $t('Global.USD_tuition_fees_alert') }}</span>
                                <hr/>
                            </b-col>
                            <b-col md="6">
                                <b-form-group :label="$t('Global.first')" label-for="first_usd_instalment">
                                    <validation-provider #default="{ errors }" name="first_usd_instalment"
                                                         rules="required">
                                        <b-form-input type="number" v-model="ruleForm.first_usd_instalment"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group :label="$t('Global.second')" label-for="second_usd_instalment">
                                    <validation-provider #default="{ errors }" name="second_usd_instalment"
                                                         rules="required">
                                        <b-form-input type="number" v-model="ruleForm.second_usd_instalment"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6">
                                <b-form-group :label="$t('Global.total')" label-for="total">
                                    <validation-provider #default="{ errors }" name="total" rules="required">
                                        <b-form-input disabled :value="totalUsdFees"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                        </template>
                    </div>
                </b-form>
            </validation-observer>
            <template #modal-footer>
                <b-row :class="load ? 'disabled_all' : ''">
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
        <b-modal id="modal" v-model="exam_dialog" no-close-on-backdrop size="lg"
                 :title="is_usd == 3 ? $t('Global.add_exam_fees') : $t('Global.edit_exam_fees')">
            <validation-observer ref="simpleRules1">
                <b-form :class="load ? 'disabled_all' : ''">
                    <div class="row">
                        <b-col md="6">
                            <b-form-group :label="$t('Global.faculty')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="faculty_id" rules="required">
                                    <v-select v-if="lookups" v-model="form.faculty_id" :filter="fuseSearch"
                                              :class="errors.length > 0 ? 'custom_invalid' : ''"
                                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                              :options="lookups.faculties" :clearable="false" input-id="code-input"
                                              :reduce="val => val.id">
                                        <template v-slot:option="option">
                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                        </template>
                                        <template #selected-option="{ name, name_local }">
                                            <div style="display: flex; align-items: baseline">
                                                <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                                                <span v-else>{{ name }}</span>
                                            </div>
                                        </template>
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('Global.program')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="program_id">
                                    <v-select
                                            v-if="lookups"
                                            v-model="form.program_id"
                                            :filter="fuseSearch"
                                            :disabled="!form.faculty_id"
                                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                            :options="getExamPrograms()"
                                            input-id="code-input"
                                            :reduce="val => val.id"
                                    >
                                        <template v-slot:option="option">
                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                        </template>
                                        <template #selected-option="{ name, name_local }">
                                            <div style="display: flex; align-items: baseline">
                                                <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                                                <strong v-else>{{ name }}</strong>
                                            </div>
                                        </template>
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>

                        <b-col md="6">
                            <b-form-group :label="$t('Global.admission_exam')" label-for="first_instalment">
                                <validation-provider #default="{ errors }" name="admission_exam" rules="required">
                                    <b-form-input type="number" v-model="exam_form.admission_exam"
                                                  :state="errors.length > 0 ? false : null"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('Global.training_course')" label-for="training_course">
                                <validation-provider #default="{ errors }" name="training_course">
                                    <b-form-input type="number" v-model="exam_form.training_course"
                                                  :state="errors.length > 0 ? false : null"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                    </div>
                </b-form>
            </validation-observer>
            <template #modal-footer>
                <b-row :class="load ? 'disabled_all' : ''">
                    <b-col md="12">
                        <b-button type="submit" variant="primary" class="mr-1" @click="submit_exam">
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button type="reset" variant="outline-secondary" @click="exam_dialog = false">
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-modal>
        <b-modal id="modal_applicant" v-model="applicant_dialog" no-close-on-backdrop
                 :title="is_usd == 3 ? $t('Global.add_applicant_fees') : $t('Global.edit_applicant_fees')">
            <validation-observer ref="simpleRules1">
                <b-form :class="load ? 'disabled_all' : ''" ref="simpleRules1">
                    <div class="row">
                        <b-col md="12">
                            <b-form-group :label="$t('Global.a_amount')" label-for="first_instalment">
                                <validation-provider #default="{ errors }" name="admission_exam" rules="required">
                                    <b-form-input type="number" v-model="applicant_form.application_fess"
                                                  :state="errors.length > 0 ? false : null"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="12">
                            <b-form-group :label="$t('Global.usd_amount')" label-for="first_instalment">
                                <validation-provider #default="{ errors }" name="application_fess_usd" rules="required">
                                    <b-form-input type="number" v-model="applicant_form.application_fess_usd"
                                                  :state="errors.length > 0 ? false : null"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="12">
                            <b-form-group :label="$t('Global.switch_after')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="program_id">
                                    <v-select v-model="applicant_form.after"
                                              :class="errors.length > 0 ? 'custom_invalid' : ''"
                                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                              :options="options" :clearable="false" input-id="code-input" label="label"
                                              :reduce="val => val.id"/>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                    </div>
                </b-form>
            </validation-observer>
            <template #modal-footer>
                <b-row :class="load ? 'disabled_all' : ''">
                    <b-col md="12">
                        <b-button type="submit" variant="primary" class="mr-1" @click="submit_applicent">
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button type="reset" variant="outline-secondary" @click="applicant_dialog = false">
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-modal>

        <b-modal id="modalPopover" v-model="enroll_dialog" no-close-on-backdrop size="lg"
                 :title="$t('Enrollment Settings')">
            <validation-observer ref="ruleForm">
                <b-form :class="load ? 'disabled_all' : ''">
                    <div class="row">
                        <b-col md="6">
                            <b-form-group :label="$t('Global.faculty')" label-for="code-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="faculty_id" rules="">
                                    <v-select
                                            v-if="lookups"
                                            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                                            v-model="ruleForm.faculty_id"
                                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                            :options="lookups.faculties"
                                            :clearable="true"
                                            input-id="code-input"
                                            :reduce="val => val.id"
                                    >
                                        <template v-slot:option="option">
                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                        </template>
                                        <template #selected-option="{ name, name_local }">
                                            <div style="display: flex; align-items: baseline">
                                                <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                                                <span v-else>{{ name }}</span>
                                            </div>
                                        </template>
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('Global.bylaw')" label-for="bylaw-input"
                                          invalid-feedback="Name is required">
                                <validation-provider #default="{ errors }" name="bylaw_id" rules="">
                                    <v-select
                                            v-if="lookups"
                                            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                                            v-model="ruleForm.bylaw_id"
                                            :class="errors.length > 0 ? 'custom_invalid' : ''"
                                            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                            :options="lookups.bylaws"
                                            input-id="bylaw-input"
                                            :reduce="val => val.id"
                                    >
                                        <template v-slot:option="option">
                                            {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                                        </template>
                                        <template #selected-option="{ name, name_local }">
                                            <div style="display: flex; align-items: baseline">
                                                <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                                                <strong v-else>{{ name }}</strong>
                                            </div>
                                        </template>
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>

                        <b-col md="12">
                            <hr/>
                            <p>{{ $t('Registration') }}</p>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('From')" label-for="registration-from-input"
                                          :state="startDateState">
                                <validation-provider #default="{ errors }" name="registration_date_from"
                                                     rules="required">
                                    <b-form-datepicker id="registration-from-input"
                                                       v-model="ruleForm.registration_date_from" class="mb-1"
                                                       v-bind="labels[locale] || {}" :locale="locale"
                                                       :start-weekday="weekday" :show-decade-nav="showDecadeNav"
                                                       :hide-header="hideHeader"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('To')" label-for="registration-to-input" :state="endDateState">
                                <validation-provider #default="{ errors }" name="registration_date_to" rules="required">
                                    <b-form-datepicker
                                            id="registration-to-input"
                                            v-model="ruleForm.registration_date_to"
                                            class="mb-1"
                                            :state="errors.length > 0 ? false : null"
                                            :disabled="!ruleForm.registration_date_from"
                                            :min="ruleForm.registration_date_from"
                                            v-bind="labels[locale] || {}"
                                            :locale="locale"
                                            :start-weekday="weekday"
                                            :show-decade-nav="showDecadeNav"
                                            :hide-header="hideHeader"
                                    />
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>

                        <b-col md="12">
                            <hr/>
                            <p>{{ $t('Add') }}</p>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('From')" label-for="adddrop-from-input"
                                          invalid-feedback="date is required">
                                <validation-provider #default="{ errors }" name="adddrop_date_from" rules="required">
                                    <b-form-datepicker id="adddrop-from-input" v-model="ruleForm.adddrop_date_from"
                                                       class="mb-1" v-bind="labels[locale] || {}" :locale="locale"
                                                       :start-weekday="weekday" :show-decade-nav="showDecadeNav"
                                                       :hide-header="hideHeader"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('To')" label-for="adddrop-to-input">
                                <validation-provider #default="{ errors }" name="adddrop_date_to" rules="required">
                                    <b-form-datepicker
                                            id="adddrop-to-input"
                                            v-model="ruleForm.adddrop_date_to"
                                            class="mb-1"
                                            :disabled="!ruleForm.adddrop_date_from"
                                            :min="ruleForm.adddrop_date_from"
                                            v-bind="labels[locale] || {}"
                                            :locale="locale"
                                            :start-weekday="weekday"
                                            :show-decade-nav="showDecadeNav"
                                            :hide-header="hideHeader"
                                    />
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>

                        <b-col md="12">
                            <hr/>
                            <p>{{ $t('Drop') }}</p>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('From')" label-for="drop-from-input"
                                          invalid-feedback="date is required">
                                <validation-provider #default="{ errors }" name="drop_date_from" rules="required">
                                    <b-form-datepicker id="drop-from-input" v-model="ruleForm.drop_date_from"
                                                       class="mb-1" v-bind="labels[locale] || {}" :locale="locale"
                                                       :start-weekday="weekday" :show-decade-nav="showDecadeNav"
                                                       :hide-header="hideHeader"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('To')" label-for="drop-to-input">
                                <validation-provider #default="{ errors }" name="drop_date_to" rules="required">
                                    <b-form-datepicker
                                            id="drop-to-input"
                                            v-model="ruleForm.drop_date_to"
                                            class="mb-1"
                                            :disabled="!ruleForm.drop_date_from"
                                            :min="ruleForm.drop_date_from"
                                            v-bind="labels[locale] || {}"
                                            :locale="locale"
                                            :start-weekday="weekday"
                                            :show-decade-nav="showDecadeNav"
                                            :hide-header="hideHeader"
                                    />
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>

                        <b-col md="12">
                            <hr/>
                            <p>{{ $t('Withdraw') }}</p>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('From')" label-for="withdraw-from-input"
                                          invalid-feedback="date is required">
                                <validation-provider #default="{ errors }" name="withdraw_date_From" rules="required">
                                    <b-form-datepicker id="withdraw-from-input" v-model="ruleForm.withdraw_date_from"
                                                       class="mb-1" v-bind="labels[locale] || {}" :locale="locale"
                                                       :start-weekday="weekday" :show-decade-nav="showDecadeNav"
                                                       :hide-header="hideHeader"/>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                        <b-col md="6">
                            <b-form-group :label="$t('To')" label-for="withdraw-to-input"
                                          invalid-feedback="date is required">
                                <validation-provider #default="{ errors }" name="withdraw_date_to" rules="required">
                                    <b-form-datepicker
                                            id="withdraw-to-input"
                                            v-model="ruleForm.withdraw_date_to"
                                            class="mb-1"
                                            :disabled="!ruleForm.withdraw_date_from"
                                            :min="ruleForm.withdraw_date_from"
                                            v-bind="labels[locale] || {}"
                                            :locale="locale"
                                            :start-weekday="weekday"
                                            :show-decade-nav="showDecadeNav"
                                            :hide-header="hideHeader"
                                    />
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                    </div>
                </b-form>
            </validation-observer>
            <template #modal-footer>
                <b-row :class="load ? 'disabled_all' : ''">
                    <b-col md="12">
                        <b-button type="submit" variant="primary" class="mr-1" @click="submitEnrollment">
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button type="reset" variant="outline-secondary" @click="enroll_dialog = false">
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-modal>

    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import {
        BCard,
        BCol,
        BRow,
        BTab,
        BModal,
        BForm,
        BFormInput,
        BFormGroup,
        BInputGroup,
        BFormCheckbox,
        BFormDatepicker,
        BTabs,
        BButton,
        BCardBody,
        BCardHeader
    } from 'bootstrap-vue';
    import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
    import {required, email} from '@validations';
    import vSelect from 'vue-select';
    import ShowComponent from '@/views/components/info/show';
    import Offerings from '@/views/study/offerings/components/offerings';
    import Students from '@/views/students/student/components/students';
    import Edit from '@/views/system/years/edit';
    import Statistics from '@/views/components/info/statistics';
    import TabTable from '@/views/students/student/components/TabTable';
    import Terms from "@/views/system/years/components/terms";

    export default {
        name: 'Show',
        components: {
            Terms,
            TabTable,
            BFormDatepicker,
            Edit,
            Statistics,
            vSelect,
            BFormCheckbox,
            Students,
            Offerings,
            ShowComponent,
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
            BTab,
            BTabs,
            BButton,
            ValidationProvider,
            ValidationObserver,
            localize,
        },
        computed: {
            ...mapGetters({
                item: 'years/item',
                settings: 'settings/items',
                load: 'years/load',
                lookups: 'app/lookups',
            }),
            id() {
                return this.$route.params.id ? this.$route.params.id : null;
            },

            EGPFields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty'),
                    },
                    {
                        key: 'program',
                        label: this.$t('Global.program'),
                    },
                    {
                        key: 'first_instalment',
                        label: this.$t('Global.first'),
                    },
                    {
                        key: 'second_instalment',
                        label: this.$t('Global.second'),
                    },
                    {
                        key: 'total',
                        label: this.$t('Global.total'),
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },
            USDFields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty'),
                    },
                    {
                        key: 'program',
                        label: this.$t('Global.program'),
                    },
                    {
                        key: 'first_usd_instalment',
                        label: this.$t('Global.first'),
                    },
                    {
                        key: 'second_usd_instalment',
                        label: this.$t('Global.second'),
                    },
                    {
                        key: 'total_usd',
                        label: this.$t('Global.total'),
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },
            TERMFields() {
                return [
                    {
                        key: 'code',
                        label: this.$t('Global.code'),
                    },
                    {
                        key: 'name',
                        label: this.$t('Global.name'),
                    },
                    {
                        key: 'name_local',
                        label: this.$t('Global.name_local'),
                    },
                    {
                        key: 'start_date',
                        label: this.$t('Global.start_date'),
                    },
                    {
                        key: 'end_date',
                        label: this.$t('Global.end_date'),
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },

            EGPPGFields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty'),
                    },
                    {
                        key: 'program',
                        label: this.$t('Global.program'),
                    },
                    {
                        key: 'first_year',
                        label: this.$t('Global.first_year'),
                    },
                    {
                        key: 'second_year',
                        label: this.$t('Global.second_year'),
                    },
                    {
                        key: 'third_year',
                        label: this.$t('Global.third_year'),
                    },
                    {
                        key: 'total',
                        label: this.$t('Global.total'),
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },
            USDPGFields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty'),
                    },
                    {
                        key: 'program',
                        label: this.$t('Global.program'),
                    },
                    {
                        key: 'first_usd_year',
                        label: this.$t('Global.first_year'),
                    },
                    {
                        key: 'second_usd_year',
                        label: this.$t('Global.second_year'),
                    },
                    {
                        key: 'third_usd_year',
                        label: this.$t('Global.third_year'),
                    },
                    {
                        key: 'total_usd',
                        label: this.$t('Global.total'),
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },

            fields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty'),
                    },
                    {
                        key: 'program',
                        label: this.$t('Global.program'),
                    },
                    {
                        key: 'minimum_grade',
                        label: this.$t('Global.minimum_grade_current'),
                    },
                    {
                        key: 'prev_minimum_grade',
                        label: this.$t('Global.minimum_grade_prev'),
                    },
                    {
                        key: 'stem_minimum_grade',
                        label: this.$t('Global.stem_grade'),
                    },
                    {
                        key: 'quota',
                        label: this.$t('Global.student_quota'),
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },
            enrollmentFields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty'),
                        thStyle: {width: '10%'},
                    },
                    {
                        key: 'bylaw',
                        label: this.$t('Global.bylaw'),
                    },
                    {
                        key: 'registration',
                        label: this.$t('Global.registration'),
                    },
                    {
                        key: 'add_drop',
                        label: this.$t('Global.add'),
                    },
                    {
                        key: 'drop',
                        label: this.$t('Global.drop'),
                    },
                    {
                        key: 'withdraw',
                        label: this.$t('Global.withdraw'),
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },

            ExamFields() {
                return [
                    {
                        key: 'faculty',
                        label: this.$t('Global.faculty'),
                    },
                    {
                        key: 'program',
                        label: this.$t('Global.program'),
                    },
                    {
                        key: 'admission_exam',
                        label: this.$t('Global.admission_exam'),
                    },
                    {
                        key: 'training_course',
                        label: this.$t('Global.training_course'),
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },
            options() {
                return [
                    {
                        id: 1,
                        label: this.$t('Global.applicant_after'),
                    },
                    {
                        id: 0,
                        label: this.$t('Global.applicant_before'),
                    },
                ];
            },
            totalFees() {
                if (this.ruleForm.first_instalment && this.ruleForm.second_instalment) {
                    return Number(this.ruleForm.first_instalment) + Number(this.ruleForm.second_instalment);
                }
                if (this.ruleForm.first_instalment) {
                    return this.ruleForm.first_instalment;
                }
                return this.ruleForm.second_instalment;
            },
            totalUsdFees() {
                if (this.ruleForm.first_usd_instalment && this.ruleForm.second_usd_instalment) {
                    return Number(this.ruleForm.first_usd_instalment) + Number(this.ruleForm.second_usd_instalment);
                } else if (this.ruleForm.first_usd_instalment) {
                    return this.ruleForm.first_usd_instalment;
                } else {
                    return this.ruleForm.second_usd_instalment;
                }
            },
            locale() {
                return this.$i18n.locale == 'ar' ? 'ar-EG' : 'en-US';
            },
        },
        data() {
            return {
                edit: false,
                dialog: false,
                enroll_dialog: false,
                pg_dialog: false,
                applicant_dialog: false,
                students_dialog: false,
                is_usd: 3,
                exam_dialog: false,
                grades: [],
                types: [],
                form: {faculty_id: null, program_id: null},
                exam_form: {admission_exam: null, training_course: null},
                applicant_form: {application_fess: null, after: false},
                certificatesArray: [],
                ruleForm: {
                    // min_gpa: null,
                    registration_date_from: null,
                    registration_date_to: null,
                    adddrop_date_from: null,
                    adddrop_date_to: null,
                    withdraw_date_from: null,
                    withdraw_date_to: null,
                    drop_date_from: null,
                    drop_date_to: null,
                    faculty_id: null,
                    bylaw_id: null,
                },
                // ruleForm: {
                //     total: this.totalFees,
                //     total_usd: this.totalUsdFees,
                //     second_instalment: null,
                //     first_instalment: null,
                //     second_usd_instalment: null,
                //     first_usd_instalment: null,
                //     minimum_grade: null,
                //     quota: null,
                // },
                pgRuleForm: {
                    total: 0,
                    total_usd: 0,
                    second_year: 0,
                    first_year: 0,
                    third_year: 0,
                    second_usd_year: 0,
                    first_usd_year: 0,
                    third_usd_year: 0,
                    degree: null,
                    application_fess: null,
                },
                settings_id: null,
                endDateState: null,
                startDateState: null,
                value: '',
                showDecadeNav: false,
                hideHeader: false,
                locales: [
                    { value: 'en-US', text: 'English US (en-US)' },
                    { value: 'ar-EG', text: 'Arabic Egyptian (ar-EG)' },
                ],
                weekday: 0,
                weekdays: [
                    { value: 0, text: 'Sunday' },
                    { value: 1, text: 'Monday' },
                    { value: 6, text: 'Saturday' },
                ],
                labels: {
                    'ar-EG': {
                        labelPrevDecade: 'العقد السابق',
                        labelPrevYear: 'العام السابق',
                        labelPrevMonth: 'الشهر السابق',
                        labelCurrentMonth: 'الشهر الحالي',
                        labelNextMonth: 'الشهر المقبل',
                        labelNextYear: 'العام المقبل',
                        labelNextDecade: 'العقد القادم',
                        labelToday: 'اليوم',
                        labelSelected: 'التاريخ المحدد',
                        labelNoDateSelected: 'لم يتم اختيار تاريخ',
                        labelCalendar: 'التقويم',
                        labelNav: 'الملاحة التقويم',
                        labelHelp: 'استخدم مفاتيح المؤشر للتنقل في التواريخ',
                    },
                },
            };
        },
        watch: {
            'form.faculty_id': function (val) {
                this.getLookups({
                    faculty_id_programs: val,
                    faculties: true,
                    pre_certificates: true,
                });
            },
            'ruleForm.faculty_id': function (val) {
                this.getLookups({
                    faculty_id: val,
                    faculties: true,
                    bylaws: true,
                });
            },
            totalFees() {
                if (this.ruleForm.first_instalment && this.ruleForm.second_instalment) {
                    this.ruleForm.total = Number(this.ruleForm.first_instalment) + Number(this.ruleForm.second_instalment);
                } else if (this.ruleForm.first_instalment) {
                    this.ruleForm.total = this.ruleForm.first_instalment;
                } else {
                    this.ruleForm.total = this.ruleForm.second_instalment;
                }
            },

            totalUsdFees() {
                if (this.ruleForm.first_usd_instalment && this.ruleForm.second_usd_instalment) {
                    this.ruleForm.total_usd = Number(this.ruleForm.first_usd_instalment) + Number(this.ruleForm.second_usd_instalment);
                } else if (this.ruleForm.first_usd_instalment) {
                    this.ruleForm.total_usd = this.ruleForm.first_usd_instalment;
                } else {
                    this.ruleForm.total_usd = this.ruleForm.second_usd_instalment;
                }
            },
        },
        mounted() {
            this.init();
        },
        methods: {
            ...mapActions({
                editTuitionFees: 'settings/put',
                removeSetting: 'settings/remove',
                getLookups: 'app/GET_LOOKUPS',
            }),

            updateStudentsFees(data) {
                if (data) {
                    this.form.faculty_id = data.faculty?.id;
                    this.form.program_id = data.program?.id;
                    this.ruleForm.minimum_grade = data.data?.minimum_grade;
                    this.ruleForm.prev_minimum_grade = data.data?.prev_minimum_grade;
                    this.ruleForm.stem_minimum_grade = data.data?.stem_minimum_grade;
                    this.ruleForm.quota = data.data?.quota;
                    this.settings_id = data.id;
                    this.ruleForm.pre_university_certificate_type = data?.data?.certificate_type;
                    this.ruleForm.pre_university_certificate_groupe = data?.data?.pre_university_certificate_groupe;
                    this.ruleForm.pre_university_certificate = data?.data?.pre_university_certificate;
                    this.ruleForm.arabic = data?.data?.arabic;
                    this.ruleForm.english = data?.data?.english;
                    this.ruleForm.french = data?.data?.french;
                    this.ruleForm.german = data?.data?.german;
                    this.ruleForm.math = data?.data?.math;
                    this.ruleForm.advanced_math = data?.data?.advanced_math;
                    this.ruleForm.biology = data?.data?.biology;
                    this.ruleForm.chemistry = data?.data?.chemistry;
                    this.ruleForm.physics = data?.data?.physics;
                    this.ruleForm.italy = data?.data?.italy;
                } else {
                    this.form.faculty_id = null;
                    this.form.program_id = null;
                    this.ruleForm.quota = null;
                    this.settings_id = null;
                    this.ruleForm.minimum_grade = null;
                    this.ruleForm.prev_minimum_grade = null;
                }
                this.openStudentDialog();
            },

            openEdit() {
                this.edit = true;
                this.updateFilterQueryParams({tabNum: this.$route.query.tabNum || 0, inline: true});
            },
            cancel() {
                this.edit = false;
                this.updateFilterQueryParams({tabNum: this.$route.query.tabNum || 0, inline: false});
            },

            getPrograms() {
                if (this.form.faculty_id) {
                    let selectedPrograms = this.item.settings.filter(el => el.faculty.id == this.form.faculty_id);
                    let programList;
                    if (this.lookups.programs && this.lookups.programs.length) {
                        programList = this.lookups.programs.filter(program => {
                            return selectedPrograms.every(f => {
                                return f?.program?.id != program.id;
                            });
                        });
                    }
                    return programList;
                }
            },

            getExamPrograms() {
                if (this.form.faculty_id) {
                    let selectedPrograms = this.item.exam_settings.filter(el => el.faculty.id == this.form.faculty_id);
                    let programList;
                    if (this.lookups.programs && this.lookups.programs.length) {
                        programList = this.lookups.programs.filter(program => {
                            return selectedPrograms.every(f => {
                                return f?.program?.id != program.id;
                            });
                        });
                    }
                    return programList;
                }
            },
            getTuitionPrograms() {
                if (this.form.faculty_id) {
                    let selectedPrograms = this.item.payment_settings.filter(el => el.faculty.id == this.form.faculty_id);
                    let programList;
                    if (this.lookups.programs && this.lookups.programs.length) {
                        programList = this.lookups.programs.filter(program => {
                            return selectedPrograms.every(f => {
                                return f?.program?.id != program.id;
                            });
                        });
                    }
                    return programList;
                }
            },
            openStudentDialog() {
                this.students_dialog = true;
            },
            openDialog() {
                this.dialog = true;
            },
            openEnrollDialog() {
                this.enroll_dialog = true;
            },
            openExamDialog() {
                this.exam_dialog = true;
            },
            openApplicantDialog() {
                this.applicant_dialog = true;
            },

            checkFaculty(faculty_id, program_id) {
                if (program_id) {
                    return true;
                } else {
                    if (faculty_id) {
                        let selectedFaculties = this.item.payment_settings.find(el => el.faculty.id == faculty_id);
                        if (selectedFaculties && selectedFaculties.program == null) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            },
            submit() {
                this.$nextTick(_ => {
                    this.$refs.simpleRules1
                        .validate()
                        .then(success => {
                            if (success) {
                                // && this.checkFaculty(this.form.faculty_id, this.form.program_id)
                                const payload = {
                                    faculty_id: this.form.faculty_id,
                                    program_id: this.form.program_id,
                                    year_id: this.$route.params.id,
                                    name: 'ADMISSION_PAYMENTS_SETTINGS',
                                    value: {...this.ruleForm, ...{total: this.totalFees, total_usd: this.totalUsdFees}},
                                };
                                // delete payload['total'];
                                // let query = {...payload,...{total:this.totalFees,total_usd:this.totalUsdFees}}
                                this.editTuitionFees({
                                    id: this.settings_id || null,
                                    query: payload,
                                })
                                    .then(_ => {
                                        (this.dialog = false), (this.applicant_dialog = false);
                                        this.students_dialog = false;
                                        this.grade_id = null;
                                        this.init();
                                        this.$swal({
                                            icon: 'success',
                                            title: `${this.$t('Global.saved')}`,
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });
                                    })
                                    .catch(error => {
                                        this.grade_id = null;
                                        this.$swal({
                                            icon: 'error',
                                            text: `${this.$t('Global.item_exist')}`,
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });
                                    });
                            }
                        })
                        .catch(error => {
                            this.$swal({
                                icon: 'error',
                                text: `${this.$t('Global.facultyExist')}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                });
            },
            submit_exam() {
                this.$nextTick(_ => {
                    this.$refs.simpleRules1
                        .validate()
                        .then(success => {
                            if (success) {
                                const payload = {
                                    faculty_id: this.form.faculty_id,
                                    program_id: this.form.program_id,
                                    year_id: this.$route.params.id,
                                    name: 'ADMISSION_EXAM',
                                    value: this.exam_form,
                                };
                                this.editTuitionFees({
                                    id: this.settings_id || null,
                                    query: payload,
                                })
                                    .then(_ => {
                                        this.exam_dialog = false;
                                        this.applicant_dialog = false;
                                        this.dialog = false;
                                        this.students_dialog = false;
                                        this.grade_id = null;
                                        this.init();
                                        this.$swal({
                                            icon: 'success',
                                            title: `${this.$t('Global.saved')}`,
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });
                                    })
                                    .catch(error => {
                                        this.grade_id = null;
                                        this.$swal({
                                            icon: 'error',
                                            text: `${this.$t('Global.errorMessage')}`,
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });
                                    });
                            }
                        })
                        .catch(error => {
                            this.$swal({
                                icon: 'error',
                                text: `${this.$t('Global.errorMessage')}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                });
            },

            submit_applicent() {
                this.$nextTick(_ => {
                    this.$refs.simpleRules1
                        .validate()
                        .then(success => {
                            if (success) {
                                const payload = {
                                    year_id: this.$route.params.id,
                                    name: 'ADMISSION_APPLICATION',
                                    value: this.applicant_form,
                                };
                                this.editTuitionFees({
                                    id: this.settings_id || null,
                                    query: payload,
                                })
                                    .then(_ => {
                                        this.applicant_dialog = false;
                                        this.dialog = false;
                                        this.students_dialog = false;
                                        this.grade_id = null;
                                        this.init();
                                        this.$swal({
                                            icon: 'success',
                                            title: `${this.$t('Global.saved')}`,
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });
                                    })
                                    .catch(error => {
                                        this.grade_id = null;
                                        this.$swal({
                                            icon: 'error',
                                            text: `${this.$t('Global.facultyExist')}`,
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });
                                    });
                            }
                        })
                        .catch(error => {
                            this.$swal({
                                icon: 'error',
                                text: `${this.$t('Global.facultyExist')}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                });
            },

            updateTuitionFees(data, is_usd) {
                if (data) {
                    this.form.faculty_id = data.faculty?.id;
                    this.form.program_id = data.program?.id;
                    this.ruleForm.first_instalment = data.data?.first_instalment;
                    this.ruleForm.second_instalment = data.data?.second_instalment;
                    this.ruleForm.total = data.total;
                    this.ruleForm.first_usd_instalment = data.data?.first_usd_instalment;
                    this.ruleForm.second_usd_instalment = data.data?.second_usd_instalment;
                    this.ruleForm.minimum_grade = data.data?.minimum_grade;
                    this.ruleForm.quota = data.data?.quota;
                    this.ruleForm.total_usd = data.total_usd;
                    this.settings_id = data.id;
                    this.is_usd = is_usd == 3 ? 2 : 1;
                } else {
                    this.form.faculty_id = null;
                    this.form.program_id = null;
                    this.ruleForm.first_instalment = null;
                    this.ruleForm.second_instalment = null;
                    this.ruleForm.total = null;
                    this.ruleForm.first_usd_instalment = null;
                    this.ruleForm.second_usd_instalment = null;
                    this.ruleForm.total_usd = null;
                    this.settings_id = null;
                    this.ruleForm.first_usd_instalment = null;
                    this.ruleForm.second_usd_instalment = null;
                    this.ruleForm.minimum_grade = null;
                    this.is_usd = 3;
                }
                this.openDialog();
            },

            updatePGTuitionFees(data, is_usd) {
                if (data) {
                    this.form.faculty_id = data.faculty?.id;
                    this.form.program_id = data.program?.id;
                    this.ruleForm.first_year = data.data?.first_year;
                    this.ruleForm.second_year = data.data?.second_year;
                    this.ruleForm.third_year = data.data?.third_year;
                    this.ruleForm.total = data.total;
                    this.ruleForm.first_usd_year = data.data?.first_usd_year;
                    this.ruleForm.second_usd_year = data.data?.second_usd_year;
                    this.ruleForm.third_usd_year = data.data?.third_usd_year;
                    this.ruleForm.total_usd = data.total_usd;
                    this.settings_id = data.id;
                    this.is_usd = is_usd == 3 ? 2 : 1;
                } else {
                    this.form.faculty_id = null,
                        this.form.program_id = null,
                        this.ruleForm.first_year = null,
                        this.ruleForm.second_year = null,
                        this.ruleForm.third_year = null,
                        this.ruleForm.total = null,
                        this.ruleForm.first_usd_year = null,
                        this.ruleForm.second_usd_year = null,
                        this.ruleForm.third_usd_year = null,
                        this.ruleForm.total_usd = null,
                        this.settings_id = null,
                        this.is_usd = 3
                }
                this.openPGDialog();
            },

            openPGDialog() {
                this.pg_dialog = true;
            },

            updateExamFees(data, is_usd) {
                if (data) {
                    this.form.faculty_id = data.faculty?.id;
                    this.form.program_id = data.program?.id;
                    this.exam_form.training_course = data.data?.training_course;
                    this.exam_form.admission_exam = data.data?.admission_exam;
                    this.settings_id = data.id;
                    this.is_usd = is_usd;
                } else {
                    this.form.faculty_id = null;
                    this.form.program_id = null;
                    this.exam_form.training_course = null;
                    this.exam_form.admission_exam = null;
                    this.settings_id = null;
                }
                this.openExamDialog();
            },

            updateApplicantFees(data, is_usd) {
                if (data) {
                    this.applicant_form.application_fess = data.value?.application_fess;
                    this.applicant_form.application_fess_usd = data.value?.application_fess_usd;
                    this.applicant_form.after = data.value?.after;
                    this.settings_id = data.id;
                    this.is_usd = is_usd;
                } else {
                    this.applicant_form.application_fess = null;
                    this.applicant_form.application_fess_usd = null;
                    this.applicant_form.after = null;
                    this.settings_id = null;
                }
                this.openApplicantDialog();
            },

            updateEnrollmentSettings(data) {
                if (data) {
                    this.ruleForm.faculty_id = data.faculty ? data.faculty.id : null;
                    this.ruleForm.bylaw_id = data.bylaw ? data.bylaw.id : null;
                    this.ruleForm.term_id = this.id;
                    this.ruleForm.registration_date_from = data.value.registration_date_from;
                    this.ruleForm.registration_date_to = data.value.registration_date_to;
                    this.ruleForm.withdraw_date_from = data.value.withdraw_date_from;
                    this.ruleForm.withdraw_date_to = data.value.withdraw_date_to;
                    this.ruleForm.adddrop_date_from = data.value.adddrop_date_from;
                    this.ruleForm.adddrop_date_to = data.value.adddrop_date_to;
                    this.ruleForm.drop_date_from = data.value.drop_date_from;
                    this.ruleForm.drop_date_to = data.value.drop_date_to;
                    // this.ruleForm.min_gpa = data.value.min_gpa;
                    this.ruleForm.name = data.name;
                    this.settings_id = data.id;
                } else {
                    this.ruleForm.faculty_id = null;
                    this.ruleForm.bylaw_id = null;
                    this.ruleForm.term_id = this.id;
                    this.ruleForm.registration_date_from = null;
                    this.ruleForm.registration_date_to = null;
                    this.ruleForm.withdraw_date_from = null;
                    this.ruleForm.withdraw_date_to = null;
                    this.ruleForm.adddrop_date_from = null;
                    this.ruleForm.adddrop_date_to = null;
                    this.ruleForm.drop_date_from = null,
                        this.ruleForm.drop_date_to = null,
                        // this.ruleForm.min_gpa = null;
                        this.ruleForm.name = 'ENROLLMENT_SETTINGS';
                }
                this.openEnrollDialog();
            },
            submitEnrollment() {
                this.$nextTick(_ => {
                    this.$refs.ruleForm
                        .validate()
                        .then(success => {
                            if (success) {
                                const payload = {
                                    faculty_id: this.ruleForm.faculty_id,
                                    bylaw_id: this.ruleForm.bylaw_id,
                                    term_id: this.$route.params.id,
                                    name: 'ENROLLMENT_SETTINGS',
                                    value: {
                                        registration_date_from: this.ruleForm.registration_date_from,
                                        registration_date_to: this.ruleForm.registration_date_to,
                                        adddrop_date_from: this.ruleForm.adddrop_date_from,
                                        adddrop_date_to: this.ruleForm.adddrop_date_to,
                                        withdraw_date_from: this.ruleForm.withdraw_date_from,
                                        withdraw_date_to: this.ruleForm.withdraw_date_to,
                                        drop_date_from: this.ruleForm.drop_date_from,
                                        drop_date_to: this.ruleForm.drop_date_to,
                                        // min_gpa: this.ruleForm.min_gpa,
                                    },
                                };

                                this.addSetting({
                                    id: this.settings_id || null,
                                    query: payload,
                                })
                                    .then(_ => {
                                        this.dialog = false;
                                        this.init();
                                        this.$swal({
                                            icon: 'success',
                                            title: `${this.$t('Global.saved')}`,
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });
                                    })
                                    .catch(error => {
                                        this.$swal({
                                            icon: 'error',
                                            text: `${this.$t('Global.errorMessage')}`,
                                            showConfirmButton: false,
                                            timer: 2000,
                                        });
                                    });
                            }
                        })
                        .catch(error => {
                            this.$swal({
                                icon: 'error',
                                text: `${this.$t('Global.errorMessage')}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                });
            },
            remove(id) {
                this.$swal({
                    title: `${this.$t('Global.deleteTitle')}`,
                    text: `${this.$t('Global.deleteText')}`,
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    confirmButtonText: `${this.$t('Global.deleteBtn')}`,
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-outline-danger ml-1',
                    },
                    buttonsStyling: false,
                }).then(result => {
                    if (result.value) {
                        this.removeSetting(id).then(_ => {
                            this.$swal({
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                                title: this.$t('Global.deleted'),
                            });
                            this.init();
                        });
                    }
                });
            },

            init() {
                this.getLookups({
                    faculty_id: this.ruleForm.faculty_id,
                    faculties: true,
                    bylaws: true,
                }).then(_ => {
                    if (this.id) {
                        this.$store.dispatch('years/get', this.id).then(_ => {
                        });
                    }
                });
            },
        },
    };
</script>

<style scoped></style>
