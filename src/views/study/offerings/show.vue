<template>
  <div
    v-if="
      hasPermission('show_offering') &&
      item &&
      getCourseDetails &&
      getCourseOfferingDetails
    "
  >
    <b-overlay :show="load" rounded="sm" no-fade>
      <div title="" :aria-hidden="show ? 'true' : null">
        <div v-if="item && getCourseDetails && getCourseOfferingDetails">
          <b-col cols="12" xl="12" lg="8" md="7" class="p-0">
            <b-card>
              <div
                class="custom_actions"
                v-if="hasPermission('export_offeringReport')"
              >
                <b-dropdown
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  :text="$t('Global.more')"
                  right
                  size="sm"
                  variant="outline-primary"
                >
                  <b-dropdown-item @click="exportSpecs('PDF')">
                    {{ $t("Global.Export course report PDF") }}
                  </b-dropdown-item>
                  <b-dropdown-item @click="exportSpecs('word')">
                    {{ $t("Global.Export course report word") }}
                  </b-dropdown-item>
                  <b-dropdown-item
                    :class="load ? 'disabled_all' : ''"
                    v-if="hasPermission('auto_fill_offeringReport')"
                    @click="autoFill"
                  >
                    {{ $t("Global.autoFill") }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <b-row v-if="item">
                <b-col
                  cols="21"
                  xl="6"
                  class="d-flex justify-content-between flex-column p-0"
                >
                  <div class="d-flex justify-content-start">
                    <div class="d-flex flex-column ml-1">
                      <div v-if="item.term" class="mb-1">
                        <h4 class="mb-0" style="font-weight: bold">
                          {{
                            $i18n.locale == "ar" && item.course
                              ? item.course.name_local
                              : item.course.name
                          }}
                        </h4>

                        <span class="card-text d-block">{{
                          item.course && item.course.code
                            ? item.course.code
                            : ""
                        }}</span>
                      </div>
                    </div>
                  </div>
                </b-col>
                <b-col v-if="item" cols="12" xl="6">
                  <table class="mt-2 mt-xl-0" style="width: 100%">
                    <tr>
                      <th class="pb-50 d-flex flex-wrap align-items-center">
                        <feather-icon icon="InfoIcon" class="mr-75" />
                        <span class="label">
                          {{ $t("Global.term") }}
                        </span>
                      </th>
                      <td v-if="item.term" class="pb-50">
                        {{
                          $i18n.locale == "ar"
                            ? item.term.name_local
                            : item.term.name
                        }}
                      </td>
                    </tr>
                    <!-- <tr>
                                            <th class="pb-50">
                                                <feather-icon icon="BookOpenIcon" class="mr-75"/>
                                                <span class="label">{{ $t(`Global.code`) }}</span>
                                            </th>
                                            <td class="pb-50">
                              <span v-if="item.course">
                                {{ item.course ? item.course.code:'' }}
                              </span>
                                            </td>
                                        </tr> -->

                    <tr>
                      <th class="pb-50">
                        <feather-icon icon="FlagIcon" class="mr-75" />
                        <span class="label">{{
                          $t(`Global.control_status`)
                        }}</span>
                      </th>
                      <td class="pb-50">
                        <span v-if="item.status">
                          {{
                            $i18n.locale == "ar" && item.status
                              ? item.status.name_local
                              : item.status.name
                          }}
                        </span>
                        <span v-else> - </span>
                      </td>
                    </tr>
                  </table>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
          <b-card class="mb-0 custom_columns w-70">
            <!-- <div v-if="(params.status==5 || $route.query.inline)&& nameTitle=='edit_course_offering'">
                            <b-card-header
                              class="flex-wrap text-initial mx-1_3"
                              style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0.5rem;
                                padding-left: 0rem;
                              "
                            >
                              <div

                                class=" d-flex align-items-center"
                              >
                                <feather-icon

                                  icon="EditIcon"
                                  size="16"
                                />

                                <strong class="mx-1">
                                  {{ $t("Global.edit_course_offering") }}
                                </strong>
                                <slot name="status" />
                              </div>
                            </b-card-header>
                            <hr class="mt-0">
                        </div>
                        <div v-else-if="nameTitle=='addInstructor'">
                            <b-card-header
                              class="flex-wrap text-initial mx-1_3"
                              style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0.5rem;
                                padding-left: 0rem;
                              "
                            >
                              <div

                                class=" d-flex align-items-center"
                              >

                                <feather-icon

                                  icon="PlusCircleIcon"
                                  size="16"
                                />
                                <strong class="mx-1">
                                  {{ $t("Global.add_instructors") }}
                                </strong>
                                <slot name="status" />
                              </div>
                            </b-card-header>
                            <hr class="mt-0">
                        </div>
                        <div v-else-if="nameTitle=='addSection'">
                            <b-card-header
                              class="flex-wrap text-initial mx-1_3"
                              style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0.5rem;
                                padding-left: 0rem;
                              "
                            >
                              <div

                                class=" d-flex align-items-center"
                              >

                                <feather-icon

                                  icon="PlusCircleIcon"
                                  size="16"
                                />
                                <strong class="mx-1">
                                  {{ $t('Global.add_section') }}
                                </strong>
                                <slot name="status" />
                              </div>
                            </b-card-header>
                            <hr class="mt-0">
                        </div>
                        <div v-else-if="nameTitle=='addMultiSection'">
                            <b-card-header
                              class="flex-wrap text-initial mx-1_3"
                              style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0.5rem;
                                padding-left: 0rem;
                              "
                            >
                              <div

                                class=" d-flex align-items-center"
                              >

                                <feather-icon

                                  icon="PlusCircleIcon"
                                  size="16"
                                />
                                <strong class="mx-1">
                                  {{ $t('Global.add_multi_seactions') }}
                                </strong>
                                <slot name="status" />
                              </div>
                            </b-card-header>
                            <hr class="mt-0">
                        </div>
                        <div v-else-if="nameTitle=='addLinkedOffering'">
                            <b-card-header
                              class="flex-wrap text-initial mx-1_3"
                              style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0.5rem;
                                padding-left: 0rem;
                              "
                            >
                              <div

                                class=" d-flex align-items-center"
                              >

                                <feather-icon

                                  icon="EditIcon"
                                  size="16"
                                />
                                <strong class="mx-1">
                                  {{ $t("Global.add_linked_offering") }} {{passData}}
                                </strong>
                                <slot name="status" />
                              </div>
                            </b-card-header>
                            <hr class="mt-0">
                        </div>
                        <div v-else-if="nameTitle=='editSection'">
                            <b-card-header
                              class="flex-wrap text-initial mx-1_3"
                              style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 0.5rem;
                                padding-left: 0rem;
                              "
                            >
                              <div

                                class=" d-flex align-items-center"
                              >

                                <feather-icon

                                  icon="EditIcon"
                                  size="16"
                                />
                                <strong class="mx-1">
                                  {{ $t("Global.edit") }} {{passData}}
                                </strong>
                                <slot name="status" />
                              </div>
                            </b-card-header>
                            <hr class="mt-0">
                        </div>
                        <div v-else>
                        </div> -->
            <b-tabs
              v-model="tabIndex"
              @input="saveStatus"
              lazy
              vertical
              nav-wrapper-class="nav-hidden "
              align="left"
            >
              <div
                class="custom_drop mb-2"
                v-if="
                  $store.getters['app/width'] < 982 &&
                  $store.getters['app/width'] != 0
                "
              >
                <b-dropdown
                  block
                  :text="
                    $store.getters['app/updateSelectedTab']
                      ? $store.getters['app/updateSelectedTab'].name
                      : ''
                  "
                  variant="primary"
                >
                  <b-dropdown-item
                    :key="tab.id"
                    @click="
                      setSelectedTab(tab);
                      tabIndex = tab.id;
                    "
                    v-for="tab in $store.getters['app/dropArray']"
                  >
                    {{ tab.name }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
              <b-tab>
                <template #title>
                  <feather-icon icon="InfoIcon" />
                  <span>{{ $t("Global.course_information") }}</span>
                </template>
                <b-row>
                  <b-col md="12">
                    <div
                      class="mt-0 mb-1"
                      style="
                        display: flex;
                        justify-content: flex-end;
                        cursor: pointer;
                      "
                    ></div>
                  </b-col>
                </b-row>
                <ShowComponent
                  :only="[
                    'code',
                    'name',
                    'id',
                    'name_local',
                    'faculty',
                    'bylaw',
                    'department',
                    'pre_requisites',
                    'co_requisites',
                    'exposed_requisites',
                    'removed',
                    'credit_hours',
                  ]"
                  :data="item.course"
                  :loading="load"
                >
                  <template #min_level="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.min_level`) }}
                    </th>
                    <td>
                      {{ data.min_level || "-" }}
                    </td>
                  </template>
                  <template #code="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.code`) }}
                    </th>
                    <td>
                      <b-link
                        target="_blank"
                        v-if="item.course"
                        :to="{
                          name: 'course',
                          params: { id: item && item.course && item.course.id },
                        }"
                        class="font-weight-bold d-block"
                      >
                        {{ data && data.code ? data.code : "-" }}
                      </b-link>
                    </td>
                  </template>
                  <template #credit_hours="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.credit_hours`) }}
                    </th>
                    <td>
                      {{ data.credit_hours || "-" }}
                    </td>
                  </template>
                  <template #laboratory_hours="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.laboratory_hours`) }}
                    </th>
                    <td>
                      {{ data.laboratory_hours || "-" }}
                    </td>
                  </template>
                  <template #clinical_hours="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.clinical_hours`) }}
                    </th>
                    <td>
                      {{ data.clinical_hours || "-" }}
                    </td>
                  </template>
                  <template #tutorial_hours="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.tutorial_hours`) }}
                    </th>
                    <td>
                      {{ data.tutorial_hours || "-" }}
                    </td>
                  </template>

                  <!--            <template #marks="{ data }">-->
                  <!--              <th scope="row" :width="'20%'">-->
                  <!--                {{ $t(`Global.marks`) }}-->
                  <!--              </th>-->
                  <!--              <td >-->
                  <!--                <div v-for="mark in data.marks">-->
                  <!--                  <strong>{{ $i18n.locale == 'ar' ? mark.name_local : mark.name }}:</strong>-->
                  <!--                  <span class="mx-1">{{ mark.max ? mark.max : '-' }},</span>-->
                  <!--                </div>-->
                  <!--              </td>-->
                  <!--            </template>-->

                  <template #min_ch_passed="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.min_ch_passed`) }}
                    </th>
                    <td>
                      {{ data.min_ch_passed || "-" }}
                    </td>
                  </template>

                  <template #lecture_hours="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.lecture_hours`) }}
                    </th>
                    <td>
                      {{ data.lecture_hours || "-" }}
                    </td>
                  </template>

                  <template #co_requisites="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.core_requisites`) }}
                    </th>
                    <td>
                      <template v-if="data && data.co_requisites">
                        <div
                          v-for="(course, i) in data.co_requisites"
                          class="mr-sm-1 font-weight-bolder"
                        >
                          <b-link
                            target="_blank"
                            v-if="course"
                            :to="{ name: 'course', params: { id: course.id } }"
                            class="font-weight-bold d-block"
                          >
                            {{
                              $i18n.locale == "en"
                                ? course.name
                                : course.name_local
                            }}
                            <!-- <strong class="text-danger">,</strong> -->
                          </b-link>
                        </div>
                      </template>
                      <template v-else> -</template>
                    </td>
                  </template>
                  <template #pre_requisites="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.pre_requisites`) }}
                    </th>
                    <td>
                      <template v-if="data && data.pre_requisites">
                        <div
                          v-for="(course, i) in data.pre_requisites"
                          class="mr-sm-1 font-weight-bolder"
                        >
                          <b-link
                            target="_blank"
                            v-if="course"
                            :to="{ name: 'course', params: { id: course.id } }"
                            class="font-weight-bold d-block"
                          >
                            {{
                              $i18n.locale == "ar"
                                ? course.name_local || course.name
                                : ""
                            }}
                            {{
                              $i18n.locale == "en"
                                ? course.name || course.name_local
                                : ""
                            }}
                            <!-- <strong class="text-danger">,</strong> -->
                          </b-link>
                        </div>
                      </template>
                      <template v-else> -</template>
                    </td>
                  </template>

                  <template #department="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.department`) }}
                    </th>
                    <td>
                      <b-link
                        target="_blank"
                        v-if="data.department"
                        :to="{
                          name: 'department',
                          params: { id: data.department.id },
                        }"
                        class="font-weight-bold d-block"
                      >
                        {{
                          $i18n.locale == "en"
                            ? data.department.name
                            : data.department.name_local
                        }}
                      </b-link>
                    </td>
                  </template>

                  <template #id="{ data }">
                    <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
                      {{ $t(`Global.name_local`) }}
                    </th>
                    <td v-if="$i18n.locale == 'en'">
                      {{ data.name_local }}
                    </td>

                    <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">
                      الاسم بالانجليزية
                    </th>
                    <td v-if="$i18n.locale == 'ar'">
                      {{ data.name }}
                    </td>
                  </template>
                  <template #name="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.name_custom`) }}
                    </th>
                    <td>
                      {{ data.name }}
                    </td>
                  </template>

                  <template #name_local="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.arabic_name`) }}
                    </th>
                    <td>
                      {{ data.name_local }}
                    </td>
                  </template>
                  <template #removed="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.stage`) }}
                    </th>
                    <td v-if="data.bylaw && data.bylaw.stage">
                      <span v-if="$i18n.locale == 'ar'">
                        {{ data.bylaw.stage.name_local }}
                      </span>
                      <span v-else>
                        {{ data.bylaw.stage.name }}
                      </span>
                    </td>
                  </template>
                  <template #max_total="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.type`) }}
                    </th>
                    <td v-if="data.bylaw && data.bylaw.type">
                      <span v-if="$i18n.locale == 'ar'">
                        {{ data.bylaw.type.name_local }}
                      </span>
                      <span v-else>
                        {{ data.bylaw.type.name }}
                      </span>
                    </td>
                  </template>
                  <template #faculty="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.faculty`) }}
                    </th>
                    <td>
                      <b-link
                        target="_blank"
                        v-if="data.faculty"
                        :to="{
                          name: 'faculty',
                          params: { id: data.faculty.id },
                        }"
                        class="font-weight-bold d-block"
                      >
                        {{
                          $i18n.locale == "en"
                            ? data.faculty.name
                            : data.faculty.name_local
                        }}
                      </b-link>
                    </td>
                  </template>
                  <template #bylaw="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.bylaw`) }}
                    </th>
                    <td>
                      <b-link
                        target="_blank"
                        v-if="data.bylaw"
                        :to="{ name: 'bylaw', params: { id: data.bylaw.id } }"
                        class="font-weight-bold d-block"
                      >
                        {{
                          $i18n.locale == "en"
                            ? data.bylaw.name
                            : data.bylaw.name_local
                        }}
                      </b-link>
                    </td>
                  </template>
                  <!--            <template #core_requisites="{ data }">-->
                  <!--              <th scope="row" :width="'20%'">-->
                  <!--                {{ $t(`Global.core_requisites`) }}-->
                  <!--              </th>-->
                  <!--              <td >-->
                  <!--                {{ data.core_requisites && data.core_requisites.name ? data.core_requisites.name : '-' }}-->
                  <!--              </td>-->
                  <!--            </template>-->
                  <template #exposed_requisites="{ data }">
                    <th scope="row" :width="'20%'">
                      {{ $t(`Global.exposed_requisites`) }}
                    </th>
                    <td>
                      <template v-if="data && data.exposed_requisites">
                        <div
                          v-for="(course, i) in data.exposed_requisites"
                          class="mr-sm-1 font-weight-bolder"
                        >
                          <b-link
                            target="_blank"
                            v-if="course"
                            :to="{ name: 'course', params: { id: course.id } }"
                            class="font-weight-bold d-block"
                          >
                            {{
                              $i18n.locale == "en"
                                ? course.name
                                : course.name_local
                            }}
                            <!-- <strong class="text-danger">,</strong> -->
                          </b-link>
                        </div>
                      </template>
                      <template v-else> -</template>
                      <!--                <div v-if="data && data.exposed_requisites">-->
                      <!--                  {{ $i18n.locale == 'en' ? data.exposed_requisites.name : data.exposed_requisites.name_local }}-->
                      <!--                </div>-->
                    </td>
                  </template>
                </ShowComponent>
              </b-tab>
              <b-tab>
                <template #title>
                  <feather-icon icon="InfoIcon" />
                  <span>{{ $t("Global.offering_information") }}</span>
                </template>
                <b-row v-if="status">
                  <b-col md="12">
                    <div
                      class="mt-0 mb-1"
                      style="
                        display: flex;
                        justify-content: flex-end;
                        cursor: pointer;
                      "
                    >
                      <b-link
                        v-if="
                          hasPermission('edit_offering') &&
                          status == 'Draft' &&
                          !(params.status == 5 || $route.query.inline)
                        "
                        target="_blank"
                        @click="
                          (params = { status: 5, offering_id: offering_id }),
                            (nameTitle = 'edit_course_offering')
                        "
                      >
                        <feather-icon
                          v-b-tooltip.hover="$t('Global.edit')"
                          icon="EditIcon"
                          class="font-medium-3"
                        />
                      </b-link>
                      <b-link
                        v-else-if="
                          !(
                            hasPermission('edit_offering') && status == 'Draft'
                          ) && params.status !== 5
                        "
                        target="_blank"
                      >
                        <feather-icon
                          v-b-tooltip.hover="$t('Global.edit')"
                          icon="EditIcon"
                          class="font-medium-3 text-secondary"
                          style="cursor: default"
                        />
                      </b-link>
                    </div>
                  </b-col>
                </b-row>

                <EditOffering
                  v-if="
                    hasPermission('edit_offering') &&
                    status == 'Draft' &&
                    params.status == 5
                  "
                  :inline="true"
                  :params="{ status: 5, offering_id: offering_id }"
                  @hide="params.status = 3"
                />
                <EditOffering
                  v-else-if="$route.query.inline"
                  :inline="true"
                  :params="params"
                  @hide="params.status = 3"
                />
                <b-overlay v-else :show="show" rounded="sm" no-fade>
                  <ShowComponent
                    :data="getCourseOfferingDetails"
                    :loading="load"
                  >
                  </ShowComponent>
                </b-overlay>
              </b-tab>
              <b-tab>
                <template #title>
                  <feather-icon icon="BookIcon" />
                  <span>{{ $t("Global.linked_offerings") }}</span>
                </template>
                <linkedOffering
                  :status="item.status ? item.status.name : null"
                  action_hide
                  :linkedOfferings="item.linked_offering"
                />
              </b-tab>
              <b-tab v-show="hasPermission('access_program')">
                <template #title>
                  <feather-icon icon="BookOpenIcon" /><span>{{
                    $t("Global.programs")
                  }}</span>
                </template>
                <Programs
                  offering
                  :course_id="course_id"
                  :bylaw_id="bylaw_id"
                  :term_id="item.term.id"
                  action_hide
                  :inner-title="$t('Global.mandatory_programs')"
                />
                <b-table
                  outlined
                  :empty-text="$t('Global.empty_text')"
                  show-empty
                  :fields="fields_pool"
                  :items="
                    item.course && item.course.university_pools
                      ? item.course.university_pools
                      : []
                  "
                  striped
                  responsive="sm"
                >
                  <template #thead-top="data">
                    <b-tr>
                      <b-th variant="warning" colspan="2">
                        <strong class="text-primary font-medium-2 pb-1">
                          {{ $t("Global.elective_university_requirement") }}
                        </strong>
                      </b-th>
                    </b-tr>
                  </template>
                  <template #cell(name)="data">
                    <span> - </span>
                  </template>
                  <template #cell(pool)="data">
                    <b-link
                      :to="{ name: 'program', params: { id: data.item.id } }"
                      v-if="$i18n.locale == 'en'"
                    >
                      {{
                        data.item.name ? data.item.name : data.item.name_local
                      }}
                    </b-link>
                    <b-link
                      :to="{ name: 'programs', params: { id: data.item.id } }"
                      v-if="$i18n.locale == 'ar'"
                    >
                      {{
                        data.item.name_local
                          ? data.item.name_local
                          : data.item.name
                      }}
                    </b-link>
                  </template>
                </b-table>
                <b-table
                  outlined
                  :empty-text="$t('Global.empty_text')"
                  show-empty
                  :fields="fields_pool"
                  :items="
                    item.course && item.course.faculty_pools
                      ? item.course.faculty_pools
                      : []
                  "
                  striped
                  responsive="sm"
                >
                  <template #thead-top="data">
                    <b-tr>
                      <b-th variant="warning" colspan="2">
                        <strong class="text-primary font-medium-2 pb-1">
                          {{ $t("Global.elective_faculty_requirement") }}
                        </strong>
                      </b-th>
                    </b-tr>
                  </template>
                  <template #cell(name)="data">
                    <span>test program</span>
                    <!--  <b-link :to="{ name: 'programs', params: { id: data.item.id } }" v-if="data.item.program">
                                           {{ $i18n.locale == 'ar' ? data.item.program.name_local : data.item.program.name }}
                                         </b-link> -->
                  </template>
                  <template #cell(pool)="data">
                    <b-link
                      :to="{ name: 'program', params: { id: data.item.id } }"
                      v-if="$i18n.locale == 'en'"
                    >
                      {{
                        data.item.name ? data.item.name : data.item.name_local
                      }}
                    </b-link>
                    <b-link
                      :to="{ name: 'programs', params: { id: data.item.id } }"
                      v-if="$i18n.locale == 'ar'"
                    >
                      {{
                        data.item.name_local
                          ? data.item.name_local
                          : data.item.name
                      }}
                    </b-link>
                  </template>
                </b-table>
                <b-table
                  outlined
                  :empty-text="$t('Global.empty_text')"
                  show-empty
                  :fields="fields"
                  :items="
                    item.course && item.course.pools ? item.course.pools : []
                  "
                  striped
                  responsive="sm"
                >
                  <template #thead-top="data">
                    <b-tr>
                      <b-th variant="warning" colspan="2">
                        <strong class="text-primary font-medium-2 pb-1">
                          {{ $t("Global.elective_program") }}
                        </strong>
                      </b-th>
                    </b-tr>
                  </template>
                  <template #cell(name)="data">
                    <b-link
                      :to="{ name: 'program', params: { id: data.item.id } }"
                      v-if="$i18n.locale == 'en'"
                    >
                      {{
                        data.item.program.name
                          ? data.item.program.name
                          : data.item.program.name_local
                      }}
                    </b-link>
                    <b-link
                      :to="{ name: 'programs', params: { id: data.item.id } }"
                      v-if="$i18n.locale == 'ar'"
                    >
                      {{
                        data.item.program.name_local
                          ? data.item.program.name_local
                          : data.item.program.name
                      }}
                    </b-link>

                    <!--  <b-link :to="{ name: 'program', params: { id: data.item.program.id } }" v-if="data.item && data.item.program">
                                           {{ $i18n.locale == 'ar' ? data.item.program.name_local : data.item.program.name }}
                                         </b-link> -->
                  </template>
                  <template #cell(pool)="data">
                    <span v-if="$i18n.locale == 'en'">
                      {{
                        data.item.name ? data.item.name : data.item.name_local
                      }}
                    </span>
                    <span v-if="$i18n.locale == 'ar'">
                      {{
                        data.item.name_local
                          ? data.item.name_local
                          : data.item.name
                      }}
                    </span>
                  </template>
                </b-table>
                <!--  <Programs
                v-if="item"
                :programs="item.programs"
              /> -->
                <!-- <Programs
                :course_id="item.course.id"
                :bylaw_id="item.bylaw_id"
                action_hide
                noStatus="false"
                nofilter="false"
                allowSearch="false"
              /> -->

                <!--<addPrograms :course_id="course_id" :bylaw_id="item.course.bylaw_id"  :programs="item.programs"  action_hide @refresh="init"   />-->
              </b-tab>
              <b-tab>
                <template #title>
                  <feather-icon icon="UserIcon" />
                  <span>{{ $t("Global.instructors") }}</span>
                </template>
                <addInstructors
                  :course_id="course_id"
                  :bylaw_id="bylaw_id"
                  action_hide
                  :instructors="item.instructors"
                />
              </b-tab>

              <b-tab>
                <template #title>
                  <feather-icon icon="UsersIcon" />
                  <span>{{ $t("Global.students") }}</span>
                </template>
                <div class="d-flex justify-content-between align-items-center">
                  <div
                    v-if="!markLoad"
                    id="excelmessage"
                    style="font-weight: 500"
                  >
                    {{ ExcelMessage }}
                  </div>
                  <div v-else id="excelmessage" style="font-weight: 500">
                    {{ $t("Global.saving") }}
                  </div>

                  <div style="display: flex">
                    <div>
                      <!-- <b-button
                        v-b-tooltip.hover="$t('Global.statistics')"
                        @click="ShowStatisticsDialog"
                        class="btn-icon p-0"
                        style="margin: 3px"
                        variant="primary"
                      >
                        <feather-icon
                          icon="PieChartIcon"
                          style="width: 35px; height: 35px; padding: 7px"
                        />
                      </b-button> -->
                      <b-button
                        v-b-tooltip.hover="$t('Global.full_screen')"
                        @click="btnClicked"
                        class="btn-icon p-0"
                        style="margin: 3px"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiFullscreen"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>
                      <b-button
                        v-b-tooltip.hover="$t('Global.barcode')"
                        v-if="
                          (hasPermission('draft_show_barcode') &&
                            status == 'Draft') ||
                          (hasPermission('submit_show_barcode') &&
                            status == 'Submitted') ||
                          (hasPermission('review_show_barcode') &&
                            status == 'Accepted') ||
                          (hasPermission('approve_show_barcode') &&
                            status == 'Approved') ||
                          (hasPermission('publish_show_barcode') &&
                            status == 'Published')
                        "
                        :to="{
                          name: 'barcode',
                          params: { id: $route.params.id },
                        }"
                        class="btn-icon p-0"
                        style="margin: 3px"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiBarcode"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>
                      <b-button
                        v-b-tooltip.hover="$t('Global.barcode')"
                        v-else
                        :to="{
                          name: 'barcode',
                          params: { id: $route.params.id },
                        }"
                        class="btn-icon disabled_all p-0"
                        style="margin: 3px cursor: default"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiBarcode"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>
                      <b-button
                        v-if="hasPermission('sync_to_lms_offering')"
                        v-b-tooltip.hover="$t('sync-to-lms')"
                        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                        class="mx-1 mt-md-0"
                        variant="primary"
                        :disabled="item.can_sync"
                        @click="syncOfferings()"
                      >
                        <feather-icon icon="refresh-cw" class="text-md" />
                        {{ $t("sync-to-lms") }}
                      </b-button>
                      <b-button
                        v-if="hasPermission('exportGradesPdf_offering')"
                        v-b-tooltip.hover="$t('Global.export_to_pdf')"
                        @click="exportPDF"
                        class="btn-icon p-0"
                        style="margin: 3px"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiFilePdfBox"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>
                      <b-button
                        v-else
                        v-b-tooltip.hover="$t('Global.export_to_pdf')"
                        class="btn-icon disabled_all p-0"
                        style="margin: 3px; cursor: default"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiFilePdfBox"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>

                      <b-button
                        v-if="hasPermission('exportGrades_offering')"
                        v-b-tooltip.hover="$t('Global.export_to_excel')"
                        @click="exportExcel"
                        class="btn-icon p-0"
                        style="margin: 3px"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiFileExportOutline"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>
                      <b-button
                        v-if="!hasPermission('exportGrades_offering')"
                        v-b-tooltip.hover="$t('Global.export_to_excel')"
                        class="btn-icon disabled_all p-0"
                        style="margin: 3px; cursor: default"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiFileExportOutline"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>
                      <!-- "
                          (getColumns.length > 0 && students_count > 0 && status == 'Draft' && hasPermission('importGrades_offering') && (hasPermission('instructor_markCategories') || hasPermission('coordinator_markCategories'))) ||
                          (getColumns.length > 0 && students_count > 0 && status == 'Submitted' && hasPermission('importGrades_offering') && hasPermission('control_markCategories'))
                        " -->
                      <b-button
                        v-b-tooltip.hover="$t('Global.import_excel')"
                        v-if="hasPermission('importGrades_offering')"
                        :disabled="(status == 'Published')"
                        @click="$refs.refInputEl.click()"
                        class="btn-icon p-0"
                        style="margin: 3px"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiFileImportOutline"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>

                      <b-button
                        v-b-tooltip.hover="$t('Global.import_excel')"
                        v-else
                        class="btn-icon disabled_all p-0"
                        style="margin: 3px; cursor: default"
                        variant="primary"
                      >
                        <svg-icon
                          type="mdi"
                          :path="path.mdiFileImportOutline"
                          style="width: 35px; height: 35px; padding: 7px"
                        ></svg-icon>
                      </b-button>
                    </div>
                  </div>
                  <input
                    ref="refInputEl"
                    type="file"
                    class="d-none"
                    @change="upload"
                    accept=".xlsx, .xls, .csv"
                  />
                </div>
                <hr />
                <div :key="keyComponent" id="excel">
                  <b-overlay :show="show" rounded="sm" no-fade>
                    <!--                  <vue-excel-editor v-model="getStudents">-->
                    <!--                    <vue-excel-column field="user"   label="User ID"       type="string" width="80px" />-->
                    <!--                    <vue-excel-column field="name"   label="Name"          type="string" width="150px" />-->
                    <!--                    <vue-excel-column field="phone"  label="Contact"       type="string" width="130px" />-->
                    <!--                    <vue-excel-column field="gender" label="Gender"        type="select" width="50px" :options="['F','M','U']" />-->
                    <!--                    <vue-excel-column field="age"    label="Age"           type="number" width="70px" />-->
                    <!--                    <vue-excel-column field="birth"  label="Date Of Birth" type="date"   width="80px" />-->
                    <!--                  </vue-excel-editor>-->
                    <!-- <vue-excel-editor ref="grid" class="zoom-sm-out" v-model="getStudents" :readonly-style="columnStyleReadOnly" width="100%" free-select export-table @update="onUpdate" @select="selected">
                      <vue-excel-column field="exam_location_bn" :label="$t('Global.bn')" width="30px" readonly />
                      <vue-excel-column field="code" :label="$t('Global.code')" readonly width="50px" />
                      <vue-excel-column v-if="$i18n.locale == 'en'" :badge="{ name: 'show' }" field="name" :label="$t('Global.name')" readonly width="300px" />
                      <vue-excel-column v-if="$i18n.locale == 'ar'" :badge="{ name: show }" field="name_local" :label="$t('Global.name')" readonly width="200px" />
                      <div v-if="hasPermission('editInstructor_markCategories') && status == 'Draft' && getColumns.length > 0">
                        <vue-excel-column v-for="column in getColumns" :key="column.id" :field="'mark_' + column.id" :label="column.name + '(' + column.max + ')'" width="100px" :validate="onBeforeNameChange" :change="onBeforeNameChange" key-field :init-style="columnStyle" />
                      </div>
                      <div v-else-if="hasPermission('editControl_markCategories') && status == 'Submitted' && getColumns.length > 0">
                        <vue-excel-column v-for="column in getColumns" :key="column.id" :field="'mark_' + column.id" :label="column.name + ' ' + column.max" width="40px" :validate="onBeforeNameChange" :change="onBeforeNameChange" key-field :init-style="columnStyle" />
                      </div>
                      <div v-else>
                        <vue-excel-column
                          v-for="column in getColumns"
                          v-if="getColumns.length > 0"
                          :key="column.id"
                          :field="'mark_' + column.id"
                          :label="column.name + ' ' + column.max"
                          width="40px"
                          :validate="onBeforeNameChange"
                          :change="onBeforeNameChange"
                          key-field
                          :init-style="columnStyle"
                          readonly
                        />
                      </div> -->

                    <!-- <vue-excel-column
                      v-if="((marks && getColumns.length > 0) && ( (status != 'Draft' &&  status != 'Submitted' ) || (status=='Submitted' && hasPermission('control_markCategories') ) ) )"
                      field="total"
                      :label="$t('Global.total') + ' ' + maxtotal"
                      width="30px"
                      readonly
                    />
                  </vue-excel-editor>  -->
                    <!-- {{getStudents}} -->
                    <HandOnTable
                      v-if="forceRender"
                      :offeringMarks="item.offeringMarks"
                      :max_total="item.max_total"
                      @message="message"
                      @updateLoading="updateLoadingMethod"
                      :offeringStudentsGrades="offeringStudentsGrades"
                      :offeringGradesHeaders="offeringGradesHeaders"
                      :marks="marks"
                      :status="status"
                      :grades="getColumns"
                      :data="getStudents"
                    ></HandOnTable>
                  </b-overlay>
                </div>

                <b-row>
                  <b-col md="12">
                    <hr />
                  </b-col>
                  <b-col>
                    <b-card>
                      <b-row>
                        <b-col md="6" style="display: flex">
                          <h4 class="mr-1">
                            {{ $t(`Global.control_status`) }}:
                          </h4>
                          <h4 v-if="status && $i18n.locale == 'en'">
                            {{ status }}
                          </h4>
                          <h4 v-if="status && $i18n.locale == 'ar'">
                            {{ status_local }}
                          </h4>
                        </b-col>

                        <b-col
                          :class="updateLoad ? 'disabled_all' : ''"
                          md="6"
                          style="display: flex; justify-content: flex-end"
                        >
                          <!--  <div
                                                       v-if="item.status.name === 'Not Completed'"
                                                       style="margin: 3px"
                                                     >
                                                       <b-button
                                                         class="btn w-100"
                                                         variant="primary"
                                                         style="float: right; font-size: 12px"
                                                       >
                                                         {{ $t(`Global.draft`) }}
                                                       </b-button>
                                                     </div> -->
                          <div
                            v-if="
                              status === 'Draft' &&
                              hasPermission('submit_controlAction')
                            "
                            style="margin: 3px"
                          >
                            <b-button
                              v-if="students_count > 0"
                              class="btn w-100"
                              variant="primary"
                              style="float: right; font-size: 12px"
                              @click="submitStatus"
                            >
                              {{ $t(`Global.submit`) }}
                            </b-button>
                            <b-button
                              v-else
                              class="btn w-100 disabled_all"
                              variant="primary"
                              style="
                                float: right;
                                font-size: 12px;
                                cursor: not-allowed;
                              "
                            >
                              {{ $t(`Global.submit`) }}
                            </b-button>
                          </div>
                          <div
                            v-else-if="
                              status === 'Submitted' &&
                              hasPermission('accept_controlAction')
                            "
                            style="margin: 3px"
                          >
                            <b-button
                              class="btn w-100"
                              variant="primary"
                              style="float: right; font-size: 12px"
                              @click="reviewStatus"
                            >
                              {{ $t(`Global.accept`) }}
                            </b-button>
                          </div>
                          <div
                            v-else-if="
                              status === 'Accepted' &&
                              hasPermission('approve_controlAction')
                            "
                            style="margin: 3px"
                          >
                            <b-button
                              class="btn w-100"
                              variant="primary"
                              style="float: right; font-size: 12px"
                              @click="approveStatus"
                            >
                              {{ $t(`Global.approve`) }}
                            </b-button>
                          </div>
                          <!-- <div
                            v-else-if="
                              status === 'Approved' &&
                              hasPermission('finish_controlAction')
                            "
                            style="margin: 3px"
                          >
                            <b-button
                              class="btn w-100"
                              variant="primary"
                              style="float: right; font-size: 12px"
                              @click="finishStatus"
                            >
                              {{ $t(`Global.finish`) }}
                            </b-button>
                          </div> -->
                          <div
                            v-else-if="
                              status === 'Approved' &&
                              hasPermission('publish_controlAction')
                            "
                            style="margin: 3px"
                          >
                            <b-button
                              class="btn w-100"
                              variant="primary"
                              style="float: right; font-size: 12px"
                              @click="publishStatus"
                            >
                              {{ $t(`Global.publish`) }}
                            </b-button>
                          </div>

                          <div style="margin: 3px">
                            <b-button
                              v-if="
                                status != 'Draft' &&
                                status != 'Frozen' &&
                                hasPermission(getUndoPermission(status))
                              "
                              class="btn w-100"
                              variant="warning"
                              style="float: right; font-size: 12px"
                              @click="undoStatus"
                            >
                              {{ $t(getUndoText(status)) }}
                            </b-button>

                            <b-button
                              v-if="
                                status == 'Frozen' &&
                                hasPermission('undo_inFreez_controlAction')
                              "
                              class="btn w-100"
                              variant="warning"
                              style="float: right; font-size: 12px"
                              @click="undoStatus"
                            >
                              {{ $t(`Unfreeze`) }}
                            </b-button>
                          </div>
                          <div
                            v-if="
                              status != 'Frozen' &&
                              status != 'Published' &&
                              hasPermission('freez_controlAction')
                            "
                            style="margin: 3px"
                          >
                            <b-button
                              class="btn w-100"
                              variant="danger"
                              style="float: right; font-size: 12px"
                              @click="freezeStatus"
                            >
                              {{ $t(`Global.freeze`) }}
                            </b-button>
                          </div>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab @click="fetchData"  v-if="hasPermission('accessStatistics_offering')">
                <template #title>
                  <feather-icon icon="PieChartIcon" />
                  <span>{{ $t("Global.statistics") }}</span>
                </template>
                <!-- <b-table outlined :empty-text="$t('Global.empty_text')" show-empty :items="statisticsTable" :fields="fieldsData" striped responsive="sm">
                  <template #cell(student_count)="data">
                    <span>
                      {{ data.item.student_count ? data.item.student_count : '-' }}
                    </span>
                  </template>
                  <template #cell(nested_table)="data">
                    <b-table :items="data.item.grade_name" :fields="innerFieldsData" bordered small>
                    </b-table>
                  </template>
                </b-table> -->
                <TabTable   
                       :load="load"
                      :items="statisticsTable" :fields="fieldsData" :inner="innerFieldsData" />
                <chartjs-component-bar-chart :options="chartOptionsStudents" :height="400" :data="students" v-if="students" >
                </chartjs-component-bar-chart>
                
              </b-tab>
              <b-tab
                v-show="
                  hasPermission('batch_enroll_registration') && propOfferingId
                "
              >
                <template #title>
                  <feather-icon icon="FilePlusIcon" />
                  <span>{{ $t("Global.registrations") }}</span>
                </template>
                <Studies :prop-offering-id="propOfferingId" :offering="item"/>
              </b-tab>
              <b-tab v-show="hasPermission('show_sections')">
                <template #title>
                  <feather-icon icon="GridIcon" />
                  <span>{{ $t("Global.sections") }}</span>
                </template>
                <Sections
                  :course_id="course_id"
                  action_hide
                  :instructors="item.instructors"
                  :offering_id="item.id"
                />
              </b-tab>
              <b-tab v-show="hasPermission('access_offeringSchedule')">
                <template #title>
                  <feather-icon icon="CalendarIcon" />
                  <span>{{ $t("study_schedule") }}</span>
                </template>
                <Calendar v-if="renderComponent" />
              </b-tab>
              <b-tab v-show="hasPermission('access_exam')">
                <template #title>
                  <feather-icon icon="CalendarIcon" />
                  <span>{{ $t("exams_schedules") }}</span>
                </template>
                <ExamsSchedules></ExamsSchedules>
              </b-tab>
              <!-- <b-tab v-if="id && hasPermission('access_offeringTopic')">
                <template #title>
                  <feather-icon icon="BoxIcon" />
                  <span>{{ $t('Global.course_outcomes') }}</span>
                </template>
                <Outcomes :offering_id="$route.params.id" />
              </b-tab> -->

              <b-tab
                :class="specsLoad ? 'disabled_all' : ''"
                v-if="id && hasPermission('access_offeringTopic')"
              >
                <template #title>
                  <feather-icon icon="CommandIcon" />
                  <span>{{ $t("Global.course_topics") }}</span>
                </template>
                <Topics
                  :offering_id="Number($route.params.id)"
                  :course_id="item && item.course && item.course.id"
                />
              </b-tab>
              <b-tab
                :class="specsLoad ? 'disabled_all' : ''"
                v-if="id && hasPermission('access_offeringMethod')"
              >
                <template #title>
                  <feather-icon icon="ApertureIcon" />
                  <span>{{ $t("Global.teaching_learning_methods") }}</span>
                </template>
                <Methods
                  :offering_id="Number($route.params.id)"
                  :course_id="item && item.course && item.course.id"
                />
              </b-tab>
              <b-tab
                :class="specsLoad ? 'disabled_all' : ''"
                v-if="id && hasPermission('access_offeringAssessment')"
              >
                <template #title>
                  <feather-icon icon="ArchiveIcon" />
                  <span>{{ $t("Global.assessments") }}</span>
                </template>
                <Assessments :offering_id="Number($route.params.id)" />
              </b-tab>

              <b-tab
                :class="specsLoad ? 'disabled_all' : ''"
                v-if="id && ( hasPermission('show_questionnaire_offering') || item.canActiveSurvey) "
              >
                <template #title>
                  <feather-icon icon="HelpCircleIcon" />
                  <span>{{ $t("surveys") }}</span>
                </template>
                <Questionnaires :course_id="course_id" :canActiveSurvey="item.canActiveSurvey" />
              </b-tab>

              <b-tab v-show="id && hasPermission('access_offeringQuestion')">
                <template #title>
                  <feather-icon icon="MessageCircleIcon" />
                  <span>{{ $t("Global.comments") }}</span>
                </template>
                <div v-if="questionsArray">
                  <div v-for="item in questionsArray" :key="item.id">
                    <app-collapse accordion type="margin">
                      <app-collapse-item :title="item.question">
                        <div class="d-flex justify-content-between">
                          <span>{{
                            item.answers.length ? item.answers[0].answer : "-"
                          }}</span>
                          <span>
                            <feather-icon
                              @click="openDialog(item)"
                              v-if="hasPermission('answer_offeringQuestion')"
                              v-b-tooltip.hover="$t('Global.edit')"
                              icon="EditIcon"
                              style="cursor: pointer"
                          /></span>
                        </div>
                      </app-collapse-item>
                    </app-collapse>
                  </div>
                </div>
              </b-tab>
              <!-- v-if="hasPermission('show_statistics')" -->
              <!-- <b-tab v-if="hasPermission('admin_system')">
                <template #title>
                  <feather-icon icon="GridIcon" />
                  <span>{{ $t('Global.statistics') }}</span>
                </template>
                <Statistics :course_id="course_id" action_hide :offering_id="item.id" />
              </b-tab> -->
            </b-tabs>
          </b-card>
          <template />
        </div>
      </div>
    </b-overlay>

    <b-modal
      id="openAnswerDialog"
      v-model="openAnswerDialog"
      no-close-on-backdrop
      size="lg"
      :title="$t('Global.answer')"
    >
      <validation-observer ref="simpleRules1">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="12">
              <b-form-group :label="$t('Global.answer')">
                <validation-provider #default="{ errors }" name="answer">
                  <b-form-textarea
                    type="textarea"
                    :placeholder="$t('Global.answer')"
                    id="outcome-input"
                    v-model="form.answer"
                    rows="1"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                    :backend-errors="getBackendFieldError(errorsdata, 'answer')"
                  />
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
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              type="submit"
              variant="primary"
              class="mr-1"
              @click="saveAnswer"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="reset"
              variant="outline-secondary"
              @click="answer = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
      id="statisticsDialog"
      hide-footer
      v-model="statisticsDialog"
      no-close-on-backdrop
      size="lg"
      :title="$t('Global.statistics')"
    >
      <Statistics :course_id="course_id" action_hide :offering_id="item.id" />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  BCard,
  BCol,
  BFormCheckbox,
  BFormGroup,
  BForm,
  BFormInput,
  BFormTextarea,
  BRow,
  BDropdown,
  BDropdownItem,
  BTab,
  BTabs,
  BButton,
  BOverlay,
  BLink,
  BTable,
  BTh,
  BTr,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
// eslint-disable-next-line import/extensions
import ShowComponent from "@/views/components/info/show";
// eslint-disable-next-line import/extensions
import instructors from "@/views/study/offerings/components/instructors";
import Studies from "@/views/study/studies/components/studies";
import TabTable from "@/views/study/offerings/components/TabTable";
// eslint-disable-next-line import/extensions
//import Programs from '@/views/study/offerings/components/programs'
// import Statistics from '@/views/components/info/statistics'
import addPrograms from "@/views/study/offerings/components/addPrograms";
import addInstructors from "@/views/study/offerings/components/addInstructors";
//import Programs from "@/views/academic_settings/programs/components/programs";
import Programs from "@/views/study/offerings/components/programs";
import Sections from "@/views/study/offerings/components/sections/sectionsView.vue";
import EditOffering from "@/views/study/offerings/components/edit_offering.vue";
import { EventBus } from "@/main";
import Calendar from "@/views/study/schedule/offerings/scheduling/calendar/Calendar.vue";
import ExamsSchedules from "@/views/study/offerings/exams_schedules/components/exams_schedules.vue";
import linkedOffering from "@/views/study/offerings/components/linkedOffering";
import HandOnTable from "@/views/study/offerings/components/handontable";
import ChartjsComponentBarChart from '@/views/components/charts-components/ChartjsComponentBarChart.vue';
import {
  mdiDataMatrix,
  mdiBarcode,
  mdiApplicationImport,
  mdiImport,
  mdiExport,
  mdiFilePdfBox,
  mdiFullscreen,
  mdiFileExportOutline,
  mdiFileImportOutline,
} from "@mdi/js";
import SvgIcon from "@jamescoyle/vue-icon";
import Outcomes from "@/views/quality/outcomes/components/outcomes.vue";
import Topics from "@/views/quality/topics/components/topics.vue";
import Statistics from "@/views/study/offerings/components/statistics.vue";
import Methods from "@/views/quality/methods/components/methods.vue";
import Assessments from "@/views/quality/assessments/components/assessments.vue";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import Questionnaires from "@/views/quality/questionnaires/components/questionnaires.vue"
import { $themeColors } from '@themeConfig';
import { required, email } from "@validations";
const chartColors = {
  mainColor: '#054978',
  primaryColorShade: '#836AF9',
  yellowColor: '#ffe800',
  successColorShade: '#28dac6',
  warningColorShade: '#ffe802',
  warningLightColor: '#FDAC34',
  infoColorShade: '#299AFF',
  greyColor: '#4F5D70',
  blueColor: '#2c9aff',
  blueLightColor: '#84D0FF',
  greyLightColor: '#EDF1F4',
  tooltipShadow: 'rgba(0, 0, 0, 0.25)',
  lineChartPrimary: '#666ee8',
  lineChartDanger: '#ff4961',
  green:'rgb(0,190,0)',
  red:'rgb(255,0,0)',
  labelColor: '#746D69',
  grid_line_color: 'rgba(200, 200, 200, 0.2)',
  second_color: '#f57f21',
};

export default {
  name: "Show",
  components: {
    TabTable,
    ChartjsComponentBarChart,
    HandOnTable,
    BFormCheckbox,
    BFormGroup,
    BFormInput,
    Statistics,
    BRow,
    Questionnaires,
    BFormTextarea,
    BForm,
    ShowComponent,
    BCard,
    BCol,
    BRow,
    Assessments,
    Methods,
    Topics,
    Outcomes,
    AppCollapse,
    AppCollapseItem,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    // Statistics,
    instructors,
    Programs,
    BDropdown,
    BDropdownItem,
    BTab,
    BTabs,
    BButton,
    BOverlay,
    BLink,
    addPrograms,
    addInstructors,
    Sections,
    EditOffering,
    Calendar,
    ExamsSchedules,
    linkedOffering,
    BTable,
    BTh,
    BTr,
    SvgIcon,
    Studies,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      statisticsDialog: false,
      total:0,
      forceRender: true,
      updateLoad: false,
      openAnswerDialog: false,
      renderComponent: true,
      params: {},
      statisticsTable:[],
      statisticsData:null,
      form: {
        offering_id: this.$route.params.id,
        answer: null,
        question_id: null,
      },
      columnStyleReadOnly: {
        color: "rgb(139 146 153)",
      },
      columnStyle: {
        color: "rgb(0 0 0)",
        textAlign: "center",
      },
      QArray: [
        { question: "question test", answer: "test answer", id: 1 },
        { question: "question test", answer: "test answer sd", id: 2 },
      ],
      course_id: null,
      bylaw_id: null,
      keyComponent: 0,
      offeringGradesHeaders: null,
      offeringStudentsGrades: null,
      maxtotal: 0,
      columnsMax: {},
      course_details: {},
      marks: false,
      //header: false,
      ExcelMessage: null,
      status: null,
      marksColumns: [],
      show: false,
      student_status: ["absent", "pass", "failed"],
      students_count: 0,
      undoButton: false,
      tabIndex: 0,
      editable: "true",
      role: null,
      open: false,
      nameTitle: null,
      passData: null,
      status_local: null,
      errorsdata: null,
      path: {
        mdiBarcode: mdiBarcode,
        mdiApplicationImport: mdiApplicationImport,
        mdiExport: mdiExport,
        mdiImport: mdiImport,
        mdiFilePdfBox: mdiFilePdfBox,
        mdiFullscreen: mdiFullscreen,
        mdiFileExportOutline: mdiFileExportOutline,
        mdiFileImportOutline: mdiFileImportOutline,
      },
      propOfferingId: null,
      chartOptionsStudents: {
        elements: {
          rectangle: {
            borderWidth: 2,
            borderSkipped: 'bottom',
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        legend: {
          display: false,
        },
        tooltips: {
          // Updated default tooltip UI
          shadowOffsetX: 1,
          shadowOffsetY: 1,
          shadowBlur: 8,
          shadowColor: chartColors.tooltipShadow,
          backgroundColor: $themeColors.light,
          titleFontColor: $themeColors.dark,
          bodyFontColor: $themeColors.dark,
          callbacks: {
            label:(tooltipItem, data)=> {

              if (this.statisticsData) {
                // const count = this.faculty.studnets_per_faculty[tooltipItem.index].students_count;
                const count = Object.values(this.statisticsData)[tooltipItem.index].student_count
                const totalStudents = this.total;
                const percentage = ((count / totalStudents) * 100).toFixed(0);
                // const percentage = 0;
                
                // return percentage + '% of students ,'+count+' number of students';
                return this.$i18n.locale === "en"
                ? percentage + '%, '+count
                : percentage+ '%,'+count
              }
              return '';
            // return realCount + ' students';
          }
          },
        },
        scales: {
          xAxes: [
            {
              display: true,
              gridLines: {
                display: true,
                color: chartColors.grid_line_color,
                zeroLineColor: chartColors.grid_line_color,
              },
              scaleLabel: {
                display: false,
              },
              ticks: {
                fontColor: chartColors.labelColor,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              beginAtZero:true,
              gridLines: {
                color: chartColors.grid_line_color,
                zeroLineColor: chartColors.grid_line_color,
              },
              ticks: {
                beginAtZero: true,
                // stepSize: 20,
                fontColor: chartColors.labelColor,
              },
            },
          ],
        },
      },
      fieldsData: [
        {
          key: 'group_name',
          label: this.$t('Name'),
        },
        {
          key: 'student_count',
          label: this.$t('Count'),
        },
        {
          key: 'percentage',
          label: this.$t('Percentage'),
        },
      ],
      innerFieldsData: [
        {
          key: 'grade_name',
          label: this.$t('Name'),
        },
        {
          key: 'student_count',
          label: this.$t('Count'),
        },
        {
          key: 'percentage',
          label: this.$t('Percentage'),
        },
      ],
    };
  },
  beforeMount() {
    this.init();
    if (this.$route.query) {
      this.tabIndex = Number(this.$route.query.tabNum);
    }
  },

  computed: {
    ...mapGetters({
      item: "offerings/item",
      statistics: "offerings/statistics",
      load: "offerings/load",
      markLoad: "app/load",
      questionsArray: "offerings/questions",
      specsLoad: "app/load",
      excelTableSort : 'app/ExeclTableSort'

    }),
    students() {
    if (this.statisticsData) {
      
      this.total = Object.keys(this.statisticsData)
        .map(key => this.statisticsData[key].student_count) // Extract student counts
        .reduce((acc, count) => acc + count, 0); // Calculate sum
      return {
        labels: Object.keys(this.statisticsData).map(key => this.statisticsData[key].grade_name),
        datasets: [
          {
            // data: this.faculty.studnets_per_faculty.map(el => ((el.students_count).toFixed(2))),
            data: Object.keys(this.statisticsData).map(key => this.statisticsData[key].student_count),
            backgroundColor: chartColors.second_color,
            borderColor: 'transparent',
          },
        ],
      };
    }
    // return null;
  },
    id() {
      if (this.$route.query.inline == true) {
        this.open = true;
        this.params = { status: 5, offering_id: this.$route.params.id };
      }
      return this.$route.params.id ? this.$route.params.id : null;
    },
    fields_pool() {
      return [
        {
          key: "pool",
          label: this.$t("Global.pool_name"),
        },
      ];
    },
    fields() {
      return [
        {
          key: "name",
          label: this.$t("Global.name"),
        },
        {
          key: "pool",
          label: this.$t("Global.pool_name"),
        },
      ];
    },
    getColumns() {
      const columns = [];
      let db;
      let maxTotal = 0;
      if (this.offeringGradesHeaders) {
        this.offeringGradesHeaders.forEach((data, index) => {
          maxTotal += data.max_mark;
          db = {
            id: data.id,
            short_name: data.short_name,
            name: data.name ? data.name : data.name_local,
            name_local: data.name_local ? data.name_local : data.name,
            max: data.max_mark || "",
          };
          this.maxtotal = maxTotal;
          this.columnsMax[data.id] = data.max_mark;
          columns.push(db);
          this.marksColumns.push(db.short_name);
        });
      }
      this.columns = columns;
      return this.columns;
    },
    getStudents() {
      const studentData = [];
      const status = [];
      if (this.offeringStudentsGrades != null) {
        this.offeringStudentsGrades.forEach((element) => {
          const db = {};
          db.statusData = {};
          let oldGrade = element.registration_marks.some(
            (el) => el.name == "Old Grade"
          );
          let totalMax = element.registration_marks
            .map((el) => el.max_mark)
            .reduce((partialSum, a) => partialSum + a, 0);
          // if (oldGrade) {
          //   totalMax = totalMax - 100;
          // }
          const sumMarks = element?.total ? element?.total : null;
          const markPercentage =
            element?.student && sumMarks && totalMax
              ? (Number(sumMarks) / totalMax) * 100
              : "";
          db.code =
            element.student &&
            element.student &&
            element.student.user &&
            element.student.user.code
              ? element.student.user.code
              : "";
          db.name =
            element.student && element.student.user && element.student.user.name
              ? element.student.user.name
                  .trimStart()
                  .replace("أ", "ا")
                  .replace("إ", "ا")
              : "";
          db.name_local =
            element.student && element.student.user
              ? element.student.user.name_local
                  .trimStart()
                  .replace("أ", "ا")
                  .replace("إ", "ا")
              : "";
          db.name += "_";
          db.name_local += "_";
          db.name += element.student ? element.student.id : "";
          db.name_local += element.student ? element.student.id : "";
          db.student_id = element.student ? element.student.id : "";
          db.bn_number = element.bn_number;
          // if (this.hasPermission('show_total')) {
          db.grade_type = element?.grade_type
            ? element.grade_type.name + "_" + element.grade_type.gpa + "_"+ element.grade_type.id
            : "";
          db.grade_type_object = element?.grade_type
            ? element.grade_type
            : null;
          db.grade_type_id = element?.grade_type ? element.grade_type.id : "";
          // }
          db.id = element.id;
          // if (this.hasPermission('show_total')) {
          // Math.round(
          db.markPercentage = Number.isInteger(markPercentage)
            ? Number(markPercentage) + "%"
            : Number(markPercentage).toFixed(2) + "%";
          // }
          let totalmarks = 0;
          const stat = {};
          const status = [];
          const marksData = [];
          for (const [key, value] of Object.entries(element.status)) {
            const st = {};
            st.name = value.name;
            st.name_local = value.name_local;
            status.push(st);
          }
          for (const [key, value] of Object.entries(
            this.offeringGradesHeaders
          )) {
            const marks = {};
            marks.id = value.id;
            marks.max_mark = value.max_mark;
            marks.short_name = value.short_name;
            marksData.push(marks);
          }
          if (this.$i18n.locale === "en") {
            db.section = element.section ? element.section.name : "";
          } else {
            db.section = element.section ? element.section.name_local : "";
          }
          if (this.$i18n.locale === "en") {
            db.group =
              element.section &&
              element.section.group &&
              element.section.group.name
                ? element.section.group.name
                : "";
          } else {
            db.group =
              element.section &&
              element.section.group &&
              element.section.group.name_local
                ? element.section.group.name_local
                : "";
          }
          db["statusData"].status = status;
          db["statusData"].user_name =
            element.student && element.student.user
              ? element.student.user.name
              : "";
          db["statusData"].user_name_local =
            element.student && element.student.user
              ? element.student.user.name_local
              : "";
          db["statusData"].user_id =
            element.student && element.student.user
              ? element.student.user.id
              : "";
          db["marksData"] = marksData;

          if (element.registration_marks.length > 0) {
            element.registration_marks.forEach((el) => {
              if (el.pivot.value != null) {
                this.editable = "false";
              }
              db[`mark_${el.id}`] =
                el.pivot.value != null ? Number(el.pivot.value) : "";
              db.registration_id = el.pivot.registration_id;
              db["markName"] = el.name;
              db["markShortName"] = el.short_name;
              totalmarks += db[`mark_${el.id}`];
              db.max = el.max_mark;
            });
          }
          // if (this.hasPermission('show_total')) {
          db.total = element.total != null ? element.total : "";
          db.extra = element.extra != null ? element.extra : "";
          // }
          // totalmarks = 0
          this.marks = true;
          studentData.push(db);
        });
      }
      return studentData;
    },
    getCourseDetails() {
      let data = {};
      let marks = {};
      let grades = "";
      if (this.item.students_count > 0) {
        this.students_count = this.item.students_count;
      }
      if (this.item) {
        this.course_id =
          this.item && this.item.course && this.item.course.id
            ? this.item.course.id
            : null;
        this.bylaw_id =
          this.item.course &&
          this.item.course.bylaw &&
          this.item.course.bylaw.id
            ? this.item.course.bylaw.id
            : null;
        //data.code = this.item.course ? this.item.course.code : '-';
        data.code = {
          value: this.item.course ? this.item.course.code : "-",
          link: this.$router.resolve({
            name: "course",
            params: {
              id:
                this.item.course && this.item.course.id
                  ? this.item.course.id
                  : null,
            },
          }).href,
        };
        data.english_name = {
          value: this.item.course ? this.item.course.name : "-",
          link: this.$router.resolve({
            name: "course",
            params: {
              id:
                this.item.course && this.item.course.id
                  ? this.item.course.id
                  : null,
            },
          }).href,
        };
        data.name_arabic = {
          value: this.item.course ? this.item.course.name_local : "-",
          link: this.$router.resolve({
            name: "course",
            params: {
              id:
                this.item.course && this.item.course.id
                  ? this.item.course.id
                  : null,
            },
          }).href,
        };

        if (this.item.course) {
          if (this.$i18n.locale === "en" && this.item.course.bylaw) {
            data.bylaw = {
              value: this.item.course.bylaw.name
                ? this.item.course.bylaw.name
                : this.item.course.bylaw.name_local
                ? this.item.course.bylaw.name_local
                : "-",
              link: this.$router.resolve({
                name: "bylaw",
                params: {
                  id: this.item.course ? this.item.course.bylaw.id : null,
                },
              }).href,
            };
          } else if (this.$i18n.locale === "ar" && this.item.course.bylaw) {
            data.bylaw = {
              value: this.item.course.bylaw.name_local
                ? this.item.course.bylaw.name_local
                : this.item.course.bylaw.name
                ? this.item.course.bylaw.name
                : "-",
              link: this.$router.resolve({
                name: "bylaw",
                params: {
                  id: this.item.course ? this.item.course.bylaw.id : null,
                },
              }).href,
            };
          }
          if (this.$i18n.locale === "en" && this.item.course.faculty) {
            data.faculty = {
              value: this.item.course.faculty.name
                ? this.item.course.faculty.name
                : this.item.course.faculty.name_local
                ? this.item.course.faculty.name_local
                : "-",
              link: this.$router.resolve({
                name: "faculty",
                params: {
                  id: this.item.course ? this.item.course.faculty.id : null,
                },
              }).href,
            };
          } else if (this.$i18n.locale === "ar" && this.item.course.faculty) {
            data.faculty = {
              value: this.item.course.faculty.name_local
                ? this.item.course.faculty.name_local
                : this.item.course.faculty.name
                ? this.item.course.faculty.name
                : "-",
              link: this.$router.resolve({
                name: "faculty",
                params: {
                  id: this.item.course ? this.item.course.faculty.id : null,
                },
              }).href,
            };
          }
          if (this.item.stage && this.$i18n.locale === "en") {
            data.stage = this.item.stage.name
              ? this.item.stage.name
              : this.item.stage.name_local
              ? this.item.stage.name_local
              : "-";
          } else if (this.item.stage && this.$i18n.locale === "ar") {
            data.stage = this.item.stage.name_local
              ? this.item.stage.name_local
              : this.item.stage.name
              ? this.item.stage.name
              : "-";
          }

          if (this.item.course.credit_hours) {
            data.credit_hours = this.item.course.credit_hours;
          } else {
            data.credit_hours = "-";
          }
          if (this.item.course.pre_requisites.length > 0) {
            if (this.$i18n.locale === "en") {
              let pre_arr = [];
              let name = "";
              this.item.course.pre_requisites.forEach((course) => {
                name = course.name
                  ? course.name + ","
                  : course.name_local + ",";
                pre_arr.push(name);
              });
              data.prerequisites = pre_arr;
            } else if (this.$i18n.locale === "ar") {
              let pre_arr = [];
              let name = "";
              this.item.course.pre_requisites.forEach((course) => {
                name = course.name_local
                  ? course.name_local + ","
                  : course.name + ",";
                pre_arr.push(name);
              });
              data.prerequisites = pre_arr;
            }
          } else {
            data.prerequisites = "-";
          }
          if (this.item.course.co_requisites.length > 0) {
            if (this.$i18n.locale === "en") {
              let co_arr = [];
              let name = "";
              this.item.course.co_requisites.forEach((course) => {
                name = course.name
                  ? course.name + ","
                  : course.name_local + ",";
                co_arr.push(name);
              });
              data.co_requisites = co_arr;
            } else if (this.$i18n.locale === "ar") {
              let co_arr = [];
              let name = "";
              this.item.course.co_requisites.forEach((course) => {
                name = course.name_local
                  ? course.name_local + ","
                  : course.name + ",";
                co_arr.push(name);
              });
              data.co_requisites = co_arr;
            }
          } else {
            data.co_requisites = "-";
          }
          if (this.item.course.exposed_requisites.length > 0) {
            if (this.$i18n.locale === "en") {
              let exp_arr = [];
              let name = "";
              this.item.course.exposed_requisites.forEach((course) => {
                name = course.name
                  ? course.name + ","
                  : course.name_local + ",";
                exp_arr.push(name);
              });
              data.exposed_requisites = exp_arr;
            } else if (this.$i18n.locale === "ar") {
              let exp_arr = [];
              let name = "";
              this.item.course.exposed_requisites.forEach((course) => {
                name = course.name_local
                  ? course.name_local + ","
                  : course.name + ",";
                exp_arr.push(name);
              });
              data.exposed_requisites = exp_arr;
            }
          } else {
            data.exposed_requisites = "-";
          }
        }
      }

      return data;
    },
    getCourseOfferingDetails() {
      let data = {};
      let marks = {};
      let grades = "";
      this.show = true;

      if (this.item) {
        if (this.item.term) {
          if (this.$i18n.locale === "en") {
            data.term = this.item.term.name
              ? this.item.term.name
              : this.item.term.name_local
              ? this.item.term.name_local
              : "-";
          } else if (this.$i18n.locale === "ar") {
            data.term = this.item.term.name_local
              ? this.item.term.name_local
              : this.item.term.name
              ? this.item.term.name
              : "-";
          }
        }

        var totalGrades = 0;
        if (this.item.offeringMarks && this.item.offeringMarks.length > 0) {
          let n = this.item.offeringMarks.length;
          let markCatLast = this.item.offeringMarks[n - 1];
          for (let i = 0; i < n - 1; i++) {
            let element = this.item.offeringMarks[i];

            if (element.pivot.name !== "Clemency") {
              if (element.pivot.name || element.pivot.name_local) {
                grades +=
                  this.$i18n.locale === "en"
                    ? element.pivot.name +
                      "(" +
                      element.pivot.max_mark +
                      ")" +
                      "+"
                    : element.pivot.name_local
                    ? element.pivot.name_local +
                      "(" +
                      element.pivot.max_mark +
                      ")" +
                      "+"
                    : element.pivot.name +
                      "(" +
                      element.pivot.max_mark +
                      ")" +
                      "+";

                totalGrades += element.pivot.max_mark
                  ? element.pivot.max_mark
                  : 0;
              }
            }
          }
          if (markCatLast && markCatLast.name !== "Clemency") {
            if (markCatLast.name || markCatLast.name_local) {
              grades +=
                this.$i18n.locale === "en"
                  ? markCatLast.pivot.name +
                    "(" +
                    markCatLast.pivot.max_mark +
                    ")"
                  : markCatLast.pivot.name_local
                  ? markCatLast.pivot.name_local +
                    "(" +
                    markCatLast.pivot.max_mark +
                    ")"
                  : markCatLast.pivot.name +
                    "(" +
                    markCatLast.pivot.max_mark +
                    ")";
              totalGrades += markCatLast.pivot.max_mark
                ? markCatLast.pivot.max_mark
                : 0;
            }
          }
        }

        if (grades) {
          data.marks =
            this.$i18n.locale === "en"
              ? `Total(${totalGrades}) = ${grades}`
              : `المجموع(${totalGrades}) = ${grades}`;
        } else {
          data.marks = "-";
        }

        if (this.item.status) {
          if (this.$i18n.locale === "en") {
            data.control_status = this.item.status.name
              ? this.item.status.name
              : this.item.status.name_local
              ? this.item.status.name_local
              : "-";
            this.status = this.item.status.name
              ? this.item.status.name
              : this.item.status.name_local
              ? this.item.status.name_local
              : "-";
          } else if (this.$i18n.locale === "ar") {
            data.control_status = this.item.status.name_local
              ? this.item.status.name_local
              : this.item.status.name
              ? this.item.status.name
              : "-";
            this.status_local = this.item.status.name_local
              ? this.item.status.name_local
              : this.item.status.name
              ? this.item.status.name
              : "-";
            this.status = this.item.status.name
              ? this.item.status.name
              : this.item.status.name_local
              ? this.item.status.name_local
              : "-";
          }
        }
        this.show = false;
      }

      return data;
    },

    language: function () {
      return this.$i18n.locale;
    },
  },
  created() {
    this.propOfferingId = this.$route.params.id;
    EventBus.$on("changeIt", (data) => {
      this.nameTitle = data;
    });
    EventBus.$on("passData", (passData) => {
      this.passData = passData;
    });
    EventBus.$on("showStatisticsEvent", (data) => {
      this.ShowStatisticsDialog(data);
    });
    let that = this;
    window.addEventListener("fullscreenchange", function (e) {
      let is_fullscreen = document.getElementsByClassName(
        "ol-full-screen-true"
      );
      if (is_fullscreen.length) {
        that.forceRender = false;
        setTimeout(() => {
          that.forceRender = true;
        }, 200);
        document.body.classList.remove("ol-full-screen-true");
      }
    });
  },
  watch: {
    language: function (val) {
      this.renderComponent = false;
      this.$nextTick(() => {
        // add my-component component in DOM
        this.renderComponent = true;
      });
      if (val === localStorage.getItem("mylang")) {
      } else {
        if (Number(this.$route.query.tabNum) == 5) {
          window.location.reload();
          val === localStorage.setItem("mylang", val);
        }
      }

    },
    "$route.params.id": {
      handler: function (id) {
        this.init();
      },
    },
    "$route.query.tabNum": {
      handler: function (tabNum) {
        if (this.params.status == 5 || this.$route.query.inline) {
          this.nameTitle = "cancel";
        }
        // if (Number(this.$route.query.tabNum) == 6) {

        //   this.fetchData();

        // }
        this.nameTitle = "cancel";
      },
      deep: true,
      immediate: true,
      
    },
  },
  methods: {
    ...mapActions({
      offering_mark: "offerings/offering_mark",
      getItem: "offerings/get",
      getStatistics: "offerings/statistics",
      exportStudentGrades: "offerings/exportStudentGrades", // excel
      exportStudentGradesPDF: "offerings/exportPDF", // pdf
      importStudentGrades: "offerings/importStudentGrades",
      updateStudentGradeFromExcel: "offerings/updateStudentGradeFromExcel",
      statusSubmit: "offerings/statusSubmit",
      statusUndo: "offerings/statusUndo",
      statusReview: "offerings/statusReview",
      statusApprove: "offerings/statusApprove",
      statusFinish: "offerings/statusFinish",
      statusPublish: "offerings/statusPublish",
      statusFreez: "offerings/statusFreez",
      getRole: "roles/getUserRolesPermissions",
      questions: "offerings/questions",
      autoFillAction: "offerings/autoFill",
      exportSpecsAction: "courses/exportSpecs",
      syncOfferingsToLms: "offerings/syncOfferingsToLms",
    }),
    updateLoadingMethod(data) {
      this.updateLoad = data;
      // let toast = document.querySelector('.toastification-close-icon');
      // if(data && !toast){
      //   this.$toast({
      //     component: ToastificationContent,
      //     props: {
      //       icon: 'FileTextIcon',
      //       text: this.$t('Global.saving'),
      //       variant: 'info',
      //     },
      //   }, {
      //     position: 'top-center',
      //     timeout: false,
      //     closeOnClick: false,
      //     draggable: false,
      //   });
      // }else{
      //   if(toast){
      //     document.querySelector('.toastification-close-icon').click();
      //   }
      // }
    },
    ShowStatisticsDialog(data) {
      this.statisticsDialog = true;
      
    },

    async fetchData() {
        try {
            const statistics = await this.getStatistics(this.id);
            this.statisticsData = statistics['grade_type'];
            console.log(this.statisticsData);
            // const result = {};
            for (const key in this.statisticsData) {
                this.statisticsTable[key] = this.statisticsData[key];
            }
            this.statisticsTable = Object.values(statistics['grade_type_table'])

            for(const item of this.statisticsTable) {
              this.$set(item, '_showDetails', true)
            }

        } catch (error) {
        }
    },
    autoFill() {
      this.autoFillAction(this.$route.params.id).then((_) => {
        this.question();
      });
    },
    exportSpecs(type) {
      this.exportSpecsAction({ type: type, id: this.$route.params.id });
    },
    openDialog(data) {
      if (data) {
        this.form.answer = data.answers.length ? data.answers[0].answer : null;
        this.form.question_id = data.id;
        this.form.offering_id = this.$route.params.id;
      } else {
        this.form.question_id = null;
        this.form = {};
      }
      this.openAnswerDialog = true;
    },

    saveAnswer() {
      this.$refs.simpleRules1.validate().then((success) => {
        if (success) {
          const payload = {
            query: this.form,
          };
          this.$store
            .dispatch("offerings/putAnswer", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 2000,
              });
              this.question();
              this.openAnswerDialog = false;
            })
            .catch((error) => {
              this.errorsdata = this.handleBackendError(
                error.response.data.errors
              );
            });
        }
      });
    },
    question() {
      this.$nextTick((_) => {
        if (this.hasPermission("access_offeringQuestion"))
          this.questions({ query: { offering_id: this.$route.params.id } });
      });
    },
    init() {
      this.show = true;
      this.getItem(this.id).then((_) => {
        this.keyComponent = this.keyComponent + 1;
        this.question();
      });
      this.offering_mark(this.id).then((data) => {
        this.offeringGradesHeaders = data.offeringGradesHeaders;
        this.offeringStudentsGrades = data.offeringStudentsGrades;
        this.keyComponent = this.keyComponent + 1;
      });
      this.ExcelMessage = " ";
      this.getRole(this.authUser().id).then((response) => {
        let roles = response.data.roles;
        this.role = response.data.roles;
        if (roles.includes("admin") || roles.includes("control")) {
          this.undoButton = true;
        }
      });
      this.getCourseOfferingDetails;
      this.getCourseDetails;

      this.show = false;
    },
    saveStatus(index) {
      //this.edit = false;
      this.updateFilterQueryParams({ tabNum: index });
      this.setSelectedTab({ name: "", id: this.tabIndex });
    },
    // full screen
    btnClicked() {
      var element = document.getElementById("hotTableId");
      // var Tostar = document.getElementById('tableWithTostar');
      element.parentNode.requestFullscreen();
      // Tostar.parentNode.requestFullscreen();
      // document.body.appendChild(element);
      element.style.width = "100%";
      element.style.height = "100%";
      element.style.overflow = "auto";
      // element.style.position = 'absolute';
      // element.style.top = '0';
      // element.style.left = '0';
      // element.style.zIndex = '99999';
      setTimeout(() => {
        // document.body.classList.add('ol-full-screen-true');
      }, 200);
    },
    exportExcel() {
      this.exportStudentGrades({
        id: this.id,
        lang: this.$i18n.locale,
        query: this.item,
      });
      // window.location.href = `${process.env.VUE_APP_BASE_URL}/offerings/export-student-grades/${this.id}/${this.$i18n.locale}`;
    },

    exportPDF() {
      this.exportStudentGradesPDF({
        id: this.id,
        lang: this.$i18n.locale === "en" ? 1 : 2,
        sort : this.excelTableSort
      });
    },
    upload(e) {
      const data = new FormData();

      data.append("file", e.target.files[0]);

      const payload = { resource: data, id: this.id, lang: this.$i18n.locale };
      this.show = true;
      this.$store.dispatch("offerings/upload", payload).then((response) => {
        if (response.status == true) {
          this.$router.push({
            name: "import_grades",
            params: { id: this.id },
            query: { data: response, columns: this.marksColumns },
          });
        } else {
          this.$swal({
            icon: "error",
            title: this.$i18n.locale == "en" ? "Wrong!" : "خطا !",
            text:
              this.$i18n.locale == "en"
                ? "Wrong File, Export Excel First Then Import It after Edit"
                : "ملف خطأ , اصدر الملف لاكسل اولا و ارفعه بعد التعديل",
            showConfirmButton: false,
            timer: 1500,
          });
          this.show = false;
          this.init();
        }
      });
    },
    onUpdate(data) {
      let sum = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(data)) {
        if (
          key !== "id" &&
          key !== "$id" &&
          key !== "code" &&
          key !== "name" &&
          key !== "name_local" &&
          key !== "total" &&
          key !== "offering_mark_id" &&
          key !== "registration_id" &&
          key !== "student_id" &&
          key !== "max" &&
          key !== "bn_number" &&
          key !== "status" &&
          key !== "grade_type"
        ) {
          sum += Number(value);
        }
      }
      // eslint-disable-next-line no-param-reassign
      data.total = sum;
    },
    message(type) {
      if (!type) {
        this.ExcelMessage = "";
      } else if (type === "max") {
        this.ExcelMessage =
          this.$i18n.locale === "en"
            ? "Student Grade Exceeded The Maximum Grade!"
            : "درجة الطالب اكبر من الدرجة العظمي";
        document.getElementById("excelmessage").style.color = "red";
        // setTimeout(_ => {
        //   this.init();
        // }, 1500);
      } else if (type === "success") {
        this.ExcelMessage =
          this.$i18n.locale === "en"
            ? "Student Grade Updated Successfully!"
            : "تم تعديل درجة الطالب بنجاح";
        document.getElementById("excelmessage").style.color = "green";
      } else if (type == "absent") {
        this.ExcelMessage =
          this.$i18n.locale === "en"
            ? "Check Student Status"
            : "من فضلك راجع حالة الطالب";
        document.getElementById("excelmessage").style.color = "red";
      } else if (type === "negative") {
        this.ExcelMessage =
          this.$i18n.locale === "en"
            ? "Student Grade Is Negative !"
            : "درجة الطالب سالبة   ";
        document.getElementById("excelmessage").style.color = "red";
        // setTimeout(_ => {
        //   this.init();
        // }, 2500);
      } else if (type === "wrong") {
        this.ExcelMessage =
          this.$i18n.locale === "en" ? "Wrong Formula !" : " ! صيغة خاطئة";
        document.getElementById("excelmessage").style.color = "red";
        // setTimeout(_ => {
        //   this.init();
        // }, 2500);
      } else if (type === "update_not_allowed") {
        this.ExcelMessage =
          this.$i18n.locale === "en"
            ? "You Are Not Allowed To Update This Grade!"
            : " ! غير مسموح لك بتعديل هذه الدرجة ";
        document.getElementById("excelmessage").style.color = "red";
        // setTimeout(_ => {
        //   this.init();
        // }, 2500);
      } else if (type === "not_authorized") {
        this.ExcelMessage =
          this.$i18n.locale === "en"
            ? "You Are Not Allowed To Update This Grade!"
            : " ! غير مسموح لك بتعديل هذه الدرجة ";
        document.getElementById("excelmessage").style.color = "red";
        // setTimeout(_ => {
        //   this.init();
        // }, 2500);
      } else {
        this.ExcelMessage =
          this.$i18n.locale === "en" ? "wrong formula !" : " ! صيغة خاطئة";
        document.getElementById("excelmessage").style.color = "red";
        // setTimeout(_ => {
        //   this.init();
        // }, 2500);
      }
    },
    onBeforeNameChange(...args) {
      const newVal = args[0];
      const oldVal = args[1];
      const { registration_id } = args[2]; // object of new value data
      // eslint-disable-next-line camelcase
      const offering_mark_id = args[3].name.replace("mark_", ""); // mark_1 => 1
      const max = this.columnsMax[offering_mark_id]; // to get max of updated cell
      const resource = {
        registration_id,
        offering_mark_id,
        value: newVal,
        max,
      };

      /* if (resource.value > resource.max) {
                  window.setTimeout(this.message('max'), 3000)
                  return ' '
                } */

      const re = new RegExp("^[0-9]+([.][0-9]{1,6})?$");
      // eslint-disable-next-line no-useless-escape
      const space = new RegExp("^s*$");
      if (re.test(resource.value) || resource.value === "") {
        if (resource.value > resource.max) {
          window.setTimeout(this.message("max"), 3000);
          return " ";
        }
      } else {
        if (resource.value < 0) {
          window.setTimeout(this.message("negative"), 3000);
          return " ";
          //  this.init()
        }
        window.setTimeout(this.message("wrong"), 3000);
        return " ";
      }
      // this.updateStudentGradeFromExcel(resource).then(response => {
      //   let type = '';
      //   let message = '';
      //   if (response.success === true) {
      //     this.message('success');
      //     setTimeout(_ => {
      //       this.ExcelMessage = ' ';
      //     }, 5000);
      //   } else {
      //     if (response.success === 'not_authorized') {
      //       window.setTimeout(this.message('not_authorized'), 1000);
      //       return ' ';
      //     } else if (response.success === 'update_not_allowed') {
      //       window.setTimeout(this.message('update_not_allowed'), 3000);
      //       return ' ';
      //     }
      //   }

      // });

      // .catch(error => {
      //   this.errors = error.response.data.errors
      //   this.$notify({
      //     type: 'error',
      //     message: 'error',
      //   })
      // })
    },
    /*  validate(...args){
              let ok = 0
              if(ok ==0)
              {
                return 'Mandatory field'
              }
              else {
                return ''
              }

            }, */
    selected(selectedRows) {},
    submitStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Submit to Control)"
            : "هل أنت متأكد أنك تريد (إرسال إلى الكنترول)",
        text:
          this.$i18n.locale == "en"
            ? "Important! you will not be able to change the grades again unless you contact control member to reopen the grades editing for you."
            : "مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول لإعادة فتح تعديل الدرجات لك  ",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusSubmit(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                //text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.status =
                this.item.status && this.item.status.name
                  ? this.item.status.name
                  : "";
              window.location.reload();
              this.init();
              window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
        }
      });
    },
    reviewStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Review)"
            : "هل أنت متأكد أنك تريد (المراجعة)",
        text:
          this.$i18n.locale == "en"
            ? "Important! you will not be able to change the grades again unless you contact control member with higher permission to reopen the grades editing for you."
            : "مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول بسماحية اعلي لإعادة فتح تعديل الدرجات لك  ",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusReview(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                //text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.status =
                this.item.status && this.item.status.name
                  ? this.item.status.name
                  : "";
              window.location.reload();
              this.init();
              window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    approveStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Approve)"
            : "هل أنت متأكد أنك تريد (الاعتماد)",
        /*         text: this.$i18n.locale=='en'? "Important! you will not be able to change the grades again unless you contact control member with higher permission to reopen the grades editing for you.":"مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول بسماحية اعلي لإعادة فتح تعديل الدرجات لك  ",
         */ icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusApprove(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                //text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              window.location.reload();
              this.init();
              window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.status =
            this.item.status && this.item.status.name
              ? this.item.status.name
              : "";
          this.init();
        }
      });
    },
    finishStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Finish)"
            : "هل أنت متأكد أنك تريد (انهاء الدرجات)",
        /*         text: this.$i18n.locale=='en'? "Important! you will not be able to change the grades again unless you contact control member with higher permission to reopen the grades editing for you.":"مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول بسماحية اعلي لإعادة فتح تعديل الدرجات لك  ",
         */ icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusFinish(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                //text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.status = this.item.status.name;
              window.location.reload();
              this.init();
              window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    publishStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Publish)"
            : "هل أنت متأكد أنك تريد (النشر)",
        /*         text: this.$i18n.locale=='en'? "Important! you will not be able to change the grades again unless you contact control member with higher permission to reopen the grades editing for you.":"مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول بسماحية اعلي لإعادة فتح تعديل الدرجات لك  ",
         */ icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusPublish(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                //text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.status = this.item.status.name;
              window.location.reload();
              this.init();
              window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    freezeStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Freeze)"
            : "هل أنت متأكد أنك تريد (تجميد)",
        /*         text: this.$i18n.locale=='en'? "Important! you will not be able to change the grades again unless you contact control member with higher permission to reopen the grades editing for you.":"مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول بسماحية اعلي لإعادة فتح تعديل الدرجات لك  ",
         */ icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusFreez(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                // text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              window.location.reload();
              this.init();
              window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.status = this.item.status.name;
          this.init();
        }
      });
    },
    getUndoText(status) {
      if (status) {
        if (status == "Submitted") {
          return `Back to Draft`;
        } else if (status == "Accepted") {
          return `Back to Submitted`;
        } else if (status == "Approved") {
          return `Back to Accepted`;
        } else if (status == "Published") {
          return `Unpublish`;
        }
      }
    },
    getUndoPermission(status) {
      if (status) {
        if (status.toLowerCase() == "submitted") {
          status = status.slice(0, -3);
        } else if (status.toLowerCase() == "accepted") {
          status = status.slice(0, -2).replace("accept", "review");
        } else if (status.toLowerCase() == "approved") {
          status = status.slice(0, -1);
        } else {
          status = status.slice(0, -2);
        }
        return `undo_in${status}_controlAction`;
      }
    },
    undoStatus() {
      this.$swal({
        title:
          this.$i18n.locale == "en"
            ? "Are you sure you want to (Undo)"
            : "هل أنت متأكد أنك تريد (الرجوع)",
        /*         text: this.$i18n.locale=='en'? "Important! you will not be able to change the grades again unless you contact control member with higher permission to reopen the grades editing for you.":"مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول بسماحية اعلي لإعادة فتح تعديل الدرجات لك  ",
         */ icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.statusUndo(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                type: "success",
                // text: response.success,
                icon: "success",
                showConfirmButton: false,
                timer: 5000,
              });
              this.status =
                this.item.status && this.item.status.name
                  ? this.item.status.name
                  : "";
              window.location.reload();

              this.init();

              window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                timer: 5000,
              });
            }
          });
          this.init();
        }
      });
    },
    syncOfferings() {
      this.$swal({
        title: this.$i18n.locale == "en" ? "Are you sure?" : "هل أنت متأكد؟)",
        /*         text: this.$i18n.locale=='en'? "Important! you will not be able to change the grades again unless you contact control member with higher permission to reopen the grades editing for you.":"مهم! لن تتمكن من تغيير التقديرات مرة أخرى إلا إذا اتصلت باحد اعضاء الكنترول بسماحية اعلي لإعادة فتح تعديل الدرجات لك  ",
         */ icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.ok")}`,
        customClass: {
          title: "test",
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.syncOfferingsToLms(this.id).then((response) => {
            if (response.success) {
              this.$swal({
                icon: "success",
                title:
                  this.$i18n.locale === "en"
                    ? "Offering Linked !"
                    : "تم ربط المفرر ",
                text:
                  this.$i18n.locale === "en"
                    ? "Offering Synced to LMS Successfully."
                    : "تم ربط المقرر بنجاح",
                showConfirmButton: true,
                // timer: 4000,
              });
              // this.status = this.item.status && this.item.status.name ? this.item.status.name : '';
              // window.location.reload();

              this.init();

              // window.setTimeout(history.go(0), 6000);
            } else {
              this.$swal({
                type: "error",
                text: response.error,
                icon: "error",
                showConfirmButton: true,
                // timer: 5000,
              });
            }

            // if (response.status && (response.status === "success")) {
            //       this.$swal({
            //         icon: "success",
            //         title:
            //           this.$i18n.locale === "en"
            //             ? "Offering Linked !"
            //             : "تم ربط المفرر ",
            //         text:
            //           this.$i18n.locale === "en"
            //             ? "Offering Synced to LMS Successfully."
            //             : "تم ربط المقرر بنجاح",
            //         showConfirmButton: true,
            //         timer: 4000,
            //       });

            //       this.init();
            //       this.cancel();
            //       this.show = false

            //   } else {
            //   }
          });
          this.init();
        }
      });
    },

    // syncOfferings() {
    //   const payload = { id: this.$route.params.id}
    //   this.show = true
    //   this.syncOfferingsToLms(payload).then(response => {
    //     if (response.status === true) {
    //       this.show = false
    //       this.$swal({
    //         type: 'success',
    //         title: `${this.$t('Global.Offerings been synced')}`,
    //         icon: 'success',
    //         showConfirmButton: true,
    //         timer: 5000,
    //       })
    //       this.$router.push({
    //         name: 'offering',
    //         params: { id: this.$route.params.id },
    //         query: { tabNum:6 }
    //       })
    //     }
    //   })
    // },
  },
};
</script>

<style lang="scss">
.custom-table {
  overflow: auto;
}

.fullscreen {
  background-color: yellow;
  width: 50% !important;
}

#excel {
  background-color: rgb(255, 255, 249);
}

.test {
  font-size: 1.1em;
}

.custom_columns {
  .card-body {
    .tabs {
      // flex-wrap: nowrap;
    }
  }
}
</style>
