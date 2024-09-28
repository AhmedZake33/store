<template>
  <div>
    <b-row>
      <b-col cols="12" xl="12" lg="12" md="12">
        <div class="custom_actions mr-1">
          <b-dropdown
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            :text="$t('Global.more')"
            v-if="!user_id && !student_id && !applicant_id"
            right
            size="sm"
            variant="outline-primary"
          >
            <b-dropdown-item
              variant="primary"
              v-if="hasPermission('import_payment')"
              @click="$refs.importModal.show()"
            >
              {{ $t("Global.import_payments") }}
            </b-dropdown-item>
            <b-dropdown-item
              variant="primary"
              v-if="hasPermission('access_payment_batch')"
              @click="$router.push({name:'batches'})"
            >
              {{ $t("Global.batches") }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </b-col>
    </b-row>
    <div v-if="!user_id && !student_id && !applicant_id">
    <template v-if="showCurrency ">
      <statistics
        :loading="load['payments']"
        v-if="details"
        :items="details.EGP"
        :icon="'DollarSignIcon'"
        :except="[]"
        :egpIcon="true"
      ></statistics>
    </template>
    <template v-else>
      <statistics
        :loading="load['payments']"
        v-if="details"
        :items="details.EGP"
        :icon="'DollarSignIcon'"
        :except="[]"
        :egpIcon="true"
      ></statistics>
      <statistics
      :loading="load['payments']"
      v-if="details"
      :items="details.USD"
      :icon="'DollarSignIcon'"
      :except="[]"
      :egpIcon="false"
    ></statistics>
    </template>
    </div>

    <Show
      v-if="show"
      :applicant_id="applicant_id"
      :payment_id="payment_id"
      @hide="hideRender"
    ></Show>
    <DataTable
      v-else
      :title="title"
      :total="total"
      :allowSearch="!user_id && !student_id && !applicant_id ? true : false"
      :filter="filter"
      :loading="load['payments']"
      apiLink="payments"
      @reset="reset"
      @Refresh="refresh"
      :importBtn="(hasPermission('import_migrationData') ||
            hasPermission('import_invoices_migrationData')) && !user_id ? true : false"
      >
      <!-- exportPermission="download_PDF_payment" -->
      <!-- :default-filter="'term_id'" -->
      <template #filter>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            v-model="filter.year_id"
            :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
            @search="fetchYearsOptions"
            :options="lookups['payments'] && lookups['payments'].years"
            :filterable="false"
            :reduce="(val) => val.id"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            :placeholder="$t('Global.year')"
          >
            <template slot="no-options">
              {{
                $i18n.locale == "en"
                  ? "Type Year to search"
                  : "أكتب السنة الدراسية للبحث"
              }}
            </template>
            <template #selected-option="{ start_year, end_year }">
              <strong style="display: flex; align-items: baseline">
                {{ `${start_year}/${end_year}` }}
              </strong>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{ `${option.start_year}/${option.end_year}` }}
              </div>
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.faculty_id"
            :options="lookups['payments'] && lookups['payments'].faculties"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.faculty')"
          >
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.bylaw_id"
            :options="load['bylawslookup'] ? [] : dependentLookups['bylaws']"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :disabled="filter.faculty_id == null"
            :placeholder="$t('Global.bylaw')"
          >
            <template #selected-option="{ name, name_local }">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ load['bylawslookup']  ? $t("Global.inProgress") : $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.program_id"
            :options="load['programslookup'] ? [] : dependentLookups['programs']"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.program')"
            :disabled="filter.bylaw_id == null"
          >
            <template #selected-option="{ name, name_local }">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ load['programslookup']  ? $t("Global.inProgress") : $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.level_id"
            :options="load['levelslookup'] ? [] : dependentLookups['levels']"
            label="name"
            class="w-100"
            :disabled="!filter.bylaw_id"
            :reduce="(val) => val.id"
            :placeholder="$t('levels')"
          >
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ load['levelslookup']  ? $t("Global.inProgress") : $t("noMatching") }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.status"
            :options="lookups['payments'] && lookups['payments'].status_list"
            label="name"
            class="w-100"
            multiple
            :reduce="(val) => val.code"
            :placeholder="$t('Invoice Status')"
          >
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.currency_id"
            :options="lookups['payments'] && lookups['payments'].currencies"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('currency')"
          >
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            v-model="filter.service_id"
            :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
            :options="lookups['payments'] && lookups['payments'].services"
            :filterable="true"
            :reduce="(val) => val.id"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            :placeholder="$t('Global.service')"
          >
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.scholarship_id"
            :options="lookups['payments'] && lookups['payments'].scholarships"
            label="name"
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.scholarship')"
          >
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <Multiselect
              v-if="lookups['payments'] && lookups['payments'].students_tags"
              :placeholder="$t('Tags')"
              :filter="filter.students_tags"
              @addStatus="addStatus"
              @remove="removeTag"
              paramName="students_tags"
              :options="
                makeCategory((lookups['payments'] && lookups['payments'].students_tags))
              "
            ></Multiselect>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select
            :filter="fuseSearch"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.installment_group_id"
            :options="lookups['payments'] && lookups['payments'].installments_groups"
            label="name"
            multiple
            class="w-100"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.installment_status')"
          >
            <template #selected-option="{ name, name_local }">
              <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
              <strong v-else>{{ name }} </strong>
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{
                  $i18n.locale == "en"
                    ? option.name
                      ? option.name
                      : option.name_local
                    : option.name_local
                    ? option.name_local
                    : option.name
                }}
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <v-select 
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" 
              v-model="filter.removed"
              :options="getStatusList(true)" 
              class="w-100" 
              :reduce="val => val.value"
              :placeholder="$t('Global.status')"
          >
            <template slot="selected-option" slot-scope="option">
                    <strong>
                        {{ $t(`Global.${option.label}`) }}
                      </strong>
            </template>
            <template v-slot:option="option">
                {{ $t(`Global.${option.label}`) }}
            </template>
        </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <b-form-datepicker
            :label-no-date-selected="$t('Global.no_selected')"
            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
            id="date_from"
            ref="date_from"
            v-model="filter.date_from"
            :placeholder="$t('paid_date_from')"
          />
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <b-form-datepicker
            :label-no-date-selected="$t('Global.no_selected')"
            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
            id="date_to"
            ref="date_to"
            v-model="filter.date_to"
            :placeholder="$t('paid_date_to')"
          />
        </b-col>
      </template>
      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative"
          :items="items"
          responsive
          :fields="fieldsData"
          primary-key="id"
          show-empty
          :empty-text="load['payments'] ? $t('Global.inProgress') : $t('Global.empty_text')"
        >
          <template #cell(id)="data">
            <span v-if="data.item.id">
              <b-link 
                v-if="hasPermission('show_payment')"
                :to="{ name: 'payment', params: { id: data.item.id } }" 
              >
                {{ data.item.id }}
              </b-link>
              <div v-else>
                {{ data.item.id }}
              </div>
            </span>
            <div v-else>_</div>
          </template>
          <template #cell(user)="data">
            <div v-if="data.item.user">
              <b-link
                :to="{
                  name: data.item.type == 4 ? 'applicant' : 'student-show',
                  params:
                    data.item.type == 4
                      ? { id: data.item.applicant.id }
                      : { id: data.item.user.id },
                }"
                v-b-tooltip.hover="
                  $i18n.locale == 'ar'
                    ? data.item.user.name_local
                    : data.item.user.name
                "
              >
                {{
                  $i18n.locale == "ar"
                    ? data.item.user.name_local
                    : data.item.user.name
                }}
              </b-link>
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(service)="data">
            <div v-if="data.item.service">
              {{ $i18n.locale == 'ar' ? data.item.service.name_local : data.item.service.name }}
            </div>
            <div v-else>_</div>
          </template>
          <template #cell(due_date)="data">
            <div v-if="data.item.due_date">
              {{ data.item.due_date }}
            </div>
            <div v-else>_</div>
          </template>
          <!-- <template #cell(providers)="data">
            <div v-if="data.item.providers.length > 0">
              <ul class="m-0 p-0">
                <li v-for="provider in data.item.providers" :key="provider.id">
                  {{ $i18n.locale == 'ar' ? provider.name_local : provider.name }}
                </li>
              </ul>
            </div>
            <div v-else>_</div>
          </template> -->
          <template #cell(status)="data">
            <b-badge
              pill
              v-if="data.item.status"
              :variant="`${getCustomStatus(data.item.status.code).color}`"
              class="text-capitalize"
            >
              {{
                $i18n.locale == "ar"
                  ? data.item.status.name_local
                  : data.item.status.name
              }}
            </b-badge>
            <span v-if="data.item.removed">
              <span v-if="$i18n.locale == 'ar'" class="text-danger">
                {{data.item.removed == 1 ? ' (غير نشط)' : ''}} 
              </span>
              <span v-else class="text-danger">
                {{data.item.removed == 1 ? ' (Inactive)' : ''}} 
              </span>
            </span>
          </template>
          <template #cell(currency)="data">
            <span v-if="data.item.currency">
              {{
                $i18n.locale == "ar"
                  ? data.item.currency.name_local
                  : data.item.currency.name
              }}
            </span>
            <div v-else>_</div>
          </template>
          <template #cell(label)="data">
            <b-link :to="{ name: 'payment', params: { id: data.item.id } }">
              {{
                data.item.label
                  ? $t(`Global.${data.item.label}`)
                  : $t("Global.invoice")
              }}
            </b-link>
          </template>
          <template #cell(actions)="data">
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
              <b-link 
                v-if="hasPermission('show_payment')"
                :to="{ name: 'payment', params: { id: data.item.id } }" 
              >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  style="cursor: pointer"
                  class="text-primary"
                />
              </b-link>
              <!-- <b-link v-if="filter.removed == 1">
                <feather-icon
                  v-if="hasPermission('delete_payment')"
                  v-b-tooltip.hover="$t('Global.restore')"
                  icon="RepeatIcon"
                  style="cursor: pointer"
                  class="text-primary"
                  @click="restore(data.item.id)"
                />
              </b-link>
              <b-link v-else>
                <feather-icon
                  v-if="hasPermission('delete_payment') && data.item.status.id == 0"
                  v-b-tooltip.hover="$t('Global.delete')"
                  icon="Trash2Icon"
                  style="cursor: pointer"
                  class="text-danger"
                  @click="remove(data.item.id)"
                />
              </b-link> -->
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
        <!-- <b-button
          variant="primary"
          v-if="hasPermission('edit_payment') && student_id"
          @click="openDialog"
          >{{ $t("Global.refund") }}
        </b-button> -->
        <b-button
          variant="primary"
          v-if="hasPermission('check_payment') && user_id"
          @click="checkPaymentFunc(user_id)"
          >{{ $t("Global.check_payment") }}
        </b-button>
        <b-button
          variant="primary"
          v-if="hasPermission('edit_payment') && user_id"
          class="btn-icon ml-1"
          @click="openCreatePaymentModal()"
        >
          {{ $t("Global.create_payment") }}
        </b-button>
        <b-button
            v-b-tooltip.hover="$t('Global.export_excel')"
            v-if="hasPermission('edit_payment') && !user_id"
            class="btn-icon mr-1"
            variant="primary"
            :disabled="load['payments']"
            @click="exportDataExcel()"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button>
        <!-- <b-button
          v-b-tooltip.hover="$t('Global.importMigrationData')"
          :disabled="load['payments']"
          class="btn-icon mr-1"
          variant="primary"
          @click="toggleMigrationModal"
          v-if="
            (hasPermission('import_migrationData') ||
            hasPermission('import_invoices_migrationData')) && !user_id
          "
        >
          <feather-icon icon="UploadCloudIcon" />
        </b-button> -->
        <b-button
          variant="primary"
          v-if="hasPermission('apply_scholarship') && user_id"
          class="btn-icon ml-1"
          @click="openScholarshipModal()"
        >
          {{ $t("Global.scholarship") }}
        </b-button>
        <b-button
            v-b-tooltip.hover="$t('Global.export_pdf')"
            v-if="hasPermission('download_PDF_payment') && !applicant_id"
            :class="user_id || applicant_id || student_id? 'btn-icon ml-1' : 'btn-icon mr-1'"
            variant="primary"
            :disabled="load['payments']"
            @click="exportData($i18n.locale,'pdf')"
        >
          <feather-icon icon="PrinterIcon" />
        </b-button>

        <b-button
            v-b-tooltip.hover="$t('Global.invoices_report')"
            v-if="hasPermission('download_PDF_payment') && !applicant_id"
            :class="user_id || applicant_id || student_id? 'btn-icon  ml-1' : 'btn-icon' "
            variant="primary"
            :disabled="load['payments']"
            @click="invoicesReport($i18n.locale,'pdf')"
        >
          <feather-icon icon="PrinterIcon" />
        </b-button>
        
      </template>
    </DataTable>

    <b-modal
      @open="reset"
      ref="my-modal"
      v-model="paymentModel"
      :title="$t('Global.refund_info')"
      size="lg"
    >
      <validation-observer ref="simpleRules">
        <b-form :class="load['payments'] ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="5">
              <b-form-group
                :label="$t('amount')"
                label-for="first_instalment"
              >
                <validation-provider
                  #default="{ errors }"
                  name="amount"
                  rules="required|number"
                >
                  <b-form-input
                    v-model="ruleForm.amount"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group
                :label="$t('Global.currency')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="currency"
                  rules="required"
                >
                  <v-select
                    v-model="ruleForm.currency_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups['payments'] && lookups['payments'].currencies"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar" ? option.name_local : option.name
                      }}
                    </template>
                    <template
                      #selected-option="{ name, name_local }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{
                          name_local
                        }}</strong>
                        <strong v-else>{{ name }}</strong>
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
            <b-col md="5">
              <b-form-group
                :label="$t('Global.pay_number')"
                label-for="pay_number"
              >
                <validation-provider
                  #default="{ errors }"
                  name="pay_number"
                  rules="required|number"
                >
                  <b-form-input
                    v-model="ruleForm.payment_number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <ValidationErrors :frontend-errors="errors" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
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
                    :label-no-date-selected="$t('Global.no_selected')"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }"
                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                    v-model="ruleForm.pay_date"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">
                    {{ validation(null, 0).message }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6" style="cursor: pointer !important">
              <b-form-group
                :label="$t('Global.file')"
                label-for="code-input"
                style="cursor: pointer !important"
              >
                <b-form-file
                  v-model="ruleForm.file"
                  style="cursor: pointer !important"
                  :placeholder="$t('Global.paymentFile')"
                  drop-placeholder="Drop file here..."
                />
              </b-form-group>
              <!-- <div class="mt-3">{{$t('Global.selected_file')}} {{ form.file ? form.file.name : '' }}
                                                                                    </div> -->
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
              <b-form-group
                :label="$t('Global.account')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="bank"
                  rules="required"
                >
                  <v-select
                    v-model="ruleForm.provider_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups['payments'] && lookups['payments'].banks"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar" ? option.name_local : option.name
                      }}
                      <span v-if="option.account_number">
                        ({{ option.account_number }})
                      </span>
                    </template>
                    <template
                      #selected-option="{ name, name_local, account_number }"
                    >
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
        <b-row :class="load['payments'] ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submitRefund"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button type="reset" variant="outline-secondary" @click="reset">
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
      @hide="resetimportModal"
      ref="importModal"
      no-close-on-backdrop
      :title="$t('Global.import_payments')"
      size="md"
    >
      <b-overlay
        :show="load['payments']"
        rounded="sm"
      >
        <validation-observer ref="simpleImportRules">
          <b-form :class="load['payments'] ? 'disabled_all' : ''">
            <div class="row">
              <b-col md="12">
                <b-form-group
                  :label="$t('file')"
                  label-for="file"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="file"
                    rules="required"
                  >
                    <b-form-file 
                      v-model="importForm.file" 
                      :placeholder="$t('Global.upload_file')" 
                      :drop-placeholder="$t('Global.upload_file')" 
                      accept=".xlsx"
                    />
                    <ValidationErrors :default-message="true" :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'file')" />
                  </validation-provider>
                </b-form-group>
              </b-col>
            </div>
          </b-form>
        </validation-observer>
      </b-overlay>
      <template #modal-footer>
        <b-row :class="load['payments'] ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
              :disabled="load['payments']"
              type="submit"
              variant="primary"
              class="mr-1"
              @click="importPayments"
            >
              {{ $t("Global.submit") }}
            </b-button>
            <b-button type="reset" variant="outline-secondary" @click="$refs.importModal.hide()">
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
      @open="reset"
      ref="createPaymentModal"
      v-model="createPaymentModal"
      :title="$t('Global.create_payment')"
      size="lg"
      @hide="resetCreatePayment"
    >
      <validation-observer ref="createPaymentRules">
        <b-form :class="load['payments'] ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="8">
              <b-form-group
                :label="$t('amount')"
                label-for="amount"
              >
                <validation-provider
                  #default="{ errors }"
                  name="amount"
                  rules="required|number"
                >
                  <b-form-input
                    v-model="createPaymentForm.amount"
                    type="number"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">{{
                    validation(null, 0).message
                  }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <b-form-group
                :label="$t('Global.currency')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="currency"
                  rules="required"
                >
                  <v-select
                    v-model="createPaymentForm.currency_id"
                    :class="errors.length > 0 ? 'custom_invalid' : ''"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups['payments'] && lookups['payments'].currencies"
                    :clearable="false"
                    input-id="code-input"
                    :reduce="(val) => val.id"
                  >
                    <template v-slot:option="option">
                      {{
                        $i18n.locale == "ar" ? option.name_local : option.name
                      }}
                    </template>
                    <template
                      #selected-option="{ name, name_local }"
                    >
                      <div style="display: flex; align-items: baseline">
                        <div v-if="$i18n.locale == 'ar'">{{
                          name_local
                        }}</div>
                        <div v-else>{{ name }}</div>
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
                :label="$t('Global.services')"
                label-for="code-input"
                invalid-feedback="Name is required"
              >
                <validation-provider
                  #default="{ errors }"
                  name="service"
                  rules="required"
                >
                  <v-select
                    v-model="createPaymentForm.service_id"
                    :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
                    @search="fetchServicesOptions"
                    :options="servicesData"
                    :filterable="false"
                    :reduce="(val) => val.id"
                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                    :placeholder="$t('Global.service')"
                  >
                    <template slot="no-options">
                      {{
                        $i18n.locale == "en"
                          ? "Type Service Name to search"
                          : "أكتب اسم الخدمة للبحث"
                      }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <div v-if="$i18n.locale == 'ar'">{{ name_local }} </div>
                        <div v-else>{{ name }} </div>
                      </div>
                    </template>
                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        {{
                          $i18n.locale == "en"
                            ? option.name
                              ? option.name
                              : option.name_local
                            : option.name_local
                            ? option.name_local
                            : option.name
                        }}
                      </div>
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
                    :label-no-date-selected="$t('Global.no_selected')"
                    :date-format-options="{
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }"
                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                    v-model="createPaymentForm.due_date"
                    :state="errors.length > 0 ? false : null"
                  />
                  <small v-if="errors.length" class="text-danger">
                    {{ validation(null, 0).message }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group :label="$t('Global.notes')" label-for="code-input">
                <b-form-textarea
                  v-model="createPaymentForm.notes"
                  :placeholder="$t('Global.notes')"
                />
              </b-form-group>
            </b-col>
          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load['payments'] ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submitCreatePayment"
              :disabled="disableBtn"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button type="reset" variant="outline-secondary" @click="resetCreatePayment">
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <b-modal
      @hide="resetScholarshipModal"
      v-model="scholarshipModal"
      ref="scholarshipModal"
      no-close-on-backdrop
      :title="$t('Global.scholarship')"
      size="md"
    >
      <b-overlay
        :show="load['payments']"
        rounded="sm"
      >
        <validation-observer ref="scholarshipImportRules">
          <b-form :class="load['payments'] ? 'disabled_all' : ''">
            <div class="row">
              <b-col md="12">
                <b-form-group
                  :label="$t('scholarship')"
                  label-for="scholarship"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="scholarship"
                  >
                    <v-select
                      v-model="scholarshipForm.scholarships_id"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="lookups && lookups.payments && lookups.payments['scholarships']"
                      :clearable="false"
                      multiple
                      input-id="code-input"
                      :reduce="(val) => val.id"
                    >
                      <template v-slot:option="option">
                        <strong>
                          {{
                            $i18n.locale == "ar" ? option.name_local : option.name
                          }}
                        </strong>
                      </template>
                      <template
                        #selected-option="{ name, name_local }"
                      >
                        <div style="display: flex; align-items: baseline">
                          <strong v-if="$i18n.locale == 'ar'">{{
                            name_local
                          }}</strong>
                          <strong v-else>{{ name }}</strong>
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
              <!-- <b-col md="12">
                <b-form-group
                  :label="$t('Global.account')"
                  label-for="code-input"
                  invalid-feedback="Account is required"
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
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                        <span v-if="option.account_number">
                          ({{ option.account_number }})
                        </span>
                      </template>
                      <template
                        #selected-option="{ name, name_local, account_number }"
                      >
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
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col> -->
            </div>
          </b-form>
        </validation-observer>
      </b-overlay>
      <template #modal-footer>
        <b-row :class="load['payments'] ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              :disabled="disableBtn"
              type="submit"
              variant="primary"
              class="mr-1"
              @click="submitScholarship()"
            >
              <span v-if="!load['payments']">{{ $t("Global.submit") }}</span>
              <b-spinner
                v-if="load['payments']"
                small
                :label="$t('Global.loading')"
              ></b-spinner>
            </b-button>
            <b-button type="reset" variant="outline-secondary" @click="resetScholarshipModal()">
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>

    <Modal :hint="$t('Global.invoicesImportMessage')" link="/payments/import_migrated_invoices" :title="$t('Global.importMigrationData')" :show="importMigrationModal"></Modal>

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
  BFormDatepicker,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
  BFormFile,
  BAlert,
  BButtonGroup,
  BInputGroup,
  BFormTextarea,
  BImg,
  BFormGroup,
  BSpinner,
  BForm,
} from "bootstrap-vue";

import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";
import DataTable from "@/views/components/table/DataTable";
import { mapActions, mapGetters } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import Statistics from "@/views/components/info/statistics";
import Show from "@/views/students/payments/show";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import Modal from "@/views/components/common/Modal.vue"
import Multiselect from "@/views/components/common/Multiselect.vue";


export default {
  name: "payments",
  components: {
    Multiselect,
    Modal,
    Show,
    Statistics,
    DataTable,
    BSpinner,
    BCard,
    vSelect,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    localize,
    BFormDatepicker,
    BFormFile,
    BAlert,
    BButtonGroup,
    BInputGroup,
    BFormTextarea,
    BImg,
    BFormGroup,
    BForm,
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
  },
  directives: {
    "b-modal": VBModal,
    Ripple,
  },
  props: {
    title: String,
    user_id: null,
    student_id: null,
    faculty_id: null,
    applicant_id: null,
    applicant: Boolean,
    noStatus: Boolean,
    inline: { type: Boolean, default: false },
    showCurrency:{ type: Boolean, default: false },
  },
  watch: {
    "ruleForm.amount"(newVal, oldVal) {
      if (this.details && this.details[0] && this.details[0].paid) {
        if (this.ruleForm.amount > this.details[0].paid) {
          this.ruleForm.amount = null;
        }
      }
    },
  },
  data() {
    return {
      disableBtn: false,
      showCloseButton:false,
      unpaidStatus: false,
      exportQuery: null,
      errorsdata: {},
      scholarshipModal: false,
      scholarshipForm:{
        scholarships_id: [],
        // bank_id: null
      },
      filter: {
        removed: 0,
        export:0,
        faculty_id: null,
        year_id:null,
        bylaw_id: null,
        program_id: null,
        status: [],
        date_from: null,
        date_to: null,
        students_tags:[],
        scholarship_id: null,
        installment_group_id: []
      },
      payment_id: null,
      migrationFiles: [],
      show: false,
      paymentModel: false,
      createPaymentModal: false, 
      file: null,
      ruleForm: {
        amount: null,
        file: null,
        payment_number: null,
        pay_date: null,
        provider_id: null,
      },
      createPaymentForm:{
        amount: null,
        currency_id: null,
        service_id: null,
        due_date: null,
        notes: null
      },
      studentsOptions: [],
      yearsData: [],
      termsData: [],
      status_messages: [],
      servicesData: [],
      importForm: {
        file: null
      },
      paramsLoaded: true,
      statusModal: false
    };
  },
  computed: {
    ...mapGetters({
      items: "payments/items",
      total: "payments/total",
      load: "app/generalLoad",
      lookups: "app/stateLookups",
      dependentLookups:"app/dependentLookups",
      generalLookups: "lookups/lookups",
      details: "payments/details",
      options: "app/lookups",
      needDrop:'app/needDrop',
      scholarshipsLookups: "app/scholarshipsLookups",
      studentScholarships: "scholarships/studentScholarships"
    }),
    fieldsData() {
      let fields = [
        {
          key: "id",
          sortable: true,
          label: this.$t("Invoice Id"),
        },
        {
          key: "user",
          sortable: true,
          thStyle: { width: "15%" },
          label: this.$t("user"),
        },
        {
          key: "service",
          label: this.$t("Global.service"),
        },
        {
          key: "providers",
          label: this.$t("Global.payment_ways"),
        },
        {
          key: "amount",
          label: this.$t("amount"),
          sortable: true,
        },
        {
          key: "currency",
          label: this.$t("Global.currency"),
          sortable: true,
          thStyle: { width: "10%" },
        },
        {
          key: "paid",
          label: this.$t("Global.paid"),
          sortable: true,
        },
        {
          key: "status",
          label: this.$t("Global.status"),
          sortable: true,
        },
        {
          key: "actions",
          label: this.$t("Global.action"),
          thClass: "customAction",
          tdClass: "customWidth",
        },
      ];
      if (this.noStatus) {
        fields = fields.filter((obj) => !["status"].includes(obj.key));
      }
      if (this.applicant_id) {
        fields = fields.filter((obj) => !["actions", "user"].includes(obj.key));
      }
      if (this.student_id) {
        fields = fields.filter((obj) => !["user"].includes(obj.key));
      }
      return fields;
    },
    lang(){
      return this.$i18n.locale == 'ar' ? 'ar' : 'en';
    },
    studentData: function () {
      return this.studentsOptions;
    },
  },
  methods: {
    ...mapActions({
      getLookups: "app/GET_LOOKUPS",
      refund: "payments/refund",
      lookupsMethod: "students/lookup",
      checkPayment: "payments/checkPayment",
      createPayment: "payments/createPayment",
      submitScholarshipForm: "payments/submitScholarshipForm",
      getStudentScholarships: "scholarships/getStudentScholarships"
    }),
    addStatus(value) {
      let ids = Array.from(value, (item) => item.id);
      this.filter.students_tags = ids.filter((n) => n);
    },
    removeTag(removedOption) {
      const objWithIdIndex = this.filter.students_tags.findIndex(
        (obj) => obj === removedOption.id
      );
      if (objWithIdIndex > -1) {
        this.filter.students_tags.splice(objWithIdIndex, 1);
      }
    },
    reset() {
      this.paymentModel = false;
      this.amount = null;
      this.file = null;
      this.payment_number = null;
      this.pay_date = null;
      this.provider_id = null;
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

    setStatusesMessages(object) {
      if (typeof object.done !== undefined) {
        let status_message = {};
        status_message.status = object.status;
        status_message.class = object.status ? "success" : "danger";
        status_message.message = object.message;
        this.status_messages.push(status_message);
      }
      return true;
    },
    refresh(query) {
      this.disableBtn = false
      this.exportQuery = query;
      let data = { banks: true, currencies: true, scholarship: true, scholarship_setting: true};
      if (this.faculty_id) {
        data = {
          ...data,
          faculty_id_programs: this.faculty_id,
          allow_programs: true,
        };
      }
  
      // this.getLookups(data)
        if (this.user_id) {
          query = { ...query, user_id: this.user_id };
        }


        query.applicant = this.applicant ? this.applicant : false
        this.$store
          .dispatch("payments/payments", { query: query })
          .then((_) => {
            if (this.details && this.details[0] && this.details[0].paid) {
              this.ruleForm.amount = this.details[0].paid;
            }
          });
    },
    getCustomStatus(id){
        if(id == 0){
            return{
                color: 'danger',
                name: 'Unpaid'
            }
        }else if(id == 1){
            return{
                color: 'light-success',
                name: 'Fully Paid'
            }
        }else if(id == 2){
            return{
                color: 'primary',
                name: 'Partially Paid'
            }
        }else if(id == 3){
            return{
                color: 'success',
                name: 'Over Paid'
            }
        }else if(id == 4){
            return{
                color: 'primary',
                name: 'paid'
            }
        }else if(id == 5){
          return{
                color: 'warning',
                name: 'Refund'
            }
        }
    },
    upload(e) {
      this.file = e.target.files[0];
    },
    openDialog(data) {
      // this.ruleForm.amount = this.InstallmentTotal ? this.InstallmentTotal - data.paid : null;
      this.ruleForm.file = null;
      this.ruleForm.payment_number = null;
      this.ruleForm.pay_date = null;
      this.ruleForm.provider_id = null;
      this.ruleForm.amount = null;

      if (this.details && this.details[0] && this.details[0].paid) {
        // this.ruleForm.amount = this.details[0].paid;
      }
      this.paymentModel = true;
    },
    submitRefund() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const formData = new FormData();
          for (const [key, value] of Object.entries(this.ruleForm)) {
            if (value) {
              formData.append(key, value);
            }
          }

          formData.append("user_id", this.user_id);

          this.refund({ query: formData }).then((_) => {
            this.refresh();
            this.paymentModel = false;
          });
        }
      });
    },
    hideRender() {
      this.show = false;
      this.$emit("render");
    },
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        // text: `${this.$t("Global.deleteText")}`,
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
          this.$store.dispatch("payments/remove", id).then((_) => {
            this.refresh();
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
          });
        }
      });
    },
    showInline(id) {
      this.payment_id = id;
      this.show = true;
    },
    fetchOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        studentQuery: search,
        certificates: true,
      };
      if (search.length > 1) {
        loading(true);
        this.lookupsMethod(query)
          .then((res) => {
            this.studentsOptions = res.success.students;
            loading(false);
          })
          .catch((err) => {
            loading(false);
          });
      }
    },
    fetchYearsOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        search_years_keyword: search,
      };
      if (search.length > 1) {
        loading(true);
        this.lookupsMethod(query)
          .then((res) => {
            this.yearsData = res.success.years;
            loading(false);
          })
          .catch((err) => {
            loading(false);
          });
      }
    },
    fetchTermsOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        search_terms_keyword: search,
      };
      if (search.length > 1 && loading || (!loading && search.length >= 1)) {
        if(loading){
          loading(true);
        }
        this.lookupsMethod(query)
          .then((res) => {
            this.termsData = res.success.terms;
            if(loading){
            loading(false);
            }
          })
          .catch((err) => {
            if(loading){
            loading(false);
            }
          });
      }
    },
    fetchServicesOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        search_services_keyword: search,
      };
      if (search.length > 1) {
        loading(true);
        this.lookupsMethod(query)
          .then((res) => {
            this.servicesData = res.success.services;
            loading(false);
          })
          .catch((err) => {
            loading(false);
          });
      }
    },
    navigate(id, dest = null) {
      if (dest) {
        this.$router.push({ name: "payments_history", params: { id: id } });
      } else {
        this.$router.push({ name: "payments_items", params: { id: id } });
      }
    },
    restore(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        // text: `${this.$t("restore")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("restore")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch("payments/restore", id).then((_) => {
            this.refresh();
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("restored"),
            });
          });
        }
      });
    },
    resetimportModal(){
      this.importForm.file = null
    },
    importPayments() {
      this.$refs.simpleImportRules.validate().then(success => {
        if (success) {
          const formData = new FormData();
          if (this.importForm.file) formData.append('file', this.importForm.file);
          // formData.append('_method', 'PUT');
          let payload = {};
          payload = { query: formData };
          this.$store
            .dispatch('payments/importPayments', payload)
            .then(response => {
              this.$router.push({name: 'imported_payments'})
              this.$swal({
                icon: 'success',
                text: this.$t('Done'),
                showConfirmButton: false,
                timer: 1500,
              });
              this.$refs.importModal.hide()
              this.refresh();
            })
            .catch(error => {
                if(error.response){
                  const errors = [error.response.data.errors]
                  errors.forEach((error, index) => {
                    this.errorsdata = error
                  })
                  const message = this.errorsdata ? ( this.$i18n.locale == 'ar' ? this.errorsdata.title[0].ar : this.errorsdata.title[0].en ): this.$t('Global.errorMessage')
                  this.$swal({
                      icon: 'error',
                      text: message,
                      showConfirmButton: true,
                  });
                }
            });
        }
      });
    },
    checkPaymentFunc(id){
      this.checkPayment(id).then(() => {
        this.$swal({
          icon: "success",
          title: `${this.$t("Done")}`,
          showConfirmButton: false,
          timer: 1500,
        });
        this.$emit('render');
        this.refresh();
      })
      .catch((error) => {
        this.$swal({
            icon: 'error',
            text: `${this.$t('Global.errorMessage')}`,
            showConfirmButton: false,
            timer: 2000,
        });
      });
    },
    exportData(lang,type){
      let query = this.exportQuery;
      query.lang = this.lang
      this.$store.dispatch('payments/exportData', { 
        query: query 
      }).then((response) => {
          this.$swal({
          icon: "success",
          title: `${this.$t("done")}`,
          showConfirmButton: false,
          timer: 1500,
          });
      })
      .catch((error) => {
        // let message = error ? this.$i18n.locale == 'ar' ? 'لا توجد بيانات في التاريخ المحدد' : 'No data in selected date' : this.$t("Global.errorMessage")
        let message = this.$t("Global.errorMessage")
          this.$swal({
            icon: "error",
            text: `${message}`,
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
    exportDataExcel(lang,type){
      let query = this.exportQuery;
      query.lang = this.lang
      this.$store.dispatch('payments/exportDataExcel', { 
        query: query 
      }).then((response) => {
          this.$swal({
          icon: "success",
          title: `${this.$t("done")}`,
          showConfirmButton: false,
          timer: 1500,
          });
      })
      .catch((error) => {
        // let message = error ? this.$i18n.locale == 'ar' ? 'لا توجد بيانات في التاريخ المحدد' : 'No data in selected date' : this.$t("Global.errorMessage")
        let message = this.$t("Global.errorMessage")
          this.$swal({
            icon: "error",
            text: `${message}`,
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
    invoicesReport(lang,type){
      let query = this.exportQuery;
      query.lang = lang
      this.$store.dispatch('payments/invoicesReport', { 
        query: query 
      }).then((response) => {
          this.$swal({
          icon: "success",
          title: `${this.$t("done")}`,
          showConfirmButton: false,
          timer: 1500,
          });
      })
      .catch((error) => {
        // let message = error ? this.$i18n.locale == 'ar' ? 'لا توجد بيانات في التاريخ المحدد' : 'No data in selected date' : this.$t("Global.errorMessage")
        let message = this.$t("Global.errorMessage")
          this.$swal({
            icon: "error",
            text: `${message}`,
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
    openCreatePaymentModal(){
      this.createPaymentModal = true
    },
    submitCreatePayment(){
      this.$refs.createPaymentRules.validate().then((success) => {''
        this.disableBtn = true
        if (success) {
          this.createPayment({ query: this.createPaymentForm, id: this.user_id }).then((_) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Done")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.createPaymentModal = false
          }).catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.createPaymentModal = false
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
          });
          this.refresh()
        }
        
      });
    },
    submitScholarship(){
      this.$refs.scholarshipImportRules.validate().then((success) => {
        this.disableBtn = true
        if (success) {
          // this.scholarshipForm.scholarships_id = typeof this.scholarshipForm.scholarships_id == 'object' ? this.scholarshipForm.scholarships_id.id : this.scholarshipForm.scholarships_id
          // if(typeof this.scholarshipForm.scholarships_id == 'object'){
          //   this.scholarshipForm.scholarships_id
          // }
          this.scholarshipForm.applicant = this.applicant_id ? true : false
          this.submitScholarshipForm({ query: this.scholarshipForm, id: this.student_id ? this.student_id : this.applicant_id }).then((_) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Done")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.resetScholarshipModal()
            this.refresh()
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
          });
        }
      });
    },
    openScholarshipModal(){
      const payload = { student_id : this.student_id ? this.student_id : this.applicant_id , query:{ applicant: this.applicant_id ? true : false} }
      this.scholarshipModal = true
      this.load = true
      this.getStudentScholarships(payload).then(_=>{
        let temp = []
        this.studentScholarships.forEach(element => {
          temp.push(element.id)
        });
        this.scholarshipForm.scholarships_id = temp
        this.load = false
      })
    },
    resetScholarshipModal(){
      this.scholarshipForm={
        scholarships_id: [],
        // bank_id: null
      },
      this.scholarshipModal = false
    },
    resetCreatePayment(){
      this.createPaymentForm={
        amount: null,
        currency_id: null,
        due_date: null,
        notes: null
      }
      this.createPaymentModal = false
    }
  },
  mounted() {
    this.fetchTermsOptions('f')
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
.custom-file-label {
  cursor: pointer !important;
}

@import "@core/scss/vue/libs/vue-select.scss";
</style>
