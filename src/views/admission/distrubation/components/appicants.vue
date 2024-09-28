<template>
  <div>
    <statistics
      v-if="details"
      :loading="load"
      :items="details"
      :widths="[2, 2, 2, 2, 2, 2, 3, 3, 3, 3]"
      :only="[
        'INCOMPLETE',
        'SUBMITTED',
        'FEEDBACK',
        'UPDATED',
        'REVIEWED',
        'DISTRIBUATION_REQUIRED',
        'REJECTED',
        'FINAL_FEES_REQUIRED',
        'APPROVED',
        'total',
      ]"
      :icon="'TrendingUpIcon'"
    />
    <DataTable
      :total="total"
      :paramsLoaded="paramsLoaded"
      :allow-search="true"
      :filter="filter"
      @reset="reset()"
      @Refresh="refresh"
      @Export="Export"
    >
      <template v-if="lookups" #filter>
        <b-col cols="12" md="4">
          <v-select
            v-if="$route.name.includes('_applicants_pg')"
            :filter="fuseSearch"
            v-model="filter.admission_term_PG_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.terms"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</strong>
              <strong v-else>{{ option.name || option.name_local }}</strong>
            </template>
            <template
              v-slot:option="option"
            >{{ $i18n.locale == "ar" ? option.name_local : option.name }}</template>
            <template #no-options>{{ $t("noMatching") }}</template>
          </v-select>
          <v-select
            v-else
            :filter="fuseSearch"
            v-model="filter.admission_term_UG_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.terms"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
          >
            <template slot="selected-option" slot-scope="option">
              <strong v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</strong>
              <strong v-else>{{ option.name || option.name_local }}</strong>
            </template>
            <template
              v-slot:option="option"
            >{{ $i18n.locale == "ar" ? option.name_local : option.name }}</template>
            <template #no-options>{{ $t("noMatching") }}</template>
          </v-select>
        </b-col>
        <b-col md="4">
          <b-form-group label-for="mc-program">
            <v-select
              v-model="filter.pre_university_certificate_groupe"
              :placeholder="$t('Global.certificate_country')"
              :options="certificate_sections"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :reduce="(el) => el.id"
              :clearable="false"
              :label="getSelectLabel()"
              class="w-100"
            >
              <template slot="selected-option" slot-scope="option">
                <span v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</span>
                <span v-else>{{ option.name || option.name_local }}</span>
              </template>
              <template v-slot:option="option">
                {{
                $i18n.locale == "ar"
                ? option.name_local || option.name
                : option.name || option.name_local
                }}
              </template>
              <template #no-options>{{ $t("noMatching") }}</template>
            </v-select>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label-for="mc-program">
            <v-select
              v-model="filter.pre_university_certificate"
              :placeholder="$t('Global.pre_university_certificate')"
              :options="certificates"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :reduce="(el) => el.id"
              :clearable="false"
              :disabled="
                !filter.pre_university_certificate &&
                !filter.pre_university_certificate_groupe
              "
              :label="getSelectLabel()"
              class="w-100"
            >
              <template slot="selected-option" slot-scope="option">
                <span v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</span>
                <span v-else>{{ option.name || option.name_local }}</span>
              </template>
              <template v-slot:option="option">
                {{
                $i18n.locale == "ar"
                ? option.name_local || option.name
                : option.name || option.name_local
                }}
              </template>
              <template #no-options>{{ $t("noMatching") }}</template>
            </v-select>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label-for="mc-program">
            <v-select
              v-model="filter.pre_university_certificate_type"
              :placeholder="$t('Global.pre_university_certificate_type')"
              :options="certificate_types"
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              :disabled="
                !filter.pre_university_certificate &&
                !filter.pre_university_certificate_type
              "
              :label="getSelectLabel()"
              :clearable="false"
              :reduce="(el) => el.id"
              class="w-100"
            >
              <template slot="selected-option" slot-scope="option">
                <span v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</span>
                <span v-else>
                  {{ option.name || option.name_local }}
                  <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                  {{ option.bylaw ? option.bylaw.faculty.name : '' }}-->
                </span>
              </template>
              <template v-slot:option="option">
                {{
                $i18n.locale == "ar"
                ? option.name_local || option.name
                : option.name || option.name_local
                }}
              </template>
              <template #no-options>{{ $t("noMatching") }}</template>
            </v-select>
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <v-select
            :filter="fuseSearch"
            v-model="filter.country_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="appLookups.countries"
            class="w-100 mb-2"
            label="name"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.country')"
          >
            <template
              v-slot:option="option"
            >{{ $i18n.locale == "ar" ? option.name_local : option.name }}</template>
            <template slot="selected-option" slot-scope="option">
              <span v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</span>
              <span v-else>
                {{ option.name || option.name_local }}
                <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                {{ option.bylaw ? option.bylaw.faculty.name : '' }}-->
              </span>
            </template>
            <template #no-options>{{ $t("noMatching") }}</template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4">
          <v-select
            v-model="filter.year"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="admission_years"
            label="name"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.year')"
          >
            <template slot="selected-option" slot-scope="option">
              <span v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</span>
              <span v-else>
                {{ option.name || option.name_local }}
                <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                {{ option.bylaw ? option.bylaw.faculty.name : '' }}-->
              </span>
            </template>
            <template v-slot:option="option">
              {{
              $i18n.locale == "ar"
              ? option.name_local || option.name
              : option.name || option.name_local
              }}
            </template>
            <template #no-options>{{ $t("noMatching") }}</template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4">
          <v-select
            :filter="fuseSearch"
            v-model="filter.faculty_reference_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.faculties"
            label="name"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.faculty_preference')"
          >
            <template slot="selected-option" slot-scope="option">
              <span v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</span>
              <span v-else>
                {{ option.name || option.name_local }}
                <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                {{ option.bylaw ? option.bylaw.faculty.name : '' }}-->
              </span>
            </template>
            <template v-slot:option="option">
              {{
              $i18n.locale == "ar"
              ? option.name_local || option.name
              : option.name || option.name_local
              }}
            </template>
            <template #no-options>{{ $t("noMatching") }}</template>
          </v-select>
        </b-col>
        <b-col md="2">
          <b-form-group label-for="from" invalid-feedback="from">
            <b-form-input
              @keydown.enter.native="setFilter()"
              type="number"
              :placeholder="$t('Global.from_mark%')"
              @keypress="writeNumber($event)"
              id="from"
              v-model="enterFilter.from"
            />
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-form-group label-for="to" invalid-feedback="to">
            <b-form-input
              @keydown.enter.native="setFilter()"
              type="number"
              :placeholder="$t('Global.to_mark%')"
              :disabled="!enterFilter.from"
              @keypress="writeNumber($event)"
              id="to"
              v-model="enterFilter.to"
            />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="4">
          <v-select
            v-model="filter.egyptian"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.egyptians_nonegyptians"
            label="name"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Egyptians / Non-Egyptians')"
          >
            <template slot="selected-option" slot-scope="option">
              <span v-if="$i18n.locale == 'ar'">{{ option.name_local || option.name }}</span>
              <span v-else>
                {{ option.name || option.name_local }}
                <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                {{ option.bylaw ? option.bylaw.faculty.name : '' }}-->
              </span>
            </template>
            <template v-slot:option="option">
              {{
              $i18n.locale == "ar"
              ? option.name_local || option.name
              : option.name || option.name_local
              }}
            </template>
            <template #no-options>{{ $t("noMatching") }}</template>
          </v-select>
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <b-form-datepicker
            :label-no-date-selected="$t('Global.no_selected')"
            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
            id="date_applied_from"
            ref="date_applied_from"
            reset-button
            v-model="filter.date_applied_from"
            :placeholder="$t('date_from')"
          />
        </b-col>
        <b-col cols="12" md="4" class="mb-1">
          <b-form-datepicker
            :label-no-date-selected="$t('Global.no_selected')"
            :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
            id="date_applied_to"
            ref="date_applied_to"
            reset-button
            v-model="filter.date_applied_to"
            :placeholder="$t('date_to')"
          />
        </b-col>
      </template>
      <template #customTable>
        <b-table
          :busy="load"
          @sort-changed="sortingChanged"
          no-local-sorting
          class="position-relative"
          :items="items"
          responsive
          :fields="fields"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle" />
            </div>
          </template>
          <template #cell(certificate)="data">
            <div>
              <div v-if="$i18n.locale == 'en'">
                <span v-if="data.item.pre_university_certificate">
                  {{
                  data.item.pre_university_certificate.name ||
                  data.item.pre_university_certificate.name_local
                  }},
                </span>
                <span v-if="data.item.pre_university_certificate_type">
                  {{
                  data.item.pre_university_certificate_type.name ||
                  data.item.pre_university_certificate_type.name_local
                  }}
                </span>
                <span v-if="data.item.qualification_country">
                  {{
                  data.item.qualification_country.name ||
                  data.item.qualification_country.name_local
                  }}
                </span>
              </div>
              <div v-if="$i18n.locale == 'ar'">
                <span v-if="data.item.pre_university_certificate">
                  {{
                  data.item.pre_university_certificate.name_local ||
                  data.item.pre_university_certificate.name
                  }},
                </span>
                <span v-if="data.item.pre_university_certificate_type">
                  {{
                  data.item.pre_university_certificate_type.name_local ||
                  data.item.pre_university_certificate_type.name
                  }}
                </span>
                <span v-if="data.item.qualification_country">
                  {{
                  data.item.qualification_country.name_local ||
                  data.item.qualification_country.name
                  }}
                </span>
              </div>
            </div>
          </template>
          <template #cell(country)="data">
            <div v-if="data.item.birth_country">
              <div v-if="$i18n.locale == 'en'">{{ data.item.birth_country.name }}</div>
              <div v-if="$i18n.locale == 'ar'">{{ data.item.birth_country.name_local }}</div>
            </div>
          </template>
          <template #cell(year)="data">
            <div v-if="data.item">
              <!--                            {{ toLocalYear(data.item.qualification_date)}}-->
              {{ data.item.year }}
            </div>
          </template>
          <template #cell(name)="data">
            <b-media vertical-align="center" class="d-inline-flex align-items-center">
              <template v-if="data.item.name" #aside>
                <b-form-checkbox
                  v-model="selected"
                  style="margin-top: 6px"
                  :value="data.item.id"
                  class="d-flex align-items-center custom-control-primary"
                />
                <b-avatar
                  size="35"
                  :text="avatarText(data.item.name)"
                  v-if="data.item.photo_url"
                  :src="data.item.photo_url"
                />
                <b-avatar size="35" :text="avatarText(data.item.name)" v-else />
              </template>
              <b-link
                v-if="$i18n.locale == 'ar'"
                class="font-weight-bold d-inline-block"
                :to="{ name: 'applicant', params: { id: data.item.id } }"
              >
                {{
                data.item && data.item.name_local ? data.item.name_local : "-"
                }}
              </b-link>
              <b-link
                v-if="$i18n.locale == 'en'"
                class="font-weight-bold d-inline-block"
                :to="{ name: 'applicant', params: { id: data.item.id } }"
              >{{ data.item && data.item.name ? data.item.name : "-" }}</b-link>
              <br />
            </b-media>
          </template>

          <template #cell(preferences)="data">
            <div
              v-if="
                data.item.desires &&
                data.item.desires.desire_one &&
                data.item.desires.desire_one.faculty
              "
            >
              <small v-if="$i18n.locale == 'en' && data.item.desires">
                {{
                data.item.desires.desire_one.faculty.name ||
                data.item.desires.desire_one.faculty.name_local
                }}
                <span
                  v-if="data.item.desires.desire_one.program"
                >
                  ({{
                  data.item.desires.desire_one.program.name ||
                  data.item.desires.desire_one.program.name_local
                  }})
                </span>
              </small>
              <span v-if="$i18n.locale == 'ar' && data.item.desires">
                {{
                data.item.desires.desire_one.faculty.name_local ||
                data.item.desires.desire_one.faculty.name
                }}
                <span
                  v-if="data.item.desires.desire_one.program"
                >
                  ({{
                  data.item.desires.desire_one.program.name_local ||
                  data.item.desires.desire_one.program.name
                  }})
                </span>
                <br />
              </span>
              <b-badge active pill variant="primary">
                <span v-if="data.item.desires.desire_one.program_setting.quota">
                  {{ $t("Global.program") }}
                  ( {{ data.item.desires.desire_one.program_setting.count }} /{{
                  data.item.desires.desire_one.program_setting.quota
                  }}
                  )
                </span>
                <span v-else>
                  ( {{ data.item.desires.desire_one.setting.count }} /{{
                  data.item.desires.desire_one.setting.quota
                  }}
                  )
                </span>
              </b-badge>
            </div>
          </template>

          <template #cell(admission_type)="data">
            <div vertical-align="center" class="d-inline-flex align-items-center">
              {{
              data.item && data.item.admission_type
              ? data.item.admission_type.name
              : "-"
              }}
            </div>
          </template>
          <template #cell(certificate_degree)="data">
            <div class="text-bold text-dark">{{ data.item.certificate_degree }} %</div>
          </template>
          <template #cell(created_at)="data">
            <div v-if="data.item.created_at">
              {{
              toLocalDatetime(data.item.created_at, $i18n.locale, true, false)
              }}
            </div>
          </template>
          <template #cell(status)="data">
            <b-badge
              v-if="$i18n.locale == 'ar'"
              pill
              :variant="
                getStatus(data.item.status ? data.item.status.id : 0).color
              "
              class="text-capitalize"
            >{{ data.item.status.name_local }}</b-badge>
            <b-badge
              v-if="$i18n.locale == 'en'"
              pill
              :variant="
                getStatus(data.item.status ? data.item.status.id : 0).color
              "
              class="text-capitalize"
            >{{ data.item.status.name }}</b-badge>
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
                  <feather-icon icon="MoreVerticalIcon" size="16" class="align-middle" />
                </template>
              </b-dropdown>
              <a
                v-b-tooltip.hover="$t('Global.edit')"
                v-if="data.item.secret && hasPermission('edit_applicant')"
                :href="data.item.link"
                target="_blank"
              >
                <feather-icon icon="EditIcon" style="cursor: pointer" />
                <!-- @click="$router.push({ name: 'bylaw_edit', params: { id: data.item.id } })" -->
              </a>
              <a v-b-tooltip.hover="$t('Global.delete')">
                <feather-icon
                  v-if="hasPermission('delete_applicant')"
                  icon="Trash2Icon"
                  style="cursor: pointer"
                  class="text-danger"
                  @click="remove(data.item.id)"
                />
              </a>
            </div>
          </template>
        </b-table>
      </template>
      <template #action>
        <b-button
          @click="filter.export = 1"
          v-if="hasPermission('export_applicant')"
          v-b-tooltip.hover="$t('Global.export_excel')"
          variant="primary"
          class="btn-icon"
        >
          <feather-icon icon="FileTextIcon" />
        </b-button>

        <b-button
          @click="bulk"
          v-if="hasPermission('distribute_applicant')"
          :disabled="selected.length < 1"
          v-b-tooltip.hover="$t('Global.distribution')"
          variant="primary"
          class="btn-icon ml-1"
        >
          <!--          <b-badge v-if="selected.length" pill class="mx-0 my-0 p-0 font-small-1" variant="light-success">-->
          <!--            {{ selected.length }} {{ $t('Global.item') }}-->
          <!--          </b-badge>-->
          <!--          <span v-else> {{ $t('Global.distribution') }}</span>-->
          <span>{{ $t("Global.distribution") }}</span>
          <b-badge v-if="selected.length" class="m-0 py-0" variant="dark">{{ selected.length }}</b-badge>

          <!--          <feather-icon icon="CommandIcon" />-->
          <!--          <b-badge v-if="selected.length > 0" pill :variant="`warning`">-->
          <!--            {{ selected.length }}-->
          <!--          </b-badge>-->
        </b-button>
        <!-- <b-dropdown
                        :right="$store.state.appConfig.layout.isRTL"
                        variant="primary"
                >
                    <template #button-content>
                        {{$t('Global.action')}}
                        <b-badge
                                v-if="selected.length > 0"
                                pill
                                :variant="`warning`"
                        >
                            {{ selected.length }}
                        </b-badge>
                    </template>
                    <b-dropdown-item @click="filter.export = 1">
                        <feather-icon icon="FileTextIcon"/>
                        <span class="align-middle ml-50">{{
            $t('Global.export_excel')
          }}</span>
                    </b-dropdown-item>
                    <b-dropdown-item v-if="hasPermission('distribute_applicant')" :disabled="selected.length < 1"
                                     @click="bulk">
                        <feather-icon icon="CommandIcon"/>
                        <span class="align-middle ml-50">{{
                            $t('Global.distribution')
                          }}</span>
                    </b-dropdown-item>
        </b-dropdown>-->
        <!--      <b-button @click="filter.export = 1" class="btn-icon ml-1" v-b-tooltip.hover="$t('Global.export_excel')"  variant="primary"> <feather-icon icon="FileTextIcon" /></b-button>-->

        <input ref="refInputEl" type="file" class="d-none" @change="upload" />
      </template>
    </DataTable>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BFormGroup,
  BButton,
  BTable,
  BFormCheckbox,
  BFormCheckboxGroup,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BSpinner,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BFormDatepicker,
  BPopover
} from "bootstrap-vue";
import { mapGetters, mapActions } from "vuex";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import { avatarText } from "@core/utils/filter";
import DataTable from "@/views/components/table/DataTable";
import Statistics from "@/views/components/info/statistics";

export default {
  components: {
    Statistics,
    DataTable,
    BCard,
    vSelect,
    BRow,
    BSpinner,
    BFormDatepicker,
    BCol,
    BOverlay,
    BCardHeader,
    BFormCheckbox,
    BFormCheckboxGroup,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BFormGroup,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    VBModal,
    BPopover
  },
  directives: {
    "b-modal": VBModal,
    Ripple
  },
  data() {
    return {
      link: "",
      filter: {
        removed: 0,
        export: 0,
        admission_term_UG_id: null,
        admission_term_PG_id: null,
        pre_university_certificate_groupe: null,
        faculty_reference_id: null,
        year: null,
        country_id: null,
        pre_university_certificate_type: null,
        pre_university_certificate: null
      },
      selected: [],
      pre_university_certificate_groupe: null,
      pre_university_certificate: null,
      pre_university_certificate_type: null,
      pre_university_certificate_types: [],
      appLookups: null,
      enterFilter: {},
      paramsLoaded: true,
      lookupModules: {
        countries: true,
        pre_certificates: true
      }
    };
  },
  computed: {
    ...mapGetters({
      items: "applicants/items",
      total: "applicants/total",
      load: "applicants/load",
      lookups: "applicants/lookups",
      details: "applicants/details",
      currentAdmissionTerm: "app/currentAdmissionTerm",
      needDrop: "app/needDrop"
    }),
    admission_years() {
      let current_year = new Date().getFullYear();
      let pre_year = Number(current_year) - 1;
      return [
        { id: current_year, name: current_year },
        { id: pre_year, name: pre_year }
      ];
    },
    certificate_sections() {
      if (this.appLookups && this.appLookups.certificates) {
        return this.appLookups.certificates;
      }
      return false;
    },
    certificates() {
      if (
        this.appLookups &&
        this.appLookups.certificates &&
        this.filter.pre_university_certificate_groupe
      ) {
        this.certificatesArray = this.appLookups.certificates.find(
          el => el.id == this.filter.pre_university_certificate_groupe
        );
        return this.certificatesArray
          ? this.certificatesArray.pre_university_certificate
          : [];
      }
    },
    certificate_types() {
      if (
        this.appLookups &&
        this.appLookups.certificates &&
        this.filter.pre_university_certificate &&
        this.certificatesArray
      ) {
        const certificateTypeArray = this.certificates
          ? this.certificates.find(
              el => el.id == this.filter.pre_university_certificate
            )
          : {};
        return certificateTypeArray
          ? certificateTypeArray.pre_university_certificate_type
          : [];
      }
    },
    fields() {
      const fields = [
        {
          key: "name",
          label: this.$t("Global.student_name"),
          sortable: true,
          thStyle: { width: "20%" }
        },
        {
          key: "certificate",
          label: this.$t("Global.pre_certificate"),
          sortable: true
        },
        {
          key: "country",
          label: this.$t("Global.country")
        },
        {
          key: "year",
          label: this.$t("Global.year"),
          sortable: true
        },
        {
          key: "certificate_degree",
          label: this.$t("Global.percentage"),
          sortable: true
        },
        {
          key: "preferences",
          label: this.$t("Global.faculty_preference"),
          thStyle: { width: "20%" }
        },
        {
          key: "created_at",
          label: this.$t("Global.date_applied"),
          sortable: true
        },
        // {
        //     label: this.$t('Global.type'),
        //     key: 'admission_type',
        //     sortable: true
        // },

        {
          label: this.$t("Global.status"),
          key: "status",
          sortable: true
        },

        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth"
        }
      ];
      return fields;
    }
  },
  methods: {
    ...mapActions({
      removeApplicant: "applicants/remove",
      exportExcel: "applicants/export",
      getLookups: "app/GET_LOOKUPS",
      updateCurrentTerms: "app/getTerms"
    }),
    reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id"
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find(el => {
        return Object.keys(query).some(qu => {
          return el == qu;
        });
      });
      Object.keys(query).forEach(key => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
    setFilter() {
      if (
        (this.enterFilter.from && this.enterFilter.to) ||
        (!this.enterFilter.from && !this.enterFilter.to)
      ) {
        if (Number(this.enterFilter.from) > Number(this.enterFilter.to)) {
          this.enterFilter.to = null;
        } else {
          this.filter.from = Number(this.enterFilter.from);
          this.filter.to = Number(this.enterFilter.to);
          let query = this.clean(this.filter);
          this.refresh(query);
        }
      }
    },
    refresh(query, type) {
      if (type) {
        this.filter.admission_term_id = null;
      }
      if (this.$route.query["admission_term_UG_id"]) {
        query["admission_term_id"] = this.$route.query["admission_term_UG_id"];
        delete query["admission_term_UG_id"];
      }
      if (this.$route.query["admission_term_PG_id"]) {
        if (this.$route.name.includes("applicants_pg")) {
          query["admission_term_id"] = this.$route.query[
            "admission_term_PG_id"
          ];
          delete query["admission_term_PG_id"];
        } else if (this.$route.query["admission_term_PG_id"]) {
          delete query["admission_term_PG_id"];
        }
      }
      if (this.appLookups) {
        query = { ...query, status: 3 };
        let payload = {
          query: query
        };
        if (!this.$route.name.includes("_pg")) {
          payload = { ...payload, applicant_type: 1 };
        }
        this.$store.dispatch("applicants/applicants", { payload }).then(_ => {
          this.paramsLoaded = false;
        });
      } else {
        this.getLookups(this.lookupModules).then(data => {
          this.appLookups = data.success;
          query = { ...query, status: 3 };
          let payload = {
            query: query
          };
          if (!this.$route.name.includes("_pg")) {
            payload = { ...payload, applicant_type: 1 };
          }
          this.$store.dispatch("applicants/applicants", { payload }).then(_ => {
            this.paramsLoaded = false;
          });
        });
      }
    },
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1"
        },
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.removeApplicant(id).then(_ => {
            this.refresh();
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted")
            });
          });
        }
      });
    },
    bulk() {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: "Yes",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1"
        },
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.$store
            .dispatch("applicants/bulk", { applicant_ids: this.selected })
            .then(_ => {
              this.selected = [];
              this.refresh();
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                timer: 1500,
                showConfirmButton: false
              });
            });
        }
      });
    },
    upload(e) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      this.$store.dispatch("applicants/upload", { resource: data }).then(_ => {
        this.refresh();
      });
    },

    Export(query) {
      query = { ...query, status: 3 };
      this.exportExcel({ ...query, language: this.$i18n.locale });
      this.filter.export = 0;
    }
  },
  watch: {
    "$route.name"(val) {
      this.refresh({}, true);
    },
    "enterFilter.from"(val, old) {
      if (!val) {
        this.enterFilter.to = null;
      }
      if (val > 100) {
        this.enterFilter.from = null;
      }
    },
    "enterFilter.to"(val) {
      if (val > 100) {
        this.enterFilter.to = null;
      }
    },
    "filter.pre_university_certificate_groupe": function(newVal, oldVal) {
      if (oldVal) {
        this.pre_university_certificate = null;
        this.pre_university_certificate_type = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
[dir="rtl"]
  .table.b-table
  > thead
  > tr
  > [aria-sort]:not(.b-table-sort-icon-left),
[dir="ltr"]
  .table.b-table
  > tfoot
  > tr
  > [aria-sort]:not(.b-table-sort-icon-left) {
  background-position: right calc(0.5rem / 2) center !important;
}
</style>
