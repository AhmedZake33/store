<template>
  <div v-if="item">
    <b-overlay :show="show" rounded="sm">
      <b-card>
        <div class="custom_actions">
          <b-dropdown v-ripple.400="'rgba(113, 102, 240, 0.15)'" :text="$t('Global.more')" right size="sm"
                      variant="outline-primary">
            <b-dropdown-item :to="{name: 'advising_registration', params: { id: $route.params.student_id},}"
                             target="_blank">
              {{ $t('registrations') }}
            </b-dropdown-item>
          </b-dropdown>
        </div>

        <b-row v-if="getStudentDetails">
          <b-col
            cols="21"
            xl="6"
            class="d-flex justify-content-between flex-column"
          >
            <div class="d-flex justify-content-start">
              <b-avatar
                style="width: 150px; height: 150px"
                :src="
                  getStudentDetails.id
                    ? user_photo(getStudentDetails.id || null)
                    : require('@/assets/images/avatar.jpg')
                "
                size="104px"
                rounded
              />

              <div style="margin-top: 30px" class="d-flex flex-column ml-1">
                <div class="mb-1">
                  <h4 class="mb-0" style="font-weight: bold">
                    {{
                      $i18n.locale == "en"
                        ? getStudentDetails.name
                          ? getStudentDetails.name.length > 25
                            ? getStudentDetails.name
                            : getStudentDetails.name
                          : getStudentDetails.name_local.length > 25
                          ? getStudentDetails.name_local
                          : getStudentDetails.name_local
                        : getStudentDetails.name_local
                        ? getStudentDetails.name_local.length > 25
                          ? getStudentDetails.name_local
                          : getStudentDetails.name_local
                        : getStudentDetails.name.length > 25
                        ? getStudentDetails.name
                        : getStudentDetails.name
                    }}
                  </h4>
                  <span class="card-text">
                    {{
                      getStudentDetails.email
                        ? getStudentDetails.email.length > 30
                          ? getStudentDetails.email
                          : getStudentDetails.email
                        : "-"
                    }}
                  </span>
                </div>
                <table class="mt-2 mt-xl-0" style="width: 100%">
                  <tr
                    v-if="
                      student &&
                      student.student &&
                      student.student.study_type == 1
                    "
                  >
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
                  <tr
                    v-if="
                      student &&
                      student.student &&
                      student.student.study_type == 1
                    "
                  >
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
                  <tr
                    v-if="
                      student &&
                      student.student &&
                      student.student.study_type == 1
                    "
                  >
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
                      <feather-icon icon="AlertTriangleIcon" class="mr-75" :class="warningClass"/>
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
            <table
              v-if="!academicEdit"
              class="mt-2 mt-xl-0"
              style="width: 100%"
            >
              <tr style="width: 100%">
                <th class="pb-50 d-flex flex-wrap">
                  <span class="label"></span>
                </th>
                <td class="pb-50" style="text-align: end">
                  <feather-icon
                    @click="
                      (e) => {
                        editMode('academic_info');
                      }
                    "
                    v-if="hasPermission('edit_student')"
                    style="cursor: pointer"
                    icon="EditIcon"
                    class="font-medium-3 text-primary"
                    v-b-tooltip.hover="$t('Global.edit')"
                  />
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
                    {{ $t(`Global.Start_Term`) }}</span
                  >
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
                    <b-link
                      :to="{
                        name: 'faculty',
                        params: { id: student.faculty.id },
                      }"
                    >
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
                  <span
                    v-if="student && student.program && student.program.bylaw"
                  >
                    <b-link
                      :to="{
                        name: 'program',
                        params: { id: student.program.id },
                      }"
                    >
                      {{
                        $i18n.locale == "en"
                          ? student.program.name
                          : student.program.name_local
                      }} </b-link
                    >,
                    <b-link
                      :to="{
                        name: 'bylaw',
                        params: { id: student.program.bylaw.id },
                      }"
                    >
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
                      <b-link
                        :to="{
                          name: 'user-show',
                          params: { id: student.advisor.id },
                        }"
                      >
                        {{ getTranslatedNameFromObject(student.advisor) }}
                      </b-link>
                      <span v-if="student.advisor && student.advisor.email"
                        >,{{ student.advisor.email }}</span
                      >
                    </span>
                    <span v-else>
                      {{ getTranslatedNameFromObject(student.advisor) }}
                      <span v-if="student.advisor && student.advisor.email"
                        >,{{ student.advisor.email }}</span
                      >
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
                  <span
                    v-for="(status, index) in student.status_data"
                    :key="index"
                  >
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
                  <span
                    v-if="
                      student.status_data &&
                      student.status_data.length > 0 &&
                      student.term
                    "
                  >
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
                  <feather-icon
                    icon="AlertTriangleIcon"
                    class="mr-75 text-danger"
                  />
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
            <div
              v-else-if="
                !personalEdit &&
                academicEdit &&
                !prestudyEdit &&
                !militaryEdit &&
                !gradesFinalsEdit
              "
            >
              <div class="d-flex justify-content-end align-items-center">
                <div class="mb-2">
                  <feather-icon
                    @click="
                      (e) => {
                        closeEditMode();
                      }
                    "
                    v-if="hasPermission('edit_student')"
                    style="cursor: pointer"
                    icon="XCircleIcon"
                    class="font-medium-3 text-primary"
                    v-b-tooltip.hover="$t('Global.close')"
                  />
                </div>
              </div>
              <edit
                :terms="terms"
                :editModeVersion="EditModeData"
                @closeEditMode="closeEditMode"
              />
            </div>
          </b-col>
        </b-row>
      </b-card>
      <b-card class="mb-0">

        <b-tabs
            v-model="tabIndex"
            @input="saveStatus"
            lazy
            vertical
            nav-wrapper-class="nav-hidden"
            align="left"
            v-if="term.id"
        >
          <b-tab>
            <template #title>
              <feather-icon icon="BookIcon"/>
              <span>{{ ($i18n.locale == "ar" ? term.name_local : term.name) + ' ' + $t('Global.registrations') }}</span>
            </template>
            <DataTable
                v-if="getTermCourses"
                :allow-search="false"
                :loading="load"
                @Refresh="refresh"
                :paramsLoaded="paramsLoaded"
                :basicTable="true"
            >
              <template #customTable>
                <b-table
                    class="position-relative font-small-2"
                    :items="getTermCourses"
                    responsive
                    :fields="fieldsDataTerm"
                    primary-key="id"
                    show-empty
                    :empty-text="$t('Global.empty_text')"
                >
                  <template #cell(id)="data">
                  <span>
                  <b-link
                      v-if="data.item.offering"
                      :to="{
                        name: 'offering',
                        params: { id: data.item.offering.id },
                      }"
                      target="_blank"
                  >
                      {{ data.item.offering.id ? data.item.offering.id : "-" }}
                    </b-link>
                  </span>

                  </template>
                  <template #cell(max_total)="data">
                  <span>
                  {{ data.item.offering.max_total ? data.item.offering.max_total : "-" }}
                  </span>

                  </template>
                  <template #cell(grades)="data">
                    <span v-if="data.item.registration_marks.length > 0">
                      <span
                          v-for="(mark, index) in data.item.registration_marks"
                          :key="mark.id"
                      >
                        {{ mark.name }}( {{ mark.pivot.value ? mark.pivot.value : '-' }}
                       / {{ mark.max_mark }} )
                        {{
                          index == data.item.registration_marks.length - 1
                              ? ""
                              : ","
                        }}
                      </span>
                    </span>
                    <span v-else> - </span>
                  </template>
                  <template #cell(total)="data">
                    <span v-if="data.item.grade_type">
                    <b-badge variant="light-primary">
                    {{
                        data.item.total ? data.item.total : '-'
                      }}( {{
                        (data.item.total * 100) / data.item.offering.max_total + '%'
                      }}) , GPA({{ data.item.grade_type.gpa }}), {{ data.item.grade_type.name }}
                    </b-badge>

                    </span>
                  </template>

                  <template #cell(grades_status)="data">
                    <span v-if="data.item.control_status">
                      <b-badge
                          v-if="data.item.control_status"
                          variant="light-success"
                          style="margin: 1px"
                      >
                        {{ $t('Global.finished') }}
                      </b-badge>
                      <b-badge
                          v-else
                          variant="light-danger"
                          style="margin: 1px"
                      >
                        {{ $t('Global.not_finished') }}
                      </b-badge>
                    </span>
                  </template>
                  <!-- <template #cell(code)="data">
                  <span class="font-weight-bold d-block text-nowrap">
                     {{
                        data.item.offering.course.code
                          ? data.item.offering.course.code
                          : "-"
                      }}
                  </span>

                  </template> -->

                  <template #cell(control_status)="data">
                    <b-badge
                        pill
                        :variant="getColor(data.item.offering.status.name)"
                        class="text-capitalize"
                        v-if="$i18n.locale == 'en' && data.item.offering.status"
                    >
                      {{ data.item.offering.status.name }}
                    </b-badge>
                    <b-badge
                        pill
                        :variant="getColor(data.item.offering.status.name)"
                        class="text-capitalize"
                        v-if="$i18n.locale == 'ar' && data.item.offering.status"
                    >
                      {{ data.item.offering.status.name_local }}
                    </b-badge>
                  </template>
                  <template #cell(course)="data">
                  <span>
                   <b-link
                       v-if="$i18n.locale == 'en' && data.item.offering"
                       :to="{
                        name: 'course',
                        params: { id: data.item.offering.course.id },
                      }"
                   >
                      {{
                       data.item.offering.course.code
                           ? data.item.offering.course.code
                           : "-"
                     }}
                      {{
                       data.item.offering.course
                           ? data.item.offering.course.name
                           ? data.item.offering.course.name
                           : data.item.offering.course.name_local
                           : "-"
                     }}
                      <br/>
                      {{ $t("Global.status") }} :
                      <span
                          v-for="status in data.item.student_status"
                          :key="status.id"
                      >
                        <b-badge
                            v-if="status.name == 'Registered'"
                            variant="light-success"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else-if="status.name == 'Fresh'"
                            variant="light-primary"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else-if="status.name == 'Incomplete'"
                            variant="light-warning"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else-if="status.name == 'Excused'"
                            variant="light-danger"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else-if="status.name == 'Request'"
                            variant="light-warning"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else
                            variant="light-info"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                      </span>
                    </b-link>
                    <b-link class="font-weight-bold d-inline-block"
                            v-if="$i18n.locale == 'ar' && data.item.offering"
                            :to="{
                        name: 'course',
                        params: { id: data.item.offering.course.id },
                      }"
                    >
                       {{
                        data.item.offering.course.code
                            ? data.item.offering.course.code
                            : "-"
                      }}
                      {{
                        data.item.offering.course
                            ? data.item.offering.course.name_local
                            ? data.item.offering.course.name_local
                            : data.item.offering.course.name
                            : "-"
                      }}
                      <br/>
                      {{ $t("Global.status") }} :
                      <span
                          v-for="status in data.item.student_status"
                          :key="status.id"
                      >
                        <b-badge
                            v-if="status.name == 'Registered'"
                            variant="light-success"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else-if="status.name == 'Fresh'"
                            variant="light-primary"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else-if="status.name == 'Incomplete'"
                            variant="light-warning"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else-if="status.name == 'Excused'"
                            variant="light-danger"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else-if="status.name == 'Request'"
                            variant="light-warning"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                        <b-badge
                            v-else
                            variant="light-info"
                            style="margin: 1px"
                        >
                          {{
                            $i18n.locale == "en"
                                ? status.name
                                : status.name_local
                          }}
                        </b-badge>
                      </span>
                    </b-link>
                  </span>

                  </template>

                  <template #cell(actions)="data" v-if="!listed_only">
                    <div>
                      <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
              >
                <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template>
              </b-dropdown>
                      <b-link>
                        <feather-icon
                            icon="EditIcon"
                            v-b-tooltip.hover="$t('Global.edit_grades')"
                            class="text-primary"
                            @click="
                            openGradesDialog(data.item.registration_marks)
                          "
                        />
                      </b-link>
                      <b-link
                          :to="{ name: 'offering', params: { id: data.item.offering.id } }"
                          target="_blank"
                      >
                        <feather-icon
                            v-b-tooltip.hover="$t('Global.show_offering')"
                            icon="EyeIcon"
                            class="text-primary"
                        />
                      </b-link>
                    </div>
                  </template>
                </b-table>
              </template>

            </DataTable>
          </b-tab>
          <!----Taken Course--->
          <b-tab>
            <template #title>
              <feather-icon icon="TrendingUpIcon"/>
              <span>{{ $t("Global.takenCourses") }}</span>
            </template>

            <SimpleTable :fields="gradesFields" :items="studentCourses" :load="load" :actions="false"
                         :semesterBased="isSemesterBased">
            </SimpleTable>
          </b-tab>

          <b-tab v-if="
              student &&
              student.program &&
              student.program.bylaw &&
              student.program.bylaw.type_id == 1
            ">
            <div class="text-right my-2">
              <b-button class="btn-icon" v-b-tooltip.hover="$t('Global.add')"
                        variant="primary"
                        v-if="student && !student.has_registerations && hasPermission('add_term') && hasPermission('edit_student')">
                <feather-icon icon="PlusIcon"/>
              </b-button>
            </div>

            <template #title>
              <feather-icon icon="TrendingUpIcon"/>
              <span>{{ $t("Global.passed_terms") }}</span>
            </template>
            <GradesTabTable v-if="student && renderComponent" :loading="load"
                            :isSemesterBased="isSemesterBased"
                            :load="load"
                            :type="student.terms_grades ? null : 'terms_grades'"
                            :items="student.terms_grades"
                            :fields="[
                { key: 'term_name', label: this.$t('Global.grade_term'), thStyle: { width: '10%' } },
                { key: 'grade_level', label: this.$t('Global.level'), thStyle: { width: '10%' } },
                { key: 'total', label: this.$t('Global.grade'), thStyle: { width: '25%' } },
                { key: 'cumulative', label: this.$t('Global.cumulative'), thStyle: { width: '25%' } },
              ]" :inner="[
                { key: 'code', label: this.$t('Global.code'),thStyle: { width: '10%' }, },
                { key: 'course', label: this.$t('Global.course') },
                { key: 'credit_hours', label: this.$t('Global.credit_hours'),thStyle: { width: '10%' }, },
                { key: 'credit_points', label: this.$t('credit_points'),thStyle: { width: '10%' }, },
                { key: 'total_max_total', label: this.$t('Global.total'),thStyle: { width: '10%' }, },
                { key: 'grade_type', label: this.$t('Global.grade'),thStyle: { width: '10%' }, },
              ]"/>
          </b-tab>
          <b-tab v-else>
            <div class="text-right my-2">
              <b-button class="btn-icon" v-b-tooltip.hover="$t('Global.add')"
                        variant="primary"
                        v-if="student && !student.has_registerations && hasPermission('add_term') && hasPermission('edit_student')">
                <feather-icon icon="PlusIcon"/>
              </b-button>
            </div>

            <template #title>
              <feather-icon icon="TrendingUpIcon"/>
              <span>{{ $t("Global.grades_years") }}</span>
            </template>
            <GradesTabTable v-if="student && renderComponent"
                            :isSemesterBased="isSemesterBased"
                            :type="student.programs_levels_grades ? null : 'programs_levels_grades'"
                            :items="student.programs_levels_grades" :load="load"
                            :fields="[
                { key: 'year', label: this.$t('Global.year'), thStyle: { width: '10%' } },
                { key: 'grade_level', label: this.$t('Global.academic_year'), thStyle: { width: '10%' } },
                { key: 'total', label: this.$t('Global.total'), thStyle: { width: '10%' } },
                { key: 'cumulative', label: this.$t('Global.cumulative'), thStyle: { width: '30%' } },
                { key: 'term_grade_type', label: this.$t('Global.grade'), thStyle: { width: '30%' } },
              ]"
                            :inner="[
                { key: 'code', label: this.$t('Global.code'),thStyle: {width: '10%'}, },
                { key: 'course', label: this.$t('Global.course') },
                { key: 'total', label: this.$t('Global.total'),thStyle: {width: '10%'}, },
                { key: 'max_total', label: this.$t('Global.max_total'),thStyle: {width: '10%'}, },
                { key: 'grade_type', label: this.$t('Global.grade'),thStyle: {width: '10%'}, },
            ]"
            />
          </b-tab>

        </b-tabs>
      </b-card>
      <!--   <studyCurrentSemester></studyCurrentSemester> -->

      <b-modal
          id="modal"
          v-model="grades_dialog"
          no-close-on-backdrop
          size="lg"
          :title="$t('Global.edit_gardes')"
      >
        <validation-observer ref="simpleForm">
          <b-form ref="simpleForm" :class="load ? 'disabled_all' : ''" @keydown.enter="submit_grades">
            <div class="row">
              <b-col md="6" v-for="mark in termCoursesMarks" :key="mark.id">
                <b-form-group
                    :label="mark.name + '(' + mark.max + ')'"
                    label-for="mc-mark"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="mark"
                      rules="integer|positive"
                  >
                    <b-form-input
                        id="mc-mark"
                        type="number"
                        v-model="mark.value"
                        :state="errors.length > 0 ? false : null"
                        @change="checkMarks"
                    />

                    <ValidationErrors :frontend-errors="errors"/>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
        <template #modal-footer>
          <b-row :class="load ? 'disabled_all' : ''">
            <b-col md="12">
              <b-button
                  type="submit"
                  variant="primary"
                  class="mr-1"
                  @click="submit_grades"
              >
                {{ $t("Global.save") }}
              </b-button>

              <b-button
                  type="reset"
                  variant="outline-secondary"
                  @click="grades_dialog = false"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </template>
      </b-modal>
    </b-overlay>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
  BTab,
  BTabs,
  BForm,
  BFormGroup,
  BInputGroup,
  BFormCheckbox,
} from "bootstrap-vue";
import {mapActions, mapGetters} from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import DataTable from "@/views/components/table/DataTable";
import Statistics from "@/views/components/info/statistics";
import ShowComponent from "@/views/components/info/show";
import {ValidationProvider, ValidationObserver, localize} from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import {required, email, regex, integer, positive} from "@validations";
import TabTable from "@/views/control/students/components/TabTable.vue" //for taken courses grades
import TabTable3 from "@/views/students/student/components/TabTable";
import TabTable2 from "@/views/control/students/components/TabTablePassedSemester.vue" // for passed semester tab
import studyCurrentSemester from "@/views/students/student/components/StudyCurrentSemester.vue"
import SimpleTable from "@/views/components/table/SimpleTable";
import request from "@/utils/request";
import GradesTabTable from "@/views/students/student/components/GradesTabTable";

export default {
  name: "Students",
  components: {
    DataTable,
    BCard,
    vSelect,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    VBModal,
    BPopover,
    Statistics,
    BTab,
    BTabs,
    ShowComponent,
    BForm,
    BFormGroup,
    BInputGroup,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
    localize,
    ValidationErrors,
    TabTable,
    TabTable2,
    TabTable3,
    studyCurrentSemester,
    SimpleTable,
    GradesTabTable,
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    /*     title: String,*/
    listed_only: {type: Boolean, default: false},
    status: null,

  },
  data() {
    return {
      renderComponent: true,
      studentCourses: [],
      paramsLoaded: true,
      student_data: null,
      tabIndex: 0,
      show: true,
      grades_dialog: false,
      checked_course: 1,
      taken_courses_grades: null,
      term_courses: null,
      termCoursesMarks: [], //grades of student
      errorsdata: {},
      term: {},
      takenCoursesGrades: [],
      passedSemestersData: [],
      finish_flag: 1,
      semester: "",
      studentHistory: null,
      //student:null,
    };
  },
  beforeMount() {
    if (this.$route.query) {
      this.tabIndex = +this.$route.query.tabNum;
    }
  },
  computed: {
    ...mapGetters({
      item: "controlStudents/item",
      total: "controlStudents/total",
      load: "controlStudents/load",
      student: "students/item",
      needDrop:'app/needDrop',
      //lookups: "controlStudents/lookups",
    }),
    warningClass() {
      if (this.student.warnings < this.student.max_warnings && this.student.warnings > 0 && this.student.max_warnings > 0)
        return 'text-warning';
      else if (this.student.warnings >= this.student.max_warnings && this.student.max_warnings > 0)
        return 'text-danger';
      else
        return '';
    },
    isSemesterBased() {
      return this.student && this.student.program && this.student.program.bylaw && this.student.program.bylaw.type_id == 2
    },
    gradesFields() {
      if (this.student && this.student.program && this.student.program.bylaw && this.student.program.bylaw.type_id == 2) {
        return [
          this.$t('Global.code'),
          this.$t('course'),
          this.$t('Global.term'),
          this.$t('Global.total'),
          this.$t('Global.max_total'),
          this.$t('Global.grade'),
        ]
      } else {
        return [
          this.$t('Global.code'),
          this.$t('course'),
          this.$t('Global.term'),
          this.$t('Global.ch'),
          this.$t('Global.cp'),
          this.$t('Global.gpa'),
          this.$t('Global.grade'),
          this.$t('Global.total'),
        ]
      }
    },
    controlStatus() {
      if (this.term_courses) {
        this.term_courses.forEach((item) => {
          let arr = [];
          if (item.control_status) {
            for (let key in item.control_status) {
              let arr_db = {};

              // get the value
              arr_db.name = item.control_status[key].name
                  ? item.control_status[key].name
                  : item.control_status[key].name_local;
              arr_db.name_local = item.control_status[key].name_local
                  ? item.control_status[key].name_local
                  : item.control_status[key].name;
              arr.push(arr_db);
            }
          }
          this.term_courses.control_status = arr;
        });
      }
      //return arr
    },
    getStudentDetails() {
      let data = {};
      if (this.student_data) {
        //data.id=this.student_data.id?this.student_data.id:this.$route.params.student_id
        data.email = this.student_data.email ? this.student_data.email : "-";
        data.code = this.student_data.student
            ? this.student_data.student.code
            : "-";

        if (this.$i18n.locale === "en") {
          data.name = this.student_data.name
              ? this.student_data.name
              : this.student_data.name_local;
          if (this.student_data.status_data[0]) {
            data.status = this.student_data.status_data[0].name
                ? this.student_data.status_data[0].name
                : this.student_data.status_data[0].name_local;
          } else {
            data.status = "-";
          }
          if (this.student_data.program) {
            data.program = this.student_data.program.name
                ? this.student_data.program.name
                : this.student_data.program.name_local;
            data.faculty = this.student_data.program.faculty.name
                ? this.student_data.program.faculty.name
                : this.student_data.program.faculty.name_local;
          } else {
            data.program = "-";
          }

          if (this.student_data.start_term) {
            data.start_term = this.student_data.start_term.name
                ? this.student_data.start_term.name
                : this.student_data.start_term.name_local;
          } else {
            data.start_term = "-";
          }
          if (this.student_data.advisor) {
            let advisor = {};
            advisor.name = this.student_data.advisor.name
                ? this.student_data.advisor.name
                : this.student_data.advisor.name_local;
            advisor.id = this.student_data.advisor.id
                ? this.student_data.advisor.id
                : null;
            advisor.email = this.student_data.advisor.email
                ? this.student_data.advisor.email
                : "-";
            data.advisor = advisor;
          } else {
            data.advisor = "-";
          }
        } else if (this.$i18n.locale === "ar") {
          data.name = this.student_data.name_local
              ? this.student_data.name_local
              : this.student_data.name;
          if (this.student_data.status_data[0]) {
            data.status = this.student_data.status_data[0].name_local
                ? this.student_data.status_data[0].name_local
                : this.student_data.status_data[0].name;
          } else {
            data.status = "-";
          }
          if (this.student_data.program) {
            data.program = this.student_data.program.name_local
                ? this.student_data.program.name_local
                : this.student_data.program.name;
            data.faculty = this.student_data.program.faculty.name_local
                ? this.student_data.program.faculty.name_local
                : this.student_data.program.faculty.name;
          } else {
            data.program = "-";
          }
          if (this.student_data.start_term) {
            data.start_term = this.student_data.start_term.name_local
                ? this.student_data.start_term.name_local
                : this.student_data.start_term.name;
          } else {
            data.start_term = "-";
          }
          if (this.student_data.advisor) {
            let advisor = {};
            advisor.name = this.student_data.advisor.name_local
                ? this.student_data.advisor.name_local
                : this.student_data.advisor.name;
            advisor.id = this.student_data.advisor.id;
            advisor.email = this.student_data.advisor.email
                ? this.student_data.advisor.email
                : "-";
            data.advisor = advisor;
          } else {
            data.advisor = "-";
          }
        }

      }

      this.show = false;
      return data;
    },
    getTakenCoursesGrades() {
      this.show = true
      if (this.takenCoursesGrades) {
        this.show = false
      }
      return this.takenCoursesGrades
    },
    getPassedSemester() {
      this.show = true
      if (this.passedSemestersData) {
        this.show = false
      }
      return this.passedSemestersData
    },
    getTermCourses() {
      let data = [];
      if (this.term_courses != null) {
        data = this.term_courses;
      }
      return data;
    },

    //first tab semester courses tab
    fieldsDataTerm() {
      let fields = [
        {
          key: "id",
          label: this.$t("Global.id"),
          /*           thStyle: { width: "5%" },
           */          sortable: false,
        },


        {
          key: "course",
          label: this.$t("Global.course"),
          thStyle: {width: "30%"},
          sortable: false,
        },

        /* {
          key: "max_total",
          label: this.$t("Global.max_total"),
          sortable: false,
        }, */
        {
          key: "grades",
          label: this.$t("Global.grades"),
          thStyle: {width: "27%"},

          sortable: false,
        },
        {
          key: "total",
          label: this.$t("Global.total"),
          /*           thStyle: { width: "15%" },
           */          sortable: false,
        },
        {
          key: "grades_status",
          label: this.$t("Global.grades_status"),
          thStyle: {width: "5%"},
          sortable: false,
        },
        {
          key: "control_status",
          label: this.$t("Global.control_status"),
          thStyle: {width: "5%"},
          sortable: false,
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
      return fields;
    },
    fieldsDataTakenCourses() {
      let fields = [

        {
          key: "course",
          label: this.$t("Global.course"),
          sortable: false,
        },
        {
          key: "code",
          label: this.$t("Global.code"),
          sortable: false,
        },
        /* {
         key: "bylaw",
         label: this.$t("Global.bylaw"),
         thStyle: { width: "15%"},
         sortable: false,
       }, */
        /*  {
          key: "min_degree",
          label: this.$t("Global.min_degree"),
          sortable: false,
        },  */
        /* {
          key: "max_degree",
          label: this.$t("Global.max_degree"),
          sortable: false,
        }, */
        {
          key: "hours",
          label: this.$t("Global.credit_hours"),
          sortable: false,
        },
        {
          key: "term",
          label: this.$t("Global.semester"),
          sortable: false,
          thStyle: {width: "15%"},
        },
        {
          key: "credit_points",
          label: this.$t("Global.credit_points"),
          sortable: false,
        },
        {
          key: "grade",
          label: this.$t("Global.grade"),
          sortable: false,
        },
        /*  {
           key: "last_grade",
           label: this.$t("Global.last_grade"),
           sortable: false,
         }, */
        /* {
          key: "last_term",
          label: this.$t("Global.last_term"),
          sortable: false,
          thStyle: { width: "15%"},
        },  */
        /*  {
           key: "actions",
           label: this.$t("Global.actions"),
           thClass: "customAction",
           tdClass: "customWidth",
         }, */
      ];
      return fields;
    },

    InnerGradeHistoryFields() {
      let fields = [
        /*  {
          key: 'id',
          label:this.$t('Global.id'),
          sortable: true,
        }, */
        /* {
          key: "code",
          label: this.$t("Global.code"),
          thStyle: { width: "7%" },
          sortable: false,
        }, */


        {
          key: "course",
          label: this.$t("Global.course"),
          thStyle: {width: "25%"},
          sortable: false,
        },
        {
          key: "bylaw",
          label: this.$t("Global.bylaw"),
          thStyle: {width: "15%"},
          sortable: false,
        },
        {
          key: "hours",
          label: this.$t("Global.hours"),
          thStyle: {width: "7%"},
          sortable: false,
        },
        /*  {
          key: "min_degree",
          label: this.$t("Global.min_degree"),
          sortable: false,
        },  */
        {
          key: "grade",
          label: this.$t("Global.grade"),
          thStyle: {width: "10%"},
          sortable: false,
        },
        {
          key: "gpa",
          label: this.$t("Global.gpa"),
          thStyle: {width: "10%"},
          sortable: false,
        },


        {
          key: "term",
          label: this.$t("Global.term"),
          sortable: false,
          thStyle: {width: "17%"},
        },
        /*  {
           key: "actions",
           label: this.$t("Global.actions"),
           thClass: "customAction",
           tdClass: "customWidth",
         }, */
      ];
      return fields;
    },

    fieldPassedSemesters() {
      let fields = [
        {
          key: "study_program",
          label: this.$t("Global.study_program"),
          sortable: false,
          thStyle: {width: "7%"},
        },
        {
          key: "term",
          label: this.$t("Global.term"),
          sortable: false,
        },
        {
          key: "study_year",
          label: this.$t("Global.study_year"),
          thStyle: {width: "8%"},
          sortable: false,
        },
        {
          key: "level",
          label: this.$t("Global.level"),
          sortable: false,
        },
        {
          key: "term_gpa_ch_ph",
          label: this.$t("Global.term_gpa_ch_ph"),
          thStyle: {width: "25%"},
          sortable: false,
        },
        {
          key: "cumulative_gpa_ch_ph",
          label: this.$t("Global.cumulative_gpa_ch_ph"),
          thStyle: {width: "25%"},
          sortable: false,
        },

      ];
      return fields;
    },
    InnerfieldPassedSemesters() {
      let fields = [
        {
          key: "course",
          label: this.$t("Global.course"),
          sortable: false,
        },
        {
          key: "term",
          label: this.$t("Global.term"),
          sortable: false,
        },
        {
          key: "grade",
          label: this.$t("Global.grade"),

          sortable: false,
        },
        {
          key: "GPA",
          label: this.$t("Global.gpa"),
          sortable: false,
        },
        {
          key: "credit_hours",
          label: this.$t("Global.credit_hours"),
          sortable: false,
        },
        {
          key: "details",
          label: this.$t("Global.details"),
          sortable: false,
        },

      ];
      return fields;
    },

    language: function () {
      localStorage.setItem("mylang", this.$i18n.locale);
      return this.$i18n.locale;
    },

  },
  mounted() {
    this.init();
    this.getStudentCourses()
  },
  methods: {
    ...mapActions({
      getgetStudentDetails: "controlStudents/get",
      StudentTermGrades: "controlStudents/StudentTermGrades",
      UpdateStudentTermGrades: "controlStudents/UpdateStudentTermGrades",
      passedSemesters: "controlStudents/passedSemesters", //third tab passed semesters
    }),
    async forceRerender() {
      // Remove MyComponent from the DOM
      this.renderComponent = false;

      // Wait for the change to get flushed to the DOM
      await this.$nextTick();

      // Add the component back in
      this.renderComponent = true;
    },
    init() {
      this.show = true
      this.$store.dispatch("students/get", this.$route.params.student_id)/* .then(res => {
        this.student=res.data
      }) */
      this.$store
          .dispatch("students/get", `${this.$route.params.student_id}/courses_history`)
          .then((res) => {
            //this.setLoad(false);
            this.studentHistory = res.data
          });

      this.getgetStudentDetails(this.$route.params.student_id).then((response) => {
        this.student_data = response.data;

        //breadcrump update
        this.$store.commit("app/UPDATE_PAGE_DETAILS", {...response.data.term}, {
          root: true,
        });
      });

      let term = {};
      this.StudentTermGrades( {
        student_id: this.$route.params.student_id,
        term_id: this.$route.params.term_id
      }).then((response) => {
        term = response.data[0].offering.term
            ? response.data[0].offering.term
            : "";

        this.term = term

        this.term_courses = response.data;
        if (this.term_courses) {
          this.term_courses.forEach((item) => {
            let arr = [];
            if (item.control_status) {
              if (item.control_status == "Finished") {
                this.finish_flag = 0
              }
              for (let key in item.control_status) {
                let arr_db = {};

                // get the value
                arr_db.name = item.control_status[key].name
                    ? item.control_status[key].name
                    : item.control_status[key].name_local;
                arr_db.name_local = item.control_status[key].name_local
                    ? item.control_status[key].name_local
                    : item.control_status[key].name;
                arr.push(arr_db);
              }
            }
            /* if(item.offering)
            {
              if((item.offering.status.name !="Frozen") && (item.offering.status.name!="Approved") && (item.offering.status.name!="Published")  )
              {

                this.finish_flag = 0
              }
            } */

            this.term_courses.control_status = arr;
          });
        }
      });

      this.passedSemesters(this.$route.params.student_id).then((response) => {
        if (response) {
          this.passedSemestersData = response
        }
      })
      this.show = false
      this.getStudentDetails;
    },
    openGradesDialog(data) {
      let arr = [];
      if (data.length > 0) {
        data.forEach((mark) => {
          let arr_db = {};
          arr_db.id = mark.id;
          arr_db.name = mark.name;
          arr_db.value = mark.pivot.value;
          arr_db.max = mark.max_mark;

          arr_db.offering_mark_id = mark.pivot.offering_mark_id;
          arr_db.registration_id = mark.pivot.registration_id;

          arr.push(arr_db);
        });
      }
      this.termCoursesMarks = arr;
      this.grades_dialog = true;

    },
    async getStudentCourses() {
      await request.get(`students/${this.$route.params.student_id}/courses`).then(
          res => {
            this.studentCourses = res.data
          }).catch(err => { })
    },
    checkMarks() {
      if (this.termCoursesMarks) {
        this.termCoursesMarks.forEach((mark) => {
          if (mark.value > mark.max) {
            this.$swal({
              icon: "error",
              title:
                  this.$i18n.locale === "en"
                      ? "Wrong In Mark"
                      : "خطا في الدرجة",
              text:
                  this.$i18n.locale === "en"
                      ? "Mark Exceeded the Maximum Value"
                      : " الدرجة تخطت القيمة العظمي",
              showConfirmButton: false,
              timer: 3000,
            });
            //mark.value = null
          }


        });
      }

    },
    submit_grades() {

      ///////////////////////////////////////////////
      //check if marks is greater than maximaum or not
      let maximumFlag = false
      if (this.termCoursesMarks) {
        this.termCoursesMarks.forEach((mark) => {

          if (mark.value > mark.max) {
            maximumFlag = true
            this.$swal({
              icon: "error",
              title:
                  this.$i18n.locale === "en"
                      ? "Wrong In Mark"
                      : "خطا في الدرجة",
              text:
                  this.$i18n.locale === "en"
                      ? "Mark Exceeded the Maximum Value"
                      : " الدرجة تخطت القيمة العظمي",
              showConfirmButton: false,
              timer: 3000,
            });

          }

          //////////////////////////////////////////////
          /*  else
          {


                } */

        });
        if (maximumFlag == false) {
          let registrationMarks = [];

          if (this.termCoursesMarks) {
            this.termCoursesMarks.forEach((mark) => {
              let db = {};
              db.offering_mark_id = mark.offering_mark_id;
              db.registration_id = mark.registration_id;
              db.value = mark.value;

              registrationMarks.push(db);
            });
          }
          let payload = {
            registrationMarks: JSON.stringify(registrationMarks),
            registration: registrationMarks[0].registration_id,
          };
          this.UpdateStudentTermGrades(payload)
              .then((response) => {
                if (response.status && response.status === "success") {
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  this.finish_flag = 1
                  this.init();
                  this.grades_dialog = false;
                } else {
                }
              })
              .catch((error) => {
                let message =
                    error.response.data.errors.length > 0
                        ? error.response.data.errors[0].title
                        : this.$t("Global.errorMessage");
                this.$swal({
                  icon: "error",
                  text: message,
                  showConfirmButton: true,
                  timer: 3000,
                });
              });
        }
      }


    },
    saveStatus(index) {
      this.updateFilterQueryParams({tabNum: index});
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
    refresh(query) {
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },
    getColor(status) {
      if (status == "Draft") {
        return "light-warning";
      } else if (status == "Submitted") {
        return "light-success";
      } else if (status == "Reviewed") {
        return "light-info";
      } else if (status == "Approved") {
        return "light-dark";
      } else if (status == "Published") {
        return "light-primary";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>
