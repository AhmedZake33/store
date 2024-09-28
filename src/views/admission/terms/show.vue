<template>
    <div>
        <!--    <statistics :items="item" :only="['students_count', 'offerings_count']"></statistics>-->
        <b-card class="mb-0">
            <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
                <b-tab>
                    <template #title>
                        <feather-icon icon="BookOpenIcon"/>
                        <span>{{ $t('Global.basic_info') }}</span></template
                    >
                    <Edit v-if="edit" @hide="edit = false" :inline="true"/>
                    <ShowComponent v-if="item && !edit" :data="item"
                                   :only="['code', 'name', 'name_local', 'id', 'year', 'start_date', 'end_date']"
                                   :loading="load">
                        <template #edit>
                            <div class="mt-0">
                                <feather-icon v-b-tooltip.hover="$t('Global.edit')" style="cursor: pointer"
                                              icon="EditIcon" class="font-medium-3" @click="edit = true"/>
                            </div>
                        </template>
                        <template #name="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.name_custom`) }}
                            </th>
                            <td class="d-flex flex-wrap">
                                {{ data.name }}
                            </td>
                        </template>
                        <template #name_local="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.arabic_name`) }}
                            </th>
                            <td class="d-flex flex-wrap">
                                {{ data.name_local }}
                            </td>
                        </template>
                        <template #id="{ data }">
                            <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
                                {{ $t(`Global.name_local`) }}
                            </th>
                            <td v-if="$i18n.locale == 'en'" class="d-flex flex-wrap">
                                {{ data.name_local }}
                            </td>

                            <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
                            <td v-if="$i18n.locale == 'ar'" class="d-flex flex-wrap">
                                {{ data.name }}
                            </td>
                        </template>
                    </ShowComponent>
                </b-tab>
                <b-tab>
                    <template #title>
                        <feather-icon icon="DollarSignIcon"/>
                        <span>{{ $t('Global.tuition_fees') }}</span></template
                    >

                    <b-row class="mb-1 w-100 align-items-center">
                        <div class="mx-2 d-block w-100">
                            <h3 class="m-0">{{ $t('Global.applicant_file') }}</h3>
                        </div>
                        <div class="mx-2 d-block w-100 text-center">
                            <strong class="w-100 d-flex justify-content-center align-items-center flex-wrap">
                                <div v-if="item && item.applicant_setting">
                                    {{ $t('Global.a_amount') }} :
                                    <small class="text-uppercase text-primary text-bold">
                                        {{ numberWithCommas(item.applicant_setting.value.application_fess) }}
                                    </small>
                                    {{ $t('Global.usd_amount') }} :
                                    <small class="text-uppercase text-primary text-bold">
                                        {{ numberWithCommas(item.applicant_setting.value &&
                                        item.applicant_setting.value.application_fess_usd ?
                                        item.applicant_setting.value.application_fess_usd : '-') }}
                                    </small>
                                    <strong>{{ $t('Global.ttb') }}</strong
                                    >:
                                    <small v-if="item.applicant_setting && item.applicant_setting.value.after"
                                           class="text-uppercase text-primary text-bold"> {{
                                        $t('Global.applicant_after') }}</small>
                                    <span v-else class="text-uppercase text-primary text-bold"> {{ $t('Global.applicant_before') }}</span>
                                </div>
                                <feather-icon icon="EditIcon"
                                              v-if="item && item.applicant_setting && item.applicant_setting.value"
                                              class="mx-2" style="cursor: pointer"
                                              @click="updateApplicantFees(item.applicant_setting, 2)"/>
                                <feather-icon icon="PlusCircleIcon" v-else class="mx-2" style="cursor: pointer"
                                              @click="updateApplicantFees()"/>
                            </strong>
                        </div>
                    </b-row>
                    <TabTable v-if="item" add :head_tuition="true" no-details :table="1" class="mt-0" :loading="load"
                              :title="$t('Global.EGP_tuition_fees_alert')" :fields="EGPFields"
                              :items="item.payment_settings" settings @add="updateTuitionFees"
                              @update="updateTuitionFees" @remove="remove"/>

                    <TabTable v-if="item" :head_tuition="true" no-details :table="3" class="mt-2" settings
                              :loading="load" :title="$t('Global.USD_tuition_fees_alert')" :fields="USDFields"
                              @update="updateTuitionFees" @remove="remove" :items="item.payment_settings"/>

                    <TabTable v-if="item" add no-details class="mt-2" :loading="load" :table="5"
                              :title="$t('Global.admission_exam_fees_alert')" :fields="ExamFields" settings
                              :items="item.exam_settings" @update="updateExamFees" @add="updateExamFees"
                              @remove="remove"/>
                </b-tab>
                <b-tab>
                    <template #title>
                        <feather-icon icon="SettingsIcon"/>
                        <span>{{ $t('Global.allowable_students') }}</span></template
                    >
                    <TabTable v-if="item" no-details :table="4" class="mt-2" :loading="load"
                              :title="$t('Global.allowable_students')" :fields="fields" settings add
                              :items="item.settings" @add="updateStudentsFees" @update="updateStudentsFees"
                              @remove="remove"/>
                </b-tab>
            </b-tabs>
        </b-card>
        <b-modal id="modalPopover" v-model="dialog" no-close-on-backdrop size="lg"
                 :title="is_usd == 3 ? $t('Global.add_admission_setting') : $t('Global.edit_admission_setting')">
            <validation-observer ref="simpleRules1">
                <b-form :class="load ? 'disabled_all' : ''"  ref="simpleRules1">
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
                                            :options="lookups.programs"
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
                                    <validation-provider #default="{ errors }" name="second_instalment" rules="required">
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
                                    <validation-provider #default="{ errors }" name="first_usd_instalment" rules="required">
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
                        <b-button type="reset" variant="outline-secondary" @click="resetType">
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </b-col>
                </b-row>
            </template>
        </b-modal>
        <b-modal id="modalPopover" v-model="students_dialog" no-close-on-backdrop size="lg"
                 :title="is_usd == 3 ? $t('Global.add_admission_setting') : $t('Global.edit_admission_setting')">
            <validation-observer ref="simpleRules2">
                <b-form :class="load ? 'disabled_all' : ''" ref="simpleRules2">
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
                                    <v-select v-if="lookups" v-model="form.program_id" :filter="fuseSearch"
                                              :disabled="!form.faculty_id"
                                              :class="errors.length > 0 ? 'custom_invalid' : ''"
                                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                              :options="getPrograms()" input-id="code-input" :reduce="val => val.id">
                                        <template v-slot:option="option">
                                            <strong v-if="$i18n.locale =='ar'">{{ option.name_local }}</strong>
                                            <strong v-else>{{ option.name }}</strong>
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

                        <template v-if="is_usd == 4 || is_usd == 3">
                            <!-- <b-col md="12">
                                              <span class="my-3 font-weight-bolder">{{$t('Global.allowable_students')}}</span>
                                              <hr/>
                                          </b-col> -->
                            <b-col md="6" v-if="item.type.type != 5">
                                <b-form-group :label="$t('Global.minimum_grade_current')" label-for="first_instalment">
                                    <validation-provider #default="{ errors }" name="first_instalment" rules="required">
                                        <b-form-input type="number" v-model="ruleForm.minimum_grade"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="item.type.type != 5">
                                <b-form-group :label="$t('Global.minimum_grade_prev')" label-for="first_instalment">
                                    <validation-provider #default="{ errors }" name="first_instalment" rules="required">
                                        <b-form-input type="number" v-model="ruleForm.prev_minimum_grade"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" v-if="item.type.type != 5">
                                <b-form-group :label="$t('Global.stem_grade')" label-for="first_instalment">
                                    <validation-provider #default="{ errors }" name="first_instalment" rules="required">
                                        <b-form-input type="number" v-model="ruleForm.stem_minimum_grade"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>
                            <b-col md="6" >
                                <b-form-group :label="$t('Global.student_quota')" label-for="second_instalment">
                                    <validation-provider #default="{ errors }" name="second_instalment"
                                                         rules="integer|required">
                                        <b-form-input type="number" v-model="ruleForm.quota"
                                                      :state="errors.length > 0 ? false : null"/>
                                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                            }}</small>
                                    </validation-provider>
                                </b-form-group>
                            </b-col>

                            <b-col md="12" v-if="item.type.type != 5">
                                <hr/>
                                <h4 class="my-1">
                                    {{ $t('Global.certificates') }}
                                </h4>
                            </b-col>
                            <b-col md="4" v-if="item.type.type != 5">
                                <b-form-group :label="$t('Global.certificate')" label-for="mc-program">
                                    <validation-provider #default="{ errors }" name="pre_university_certificate_groupe">
                                        <v-select :filter="fuseSearch"
                                                  v-model="ruleForm.pre_university_certificate_groupe"
                                                  :options="certificate_sections" :reduce="el => el.id"
                                                  :class="errors.length > 0 ? 'custom_invalid' : ''"
                                                  :label="getSelectLabel()" class="w-100" clearable>
                                            <template slot="selected-option" slot-scope="option">
                                                <span v-if="$i18n.locale == 'ar'">
                                                  {{ option.name_local || option.name }}
                                                </span>
                                                                        <span v-else>
                                                  {{ option.name || option.name_local }}
                                                                            <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                                                                          {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                                                </span>
                                            </template>
                                            <template v-slot:option="option">
                                                {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name
                                                || option.name_local }}
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
                            <b-col md="4" v-if="item.type.type != 5">
                                <b-form-group :label="$t('Global.pre_university_certificate')" label-for="mc-program">
                                    <validation-provider #default="{ errors }" name="pre_university_certificate">
                                        <v-select
                                                v-model="ruleForm.pre_university_certificate"
                                                :options="certificates"
                                                :filter="fuseSearch"
                                                :reduce="el => el.id"
                                                :disabled="!ruleForm.pre_university_certificate && !ruleForm.pre_university_certificate_groupe"
                                                :class="errors.length > 0 ? 'custom_invalid' : ''"
                                                :label="getSelectLabel()"
                                                class="w-100"
                                                clearable
                                        >
                                            <template slot="selected-option" slot-scope="option">
                                            <span v-if="$i18n.locale == 'ar'">
                                              {{ option.name_local || option.name }}
                                            </span>
                                                                    <span v-else>
                                              {{ option.name || option.name_local }}
                                                                        <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                                                                      {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                                            </span>
                                            </template>
                                            <template v-slot:option="option">
                                                {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name
                                                || option.name_local }}
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
                            <b-col md="4" v-if="item.type.type != 5">
                                <b-form-group :label="$t('Global.pre_university_certificate_type')"
                                              label-for="mc-program">
                                    <validation-provider #default="{ errors }" name="pre_university_certificate_type">
                                        <v-select
                                                v-model="ruleForm.pre_university_certificate_type"
                                                :options="certificate_types"
                                                :filter="fuseSearch"
                                                multiple
                                                :disabled="!ruleForm.pre_university_certificate && !ruleForm.pre_university_certificate_type"
                                                :class="errors.length > 0 ? 'custom_invalid' : ''"
                                                :label="getSelectLabel()"
                                                class="w-100"
                                                :reduce="val => val.id"
                                                clearable
                                        >
                                            <!-- @option:selected="addGrades"
                                            @option:deselected="removeGrades" -->
                                            <template slot="selected-option" slot-scope="option">
                                                <span v-if="$i18n.locale == 'ar'">
                                                  {{ option.name_local || option.name }}
                                                </span>
                                                                        <span v-else>
                                                  {{ option.name || option.name_local }}
                                                                            <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                                                                          {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                                                </span>
                                            </template>
                                            <template v-slot:option="option">
                                                {{ $i18n.locale == 'ar' ? option.name_local || option.name : option.name
                                                || option.name_local }}
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


                            <b-col md="12" class="mt-2" v-if="item.type.type != 5">
                                <hr/>
                                <h4 class="my-1">{{ $t('Global.required_subjects') }}</h4>
                            </b-col>

                            <b-col md="12" class="mt-2" v-if="item.type.type != 5">
                                <b-form-checkbox :key="option.text" v-for="option in options_langs" :id="option.text"
                                                 v-model="ruleForm[option.text]" :name="option.text" :value="true"
                                                 :unchecked-value="false">{{ $t(`Global.${option.text}`) }}
                                </b-form-checkbox>
                            </b-col>
                        </template>
                    </div>
                </b-form>
            </validation-observer>
            <template #modal-footer>
                <b-row :class="load ? 'disabled_all' : ''">
                    <b-col md="12">
                        <b-button type="submit" variant="primary" class="mr-1" @click="submitStudents">
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button type="reset" variant="outline-secondary" @click="students_dialog = false">
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
                <b-form :class="load ? 'disabled_all' : ''"  ref="simpleRules1">
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
    import Edit from '@/views/admission/terms/edit';
    import Statistics from '@/views/components/info/statistics';
    import TabTable from '@/views/students/student/components/TabTable';

    export default {
        name: 'Show',
        components: {
            TabTable,
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
                item: 'terms/item',
                settings: 'settings/items',
                load: 'terms/load',
                lookups: 'app/lookups',
            }),
            id() {
                return this.$route.params.id ? this.$route.params.id : null;
            },
            certificate_sections() {
                if (this.lookups && this.lookups.certificates) {
                    return this.lookups.certificates;
                }
                return false;
            },
            certificates() {
                if (this.lookups && this.lookups.certificates && this.ruleForm.pre_university_certificate_groupe) {
                    this.certificatesArray = this.lookups.certificates.find(el => el.id == this.ruleForm.pre_university_certificate_groupe);
                    return this.certificatesArray ? this.certificatesArray.pre_university_certificate : [];
                }
            },
            certificate_types() {
                if (this.lookups && this.lookups.certificates && this.ruleForm.pre_university_certificate && this.certificatesArray) {
                    const certificateTypeArray = this.certificates ? this.certificates.find(el => el.id == this.ruleForm.pre_university_certificate) : {};
                    return certificateTypeArray ? certificateTypeArray.pre_university_certificate_type : [];
                }
            },
            EGPFields() {
                let fields = [
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
                if(this.item.code == 'AUG-S23'){
                   return fields.filter(el=>el.key != 'second_instalment')
                }else{
                   return fields   
                }
            },
            USDFields() {
                let fields = [
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
                 if(this.item.code == 'AUG-S23'){
                   return fields.filter(el=>el.key != 'second_usd_instalment')
                }else{
                   return fields   
                }
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
            fields() {
                if(this.item.type.type == 5){
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
                }else{
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
                }
                
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
        },
        data() {
            return {
                edit: false,
                dialog: false,
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
                options_langs: [
                    {text: 'arabic', value: false},
                    {text: 'english', value: false},
                    {text: 'french', value: false},
                    {text: 'german', value: false},
                    {text: 'italy', value: false},
                    {text: 'math', value: false},
                    {text: 'advanced_math', value: false},
                    {text: 'biology', value: false},
                    {text: 'chemistry', value: false},
                    {text: 'physics', value: false},
                ],
                ruleForm: {
                    arabic: false,
                    english: false,
                    french: false,
                    german: false,
                    math: false,
                    advanced_math: false,
                    biology: false,
                    chemistry: false,
                    physics: false,
                    italy: false,
                    total: this.totalFees,
                    total_usd: this.totalUsdFees,
                    second_instalment: null,
                    first_instalment: null,
                    second_usd_instalment: null,
                    first_usd_instalment: null,
                    minimum_grade: null,
                    quota: null,
                    pre_university_certificate_groupe: null,
                    pre_university_certificate: null,
                    pre_university_certificate_type: null,
                    pre_university_certificate_types: [],
                },
                settings_id: null,
            };
        },
        watch: {
            'ruleForm.pre_university_certificate_groupe': function (val, newValue) {
                if (newValue) {
                    this.ruleForm.pre_university_certificate = null;
                }
            },
            'form.faculty_id': function (val) {
                this.getLookups({
                    faculty_id_programs: val,
                    faculties: true,
                    pre_certificates: true,
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
            'ruleForm.minimum_grade'(val) {
                if (val) {
                    if (val > 100) {
                        this.ruleForm.minimum_grade = null;
                    }
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
            resetType(){
                this.is_usd = 3;
                this.dialog = false;
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
            openStudentDialog() {
                this.students_dialog = true;
            },
            openDialog() {
                this.dialog = true;
            },
            openExamDialog() {
                this.exam_dialog = true;
            },
            openApplicantDialog() {
                this.applicant_dialog = true;
            },
            submitStudents() {
                this.$nextTick(_ => {
                    this.$refs.simpleRules2.validate().then(success => {
                        if (success) {
                            let type = {certificate_type: this.ruleForm?.pre_university_certificate_type}
                            delete this.ruleForm["pre_university_certificate_types"];
                            delete this.ruleForm["pre_university_certificate_type"];
                            const payload = {
                                faculty_id: this.form.faculty_id,
                                program_id: this.form.program_id,
                                term_id: this.$route.params.id,
                                name: 'ADMISSION_SETTINGS',
                                value: {...this.ruleForm, ...type},
                            };
                            this.editTuitionFees({
                                id: this.settings_id || null,
                                query: payload,
                            })
                                .then(_ => {
                                    (this.dialog = false), (this.students_dialog = false), (this.grade_id = null);
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
                                text: `${this.$t('Global.errorMessage')}`,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                        });
                });
            },
            checkStudentsFaculty(faculty_id, program_id) {
                if (program_id) {
                    return true;
                } else {
                    if (faculty_id) {
                        let selectedFaculties = this.item.settings.some(el => el.faculty.id == faculty_id);
                        if (selectedFaculties) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
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
            //   checkApplicantFaculty(faculty_id,program_id){
            //     if(program_id){
            //         return true
            //     }else{
            //         if(faculty_id){
            //             let selectedFaculties = this.item.settings.some(el => el.faculty.id == faculty_id)
            //             if(selectedFaculties){
            //                 return false
            //             }else{
            //                 return true
            //             }
            //         }
            //     }
            // },
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
                                    term_id: this.$route.params.id,
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
                                    term_id: this.$route.params.id,
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
                                    term_id: this.$route.params.id,
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

            addGrades(val) {
                if (val) {
                    const last_element = val[val.length - 1];
                    this.grades.push({
                        certificate_type: last_element.id,
                        minimum_grade: null,
                        name: last_element.name,
                        name_local: last_element.name_local,
                    });
                }
            },
            removeGrades(val) {
                if (val) {
                    this.grades.pop();
                    this.types.pop();
                }
            },
            updateItemForm(index, val, item) {
                if (this.grades) {
                    this.grades.forEach(el => {
                        this.types[index] = {
                            certificate_type: item.certificate_type,
                            minimum_grade: val.target.value,
                        };
                    });
                }
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
                    faculty_id_programs: this.ruleForm.faculty_id || this.form.faculty_id,
                    faculties: true,
                    pre_certificates: true,
                }).then(_ => {
                    if (this.id) {
                        this.$store.dispatch('terms/get', this.id).then(_ => {
                            if (this.ruleForm.pre_university_certificate_type) {
                                this.ruleForm.pre_university_certificate_type.forEach((el, i) => {
                                    this.item.data.pre_university_certificate_types.forEach(type => {
                                        if (el.id == type.certificate_type) {
                                            this.grades[i] = {
                                                certificate_type: type.certificate_type,
                                                minimum_grade: type.minimum_grade,
                                                name: el.name,
                                                name_local: el.name_local,
                                            };
                                            this.types[i] = {
                                                certificate_type: type.certificate_type,
                                                minimum_grade: type.minimum_grade,
                                            };
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            },
        },
    };
</script>

<style scoped></style>
