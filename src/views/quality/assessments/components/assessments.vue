<template>
  <div>
    <DataTable :loading="load" :total="total" :allowSearch="true" :filter="filter" @Refresh="refresh">
      <template #action>
        <b-badge v-if="max_total" pill variant="success" class="text-capitalize mx-1">
          <small> {{ $t(`Global.total_degree`) }} {{ max_total ? ' : ' + max_total : '' }}</small>
        </b-badge>
        <b-button v-if="hasPermission('edit_courseAssessment')" @click="openDialog()" class="btn-icon" v-b-tooltip.hover="$t('Global.add')" variant="primary">
          <feather-icon icon="PlusIcon" />
        </b-button>
      </template>

      <!-- <template #filter>
      <b-col cols="12" md="4" v-if="lookups">
        <v-select
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          v-model="filter.questionnaire_type_id"
          :options="lookups.questionnaires_types"
          :label="'name'.replaceAll('_', ' ')"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.questionnaires_types')"
        >
          <template v-slot:option="option">
            {{
              $i18n.locale == "ar"
                ? option.name_local.replaceAll("_", " ")
                : option.name.replaceAll("_", " ")
            }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'"
                >{{ name_local.replaceAll("_", " ") }}
              </strong>
              <strong v-else>{{ name.replaceAll("_", " ") }}</strong>
            </div>
          </template>
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4" v-if="lookups">
        <v-select
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          v-model="filter.destination_id"
          :options="lookups.destinations"
          :label="'name'.replaceAll('_', ' ')"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.destinations')"
        >
          <template v-slot:option="option">
            {{
              $i18n.locale == "ar"
                ? option.name_local.replaceAll("_", " ")
                : option.name.replaceAll("_", " ")
            }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'"
                >{{ name_local.replaceAll("_", " ") }}
              </strong>
              <strong v-else>{{ name.replaceAll("_", " ") }}</strong>
            </div>
          </template>
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="4" v-if="lookups">
        <v-select
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          v-model="filter.type_id"
          :options="lookups.types"
          :label="'name'.replaceAll('_', ' ')"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.types')"
        >
          <template v-slot:option="option">
            {{
              $i18n.locale == "ar"
                ? option.name_local.replaceAll("_", " ")
                : option.name.replaceAll("_", " ")
            }}
          </template>
          <template #selected-option="{ name, name_local }">
            <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'"
                >{{ name_local.replaceAll("_", " ") }}
              </strong>
              <strong v-else>{{ name.replaceAll("_", " ") }}</strong>
            </div>
          </template>
          <template #no-options>
            {{ $t('noMatching') }}
          </template>
        </v-select>
      </b-col>
    </template> -->

      <template #customTable>
        <b-table           @sort-changed="sortingChanged"
          no-local-sorting class="position-relative" :items="items" responsive :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <!-- <template #cell(name)="data">
            <div v-if="data.item">
              <b-link :to="{ name: 'show_questionnaire' , params: { id : data.item.id} }">
                {{ $i18n.locale == 'ar' ? data.item.name_local : data.item.name}}
              </b-link>
            </div>
          </template> show_questionnairesTypes-->
          <template #cell(group)="data">
            <div v-if="data.item.type">
              <span>
                {{ $i18n.locale == 'ar' ? data.item.type.name_local : data.item.type.name }}
              </span>
            </div>
          </template>
          <template #cell(type)="data">
            <div v-if="data.item.modifier">
              <span>
                {{ data.item.type.modifier || '-' }}
              </span>
            </div>
          </template>
          <template #cell(outcome)="data">
            <div v-if="data.item.outcome">
              {{ data.item.outcome }}
            </div>
          </template>
          <template #cell(courses_outcomes)="data">
            <div v-if="data.item.courses_outcomes">
              <span :key="outcome.id" v-for="outcome in data.item.courses_outcomes">
                <b-badge pill variant="info" class="text-capitalize mx-1" v-b-tooltip.hover="outcome.outcome">
                  <small> {{ outcome.type.modifier + outcome.modifier }} {{ outcome.program && outcome.program.code ? '(' + outcome.program.code + ')' : '' }}</small>
                </b-badge>
              </span>
            </div>
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
              <b-link class="mx-1" v-if="hasPermission('edit_courseAssessment')">
                <feather-icon @click="openDialog(data.item)" v-if="hasPermission('edit_courseAssessment')" v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon" style="cursor: pointer" />
              </b-link>
              <b-link>
                <feather-icon v-if="hasPermission('delete_courseAssessment')" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" @click="remove(data.item.id)" />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <b-modal id="course_assessments" v-model="course_assessments" no-close-on-backdrop size="lg" :title="offering_id ? $t('Global.offering_assessments') : $t('Global.course_assessments')">
      <validation-observer ref="simpleRules1">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="12" v-if="offering_id">
              <b-form-group>
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    :filter="fuseSearch"
                    v-model="form.course_assessment_id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups && lookups.courses_assessments ? lookups.courses_assessments : []"
                    class="w-100"
                    :reduce="val => val.id"
                    :placeholder="$t('Global.course_assessments')"
                  >
                    <template slot="selected-option" slot-scope="option">
                      <span>
                        {{ $i18n.locale == 'ar' ? option.title : option.title }}
                      </span>
                    </template>
                    <template v-slot:option="option">{{ $i18n.locale == 'ar' ? option.title : option.title }} </template>
                  </v-select>
                  <ValidationErrors :frontend-errors="errors" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group :label="$t('Global.title')">
                <validation-provider #default="{ errors }" name="title">
                  <b-form-input :placeholder="$t('Global.title')" id="outcome-input" v-model="form.title" rows="1" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'title')" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.week')">
                <validation-provider #default="{ errors }" name="week">
                  <b-form-input class="mb-2" :placeholder="$t('Global.week')" id="outcome-input" v-model="form.week" rows="1" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'week')" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.degree')">
                <validation-provider #default="{ errors }" name="degree">
                  <b-form-input :placeholder="$t('Global.degree')" id="outcome-input" v-model="form.degree" rows="1" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'degree')" />
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="12" v-if="!offering_id">
              <validation-provider #default="{ errors }" rules="required">
                <v-select
                  :filter="fuseSearch"
                  multiple
                  v-model="form.course_outcome_ids"
                  :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                  :options="lookups && lookups.courses_outcomes ? lookups.courses_outcomes : []"
                  class="w-100"
                  :reduce="val => val.id"
                  :placeholder="$t('Global.outcomes_search')"
                >
                  <template slot="selected-option" slot-scope="option">
                    <span>
                      {{ option.outcome ? '(' + option.type.modifier + option.modifier + ') ' + (option.course.code ? option.course.code : '') + ' : ' + option.outcome : '' }}
                    </span>
                    <span>({{ option.modifier }})</span>
                  </template>
                  <template v-slot:option="option">
                    {{ option.outcome ? '(' + option.type.modifier + option.modifier + ') ' + (option.course.code ? option.course.code : '') + ' : ' + option.outcome : '' }}
                  </template>
                </v-select>
                <ValidationErrors :frontend-errors="errors" />
              </validation-provider>
            </b-col>
          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="save">
              {{ $t('Global.save') }}
            </b-button>
            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="course_assessments = false">
              {{ $t('Global.cancel') }}
            </b-button>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { BTab, BTabs, BLink, BOverlay, VBModal, BCardHeader, BCardBody, BMedia, BDropdown, BPopover, BDropdownItem, BPagination, BCard, BSpinner, BModal, BAvatar, BTable, BTh, BTr, BButton, BCol, BForm, BBadge, BFormCheckbox, BFormGroup, BFormInput, BRow, BFormTextarea } from 'bootstrap-vue';

import DataTable from '@/views/components/table/DataTable';
import { mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import { avatarText } from '@core/utils/filter';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { required, email } from '@validations';

export default {
  name: 'Assessments',
  props: {
    offering_id: Number,
    max_total: Number,
  },
  components: {
    DataTable,
    BCard,
    BTab,
    BTabs,
    vSelect,
    BRow,
    BTh,
    BTr,
    BSpinner,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    localize,
    BFormCheckbox,
    BCol,
    BForm,
    BFormGroup,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormTextarea,
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
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      course_assessments: false,
      teaching_learning_methods: false,
      errorsdata: [],
      filter: {},
      form: {},
    };
  },
  computed: {
    ...mapGetters({
      items: 'assessments/items',
      total: 'assessments/total',
      load: 'assessments/load',
      needDrop:'app/needDrop',
      lookups: 'assessments/lookups',
    }),
    fields() {
      let fields = [
        { key: 'title', label: this.$t('Global.title') },
        { key: 'week', label: this.$t('Global.week'), thStyle: { width: '15%' } },
        {
          key: 'degree',
          label: this.$t('Global.degree'),
          thStyle: { width: '15%' },
        },
        {
          key: 'courses_outcomes',
          thStyle: { width: '15%' },
          label: this.$t('Global.outcomes'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      if (this.offering_id) {
        fields = fields.filter(el => el.key != 'courses_outcomes');
      }
      return fields;
    },
    hour_status() {
      return [
        { name: 'lecture_hours', count: 3, type: 'danger' },
        { name: 'tutorial_hours', count: 5, type: 'success' },
        { name: 'laboratory_hours', count: 6, type: 'info' },
      ];
    },
  },
  methods: {
    refresh(query) {
      if (this.offering_id) {
        query = {
          ...query,
          offering_id: this.offering_id || null,
        };
      } else {
        query = {
          ...query,
          course_id: this.$route.params.id || null,
        };
      }
      this.$store.dispatch('assessments/assessments', {
        query: query,
        type: this.offering_id ? 'offering-report' : 'courses-specs',
      });
      if (!this.offering_id) return;
      this.$store.dispatch('assessments/lookups', {
        query: { offering_id: this.offering_id || null },
        type: this.offering_id ? 'offering-report' : 'courses-specs',
      });
    },
    openDialog(data) {
      if (data) {
        this.id = data.id;
        this.form = data;
        if (!this.offering_id) {
          this.form.course_outcome_ids = data?.courses_outcomes.map(el => el.id);
        }else{
          this.form.course_assessment_id = data?.courseAssessment.id
        }
      } else {
        this.id = null;
        this.form = {};
      }
      this.course_assessments = true;
    },
    openAddTeachingLearningMethods() {
      this.teaching_learning_methods = true;
    },
    save() {
      this.$refs.simpleRules1.validate().then(success => {
        if (success) {
          if (this.offering_id) {
            this.form = { ...this.form, ...{ offering_id: this.$route.params.id } };
          } else {
            this.form = { ...this.form, ...{ course_id: this.$route.params.id } };
          }
          const payload = {
            id: this.id || null,
            query: this.form,
            type: this.offering_id ? 'offering-report' : 'courses-specs',
          };
          this.$store
            .dispatch('assessments/put', payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 2000,
              });
              this.refresh();
              this.course_assessments = false;
              // if (this.inline) {
              //   this.$emit('Refresh');
              //   this.updateFilterQueryParams({ bread: null }, 'bread');
              //   return this.$emit('hide');
              // }
              // this.$router.push({ name: 'departments' });
              // this.$emit('Refresh',response.data.id);
              // if (!this.id) {
              //   this.$router.push({ name: 'department',params:{id:response.data.id} });
              // }
            })
            .catch(error => {
              this.errorsdata = this.handleBackendError(error.response.data.errors);
            });
        }
      });
    },
    saveCourseAssessments() {},
    saveTeachingLearningMethods() {},
    getColor(type) {
      if (type == 0) {
        return 'light-success';
      } else {
        return 'light-danger';
      }
    },
    open(id) {
      this.$router.push({
        name: 'edit_questionnaire',
        params: { id: id },
        query: { inline: true },
      });
    },
    show(id) {
      this.$router.push({
        name: 'show_questionnaire',
        params: { id: id },
      });
    },
    statistics(id) {
      this.$router.push({
        name: 'show_questionnaireStatistics',
        params: { id: id },
      });
    },
    remove(id) {
      if (this.items) {
        this.$swal({
          title: `${this.$t('Global.deleteTitle')}`,
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
            this.$store.dispatch('assessments/remove', [id, this.offering_id ? 'offering-report' : 'courses-specs']).then(response => {
              this.$swal({
                icon: 'success',
                title: this.$t('Global.Deleted'),
                showConfirmButton: false,
                timer: 1500,
              });
              this.refresh();
            });
          }
        });
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
@import '@core/scss/vue/libs/vue-select.scss';
</style>
