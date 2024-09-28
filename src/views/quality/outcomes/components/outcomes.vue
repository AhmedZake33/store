<template>
  <div>
    <DataTable :total="total" :allowSearch="true" :filter="filter" @Refresh="refresh">
      <template #action>
        <b-button v-if="hasPermission('edit_courseOutcome')" @click="openDialog()" class="btn-icon" v-b-tooltip.hover="$t('Global.add')" variant="primary">
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
              <span> {{ data.item.type.modifier || '-' }} ({{ data.item.modifier }}) </span>
            </div>
          </template>
          <template #cell(outcome)="data">
            <div v-if="data.item.outcome">
              {{ data.item.outcome }}
            </div>
          </template>
          <template #cell(programs_outcomes)="data">
            <div v-if="data.item.programs_outcomes">
              <span :key="outcome.id" v-for="outcome in data.item.programs_outcomes">
                <b-badge pill variant="info" class="text-capitalize mx-1" v-b-tooltip.hover="outcome.outcome">
                  <small> {{ outcome.type.modifier + outcome.modifier }} {{ outcome.program && outcome.program.code ? '('+outcome.program.code+')':'' }}</small>
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
              <b-link class="mx-1" v-if="hasPermission('edit_courseOutcome')">
                <feather-icon @click="openDialog(data.item)" v-if="hasPermission('edit_courseOutcome')" v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon" style="cursor: pointer" />
              </b-link>
              <b-link>
                <feather-icon v-if="hasPermission('delete_courseOutcome')" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" @click="remove(data.item.id)" />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <b-modal id="course_outcomes" v-model="course_outcomes" no-close-on-backdrop size="lg" :title="$t('Global.course_outcomes')">
      <validation-observer ref="simpleRules1">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="10">
              <b-form-group>
                <validation-provider #default="{ errors }" rules="required">
                  <v-select :filter="fuseSearch" v-model="form.type_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.types || []" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.course_outcomes_type')">
                    <template slot="selected-option" slot-scope="option">
                      <span>
                        {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                        <!--                                            {{ $t(`Global.${option.label}`) }}-->
                      </span>
                    </template>
                    <template v-slot:option="option">{{ $i18n.locale == 'ar' ? option.name_local : option.name }} </template>
                  </v-select>
                  <ValidationErrors :frontend-errors="errors" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group>
                <validation-provider #default="{ errors }" name="modifier" rules="required">
                  <b-form-input :placeholder="$t('Global.modifier')" id="modifier" v-model="form.modifier" :state="errors.length > 0 ? false : null" />
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group :label="$t('Global.learning_outcome')">
                <validation-provider #default="{ errors }" name="outcomes">
                  <b-form-textarea class="mb-2" :placeholder="$t('Global.outcome')" id="outcome-input" v-model="form.outcome" rows="3" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'learning_outcome')" />
                </validation-provider>

                <validation-provider #default="{ errors }" v-if="!program_id">
                  <v-select :filter="fuseSearch" multiple v-model="form.program_outcome_ids" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.programs_outcomes || []" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.plan_outcomes_search')">
                    <template slot="selected-option" slot-scope="option">
                      <span>
                    {{  option.outcome ? '('+option.type.modifier + option.modifier + ') ' + (option.program.code ? option.program.code :'') + ': ' + option.outcome : '' }}
                      </span>
                    </template>
                    <template v-slot:option="option">
                    {{  option.outcome ? '('+option.type.modifier + option.modifier + ') ' + (option.program.code ? option.program.code :'') + ': ' + option.outcome : '' }}
                    </template>
                  </v-select>
                  <ValidationErrors :frontend-errors="errors" />
                </validation-provider>
              </b-form-group>
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
            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="course_outcomes = false">
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
  name: 'Outcomes',
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
  props: {
    program_id: Number,
    offering_id:Number
  },
  data() {
    return {
      course_outcomes: false,
      course_topics: false,
      teaching_learning_methods: false,
      errorsdata: [],
      filter: {},
      form: {},
    };
  },
  computed: {
    ...mapGetters({
      items: 'outcomes/items',
      total: 'outcomes/total',
      load: 'app/load',
      needDrop:'app/needDrop',
      lookups: 'outcomes/lookups',
    }),
    fields() {
      if (this.program_id) {
        return [
          { key: 'type', label: this.$t('Global.type'), thStyle: { width: '10%' } },
          { key: 'group', label: this.$t('Global.group'), thStyle: { width: '20%' } },
          {
            key: 'outcome',
            label: this.$t('Global.learning_outcome'),
          },
          {
            key: 'actions',
            label: this.$t('Global.actions'),
            thClass: 'customAction',
            tdClass: 'customWidth',
          },
        ];
      } else {
        return [
          { key: 'type', label: this.$t('Global.type'), thStyle: { width: '10%' } },
          { key: 'group', label: this.$t('Global.group'), thStyle: { width: '20%' } },
          {
            key: 'outcome',
            label: this.$t('Global.learning_outcome'),
          },
          {
            thStyle: { width: '20%' },
            key: 'programs_outcomes',
            label: this.$t('Global.plans_outcome'),
          },
          {
            key: 'actions',
            label: this.$t('Global.actions'),
          },
        ];
      }
    },
  },
  methods: {
    refresh(query) {
      if (this.program_id) {
        query = {
          ...query,
          type: this.type,
        };
        this.$store.dispatch('outcomes/programOutcomes', {
          query: query,
        });
      } else {
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
        this.$store.dispatch('outcomes/outcomes', {
          query: query,
          type: this.offering_id ? 'offering-report' : 'courses-specs',
        });
      }
    },
    openDialog(data) {
      if (data) {
        this.id = data.id;
        this.form = data;
        if (!this.program_id) {
          this.form.program_outcome_ids = data?.programs_outcomes.map(el => el.id);
        }
      } else {
        this.id = null;
        this.form = {};
      }
      this.course_outcomes = true;
    },
    openAddCourseTopics() {
      this.course_topics = true;
    },
    openAddTeachingLearningMethods() {
      this.teaching_learning_methods = true;
    },
    save() {
      this.$refs.simpleRules1.validate().then(success => {
        if (success) {
          if (this.program_id) {
            this.form = { ...this.form, ...{ program_id: this.program_id } };
          } else {
            this.form = { ...this.form, ...{ course_id: this.$route.params.id }, ...{ program_outcome_ids: [1, 2] } };
          }
          const payload = {
            id: this.id || null,
            query: this.form,
          };
          if (this.program_id) {
            this.$store
              .dispatch('outcomes/putProgramOutcomes', payload)
              .then(response => {
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 2000,
                });
                this.refresh();
                this.course_outcomes = false;
              })
              .catch(error => {
                this.errorsdata = this.handleBackendError(error.response.data.errors);
              });
          } else {
            this.$store
              .dispatch('outcomes/put', payload)
              .then(response => {
                this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 2000,
                });
                this.refresh();
                this.course_outcomes = false;
              })
              .catch(error => {
                this.errorsdata = this.handleBackendError(error.response.data.errors);
              });
          }
        }
      });
    },
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
            if (this.program_id) {
              this.$store.dispatch('outcomes/removeProgramsOutcomes',[id,this.offering_id ? 'offering-report' : 'courses-specs']).then(response => {
                this.$swal({
                  icon: 'success',
                  title: this.$t('Global.Deleted'),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.refresh();
              });
            } else {
              this.$store.dispatch('outcomes/remove', id).then(response => {
                this.$swal({
                  icon: 'success',
                  title: this.$t('Global.Deleted'),
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.refresh();
              });
            }
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
