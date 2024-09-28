<template>
  <b-row>
    <b-col cols="12" xl="12" lg="12" md="12">
      <b-card>
        <div class="custom_actions">
          <b-dropdown :text="$t('Global.more')" right size="sm" variant="outline-primary">
            <b-dropdown-item :to="{
            name: 'advising_registration',
            params: { id: id },
          }">
              {{ $t("Global.registration") }}
            </b-dropdown-item>
            <b-dropdown-item :to="{
            name: 'students_view',
            params: { student_id: id, term_id: term_id },
          }">
              {{ $t("control") }}
            </b-dropdown-item>
            <b-dropdown-item @click="getTranscript">
              {{ $t("Global.transcript") }}
            </b-dropdown-item>

            <b-dropdown-item v-if="student &&
            student.faculty &&
            student.faculty.emtyaz == 1 &&
            student.student.emtyazAllowed
            " :to="{
            name: 'emtyaz_advising_registration',
            params: { id: id },
          }">
              {{ $t("Global.emtyaz_registration") }}
            </b-dropdown-item>
            <!-- <b-dropdown-item
              @click = "certificate = true"
            >
              {{ $t("Global.certificate") }}
            </b-dropdown-item> -->
          </b-dropdown>
        </div>
        <b-row v-if="studentData">
          <b-col cols="21" xl="6" class="d-flex justify-content-between flex-column">
            <div class="d-flex justify-content-start position-relative">
              <b-overlay :show="load" rounded="sm">
                <b-avatar style="width: 150px; height: 150px"
                  :src="studentData.id ? user_photo(studentData.id || null) : require('@/assets/images/avatar.jpg')"
                  size="104px" rounded />
                <div class="position-absolute top_left" v-if="hasPermission('edit_student')">
                  <input ref="refInputEl" type="file" @change="changePhoto" class="d-none" />
                  <b-button v-b-tooltip.hover="$t('Global.uploadPhoto')" variant="primary"
                    class="btn-icon rounded-circle" @click="$refs.refInputEl.click()">
                    <feather-icon icon="UploadCloudIcon" />
                  </b-button>
                </div>
              </b-overlay>

              <div style="margin-top: 30px" class="d-flex flex-column ml-1">
                <div class="mb-1">
                  <h4 class="mb-0" style="font-weight: bold">
                    {{
            $i18n.locale == "en"
              ? studentData.name
                ? studentData.name.length > 25
                  ? studentData.name
                  : studentData.name
                : studentData.name_local.length > 25
                  ? studentData.name_local
                  : studentData.name_local
              : studentData.name_local
                ? studentData.name_local.length > 25
                  ? studentData.name_local
                  : studentData.name_local
                : studentData.name.length > 25
                  ? studentData.name
                  : studentData.name
          }}
                  </h4>
                  <span class="card-text">
                    {{
              studentData.email
                ? studentData.email.length > 30
                  ? studentData.email
                  : studentData.email
                : "-"
            }}
                  </span>
                </div>
                <table class="mt-2 mt-xl-0" style="width: 100%">
                  <tr v-if="student &&
            student.student &&
            student.student.study_type == 1
            ">
                    <th class="pb-50">
                      <feather-icon icon="ActivityIcon" class="mr-75" />
                      <span class="label">
                        {{
            $i18n.locale == "en"
              ? "Cumulative GPA"
              : "إجمالي التقدير"
          }}
                      </span>
                    </th>
                    <td class="pb-50">
                      <span>
                        {{
              student.cumulative_gpa ? student.cumulative_gpa : 0
            }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="student &&
            student.student &&
            student.student.study_type == 1
            ">
                    <th class="pb-50 d-flex flex-wrap">
                      <feather-icon icon="ClockIcon" class="mr-75" />
                      <span class="label">{{ $t(`passed_hours`) }}</span>
                    </th>
                    <td class="pb-50">
                      <span style="padding: 0 3px" v-if="student.program">
                        {{
            (student.passedHours ? student.passedHours : " 0 ") +
            ($i18n.locale == "en" ? " / " : " \\ ") +
            (student.maxHours ? student.maxHours : "##")
          }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="student &&
            student.student &&
            student.student.study_type == 1
            ">
                    <th class="pb-50 d-flex flex-wrap">
                      <feather-icon icon="CreditCardIcon" class="mr-75" />
                      <span class="label">{{ $t(`Total Credit Points`) }}</span>
                    </th>
                    <td class="pb-50">
                      <span style="padding: 0 3px">
                        {{
            student.cumulative_credit_points
              ? student.cumulative_credit_points
              : 0
          }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th class="pb-50">
                      <feather-icon icon="AlertTriangleIcon" class="mr-75" :class="warningClass" />
                      <span class="label" :class="warningClass">
                        {{ $i18n.locale == "en" ? "Warnings" : "التحذيرات" }}
                      </span>
                    </th>
                    <td class="pb-50">
                      <span v-if="student.warnings && student.max_warnings" :class="warningClass">
                        {{ student.warnings + ' / ' + student.max_warnings }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th class="pb-50">
                      <feather-icon icon="TypeIcon" class="mr-75" />
                      <span class="label">
                        {{
            $i18n.locale == "en"
              ? "Training weeks"
              : "اسابيع التدريب"
          }}
                      </span>
                    </th>
                    <td class="pb-50">
                      <span v-if="student.training_weeks">
                        {{ student.training_weeks }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th class="pb-50">
                      <feather-icon icon="AtSignIcon" class="mr-75" />
                      <span class="label">
                        {{ $i18n.locale == "en" ? "Level" : "مستوي" }}
                      </span>
                    </th>
                    <td class="pb-50">
                      <span v-if="student.level">
                        {{
            $i18n.locale == "en"
              ? student.level.name
              : student.level.name_local
          }}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </b-col>
          <b-col cols="12" xl="6">
            <table v-if="!academicEdit" class="mt-2 mt-xl-0" style="width: 100%">
              <tr style="width: 100%">
                <th class="pb-50 d-flex flex-wrap">
                  <span class="label"></span>
                </th>
                <td class="pb-50" style="text-align: end">
                  <feather-icon @click="(e) => {
              editMode('academic_info');
            }
            " v-if="hasPermission('edit_student')" style="cursor: pointer" icon="EditIcon"
                    class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.edit')" />
                </td>
              </tr>
              <tr>
                <th class="pb-50 d-flex flex-wrap">
                  <feather-icon icon="UserIcon" class="mr-75" />
                  <span class="label">{{ $t(`Global.code`) }}</span>
                </th>
                <td class="pb-50">
                  <span>
                    {{ student && student.student ? student.student.code : "" }}
                  </span>
                </td>
              </tr>

              <tr>
                <th class="pb-50 d-flex flex-lg-nowrap align-items-center">
                  <feather-icon icon="ClockIcon" class="mr-75" />
                  <span class="label w-100 mr-1">
                    {{ $t(`Global.Start_Term`) }}</span>
                </th>
                <td class="pb-50">
                  <span>
                    {{
            student.start_term
              ? $i18n.locale == "en"
                ? student.start_term.name
                : student.start_term.name_local
              : " - "
          }}
                  </span>
                </td>
              </tr>

              <tr>
                <th class="pb-50">
                  <feather-icon icon="BookOpenIcon" class="mr-75" />
                  <span class="lable">{{ $t(`Global.faculty`) }}</span>
                </th>
                <td class="pb-50">
                  <span v-if="student.faculty">
                    <b-link :to="{
            name: 'faculty',
            params: { id: student.faculty.id },
          }">
                      {{
            $i18n.locale == "en"
              ? student.faculty.name
              : student.faculty.name_local
          }}
                    </b-link>
                  </span>
                </td>
              </tr>

              <tr>
                <th class="pb-50">
                  <feather-icon icon="FlagIcon" class="mr-75" />
                  <span class="label">{{ $t(`Global.program`) }}</span>
                </th>
                <td class="pb-50">
                  <span v-if="student && student.program && student.program.bylaw">
                    <b-link :to="{
            name: 'program',
            params: { id: student.program.id },
          }">
                      {{
            $i18n.locale == "en"
              ? student.program.name
              : student.program.name_local
          }} </b-link>,
                    <b-link :to="{
              name: 'bylaw',
              params: { id: student.program.bylaw.id },
            }">
                      {{
            $i18n.locale == "en"
              ? student.program.bylaw.name
              : student.program.bylaw.name_local
          }}
                    </b-link>

                    <span v-if="student.program && student.program.bylaw">
                      ,
                      {{
            student.program.bylaw.type_id == 1
              ? $i18n.locale == "en"
                ? "Credit Based"
                : "ساعات معتمده"
              : $i18n.locale == "en"
                ? "Semester Based"
                : "نظام فصلي"
          }}
                    </span>
                  </span>
                  <span v-else> - </span>
                </td>
              </tr>

              <tr>
                <th class="pb-50">
                  <feather-icon icon="UserIcon" class="mr-75" />
                  <span class="label">{{ $t(`Global.advisor`) }}</span>
                </th>
                <td class="pb-50">
                  <span v-if="student.advisor">
                    <span v-if="hasPermission('show_users')">
                      <b-link :to="{
            name: 'user-show',
            params: { id: student.advisor.id },
          }">
                        {{ getTranslatedNameFromObject(student.advisor) }}
                      </b-link>
                      <span v-if="student.advisor && student.advisor.email">,{{ student.advisor.email }}</span>
                    </span>
                    <span v-else>
                      {{ getTranslatedNameFromObject(student.advisor) }}
                      <span v-if="student.advisor && student.advisor.email">,{{ student.advisor.email }}</span>
                    </span>
                  </span>
                  <span v-else> - </span>
                </td>
              </tr>

              <tr>
                <th class="pb-50">
                  <feather-icon icon="InfoIcon" class="mr-75" />
                  <span class="label">{{ $t(`Global.status`) }}</span>
                </th>
                <td>
                  <span v-for="(status, index) in student.status_data" :key="index">
                    {{
            $i18n.locale == "en"
              ? status.name
                ? status.name
                : status.name_local
              : status.name_local
                ? status.name_local
                : status.name
          }}
                    <span v-if="student.status_data.length != index + 1">
                      -
                    </span>
                  </span>
                  <span v-if="student.status_data &&
            student.status_data.length > 0 &&
            student.term
            ">
                    ,
                  </span>
                  <span v-if="student.term">{{
            $i18n.locale == "en"
              ? student.term.name
              : student.term.name_local
          }}</span>
                </td>
              </tr>

              <tr v-if="student.suspension_reason">
                <th class="pb-50">
                  <feather-icon icon="AlertTriangleIcon" class="mr-75 text-danger" />
                  <span class="label text-danger">{{
            $t(`Global.suspension_reason`)
          }}</span>
                </th>
                <td class="pb-50">
                  <span>
                    {{ $t(`${student.suspension_reason}`) }}
                  </span>
                </td>
              </tr>
            </table>
            <div v-else-if="!personalEdit &&
            academicEdit &&
            !prestudyEdit &&
            !militaryEdit &&
            !gradesFinalsEdit
            ">
              <div class="d-flex justify-content-end align-items-center">
                <div class="mb-2">
                  <feather-icon @click="(e) => {
              closeEditMode();
            }
            " v-if="hasPermission('edit_student')" style="cursor: pointer" icon="XCircleIcon"
                    class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.close')" />
                </div>
              </div>
              <edit :terms="terms" :editModeVersion="EditModeData" @closeEditMode="closeEditMode" />
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12">
      <b-card>
        <div class="custom_drop mb-2" v-if="$store.getters['app/width'] < 982 &&
            $store.getters['app/width'] != 0
            ">
          <b-dropdown block v-if="$store.getters['app/updateSelectedTab'] &&
            $store.getters['app/updateSelectedTab'].name
            " :text="$store.getters['app/updateSelectedTab']
              ? $store.getters['app/updateSelectedTab'].name
              : ''
            " variant="primary">
            <b-dropdown-item v-if="$store.getters['app/dropArray'] &&
            $store.getters['app/dropArray'].length
            " v-for="(tab, i) in $store.getters['app/dropArray']" :key="i" @click="
            setSelectedTab(tab || null);
          inputTab = tab ? tab.id : null;
          ">
              {{ tab.name }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <b-tabs v-model="inputTab" @input="saveStatus" ref="custom_tabs" lazy vertical nav-wrapper-class="nav-hidden"
          align="center">

          <!-- Start of Personal Info -->
          <b-tab v-if="hasPermission('access_personal_student')">
            <template #title>
              <feather-icon icon="UserIcon" />
              <span id="personalInfo">{{ $t("Global.personal_info") }}</span>
            </template>
            <div>
              <div v-if="!personalEdit">
                <div class="d-flex justify-content-end align-items-center">
                  <div class="mb-2">
                    <feather-icon @click="(e) => {
              editMode('personal_info');
            }
            " v-if="hasPermission('edit_student')" style="cursor: pointer" icon="EditIcon"
                      class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.edit')" />
                  </div>
                </div>
                <list v-if="student && student.student" style="padding: 0 !important" :data="student.student" :only="[]"
                  :has-margins="false">
                  <template #custom_show>
                    <!--  English Name   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.english_name`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span v-if="student && student.student">
                                    {{ student.student.name }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!--   Arabic Name -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.arabic_name`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span v-if="student && student.student">
                                    {{ student.student.name_local }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!--  Gender -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.gender`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            $i18n.locale == "en"
              ? student.gender
                ? student.gender.en
                : "-"
              : student.gender
                ? student.gender.ar
                : "-"
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Birth Date-->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.birth_date`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student.birth_date
              ? student.birth_date
              : "-"
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Birth Country-->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.birth_country`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student.birth_country
              ? $i18n.locale == "en"
                ? student.birth_country.name
                : student.birth_country.name_local
              : "-"
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Birth Governate -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.governorate`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student.birth_governate
              ? $i18n.locale == "en"
                ? student.birth_governate.name
                : student.birth_governate.name_local
              : null
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Birth City-->
                    <tr style="border-bottom: 2.4px solid #ccc">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.birth_city`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student && student.data.birth_city
              ? student.data.birth_city
              : null
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </list>
                <list v-if="student && student.student && student.student.nationality
            " style="padding: 0 !important" :data="student.student" :only="[]" :has-margins="false">
                  <template #custom_show>
                    <!-- Nationality -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.nationality`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student && student.student.nationality
              ? $i18n.locale == "en"
                ? student.student.nationality
                  .nationality
                : student.student.nationality
                  .nationality_local
              : "-"
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- National Id -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.national_id`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student && student.student.national_num
              ? student.student.national_num
              : "-"
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Passport Number -->
                    <tr style="border-bottom: 2.4px solid #ccc">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.passport_number`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student && student.student.passport_number
              ? student.student.passport_number
              : "-"
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </list>
                <list v-if="student && student.student && student.student.nationality
            " style="padding: 0 !important" :data="student.student" :only="[]" :has-margins="false">
                  <template #custom_show>
                    <!-- Phone   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.phone`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student && student.mobile
              ? student.mobile
              : "-"
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Address -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.address`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student && student.address
              ? student.address +
              "," +
              student.data.city +
              ","
              : "-"
          }}
                                    {{
              (student && student.data.postal_code) ||
              "-"
            }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Permanent Address -->
                    <tr style="border-bottom: 2.4px solid #ccc">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.address_during`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student && student.data && student.data.permanent_address
              ? student.data.permanent_address +
              "," +
              student.data.permanent_city +
              ","
              : "-"
          }}
                                    {{
              (student && student.data &&
                student.data.permanent_postal_code) ||
              "-"
            }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </list>
                <list v-if="student && student.data" style="padding: 0 !important" :data="student.data" :only="[]"
                  :has-margins="false">
                  <template #custom_show>
                    <!--  Father Data   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.father`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <div>
                                    <span>
                                      <strong>{{ $t("Global.name") }} :
                                      </strong>
                                    </span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.father_name
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold">
                                      <strong>{{ $t("Global.phone") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.father_phone
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold">
                                      <strong>{{ $t("Global.email") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.father_email
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.mail_address") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.father_mail_address
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.city") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.father_city
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.postal_code") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.father_postal_code
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.occupation") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.father_job
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.work_place") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.father_work_place
                : " "
              : " "
          }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!--  Mother Data   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.mother`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.name") }} :
                                      </strong>
                                    </span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.mother_name
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.phone") }} :
                                      </strong>
                                    </span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.mother_phone
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.email") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.mother_email
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.mail_address") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.mother_mail_address
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold">
                                      <strong>{{ $t("Global.city") }} :
                                      </strong>
                                    </span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.mother_city
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold">
                                      <strong>{{ $t("Global.postal_code") }} :
                                      </strong>
                                    </span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.mother_postal_code
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold">
                                      <strong>{{ $t("Global.occupation") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.mother_job
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold">
                                      <strong>{{ $t("Global.work_place") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.mother_work_place
                : " "
              : " "
          }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <!-- Guardian  data-->
                    <tr style="border-bottom: 2.4px solid #ccc">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.guardian`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <div>
                                    <span>
                                      <strong>{{ $t("Global.name") }} :
                                      </strong>
                                    </span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_name
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold">
                                      <strong>{{ $t("Global.phone") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_phone
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold">
                                      <strong>{{ $t("Global.email") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_email
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.mail_address") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_mail_address
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.city") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_city
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.postal_code") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_postal_code
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.occupation") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_job
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.work_place") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_work_place
                : " "
              : " "
          }}
                                  </div>
                                  <div>
                                    <span class="font-weight-bold"><strong>{{ $t("Global.relationship") }} :
                                      </strong></span>
                                    {{
            student && student.data
              ? student.data
                ? student.data.guardian_relation
                : " "
              : " "
          }}
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
              </div>
              <div v-else-if="personalEdit &&
            !academicEdit &&
            !prestudyEdit &&
            !militaryEdit &&
            !gradesFinalsEdit
            ">
                <div class="d-flex justify-content-end align-items-center">
                  <div class="mb-2">
                    <feather-icon @click="(e) => {
              closeEditMode();
            }
            " v-if="hasPermission('edit_student')" style="cursor: pointer" icon="XCircleIcon"
                      class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.close')" />
                  </div>
                </div>
                <edit :editModeVersion="EditModeData" @closeEditMode="closeEditMode" />
              </div>
            </div>
          </b-tab>
          <b-tab v-if="hasPermission('access_personal_student')" :title-item-class="student && student.can_show_military_info
              ? ''
              : 'd-none'
            ">
            <template #title>
              <feather-icon icon="LinkIcon" />
              <span>{{ $t("Global.military_info") }}</span>
            </template>
            <ShowComponent v-if="!militaryEdit" :title="$t('Global.military_service_information')" :showIcon="false"
              :data="student" :loading="load" :only="[
            'military_status',
            'military_service_no',
            'military_decisions_no',
            'military_decision_date',
            'military_situation'
          ]">
              <template #edit>
                <div class="mb-2">
                  <feather-icon @click="(e) => {
              editMode('military_info');
            }
            " v-if="hasPermission('edit_military')" style="cursor: pointer" icon="EditIcon"
                    class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.edit')" />
                </div>
              </template>
              <template #military_status="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.military_status`) }}
                </th>
                <td>
                  {{
            $i18n.locale == "en" ? data.military_status_text ? data.military_status_text : '' :
              data.military_status_text_local
          }}
                </td>
              </template>
              <template #military_service_no="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.military_service_no`) }}
                </th>
                <td>
                  {{ data.military_service_no ? data.military_service_no : "" }}
                </td>
              </template>
              <template #military_decisions_no="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.decisions_no`) }}
                </th>
                <td>
                  {{ data.military_decisions_no ? data.military_decisions_no : "" }}
                </td>
              </template>
              <template #military_decision_date="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.date_of_decision`) }}
                </th>
                <td>
                  {{ data.military_decision_date ? data.military_decision_date : "" }}
                </td>
              </template>
              <template #military_situation="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.military_situation`) }}
                </th>
                <td>
                  {{ data.military_situation ? data.military_situation : "" }}
                </td>
              </template>
            </ShowComponent>

            <ShowComponent v-if="!militaryEdit" :title="$t('Global.military_training_information')" :showIcon="false"
              :data="student" :loading="load" :only="[
            'military_training_status',
            'military_training_completion_year',
            'military_training_round_no',
            'military_training_page_no',
            'military_training_serial_no',
            'military_training_comment',
          ]">
              <template #military_training_status="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.military_training_status`) }}
                </th>
                <td>
                  {{
            data.military_training_status
              ? $t("Global.Done")
              : $t("Global.Not yet")
          }}
                </td>
              </template>
              <template #military_training_completion_year="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.year_of_completion`) }}
                </th>
                <td>
                  {{ data.military_training_completion_year ? data.military_training_completion_year : "" }}
                </td>
              </template>
              <template #military_training_round_no="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.round_number`) }}
                </th>
                <td>
                  {{ data.military_training_round_no_text ? $t(`Global.${data.military_training_round_no_text}`) : '' }}
                </td>
              </template>
              <template #military_training_page_no="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.page_no`) }}
                </th>
                <td>
                  {{ data.military_training_page_no ? data.military_training_page_no : "" }}
                </td>
              </template>
              <template #military_training_serial_no="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.serial_no`) }}
                </th>
                <td>
                  {{ data.military_training_serial_no ? data.military_training_serial_no : "" }}
                </td>
              </template>
              <template #military_training_comment="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.comment`) }}
                </th>
                <td>
                  {{ data.military_training_comment ? data.military_training_comment : "" }}
                </td>
              </template>
            </ShowComponent>
            <div v-else-if="!personalEdit &&
            !academicEdit &&
            !prestudyEdit &&
            militaryEdit &&
            !gradesFinalsEdit
            ">
              <div class="d-flex justify-content-end align-items-center">
                <div class="mb-2">
                  <feather-icon @click="(e) => {
              closeEditMode();
            }
            " v-if="hasPermission('edit_student')" style="cursor: pointer" icon="XCircleIcon"
                    class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.close')" />
                </div>
              </div>
              <EditMilitary :editModeVersion="EditModeData" @closeEditMode="closeEditMode" />
            </div>
          </b-tab>
          <b-tab v-if="hasPermission('access_personal_student')" :title-link-class="linkClass(1)">
            <template #title>
              <feather-icon icon="RotateCcwIcon" />
              <span id="prestudyInfo">{{
            $t("Global.pre_university_info")
          }}</span>
            </template>
            <list v-if="student && student.student" style="padding: 0 !important"
              :data="student.data ? student.data : {}" :only="[]">
              <template #custom_show>
                <tr>
                  <th v-if="student && student.data && student.data" scope="row" :width="'20%'">
                    <span v-if="student.data.pre_university_certificate_groupe">
                      <span v-if="student.data.pre_university_certificate_groupe.name ==
            'Degree Inside Egypt'
            ">
                        {{ $t(`Global.high_school_egypt`) }}
                      </span>
                      <span v-else-if="student.data.pre_university_certificate_groupe.name !=
            'Degree Outside Egypt'
            ">
                        {{ $t(`Global.high_school_out`) }}
                      </span>
                    </span>
                    <span v-else>
                      {{ $t(`Global.high_school_egypt`) }}
                    </span>
                  </th>
                  <td v-if="student && student.data && student.data" class="d-flex flex-wrap">
                    <div>
                      {{
            $i18n.locale == "en"
              ? student.applicant_data.pre_university_certificate
                ? student.applicant_data.pre_university_certificate
                  .name
                : ""
              : student.applicant_data.pre_university_certificate
                ? student.applicant_data.pre_university_certificate
                  .name_local
                : ""
          }}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.pre_university_certificate_type`) }}
                  </th>

                  <td v-if="student && student.data && student.data" class="d-flex flex-wrap">
                    <div>
                      {{
            $i18n.locale == "en"
              ? student.data &&
                student.applicant_data
                  .pre_university_certificate_type
                ? student.applicant_data
                  .pre_university_certificate_type.name
                : ""
              : student.data &&
                student.applicant_data
                  .pre_university_certificate_type
                ? student.applicant_data
                  .pre_university_certificate_type.name_local
                : ""
          }}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.qualification_date`) }}
                  </th>

                  <td v-if="student && student.data && student.data" class="d-flex flex-wrap">
                    <div>
                      {{
            student.applicant_data.pre_university_certificate_info
              .qualification_date
          }}
                    </div>
                  </td>
                </tr>

                <tr scope="row" :width="'20%'">
                  <th>
                    {{ $t("Global.school_name") }}
                  </th>
                  <td class="d-flex flex-wrap" v-if="student && student.data && student.data">
                    <div class="d-flex">
                      <div class="d-flex flex-wrap">
                        <div>
                          <div class="d-flex flex-wrap">
                            <div>
                              <span>
                                {{ student.data.school_name }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.subjects`) }}
                  </th>
                  <td v-if="student && student.data && student.data" class="d-flex flex-wrap">
                    <div v-if="student.data && student.data">
                      <span class="mx-1" v-for="sub in getSubjects(student.data, [
            'arabic',
            'english',
            'french',
            'german',
            'italy',
            'biology',
            'chemistry',
            'math',
            'physics',
          ])" :key="sub">
                        <b-badge pill variant="primary" class="text-capitalize">
                          {{ sub }}
                        </b-badge>
                      </span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.total_marks`) }}
                  </th>
                  <td v-if="student && student.data && student.data" class="d-flex flex-wrap">
                    <div>
                      {{ student.data.total_marks }}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.max_marks`) }}
                  </th>
                  <td v-if="student && student.data && student.data" class="d-flex flex-wrap">
                    <div>
                      {{ student.data.max_marks }}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th scope="row" :width="'20%'">
                    {{ $t(`Global.percentage`) }}
                  </th>
                  <td v-if="student && student.data && student.data" class="d-flex flex-wrap">
                    <div>
                      {{ getTotal(student.data) }}
                    </div>
                  </td>
                </tr>
              </template>
            </list>
          </b-tab>

          <b-tab v-if="hasPermission('access_academic_student')" :title-item-class="viewEquivalenceTab ? '' : 'd-none'" :title-link-class="linkClass(0)"
            style="position: relative">
            <template #title>
              <feather-icon icon="ActivityIcon" />
              <span>{{ $t("Global.equivalence") }}</span>
            </template>
            <EquivalentRequests v-if="student && viewEquivalenceTab && !equivalenceEdit" :studentId="student.id"
              @setEditMode="editMode" />
            <div v-else-if="equivalenceEdit &&
            !personalEdit &&
            !academicEdit &&
            !prestudyEdit &&
            !militaryEdit &&
            !gradesFinalsEdit
            ">
              <div class="d-flex justify-content-end align-items-center">
                <div class="mb-2">
                  <feather-icon @click="(e) => {
              closeEditMode();
            }
            " style="cursor: pointer" icon="XCircleIcon" class="font-medium-3 text-primary"
                    v-b-tooltip.hover="$t('Global.close')" />
                </div>
              </div>
              <edit v-if="student"
                :applicant_id="equId && equId.id ? equId.id : Number(student && student.applicant_data && student.applicant_data.id ? student.applicant_data.id : id)"
                :student_id="student.id" :editModeVersion="EditModeData" :avalibleCourses="avalibleCourses"
                :isSemesterBased="studentItem &&
              studentItem.previous_university_info &&
              studentItem.previous_university_info.bylaw_type
              ? false
              : true
            " @closeEditMode="closeEditMode" />
            </div>
          </b-tab>

          <b-tab v-if="hasPermission('access_academic_student')" :title-link-class="viewEquivalenceTab ? '' : linkClass(0)" style="position: relative">
            <template #title>
              <feather-icon icon="BookIcon" />
              <span>{{
            $i18n.locale == "en"
              ? "Study Current Semester"
              : "مواد هذا الفصل"
          }}</span>
            </template>
            <b-table v-if="student" :type="student.registrations ? null : 'registrations'" :busy="load"
              :empty-text="$t('Global.empty_text')" show-empty :items="student.registrations"
              :fields="registrationFields" striped responsive="sm">
              <template #cell(id)="data">
                <span>
                  <b-link class="font-weight-bold d-inline-block" :to="{
            name: 'offering',
            params: { id: data.item.offering_id },
          }">
                    {{ data.item.offering_id ? data.item.offering_id : "-" }}
                  </b-link>
                </span>
              </template>

              <template #cell(code)="data">
                <span>
                  {{ data.item.code ? data.item.code : "-" }}
                </span>
              </template>
              <template #cell(name)="data">
                <span>
                  <b-link class="font-weight-bold d-inline-block"
                    :to="{ name: 'course', params: { id: data.item.id } }">
                    {{
            $i18n.locale == "en"
              ? data.item.name
              : data.item.name_local
          }}
                  </b-link>
                </span>
              </template>
              <template #cell(max_total)="data">
                <span>
                  {{ data.item.max_total }}
                </span>
              </template>
              <template #cell(credit)="data">
                <span>
                  {{ data.item.credit_hours }}
                </span>
              </template>
              <template #table-busy>
                <div class="text-center text-black my-2">
                  <b-spinner class="align-middle" />
                </div>
              </template>
            </b-table>
          </b-tab>
          <!----Taken Course--->
          <b-tab v-if="hasPermission('access_academic_student')">
            <!-- modals -->
            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t("Global.takenCourses") }}</span>
            </template>

            <!-- new Taken Courses -->

            <div class="text-right my-2">
              <b-button @click="toggleAddCourseModal(null)" class="btn-icon" v-b-tooltip.hover="$t('Global.add')"
                variant="primary" v-if="student &&
            !student.has_registerations &&
            hasPermission('add_term') &&
            hasPermission('edit_student')
            ">
                <feather-icon icon="PlusIcon" />
              </b-button>
            </div>

            <template>
              <simple-table :fields="gradesFields" :items="studentCourses" :load="load" :actions="true"
                @editCourse="toggleAddCourseModal" @deleteGradeForStudent="deleteGradeForStudent"
                :semesterBased="isSemesterBased">
              </simple-table>
            </template>
          </b-tab>

          <!--start issue-->
          <b-tab v-if="hasPermission('access_academic_student')" :title-item-class="student &&
              student.program &&
              student.program.bylaw &&
              student.program.bylaw.type_id == 1
              ? ''
              : 'd-none'
            ">
            <div class="text-right my-2">
              <b-button @click="toggleAddCourseModal(null)" class="btn-icon" v-b-tooltip.hover="$t('Global.add')"
                variant="primary" v-if="student &&
            !student.has_registerations &&
            hasPermission('add_term') &&
            hasPermission('edit_student')
            ">
                <feather-icon icon="PlusIcon" />
              </b-button>
            </div>

            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t("Global.passed_terms") }}</span>
            </template>
            <!-- {{student}} -->
            <GradesTabTable v-if="student && renderComponent" :loading="load" @editCourse="toggleAddCourseModal"
              :isSemesterBased="isSemesterBased" @deleteGradeForStudent="deleteGradeForStudent" :load="load"
              @editTermGrades="toggleTermGradesModal" :type="student.terms_grades ? null : 'terms_grades'"
              :items="student.terms_grades" :fields="[
            {
              key: 'term_name',
              label: this.$t('Global.grade_term'),
              thStyle: { width: '10%' },
            },
            {
              key: 'grade_level',
              label: this.$t('Global.level'),
              thStyle: { width: '10%' },
            },
            {
              key: 'total',
              label: this.$t('Global.grade'),
              thStyle: { width: '25%' },
            },
            {
              key: 'cumulative',
              label: this.$t('Global.cumulative'),
              thStyle: { width: '25%' },
            },
          ]" :inner="[
            {
              key: 'code',
              label: this.$t('Global.code'),
              thStyle: { width: '10%' },
            },
            { key: 'course', label: this.$t('Global.course') },
            {
              key: 'credit_hours',
              label: this.$t('Global.credit_hours'),
              thStyle: { width: '10%' },
            },
            {
              key: 'credit_points',
              label: this.$t('credit_points'),
              thStyle: { width: '10%' },
            },
            {
              key: 'total_max_total',
              label: this.$t('Global.total'),
              thStyle: { width: '10%' },
            },
            {
              key: 'grade_type',
              label: this.$t('Global.grade'),
              thStyle: { width: '10%' },
            },
            {
              key: 'action',
              label: this.$t('Global.actions'),
              thStyle: { width: '10%' },
            },
          ]" />
          </b-tab>
          <b-tab v-if="hasPermission('access_academic_student')" :title-item-class="student &&
              student.program &&
              student.program.bylaw &&
              student.program.bylaw.type_id != 1
              ? ''
              : 'd-none'
            ">
            <div class="text-right my-2">
              <b-button @click="toggleAddCourseModal(null)" class="btn-icon" v-b-tooltip.hover="$t('Global.add')"
                variant="primary" v-if="student &&
            !student.has_registerations &&
            hasPermission('add_term') &&
            hasPermission('edit_student')
            ">
                <feather-icon icon="PlusIcon" />
              </b-button>
            </div>

            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t("Global.grades_years") }}</span>
            </template>
            <GradesTabTable v-if="student && renderComponent" :isSemesterBased="isSemesterBased"
              @editCourse="toggleAddCourseModal" @deleteGradeForStudent="deleteGradeForStudent"
              @editTermGrades="toggleTermGradesModal" :type="student.programs_levels_grades ? null : 'programs_levels_grades'
            " :items="student.programs_levels_grades" :load="load" :fields="[
            {
              key: 'year',
              label: this.$t('Global.year'),
              thStyle: { width: '10%' },
            },
            {
              key: 'grade_level',
              label: this.$t('Global.academic_year'),
              thStyle: { width: '10%' },
            },
            {
              key: 'total',
              label: this.$t('Global.total'),
              thStyle: { width: '10%' },
            },
            {
              key: 'cumulative',
              label: this.$t('Global.cumulative'),
              thStyle: { width: '30%' },
            },
            {
              key: 'term_grade_type',
              label: this.$t('Global.grade'),
              thStyle: { width: '30%' },
            },
          ]" :inner="[
            {
              key: 'code',
              label: this.$t('Global.code'),
              thStyle: { width: '10%' },
            },
            { key: 'course', label: this.$t('Global.course') },
            {
              key: 'total',
              label: this.$t('Global.total'),
              thStyle: { width: '10%' },
            },
            {
              key: 'max_total',
              label: this.$t('Global.max_total'),
              thStyle: { width: '10%' },
            },
            {
              key: 'grade_type',
              label: this.$t('Global.grade'),
              thStyle: { width: '10%' },
            },
            {
              key: 'action',
              label: this.$t('Global.actions'),
              thStyle: { width: '10%' },
            },
          ]" />
          </b-tab>

          <b-tab v-if="hasPermission('access_academic_student')">
            <template #title>
              <feather-icon icon="UserIcon" />
              <span id="gradesFinals">{{ $t("Global.grades_final") }}</span>
            </template>
            <div>
              <div v-if="!gradesFinalsEdit">
                <div class="d-flex justify-content-end align-items-center">
                  <div class="mb-2">
                    <feather-icon @click="(e) => {
              editMode('grades_final');
            }
            " v-if="hasPermission('edit_student') &&
            !student.has_registerations
            " style="cursor: pointer" icon="EditIcon" class="font-medium-3 text-primary"
                      v-b-tooltip.hover="$t('Global.edit')" />
                  </div>
                </div>
                <list v-if="student && student.student" style="padding: 0 !important" :data="student.student" :only="[]"
                  :has-margins="false">
                  <template #custom_show>
                    <!--  total   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.total`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.total }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.total_final`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.total_final }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  max total   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.max_total`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.max_total }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  GPA   -->
                    <tr v-if="!isSemesterBased">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.gpa`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.gpa }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  credit_points   -->
                    <tr v-if="!isSemesterBased">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.credit_points`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.credit_points }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  credit_hours   -->
                    <tr v-if="!isSemesterBased">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.credit_hours`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.credit_hours }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  grade_type   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.grade`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span v-if="student.grades_final &&
            student.grades_final.gradeTypeData
            ">
                                    {{
            isSemesterBased
              ? $i18n.locale == "ar"
                ? student.grades_final.gradeTypeData
                  .name_local
                : student.grades_final.gradeTypeData
                  .name
              : student.grades_final.gradeTypeData.gpa
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  project_total   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.project_total`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.project_total }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  project_max_total   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.project_max_total`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.project_max_total }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  project_gpa   -->
                    <tr v-if="!isSemesterBased">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.project_gpa`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{ student.grades_final.project_gpa }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  project_credit_hours   -->
                    <tr v-if="!isSemesterBased">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.project_ch`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student.grades_final.project_credit_hours
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  project_credit_points   -->
                    <tr v-if="!isSemesterBased">
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.project_cp`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student.grades_final.project_credit_points
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  project_garde_type   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.project_garde_type`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span v-if="student.grades_final &&
            student.grades_final.projectGradeTypeData
            ">
                                    {{
            isSemesterBased
              ? $i18n.locale == "ar"
                ? student.grades_final
                  .projectGradeTypeData.name_local
                : student.grades_final
                  .projectGradeTypeData.name
              : student.grades_final
                .projectGradeTypeData.gpa
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <!--  honour   -->
                    <tr>
                      <th scope="row" :width="'40%'">
                        {{ $t(`Global.honour`) }}
                      </th>
                      <td class="d-flex flex-wrap">
                        <div class="d-flex">
                          <div class="d-flex flex-wrap">
                            <div>
                              <div class="d-flex flex-wrap">
                                <div>
                                  <span>
                                    {{
            student.grades_final.honour == true
              ? $t("Global.yes")
              : student.grades_final.honour == false
                ? $t("Global.no")
                : ""
          }}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </template>
                </list>
              </div>
              <div v-else-if="!personalEdit &&
            !academicEdit &&
            !prestudyEdit &&
            !militaryEdit &&
            gradesFinalsEdit
            ">
                <div class="d-flex justify-content-end align-items-center">
                  <div class="mb-2">
                    <feather-icon @click="(e) => {
              closeEditMode();
            }
            " v-if="hasPermission('edit_student')" style="cursor: pointer" icon="XCircleIcon"
                      class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.close')" />
                  </div>
                </div>
                <EditGradesFinal :isSemesterBased="isSemesterBased" :editModeVersion="EditModeData"
                  @closeEditMode="closeEditMode" />
              </div>
            </div>
          </b-tab>

          <!--end issue-->

          <!-- Study Schedule -->
          <b-tab v-if="hasPermission('access_academic_student')">
            <template #title>
              <feather-icon icon="CalendarIcon" />
              <span>{{ $t("study_schedule") }}</span>
            </template>
            <Study-schedule v-if="renderStudyScheduleComponent" :user_id="id" :student_id="id" />
          </b-tab>

          <!-- Exam Schedule -->
          <b-tab v-if="hasPermission('access_academic_student')">
            <template #title>
              <feather-icon icon="CalendarIcon" />
              <span id="exam_schedule">{{ $t("exam_schedule") }}</span>
            </template>
            <Exams-schedules :listedOnly="true" :user_id="id" :studentID="id" />
          </b-tab>

          <!-- Excuses -->
          <b-tab v-if="hasPermission('access_academic_student')" :title-link-class="linkClass(3)">
            <template #title>
              <feather-icon icon="CalendarIcon" />
              <span id="excuses">{{ $t("excuses") }}</span>
            </template>
            <Excuses :listedOnly="true" :user_id="id" :studentID="id" />
          </b-tab>

          <!-- Payment -->
          <b-tab v-if="hasPermission('access_financial_student')" :title-link-class="linkClass(0)">
            <template #title>
              <feather-icon icon="DollarSignIcon" />
              <span>{{ $t("payment") }}</span>
            </template>
            <Payments :user_id="id" :student_id="id" />
          </b-tab>
          <b-tab v-if="hasPermission('access_financial_student')">
            <template #title>
              <feather-icon icon="DollarSignIcon" />
              <span>{{ $t("Global.Credit") }}</span>
            </template>
            <Credits :title="$t('Global.credit')" no-status :user_id="id" />
          </b-tab>
          <b-tab v-if="hasPermission('access_academic_student')">
            <template #title>
              <feather-icon icon="AwardIcon" />
              <span>{{ $t("Global.certificates") }}</span>
            </template>
            <div>
              <Certificates title="Certificates" no-status :user_id="id" />
            </div>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="Minimize2Icon" />
              <span>{{ $t("Global.complains_requests") }}</span>
            </template>
          </b-tab>
          <b-tab :title-link-class="linkClass(4)">
            <template #title>
              <feather-icon icon="Link2Icon" />
              <span id="documents">{{ $t("Global.documents") }}</span>
            </template>
            <Archive v-if="student && student.student" :list="true"
              :parent="student.archive_id != null ? student.archive_id : null" :action_show="true" :breadcrumb="false"
              :student-show="true" :allow-search="false" :enable-import="false" :enableExport="false" />
          </b-tab>

          <!-- Notes -->
          <b-tab :title-link-class="linkClass(0)" v-if="hasPermission('access_notes')">
            <template #title>
              <feather-icon icon="Edit3Icon" />
              <span id="notes">{{
            $t("Global.notes")
          }}</span>
            </template>
            <div>
              <div v-if="!notesEdit">
                <div class="d-flex justify-content-end align-items-center">
                  <div class="mb-2">
                    <feather-icon @click="(e) => {
              editMode('notes');
            }
            " v-if="hasPermission('edit_notes')" style="cursor: pointer" icon="EditIcon"
                      class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.edit')" />
                  </div>
                </div>
                <!-- <list
                  v-if="student && student.student"
                  style="padding: 0 !important"
                  :data="student.student"
                  :only="[]"
                  :has-margins="false"
                >
                  <template #custom_show>
                    <tr> -->
                <strong class="mb-2">
                  {{ $t(`Global.notes`) }}
                </strong>
                <hr />
                <div class="w-100">
                  <span v-if="student" v-html="student.notes">
                  </span>
                </div>
                <!-- </tr>
              </template>
            </list> -->
              </div>
              <div v-else-if="notesEdit &&
            !academicEdit &&
            !prestudyEdit &&
            !militaryEdit &&
            !gradesFinalsEdit
            ">
                <div class="d-flex justify-content-end align-items-center">
                  <div class="mb-2">
                    <feather-icon @click="(e) => {
              closeEditMode();
            }
            " v-if="hasPermission('edit_student')" style="cursor: pointer" icon="XCircleIcon"
                      class="font-medium-3 text-primary" v-b-tooltip.hover="$t('Global.close')" />
                  </div>
                </div>
                <edit :editModeVersion="EditModeData" @closeEditMode="closeEditMode" />
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-col>
    <b-modal no-close-on-backdrop v-model="certificate" :title="$t('Global.certificate_for')">
      <b-row>
        <b-col cols="6" md="12">
          <b-input-group style="margin-top: 9px" class="input-group-merge">
            <b-form-input v-model="certificateFor" :placeholder="$t('Global.certificate_for')" id="total"
              type="text"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col cols="6" md="12">
          <b-input-group style="margin-top: 9px" class="input-group-merge">
            <b-form-input v-model="certificateDetails" :placeholder="$t('Global.notes')" id="total"
              type="text"></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>

      <template #modal-footer>
        <div class="mt-2">
          <b-row>
            <b-col cols="12" md="12">
              <div class="d-flex justify-content-end">
                <b-button type="submit" variant="primary" class="mr-1" @click="getCertificate()">
                  {{ $t("Global.save") }}
                </b-button>
                <b-button type="reset" variant="outline-primary" @click="certificate = false">
                  {{ $t("Global.cancel") }}
                </b-button>
              </div>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-modal>
    <!--Modals-->
    <!-- Add/Edit course -->
    <b-modal no-close-on-backdrop v-model="toggleAddCourse" :title="modalTitle">
      <b-row class="text-left">
        <b-col cols="12" md="12" v-if="!hideTermCourseFiles">
          <v-select v-model="courseToAdd.term_id" :filter="fuseSearch" :reduce="(val) => val.id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="terms" class="w-100 mb-2"
            :placeholder="$t('Global.selectTerm')">
            <template slot="selected-option" slot-scope="option">
              <span v-if="option.setBold">
                <b>{{
            $i18n.locale == "ar" ? option.name_local : option.name
          }}</b>
              </span>
              <span v-else>
                {{ $i18n.locale == "ar" ? option.name_local : option.name }}
              </span>
            </template>
            <template v-slot:option="option">
              <span v-if="option.setBold">
                <b>{{
            $i18n.locale == "ar" ? option.name_local : option.name
          }}</b>
              </span>
              <span v-else>
                {{ $i18n.locale == "ar" ? option.name_local : option.name }}
              </span>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="12" v-if="!hideTermCourseFiles">
          <v-select id="courses" v-model="courseToAdd.course_id" :options="searchCourses" :label="getSelectLabel()"
            class="w-100" :placeholder="$t('Global.selectCourse')" :filterable="false" clearable
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :reduce="(val) => val.id" @search="fetchCourses">
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
      </b-row>

      <b-row class="text-left">
        <b-col cols="6" md="6">
          <b-input-group style="margin-top: 9px" class="input-group-merge">
            <b-form-input v-model="editableCourse.total" :placeholder="$t('Global.total')" id="total"
              type="number"></b-form-input>
          </b-input-group>
        </b-col>
        <b-col cols="6" md="6">
          <b-input-group style="margin-top: 9px" class="input-group-merge">
            <b-form-input v-model="editableCourse.max_total" :placeholder="$t('Global.max_total')" id="mtotal"
              type="number"></b-form-input>
          </b-input-group>
        </b-col>

        <template v-if="!isSemesterBased">
          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="editableCourse.credit_hours" id="chours" :placeholder="$t('Global.credit_hours')"
                type="number"></b-form-input>
            </b-input-group>
          </b-col>
        </template>
      </b-row>

      <template #modal-footer>
        <div class="mt-2">
          <b-row>
            <b-col cols="12" md="12">
              <div class="d-flex justify-content-end">
                <b-button type="submit" variant="primary" class="mr-1" @click="addCourseForStudent()">
                  {{ $t("Global.save") }}
                </b-button>
                <b-button type="reset" variant="outline-primary" @click="toggleAddCourse = false">
                  {{ $t("Global.cancel") }}
                </b-button>
              </div>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-modal>

    <!-- Edit Term Grades -->
    <b-modal no-close-on-backdrop v-model="toggleTermGrades" :title="$t('Global.term_grades')">
      <b-row class="text-left">
        <b-col cols="6" md="6" v-if="isSemesterBased">
          <b-input-group style="margin-top: 9px" class="input-group-merge">
            <b-form-input v-model="termGrades.total" :placeholder="$t('Global.total')" id="total"
              type="number"></b-form-input>
          </b-input-group>
        </b-col>

        <b-col cols="6" md="6" v-if="isSemesterBased">
          <b-input-group style="margin-top: 9px" class="input-group-merge">
            <b-form-input v-model="termGrades.max_total" :placeholder="$t('Global.max_total')" id="max_total"
              type="number"></b-form-input>
          </b-input-group>
        </b-col>

        <b-col cols="6" md="6" v-if="isSemesterBased">
          <b-input-group style="margin-top: 9px" class="input-group-merge">
            <b-form-input v-model="termGrades.cumulative_total" :placeholder="$t('Global.cumulative_total')"
              id="cumulative_total" type="number"></b-form-input>
          </b-input-group>
        </b-col>

        <b-col cols="6" md="6" v-if="isSemesterBased">
          <b-input-group style="margin-top: 9px" class="input-group-merge">
            <b-form-input v-model="termGrades.cumulative_max_total" :placeholder="$t('Global.cumulative_max_total')"
              id="cumulative_max_total" type="number"></b-form-input>
          </b-input-group>
        </b-col>

        <template v-if="!isSemesterBased">
          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="termGrades.gpa" :placeholder="$t('Global.gpa')" id="gpa"
                type="number"></b-form-input>
            </b-input-group>
          </b-col>
          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="termGrades.credit_points" :placeholder="$t('Global.credit_points')"
                id="credit_points" type="number"></b-form-input>
            </b-input-group>
          </b-col>

          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="termGrades.credit_hours" id="credit_hours" :placeholder="$t('Global.credit_hours')"
                type="number"></b-form-input>
            </b-input-group>
          </b-col>

          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="termGrades.passed_hours" id="passed_hours" :placeholder="$t('Global.passed_hours')"
                type="number"></b-form-input>
            </b-input-group>
          </b-col>

          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="termGrades.cumulative_gpa" id="cumulative_gpa"
                :placeholder="$t('Global.cumulative_gpa')" type="number"></b-form-input>
            </b-input-group>
          </b-col>

          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="termGrades.cumulative_credit_points" id="cumulative_credit_points"
                :placeholder="$t('Global.cumulative_credit_points')" type="number"></b-form-input>
            </b-input-group>
          </b-col>

          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="termGrades.cumulative_credit_hours" id="cumulative_credit_hours"
                :placeholder="$t('Global.cumulative_credit_hours')" type="number"></b-form-input>
            </b-input-group>
          </b-col>

          <b-col cols="6" md="6">
            <b-input-group style="margin-top: 9px" class="input-group-merge">
              <b-form-input v-model="termGrades.cumulative_passed_hours" id="cumulative_passed_hours"
                :placeholder="$t('Global.cumulative_passed_hours')" type="number"></b-form-input>
            </b-input-group>
          </b-col>
        </template>
      </b-row>

      <template #modal-footer>
        <div class="mt-2">
          <b-row>
            <b-col cols="12" md="12">
              <div class="d-flex justify-content-end">
                <b-button type="submit" variant="primary" class="mr-1" @click="updateTermGrades()">
                  {{ $t("Global.save") }}
                </b-button>
                <b-button type="reset" variant="outline-primary" @click="toggleTermGrades = false">
                  {{ $t("Global.cancel") }}
                </b-button>
              </div>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-modal>
  </b-row>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  BTab,
  BTabs,
  BDropdown,
  BDropdownItem,
  BCard,
  BCol,
  BRow,
  BAvatar,
  BTable,
  BSpinner,
  BLink,
  BModal,
  BFormInput,
  BInputGroup,
  BFormCheckbox,
  BBadge, BOverlay,
} from "bootstrap-vue";
import List from "@/views/components/info/list";
import ShowTable from "@/views/students/student/components/ShowTable";
import GradesTabTable from "@/views/students/student/components/GradesTabTable";
import StudySchedule from "@/views/study/schedule/students/scheduling/calendar/Calendar";
import ExamsSchedules from "@/views/students/student/components/ExamSchedule";
import Excuses from "@/views/study/excuses/components/excuses.vue";
import Payments from "@/views/students/payments/components/payments";
import Credits from "@/views/students/credits/components/credits";
import Certificates from "@/views/students/certificates/components/certificate";
import Archive from "@/views/administration/archive/components/archive";
import ShowComponent from "@/views/components/info/show";
import SimpleTable from "@/views/components/table/SimpleTable";
import edit from "./edit";
import EditMilitary from "./components/EditMilitary";
import EditGradesFinal from "./components/EditGradesFinal";
import vSelect from "vue-select";
import request from "@/utils/request";
import { bus } from "./StudentBus";
import EquivalentRequests from "@/views/students/student/transfer/components/EquivalentRequests.vue";

export default {
  name: "Show",
  components: {
    BOverlay,
    SimpleTable,
    EquivalentRequests,
    ShowComponent,
    BDropdownItem,
    BDropdown,
    BAvatar,
    Archive,
    Credits,
    Certificates,
    StudySchedule,
    ExamsSchedules,
    Excuses,
    Payments,
    ShowTable,
    GradesTabTable,
    List,
    BTabs,
    BTab,
    BCard,
    BCol,
    BRow,
    BTable,
    BSpinner,
    BLink,
    edit,
    BModal,
    BInputGroup,
    BFormInput,
    BFormCheckbox,
    vSelect,
    EditMilitary,
    EditGradesFinal,
    BBadge,
  },
  data() {
    return {
      equId: {},
      renderComponent: true,
      width: 0,
      ifMobile: false,
      rerender: true,
      inputTab: 0,
      equivalenceEdit: false,
      dropTabs: [],
      selectedTab: 0,
      windowWidth: window.innerWidth,
      window: {
        width: 0,
        height: 0,
      },
      certificateFor: null,
      certificateDetails: null,
      lang: this.$i18n.locale,
      tabIndex: 1,
      applicantData: null,
      enableEditMode: false,
      editModeVersion: "",
      academic: false,
      personal: false,
      notes: false,
      prestudy: false,
      military: false,
      gradesFinals: false,
      renderStudyScheduleComponent: true,
      takenCoursesFields: [],
      toggleGrades: false,
      toggleAddTerm: false,
      certificate: false,
      toggleAddCourse: false,
      toggleTermGrades: false,
      termGrades: {},
      semesterBased: false,
      terms: [],
      selectedTerm: "",
      saving: false,
      studentTerms: [],
      studentCourses: [],
      editableTerm: {},
      editableCourse: {},
      hideTermCourseFiles: false,
      courseToAdd: {
        course_id: "",
        term_id: "",
      },
      editTermModal: false,
      availableCourses: [],
      searchCourses: [],
    };
  },
  computed: {
    ...mapGetters({
      student: 'students/item',
      load: 'students/load',
      courseload: 'externalTransfer/courseLoad',
      Equload: 'externalTransfer/load',
      role: 'roles/userRoles',
      studentData: 'students/student',
      editModeComputed: 'students/isEditMode',
      editPage: 'students/editPage',
      avalibleCourses: 'externalTransfer/avalibleCourses',
      internalAvalibleCourses: "internalTransfer/avalibleCourses",
      termsGradesData: 'students/terms_grades',
      studentItem: 'externalTransfer/studentItem',
    }),
    viewEquivalenceTab() {
      return this.student &&
        (
          //External transfer checks
          (
            this.hasPermission('equivalize_courses_anytime_externalTransfer')
          )
          ||
          //Internal transfer checks
          (
            (
              this.hasPermission('edit_approved_faculty_internalTransfer') ||
              this.hasPermission('edit_approved_bylaw_internalTransfer') ||
              this.hasPermission('edit_approved_program_internalTransfer')
            )
          )
        )

    },
    isInternalTransfer() {
      return !!(this.student && this.student.internal_transfer_request !== undefined && this.student.internal_transfer_request && this.student.internal_transfer_request.id)
    },
    warningClass() {
      if (this.student.warnings < this.student.max_warnings && this.student.warnings > 0 && this.student.max_warnings > 0)
        return 'text-warning';
      else if (this.student.warnings >= this.student.max_warnings && this.student.max_warnings > 0)
        return 'text-danger';
      else
        return '';
    },
    modalTitle() {
      if (this.hideTermCourseFiles) return this.$t("Global.edit_course_grades");
      else return this.$t("Global.add_course");
    },
    term_id() {
      if (this.student.term) {
        return this.student.term.id;
      }
    },
    // getSelectedTab() {
    //   if (this.dropTabs) {
    //     return this.dropTabs.find((el) => el.id == this.selectedTab);
    //   } else {
    //     return this.dropTabs[0];
    //   }
    // },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    localLang() {
      return this.$i18n.locale;
    },
    mainData() {
      if (this.student) {
        return this.student.student;
      }
    },
    langChanged(val) {
      let langData = this.$i18n.locale;
      if (langData != this.lang) {
        this.lang = langData;
        this.changed = false;
      }
      this.chaged = true;
    },
    changed(val) {
      return val;
    },
    registrationFields() {
      return [
        {
          key: "id",
          label: this.$t("Global.id"),
        },
        {
          key: "code",
          label: this.$t("Global.code"),
        },
        {
          key: "name",
          label: this.$t("name"),
        },
        {
          key: "max_total",
          label: this.$t("max_total"),
        },
        {
          key: "credit",
          label: this.$t("credit_hours"),
        },
      ];
    },
    gradesFields() {
      if (
        this.student &&
        this.student.program &&
        this.student.program.bylaw &&
        this.student.program.bylaw.type_id == 2
      ) {
        return [
          this.$t("Global.code"),
          this.$t("course"),
          this.$t("Global.term"),
          this.$t("Global.total"),
          this.$t("Global.max_total"),
          this.$t("Global.grade"),
          this.$t("Global.actions"),
        ];
      } else {
        return [
          this.$t("Global.code"),
          this.$t("course"),
          this.$t("Global.term"),
          this.$t("Global.ch"),
          this.$t("Global.cp"),
          this.$t("Global.gpa"),
          this.$t("Global.grade"),
          this.$t("Global.total"),
          this.$t("Global.actions"),
        ];
      }
    },
    isSemesterBased() {
      return (
        this.student &&
        this.student.program &&
        this.student.program.bylaw &&
        this.student.program.bylaw.type_id == 2
      );
    },
    applicant() {
      return this.applicantData;
    },
    isEditMode() {
      return this.enableEditMode;
    },
    EditModeData() {
      return this.editModeVersion;
    },
    changeMode() {
      return this.changeModeData;
    },
    changeTabs() {
      return this.isChangeTabs;
    },
    busComputed() {
      return this.busWorking;
    },
    academicEdit() {
      return this.academic;
    },
    prestudyEdit() {
      return this.prestudy;
    },
    personalEdit() {
      return this.personal;
    },
    notesEdit() {
      return this.notes;
    },
    militaryEdit() {
      return this.military;
    },
    gradesFinalsEdit() {
      return this.gradesFinals;
    },
  },
  beforeMount() {
    if (this.$route.query) {
      // this.inputTab = Number(this.$route.query.tabNum);
      if (this.$route.query.tabNum) {
        this.setSelectedTab({ name: "", id: Number(this.$route.query.tabNum) });
      }
    }
  },
  mounted() {
    try {
    } catch (e) {
    }
    this.lang = this.$i18n.locale;
    this.getTerms();
    this.getStudentCourses();

    // (window.onresize = () => {
    //   this.window.Width = window.innerWidth;
    // }),
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    this.init();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions({
      getLookups: "app/GET_LOOKUPS",
    }),
    ...mapMutations({
      setLoad: "students/SET_ITEMS_LOAD",
    }),
    changePhoto(e) {
      this.file = e.target.files[0];
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      const that = this;
      reader.onload = e => {
        that.uploadPhoto();
      };
    },
    uploadPhoto() {
      let data = new FormData();
      data.append('file', this.file);
      data.append('short_name', 'PERSONAL_PHOTO');
      let payload = {
        id: this.student ? this.student.archive_id : null,
        query: data,
      };
      var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      if (!allowedExtensions.exec(this.file.name)) {
        this.errorToast(this.$t('Global.extension_error'));
      } else {
        this.loading = true;
        this.$store.dispatch('users/uploadPhoto', payload).then(_ => {
          this.$store.dispatch('users/get', this.student.id);
          this.loading = false;
          window.location.reload();
        });
      }
    },
    async forceRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
    getTranscript() {
      this.$store
        .dispatch("students/transcript", {
          id: this.id,
          name: this.studentData ? this.studentData.name : null,
          lang: this.$i18n.locale,
        })
        .then((res) => {
        })
        .catch((err) => {
          if (err.response.status == 403) {
            this.$swal({
              icon: "error",
              timer: 1400,
              showConfirmButton: false,
              title: this.$t("Global.ProgramTypeError"),
            });
          } else if (err.response.status == 400) {
            this.$swal({
              icon: "error",
              timer: 1400,
              showConfirmButton: false,
              title: this.$t("Global.PresidentErrorMessage"),
            });
          } else {
            this.$swal({
              icon: "error",
              timer: 1400,
              showConfirmButton: false,
              title: this.$t("errorMessage"),
            });
          }
        });
    },
    getCertificate() {
      this.$store
        .dispatch("students/certificate", {
          id: this.id,
          certificate_for: this.certificateFor,
          certificate_details: this.certificateDetails,
          name: this.studentData ? this.studentData.name : null,
          lang: this.$i18n.locale,
        })
        .then((res) => {
          this.setLoad(false);
        });
    },
    saveStatus(index) {
      this.updateFilterQueryParams({
        tabNum: index,
        ...this.getTabFilterData(index),
        inline: false,
      });
      // this.setSelectedTab({ name: "", id: this.inputTab });

      if (index == 5) {
        this.loadGradesFinal();
      }
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    },
    async init() {
      this.$store.dispatch("students/get", this.id).then((res) => {
        this.applicantData = res.data.applicant_data;
        if (res.data.pre_university_certificate_groupe == null) {
          this.student.data.pre_university_certificate_groupe = {};
        }
        if (res.data.pre_university_certificate_type == null) {
          this.student.data.pre_university_certificate_type = {};
        }
        if (res.data.pre_university_certificate == null) {
          this.student.data.pre_university_certificate = {};
        }
        return res;
      });
      await this.getTerms();
      await this.getStudentCourses();
      await this.forceRerender();
    },
    linkClass(idx) {
      if (0 === idx) {
        return ["mt-1"];
        // return ['border','border-bottom-3']
      } else if (4 === idx) {
        try {
          let ele = document.getElementById("documents");
          ele.parentElement.style.position = "relative";
          ele.parentElement.parentElement.classList.add("info-tap");
        } catch (e) {
        }
      } else if (3 === idx) {
        try {
          let ele = document.getElementById("excuses");
          ele.parentElement.style.position = "relative";
          ele.parentElement.parentElement.classList.add("info-tap");
        } catch (e) {
        }
      } else {
        try {
          let ele = document.getElementById("prestudyInfo");
          ele.parentElement.style.position = "relative";
          ele.parentElement.parentElement.classList.add("info-tap");
        } catch (e) {
        }
      }
    },
    getTotal(data) {
      let total = (data.total_marks / data.max_marks) * 100;
      if (total) {
        return total.toFixed(2) + "%";
      }
      return 0;
    },
    getSubjects(data, subjects) {
      let array = [];
      subjects.forEach((element, i) => {
        if (data[element]) {
          array.push(element);
        }
      });
      return array;
    },
    getCustomData(data) {
      delete data["pre_university_certificate_groupe"];
      delete data["pre_university_certificate_type"];
      delete data["pre_university_certificate"];
      return data;
    },
    closeEditMode() {
      this.isChangeTabs = true;
      this.enableEditMode = false;
      bus.$emit("closeEditMode", false);
    },
    editMode(editpage) {
      this.equId = editpage;
      if (editpage == "personal_info") {
        this.academic = false;
        this.prestudy = false;
        this.personal = true;
        this.military = false;
        this.gradesFinals = false;
        this.equivalenceEdit = false;
      } else if (editpage == "academic_info") {
        this.prestudy = false;
        this.personal = false;
        this.academic = true;
        this.military = false;
        this.gradesFinals = false;
        this.equivalenceEdit = false;
      } else if (editpage == "military_info") {
        this.prestudy = false;
        this.personal = false;
        this.academic = false;
        this.military = true;
        this.equivalenceEdit = false;
        this.gradesFinals = false;
      } else if (editpage == "grades_final") {
        this.prestudy = false;
        this.personal = false;
        this.academic = false;
        this.military = false;
        this.equivalenceEdit = false;
        this.gradesFinals = true;
      } else if (editpage.name == "equivalence_info" || editpage == "abroad_study") {
        this.prestudy = false;
        this.personal = false;
        this.academic = false;
        this.military = false;
        this.equivalenceEdit = true;
      } else if (editpage == "notes") {
        this.prestudy = false;
        this.personal = false;
        this.academic = false;
        this.military = false;
        this.equivalenceEdit = false;
        this.gradesFinals = false;
        this.notes = true;
      }
      this.editModeVersion = editpage;
      this.enableEditMode = !this.enableEditMode;
      // this.$router.push({ name: 'student-edit', params: { id: this.id, details: editpage } })
    },
    async getStudentTerms() {
      if (!this.$route.params.id) return
      await request
        .get(`students/${this.$route.params.id}/terms`)
        .then((res) => {
          this.studentTerms = res.data;
          //this.terms = res.data
        })
        .catch((err) => {
        });
    },
    async getStudentCourses() {
      this.setLoad(true);
      if (!this.$route.params.id) return
      await request
        .get(`students/${this.$route.params.id}/courses`)
        .then((res) => {
          this.studentCourses = res.data;
        })
        .catch((err) => {
        })
        .finally(() => {
          this.setLoad(false);
        });
    },
    fetchCourses(search, load) {
      if (search.length >= 3 && !this.waitFetchCourses) {
        this.waitFetchCourses = true;
        load(true);
        const query = {
          search_courses_keyword: search,
          search_courses_bylaw: true,
          student_id: this.student.id,
        };

        this.getLookups(query).then((response) => {
          this.searchCourses = response.success.search_courses;
          load(false);
          this.waitFetchCourses = false;
        });
      }
    },
    async getTerms() {
      await this.getStudentTerms().then(() => {
        this.getLookups({ terms: true })
          .then((res) => {
            let terms = res.success.terms;
            if (terms.length) {
              for (let i = 0; i < terms.length; i++) {
                for (let j = 0; j < this.studentTerms.length; j++) {
                  if (terms[i].id == this.studentTerms[j].id) {
                    terms[i].setBold = true;
                    terms[i].name = terms[i].name + "(Existing)";
                    terms[i].name_local = terms[i].name_local + "(موجود)";
                    break;
                  } else {
                    terms[i].setBold = false;
                  }
                }
              }
              this.terms = terms;
            }
          })
          .catch((err) => {
          });
      });
    },
    loadGradesTerms() {
      if (
        this.student &&
        this.student.program &&
        this.student.program.bylaw &&
        this.student.program.bylaw.type_id == 1
      ) {
        this.$store
          .dispatch("students/get", `${this.id}/terms_grades`)
          .then((res) => {
            this.setLoad(false);
          });
      } else {
        this.$store
          .dispatch("students/get", `${this.id}/programs_levels_grades`)
          .then((res) => {
            this.setLoad(false);
          });
      }
    },
    deleteGradeForStudent(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          request
            .post(`grades/delete_grade/${this.$route.params.id}/course/${id}`, {
              _method: "DELETE",
            })
            .then((_) => {
              this.setLoad(true);
              this.loadGradesTerms();

              this.init();
              this.$swal({
                icon: "success",
                timer: 1400,
                showConfirmButton: false,
                title: this.$t("Global.deleted"),
              });
            });
        }
      });
    },
    toggleAddCourseModal(grade = null) {
      if (grade) {
        this.hideTermCourseFiles = true;

        this.courseToAdd = {
          course_id: grade.course.id,
          term_id: grade.term_id,
        };

        this.editableCourse = {
          grade_id: grade.id,
          course_name: grade.course.name,
          course_local: grade.course.name_local,
          course_id: grade.course.id,
          term_id: grade.term_id,
          total: grade.total,
          max_total: grade.max_total,
          credit_hours: grade.credit_hours,
        };
      } else {
        this.hideTermCourseFiles = false;
        this.editableCourse = {};
        this.courseToAdd = {
          course_id: "",
          term_id: "",
        };
      }

      this.toggleAddCourse = true;
    },
    addCourseForStudent() {
      request
        .post(`grades/add_grade/${this.$route.params.id}`, {
          data: this.courseToAdd,
          course: this.editableCourse,
        })
        .then((res) => {
          this.init();
          this.toggleAddCourse = false;
          this.courseToAdd = {
            course_id: "",
            term_id: "",
          };

          this.$swal({
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
            title: this.$t("Global.saved"),
          });
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            timer: 1400,
            showConfirmButton: false,
            title: err.response.data.errors[0].title,
          });
        });
    },
    toggleTermGradesModal(term) {
      this.termGrades.id = term.grade_term_id;
      this.termGrades.gpa = term.term_gpa;
      this.termGrades.credit_points = term.term_credit_points;
      this.termGrades.credit_hours = term.term_credit_hours;
      this.termGrades.passed_hours = term.term_passed_hours;
      this.termGrades.cumulative_gpa = term.term_cumulative_gpa;
      this.termGrades.cumulative_credit_points =
        term.term_cumulative_credit_points;
      this.termGrades.cumulative_credit_hours =
        term.term_cumulative_credit_hours;
      this.termGrades.cumulative_passed_hours =
        term.term_cumulative_passed_hours;
      this.termGrades.total = term.term_total;
      this.termGrades.max_total = term.term_max_total;
      this.termGrades.cumulative_total = term.term_cumulative_total;
      this.termGrades.cumulative_max_total = term.term_cumulative_max_total;

      this.toggleTermGrades = true;
    },
    updateTermGrades() {
      request
        .post(
          `grades/update_term_grades/${this.$route.params.id}/${this.termGrades.id}`,
          {
            data: this.termGrades,
          }
        )
        .then((res) => {
          this.loadGradesTerms();
          this.init();
          this.toggleTermGrades = false;
          this.termGrades = {};

          this.$swal({
            icon: "success",
            timer: 1400,
            showConfirmButton: false,
            title: this.$t("Global.saved"),
          });
        })
        .catch((err) => {
          this.$swal({
            icon: "error",
            timer: 1400,
            showConfirmButton: false,
            title: err.response.data.errors[0].title,
          });
        });
    },
    loadGradesFinal() {
      this.$store.dispatch("students/get", {
        type: "grades_final",
        id: this.$route.params.id
          ? this.$route.params.id
          : this.$route.params.student_id
            ? this.$route.params.student_id
            : null,
      });
    },
  },
  watch: {
    inputTab: function (val) {
      if (val === 4) {
        this.setLoad(true);
        this.$store
          .dispatch("students/get", `${this.id}/registrations`)
          .then((res) => {
            this.setLoad(false);
          });
      }
    },
    lang: function () {
      this.changed = false;
      this.changed = true;
    },
    localLang: function () {
      // remove the my-component component from the DOM
      this.renderStudyScheduleComponent = false;
      this.$nextTick(() => {
        // add my-component component in DOM
        this.renderStudyScheduleComponent = true;
      });
    },
  },
  created() {
    bus.$on("closeEditMode", (data) => {
      this.enableEditMode = false;
      this.academic = false;
      this.prestudy = false;
      this.personal = false;
      this.equivalenceEdit = false;
      this.military = false;
      this.gradesFinals = false;
      this.notes = false;
      this.init();
    });
  },
};
</script>

<style>
/*.sperator{*/
/*  border-bottom: 1px solid black;*/
/*  margin-bottom: 30px;*/
/*}*/
/*#parent-info {*/
/*  border-bottom: 1px solid black;*/
/*  margin-bottom: 30px;*/
/*}*/
/*ul.nav > li.nav-item > a.nav-link{*/
/*  border-bottom: 3px solid black;*/
/*}*/
.borderbottom {
  border-bottom: 3px solid black;
}

.info-tap::after {
  content: "";
  position: absolute;
  bottom: -9px;
  left: 0;
  height: 1px;
  width: 100%;
  background-color: #ccc;
  padding-top: 1px;
  padding-bottom: 1px;
}

.top_left {
  top: -15px;
  left: -15px;
}
</style>
