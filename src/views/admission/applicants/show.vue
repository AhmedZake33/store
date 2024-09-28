<template>
  <b-row>
    <b-col cols="12" xl="12" lg="8" md="7">
      <b-card>
        <b-row v-if="mainData">
          <b-col cols="21" xl="6" class="d-flex justify-content-between flex-column">
            <div class="d-flex justify-content-start">
              <b-avatar rounded size="104px" :text="avatarText(mainData.name)" v-if="mainData.photo_url" :src="mainData.photo_url" />
              <b-avatar rounded size="104px" :text="avatarText(mainData.name)" v-else />
              <div class="d-flex flex-column ml-1">
                <div v-if="mainData.name" class="mb-1">
                  <h4 class="mb-0" style="font-weight: bold">
                    {{ $i18n.locale == 'ar' ? mainData.name_local : mainData.name }}
                  </h4>

                  <span class="card-text">{{ mainData.email }}</span>
                </div>
                <!--                <div class="d-flex flex-wrap">-->
                <!--                  <a v-if="mainData.secret" :href="mainData.link" target="_blank">-->
                <!--                    <b-button v-b-tooltip.hover :title="$t('Global.edit')" style="width: 100px" v-if="hasPermission('edit_applicant')" variant="primary">{{ $t('Global.edit') }} </b-button>-->
                <!--                  </a>-->

                <!--                  <div v-if="mainData.removed != 2">-->
                <!--                    <b-button v-if="mainData.removed == 0 && hasPermission('delete_applicant')" id="show-btn" v-b-tooltip.hover style="width: 100px" :title="$t('Global.delete')" variant="outline-danger" class="ml-1" @click="remove(mainData.id)">-->
                <!--                      {{ $t('Global.delete') }}-->
                <!--                    </b-button>-->
                <!--                  </div>-->
                <!--                </div>-->
              </div>
            </div>
          </b-col>
          <b-col v-if="applicant" cols="12" xl="6">
            <table class="mt-2 mt-xl-0" style="width: 100%">
              <tr>
                <th class="pb-50 d-flex flex-wrap">
                  <feather-icon icon="UserIcon" class="mr-75" />
                  <span class="label">
                    {{ $t('Global.name') }}
                  </span>
                </th>
                <td v-if="mainData.name" class="pb-50">
                  {{ $i18n.locale == 'ar' ? mainData.name_local : mainData.name }}
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon icon="BookOpenIcon" class="mr-75" />
                  <span class="label">{{ $t(`Global.faculty`) }}</span>
                </th>
                <td class="pb-50">
                  <span v-if="mainData.status.id == 11">
                    {{ $i18n.locale == 'en' ? mainData.student.faculty.name : mainData.student.faculty.name_local }}
                  </span>
                  <span v-else>
                    <span v-if="mainData.faculty">
                      {{ $i18n.locale == 'en' ? mainData.faculty.name : mainData.faculty.name_local }}
                    </span>
                  </span>
                </td>
              </tr>

              <tr>
                <th class="pb-50">
                  <feather-icon icon="FlagIcon" class="mr-75" />
                  <span class="label">{{ $t(`Global.program`) }}</span>
                </th>
                <td class="pb-50">
                  <span v-if="mainData.status.id == 11">
                    {{ mainData.student.program? ($i18n.locale == 'en' ? mainData.student.program.name : mainData.student.program.name_local) : '_' }}

                  </span>
                  <span v-else>
                    <span v-if="mainData.program">
                      {{  mainData.program ? ($i18n.locale == 'en' ? mainData.program.name : mainData.program.name_local) : '_' }}

                    </span>
                  </span>
                </td>
              </tr>
              <tr v-if="mainData.birth_country">
                <th class="pb-50">
                  <feather-icon icon="FlagIcon" class="mr-75" />
                  <span class="label"> {{ $t('Global.country') }}</span>
                </th>
                <td class="pb-50" v-if="mainData.birth_country">
                  {{ $i18n.locale == 'en' ? mainData.birth_country.name || '-' : mainData.birth_country.name_local }}
                </td>
              </tr>
              <th v-if="mainData.mobile">
                <feather-icon icon="PhoneIcon" class="mr-75" />
                <span class="label"> {{ $t('Global.contact') }}</span>
              </th>
              <td>
                {{ mainData.mobile }}
              </td>
            </table>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12" xl="12" lg="8" md="7">
      <b-alert v-if="note" show dismissible fade variant="primary">
        <div class="alert-body">
          <span>{{ note }}</span>
        </div>
      </b-alert>
    </b-col>
    <b-col cols="12" xl="12" lg="8" md="7">
      <b-row v-if="mainData">
        <b-col cols="12">
          <list v-if="applicant" class="pb-0" :title="$t('Global.applicant')" :data="applicant" :only="[]" nopading :show-status="applicant" :loading="load">
            <template v-if="applicant.status && applicant.next_status && applicant.status.key != 'APPROVED'" #edit>
              <!-- <b-button-group size="sm " > -->
              <div>
                <b-button size="sm" class="ml-1" v-if="hasPermission('change_type_applicant') && applicant && applicant && applicant.status && applicant.status.id < 10" variant="info" @click="changeApplicantType($route.params.id)">
                  {{ applicant.admission_type && applicant.admission_type.id == 3 ? $t('Global.change_applicant_to_direct') : $t('Global.change_applicant_to_transfer') }}
                </b-button>
                <b-button size="sm" class="ml-1" v-if="hasPermission('change_applicant')" variant="warning" @click="showModal">
                  {{ $t('Global.change_status') }}
                </b-button>
                <b-button size="sm" class="ml-1" @click="resetStatus" v-if="hasPermission('reset_applicant') && applicant.status && applicant.status.key != 'SUBMITTED'" variant="primary">
                  {{ $t('Global.reset') }}
                </b-button>
                <b-button size="sm" class="disabled_all ml-1" @click="resetStatus" v-if="hasPermission('reset_applicant') && applicant.status && applicant.status.key == 'SUBMITTED'" variant="primary">
                  {{ $t('Global.reset') }}
                </b-button>
                <b-button size="sm" class="ml-1" v-if="applicant.removed == 0 && ((applicant.status.key != 'DISTRIBUATION_REQUIRED' && applicant.admission_type.id == 3) || applicant.admission_type.id != 3) && applicant.status.key == 'DISTRIBUATION_REQUIRED' && hasPermission('readyToPay_applicant')" variant="success" @click="changeStatus(3 , applicant.next_status.id)">
                  {{ $i18n.locale == 'ar' ? applicant.next_status.name_local : applicant.next_status.action }}
                </b-button>
                <b-button
                  size="sm"
                  class="ml-1"
                  v-if="
                    applicant.removed == 0 &&
                    applicant.status.key != 'REJECTED' &&
                    applicant.status.key != 'EXAM_FEES_REQUIRED'&&
                    applicant.status.key != 'EXAM_FAILS' &&
                    applicant.status.key != 'DISTRIBUATION_REQUIRED' &&
                    applicant.status.key != 'FINAL_FEES_REQUIRED' &&
                    applicant.status.key != 'REVIEWED' &&
                    applicant.status.key != 'APPROVED' &&
                    hasPermission('review_applicant')
                  "
                  variant="success"
                  @click="changeStatus(3,applicant.next_status.id )"
                >
                  {{ $i18n.locale == 'ar' ? applicant.next_status.name_local : applicant.next_status.action }}
                </b-button>
                <b-button
                  size="sm"
                  class="ml-1"
                  v-if="applicant.removed == 0 && applicant.status.key != 'FINAL_FEES_REQUIRED' && applicant.status.key != 'FEEDBACK' && applicant.status.key != 'REJECTED' && applicant.status.key != 'APPROVED' && hasPermission('feedback_applicant')"
                  variant="primary"
                  @click="toggleModal(2 , 4)"
                >
                  {{ $t('Global.send_feedback') }}
                </b-button>
                <b-button size="sm" class="ml-1" v-if="applicant.removed == 0 && applicant.status.key != 'FINAL_FEES_REQUIRED' && applicant.status.key != 'REJECTED' && applicant.status.key != 'APPROVED' && hasPermission('reject_applicant')" variant="danger" @click="toggleModal(0 , 12)">
                  {{ $t('Global.on_hold') }}
                </b-button>
                <b-button size="sm" class="ml-1" v-if="hasPermission('desires_applicant') && applicant.status.key != 'FINAL_FEES_REQUIRED'" variant="warning" @click="openAssignModel">
                  {{ $t('Global.change_preference') }}
                </b-button>
                <b-button size="sm" class="ml-1" v-if="applicant.removed == 0 && applicant.status.key == 'EXAM_REQUIRED' && hasPermission('fail_applicant')" variant="danger" @click="examFails(14)">
                  {{ $t('Global.adm_exam_fails') }}
                </b-button>
              </div>
              <!--                <b-button v-if="hasPermission('change_applicant')" variant="primary" @click="toggleModal(4)">-->
              <!--                  {{ $t('Global.message') }}-->
              <!--                </b-button>-->
              <!-- </b-button-group> -->
            </template>
          </list>
        </b-col>
      </b-row>
    </b-col>
    <b-col v-if="applicant" cols="12">
      <b-card class="mb-0">
        <b-tabs v-model="tabIndex" @input="saveStatus" lazy vertical nav-wrapper-class="nav-hidden" align="left">
          <b-tab>
            <template #title>
              <feather-icon icon="UserIcon" />
              <span>{{ $t('Global.personal_info') }}</span>
            </template>

            <!-- <hr/> -->
            <ShowComponent separator class="no_padding" v-if="applicant" :data="applicant" :loading="load" :only="['code', 'name', 'name_local', 'id', 'gender', 'birth_date', 'nationality', 'data']">
              <template #edit>
                <div class="mb-2">
                  <a v-if="mainData.secret" :href="getLink(mainData)" target="_blank">
                    <feather-icon v-b-tooltip.hover="$t('Global.edit')" style="cursor: pointer" icon="EditIcon" class="font-medium-3 mx-1" v-if="hasPermission('edit_applicant')" />
                  </a>
                  <feather-icon v-if="mainData.removed == 0 && hasPermission('delete_applicant')" icon="Trash2Icon" class="text-danger font-medium-3" v-b-tooltip.hover="$t('Global.delete')" style="width: 100px" @click="remove(mainData.id)" />
                </div>
              </template>
              <template #nationality="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.birth_country`) }}
                </th>
                <td v-if="$i18n.locale == 'en'" class="d-flex flex-wrap">
                  {{ data.nationality.nationality && data.nationality.birth_country ? data.nationality.birth_country.name : '-' }}
                </td>
                <td v-else class="d-flex flex-wrap">
                  {{ data.nationality.nationality && data.nationality.birth_country ? data.nationality.birth_country.name_local : '-' }}
                </td>
              </template>
              <template #gender="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.gender`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ data.gender ? $t(`Global.${data.gender_id}`) : '-' }}
                </td>
              </template>
              <template #data="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.birth_city`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ data.data ? data.data.birth_city : '-' }}
                </td>
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
              <template #admission_type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.admission_type`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <div>
                    {{ data.admission_type ? data.admission_type.name : '-' }}
                  </div>
                </td>
              </template>
            </ShowComponent>
            <ShowComponent separator class="no_padding" v-if="applicant && applicant.nationality" :data="applicant" :only="['nationality', 'nationalId', 'passport_number']" :loading="load">
              <template #nationality="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.nationality`) }}
                </th>
                <td v-if="$i18n.locale == 'en'" class="d-flex flex-wrap">
                  {{ data.nationality.nationality ? data.nationality.nationality.nationality : '-' }}
                </td>
                <td v-else class="d-flex flex-wrap">
                  {{ data.nationality.nationality ? data.nationality.nationality.nationality_local : '-' }}
                </td>
              </template>
              <template #birth_country="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.birth_country`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ $i18n.locale == 'en' ? data.birth_country.name : data.birth_country.name_local }}
                </td>
              </template>
              <template #passport_number="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.passport_number`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ data.passport_number ? data.passport_number : '-' }}
                </td>
              </template>
            </ShowComponent>
            <!-- <hr/> -->
            <ShowComponent separator class="no_padding" v-if="applicant" :data="applicant.data" :loading="load" :only="['mobile', 'phone', 'postal_code', 'city']">
              <template #nationality="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.birth_country`) }}
                </th>
                <td v-if="$i18n.locale == 'en'" class="d-flex flex-wrap">
                  {{ data.nationality.nationality ? data.nationality.birth_country.name : '-' }}
                </td>
                <td v-else class="d-flex flex-wrap">
                  {{ data.nationality.nationality ? data.nationality.birth_country.name_local : '-' }}
                </td>
              </template>
              <template #postal_code="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.address`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ applicant.data ? applicant.address + ',' + data.city + ',' : '-' }}
                  {{ data.postal_code || '-' }}
                </td>
              </template>
              <template #city="{ data }">
                <th v-if="applicant.data.same_address" scope="row" :width="'20%'">
                  {{ $t(`Global.permanent_address`) }}
                </th>
                <td v-if="applicant.data.same_address" class="d-flex flex-wrap">
                  <div v-if="data.permanent_address">
                    {{ data ? data.permanent_address + ',' + data.permanent_city + ',' + data.permanent_postal_code : '-' }}
                  </div>
                  <div v-else>-</div>
                </td>
              </template>
              <template #data="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.birth_city`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ data.data ? data.data.birth_city : '-' }}
                </td>
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
              <template #admission_type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.admission_type`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <div>
                    {{ data.admission_type ? data.admission_type.name : '-' }}
                  </div>
                </td>
              </template>
            </ShowComponent>
            <!-- <hr/> -->
            <ShowComponent v-if="applicant.data" :data="applicant.data" :only="['father_name', 'mother_name', 'guardian']" :loading="load">
              <template #father_name="{ data }">
                <th v-if="data" scope="row" :width="'30%'">
                  {{ $t(`Global.father`) }}
                </th>
                <td v-if="data.father_name" class="d-flex flex-wrap">
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.name') }} : </strong>{{ data.father_name ? data.father_name : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.phone') }} : </strong>{{ data.father_phone ? data.father_phone : '-' }}
                  </span>
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.email') }} : </strong>{{ data.father_email ? data.father_email : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.mail_address') }} : </strong>{{ data.father_mail_address ? data.father_mail_address : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.city') }} : </strong>{{ data.father_city ? data.father_city : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.postal_code') }} : </strong>{{ data.father_postal_code ? data.father_postal_code : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.occupation') }} : </strong>{{ data.father_job ? data.father_job : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.work_place') }} : </strong>{{ data.father_work_place ? data.father_work_place : '-' }}</span
                  >
                </td>
              </template>
              <template #mother_name="{ data }">
                <th v-if="data" scope="row" :width="'30%'">
                  {{ $t(`Global.mother`) }}
                </th>
                <td v-if="data.mother_name" class="d-flex flex-wrap">
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.name') }} : </strong>{{ data.mother_name ? data.mother_name : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.phone') }} : </strong>{{ data.mother_phone ? data.mother_phone : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.email') }} : </strong>{{ data.mother_email ? data.mother_email : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.mail_address') }} : </strong>{{ data.mother_mail_address ? data.mother_mail_address : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.city') }} : </strong>{{ data.mother_city ? data.mother_city : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.postal_code') }} : </strong>{{ data.mother_postal_code ? data.mother_postal_code : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.occupation') }} : </strong>{{ data.mother_job ? data.mother_job : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.work_place') }} : </strong>{{ data.mother_work_place ? data.mother_work_place : '-' }}</span
                  >
                </td>
              </template>
              <template #guardian="{ data }">
                <th v-if="data" scope="row" :width="'30%'">
                  {{ $t(`Global.parent`) }}
                </th>
                <td v-if="data" class="d-flex flex-wrap">
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.name') }} : </strong>{{ data.parent_name ? data.parent_name : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.phone') }} : </strong>{{ data.parent_phone ? data.parent_phone : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.email') }} : </strong>{{ data.parent_email ? data.parent_email : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.mail_address') }} : </strong>{{ data.parent_mail_address ? data.parent_mail_address : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.city') }} : </strong>{{ data.parent_city ? data.parent_city : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.postal_code') }} : </strong>{{ data.parent_postal_code ? data.parent_postal_code : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.occupation') }} : </strong>{{ data.parent_job ? data.parent_job : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.work_place') }} : </strong>{{ data.parent_work_place ? data.parent_work_place : '-' }}</span
                  >
                  <span class="w-100" v-if="data"
                    ><strong>{{ $t('Global.relationship') }} : </strong>{{ data.parent_relation ? data.parent_relation : '-' }}</span
                  >
                </td>
                <td v-else class="d-flex flex-wrap">-</td>
              </template>
            </ShowComponent>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="RotateCcwIcon" />
              <span>{{ $t('Global.pre_university_info') }}</span>
            </template>
            <ShowComponent
              v-if="applicant.data"
              :data="{ ...applicant.pre_university_certificate_info, ...getCustomData(applicant.data) }"
              :loading="load"
              :only="['pre_university_certificate_groupe', 'pre_university_certificate_type', 'year', 'school_name', 'math_degree', 'total_marks', 'max_marks', 'seat_number', 'same_address']"
            >
              <template #math_degree="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.subjects`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <div>
                    <span class="mx-1" v-for="sub in getSubjects(data, ['arabic', 'english', 'french', 'german', 'italy', 'biology', 'chemistry', 'math', 'physics'])">
                      <b-badge pill variant="primary" class="text-capitalize">
                        {{ sub }}
                      </b-badge>
                    </span>
                  </div>
                </td>
              </template>
              <template #same_address="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.percentage`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <div>
                    {{ getTotal(applicant.data) }}
                  </div>
                </td>
              </template>
              <template #year="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.qualification_date`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <div>
                    {{ data.year }}
                    <!--                                        {{ toLocalYear(data.qualification_date)}}-->
                  </div>
                </td>
              </template>
              <template #pre_university_certificate_type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.pre_university_certificate_type`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <div>
                    {{ $i18n.locale == 'en' ? data.pre_university_certificate_type.name : data.pre_university_certificate_type.name_local }}
                  </div>
                </td>
              </template>
              <template #pre_university_certificate_groupe="{ data }">
                <th v-if="data && data.pre_university_certificate_groupe && data.pre_university_certificate_groupe.name == 'Degree Inside Egypt'" scope="row" :width="'20%'">
                  {{ $t(`Global.high_school_egypt`) }}
                </th>
                <th v-if="data && data.pre_university_certificate_groupe && data.pre_university_certificate_groupe.name != 'Degree Inside Egypt'" scope="row" :width="'20%'">
                  {{ $t(`Global.high_school_out`) }}
                </th>

                <td v-if="data && data.pre_university_certificate_groupe" class="d-flex flex-wrap">
                  <div>
                    {{ $i18n.locale == 'en' ? data.pre_university_certificate.name : data.pre_university_certificate.name_local }}
                  </div>
                </td>
              </template>
            </ShowComponent>
          </b-tab>

          <b-tab v-if="applicant.admission_type == null || applicant.admission_type && applicant.admission_type.id >= 3  && applicant.previous_university_info">
            <template #title>
              <feather-icon icon="MonitorIcon" />
              <span>{{ $t('Previous University Info') }}</span>
            </template>
            <ShowComponent v-if="applicant.previous_university_info" :data="{ ...applicant.previous_university_info, ...getCustomData(applicant.previous_university_info) }" :loading="load">
              <template #bylaw_type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.bylaw_type`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <div>
                    {{ applicant.previous_university_info.bylaw_type == true ? $t('Global.credit_hours') :  $t('Global.semester_base') }}
                  </div>
                </td>
              </template>
              <template #previous_university_country="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.previous_university_country`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <span v-if="$i18n.locale == 'en'">
                    {{ data.previous_university_country.name || data.previous_university_country.name_local }}
                  </span>
                  <span v-if="$i18n.locale == 'ar'">
                    {{ data.previous_university_country.name_local || data.previous_university_country.name }}
                  </span>
                </td>
              </template>

              <template #link="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.COURSE_DESCRIPTIONS_LINK`) }}
                </th>

                <td v-if="data" class="d-flex flex-wrap">
                  <a v-if="data && data.link" :href="data && data.link" target="_blank">
                    {{ $t('Global.COURSE_DESCRIPTIONS_LINK') }}
                  </a>
                  <span v-else>{{ '-' }}</span>
                </td>
              </template>
            </ShowComponent>

            <h5 v-if="applicant.admission_type && applicant.admission_type.id == 3  && applicant.previous_university_info" class="ml-2 mt-0 text-secondary">{{ $t('Previous Courses') }}</h5>
            <TabTable v-if="applicant.admission_type && applicant.admission_type.id == 3  && applicant.previous_university_info" class="m-2" no-details head :items="applicant.previous_applicant_course" :fields="coursesFields" />
          </b-tab>

          <b-tab v-if="applicant.admission_type && applicant.admission_type.id == 3 && applicant.previous_university_info">
            <template #title>
              <feather-icon icon="ActivityIcon" />
              <span>{{ $t('Global.Course Equivalency') }}</span>
            </template>
            <!-- :class="Equload || courseload ? 'disabled_all':''" -->
            <!-- <div
              v-if="hasPermission('admin_system')"
              class="d-flex justify-content-end align-items-center"
            > -->
              <!-- <div class="mb-2" v-if="!equivalenceEdit">
                <feather-icon
                  @click="
                    (e) => {
                      editMode('equivalence_info');
                    }
                  "
                  v-if="hasPermission('edit_student')"
                  style="cursor: pointer"
                  icon="EditIcon"
                  class="font-medium-3 text-primary"
                  v-b-tooltip.hover="$t('Global.edit')"
                />
              </div> -->
              <!-- <edit
                :editModeVersion="EditModeData"
                :avalibleCourses="avalibleCourses"
                :isSemesterBased="isSemesterBased"
                @closeEditMode="closeEditMode"
              /> -->
            <!-- </div> -->
            <equivalent @Refresh="refresh" :status="applicant && applicant.status" :applicant_id="Number(applicant.transfer_request_id)">
            </equivalent>
          </b-tab>

          <b-tab>
            <template #title>
              <feather-icon icon="CommandIcon" />
              <span>{{ $t('Global.preferences') }}</span>
            </template>

            <b-card v-if="applicant.desires && applicant.desires.desire_one && applicant.desires.desire_one.faculty" class="border">
              <b-row class="d-flex justify-content-between px-2">
                <div class="d-flex flex-column">
                  <strong v-if="$i18n.locale == 'en'">
                    {{ applicant.desires.desire_one.faculty.name || applicant.desires.desire_one.faculty.name_local }}
                  </strong>
                  <strong v-if="$i18n.locale == 'ar'">
                    {{ applicant.desires.desire_one.faculty.name_local || applicant.desires.desire_one.faculty.name }}
                  </strong>
                  <span v-if="applicant.desires.desire_one.program"> {{ applicant.desires.desire_one.program.name || applicant.desires.desire_one.program.name_local }}</span>
                </div>
                <div v-if="applicant.status && applicant.status.key != 'APPROVED'">
                  <div v-if="applicant.status && applicant.status.key != 'APPROVED'">
                    <b-badge v-if="applicant.faculty && applicant.desires.desire_one.faculty.id == applicant.faculty.id" active pill :variant="`light-primary`">
                      {{ $t('Global.DISTRIBUATION_REQUIRED') }}
                      <span v-if="applicant.desires.desire_one.program_setting.quota"> ( {{ applicant.desires.desire_one.program_setting.count }} /{{ applicant.desires.desire_one.program_setting.quota }} ) </span>
                      <span v-else> ( {{ applicant.desires.desire_one.setting.count }} /{{ applicant.desires.desire_one.setting.quota }} ) </span>
                    </b-badge>
                    <b-button
                      v-else-if="hasPermission('distribute_applicant') && applicant.status.key == 'REVIEWED'"
                      type="submit"
                      variant="success"
                      class="mr-1"
                      @click="acceptDesire(applicant.desires.desire_one.faculty.id, applicant.desires.desire_one.program ? applicant.desires.desire_one.program.id : null)"
                    >
                      {{ $t('Global.assign') }}
                      <span v-if="applicant.desires.desire_one.program_setting.quota">
                        <!--                        {{ $t('Global.program') }}-->
                        ( {{ applicant.desires.desire_one.program_setting.count }} /{{ applicant.desires.desire_one.program_setting.quota }} )
                      </span>

                      <span v-else> ( {{ applicant.desires.desire_one.setting.count }} /{{ applicant.desires.desire_one.setting.quota }} ) </span>
                    </b-button>
                  </div>
                </div>
              </b-row>
            </b-card>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="Link2Icon" />
              <span>{{ $t('Global.documents') }}</span>
            </template>

            <!--            <b-row v-if="applicant">-->
            <!--              &lt;!&ndash; latest photo loop &ndash;&gt;-->
            <!--              <b-col v-for="document in applicant.documents" :key="document.url" md="4" cols="6">-->
            <!--                <div v-if="document.url" class="profile-latest-img">-->
            <!--                  <b-card class="border">-->
            <!--                    <a class="mb-2" fluid rounded target="_blank" :href="document.url" :alt="document.url.slice(5)">-->
            <!--                      {{ document.short_name }}-->
            <!--                    </a>-->
            <!--                  </b-card>-->
            <!--                </div>-->
            <!--                <div v-else class="profile-latest-img">-->
            <!--                  <b-card class="border">-->
            <!--                    <b-card-body class="cursor-pointer align-items-center flex-column d-flex justify-content-center align-content-center" @click="uploadFile()">-->
            <!--                      <span>-->
            <!--                        {{ document.short_name }}-->
            <!--                      </span>-->
            <!--                      <feather-icon v-if="!$store.state.app.load" size="4.5x" icon="PlusCircleIcon" />-->
            <!--                      <div v-else style="text-align: center">-->
            <!--                        <b-spinner :label="$t('Global.loading')" />-->
            <!--                      </div>-->
            <!--                      <input id="refInput" type="file" class="d-none" />-->
            <!--                    </b-card-body>-->
            <!--                  </b-card>-->
            <!--                </div>-->
            <!--              </b-col>-->

            <!--              &lt;!&ndash; latest photo loop &ndash;&gt;-->
            <!--            </b-row>-->
            <Archive v-if="applicant" :list="true" :parent="applicant.archive_id != null ? applicant.archive_id : null" :action_show="false" :profile="true" :breadcrumb="false" :student-show="true" :allow-search="false" />
          </b-tab>
          <b-tab>
            <TabTable
              no-details
              head
              payments
              v-if="rerender && (applicant.status.key == 'EXAM_FAILS' || applicant.status.key == 'INCOMPLETE' || applicant.status.key == 'FINAL_FEES_REQUIRED' || applicant.status.key == 'EXAM_FEES_REQUIRED') && applicant.payments"
              class="mt-2"
              :loading="load"
              @openManualPayDialog="openDialog"
              :fields="paymentsFields"
              :items="applicant && applicant.payments ? applicant.payments : []"
              >
              <!-- @getCheck="getInstallmentTotal" -->
              <!-- <template #paymentTitle>
                <div class="mx-2 my-1">
                  <h3 class="m-0">
                    {{ InstallmentTotal ? $t('Global.amount') + ' : ' + (InstallmentTotal - applicant.payments.paid) : $t('Global.amount') + ' : -' }}
                    <span v-if="applicant.payments.currency">
                      -
                      {{ $i18n.locale == 'ar' ? applicant.payments.currency.name_local : applicant.payments.currency.name }}
                    </span>
                  </h3>
                </div>
              </template> -->
              <template #edit>
                <div>
                  <!-- <b-button variant="primary" v-if="hasPermission('edit_payment')" @click="openDialog(applicant.payments)">{{ $t('Global.manual_payment') }} </b-button> -->
                </div>
              </template>
            </TabTable>
            <template #title>
              <feather-icon icon="DollarSignIcon" />
              <span>{{ $t('Global.payments') }}</span>
            </template>
            <Payments :applicant="true" :showCurrency="applicant && applicant.nationality && applicant.nationality.nationality && applicant.nationality.nationality.id == 64" no-status :user_id="userId" inline :applicant_id="id" :faculty_id="applicant.desires && applicant.desires.desire_one && applicant.desires.desire_one.faculty ? applicant.desires.desire_one.faculty.id : null" @render="init" />
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="RefreshCcwIcon" />
              <span>{{ $t('Global.logs') }}</span>
            </template>

            <history :items="applicant.logs"></history>
          </b-tab>
          <b-tab v-if="hasPermission('show_subjects')">
            <template #title>
              <feather-icon icon="HelpCircleIcon" />
              <span>{{ $t('Global.supplementary_subjects') }}</span>
            </template>
            <b-card>
              <supplementarySubjects @refresh="refresh" :data="applicant.supplementary_subjects"></supplementarySubjects>
            </b-card>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="MessageCircleIcon" />
              <span>{{ $t('Global.communication') }}</span>
            </template>
            <b-card>
              <Messages v-if="applicant.chat" :chat_id="applicant.chat.id" :sent_to="userId"></Messages>
            </b-card>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-col>
    <b-modal no-close-on-backdrop ref="my-modal" v-model="modalShow" hide-footer :title="$t('Global.note')">
      <div class="demo-vertical-spacing">
        <validation-observer ref="ruleForm">
          <b-form>
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.message')" label-for="Message">
                <validation-provider #default="{ errors }" name="Message" :rules="'required'">
                  <b-form-textarea v-model="form.message" :state="errors.length > 0 ? false : null" type="number" />
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-form>
        </validation-observer>
      </div>
      <div class="mt-2">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" class="mr-1" @click="changeStatus(type ,status)">
              {{ $t('Global.send') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="hideModal">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
    <b-modal no-close-on-backdrop ref="my-modal" v-model="statusModal" hide-footer :title="$t('Global.change_status')">
      <div class="demo-vertical-spacing">
        <validation-observer ref="ruleForm">
          <b-form>
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.status')" label-for="Message">
                <validation-provider #default="{ errors }" name="Message" :rules="'required'">
                  <!--                                    {{lookups}}-->
                  <!--                                    <b-form-textarea v-model="form.message" :state="errors.length > 0 ? false : null" type="number"/>-->
                  <v-select v-model="status_form.status" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="applicant_status" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.status')">
                    <template slot="selected-option" slot-scope="option">
                      <span v-if="$i18n.locale == 'ar'">
                        {{ option.name_local || option.name }}
                      </span>
                      <span v-else>
                        {{ option.name || option.name_local }}
                      </span>
                    </template>
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-form>
        </validation-observer>
      </div>
      <div class="mt-2">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" class="mr-1" @click="changeStatus(3)">
              {{ $t('Global.send') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="hideModal">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
    <b-modal ref="my-modal" no-close-on-backdrop v-model="paymentModel" :title="$t('Global.payment_info')" size="lg">
      <validation-observer ref="simpleRules">
        <b-form :class="loading ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="6">
              <b-form-group :label="$t('Global.amount')" label-for="first_instalment">
                <validation-provider #default="{ errors }" name="amount" rules="required">
                  <b-form-input v-model="ruleForm.amount" type="number" :state="errors.length > 0 ? false : null" />
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.pay_number')" label-for="pay_number">
                <validation-provider #default="{ errors }" name="pay_number" rules="required">
                  <b-form-input v-model="ruleForm.payment_number" type="number" :state="errors.length > 0 ? false : null" />
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.due_date')" label-for="end-input">
                <validation-provider #default="{ errors }" name="end_date" rules="required">
                  <b-form-datepicker id="end-input" :date-format-options="{ year: 'numeric', month: 'long', day: 'numeric' }" :locale="$i18n.locale == 'ar' ? 'ar' : 'en'" v-model="ruleForm.pay_date" :state="errors.length > 0 ? false : null" />
                  <small v-if="errors.length" class="text-danger">
                    {{ validation(null, 0).message }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.file')" label-for="code-input">
                <b-form-file v-model="ruleForm.file" :placeholder="$t('Global.paymentFile')" drop-placeholder="Drop file here..." />
              </b-form-group>
              <!-- <div class="mt-3">{{$t('Global.selected_file')}} {{ form.file ? form.file.name : '' }}
                                                                      </div> -->
            </b-col>
            <b-col md="12">
              <b-form-group :label="$t('Global.account')" v-if="banks" label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="bank" rules="required">
                  <v-select v-model="ruleForm.bank_id" :class="errors.length > 0 ? 'custom_invalid' : ''" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="banks ? banks : []" :clearable="false" input-id="code-input" :reduce="val => val.id">
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                      <span v-if="option.account_number"> ({{ option.account_number }}) </span>
                    </template>
                    <template #selected-option="{ name, name_local, account_number }">
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'"
                          >{{ name_local }}
                          <span>({{ account_number }})</span>
                        </strong>
                        <strong v-else
                          >{{ name }}
                          <span> ({{ account_number }}) </span>
                        </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="loading ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button type="submit" variant="primary" class="mr-1" @click="submit">
              {{ $t('Global.save') }}
              <!-- {{ uploadProgress && ruleForm.file ? uploadProgress + '%' : '' }} -->
            </b-button>
            <b-button type="reset" variant="outline-secondary" @click="paymentModel = false">
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal  size="lg" ref="my-modal" v-model="assignModal" hide-footer no-close-on-backdrop :title="$t('Global.change_preference')">
      <div class="demo-vertical-spacing">
        <validation-observer ref="ruleForm">
          <b-form>
            <b-col cols="12" md="12">
              <b-form-group label-for="Message" v-if="lookups">
                <validation-provider #default="{ errors }" name="Message" :rules="'required'">
                  <v-select v-model="assignForm.program_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.programs" class="w-100 mb-2" :reduce="val => val.id" :placeholder="$t('Global.program')">
                    <template slot="selected-option" slot-scope="option">
                      <span>
                        {{  option.bylaw? $i18n.locale == 'ar' ? '(' +option.bylaw.name_local + ')':'(' +option.bylaw.name + ')':null  }}  {{ $i18n.locale == 'ar' ? option.name_local  : option.name }}
                      </span>
                    </template>
                    <template v-slot:option="option">
                      {{  option.bylaw? $i18n.locale == 'ar' ? '(' +option.bylaw.name_local + ')':'(' +option.bylaw.name + ')':null  }} {{ $i18n.locale == 'ar' ? option.name_local  : option.name   }}
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-form>
        </validation-observer>
      </div>
      <div class="mt-2">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button type="submit" variant="primary" class="mr-1" @click="changeDesireAction">
              {{ $t('Global.ok') }}
            </b-button>
            <b-button type="reset" variant="outline-primary" @click="assignModal = false">
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { BTabs, BTab, BCard, BFormInput, BCol, BFormDatepicker, BFormFile, BRow, BBadge, BAlert, BLink, BAvatar, BCardBody, BButtonGroup, BButton, BModal, BInputGroup, BFormTextarea, BImg, BFormGroup, BForm } from 'bootstrap-vue';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, email } from '@validations';
import vSelect from 'vue-select';
import List from '@/views/components/info/list';
import ShowComponent from '@/views/components/info/show';
import Archive from '@/views/administration/archive/components/archive';
import Payments from '@/views/students/payments/components/payments';
import TabTable from '@/views/students/student/components/TabTable';
import History from '@/views/admission/components/history';
import Messages from '@/views/Requests/chat/componets/messages';
import supplementarySubjects from '@/views/admission/applicants/components/supplementarySubjects';
import equivalent from "@/views/admission/TransferStudents/equivalent.vue"
import { bus } from "@/views/students/student/StudentBus";
import edit from "@/views/students/student/edit";


export default {
  name: 'Show',
  components: {
    Messages,
    edit,
    supplementarySubjects,
    History,
    Payments,
    Archive,
    vSelect,
    TabTable,
    List,
    BTabs,
    BTab,
    BCard,
    BCol,
    BRow,
    BBadge,
    BAlert,
    BLink,
    BCardBody,
    BFormFile,
    BAvatar,
    BButtonGroup,
    BButton,
    BFormInput,
    BImg,
    BModal,
    BFormDatepicker,
    BInputGroup,
    BFormTextarea,
    BFormGroup,
    BForm,
    ShowComponent,
    ValidationProvider,
    ValidationObserver,
    localize,
    equivalent
  },
  data() {
    return {
      enableEditMode: false,
      editModeVersion: "",
      form: {},
      banks:null,
      applicant_status:null,
      tabIndex: 0,
      equivalenceEdit: false,
      rerender: true,
      status_form: {},
      assignForm: {},
      ruleForm: {
        amount: null,
        file: null,
        payment_number: null,
        pay_date: null,
        bank_id: null,
      },
      link: '',
      note: '',
      modalShow: false,
      statusModal: false,
      assignModal: false,
      type: null,
      is_mail: false,
      paymentModel: null,
      file: null,
      loading: false,
      selected_payment_id:null,
      status:null
    };
  },
  created() {
    bus.$on("closeEditMode", (data) => {
      this.enableEditMode = false;
      this.equivalenceEdit = false;
      this.init();
    });
  },
  computed: {
    ...mapGetters({
      applicant: 'applicants/item',
      load: 'applicants/load',
      role: 'roles/userRoles',
      lookups: 'applicants/lookups',
      uploadProgress: 'app/uploadProgress',
    }),
    isEditMode() {
      return this.enableEditMode;
    },
    EditModeData() {
      return this.editModeVersion;
    },
    InstallmentTotal(data) {
      if (data && data.length) {
        data[1].checked = data[0];
      }
      if (this.applicant?.payments?.installments.length) {
        let array = this.applicant?.payments?.installments?.filter(el => el.checked);
        let amounts = array.map(el => el.amount);
        const reducer = (accumulator, curr) => accumulator + curr;
        return amounts.reduce(reducer);
      } else {
        return false;
      }
    },
    userId() {
      return this.applicant ? this.applicant.user.id : null;
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    payment_id() {
      return this.selected_payment_id ? this.selected_payment_id : null;
    },
    mainData() {
      if (this.applicant) {
        this.note = this.applicant.note;
        return this.applicant;
      }
      return false;
    },
    paymentsFields() {
      return [
        { key: 'service', label: this.$t('Global.name') },
        { key: 'amount', label: this.$t('Global.amount') },
        { key: 'due_date', label: this.$t('Global.due_date') },
        { key: 'currency', label: this.$t('Global.currency') },
        { key: 'status', label: this.$t('Global.status') },
        {
          key: 'selected',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
    },
    coursesFields() {
      if (this.applicant.previous_university_info.bylaw_type == false) {
        return [
          {
            key: 'code',
            label: this.$t('code'),
            sortable: false,
          },
          {
            key: 'title',
            label: this.$t('name'),
            sortable: false,
          },
          {
            key: 'description',
            label: this.$t('Description'),
            thStyle: { width: '40%' },
            sortable: false,
          },
          {
            key: 'tutorial_hours',
            label: this.$t('tutorial_hours'),
            sortable: false,
          },
          {
            key: 'laboratory_hours',
            label: this.$t('laboratory_hours'),
            sortable: false,
          },
          {
            key: 'lecture_hours',
            label: this.$t('lecture_hours'),
            sortable: false,
          },
          {
            key: 'total',
            label: this.$t('Mark'),
            sortable: false,
          },
          {
            key: 'max_total',
            label: this.$t('Global.max_mark'),
            sortable: false,
          },
        ];
      } else {
        return [
          {
            key: 'code',
            label: this.$t('code'),
            sortable: false,
          },
          {
            key: 'title',
            label: this.$t('name'),
            sortable: false,
          },
          {
            key: 'description',
            label: this.$t('Description'),
            thStyle: { width: '40%' },
            sortable: false,
          },
          {
            key: 'credit_hours',
            label: this.$t('Global.credit_hours'),
            sortable: false,
          },
          {
            key: 'grade',
            label: this.$t('Grade'),
            sortable: false,
          },
        ];
      }
    },
  },
  beforeMount() {
    if (this.$route.query) {
      this.tabIndex = Number(this.$route.query.tabNum);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    closeEditMode() {
      this.enableEditMode = false;
      bus.$emit("closeEditMode", false);
    },
    editMode(editpage) {
       if (editpage == "equivalence_info") {
        this.equivalenceEdit = true;
      }
      this.editModeVersion = editpage;
      this.enableEditMode = !this.enableEditMode;
      // this.$router.push({ name: 'student-edit', params: { id: this.id, details: editpage } })
    },
    saveStatus(index) {
      this.updateFilterQueryParams({ tabNum: index, ...this.getTabFilterData(index) });
    },
    changeApplicantType(){
      this.loading = true;
          this.$store
            .dispatch('applicants/changeApplicantType', this.id)
            .then(response => {
              this.loading = false;
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.refresh();
            })
            .catch(error => {this.loading = false});
    },
    getLink(item) {
      if (item.admission_type && item.admission_type.id >= 4) {
        let text = item.link;
        let link = text.replace('admissionForm', 'admissionForm');
        if(this.$store.state.appConfig.layout.isRTL){
          link = text.replace('/en', '/ar');
        }
        return link;
      } else {
        let text = item.link;
        if(this.$store.state.appConfig.layout.isRTL){
          text = text.replace('/en', '/ar');
        }
        if(item && item.status && item.status.key == 'SUBMITTED'){
          return text+'?staff='+Date.now();
        }else{
          return text;
        }
      }
    },
    getInstallmentTotal(data) {
      if (data && data.length) {
        data[1].show = true;
        data[1].checked = data[0];
      }
    },
    upload(e) {
      this.file = e.target.files[0];
    },
    submit() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const formData = new FormData();
          for (const [key, value] of Object.entries(this.ruleForm)) {
            if (value) {
              formData.append(key, value);
            }
          }
          formData.append('payment_id', this.payment_id);
          if (this.id) {
            formData.append('applicant_id', this.id);
          }
          this.loading = true;
          this.$store
            .dispatch('payments/putTransaction', { query: formData, id: null })
            .then(response => {
              this.paymentModel = false;
              this.loading = false;
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.refresh();
              //   this.$emit('hide');
            })
            .catch(error => {});
        }
      });
    },
    openDialog(data) {
      this.selected_payment_id  = data.id
      if (data?.installments.length == 0) {
        this.ruleForm.amount = data.amount ? data.amount - data.paid : null;
      }else{
        let array = data?.installments?.filter(el => el.checked);
        if (array.length == 0) {
          return data.amount
        } else {
          let amounts = array.map(el => el.amount);
          const reducer = (accumulator, curr) => accumulator + curr;
          this.ruleForm.amount = data.amount ? amounts.reduce(reducer) - data.paid : null;
        }
      }
      this.paymentModel = true;
    },
    getTotal(data) {
      let total = (data.total_marks / data.max_marks) * 100;
      if (total) {
        return total.toFixed(2) + '%';
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
    uploadFile() {
      const fileUpload = document.getElementById('refInput');
      if (fileUpload != null) {
        fileUpload.click();
      }
    },
    getCustomData(data) {
      delete data['pre_university_certificate_groupe'];
      delete data['pre_university_certificate_type'];
      delete data['pre_university_certificate'];
      if(this.applicant.admission_type && this.applicant.admission_type.id == 4  && this.applicant.previous_university_info){
        delete data['master_year'];
        delete data['name_previous_faculty_master'];
        delete data['name_previous_program_master'];
        delete data['name_previous_university_master'];
      }
      return data;
    },
    openAssignModel() {
      this.assignForm = {};
      if (this.applicant.desires && this.applicant.desires.desire_one && this.applicant.desires.desire_one.program) {
        this.assignForm.program_id = this.applicant.desires.desire_one.program.id;
      }
      this.assignModal = true;
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
          this.removeApplicant(id).then(_ => {
            this.refresh();
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            });
          });
        }
      });
    },
    refresh(query) {
      query = { ...query, type: this.type };
      this.$store.dispatch('applicants/get', this.id);
    },
    hideModal() {
      this.modalShow = false;
      this.statusModal = false;
      this.type = null;
    },
    toggleModal(type , status = null) {
      this.form = {};
      this.type = type;
      this.is_mail = type == 4 ? true : false;
      this.status = status;
      this.modalShow = true;
    },
    showModal() {
      this.form = {};
      this.type = 3;
      this.statusModal = true;
    },
    ...mapActions({
      changeApplicantStatus: 'applicants/changeStatus',
      removeApplicant: 'applicants/remove',
      acceptApplicantDesire: 'applicants/acceptDesire',
      changeDesire: 'applicants/changeDesire',
      getLookups: 'applicants/lookups',
    }),
    init() {
      this.getLookups({applicant_id:this.$route.params.id,query :{ applicant_status: true, banks: true }}).then(data => {
        this.banks = data?.success?.banks ? data.success.banks :[];
        this.applicant_status = data?.success?.applicant_status ? data.success.applicant_status :[];
        this.$store.dispatch('applicants/get', this.id).then(_ => {
          if (this.applicant.desires && this.applicant.desires.desire_one && this.applicant.desires.desire_one.faculty) {
            this.getLookups({applicant_id:this.$route.params.id,query:{
              faculty_id_programs: this.applicant.desires.desire_one.faculty.id,
              allow_programs: this.applicant.admission_type.id == 3 ? false : true,
              applicant_status: true,
              banks: true,
            }});
          }
        });
      });
    },

    changeDesireAction() {
      this.$swal({
        title: `${this.$t('Global.confirmMessage')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.confirm')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          let payload = { id: this.id, query: this.assignForm };
          this.changeDesire(payload).then(_ => {
            this.assignForm = {};
            this.assignModal = false;
            this.init();
          });
        }
      });
    },

    resetStatus(action) {
      this.$swal({
        title: `${this.$t('Global.confirmMessage')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.confirm')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          const payload = {
            id: this.id,
            query: {
              flag: 4,
              status: 2,
            },
          };
          this.changeApplicantStatus(payload).then(_ => {
            this.form = {};
          });
          this.hideModal();
          this.init();
        }
      });
    },
    examFails(type){
      this.$swal({
        title: `${this.$t('Global.confirmMessage')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.confirm')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          const payload = {
              id: this.id,
              query: {
                flag: 3,
                status: type
              },
            };
          this.changeApplicantStatus(payload).then(_ => {
          });
          this.init();
        }
      })
    },
    changeStatus(action , status = null) {
      this.$swal({
        title: `${this.$t('Global.confirmMessage')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.confirm')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          if (this.type == null) {
            const payload = {
              id: this.id,
              query: {
                flag: action,
                status: status?status:null,
                message: this.form ? this.form.message : null,
              },
            };
            this.changeApplicantStatus(payload).then(_ => {
              this.form = {};
            });
            this.hideModal();
            this.init();
          } else {
            this.$refs.ruleForm.validate().then(success => {
              if (success) {
                let payload = {};
                if (action == 3) {
                  payload = {
                    id: this.id,
                    query: {
                      flag: action,
                      status: this.status_form ? this.status_form.status : null,
                    },
                  };
                } else {
                  payload = {
                    id: this.id,
                    query: {
                      flag: action,
                      mail: this.is_mail,
                      message: this.form ? this.form.message : null,
                      status: status?status:null,
                    },
                  };
                }
                this.changeApplicantStatus(payload).then(_ => {
                  this.form = {};
                });
                this.hideModal();
                this.init();
              }
            });
          }
        }
      });
    },

    acceptDesire(faculty, program) {
      const payload = {
        id: this.id,
        query: { faculty_id: faculty, program_id: program },
      };
      this.acceptApplicantDesire(payload).then(_ => {
        this.init();
      });
    },
  },
  watch: {
    // 'ruleForm.amount'(newVal, oldVal) {
    //   if (this.applicant?.payments?.installments.length) {
    //     let array = this.applicant?.payments?.installments;
    //     let amounts = array.map(el => el.amount);
    //     const reducer = (accumulator, curr) => accumulator + curr;
    //     if (newVal > amounts.reduce(reducer)) {
    //       this.ruleForm.amount = null;
    //     }
    //   }
    // },
    '$i18n.locale'(val) {
      this.rerender = false;
      setTimeout(() => {
        this.rerender = true;
      }, 50);
    },
  },
};
</script>

<style lang="scss">
.no_padding .card {
  padding-bottom: 0;
  margin-bottom: 0;
}
</style>
