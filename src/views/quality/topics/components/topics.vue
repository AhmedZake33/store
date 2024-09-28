<template>
  <div>
    <DataTable :loading="load" :total="total" :allowSearch="true" :filter="filter" @Refresh="refresh">
      <template #action>
        <template v-if="lookups && lookups.statistics" >
        <b-badge :key="name" v-for="(value, name) in lookups.statistics[0]" pill :variant="getType(name)" class="text-capitalize mx-1">
          <small>{{ value }} {{ $t(`Global.${getName(name)}`) }}</small>
        </b-badge>
        </template>
        <b-button v-if="hasPermission('edit_courseTopic')" @click="openDialog()" class="btn-icon" v-b-tooltip.hover="$t('Global.add')" variant="primary">
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
        <b-table small           @sort-changed="sortingChanged"
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
          <template #cell(lecture_content)="data">
            <div v-if="data.item.lecture_content">
              <strong>{{ $t('Global.lecture') }} :</strong>
              <span>
                {{ data.item.lecture_content }}
              </span>
            </div>
            <div v-if="data.item.tutorial_content">
              <strong>{{ $t('Global.tutorial') }} :</strong>
              <span>
                {{ data.item.tutorial_content }}
              </span>
            </div>
            <div v-if="data.item.practical_content">
              <strong>{{ $t('Global.practical') }} :</strong>
              <span>
                {{ data.item.practical_content }}
              </span>
            </div>
          </template>
          <template #cell(courses_outcomes)="data">
            <div v-if="data.item.courses_outcomes">
              <span :key="outcome.id" v-for="outcome in data.item.courses_outcomes">
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
              <b-link class="mx-1" v-if="hasPermission('edit_courseTopic')">
                <feather-icon @click="openDialog(data.item)" v-if="hasPermission('edit_courseTopic')" v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon" style="cursor: pointer" />
              </b-link>
              <b-link>
                <feather-icon v-if="hasPermission('delete_courseTopic')" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" @click="remove(data.item.id)" />
              </b-link>
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>

    <b-modal id="course_topics" v-model="course_topics" no-close-on-backdrop size="lg" :title="offering_id ? $t('Global.offering_topics') : $t('Global.course_topics')">
      <validation-observer ref="simpleRules1">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
             <b-col md="12" v-if="offering_id">
              <b-form-group>
                <validation-provider #default="{ errors }" rules="required">
                  <v-select
                    :filter="fuseSearch"
                    v-model="form.course_topic_id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="lookups && lookups.courses_topics ? lookups.courses_topics : []"
                    class="w-100"
                    :reduce="val => val.id"
                    :placeholder="$t('Global.offering_topics')"
                  >
                    <template slot="selected-option" slot-scope="option">
                      <span>
                        {{ $i18n.locale == 'ar' ? option.lecture_content : option.lecture_content }}
                      </span>
                    </template>
                    <template v-slot:option="option">{{ $i18n.locale == 'ar' ? option.lecture_content : option.lecture_content }} </template>
                  </v-select>
                  <ValidationErrors :frontend-errors="errors" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group class="mb-0" :label="$t('Global.lecture_content')">
                <validation-provider #default="{ errors }" name="lecture_content" rules="required">
                  <b-form-textarea class="mb-2" :placeholder="$t('Global.lecture_content')" id="outcome-input" v-model="form.lecture_content" rows="1" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'lecture_content')" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group class="mb-0" :label="$t('Global.tutorial_content')">
                <validation-provider #default="{ errors }" name="tutorial_content">
                  <b-form-textarea class="mb-2" :placeholder="$t('Global.tutorial_content')" id="outcome-input" v-model="form.tutorial_content" rows="1" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'tutorial_content')" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group class="mb-0" :label="$t('Global.practical_content')" label-for="practical_content">
                <validation-provider #default="{ errors }" name="practical_content">
                  <b-form-textarea class="mb-2" :placeholder="$t('Global.practical_content')" id="outcome-input" v-model="form.practical_content" rows="1" />
                  <ValidationErrors :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'practical_content')" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group :label="$t('Global.lecture_hours')" label-for="lecture_hours">
                <validation-provider #default="{ errors }" name="lecture_hours" rules="required">
                  <b-form-input id="lecture_hours" v-model="form.lecture_hours" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group :label="$t('Global.tutorial_hours')" label-for="tutorial_hours">
                <validation-provider #default="{ errors }" name="tutorial_hours" rules="required">
                  <b-form-input id="tutorial_hours" v-model="form.tutorial_hours" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group :label="$t('Global.practical_hours')" label-for="practical_hours">
                <validation-provider #default="{ errors }" name="practical_hours" rules="required">
                  <b-form-input id="practical_hours" v-model="form.practical_hours" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
              <b-form-group :label="$t('Global.order')" label-for="order">
                <validation-provider #default="{ errors }" name="order" rules="required">
                  <b-form-input id="order" v-model="form.topic_order" :state="errors.length > 0 ? false : null" />
                  <ValidationErrors :frontend-errors="errors" />
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
                    {{  option.outcome ? '('+option.type.modifier + option.modifier + ') ' + (option.course.code ? option.course.code :'') + ' : ' + option.outcome : '' }}
                    </span>
                    <span>({{ option.modifier }})</span>
                  </template>
                  <template v-slot:option="option">
                    {{  option.outcome ? '('+option.type.modifier + option.modifier + ') ' + (option.course.code ? option.course.code :'') + ' : ' + option.outcome : '' }}
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
            <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="course_topics = false">
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
  name: 'Topics',
  props:{
    offering_id:Number,
    course_id:Number
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
      course_topics: false,
      teaching_learning_methods: false,
      errorsdata: [],
      filter: {},
      form: {},
    };
  },
  computed: {
    ...mapGetters({
      items: 'topics/items',
      total: 'topics/total',
      load: 'topics/load',
      needDrop:'app/needDrop',
      options: 'topics/lookups',
    }),
    lookups(){
      if(this.options){
        return this.options
      }else{
        return null
      }
    },
    fields() {
      let fields =  [
        { key: 'topic_order', label: this.$t('Global.order'), thStyle: { width: '10%' } },
        { key: 'lecture_content', label: this.$t('Global.contents') },
        {
          key: 'lecture_hours',
          label: this.$t('Global.lecture_hours'),
          thStyle: { width: '5%' },
        },
        {
          key: 'tutorial_hours',
          label: this.$t('Global.tutorial_hours'),
          thStyle: { width: '5%' },
        },
        {
          key: 'practical_hours',
          label: this.$t('Global.practical_hours'),
          thStyle: { width: '5%' },
        },
        {
          key: 'courses_outcomes',
          label: this.$t('Global.outcomes'),
          thStyle: { width: '5%' },
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
      if(this.offering_id){
        fields = fields.filter(el=>el.key!='courses_outcomes')
      }
      return fields
    },
    hour_status() {
      let hour_status = [
        { name: 'lecture_hours', count: 3, type: 'danger' },
        { name: 'tutorial_hours', count: 5, type: 'success' },
        { name: 'laboratory_hours', count: 6, type: 'info' },
      ];
      // if(this.lookups && this.lookups.statistics){
      //   this.lookups.statistics.forEach((element,i) => {
      //     element[0].
      //     hour_status[0].count = Number(element)
      //   });
      // }
      return hour_status;
    },
  },
  methods: {
    refresh(query) {
      if (this.offering_id) {
        query = {
          ...query,
          course_id: this.course_id || null,
        };
      } else {
        query = {
          ...query,
          course_id: this.$route.params.id || null,
        };
      }
      this.$store.dispatch('topics/topics', {
        query: query,
        type: this.offering_id ? 'offering-report' : 'courses-specs',
      });
    },
    getName(name) {
      let filteredName = name.toLowerCase().replace(' ', '_');
      return filteredName;
    },
    getType(name) {
      if (this.getName(name) == 'lecture_hours') {
        return 'danger';
      } else if (this.getName(name) == 'tutorial_hours') {
        return 'primary';
      } else {
        return 'success';
      }
    },
    openDialog(data) {
      if (data) {
        this.id = data.id;
        this.form = data;
         if(!this.offering_id){
           this.form.course_outcome_ids = data?.courses_outcomes.map(el => el.id);
         }else{
          this.form.course_topic_id = data?.courseTopic.id
        }
      } else {
        this.id = null;
        this.form = {};
      }
      this.course_topics = true;
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
            .dispatch('topics/put', payload)
            .then(response => {
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 2000,
              });
              this.refresh();
              this.course_topics = false;
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
    saveCourseTopics() {},
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
            this.$store.dispatch('topics/remove',[id,this.offering_id ? 'offering-report' : 'courses-specs']).then(response => {
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
