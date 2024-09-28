<template>
  <div class="new-edit">
    <div class="new-edit">
      <validation-observer ref="fromRules">
        <b-form ref="formRequest" @submit.stop.prevent="save">
          <b-row>

            <b-col v-if="editPartion == 'personal_info'" md="12">
              <!--                Personal info -->
              <list
                  style="padding: 0 !important"
                  :data="input"
                  :only="[]"
                  :has-margins="false"
                  class="new_edit"
              >
                <template #custom_show>
                  <!--                English Name   -->
                  <tr>
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.english_name`) }}
                    </th>
                    <td>
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              rules="required|english"
                          >
                            <b-form-input v-model="input.student.name"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--                      Arabic name   -->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.arabic_name`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              rules="required|arabic"
                          >
                            <b-form-input v-model="input.student.name_local"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!-- Gender -->
                  <tr v-if="input.birth_country.id != 64 || input.student.national_num == null">
                    <th scope="row" :width="'40%'">
                      {{ $t(`Global.gender`) }}
                    </th>
                    <td class="width-100">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              rules="required"
                          >
                            <v-select
                                v-model="input.gender"
                                :label=" $i18n.locale == 'en' ? 'name' : 'name_local' "
                                :dir=" $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr' "
                                :options="genderOptions"
                                :clearable="false"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                            >
                              <template #no-options>
                                {{ $t('noMatching') }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!-- Birth Date -->
                  <tr v-if="input.student.nationality.id != 64 || input.student.national_num == null">
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.birth_date`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              rules="required"
                          >
                            <!-- <b-form-datepicker
                              :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                              id="date-input"
                              show-decade-nav
                              v-model="input.student.birth_date"
                              :state="errors.length > 0 ? false : null"
                              :placeholder="$t('Global.birth_date')"
                            /> -->

                            <b-input-group class="d-flex">
                              <b-form-input
                                  id="example-input"
                                  v-model="input.birth_date"
                                  type="text"
                                  :max="maxDate"
                                  placeholder="YYYY-MM-DD"
                                  autocomplete="off"
                              ></b-form-input>
                              <b-input-group-append>
                                <b-form-datepicker
                                    v-model="input.birth_date"
                                    button-only
                                    :max="maxDate"
                                    size="sm"
                                    right
                                    locale="en-US"
                                    aria-controls="example-input"
                                ></b-form-datepicker>
                              </b-input-group-append>
                            </b-input-group>

                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--Birth Country -->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.birth_country`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              rules="required"
                          >
                            <v-select
                                v-model="input.birth_country_id"
                                :label="
                                $i18n.locale == 'en' ? 'name' : 'name_local'
                              "
                                :dir="
                                $store.state.appConfig.layout.isRTL
                                  ? 'rtl'
                                  : 'ltr'
                              "
                                :options="
                                studentsLookups && studentsLookups.countries
                              "
                                :clearable="false"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                            >
                              <template v-slot:option="option">
                                {{
                                  $i18n.locale == 'en'
                                      ? option.name
                                      : option.name_local
                                }}
                              </template>
                              <template #selected-option="{ name, name_local }">
                                <div
                                    style="display: flex; align-items: baseline"
                                >
                                  <strong>{{
                                      $i18n.locale == 'en' ? name : name_local
                                    }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t('noMatching') }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!-- government -->
                  <tr>
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.governorate`) }}
                    </th>
                    <td>
                      <div>
                        <b-form-group>
                          <validation-provider #default="{ errors }">
                            <b-form-input v-model="input.birth_governate.name"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--Birth city -->
                  <tr style="border-bottom: 3px solid #ccc">
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.birth_city`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider #default="{ errors }">
                            <b-form-input v-model="input.data.birth_city"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!-- Nationality-->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.nationality`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              rules="required"
                          >
                            <v-select
                                v-model="input.student.nationality.id"
                                :label="
                                $i18n.locale == 'en'
                                  ? 'nationality'
                                  : 'nationality_local'
                              "
                                :dir="
                                $store.state.appConfig.layout.isRTL
                                  ? 'rtl'
                                  : 'ltr'
                              "
                                :options="
                                studentsLookups && studentsLookups.countries
                              "
                                :clearable="false"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                            >
                              <template v-slot:option="option">
                                {{
                                  $i18n.locale == 'en'
                                      ? option.nationality
                                      : option.nationality_local
                                }}
                              </template>
                              <template
                                  #selected-option="{
                                  nationality,
                                  nationality_local,
                                }"
                              >
                                <div
                                    style="display: flex; align-items: baseline"
                                >
                                  <strong>{{
                                      $i18n.locale == 'en'
                                          ? nationality
                                          : nationality_local
                                    }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t('noMatching') }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--                      National Id-->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.national_id`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :rules="nationalIdRules"
                          >
                            <b-form-input
                                v-model="input.student.national_num"
                            />
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--                      Passport Number-->
                  <tr style="border-bottom: 3px solid #ccc">
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.passport_number`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :rules="passportRules"
                          >
                            <b-form-input
                                v-model="input.student.passport_number"
                            />
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>

                  <!--                      Phone -->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.phone`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              rules="mobile"
                          >
                            <b-form-input v-model="input.mobile"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--                      Address -->
                  <tr style="border-bottom: 3px solid #ccc">
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.address`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider #default="{ errors }">
                            <b-form-input v-model="input.student.address"/>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                </template>
              </list>
              <!--                Parents info -->
              <list
                  style="padding: 0 !important"
                  :data="input"
                  :only="[]"
                  class="new_edit"
              >
                <template #custom_show>
                  <!--                Father Data   -->
                  <tr style="border-bottom: 3px solid #ccc">
                    <td :width="'100%'">
                      <h3 style="text-align: start">
                        {{ $t('Global.father') }}
                      </h3>
                      <div>
                        <div style="margin-left: 8px">
                          <div>
                            <div>
                              <div>
                                <!--                                  Father Name     -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.name') }} : </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.address')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.father_name"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father Name     -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.phone') }} : </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.phone')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.father_phone"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father Email    -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.email') }} : </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.father_email')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.father_email"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father Emailing   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.mail_address') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.mail_address')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.father_mail_address"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father city   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.city') }} : </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.city')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.father_city"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Postal Code   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.postal_code') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.postal_code')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.father_postal_code"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Postal Code   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.occupation') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.occupation')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.father_job"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Work Place   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.work_place') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.work_place')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.father_work_place"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <!--                                Mother Data   -->
                  <tr style="border-bottom: 3px solid #ccc">
                    <td :width="'100%'">
                      <h3>{{ $t('Global.mother') }}</h3>
                      <div style="margin-left: 8px">
                        <div>
                          <div>
                            <div>
                              <div>
                                <!--                                  Mother Name     -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.name') }} : </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.address')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.mother_name"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Mother Name     -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.phone') }} : </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.phone')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.mother_phone"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father Email    -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.email') }} : </strong>
                                  </span>
                                  <b-form-group
                                      style="width: 80%"
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.father_email')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.mother_email"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father Emailing   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.mail_address') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.mail_address')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.mother_mail_address"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father city   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.city') }} : </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.city')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.mother_city"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Postal Code   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.postal_code') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.postal_code')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.mother_postal_code"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Postal Code   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.occupation') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.occupation')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.mother_job"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Work Place   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.work_place') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.work_place')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.mother_work_place"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <!--                Guardian  data-->
                  <tr>
                    <td :width="'100%'">
                      <h3>{{ $t('Global.guardian') }}</h3>
                      <div style="margin-left: 8px">
                        <div>
                          <div>
                            <div>
                              <div>
                                <!--                                  Mother Name     -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.name') }} : </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.address')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.guardian_name"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Mother Name     -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.phone') }} : </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.phone')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.guardian_phone"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father Email    -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.email') }} : </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.father_email')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.guardian_email"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father Emailing   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.mail_address') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.mail_address')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="
                                          input.data.guardian_mail_address
                                        "
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Father city   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong>{{ $t('Global.city') }} : </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.city')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.guardian_city"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Postal Code   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.postal_code') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.postal_code')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="
                                          input.data.guardian_postal_code
                                        "
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Postal Code   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.occupation') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.occupation')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.guardian_job"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                  Work Place   -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  >
                                    <strong
                                    >{{ $t('Global.work_place') }} :
                                    </strong>
                                  </span>
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.work_place')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.guardian_work_place"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                                <!--                                                                    Relationship -->
                                <div style="margin-bottom: 5px" class="d-flex">
                                  <span
                                      class="d-flex align-items-center"
                                      style="width: 21%"
                                  ><strong
                                  >{{ $t('Global.relationship') }} :
                                    </strong></span
                                  >
                                  <b-form-group
                                      :style="
                                      $i18n.locale == 'en'
                                        ? `margin-left:13%`
                                        : `margin-right:13%`
                                    "
                                      style="width: 80%"
                                  >
                                    <validation-provider
                                        #default="{ errors }"
                                        :name="$t('Global.relationship')"
                                        rules=""
                                    >
                                      <b-form-input
                                          v-model="input.data.guardian_relation"
                                      />
                                      <ValidationErrors
                                          :frontend-errors="errors"
                                      />
                                    </validation-provider>
                                  </b-form-group>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </list>
            </b-col>

            <b-col v-if="editPartion == 'academic_info'" md="12">
              <list
                  style="padding: 0 !important"
                  :data="input"
                  :only="[]"
                  :has-margins="false"
                  class="new_edit"
              >
                <template #custom_show>
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.Start_Term`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.Start_Term')"
                              rules="required"
                          >
                            <v-select
                                v-model="input.first_term_id"
                                :label="
                                $i18n.locale == 'en' ? 'name' : 'name_local'
                              "
                                :dir="
                                $store.state.appConfig.layout.isRTL
                                  ? 'rtl'
                                  : 'ltr'
                              "
                                :options="lookups && lookups.terms"
                                :clearable="true"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                            >
                              <template v-slot:option="option">
                                {{
                                  $i18n.locale == 'en'
                                      ? option.name
                                      : option.name_local
                                }}
                              </template>
                              <template #selected-option="{ name, name_local }">
                                <div
                                    style="display: flex; align-items: baseline"
                                >
                                  <strong>{{
                                      $i18n.locale == 'en' ? name : name_local
                                    }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t('noMatching') }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--                    Faculties -->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.faculty`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.faculty')"
                              rules="required"
                          >
                            <v-select
                                v-model="input.faculty_id"
                                :label="
                                $i18n.locale == 'en' ? 'name' : 'name_local'
                              "
                                :dir="
                                $store.state.appConfig.layout.isRTL
                                  ? 'rtl'
                                  : 'ltr'
                              "
                                :options="lookups && lookups.faculties"
                                :clearable="true"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                                :class="hasPermission('admin_system') ? '' : 'disabled_all'"
                                :disabled="(!hasPermission('admin_system'))"
                            >
                              <template v-slot:option="option">
                                {{
                                  $i18n.locale == 'en'
                                      ? option.name
                                      : option.name_local
                                }}
                              </template>
                              <template #selected-option="{ name, name_local }">
                                <div
                                    style="display: flex; align-items: baseline"
                                >
                                  <strong>{{
                                      $i18n.locale == 'en' ? name : name_local
                                    }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t('noMatching') }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--                    Bylaws    -->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.bylaw`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.bylaw')"
                              rules="required"
                          >
                            <v-select
                                v-model="input.bylaw_id"
                                :label="
                                $i18n.locale == 'en' ? 'name' : 'name_local'
                              "
                                :dir="
                                $store.state.appConfig.layout.isRTL
                                  ? 'rtl'
                                  : 'ltr'
                              "
                                :options="lookups && lookups.bylaws"
                                :clearable="true"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                                :class="hasPermission('admin_system') ? '' : 'disabled_all'"
                                :disabled="(!hasPermission('admin_system'))"
                            >
                              <template v-slot:option="option">
                                {{
                                  $i18n.locale == 'en'
                                      ? option.name
                                      : option.name_local
                                }}
                              </template>
                              <template #selected-option="{ name, name_local }">
                                <div
                                    style="display: flex; align-items: baseline"
                                >
                                  <strong>{{
                                      $i18n.locale == 'en' ? name : name_local
                                    }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t('noMatching') }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--                    programs    -->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.program`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.program')"
                              rules="required"
                          >
                            <v-select
                                v-model="input.program_id"
                                :label="
                                $i18n.locale == 'en' ? 'name' : 'name_local'
                              "
                                :dir="
                                $store.state.appConfig.layout.isRTL
                                  ? 'rtl'
                                  : 'ltr'
                              "
                                :options="lookups && lookups.programs"
                                :clearable="true"
                                input-id="field-input"
                                :reduce="(val) => val.id"
                                :class="hasPermission('admin_system') ? '' : 'disabled_all'"
                                :disabled="(!hasPermission('admin_system'))"
                            >
                              <template v-slot:option="option">
                                {{
                                  $i18n.locale == 'en'
                                      ? option.name
                                      : option.name_local
                                }}
                              </template>
                              <template #selected-option="{ name, name_local }">
                                <div
                                    style="display: flex; align-items: baseline"
                                >
                                  <strong>{{
                                      $i18n.locale == 'en' ? name : name_local
                                    }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t('noMatching') }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                  <!--                    Status data -->
                  <tr>
                    <th scope="row" :width="'30%'">
                      {{ $t(`Global.status`) }}
                    </th>
                    <td class="width-70">
                      <div>
                        <b-form-group>
                          <validation-provider
                              #default="{ errors }"
                              :name="$t('Global.status')"
                              rules="required"
                          >
                            <v-select
                                :disabled="canEditStatus"
                                v-model="input.status_data"
                                :dir="
                                $store.state.appConfig.layout.isRTL
                                  ? 'rtl'
                                  : 'ltr'
                              "
                                :options="
                                studentsLookups &&
                                studentsLookups.student_status
                              "
                                :label="
                                $i18n.locale == 'en' ? 'name' : 'name_local'
                              "
                                class="w-100 mb-2"
                                :reduce="(val) => val"
                                :placeholder="$t('Global.status')"
                            >
                              <template v-slot:option="option">
                                {{
                                  $i18n.locale == 'ar'
                                      ? option.name_local
                                      : option.name
                                }}
                              </template>
                              <template #selected-option="{ name, name_local }">
                                <div
                                    style="display: flex; align-items: baseline"
                                >
                                  <strong v-if="$i18n.locale == 'ar'">{{
                                      name_local
                                    }}</strong>
                                  <strong v-else>{{ name }}</strong>
                                </div>
                              </template>
                              <template #no-options>
                                {{ $t('noMatching') }}
                              </template>
                            </v-select>
                            <ValidationErrors :frontend-errors="errors"/>
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                </template>
              </list>
            </b-col>

            <b-col v-if="editPartion.name == 'equivalence_info' || editPartion == 'abroad_study'" md="12">
              <h4 class="mb-3 mx-1 d-flex align-items-center">
                {{ editPartion.name == 'equivalence_info' ? $t('Global.previous_courses') : 'add_study_abroad_course' }}
                {{ $t('Global.click_to_add') }}
                <feather-icon
                    @click="
                    (e) => {
                      addCourse();
                    }
                  "
                    style="cursor: pointer"
                    icon="PlusCircleIcon"
                    class="font-medium-3 mx-1"
                />
              </h4>

              <list
                  style="padding: 0 !important"
                  :data="input"
                  :only="[]"
                  v-if="!isSemesterBased"
                  :has-margins="false"
                  class=""
              >
                <template #custom_show>
                  <b-row
                      class="hover_delete position-relative pb-1 mb-1 border-bottom"
                      :key="k"
                      v-for="(item, k) in avalibleCourses"
                  >
                    <feather-icon
                        @click="
                        (e) => {
                          removeCourse(k);
                        }
                      "
                        style="cursor: pointer"
                        icon="TrashIcon"
                        class="font-medium-3 show_hover"
                    />
                    <b-col cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t('Global.code')"
                          label-for="code-input"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="code"
                            rules="code|required"
                        >
                          <b-form-input
                              @input="updateInput($event, 'code', k)"
                              :placeholder="$t('Global.code')"
                              id="code-input"
                              :value="item.code"
                              :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'code')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <!--                    Faculties -->
                    <b-col cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t('Global.title')"
                          label-for="name-input"
                          invalid-feedback="English Name is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="title"
                            rules="english|required"
                        >
                          <b-form-input
                              @input="updateInput($event, 'title', k)"
                              :placeholder="$t('Global.title')"
                              @keypress="sanitizeEnglish($event)"
                              id="name-input"
                              :value="item.title"
                              :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'title')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.credit_hours`)"
                          label-for=" credit_hours-input"
                          invalid-feedback="lecture hours is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="integer"
                            name="credit_hours"
                        >
                          <b-form-input
                              @input="updateInput($event, 'credit_hours', k)"
                              :placeholder="'1-9'"
                              :state="errors.length > 0 ? false : null"
                              id="credit_hours-input"
                              :value="item.credit_hours"
                              type="number"
                              min="0"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'credit_hours')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <!--                    Bylaws    -->
                    <b-col class="mt-1" cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.description`)"
                          label-for=" description-input"
                          invalid-feedback="lecture hours is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="description"
                        >
                          <b-form-textarea
                              @input="updateInput($event, 'description', k)"
                              :placeholder="$t('Global.description')"
                              id=" description-input"
                              :value="item.description"
                              rows="3"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'description')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <!--                    programs    -->
                    <b-col class="mt-1" cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.grade`)"
                          label-for="grade-input"
                          invalid-feedback="English Name is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="grade"
                            rules="english|required"
                        >
                          <b-form-input
                              @input="updateInput($event, 'grade', k)"
                              :placeholder="'A+,B,B+,...'"
                              @keypress="sanitizeEnglish($event)"
                              id="name-input"
                              :value="item.grade"
                              :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'grade')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <!--                    Status data -->
                </template>
              </list>

              <list
                  style="padding: 0 !important"
                  :data="input"
                  :only="[]"
                  v-else
                  :has-margins="false"
                  class=""
              >
                <template #custom_show>

                  <b-row
                      class="hover_delete position-relative pb-1 mb-1 border-bottom"
                      :key="k"
                      v-for="(item, k) in avalibleCourses"
                  >
                    <feather-icon
                        @click="
                        (e) => {
                          removeCourse(k);
                        }
                      "
                        style="cursor: pointer"
                        icon="TrashIcon"
                        class="font-medium-3 show_hover"
                    />
                    <b-col cols="12" lg="4" md="4" v-if="editModeVersion == 'abroad_study'">
                      <b-form-group
                          :label="$t('Global.term')"
                          label-for="code-input"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="code"
                            rules="required"
                        >
                          <v-select
                              @input="updateInput($event, 'term', k)"
                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                              :clearable="false"
                              :label="$i18n.locale == 'ar' ? 'name_local' : 'name'"
                              :options="lookups.abroad_study_terms"
                              :reduce="option => option.id"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'term')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t('Global.code')"
                          label-for="code-input"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="code"
                            rules="code|required"
                        >
                          <b-form-input
                              @input="updateInput($event, 'code', k)"
                              :placeholder="$t('Global.code')"
                              id="code-input"
                              :value="item.code"
                              :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'code')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <!--                    Faculties -->
                    <b-col cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t('Global.title')"
                          label-for="name-input"
                          invalid-feedback="English Name is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="title"
                            rules="english|required"
                        >
                          <b-form-input
                              @input="updateInput($event, 'title', k)"
                              :placeholder="$t('Global.title')"
                              @keypress="sanitizeEnglish($event)"
                              id="name-input"
                              :value="item.title"
                              :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'name')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col :class="editModeVersion == 'abroad_study' ? 'mt-1' : ''" cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.lecture_hours`)"
                          label-for=" lecture_hours-input"
                          invalid-feedback="lecture hours is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="integer"
                            name="lecture_hours"
                        >
                          <b-form-input
                              @input="updateInput($event, 'lecture_hours', k)"
                              :placeholder="'1-9'"
                              :state="errors.length > 0 ? false : null"
                              id="lecture_hours-input"
                              :value="item.lecture_hours"
                              type="number"
                              min="0"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'lecture_hours')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col class="mt-1" cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.tutorial_hours`)"
                          label-for=" tutorial_hours-input"
                          invalid-feedback="lecture hours is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="integer"
                            name="tutorial_hours"
                        >
                          <b-form-input
                              @input="updateInput($event, 'tutorial_hours', k)"
                              :placeholder="'1-9'"
                              :state="errors.length > 0 ? false : null"
                              id="tutorial_hours-input"
                              :value="item.tutorial_hours"
                              type="number"
                              min="0"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'tutorial_hours')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col class="mt-1" cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.laboratory_hours`)"
                          label-for=" laboratory_hours-input"
                          invalid-feedback="lecture hours is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="integer"
                            name="laboratory_hours"
                        >
                          <b-form-input
                              @input="updateInput($event, 'laboratory_hours', k)"
                              :placeholder="'1-9'"
                              :state="errors.length > 0 ? false : null"
                              id="laboratory_hours-input"
                              :value="item.laboratory_hours"
                              type="number"
                              min="0"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(
                                errorsdata,
                                'laboratory_hours'
                              )
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>

                    <b-col class="mt-1" cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.total`)"
                          label-for=" total-input"
                          invalid-feedback="lecture hours is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="integer"
                            name="total"
                        >
                          <b-form-input
                              @input="updateInput($event, 'total', k)"
                              :placeholder="'1-9'"
                              :state="errors.length > 0 ? false : null"
                              id="total-input"
                              :value="item.total"
                              type="number"
                              min="0"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'total')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>

                    <b-col class="mt-1" cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.max_total`)"
                          label-for=" max_total-input"
                          invalid-feedback="lecture hours is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            rules="integer"
                            name="max_total"
                        >
                          <b-form-input
                              @input="updateInput($event, 'max_total', k)"
                              :placeholder="'1-9'"
                              :state="errors.length > 0 ? false : null"
                              id="max_total-input"
                              :value="item.max_total"
                              type="number"
                              min="0"
                          />
                          <ValidationErrors
                              default-message
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'max_total')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <!--                    Bylaws    -->

                    <!--                    programs    -->
                    <b-col class="mt-1" cols="12" lg="4" md="4">
                      <b-form-group
                          :label="$t(`Global.grade`)"
                          label-for="grade-input"
                          invalid-feedback="English Name is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="grade"
                            rules="english|required"
                        >
                          <b-form-input
                              @input="updateInput($event, 'grade', k)"
                              :placeholder="'A+,B,B+,...'"
                              @keypress="sanitizeEnglish($event)"
                              id="name-input"
                              :value="item.grade"
                              :state="errors.length > 0 ? false : null"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'grade')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                    <b-col class="mt-1" cols="12" :lg="editModeVersion == 'abroad_study' ? 12 : 4"
                           :md="editModeVersion == 'abroad_study' ? 12 : 4"
                    >
                      <b-form-group
                          :label="$t(`Global.description`)"
                          label-for=" description-input"
                          invalid-feedback="lecture hours is required"
                      >
                        <validation-provider
                            #default="{ errors }"
                            name="description"
                        >
                          <b-form-textarea
                              @input="updateInput($event, 'description', k)"
                              :placeholder="$t('Global.description')"
                              id=" description-input"
                              :value="item.description"
                              rows="3"
                          />
                          <ValidationErrors
                              :frontend-errors="errors"
                              :backend-errors="
                              getBackendFieldError(errorsdata, 'description')
                            "
                          />
                        </validation-provider>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <!--                    Status data -->
                </template>
              </list>
            </b-col>

            <b-col v-if="editPartion == 'notes'" md="12">
              <!-- Notes -->
              <strong :width="'20%'">
                {{ $t(`Global.notes`) }}
              </strong>
              <div>
                <div>
                  <b-form-group>
                    <validation-provider
                        #default="{ errors }"
                        rules="required"
                    >
                      <!-- :placeholder="$t('Global.notes')"  -->
                      <!-- <b-form-textarea
                        v-model="notes"
                        id="notes-input"
                        rows="3"
                        max-rows="1000"
                      /> -->
                      <quill-editor
                          :class="
                          $i18n.locale == 'ar' ? 'my-2 rtl' : 'my-2 ltr'
                        "
                          v-model="notes"
                          :options="snowOption"
                      />
                      <ValidationErrors :frontend-errors="errors"/>
                    </validation-provider>
                  </b-form-group>
                </div>
              </div>
              <!-- <list
                style="padding: 0 !important"
                :data="input"
                :only="[]"
                :has-margins="false"
                class="new_edit mb-2"
              >
                <template #custom_show>
                  <tr>
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.notes`) }}
                    </th>
                    <td>
                      <div>
                        <b-form-group>
                          <validation-provider
                            #default="{ errors }"
                            rules="required"
                          >
                            <b-form-textarea
                              v-model="notes"
                              id="notes-input"
                              rows="5"
                            />
                            <ValidationErrors :frontend-errors="errors" />
                          </validation-provider>
                        </b-form-group>
                      </div>
                    </td>
                  </tr>
                </template>
              </list>-->
            </b-col>
            <!--               submit and reset -->
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
                  variant="outline-secondary"
                  @click="closeEditMode"
              >
                {{ $t('Global.cancel') }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </div>
    <div
        v-if="loading"
        style="
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #eee;
        opacity: 0.8;
        text-align: center;
        z-index: 999;
      "
    >
      <b-spinner
          variant="primary"
          style="position: absolute; top: 60px; z-index: 1000"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import vSelect from 'vue-select'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import {
  BRow,
  BCol,
  BSpinner,
  BFormGroup,
  BFormInput,
  BForm,
  BFormDatepicker,
  BFormTextarea,
  BInputGroup,
} from 'bootstrap-vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import EditComponent from '@/views/components/table/Edit'
import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import {
  required,
  email,
  regex,
  integer,
  mobileValidation,
} from '@validations'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import List from '@/views/components/info/list'
import { bus } from './StudentBus'

export default {
  title: 'Edit',
  components: {
    BRow,
    BInputGroup,
    BCol,
    BSpinner,
    BFormGroup,
    quillEditor,
    vSelect,
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    EditComponent,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    List,
    BForm,
    BFormDatepicker,
    BFormTextarea,
    BFormInput,
    localize,
  },
  directives: {
    Ripple,
  },
  props: {
    editModeVersion: [String, Object],
    terms: Array,
    applicant_id: Number,
    student_id: Number,
    isSemesterBased: Boolean,
    avalibleCourses: [Array, Object],
  },
  computed: {
    ...mapGetters({
      input: 'students/item',
      load: 'students/load',
      lookups: 'students/lookups',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    maxDate() {
      let yourDate = new Date()
      yourDate.toISOString()
          .split('T')[0]
      return yourDate
    },
    canEditStatus() {
      if (this.input.can_edit_status) {
        return true
      }
      return false
    },
    details() {
      return this.$route.params.details ? this.$route.params.details : null
    },
    query() {
      const data = {
        countries: true,
        advisors: true,
        terms: true,
        lookup_from: 'students',
      }
      return data
    },
    lang() {
      return this.$i18n.locale
    },
    editPartion() {
      return this.editModeVersion
    },
    studentName() {
      const lang = this.$i18n.locale
      if (lang == 'en') return 'Edit Student '
      if (lang == 'ar') return 'تعديل طالب'
    },
    loading() {
      return this.load
    },
    genderOptions() {
      return [
        {
          id: 1,
          name: 'Male',
          name_local: 'ذكر'
        },
        {
          id: 2,
          name: 'Female',
          name_local: 'انثى'
        },
      ]
    }
  },
  data() {
    return {
      form: {},
      studentsLookups: null,
      snowOption: {
        placeholder: '...',
      },
      errorsdata: {},
      notes: '',
      loadData: false,
      deletedCourses: [],
      language: this.$i18n.locale,
      ruleForm: [],
      nationalIdRules: '',
      passportRules: '',
      abroadStudyTerms: [],
    }
  },
  mounted() {
    this.init()
    if(this.applicant_id || this.student_id) {
      const payload = {
        id: this.applicant_id ? this.applicant_id : this.student_id,
      }

      this.getTransferAvailableCourses(payload)
          .then((d) => {
            this.ruleForm = this.avalibleCourses || []
          })
          .catch(_ => {
            this.ruleForm = this.avalibleCourses || []
          })
    }
  },

  methods: {
    ...mapActions({
      getItem: 'students/getEdit',
      putItem: 'students/put',
      updateNotes: 'students/updateNotes',
      getTransferAvailableCourses: 'externalTransfer/getExternalStudentCourses',
      lookupsMethod: 'students/lookup',
      updateEditMode: 'students/updateEditMode',
      editExternalCourses: 'externalTransfer/editCourses',
      addAbroadStudyCourse: 'externalTransfer/addAbroadStudyCourse',
    }),
    updateInput(value, prop, k) {
      this.ruleForm[k][prop] = value
    },
    addCourse() {
      this.ruleForm.push({
        term: null,
        code: '',
        id: null,
        title: '',
        description: '',
        max_total: '',
        total: '',
        laboratory_hours: '',
        tutorial_hours: '',
        lecture_hours: '',
        grade: '',
        credit_hours: '',
      })
    },
    removeCourse(i) {
      if (this.ruleForm[i] && this.ruleForm[i].id) {
        this.deletedCourses.push(this.ruleForm[i].id)
      }
      if (this.ruleForm[i] && this.ruleForm[i].id) {
        this.deletedCourses.push(this.ruleForm[i].id)
      }
      this.ruleForm.splice(i, 1)
    },
    init() {
      const payload = {
        id: this.id,
        details: 3,
      }
      this.loadData = true
      this.getItem(payload)
          .then((res) => {
            if (res?.data?.birth_country == null) {
              this.input.birth_country = {}
            }

            this.notes = res && res.data && res.data.notes ? res.data.notes : null,

                this.nationalIdRules = res && res.data && (res.data.birth_country_id == 64 || res.data.student.nationality.id == 64) ? 'required|ssn' : 'ssn'
            this.passportRules = res && res.data && (res.data.birth_country_id == 64 || res.data.student.nationality.id == 64) ? 'min:8' : 'required|min:8'

            this.studentsLookups = res?.meta?.lookups
            if (res?.data?.faculty_id && res.bylaw_id == null) {
              this.lookupsMethod({
                faculty_id: res?.data?.faculty_id,
                faculties: true,
                bylaws: true,
                bylaw_id: res?.data?.bylaw_id ? this.input.bylaw_id : null,
                programs: true,
                terms: true,
                abroad_study_terms: true,
              })
            }
          })
          .then((res) => {
            this.loadData = false
          })
    },
    async editCourses() {
      if (this.editModeVersion.name != 'equivalence_info' && this.editModeVersion != 'abroad_study') return
      let payload = {}
      const approval = await this.$refs.fromRules.validate()
      if (!approval) return null
      payload = {
        data: this.ruleForm,
        deleted: this.deletedCourses,
        applicant_id: this.applicant_id,
        student_id: this.student_id
      }
      let method = this.editModeVersion == 'abroad_study' ? this.addAbroadStudyCourse(payload) : this.editExternalCourses(payload)
      await method
          .then((res) => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.closeEditMode()
          })
          .catch((error) => {
            this.errorToast(error.response.data)
          })
    },
    async editNotes() {
      if (this.editModeVersion != 'notes') return
      const approval = await this.$refs.fromRules.validate()
      if (!approval) return null
      let payload = {
        id: this.id,
        query: { notes: this.notes }
      }
      this.updateNotes(payload)
          .then((res) => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.closeEditMode()
          })
          .catch((error) => {
            this.errorToast(error.response.data)
          })
    },
    async save() {
      if (this.editModeVersion.name == 'equivalence_info' || this.editModeVersion == 'abroad_study') {
        this.editCourses()
        return
      }
      if (this.editModeVersion == 'notes') {
        this.editNotes()
        return
      }
      let payload = {}
      const approval = await this.$refs.fromRules.validate()
      if (!approval) return null
      if (this.editModeVersion == 'personal_info') {
        const newInput = { ...this.input }
        const user = this.input.student
        const userObject = {
          name: user.name,
          name_local: user.name_local,
          address: user.address,
          national_id: user.national_num,
          nationality_id: user.nationality.id,
          passport_number: user.passport_number,
          birth_date: user.birth_date,
          phone: user.phone,
        }
        // let birth_country_id = this.input.birth_country.id;
        // newInput.birth_country_id = this.input.birth_country.id;
        delete newInput.nationality
        delete newInput.birth_country
        delete newInput.gender
        delete newInput.program
        delete newInput.name
        delete newInput.name_local
        // delete newInput.start_term
        delete newInput.id
        delete newInput.status_data
        newInput.user = userObject
        payload = {
          id: this.id,
          query: newInput,
          details: 'personal_info',
        }
      } else {
        const query = {
          first_term_id: this.input.first_term_id
              ? this.input.first_term_id
              : this.input.start_term.id,
          faculty_id: this.input.faculty_id
              ? this.input.faculty_id
              : this.input.faculty.id,
          bylaw_id: this.input.bylaw_id
              ? this.input.bylaw_id
              : this.input.bylaw.id,
          program_id: this.input.program_id
              ? this.input.program_id
              : this.input.program.id,
          status_data: this.input.status_data
              ? this.input.status_data[0]
                  ? this.input.status_data[0]
                  : this.input.status_data
              : null,
        }
        payload = {
          id: this.id,
          query: query,
          details: 'academic_info',
        }
      }
      this.putItem(payload)
          .then((res) => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.closeEditMode()
          })
          .catch((error) => {
            this.errorToast(error.response.data)
          })
    },
    getBack() {
      this.$router.push({
        name: 'student-show',
        params: { id: this.id }
      })
    },
    closeEditMode() {
      // emit('closeEditMode')
      bus.$emit('closeEditMode', false)
    },
    destroyEdit() {
      this.updateEditMode({
        status: false,
        edit_info: null
      })
    },
  },

  watch: {
    lang: (val) => {
      // this.localize(val);
    },
    'input.student.nationality.id': function (newval, oldval) {
      // alert(newval);
      if (newval == 64) {
        this.input.student.passport_number = null
        this.nationalIdRules = 'required|ssn'
        this.passportRules = 'min:8'
      } else {
        this.input.student.national_num = null
        this.nationalIdRules = 'ssn'
        this.passportRules = 'required|min:8'
      }
    },
    'input.birth_country_id': function (newval, oldval) {
      if (newval != oldval) {
        this.input.data.birth_city = null
        this.input.birth_governate = {}
      }
      if (newval == 64) {
        const nationalID = this.input.student.national_num
        if (nationalID) {
          const target = nationalID.charAt(7) + nationalID.charAt(8)
          if (target == 88) {
            this.input.student.national_num = null
          }
        }

      }

      // if (newval == 64 && this.input.student.nationality.id == 64) {
      //   this.nationalIdRules = 'required|ssn';
      //   this.passportRules = 'min:8';
      // } else {
      //   this.nationalIdRules = 'ssn';
      //   this.passportRules = 'required|min:8';
      // }
    },
    'input.student.national_num': function (newval, oldval) {
      if (newval !== oldval) {
        const target = newval.charAt(7) + newval.charAt(8)
        if (target == 88) {
          // alert('outside egypt');
          if (this.input.birth_country_id == 64) {
            this.input.birth_country_id = null
          }
        }
      }
    },
    'input.faculty_id': function (newval, oldval) {
      if (oldval === undefined) return null
      this.input.bylaw_id = null
      this.input.program_id = null
      this.lookupsMethod({
        terms: true,
        abroad_study_terms: true,
        faculty_id: newval,
        faculties: true,
        bylaws: true,
        bylaw_id: this.input
            ? this.input.bylaw_id
                ? this.input.bylaw_id
                : null
            : null,
        programs: true,
      })
    },
    'input.bylaw_id': function (newval, oldval) {
      if (oldval === undefined) return null
      this.input.program_id = null
      this.lookupsMethod({
        terms: true,
        abroad_study_terms: true,
        faculty_id: this.input.faculty_id,
        faculties: true,
        bylaws: true,
        bylaw_id: this.input
            ? this.input.bylaw_id
                ? this.input.bylaw_id
                : null
            : null,
        programs: true,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.show_hover {
  display: none;
  position: absolute;
  top: -10px;
  left: -10px;
  background: #f8f8f8;
  border-radius: 50%;
}

.hover_delete {
  border: 1px solid transparent;
  padding: 5px;

  &:hover {
    border: 1px solid #ddd;
    padding: 5px;

    .show_hover {
      display: block;
    }
  }
}

[dir] .table th,
[dir] .table td {
  padding: 0;
}

[dir] .table td {
  padding-top: 3px;
  padding-right: 3px;
  padding-bottom: 3px;
}

[dir] .form-group {
  margin-bottom: 0;
}

.new_edit {
  .b-form-datepicker {
    margin-bottom: 0 !important;
  }

  ::placeholder {
    color: #777 !important;
    opacity: 0.8 !important;
  }

  td {
    padding: 0.2rem 23px !important;
    padding-inline-start: 25px !important;
  }

  tr {
    align-items: center;
  }

  textarea.form-control {
    padding: 0.2rem 0.5rem !important;
  }

  .form-group {
    .vs--disabled {
      background-color: #f8f8f8;
    }

    .vs__selected {
      padding: 0;
      margin: 0;
    }

    .v-select div {
      flex-direction: row !important;
    }

    margin-bottom: 0;
    width: 100%;
    padding-left: 0px;
    padding-right: 8px;

    .vs__selected,
    .vs__search {
      margin-top: 0 !important;
    }

    .form-control,
    .vs__dropdown-toggle {
      border: 0;
      box-shadow: 0 3px 10px 0 rgb(34 41 47 / 10%);
      // border-left: 1px dashed #777;
      background: transparent;
      background-color: transparent !important;
      height: 30px;
      padding: 0.2rem 0.5rem;
    }

    .form-control.text-break {
      box-shadow: none !important;
    }

    .vs--searchable:not(.vs--single) .vs__dropdown-toggle {
      height: auto !important;
    }

    .vs--searchable.vs--single {
      .vs__dropdown-toggle {
        margin-bottom: 0;
      }

      margin-bottom: 0;
    }
  }
}
</style>
