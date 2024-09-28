<template>
  <div>
    <b-row>
      <b-col cols="12" xl="12" lg="12" md="12">
        <div class="custom_actions mr-1" v-if="item">
          <b-dropdown
            v-if="hasPermission('edit_payment')"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            :text="$t('Global.more')"
            right
            size="sm"
            variant="outline-primary"
          >
            <b-dropdown-item
              variant="primary"
              v-if="hasPermission('edit_payment')"
              @click="exportInvoice()"
            >
              {{ $t("Global.export_invoice") }}
            </b-dropdown-item>
            <b-dropdown-item
              variant="primary"
              v-if="hasPermission('edit_payment')"
              @click="dueDateModel = true"
            >
              {{ $t("Global.edit_due_date") }}
            </b-dropdown-item>
            <b-dropdown-item
              variant="primary"
              v-if="hasPermission('edit_payment') && item.canManualPay"
              @click="openPaymentModel()"
            >
              {{ $t("Global.manual_payment") }}
            </b-dropdown-item>
            <b-dropdown-item
              variant="primary"
              v-if="hasPermission('access_refund_payment') && item.status.id != 0 && item.can_refund"
              @click="openRefundModel(item)"
            >
              {{ $t("Global.cancel_enrollment") }}
            </b-dropdown-item>
            <!-- <b-dropdown-item
              v-if="hasPermission('access_direct_cashback_payment') && item.status.id != 0 && item.can_refund"
              variant="primary"
              @click="openCashbackModal(item)"
            >
              {{ $t("Global.direct_cashback") }}
            </b-dropdown-item> -->
            <!-- <b-dropdown-item
              v-if="hasPermission('access_scholarship_payment') && item.can_scholarship"
              variant="primary"
              @click="openScholarshipModal(item)"
            >
              {{ $t("Global.scholarship") }}
            </b-dropdown-item> -->
            <b-dropdown-item
              variant="primary"
              v-if="hasPermission('edit_payment') && item.canMakeInstallment"
              @click="openInstallmentsModel()"
            >
              {{ $t("Global.create_installments") }}
            </b-dropdown-item>
            <b-dropdown-item
              variant="primary"
              v-if="hasPermission('access_payment_order_payment')"
              @click="openPaymentOrderModel()"
            >
              {{ $t("Global.create_payment_order") }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </b-col>
    </b-row>
    <b-card class="mb-0">
      <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
        <b-tab>
          <template #title>
            <feather-icon icon="InfoIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template
          >
          <ShowComponent
            v-if="item"
            :data="item"
            :only="
            item.parent_payment ?
            [
              'id',
              'service',
              'amount',
              'created_by',
              'created_at',
              'currency',
              'due_date',
              'paid',
              'paid_at',
              'status',
              'user',
              'scholarship',
              'parent_payment'
            ]
            :
            [
              'id',
              'service',
              'amount',
              'created_by',
              'created_at',
              'currency',
              'due_date',
              'paid',
              'paid_at',
              'status',
              'user',
            ]
            "
            :loading="load"
          >
            <template #id="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Id`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.id">
                  {{ data.id }}
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #service="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`service`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.service">
                  {{ 
                    $i18n.locale == "ar"
                        ? data.service.name_local
                        : data.service.name 
                  }}
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #parent_payment="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Original Invoice ID`) }}
              </th>
              <td class="d-flex flex-wrap">
                <b-link
                  v-if="data.parent_payment"
                  target="_blank"
                  :to="{ name: 'payment', params: { id: data.parent_payment.id } }"
                >
                  <strong>
                    {{ 
                      data.parent_payment.id 
                    }}
                  </strong>
                </b-link>
                <div v-else>-</div>
              </td>
            </template>
            <template #amount="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`amount`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.amount">
                  {{ data.amount }}
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #user="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.user`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong>
                  <b-link
                    :to="{
                      name: data.type == 4 ? 'applicant' : 'student-show',
                      params:
                        data.type == 4
                          ? { id: data.applicant.id }
                          : { id: data.user.id },
                    }"
                    v-b-tooltip.hover="
                      $i18n.locale == 'ar'
                        ? data.user.name_local
                        : data.user.name
                    "
                  >
                    {{
                      $i18n.locale == "ar"
                        ? data.user.name_local
                        : data.user.name
                    }}
                  </b-link>
                </strong>
              </td>
            </template>
            <template #created_by="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.created_by`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.created_by">
                  <b-link
                  v-if="data.created_by"
                  target="_blank"
                  :to="{ name: 'user-show', params: { id: data.created_by.id } }"
                  v-b-tooltip.hover="
                      $i18n.locale == 'ar'
                        ? data.created_by.name_local
                        : data.created_by.name
                    "
                >
                  <strong>
                    {{ 
                      $i18n.locale == 'ar'
                        ? data.created_by.name_local
                        : data.created_by.name
                    }}
                  </strong>
                </b-link>
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #created_at="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.created_at`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.created_at">
                  {{moment(data.created_at).utc().format('YYYY-MM-DD HH:MM:SS')}}
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #paid_at="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.paid_at`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.paid_at">
                  {{moment(data.paid_at).utc().format('YYYY-MM-DD HH:MM:SS')}}
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #currency="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.currency`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.currency">
                  {{
                    $i18n.locale == "ar"
                      ? data.currency.name_local
                      : data.currency.name
                  }}
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #due_date="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.due_date`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.due_date">
                  {{ data.due_date }}
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #paid="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.paid`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.paid">
                  {{ data.paid }}
                </strong>
                <div v-else></div>
              </td>
            </template>
            <template #scholarship="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Scholarships`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.scholarship">
                  <p class="m-0" v-for="item in data.scholarship" :key="item.id">
                    {{ 
                      $i18n.locale == "ar"
                      ? item.name_local
                      : item.name 
                    }}
                  </p>
                </strong>
                <div v-else>-</div>
              </td>
            </template>
            <template #status="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.status`) }}
              </th>
              <td class="d-flex flex-wrap">
                <b-badge
                  pill
                  v-if="data.status"
                  :variant="`${getCustomStatus(data.status.id).color}`"
                  class="text-capitalize"
                >
                  {{
                    $i18n.locale == "ar"
                      ? data.status.name_local
                      : data.status.name
                  }}
                </b-badge>
              </td>
            </template>
          </ShowComponent>
        </b-tab>
        <!-- <b-tab>
                    <template #title>
                        <feather-icon icon="CommandIcon"/>
                        <span>{{ $t('Global.services') }}</span></template>
                    <ShowTable v-if="item" :loading="load" title="Services" :items="item.items"
                               :fields="[{label:$t('Global.created_by'), key:'created_by'}, {label:$t('Global.amount'), key:'amount'}, {label:$t('Global.service'), key:'service'}]"/>
                </b-tab> -->
        <b-tab>
          <template #title>
            <feather-icon icon="LayersIcon" />
            <span>{{ $t("Global.installments") }}</span></template
          >
          <ShowTable
            v-if="item"
            :loading="load"
            title="Installments"
            :items="item.installments"
            :canMakeInstallment="item.canMakeInstallment"
            @refresh="init()"
            :fields="[
              { label: $t('amount'), key: 'amount' },
              { label: $t('Global.status'), key: 'status' },
              { label: $t('Global.due_date'), key: 'due_date' },
              { label: $t('Global.actions'), key: 'actions' },
            ]"
          />
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="DollarSignIcon" />
            <span>{{ $t("transactions") }}</span></template
          >
          <Transactions v-if="!load" :payment_id="id" @refresh="init()"/>
        </b-tab>
        <b-tab>
          <template #title>
            <feather-icon icon="AlignRightIcon" />
            <span>{{ $t("items") }}</span></template
          >
          <PaymentstItems @init="init"  v-if="!load" />
        </b-tab>
        <!-- <b-tab>
          <template #title>
            <feather-icon icon="ActivityIcon" />
            <span>{{ $t("history") }}</span></template
          >
          <PaymentsHistory :ascomponent="true" />
        </b-tab> -->
      </b-tabs>
    </b-card>
    <b-modal
      ref="my-modal"
      no-close-on-backdrop
      v-model="paymentModel"
      :title="$t('Global.payment_info')"
      size="lg"
    >
      <validation-observer ref="simpleRules">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="6">
              <b-form-group :label="$t('amount')" label-for="first_instalment">
                <validation-provider
                  #default="{ errors }"
                  name="amount"
                  rules="required"
                >
                  <b-form-input
                    v-model="form.amount"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                :label="$t('Global.pay_number')"
                label-for="pay_number"
              >
                <validation-provider
                  #default="{ errors }"
                  name="pay_number"
                  rules="required"
                >
                  <b-form-input
                    v-model="form.payment_number"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                :label="$t('Global.paid_at')"
                label-for="end-input"
              >
                <validation-provider
                  #default="{ errors }"
                  name="end_date"
                  rules="required"
                >
                  <b-form-datepicker
                    id="end-input"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }"
                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                    v-model="form.pay_date"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">
                    {{ validation(null, 0).message }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.file')" label-for="code-input">
                <b-form-file
                  v-model="form.file"
                  :placeholder="$t('Global.paymentFile')"
                  drop-placeholder="Drop file here..."
                />
              </b-form-group>
              <!-- <div class="mt-3">{{$t('Global.selected_file')}} {{ form.file ? form.file.name : '' }}
                                          </div> -->
            </b-col>
            <b-col md="12">
              <b-form-group
                :label="$t('Provider')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bank"
                  rules="required"
                >
                  <v-select
                    v-model="form.bank_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options ? options.banks : []"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.name_local +
                            "(" +
                            option.account_number +
                            ")"
                          : option.name + "(" + option.account_number + ")"
                      }}
                    </template>
                    <template
                      #selected-option="{ name, name_local, account_number }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          name_local + "(" + account_number + ")"
                        }}</strong>
                        <strong v-else
                          >{{ name + "(" + account_number + ")" }}
                        </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
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
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submit"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="paymentModel = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal
      ref="my-modal"
      no-close-on-backdrop
      v-model="dueDateModel"
      :title="$t('Global.edit_due_date')"
      size="lg"
    >
      <validation-observer ref="simpleRulesDueDate">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="12">
              <b-form-group
                :label="$t('Global.due_date')"
                label-for="end-input"
              >
                <validation-provider
                  #default="{ errors }"
                  name="end_date"
                  rules="required"
                >
                  <b-form-datepicker
                    id="end-input"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }"
                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                    :label-no-date-selected="$t('Global.no_selected')"
                    v-model="item.due_date"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">
                    {{ validation(null, 0).message }}
                  </small>
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
              @click="submitDueDate"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="dueDateModel = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal
      ref="my-modal"
      no-close-on-backdrop
      @hide="resetRefundModel"
      v-model="refundModel"
      :title="$t('Global.refund_info')"
      size="lg"
    >
      <validation-observer ref="simpleRulesRefund">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="12">
              <b-form-group :label="$t('Refunded Value')" label-for="amount">
                <validation-provider
                  #default="{ errors }"
                  name="amount"
                  :rules="`required|between:0,${this.item.paid}`"
                >
                  <b-form-input
                    v-model="ruleForm.amount"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <!-- <b-col md="12">
              <b-form-group
                :label="$t('Provider')"
                label-for="Provider"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bank"
                  rules="required"
                >
                  <v-select
                    v-model="ruleForm.bank_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options ? options.banks : []"
                    :clearable="false"
                    input-id="Provider"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.name_local +
                            "(" +
                            option.account_number +
                            ")"
                          : option.name + "(" + option.account_number + ")"
                      }}
                    </template>
                    <template
                      #selected-option="{ name, name_local, account_number }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          name_local + "(" + account_number + ")"
                        }}</strong>
                        <strong v-else
                          >{{ name + "(" + account_number + ")" }}
                        </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col> -->
            <!-- <b-col md="12">
              <b-form-group :label="$t('type')" label-for="payType">
                <validation-provider
                  #default="{ errors }"
                  name="payType"
                  :rules="`required`"
                >
                  <v-select 
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" 
                    v-model="ruleForm.type"
                    :options="payType" 
                    class="w-100" 
                    disabled
                    :reduce="val => val.value"
                    :placeholder="$t('Global.type')"
                  >
                    <template slot="selected-option" slot-scope="option">
                      <span>
                        {{ $i18n.locale == 'ar' ? option.label_local : option.label }}
                      </span>
                    </template>
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.label_local : option.label }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col> -->
            <b-col md="12">
              <b-form-group :label="$t('Beneficiary')" label-for="beneficiary">
                <validation-provider
                  #default="{ errors }"
                  name="beneficiary"
                  :rules="`required`"
                >
                  <b-form-input
                    v-model="ruleForm.beneficiary"
                    type="text"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    errors[0]
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group :label="$t('Global.notes')" label-for="code-input">
                <b-form-textarea
                  v-model="ruleForm.notes"
                  :placeholder="$t('Global.notes')"
                />
              </b-form-group>
            </b-col>
            <b-col md="12">
              <h6 class="mt-2">
                  {{ $t('Items') }}
              </h6>
              <b-overlay
                :show="loadPaymentItems"
                rounded="sm"
              >
                <table
                  class="table table-striped custom_table text_nobreak"
                >
                  <thead>
                    <th> {{ $t('item') }} </th>
                    <th> {{ $t('Original Values') }} </th>
                    <th> {{ $t('Refunded Values') }} </th>
                    <th> {{ $t('Cancellation Fees Values') }} </th>
                  </thead>
                  <tbody style="text-align: initial" class="new_edit">
                    <tr v-for="(item,index) in paymentItems" :key="item.id">
                      <td>
                        {{ $i18n.locale == 'ar' ? item.name_local : item.name }}
                      </td>
                      <td>
                        <!-- {{ itemSuggestionValues.length > 0 ? itemSuggestionValues[index] : Math.round((item.amount/paidAmount)*cashbackForm.amount) }} -->
                        {{originalValues[index]}}
                      </td>
                      <td>
                        <b-form-group
                          class="left_right"
                          label-for="final"
                        >
                          <validation-provider
                            #default="{ errors }"
                            :name="$t('final')"
                            rules="required"
                          >
                            <b-form-input
                              v-model="final[index]"
                              type="number"
                              :state="errors.length > 0 ? false : null"
                            />
                            <small v-if="errors.length" class="text-danger">
                              {{ validation(null, 0).message }}
                            </small>
                          </validation-provider>
                        </b-form-group>
                      </td>
                      <td>
                        <!-- {{ itemSuggestionValues.length > 0 ? itemSuggestionValues[index] : Math.round((item.amount/paidAmount)*cashbackForm.amount) }} -->
                        {{remainingValues[index]}}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <th>
                      {{ $t('total') }}
                    </th>
                    <th>
                      <!-- {{ totalSuggestionValues > 0 ? totalSuggestionValues : paidAmount  }} -->
                      {{totalOriginalValues}}
                    </th>
                    <th>
                      <!-- {{ totalFinalValues > 0 ? totalFinalValues : paidAmount }} -->
                      {{totalFinalValues}}
                    </th>
                    <th>
                      <!-- {{ totalFinalValues > 0 ? totalFinalValues : paidAmount }} -->
                      {{totalRemainingValues}}
                    </th>
                  </tfoot>
                </table>
                <small v-if="totalFinalValues > totalOriginalValues" class="text-danger">
                  {{ $i18n.locale == 'ar' ?  'المجموع النهائي يجب ان يكون اقل من او يساوي المجموع الاصلي' : 'Total Final must be less than or equal Total Suggested' }}
                </small>
              </b-overlay>
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
              @click="submitRefund"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="refundModel = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal
      ref="my-modal"
      no-close-on-backdrop
      v-model="installmentsModel"
      :title="$t('Global.create_installments')"
      size="lg"
    >
      <validation-observer ref="simpleRulesInstallments">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row pt-1">
            <b-col md="6">
              <b-form-group
                :label="$t('Global.num_of_installments')"
                label-for="num_of_installments"
              >
                <validation-provider
                  #default="{ errors }"
                  name="num_of_installments"
                  rules="required"
                >
                  <b-form-input
                    v-model="installmentsForm.num_of_installments"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                :label="$t('Global.num_of_months')"
                label-for="num_of_months"
              >
                <validation-provider
                  #default="{ errors }"
                  name="num_of_months"
                  rules="required"
                >
                  <b-form-input
                    v-model="installmentsForm.num_of_months"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <!-- <b-col md="12">
              <b-form-group
                class="left_right"
                :label="$t('Global.notes')"
                label-for="notes"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.notes')"
                  rules="required"
                >
                  <b-form-textarea
                    id="notes"
                    v-model="installmentsForm.notes"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col> -->
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
              @click="submitInstallments"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="installmentsModel = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal
      ref="my-modal"
      no-close-on-backdrop
      v-model="paymentorderModel"
      :title="$t('Global.create_payment_order')"
      size="sm"
    >
      <validation-observer ref="simpleRulesInstallments">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row pt-1">
            <b-col md="12">
              <b-form-group
                :label="$t('Global.bankInfo')"
                label-for="bank"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bank"
                  rules="required"
                >

                  <v-select
                    v-model="paymentOrder.bank_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options ? options.banks_infos : []"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.bank_name.name_local +
                            " (" +
                            option.account_number +
                            ")"
                          : option.bank_name.name + " (" + option.account_number +", "+option.currency.code+ ")"
                      }}
                    </template>
                    <template
                      #selected-option="{ bank_name, account_number,currency }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          bank_name.name_local + " (" + account_number +", "+currency.code+ ")"
                        }}</strong>
                        <strong v-else
                          >{{ bank_name.name + " (" + account_number+", "+currency.code+ ")" }}
                        </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>

            </b-col>
          </div>
          <!-- <div class="row pt-1">
            <b-col md="12">
              <b-form-group
                :label="$t('Global.notes')"
                label-for="notes"
              >
                <validation-provider
                  #default="{ errors }"
                  name="notes"
                  
                >
                  <b-form-textarea
                    v-model="paymentOrder.notes"
                    type="text"
                    rows="3"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </div> -->
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submitPaymentOrder"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="paymentorderModel = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal
      ref="direct_cashback_modal"
      no-close-on-backdrop
      @hide="resetCashbackModal"
      v-model="cashbackModal"
      :title="$t('Global.direct_cashback')"
      size="lg"
    >
      <validation-observer ref="simpleRulesCashback">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row pt-1">
            <b-col md="6">
              <b-form-group
                class="left_right"
                :label="$t('amount')"
                label-for="amount"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('amount')"
                  :rules="`required|between:0,${paidAmount}`"
                >
                  <b-form-input
                    v-model="cashbackForm.amount"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                  
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group 
                :label="$t('Global.file')" 
                label-for="code-input"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('amount')"
                >
                  <b-form-file
                    v-model="cashbackForm.file"
                    :placeholder="$t('Global.paymentFile')"
                    drop-placeholder="Drop file here..."
                  />
                <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                :label="$t('Provider')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bank"
                  rules="required"
                >
                  <v-select
                    v-model="cashbackForm.bank_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options ? options.banks : []"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.name_local +
                            "(" +
                            option.account_number +
                            ")"
                          : option.name + "(" + option.account_number + ")"
                      }}
                    </template>
                    <template
                      #selected-option="{ name, name_local, account_number }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          name_local + "(" + account_number + ")"
                        }}</strong>
                        <strong v-else
                          >{{ name + "(" + account_number + ")" }}
                        </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12" v-if="item.service.type == 1 || item.service.type == 2">
              <b-form-group
                class="my-2"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <b-form-checkbox
                  id="checkbox-1"
                  v-model="cashbackForm.transfer_out"
                  name="checkbox-1"
                  :value="true"
                  :unchecked-value="false"
                >
                  {{$t('Global.transfer_out')}}
                </b-form-checkbox>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                class="left_right"
                :label="$t('Global.notes')"
                label-for="notes"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.notes')"
                  rules="required"
                >
                  <b-form-textarea
                    id="notes"
                    v-model="cashbackForm.notes"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <h6 class="mt-2">
                  {{ $t('Items') }}
              </h6>
              <b-overlay
                :show="loadPaymentItems"
                rounded="sm"
              >
                <table
                  class="table table-striped custom_table text_nobreak"
                >
                  <thead>
                    <th> {{ $t('item') }} </th>
                    <th> {{ $t('original') }} </th>
                    <th> {{ $t('final') }} </th>
                  </thead>
                  <tbody style="text-align: initial" class="new_edit">
                    <tr v-for="(item,index) in paymentItems" :key="item.id">
                      <td>
                        {{ $i18n.locale == 'ar' ? item.name_local : item.name }}
                      </td>
                      <td>
                        <!-- {{ itemSuggestionValues.length > 0 ? itemSuggestionValues[index] : Math.round((item.amount/paidAmount)*cashbackForm.amount) }} -->
                        {{originalValues[index]}}
                      </td>
                      <td>
                        <b-form-group
                          class="left_right"
                          label-for="final"
                        >
                          <validation-provider
                            #default="{ errors }"
                            :name="$t('final')"
                            rules="required"
                          >
                            <b-form-input
                              v-model="final[index]"
                              type="number"
                              :state="errors.length > 0 ? false : null"
                            />
                            <small v-if="errors.length" class="text-danger">
                              {{ validation(null, 0).message }}
                            </small>
                          </validation-provider>
                        </b-form-group>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <th>
                      {{ $t('total') }}
                    </th>
                    <th>
                      <!-- {{ totalSuggestionValues > 0 ? totalSuggestionValues : paidAmount  }} -->
                      {{totalOriginalValues}}
                    </th>
                    <th>
                      <!-- {{ totalFinalValues > 0 ? totalFinalValues : paidAmount }} -->
                      {{totalFinalValues}}
                    </th>
                  </tfoot>
                </table>
                <small v-if="totalFinalValues > totalOriginalValues" class="text-danger">
                  {{ $i18n.locale == 'ar' ?  'المجموع النهائي يجب ان يكون اقل من او يساوي المجموع الاصلي' : 'Total Final must be less than or equal Total Suggested' }}
                </small>
              </b-overlay>
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
              :disabled="totalFinalValues > totalOriginalValues || validationCheck"
              @click="submitCashback()"
            >
              {{ $t("Global.submit") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="cashbackModal = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
    <b-modal
      ref="scholarship_modal"
      no-close-on-backdrop
      @hide="resetScholarshipModal"
      v-model="scholarshipModal"
      :title="$t('Global.scholarship')"
      size="lg"
    >
      <validation-observer ref="simpleRulesScholarship">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row pt-1">
            <b-col md="6">
              <b-form-group
                class="left_right"
                :label="$t('amount')"
                label-for="amount"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('amount')"
                  :rules="`required|between:0,${paymentAmount}`"
                >
                  <b-form-input
                    v-model="scholarshipForm.amount"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                  
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group 
                :label="$t('Global.file')" 
                label-for="code-input"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('amount')"
                >
                  <b-form-file
                    v-model="scholarshipForm.file"
                    :placeholder="$t('Global.paymentFile')"
                    drop-placeholder="Drop file here..."
                  />
                <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6" v-if="item.installments && item.installments.length > 0">
              <b-form-group
                class="left_right"
                :label="$t('first_installment_deduction')"
                label-for="first_installment"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('first_installment')"
                  :rules="`required|between:0,${item.installments[0].amount}`"
                >
                  <b-form-input
                    v-model="scholarshipForm.first_installment"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                  
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6" v-if="item.installments && item.installments.length > 0">
              <b-form-group
                class="left_right"
                :label="$t('second_installment_deduction')"
                label-for="second_installment"
              >
                <validation-provider
                  #default="{ errors }"
                  :name="$t('second_installment')"
                  :rules="`required|between:0,${totalFinalValues}`"
                >
                  <b-form-input
                    v-model="scholarshipForm.second_installment"
                    :disabled="true"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                  
                </validation-provider>
              </b-form-group>
            </b-col>
            <!-- <b-col md="12">
              <b-form-group
                :label="$t('Provider')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bank"
                  rules="required"
                >
                  <v-select
                    v-model="scholarshipForm.bank_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options ? options.banks : []"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.name_local +
                            "(" +
                            option.account_number +
                            ")"
                          : option.name + "(" + option.account_number + ")"
                      }}
                    </template>
                    <template
                      #selected-option="{ name, name_local, account_number }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          name_local + "(" + account_number + ")"
                        }}</strong>
                        <strong v-else
                          >{{ name + "(" + account_number + ")" }}
                        </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col> -->
            <b-col md="12" >
              <b-form-group
                :label="$t('scholarship')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bank"
                  rules="required"
                >
                  <v-select
                    v-model="scholarshipForm.scholarship_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options.scholarships"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar"
                          ? option.name_local 
                          : option.name
                      }}
                    </template>
                    <template
                      #selected-option="{ name, name_local }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          name_local 
                        }}</strong>
                        <strong v-else
                          >{{ name }}
                        </strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group
                class="left_right"
                :label="$t('Global.notes')"
                label-for="notes"
              >
                <!-- <validation-provider
                  #default="{ errors }"
                  :name="$t('Global.notes')"
                  rules="required"
                > -->
                  <b-form-textarea
                    id="notes"
                    v-model="scholarshipForm.notes"
                  />
                  <!-- <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small> -->
                <!-- </validation-provider> -->
              </b-form-group>
            </b-col>
            <b-col md="12">
              <h6 class="mt-2">
                  {{ $t('Items') }}
              </h6>
              <b-overlay
                :show="loadPaymentItems"
                rounded="sm"
              >
                <table
                  class="table table-striped custom_table text_nobreak"
                >
                  <thead>
                    <th> {{ $t('item') }} </th>
                    <th> {{ $t('original') }} </th>
                    <th> {{ $t('final') }} </th>
                  </thead>
                  <tbody style="text-align: initial" class="new_edit">
                    <tr v-for="(item,index) in paymentItems" :key="item.id">
                      <td>
                        {{ $i18n.locale == 'ar' ? item.name_local : item.name }}
                      </td>
                      <td>
                        <!-- {{ itemSuggestionValues.length > 0 ? itemSuggestionValues[index] : Math.round((item.amount/paidAmount)*cashbackForm.amount) }} -->
                        {{originalValues[index]}}
                      </td>
                      <td>
                        <b-form-group
                          class="left_right"
                          label-for="final"
                        >
                          <validation-provider
                            #default="{ errors }"
                            :name="$t('final')"
                            rules="required"
                          >
                            <b-form-input
                              v-model="final[index]"
                              type="number"
                              :state="errors.length > 0 ? false : null"
                            />
                            <small v-if="errors.length" class="text-danger">
                              {{ validation(null, 0).message }}
                            </small>
                          </validation-provider>
                        </b-form-group>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <th>
                      {{ $t('total') }}
                    </th>
                    <th>
                      <!-- {{ totalSuggestionValues > 0 ? totalSuggestionValues : paidAmount  }} -->
                      {{totalOriginalValues}}
                    </th>
                    <th>
                      <!-- {{ totalFinalValues > 0 ? totalFinalValues : paidAmount }} -->
                      {{totalFinalValues}}
                    </th>
                  </tfoot>
                </table>
                <small v-if="totalFinalValues > totalOriginalValues" class="text-danger">
                  {{ $i18n.locale == 'ar' ?  'المجموع النهائي يجب ان يكون اقل من او يساوي المجموع الاصلي' : 'Total Final must be less than or equal Total Suggested' }}
                </small>
              </b-overlay>
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
              :disabled="totalFinalValues > totalOriginalValues || validationCheck"
              @click="submitScholarship()"
            >
              {{ $t("Global.submit") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="scholarshipModal = false"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  BCard,
  BCol,
  BRow,
  BFormFile,
  BForm,
  BFormGroup,
  BButton,
  BFormInput,
  BFormDatepicker,
  BModal,
  BBadge,
  BTab,
  BOverlay,
  BFormCheckbox,
  BTabs,
  BLink,
  BDropdown,
  BDropdownItem,
  BFormTextarea,
  validate,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import vSelect from "vue-select";
import ShowComponent from "@/views/components/info/show";
import Ripple from "vue-ripple-directive";
import ShowTable from "./components/ShowTable.vue";
import List from "@/views/components/info/list";
import Transactions from "@/views/students/transactions/components/transactions";
import PaymentstItems from "@/views/students/payments/components/payments_items";
import PaymentsHistory from "@/views/students/payments/components/payments_history";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import { required, email } from "@validations";
import { forEach } from 'postcss-rtl/lib/affected-props';

export default {
  name: "Show",
  components: {
    Transactions,
    ValidationErrors,
    List,
    ShowComponent,
    BBadge,
    BTab,
    BTabs,
    BLink,
    BCard,
    BFormDatepicker,
    vSelect,
    BFormCheckbox,
    BCol,
    BFormInput,
    BRow,
    BButton,
    BFormFile,
    BForm,
    BModal,
    BOverlay,
    BFormGroup,
    ShowTable,
    ValidationProvider,
    ValidationObserver,
    localize,
    PaymentstItems,
    BDropdown,
    BDropdownItem,
    PaymentsHistory,
    BFormTextarea,
  },
  data() {
    return {
      paymentModel: false,
      dueDateModel: false,
      refundModel: false,
      cashbackModal: false,
      scholarshipModal: false,
      installmentsModel: false,
      paymentorderModel: false,
      paidAmount: null,
      paymentAmount: null,
      scholarshipFlag: true,
      file: null,
      lookups: null,
      totalSuggestionValues: null,
      totalFinalValues: null,
      validationCheck: false,
      itemSuggestionValues: [],
      originalValues:[],
      remainingValues:[],
      totalRemainingValues:[],
      totalOriginalValues: null,
      form: {
        amount: null,
        file: null,
        payment_number: null,
        pay_date: null,
        currency_id: null,
        bank_id: null,
      },
      ruleForm: {
        amount: null,
        type : null,
        notes: null,
        Beneficiary: null,
        // bank_id: null
      },
      cashbackForm:{
        amount: null,
        notes: null,
        file: null,
        bank_id: null,
        transfer_out: false
      },
      scholarshipForm:{
        amount: null,
        notes: null,
        file: null,
        scholarship_id: null,
        bank_id: null,
        first_installment: null,
        second_installment: null
      },
      final: [],
      installmentsForm:{
        num_of_installments: null,
        num_of_months: null,
        notes: null,
      },
      paymentOrder:{
        notes:null,
        bank_id:null,
      },
      payType: [
        {label: 'E-Wallet' , label_local: 'المحفظة الإلكترونية', value: 'credit'},
        {label: 'Bank' , label_local: 'بنك', value: 'bank'},
        
      ]
    };
  },
  directives: {
    Ripple,
  },
  props: {
    applicant_id: null,
    payment_id: null,
  },
  watch:{
    'cashbackForm.amount'(newval){
      this.itemSuggestionValues = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.cashbackForm.amount ))
      this.totalSuggestionValues = this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0)
      this.final = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.cashbackForm.amount ))
    },
    'ruleForm.amount'(newval){
      this.itemSuggestionValues = this.paymentItems.map(item => ((item.amount/this.paymentAmount)*this.ruleForm.amount ).toFixed(2))
      this.totalSuggestionValues = this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0)
      this.final = this.paymentItems.map(item => ((item.amount/this.paymentAmount)*this.ruleForm.amount ).toFixed(2))
    },
    'scholarshipForm.amount'(newval){
      if(this.scholarshipFlag = true){
        this.itemSuggestionValues = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.scholarshipForm.amount ))
        this.totalSuggestionValues = this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0)
        this.final = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.scholarshipForm.amount ))
      }
    },
    'scholarshipForm.first_installment'(newVal){
      if(this.item.installments[0].amount < this.scholarshipForm.first_installment){
        this.scholarshipForm.first_installment = this.item.installments[0].amount 
      }
      this.scholarshipForm.second_installment = this.totalFinalValues - this.scholarshipForm.first_installment
    },
    'final'(newval){
      this.scholarshipForm.first_installment = null
      let temp = this.final.map(function (x) { 
                  return parseFloat(x); 
                });
      let finalValues = temp.filter(function (value) {
                            return !Number.isNaN(value.toFixed(2));
                        });
      this.totalFinalValues = Math.round(finalValues.reduce((accumulator, current) => accumulator + current, 0))

      this.scholarshipForm.first_installment = this.totalFinalValues

      for(var i=0; i < this.originalValues.length ; i++){
        this.remainingValues[i] = (this.originalValues[i] - finalValues[i]).toFixed(2)
        this.remainingValues[i] = parseFloat(this.remainingValues[i])
      }
      this.totalRemainingValues = Math.round(this.remainingValues.reduce((accumulator, current) => accumulator + current, 0))

    },
  },
  computed: {
    ...mapGetters({
      item: "payments/item",
      load: "payments/load",
      paymentItems: "paymentItems/items",
      loadPaymentItems: "paymentItems/load",
      options: "app/lookups",
    }),
    id() {
      if (this.payment_id) return this.payment_id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    // itemSuggestionValuesFunc(itemAmount, paidAmount, cashbackFormAmount){
    //   this.itemSuggestionValues.push( (itemAmount/paidAmount)*cashbackFormAmount )
    //   return this.itemSuggestionValues
    // }
  },

  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItems: "paymentItems/paymentRefundItems",
      getLookups: "app/GET_LOOKUPS",
      refund: "payments/refund",
      directCashback: "payments/directCashback",
      scholarship: "payments/scholarship",
      exportPaymentInvoice: "payments/exportPaymentInvoice"
    }),
    init() {
      this.getLookups({ banks: true, currencies: true, scholarship: true ,banks_infos: true}).then((res) => {
        if (this.id) {
          this.$store.dispatch("payments/get", this.id);
        }
      });
    },
    upload(e) {
      this.file = e.target.files[0];
    },
    submit() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success ) {
          const formData = new FormData();
          for (const [key, value] of Object.entries(this.form)) {
            if (value) {
              formData.append(key, value);
            }
          }
          formData.append("payment_id", this.id);
          if (this.applicant_id) {
            formData.append("applicant_id", this.applicant_id);
          }

          this.$store
            .dispatch("payments/putTransaction", { query: formData, id: null })
            .then((response) => {
              this.paymentModel = false;
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.init();
              this.$emit("hide");
            })
            .catch((error) => {});
        }
      });
    },
    submitDueDate() {
      this.$refs.simpleRulesDueDate.validate().then((success) => {
        if (success && this.item.due_date) {
          this.$store
            .dispatch("payments/editDueDate", {
              query: { due_date: this.item.due_date },
              id: this.id,
            })
            .then((response) => {
              this.paymentModel = false;
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.init();
              this.dueDateModel = false;
            })
            .catch((error) => {});
        }
      });
    },
    submitInstallments() {
      this.$refs.simpleRulesInstallments.validate().then((success) => {
        if (success) {
          const formData = new FormData();
          for (const [key, value] of Object.entries(this.installmentsForm)) {
            if (value) {
              formData.append(key, value);
            }
          }
          this.$store
            .dispatch("payments/createInstallments", {
              query: formData,
              payment_id: this.id,
            })
            .then((response) => {
              this.installmentsModel = false;
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.init();
              this.dueDateModel = false;
            })
            .catch((error) => {});
        }
      });
    },
    submitPaymentOrder() {


      this.$refs.simpleRulesInstallments.validate().then((success) => {
        if (success) {
          this.$toast(
        {
          component: ToastificationContent,
          props: {
            icon: "FileTextIcon",
            text: this.$t("Global.downloading_report_in_progress"),
            variant: "info",
          },
        },
        {
          position: "top-center",
          timeout: false,
          closeOnClick: false,
          draggable: false,
        }
      );
          const formData ={bank_id:this.paymentOrder.bank_id , notes : this.paymentOrder.notes};
          this.$store
            .dispatch("payments/createPaymentOrder", {
              query: formData,
              payment_id: this.id,
            })
            .then((response) => {
              this.paymentorderModel = false;
              this.downloadURI(response.url);
              document.querySelector(".toastification-close-icon").click();

              this.init();
            })
            .catch((error) => {
              document.querySelector(".toastification-close-icon").click();
            });
        }
      });
      
      
    },
    submitRefund() {
      this.$refs.simpleRulesRefund.validate().then((success) => {
        if (success) {
          // const formData = new FormData();
          // for (const [key, value] of Object.entries(this.ruleForm)) {
          //   if (value) {
          //     formData.append(key, value);
          //   }
          // }
          // formData.append("user_id", this.item.user.id);

          if(this.paymentItems.length>0){
            this.ruleForm.items = []; 
            this.ruleForm.remainingItems = []; 
            this.paymentItems.forEach((element,index) => {
              this.ruleForm.items[index] = { id: element.id , value: this.final[index] }  
              this.ruleForm.remainingItems[index] = { id: element.id , value: this.remainingValues[index] }  
            });
          }

          this.scholarshipFlag = false
          this.ruleForm.amount = this.totalFinalValues
          this.ruleForm.user_id = this.item.user.id

          this.refund({ query: this.ruleForm, id: this.id }).then((_) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.init();
            this.$emit("hide");
            this.refundModel = false;
            this.ruleForm.amount = null;
            this.ruleForm.notes = null;
            this.ruleForm.type = null;
            // this.ruleForm.bank_id = null
          }).finally(_=>{
            this.scholarshipFlag = true
          });
        }
      });
    },
    submitCashback(){
      this.$refs.simpleRulesCashback.validate().then((success) => {
        if (success) {
          
          // const formData = new FormData();
          // for (const [key, value] of Object.entries(this.cashbackForm)) {
          //   if (value) {
          //     formData.append(key, value);
          //   }
          // }


          if(this.paymentItems.length>0){
            this.cashbackForm.items = []; 
            this.paymentItems.forEach((element,index) => {
              this.cashbackForm.items[index] = { id: element.id , value: this.final[index] }  
            });
          }

          this.scholarshipFlag = false
          this.cashbackForm.amount = this.totalFinalValues
          
          this.directCashback({ query: this.cashbackForm, id: this.id }).then((_) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Done")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.cashbackModal = false;
            // this.$router.go(-1);
            this.init();
          }).catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
          }).finally(_=>{
            this.scholarshipFlag = true
          });
        }
      });
    },
    submitScholarship(){
      this.$refs.simpleRulesScholarship.validate().then((success) => {
        if (success) {
          if(this.paymentItems.length>0){
            this.scholarshipForm.items = []; 
            this.paymentItems.forEach((element,index) => {
              this.scholarshipForm.items[index] = { id: element.id , value: this.final[index] }  
            });
          }
          this.scholarshipFlag = false
          this.scholarshipForm.amount = this.totalFinalValues
          this.scholarship({ query: this.scholarshipForm, id: this.id }).then((_) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Done")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.scholarshipModal = false;
            // this.$router.go(-1);
            this.init();
          }).catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
          }).finally(_=>{
            this.scholarshipFlag = true
          });
        }
      });
    },
    showaCanceldPayment(id){
      this.$router.push({name: 'payment', params: { id: id },})
      this.init()
    },
    openPaymentModel(){
      this.form.amount = this.item.amount;
      this.paymentModel = true
    },
    openRefundModel(payment){
      this.ruleForm.type = 'credit';
      this.ruleForm.amount = this.item.paid;

      this.paidAmount = payment.paid
      this.paymentAmount = payment.amount
      this.cashbackForm.amount = payment.paid
      let payload = {id: payment.id , query: { limit: 100 } }
      this.getItems(payload).then(_=>{
        this.originalValues = this.paymentItems.map(item => ((item.amount/this.paymentAmount)*this.ruleForm.amount ).toFixed(2))
        this.itemSuggestionValues = this.paymentItems.map(item => ((item.amount/this.paymentAmount)*this.ruleForm.amount ))
        this.totalSuggestionValues = this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0)
        this.final = this.paymentItems.map(item => ((item.amount/this.paymentAmount)*this.ruleForm.amount ).toFixed(2))
        this.totalFinalValues = this.totalSuggestionValues
        this.totalOriginalValues = Math.round(this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0))
        for(var i=0; i < this.itemSuggestionValues.length ; i++){
          this.remainingValues[i] = (this.itemSuggestionValues[i] - this.final[i]).toFixed(2)
          this.remainingValues[i] = parseFloat(this.remainingValues[i])
        }
        this.totalRemainingValues = Math.round(this.remainingValues.reduce((accumulator, current) => accumulator + current, 0))
      })
      this.refundModel = true;
    },
    openInstallmentsModel(){
      this.ruleForm.amount = this.item.amount;
      this.installmentsModel = true
    },
    openPaymentOrderModel(){
      // this.ruleForm.amount = this.item.amount;
      this.paymentorderModel = true
    },
    openCashbackModal(payment){
      this.paidAmount = payment.paid
      this.paymentAmount = payment.amount
      this.cashbackForm.amount = payment.paid
      let payload = {id: payment.id , query: { limit: 100 } }
      this.getItems(payload).then(_=>{
        this.originalValues = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.cashbackForm.amount ))
        this.itemSuggestionValues = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.cashbackForm.amount ))
        this.totalSuggestionValues = this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0)
        this.final = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.cashbackForm.amount ))
        this.totalFinalValues = this.totalSuggestionValues
        this.totalOriginalValues = this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0)
      })
      this.cashbackModal = true
    },
    openScholarshipModal(payment){
      this.paidAmount = payment.paid
      this.paymentAmount = payment.amount
      this.scholarshipForm.amount = payment.amount
      let payload = {id: payment.id , query: { limit: 100 } }
      this.getItems(payload).then(_=>{
        this.originalValues = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.scholarshipForm.amount ))
        this.itemSuggestionValues = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.scholarshipForm.amount ))
        this.totalSuggestionValues = this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0)
        this.final = this.paymentItems.map(item => Math.round((item.amount/this.paymentAmount)*this.scholarshipForm.amount ))
        this.totalFinalValues = this.totalSuggestionValues
        this.totalOriginalValues = this.itemSuggestionValues.reduce((accumulator, current) => accumulator + current, 0)
      })
      this.scholarshipModal = true
    },
    resetCashbackModal(){
      this.cashbackForm = {
        amount: null,
        notes: null,
        file: null,
      }
    },
    resetScholarshipModal(){
      this.scholarshipForm = {
        amount: null,
        notes: null,
        file: null,
        scholarship_id: null,
        first_installment: null,
        second_installment: null,
      }
    },
    resetRefundModel(){
      this.ruleForm = {
        amount: null,
        notes: null,
        file: null,
      }
    },
    getCustomStatus(id) {
      if (id == 0) {
        return {
          color: "danger",
          name: "Unpaid",
        };
      } else if (id == 1) {
        return {
          color: "light-success",
          name: "Fully Paid",
        };
      } else if (id == 2) {
        return {
          color: "primary",
          name: "Partially Paid",
        };
      } else if (id == 3) {
        return {
          color: "success",
          name: "Over Paid",
        };
      } else if(id == 4){
        return{
            color: 'primary',
            name: 'paid'
        }
      } else if (id == 5) {
        return {
          color: "warning",
          name: "Refund",
        };
      }
    },
    validationErrorMessage(errors){
      if(errors[0] && errors[0].includes("between")){
        errors[0]=this.$t('Total must be less than or equal max total');
        this.validationCheck = true
      }else if(errors[0] && errors[0].includes("required")){
        errors[0]=this.$t('Validation.selectFiled');
        this.validationCheck = true
      }else{
        this.validationCheck = false
      }
      return errors;     
    },
    exportInvoice(){
      this.exportPaymentInvoice(this.id)
      .then((response) => {
        this.$swal({
          icon: "success",
          title: `${this.$t("Done")}`,
          showConfirmButton: false,
          timer: 1500,
        });
          // this.$emit('refresh');
      })
      .catch((error) => {
        this.$swal({
          icon: "error",
          text: `${error || this.$t("Global.errorMessage")}`,
          showConfirmButton: false,
          timer: 1500,
        });
        const errors = [error.response.data.errors];
        errors.forEach((error, index) => {
          const error_data = Object.values(error)[index][0];
          this.errorsdata = error;
        });
      });
    },
    
  },
};
</script>

<style scoped></style>
