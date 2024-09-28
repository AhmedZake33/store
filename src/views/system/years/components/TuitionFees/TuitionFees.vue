<template>
  <b-card no-body>
    <div class="m-1 d-flex w-100 align-items-center justify-content-between">
      <h3 class="d-inline-block">
        {{ $t("Tuition Fees") }}
      </h3>
      <!-- <b-button
        v-if="hasPermission('edit_tuition_fees')"
        v-b-tooltip.hover="$t('edit_payment_accounts')"
        class="btn-icon float-right"
        variant="outline-primary"
        @click="editPaymentAccounts"
      >
        <feather-icon icon="EditIcon" />
        {{ $t("edit_payment_accounts") }}
      </b-button> -->
    </div>

    <hr />
    
    <b-overlay :show="loading" rounded="sm">
      <!-- <div class="mb-3">
        <b-row class="mb-1 w-100 align-items-center">
          <h3 class="ml-1">
            {{ $t("Global.due_date") }}
          </h3>
          <div class="mx-2 d-block w-100 text-center">
            <strong
              class="w-100 d-flex justify-content-center align-items-center flex-wrap"
            >
              <div>
                {{ $t("Global.first_due_date") }} :
                <small class="text-uppercase text-primary text-bold">
                  {{ due_dates.first_due_date ? due_dates.first_due_date : " _ " }}
                </small>
                &nbsp; &nbsp;
                {{ $t("Global.second_due_date") }} :
                <small class="text-uppercase text-primary text-bold">
                  {{ due_dates.second_due_date ? due_dates.second_due_date : " _ " }}
                </small>
              </div>
              <feather-icon
                v-if="hasPermission('edit_tuition_fees')"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                class="mx-2"
                style="cursor: pointer"
                @click="showDueDateModal(tuitionType)"
              />
            </strong>
          </div>
        </b-row>
      </div> -->
      <b-table
        outlined
        :empty-text="$t('Global.empty_text')"
        show-empty
        :items="tuitionFeesItems"
        :fields="tuitionFeesFields"
        responsive="sm"
        striped
      >
        <template #table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle" />
          </div>
        </template>
        <template #cell(levels)="row">
          <div
            class="text-center"
            style="
              font-size: 1.1em;
              font-weight: bold;
              background: #f3f2f7;
              padding: 7px 0px;
            "
          >
            {{
              getTranslatedNameFromObject({
                name: row.item.name,
                name_local: row.item.name_local,
              })
            }}
          </div>
          <b-table
            v-if="row.item.levels"
            small
            :items="row.item.levels"
            :fields="tuitionFeesFacultyFields"
            responsive
            style="text-align: center"
          >
            <template #thead-top>
              <b-tr>
                <b-th colspan="2" />
                <b-th colspan="3" class="border-left-right">
                  {{ $t("egy_pound") }}
                </b-th>
                <b-th colspan="3" class="border-left-right">
                  {{ $t("usd_dollar") }}
                </b-th>
                <b-th />
              </b-tr>
            </template>
            <template #cell(level_number)="data">
              <span>
                {{ data.item.level.level_number }}
              </span>
            </template>
            <template #cell(level_name)="data">
              <span>
                {{
                  getTranslatedNameFromObject({
                    name: data.item.level.name,
                    name_local: data.item.level.name_local,
                  })
                }}
              </span>
            </template>
            <template #cell(first_installment_local)="data">
              <span>
                {{ data.item.payment_setting_installments[0].value_local }}
              </span>
            </template>
            <template #cell(first_installment_usd)="data">
              <span>
                {{ data.item.payment_setting_installments[0].value_usd }}
              </span>
            </template>
            <template #cell(second_installment_local)="data">
              <span>
                {{ data.item.payment_setting_installments[1].value_local }}
              </span>
            </template>
            <template #cell(second_installment_usd)="data">
              <span>
                {{ data.item.payment_setting_installments[1].value_usd }}
              </span>
            </template>
            <template #cell(total_local)="data">
              <span>
                {{ data.item.value_local }}
              </span>
            </template>
            <template #cell(total_usd)="data">
              <span>
                {{ data.item.value_usd }}
              </span>
            </template>
            <template #cell(actions)="data">
              <div>
                <feather-icon
                  v-if="hasPermission('show_tuition_fees')"
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  style="cursor: pointer"
                  @click="
                    showModal(
                      {
                        paymentSettingId: data.item.id,
                        faculty: {
                          name: row.item.name,
                          name_local: row.item.name_local,
                        },
                        level: {
                          level_number: data.item.level.level_number,
                          name: data.item.level.name,
                          name_local: data.item.level.name_local,
                        },
                      },
                      false
                    )
                  "
                />
                <feather-icon
                  v-if="
                    hasPermission('edit_tuition_fees') &&
                    data.item.can_edit == 1
                  "
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon"
                  style="cursor: pointer"
                  @click="
                    showModal(
                      {
                        paymentSettingId: data.item.id,
                        faculty: {
                          name: row.item.name,
                          name_local: row.item.name_local,
                        },
                        level: {
                          level_number: data.item.level.level_number,
                          name: data.item.level.name,
                          name_local: data.item.level.name_local,
                        },
                      },
                      true
                    )
                  "
                />
              </div>
            </template>
          </b-table>
          <div class="d-block">
            <div class="d-block">
              <hr />
              <span class="float-left">
                {{ $t("Custom Programs") }}
              </span>
              <b-button
                v-if="hasPermission('edit_tuition_fees')"
                v-b-tooltip.hover="$t('Global.add')"
                class="btn-icon float-right"
                variant="primary"
                size="sm"
                @click="addCustomProgramFeesModal(row.item.id)"
              >
                <feather-icon icon="PlusIcon" />
              </b-button>
            </div>
            <b-table
              small
              :items="row.item.programs"
              :fields="tuitionFeesFacultyProgramsFields"
              responsive
              style="text-align: center"
            >
              <template #thead-top>
                <b-tr>
                  <b-th colspan="2" />
                  <b-th colspan="3" class="border-left-right">
                    {{ $t("egy_pound") }}
                  </b-th>
                  <b-th colspan="3" class="border-left-right">
                    {{ $t("usd_dollar") }}
                  </b-th>
                  <b-th />
                </b-tr>
              </template>
              <template #cell(program)="data">
                <span>
                  {{
                    getTranslatedNameFromObject({
                      name: data.item.program.name,
                      name_local: data.item.program.name_local,
                    })
                  }}
                </span>
              </template>
              <template #cell(level_name)="data">
                <span v-if="data.item.level">
                  {{
                    getTranslatedNameFromObject({
                      name: data.item.level.name,
                      name_local: data.item.level.name_local,
                    })
                  }}
                </span>
                <span v-else>_</span>
              </template>
              <template #cell(first_installment_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_local }}
                </span>
              </template>
              <template #cell(first_installment_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_usd }}
                </span>
              </template>
              <template #cell(second_installment_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[1].value_local }}
                </span>
              </template>
              <template #cell(second_installment_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[1].value_usd }}
                </span>
              </template>
              <template #cell(total_local)="data">
                <span>
                  {{ data.item.value_local }}
                </span>
              </template>
              <template #cell(total_usd)="data">
                <span>
                  {{ data.item.value_usd }}
                </span>
              </template>
              <template #cell(actions)="data">
                <div>
                  <feather-icon
                    v-if="hasPermission('show_tuition_fees')"
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    style="cursor: pointer"
                    @click="
                      showCustomProgramModal(
                        {
                          paymentSettingId: data.item.id,
                          program: {
                            name: data.item.program.name,
                            name_local: data.item.program.name_local,
                          },
                          level: {
                            level_number: data.item.level
                              ? data.item.level.level_number
                              : null,
                            name: data.item.level ? data.item.level.name : null,
                            name_local: data.item.level
                              ? data.item.level.name_local
                              : null,
                          },
                        },
                        false
                      )
                    "
                  />
                  <feather-icon
                    v-if="
                      hasPermission('edit_tuition_fees') &&
                      data.item.can_edit == 1
                    "
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    style="cursor: pointer"
                    @click="
                      showCustomProgramModal(
                        {
                          paymentSettingId: data.item.id,
                          program: {
                            name: data.item.program.name,
                            name_local: data.item.program.name_local,
                          },
                          level: {
                            level_number: data.item.level
                              ? data.item.level.level_number
                              : null,
                            name: data.item.level ? data.item.level.name : null,
                            name_local: data.item.level
                              ? data.item.level.name_local
                              : null,
                          },
                        },
                        true
                      )
                    "
                  />
                  <feather-icon
                    v-if="
                      hasPermission('edit_tuition_fees') &&
                      data.item.can_edit == 1
                    "
                    v-b-tooltip.hover="$t('Global.delete')"
                    icon="Trash2Icon"
                    style="cursor: pointer"
                    class="text-danger"
                    @click="removePaymentSettingBtn(data.item.id)"
                  />
                </div>
              </template>
            </b-table>
            <hr />
          </div>
          <div v-if="tuitionType === 'tuition-fees-pg'" class="d-block">
            <div class="d-block">
              <hr />
              <span class="float-left">
                {{ $t("Theses Fees") }}
              </span>
            </div>
            <b-table
              v-if="row.item.theses"
              small
              :items="row.item.theses"
              :fields="tuitionFeesThesesFields"
              responsive
              style="text-align: center"
            >
              <template #thead-top>
                <b-tr>
                  <b-th colspan="3" class="border-left-right">
                    {{ $t("egy_pound") }}
                  </b-th>
                  <b-th colspan="3" class="border-left-right">
                    {{ $t("usd_dollar") }}
                  </b-th>
                  <b-th />
                </b-tr>
              </template>
              <template #cell(first_installment_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_local }}
                </span>
              </template>
              <template #cell(first_installment_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_usd }}
                </span>
              </template>
              <template #cell(second_installment_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[1].value_local }}
                </span>
              </template>
              <template #cell(second_installment_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[1].value_usd }}
                </span>
              </template>
              <template #cell(total_local)="data">
                <span>
                  {{ data.item.value_local }}
                </span>
              </template>
              <template #cell(total_usd)="data">
                <span>
                  {{ data.item.value_usd }}
                </span>
              </template>
              <template #cell(actions)="data">
                <div>
                  <feather-icon
                    v-if="hasPermission('show_tuition_fees')"
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    style="cursor: pointer"
                    @click="
                      showModal(
                        {
                          paymentSettingId: data.item.id,
                          faculty: {
                            name: row.item.name,
                            name_local: row.item.name_local,
                          },
                          level: {
                            name: 'Theses',
                            name_local: 'الاطروحات',
                          },
                        },
                        false
                      )
                    "
                  />
                  <feather-icon
                    v-if="
                      hasPermission('edit_tuition_fees') &&
                      data.item.can_edit == 1
                    "
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    style="cursor: pointer"
                    @click="
                      showModal(
                        {
                          paymentSettingId: data.item.id,
                          faculty: {
                            name: row.item.name,
                            name_local: row.item.name_local,
                          },
                          level: {
                            name: 'Theses',
                            name_local: 'الاطروحات',
                          },
                        },
                        true
                      )
                    "
                  />
                </div>
              </template>
            </b-table>
            <hr />
          </div>
        </template>
      </b-table>
      <hr />
      <!-- max credit hour fees -->
      <div v-if="tuitionType === 'tuition-fees-ug'">
        <div class="d-block">
          <h3 class="float-left">
            {{ $t("Extra Credit Hour Fees") }}
          </h3>
        </div>
        <b-table
          outlined
          :empty-text="$t('Global.empty_text')"
          show-empty
          :items="MaxExtraCreditHoursFeesItems"
          :fields="MaxExtraCreditHoursFields"
          responsive="sm"
          striped
          style="text-align: center"
        >
          <template #cell(faculty)="data">
            <span v-if="data.item.faculty">
              {{ getTranslatedNameFromObject(data.item.faculty) }}
            </span>
          </template>
          <template #cell(max_credit_hours)="data">
            <span v-if="data.item.options_value">
              {{ data.item.options_value.max_credit_hours }}
            </span>
          </template>
          <template #cell(value_local)="data">
            <span>
              {{ data.item.value_local }}
            </span>
          </template>
          <template #cell(value_usd)="data">
            <span>
              {{ data.item.value_usd }}
            </span>
          </template>
          <template #cell(actions)="data">
            <div>
              <feather-icon
                v-if="hasPermission('show_tuition_fees')"
                v-b-tooltip.hover="$t('Global.show')"
                icon="EyeIcon"
                style="cursor: pointer; margin-right: 3px"
                @click="
                  showExtraCreditHourFeesModal(
                    {
                      paymentSettingId: data.item.id,
                      faculty: data.item.faculty,
                    },
                    false
                  )
                "
              />
              <feather-icon
                v-if="hasPermission('edit_tuition_fees')"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer"
                @click="
                  showExtraCreditHourFeesModal(
                    {
                      paymentSettingId: data.item.id,
                      faculty: data.item.faculty,
                    },
                    true
                  )
                "
              />
            </div>
          </template>
        </b-table>
      </div>

      <!--min credit hour fees -->
      <div v-if="tuitionType === 'tuition-fees-ug'">
        <div class="d-block">
          <h3 class="float-left" >
            {{ $t("Min Credit Hour Fees") }}
          </h3>
          <!-- <b-button
            v-if="hasPermission('edit_tuition_fees')"
            v-b-tooltip.hover="$t('Global.add')"
            class="btn-icon float-right"
            variant="primary"
            size="sm"
            @click="addMinExtraCreditHour()"
          >
            <feather-icon icon="PlusIcon" />
          </b-button> -->
        </div>
        <b-table
          outlined
          :empty-text="$t('Global.empty_text')"
          show-empty
          :items="MinCreditHoursFeesItems"
          :fields="MinCreditHoursFields"
          responsive="sm"
          striped
          style="text-align: center"
        >
          <template #cell(faculty)="data">
            <span v-if="data.item.faculty">
              {{ getTranslatedNameFromObject(data.item.faculty) }}
            </span>
          </template>
          <template #cell(min_credit_hours)="data">
            <span v-if="data.item.options_value">
              {{ data.item.options_value.min_credit_hours }}
            </span>
          </template>
          <template #cell(value_local)="data">
            <span>
              {{ data.item.value_local }}
            </span>
          </template>
          <template #cell(value_usd)="data">
            <span>
              {{ data.item.value_usd }}
            </span>
          </template>
          <template #cell(actions)="data">
            <div>
              <feather-icon
                v-if="hasPermission('show_tuition_fees')"
                v-b-tooltip.hover="$t('Global.show')"
                icon="EyeIcon"
                style="cursor: pointer; margin-right: 3px"
                @click="
                  showMinCreditHourFeesModal(
                    {
                      paymentSettingId: data.item.id,
                      faculty: data.item.faculty,
                    },
                    false
                  )
                "
              />
              <feather-icon
                v-if="hasPermission('edit_tuition_fees')"
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer"
                @click="
                  showMinCreditHourFeesModal(
                    {
                      paymentSettingId: data.item.id,
                      faculty: data.item.faculty,
                    },
                    true
                  )
                "
              />
            </div>
          </template>
        </b-table>
      </div>

      <!--Summer hour fees -->
      <div v-if="tuitionType === 'tuition-fees-ug'">
        <div class="d-block">
          <h3 class="float-left" >
            {{ $t("Summer Credit Hour Fees") }}
          </h3>
        </div>
        <b-table
          outlined
          :empty-text="$t('Global.empty_text')"
          show-empty
          :items="SummerHoursFeesItems"
          :fields="tuitionFeesFields"
          responsive="sm"
          striped
        >
        <template #table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle" />
          </div>
        </template>
        <template #cell(levels)="row">
          <div
            class="text-center"
            style="
              font-size: 1.1em;
              font-weight: bold;
              background: #f3f2f7;
              padding: 7px 0px;
            "
          >
            {{
              getTranslatedNameFromObject({
                name: row.item.name,
                name_local: row.item.name_local,
              })
            }}
          </div>
          <!-- {{ row.item.levels }} -->
          <b-table
            v-if="row.item.levels"
            small
            :items="row.item.levels"
            :fields="summerFeesFacultyFields"
            responsive
            style="text-align: center"
          >
            
            <template #cell(level_number)="data">
              <span>
                {{ data.item.level.level_number }}
              </span>
            </template>
            <template #cell(level_name)="data">
              <span>
                {{
                  getTranslatedNameFromObject({
                    name: data.item.level.name,
                    name_local: data.item.level.name_local,
                  })
                }}
              </span>
            </template>
            <template #cell(total_local)="data">
              <span>
                {{ data.item.value_local }}
              </span>
            </template>
            <template #cell(total_usd)="data">
              <span>
                {{ data.item.value_usd }}
              </span>
            </template>
            <template #cell(actions)="data">
              <div>
                <feather-icon
                  v-if="hasPermission('show_tuition_fees')"
                  icon="EyeIcon"
                  style="cursor: pointer"
                  @click="
                  showSummerModal(
                      {
                        paymentSettingId: data.item.id,
                        faculty: {
                          name: row.item.name,
                          name_local: row.item.name_local,
                          id:row.item.id
                        },
                        level: {
                          level_number: data.item.level.level_number,
                          name: data.item.level.name,
                          name_local: data.item.level.name_local,
                        },
                      },
                      false
                    )
                  "
                />
                <feather-icon
                  v-if="
                    hasPermission('edit_tuition_fees') &&
                    data.item.can_edit == 1
                  "
                  icon="EditIcon"
                  style="cursor: pointer"
                  @click="
                    showSummerModal(
                      {
                        paymentSettingId: data.item.id,
                        faculty: {
                          name: row.item.name,
                          name_local: row.item.name_local,
                          id:row.item.id
                        },
                        level: {
                          level_number: data.item.level_number,
                          name: data.item.level.name,
                          name_local: data.item.level.name_local,
                        },
                      },
                      true
                    )
                  "
                />
              </div>
            </template>
          </b-table>
          
          <div v-if="tuitionType === 'tuition-fees-pg'" class="d-block">
            <div class="d-block">
              <hr />
              <span class="float-left">
                {{ $t("Theses Fees") }}
              </span>
            </div>
            <b-table
              v-if="row.item.theses"
              small
              :items="row.item.theses"
              :fields="tuitionFeesThesesFields"
              responsive
              style="text-align: center"
            >
              <template #thead-top>
                <b-tr>
                  <b-th colspan="3" class="border-left-right">
                    {{ $t("egy_pound") }}
                  </b-th>
                  <b-th colspan="3" class="border-left-right">
                    {{ $t("usd_dollar") }}
                  </b-th>
                  <b-th />
                </b-tr>
              </template>
              <template #cell(first_installment_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_local }}
                </span>
              </template>
              <template #cell(first_installment_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[0].value_usd }}
                </span>
              </template>
              <template #cell(second_installment_local)="data">
                <span>
                  {{ data.item.payment_setting_installments[1].value_local }}
                </span>
              </template>
              <template #cell(second_installment_usd)="data">
                <span>
                  {{ data.item.payment_setting_installments[1].value_usd }}
                </span>
              </template>
              <template #cell(total_local)="data">
                <span>
                  {{ data.item.value_local }}
                </span>
              </template>
              <template #cell(total_usd)="data">
                <span>
                  {{ data.item.value_usd }}
                </span>
              </template>
              <template #cell(actions)="data">
                <div>
                  <feather-icon
                    v-if="hasPermission('show_tuition_fees')"
                    v-b-tooltip.hover="$t('Global.show')"
                    icon="EyeIcon"
                    style="cursor: pointer"
                    @click="
                      showModal(
                        {
                          paymentSettingId: data.item.id,
                          faculty: {
                            name: row.item.name,
                            name_local: row.item.name_local,
                          },
                          level: {
                            name: 'Theses',
                            name_local: 'الاطروحات',
                          },
                        },
                        false
                      )
                    "
                  />
                  <feather-icon
                    v-if="
                      hasPermission('edit_tuition_fees') &&
                      data.item.can_edit == 1
                    "
                    v-b-tooltip.hover="$t('Global.edit')"
                    icon="EditIcon"
                    style="cursor: pointer"
                    @click="
                      showModal(
                        {
                          paymentSettingId: data.item.id,
                          faculty: {
                            name: row.item.name,
                            name_local: row.item.name_local,
                          },
                          level: {
                            name: 'Theses',
                            name_local: 'الاطروحات',
                          },
                        },
                        true
                      )
                    "
                  />
                </div>
              </template>
            </b-table>
            <hr />
          </div>
        </template>
      </b-table>
      </div>
      

    </b-overlay>
    <div class="all-modals">
      <!-- modal --> 
      <b-modal
        id="modal-prevent-closing"
        ref="my-modal"
        size="lg"
        :title="modal_change_fees_title"
        no-close-on-backdrop
        @show="resetModal"
        @hidden="resetModal"
        hide-footer
      >
        <div>
          <edit-tuition-fees-level
            v-if="edit"
            :data="level_item"
            :yearId="yearId"
            :paymentSettingId="paymentSettingId"
            :lookup-payment-accounts="payment_accounts"
            :inline="true"
            :loading="level_fees_loading"
            @hide="cancel()"
            @hideModal="hideModal()"
            @refresh="refresh"
          />
          <show-tuition-fees-level
            v-else
            :data="level_item"
            :yearId="yearId"
            :paymentSettingId="paymentSettingId"
            :loading="level_fees_loading"
            @hide="cancel()"
            @hideModal="hideModal()"
            :title="modal_change_fees_title"
          >
            <template #edit>
              <div class="mb-2">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.edit')"
                  style="cursor: pointer"
                  icon="EditIcon"
                  class="font-medium-3"
                  @click="openEdit()"
                />
              </div>
            </template>
          </show-tuition-fees-level>
        </div>
      </b-modal>
      <!--summer modal-->
      <b-modal
        id="modal-prevent-closing"
        ref="summer-modal"
        size="lg"
        :title="modal_change_fees_title"
        no-close-on-backdrop
        @show="resetModal"
        @hidden="resetModal"
        hide-footer
      >
        <div>
          <edit-summer-hour-fees
            v-if="edit"
            :data="level_item"
            :yearId="yearId"
            :paymentSettingId="paymentSettingId"
            :lookup-payment-accounts="payment_accounts"
            :inline="true"
            :loading="level_fees_loading"
            :lookupLevels="lookupLevels"
            @hide="cancel()"
            @hideModal="hideSummerModal()"
            @refresh="refresh"
          />
          <show-summer-hour-fees
            v-else
            :data="level_item"
            :yearId="yearId"
            :paymentSettingId="paymentSettingId"
            :loading="level_fees_loading"
            :lookupLevels="lookupLevels"
            @hide="cancel()"
            @hideModal="hideSummerModal()"
            :title="modal_change_fees_title"
          >
            <template #edit>
              <div class="mb-2">
                <feather-icon
                  v-b-tooltip.hover="$t('Global.edit')"
                  style="cursor: pointer"
                  icon="EditIcon"
                  class="font-medium-3"
                  @click="openEdit()"
                />
              </div>
            </template>
          </show-summer-hour-fees>
        </div>
      </b-modal>
      <b-modal
        ref="payment-accounts-modal"
        size="lg"
        :title="$t('edit_tuition_payment_accounts')"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <edit-payment-accounts
          :tuition-type="tuitionType"
          :year-id="yearId"
          @hideModal="hidePaymentAccountsModal"
        />
      </b-modal>
      <b-modal
        v-if="tuitionType === 'tuition-fees-ug'"
        ref="extra-ch-fees-modal"
        size="lg"
        :title="modal_change_fees_title"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <edit-extra-credit-hour-fees
          v-if="editExtraCreditHourFees"
          :data="extraCreditHourFeesData"
          :year-id="yearId"
          :payment-setting-id="paymentSettingId"
          :lookup-payment-accounts="payment_accounts"
          :inline="true"
          :maxCredit="true"
          :notSummer="true"
          :loading="extra_ch_fees_loading"
          @hideModal="hideExtraChFeesModal"
          @refresh="refresh"
          @hide="cancelExtraChFeesEdit"
        />
        <show-extra-credit-hour-fees
          v-else
          :data="extraCreditHourFeesData"
          :loading="extra_ch_fees_loading"
          :maxCredit="true"
          @hideModal="hideExtraChFeesModal"
          @refresh="refresh"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="openExtraChFeesEdit"
              />
            </div>
          </template>
        </show-extra-credit-hour-fees>
      </b-modal>
      <b-modal
      v-if="tuitionType === 'tuition-fees-ug'"
      ref="min-ch-fees-modal"
      size="lg"
      :title="modal_change_fees_title"
      no-close-on-backdrop
      hide-footer
      @show="resetModal"
      @hidden="resetModal"
    >
      <edit-extra-credit-hour-fees
        v-if="editMinCreditHourFees"
        :data="MinCreditHourFeesData"
        :year-id="yearId"
        :payment-setting-id="paymentSettingId"
        :lookup-payment-accounts="payment_accounts"
        :inline="true"
        :maxCredit="false"
        :notSummer="true"
        :loading="min_ch_fees_loading"
        @hideModal="hideMinChFeesModal"
        @refresh="refresh"
        @hide="cancelMinChFeesEdit"
      />
      <show-extra-credit-hour-fees
        v-else
        :data="MinCreditHourFeesData"
        :loading="min_ch_fees_loading"
        :maxCredit="false"
        @hideModal="hideMinChFeesModal"
        @refresh="refresh"
      >
        <template #edit>
          <div class="mb-2">
            <feather-icon
              v-b-tooltip.hover="$t('Global.edit')"
              style="cursor: pointer"
              icon="EditIcon"
              class="font-medium-3"
              @click="openExtraChFeesEdit"
            />
          </div>
        </template>
      </show-extra-credit-hour-fees>
      </b-modal>
      
      <b-modal
        ref="custom-program-modal"
        size="lg"
        :title="modal_change_fees_title"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <edit-custom-program-fees
          v-if="editCustomProgramFees"
          :data="customProgramFeesData"
          :year-id="yearId"
          :faculty-id="facutlyId"
          :tuitionType="tuitionType"
          :payment-setting-id="paymentSettingId"
          :lookup-payment-accounts="payment_accounts"
          :inline="true"
          :loading="custom_program_fees_loading"
          @hideModal="hideCustomProgramFeesModal"
          @refresh="refresh"
          @hide="cancelCustomProgramFeesEdit"
        />
        <show-custom-program-fees
          v-else
          :data="customProgramFeesData"
          :loading="custom_program_fees_loading"
          @hideModal="hideCustomProgramFeesModal"
          @refresh="refresh"
        >
          <template #edit>
            <div class="mb-2">
              <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                style="cursor: pointer"
                icon="EditIcon"
                class="font-medium-3"
                @click="openCustomProgramFeesEdit"
              />
            </div>
          </template>
        </show-custom-program-fees>
      </b-modal>
      <b-modal
        ref="due-date-modal"
        v-model="dueDateModal"
        :title="$t('Global.due_date')"
        no-close-on-backdrop
        hide-footer
        @show="resetModal"
        @hidden="resetModal"
      >
        <validation-observer ref="dueDateRules">
          <b-form>
            <div class="row">
              <div class="col-md-12">
                <b-form-group 
                  label-for="first_due_date"
                  :label="$t('Global.first_due_date')"
                  class="mb-1"
                >
                  <validation-provider
                    name="first due date"
                    #default="{ errors }"
                    rules="required"
                  >
                    <b-form-datepicker
                      v-model="due_dates.first_due_date"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="first_due_date"
                      ref="first_due_date"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('first_due_date')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "تاريخ الاستحقاق الأول مطلوب"
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </div>
              <div class="col-md-12">
                <b-form-group 
                  label-for="second_due_date"
                  :label="$t('Global.second_due_date')"
                  class="mb-2"
                >
                  <validation-provider
                    name="second due date"
                    #default="{ errors }"
                    rules="required"
                  >
                    <b-form-datepicker
                      v-model="due_dates.second_due_date"
                      :label-no-date-selected="$t('Global.no_selected')"
                      :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                      id="second_due_date"
                      ref="second_due_date"
                      :disabled="due_dates.first_due_date == null"
                      :min="due_dates.first_due_date"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('second_due_date')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "تاريخ الاستحقاق الثاني مطلوب"
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </div>
            </div>
            <b-row>
            <!-- submit and reset -->
            <b-col md="12" style="text-align:end">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-1"
                @click="saveDueDate()"
              >
                {{ $t('Global.save') }}
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="dueDateModal = false"
              >
                {{ $t('Global.cancel') }}
              </b-button>
            </b-col>
          </b-row>
          </b-form>
        </validation-observer>
      </b-modal>
    </div>
  </b-card>
</template>

<script>
import {
  BTable,
  BOverlay,
  BFormCheckboxGroup,
  BFormCheckbox,
  BFormGroup,
  BFormInput,
  BForm,
  BFormTextarea,
  BPopover,
  BFormDatepicker,
  BButton,
  BCard,
  BRow,
  BCol,
  BAvatar,
  BBadge,
  BLink,
  BSpinner,
  BTr,
  BCardHeader,
  BTh,
} from "bootstrap-vue";
import BCardActions from "@core/components/b-card-actions/BCardActions.vue";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";
import { mapActions } from "vuex";
import ShowTuitionFeesLevel from "./ShowTuitionFeesLevel";
import EditTuitionFeesLevel from "./EditTuitionFeesLevel";
import EditPaymentAccounts from "./EditPaymentAccounts";

import EditExtraCreditHourFees from "./EditExtraCreditHourFees";
import ShowExtraCreditHourFees from "./ShowExtraCreditHourFees";

import EditSummerHourFees from "./EditSummerHourFees";
import ShowSummerHourFees from "./ShowSummerHourFees";


import ShowCustomProgramFees from "./CustomPrograms/ShowCustomProgramFees";
import EditCustomProgramFees from "./CustomPrograms/EditCustomProgramFees";
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  localize,
} from "vee-validate";
import { required } from "@validations";
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    ShowCustomProgramFees,
    EditCustomProgramFees,
    EditExtraCreditHourFees,
    ShowExtraCreditHourFees,
    EditSummerHourFees,
    ShowSummerHourFees,
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    required,
    extend,
    ValidationProvider,
    ValidationObserver,
    localize,
    BFormTextarea,
    BPopover,
    BFormDatepicker,
    BFormCheckbox,
    BTr,
    BTh,
    BCardHeader,
    BTable,
    BLink,
    BCard,
    BSpinner,
    BRow,
    BCol,
    BBadge,
    BAvatar,
    BFormCheckbox,
    BFormCheckboxGroup,
    BCardActions,
    AppCollapse,
    AppCollapseItem,
    BOverlay,
    ShowTuitionFeesLevel,
    EditTuitionFeesLevel,
    EditPaymentAccounts,
  },
  directives: {
    Ripple,
  },
  props: {
    yearId: {
      default: null,
      type: String,
    },
    tuitionType: {
      default: "tuition-fees-ug",
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      tuitionFeesItems: null,
      MaxExtraCreditHoursFeesItems: null,
      MinCreditHoursFeesItems:null,
      SummerHoursFeesItems:null,
      due_dates: {
        first_due_date: null,
        second_due_date: null,
      },
      modal_change_fees_title: null,
      edit: false,
      level_item: null,
      level_fees_loading: true,
      paymentSettingId: null,

      extraCreditHourFeesData: null,
      MinCreditHourFeesData: null,
      SummerHourFeesData: null,
      editExtraCreditHourFees: null,
      editMinCreditHourFees: null,
      editSummerHourFees: null,
      extra_ch_fees_loading: true,
      min_ch_fees_loading: true,
      summer_fees_loading: true,
      lookups: null,
      payment_accounts: null,

      editCustomProgramFees: false,
      customProgramFeesData: {},
      custom_program_fees_loading: false,
      facutlyId: null,
      lookupLevels: null,
      dueDateModal: false,
    };
  },
  computed: {
    tuitionFeesFields() {
      return [
        {
          key: "levels",
          thClass: "customAction text-center",
          tdClass: "customDetailsWidth",
          label: this.$t("faculty"),
        },
      ];
    },
    tuitionFeesFacultyFields() {
      return [
        {
          key: "level_number",
          label: this.$t("#"),
        },
        {
          key: "level_name",
          label: this.$t("level"),
          thClass: "my-right-border",
        },
        {
          key: "first_installment_local",
          label: this.$t("first_installment_local"),
        },
        {
          key: "second_installment_local",
          label: this.$t("second_installment_local"),
        },
        {
          key: "total_local",
          label: this.$t("total_local"),
        },
        {
          key: "first_installment_usd",
          label: this.$t("first_installment_usd"),
          //variant: 'secondary',
          thClass: "my-left-border",
        },
        {
          key: "second_installment_usd",
          label: this.$t("second_installment_usd"),
          //variant: 'secondary',
        },
        {
          key: "total_usd",
          label: this.$t("total_usd"),
          //variant: 'secondary',
        },
        {
          key: "actions",
          label: this.$t("actions"),
          thClass: "my-left-border",
        },
      ];
    },
    summerFeesFacultyFields() {
      return [
        {
          key: "level_number",
          label: this.$t("#"),
        },
        {
          key: "level_name",
          label: this.$t("level"),
          thClass: "my-right-border",
        },
        
        {
          key: "total_local",
          label: this.$t("total_local"),
        },
       
        {
          key: "total_usd",
          label: this.$t("total_usd"),
          //variant: 'secondary',
        },
        {
          key: "actions",
          label: this.$t("actions"),
          thClass: "my-left-border",
        },
      ];
    },
    tuitionFeesFacultyProgramsFields() {
      return [
        {
          key: "program",
          label: this.$t("program"),
        },
        {
          key: "level_name",
          label: this.$t("level"),
          thClass: "my-right-border",
        },
        {
          key: "first_installment_local",
          label: this.$t("first_installment_local"),
        },
        {
          key: "second_installment_local",
          label: this.$t("second_installment_local"),
        },
        {
          key: "total_local",
          label: this.$t("total_local"),
        },
        {
          key: "first_installment_usd",
          label: this.$t("first_installment_usd"),
          //variant: 'secondary',
          thClass: "my-left-border",
        },
        {
          key: "second_installment_usd",
          label: this.$t("second_installment_usd"),
          //variant: 'secondary',
        },
        {
          key: "total_usd",
          label: this.$t("total_usd"),
          //variant: 'secondary',
        },
        {
          key: "actions",
          label: this.$t("actions"),
          thClass: "my-left-border",
        },
      ];
    },
    tuitionFeesThesesFields() {
      return [
        {
          key: "first_installment_local",
          label: this.$t("first_installment_local"),
        },
        {
          key: "second_installment_local",
          label: this.$t("second_installment_local"),
        },
        {
          key: "total_local",
          label: this.$t("total_local"),
        },
        {
          key: "first_installment_usd",
          label: this.$t("first_installment_usd"),
          //variant: 'secondary',
          thClass: "my-left-border",
        },
        {
          key: "second_installment_usd",
          label: this.$t("second_installment_usd"),
          //variant: 'secondary',
        },
        {
          key: "total_usd",
          label: this.$t("total_usd"),
          //variant: 'secondary',
        },
        {
          key: "actions",
          label: this.$t("actions"),
          thClass: "my-left-border",
        },
      ];
    },
    MaxExtraCreditHoursFields() {
      return [
        {
          key: "faculty",
          label: this.$t("faculty"),
        },
        {
          key: "max_credit_hours",
          label: this.$t("max_credit_hours"),
        },
        {
          key: "value_local",
          label: this.$t("value_local"),
        },
        {
          key: "value_usd",
          label: this.$t("value_usd"),
        },
        {
          key: "actions",
          label: this.$t("actions"),
          thClass: "my-left-border",
        },
      ];
    },
    MinCreditHoursFields() {
      return [
        {
          key: "faculty",
          label: this.$t("faculty"),
        },
        {
          key: "min_credit_hours",
          label: this.$t("min_credit_hours"),
        },
        {
          key: "value_local",
          label: this.$t("value_local"),
        },
        {
          key: "value_usd",
          label: this.$t("value_usd"),
        },
        {
          key: "actions",
          label: this.$t("actions"),
          thClass: "my-left-border",
        },
      ];
    },
    SummerHoursFields() {
      return [
        {
          key: "faculty",
          label: this.$t("faculty"),
        },
        // {
        //   key: "min_credit_hours",
        //   label: this.$t("min_credit_hours"),
        // },
        {
          key: "value_local",
          label: this.$t("value_local"),
        },
        {
          key: "value_usd",
          label: this.$t("value_usd"),
        },
        {
          key: "actions",
          label: this.$t("actions"),
          thClass: "my-left-border",
        },
      ];
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getTuitionFees: "yearPayments/getTuitionFees",
      getLevelPaymentSettings: "yearPayments/getLevelPaymentSettings",
      getSummerPaymentSettings: "yearPayments/getSummerPaymentSettings",
      getPaymentSetting: "yearPayments/getPaymentSetting",
      removePaymentSetting: "yearPayments/removePaymentSetting",
      getLookups: "app/GET_LOOKUPS",
      editDueDate: "yearPayments/editDueDate",
    }),
    init() {
      this.loading = true;
      this.getTuitionFees({ yearId: this.yearId, type: this.tuitionType })
        .then((response) => {
          if (this.tuitionType === "tuition-fees-ug") {
            this.tuitionFeesItems = response.data.tuition_fees;
            this.MaxExtraCreditHoursFeesItems =
              response.data.max_extra_credit_hour_fees;
            this.MinCreditHoursFeesItems =
              response.data.min_credit_hour_fees;
            this.SummerHoursFeesItems = 
              response.data.summer_hour_fees;    
            this.due_dates.first_due_date = response.data.due_dates
              ? response.data.due_dates.first_due_date
              : null;
            this.due_dates.second_due_date = response.data.due_dates
              ? response.data.due_dates.second_due_date
              : null;
          } else {
            this.tuitionFeesItems = response.data.tuition_fees;
            this.due_dates.first_due_date = response.data.due_dates
              ? response.data.due_dates.first_due_date
              : null;
            this.due_dates.second_due_date = response.data.due_dates
              ? response.data.due_dates.second_due_date
              : null;
          }
        })
        .finally(() => {
          this.loading = false;
        });

      // if (this.tuitionType === 'tuition-fees-ug') {
      // get payment accounts lookup
      const lookupPayload = {
        payment_accounts: true,
      };
      this.getLookups(lookupPayload).then((data) => {
        this.lookups = data.success;
        this.payment_accounts = this.lookups.payment_accounts;
      });
      // }
    },
    refresh() {
      this.init();
    },
    resetModal() {},
    updateFees() {},
    showModal(data, showEdit = false) {
      this.paymentSettingId = data.paymentSettingId;

      this.modal_change_fees_title = this.$t("level_tuition_fees", {
        faculty: this.getTranslatedNameFromObject(data.faculty),
        level: this.getTranslatedNameFromObject(data.level),
      });

      // get level settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
      };
      this.edit = false;
      this.level_fees_loading = true;
      this.getLevelPaymentSettings(payload)
        .then((response) => {
          this.level_item = response.data;
          this.edit = showEdit;
        })
        .finally(() => {
          this.level_fees_loading = false;
        });

      // show modal
      this.$refs["my-modal"].toggle("#toggle-btn");
    },
    showSummerModal(data, showEdit = false) {
      console.log(data.faculty);
      this.paymentSettingId = data.paymentSettingId;
      this.modal_change_fees_title = this.$t("level_tuition_fees", {
        faculty: this.getTranslatedNameFromObject(data.faculty),
        level: this.getTranslatedNameFromObject(data.level),
      });

      // get level settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
      };
      this.edit = false;
      this.level_fees_loading = true;
      this.getSummerPaymentSettings(payload)
        .then((response) => {
          this.level_item = response.data;
          this.edit = showEdit;
        })
        .finally(() => {
          this.level_fees_loading = false;
        });

        const lookupPayload = {
          faculty_level: data.faculty.id,
      };
      this.getLookups(lookupPayload).then((data) => {
        console.log(data.success.facultyLevel)
        this.lookups = data.success;
        this.lookupLevels = this.lookups.facultyLevel;
      });

      // show modal
      this.$refs["summer-modal"].toggle("#toggle-btn");
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    hideSummerModal() {
      this.$refs["summer-modal"].hide();
    },
    hideExtraChFeesModal() {
      this.$refs["extra-ch-fees-modal"].hide();
    },
    hideMinChFeesModal() {
      this.$refs["min-ch-fees-modal"].hide();
    },
    hideSummerFeesModal() {
      this.$refs["summer-fees-modal"].hide();
    },
    hideCustomProgramFeesModal() {
      this.$refs["custom-program-modal"].hide();
    },
    cancel() {
      this.edit = false;
    },
    cancelExtraChFeesEdit() {
      this.editExtraCreditHourFees = false;
    },
    cancelMinChFeesEdit() {
      this.editMinCreditHourFees = false;
    },
    cancelSummerFeesEdit() {
      this.editSummerHourFees = false;
    },
    cancelCustomProgramFeesEdit() {
      this.editCustomProgramFees = false;
    },
    openEdit() {
      this.edit = true;
    },
    openExtraChFeesEdit() {
      this.editExtraCreditHourFees = true;
    },
    openMinChFeesEdit() {
      this.editMinCreditHourFees = true;
    },
    openCustomProgramFeesEdit() {
      this.editCustomProgramFees = true;
    },
    editPaymentAccounts() {
      this.$refs["payment-accounts-modal"].show();
    },
    hidePaymentAccountsModal() {
      this.$refs["payment-accounts-modal"].hide();
    },

    showExtraCreditHourFeesModal(item, showEdit = false) {
      this.extra_ch_fees_loading = true;

      this.paymentSettingId = item.paymentSettingId;

      this.modal_change_fees_title = this.$t("extra_ch_fees_title", {
        faculty: this.getTranslatedNameFromObject(item.faculty),
      });

      // get level settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
      };

      this.getPaymentSetting(payload)
        .then((response) => {
          this.extraCreditHourFeesData = response.data;
        })
        .finally(() => {
          this.editExtraCreditHourFees = showEdit;
          this.extra_ch_fees_loading = false;
        });

      // show modal
      this.$refs["extra-ch-fees-modal"].show();
    },

    showMinCreditHourFeesModal(item, showEdit = false) {
      this.min_ch_fees_loading = true;

      this.paymentSettingId = item.paymentSettingId;
      console.log(item);
      this.modal_change_fees_title = this.$t("min_ch_fees_title", {
        faculty: this.getTranslatedNameFromObject(item.faculty),
      });

      // get level settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
      };

      this.getPaymentSetting(payload)
        .then((response) => {
          this.MinCreditHourFeesData = response.data;
        })
        .finally(() => {
          this.editMinCreditHourFees = showEdit;
          this.min_ch_fees_loading = false;
        });

      // show modal
      this.$refs["min-ch-fees-modal"].show();
    },

    showSummertHourFeesModal(item, showEdit = false) {
      this.summer_fees_loading = true;

      this.paymentSettingId = item.paymentSettingId;
      this.modal_change_fees_title = this.$t("summer_fees_title", {
        faculty: this.getTranslatedNameFromObject(item.faculty),
      });

      // get level settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
      };

      this.getPaymentSetting(payload)
        .then((response) => {
          this.SummerHourFeesData = response.data;
        })
        .finally(() => {
          this.editSummerHourFees = showEdit;
          this.summer_fees_loading = false;
        });

      // show modal
      this.$refs["summer-fees-modal"].show();
    },

    showCustomProgramModal(item, showEdit = false) {
      this.custom_program_fees_loading = true;

      this.paymentSettingId = item.paymentSettingId;

      this.modal_change_fees_title = this.$t("custom_program_fees_title", {
        level: this.getTranslatedNameFromObject(item.level),
        program: this.getTranslatedNameFromObject(item.program),
      });

      // get level settings
      const payload = {
        yearId: this.yearId,
        paymentSettingId: this.paymentSettingId,
      };

      this.getPaymentSetting(payload)
        .then((response) => {
          this.customProgramFeesData = response.data;
          this.facutlyId = response.data.payment_setting.faculty_id;
        })
        .finally(() => {
          this.editCustomProgramFees = showEdit;
          this.custom_program_fees_loading = false;
          // show modal
          this.$refs["custom-program-modal"].show();
        });
    },

    addCustomProgramFeesModal(facultyId) {
      this.customProgramFeesData = null;
      this.paymentSettingId =
        this.tuitionType == "tuition-fees-ug"
          ? "create-custom-program-fees-ug"
          : "create-custom-program-fees-pg";

      this.modal_change_fees_title = this.$t("Add Custom Program Fees");
      this.editCustomProgramFees = true;
      this.custom_program_fees_loading = false;

      this.facutlyId = facultyId;

      // show modal
      this.$refs["custom-program-modal"].show();
    },

    removePaymentSettingBtn(paymentSettingId) {
      const payload = {
        yearId: this.yearId,
        paymentSettingId,
      };

      this.$swal({
        title: this.$t("Global.deleteTitle"),
        text: this.$t("Global.deleteText"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("Global.cancel"),
        confirmButtonText: this.$t("Global.deleteBtn"),
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.load = true;
          this.removePaymentSetting(payload).finally((_) => {
            this.refresh();
          });
        }
      });
    },

    showDueDateModal(type) {
      this.dueDateModal = true;
    },

    saveDueDate(){
      this.$refs.dueDateRules.validate().then(success => {
        if (success) {
          const payload = { yearId: this.id , type: this.tuitionType , query:this.due_dates }
          this.editDueDate(payload)
          .then(response => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.refresh();
            this.dueDateModal = false;
          })
          .catch(error => {
            const errors = [error.response.data.errors]
            errors.forEach((error, index) => {
              this.errorsdata = error
            })
          })
        }
      })
    },
    addMinExtraCreditHour(){
      alert()
    }
  },
};
</script>

<style>
.remove-padding {
  padding-left: 0;
  padding-right: 0;
}
.facultyWidth {
  width: 15%;
  text-align: start;
}
.b-table .border-left-right {
  border-left: 2px solid #cbcbcbde;
  border-right: 2px solid #cbcbcbde;
}

.b-table .my-left-border {
  border-left: 2px solid #cbcbcbde;
}

.b-table .my-right-border {
  border-right: 2px solid #cbcbcbde;
}
@media ((min-width: 992px)) {
  .modal-lg {
    max-width: 950px !important;
  }
}
</style>
