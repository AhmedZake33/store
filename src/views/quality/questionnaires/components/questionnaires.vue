<template>
  <DataTable 
    :total="total" 
    :allowSearch="$route.name == 'offering' ? false : true" 
    :filter="filter" 
    @Refresh="refresh"
    @reset="reset"
  >
    <template #action>
      <b-button
        v-if="hasPermission('add_questionnaire') && $route.name != 'offering'"
        :to="{ name: 'add_questionnaire' }"
        class="btn-icon"
        v-b-tooltip.hover="$t('Global.add')"
        variant="primary"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>
    </template>
    <template #filter v-if="$route.name != 'offering'">
      <b-col cols="12" md="3" v-if="lookups && lookups.terms">
        <v-select
            v-model="filter.term_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.terms"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.term')"
            :label="$i18n.locale == 'en' ? 'name':'name_local'"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="3" v-if="lookups && lookups.questionnaires_types">
        <v-select
            v-model="filter.questionnaire_type_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.questionnaires_types"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.questionnaires_types')"
            :label="$i18n.locale == 'en' ? 'name':'name_local'"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="3" v-if="lookups && lookups.types">
        <v-select
            v-model="filter.type_id"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            :options="lookups.types"
            class="w-100 mb-1"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.types')"
            :label="$i18n.locale == 'en' ? 'name':'name_local'"
          >
            <template v-slot:option="option">
              {{ $i18n.locale == "ar" ? option.name_local : option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                <strong v-else>{{ name }} </strong>
              </div>
            </template>
            <template #no-options>
              {{ $t("noMatching") }}
            </template>
        </v-select>
      </b-col>
      <b-col cols="12" md="3" v-if="lookups && lookups.faculties">
          <v-select
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="filter.faculty_id"
              :options="lookups.faculties"
              :label="'name'.replaceAll('_', ' ')"
              class="w-100 mb-1"
              :reduce="(val) => val.id"
              :placeholder="$t('faculties')"
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
      <b-col cols="12" md="3" v-if="lookups && lookups.bylaws">
          <v-select
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="filter.bylaw_id"
              :options="lookups.bylaws"
              :disabled="filter.faculty_id == null"
              :label="'name'.replaceAll('_', ' ')"
              class="w-100 mb-1"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.bylaws')"
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
      <b-col cols="12" md="3" v-if="lookups && lookups.programs">
          <v-select
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="filter.program_id"
              :options="lookups.programs"
              :disabled="filter.bylaw_id == null"
              :label="'name'.replaceAll('_', ' ')"
              class="w-100 mb-1"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.programs')"
          >
          <template v-slot:option="option">
              {{
              $i18n.locale == "ar"
                  ? option.name_local
                  : option.name
              }}
          </template>
          <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'"
                  >{{ name_local }}
              </strong>
              <strong v-else>{{ name }}</strong>
              </div>
          </template>
          <template #no-options>
              {{ $t('noMatching') }}
          </template>
          </v-select>
      </b-col>
      <b-col cols="12" md="3" v-if="lookups && lookups.courses">
          <v-select
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="filter.course_id"
              :options="lookups.courses"
              :disabled="filter.program_id == null"
              :label="'name'.replaceAll('_', ' ')"
              class="w-100 mb-1"
              :reduce="(val) => val.id"
              :placeholder="$t('Global.courses')"
          >
          <template v-slot:option="option">
              {{
              $i18n.locale == "ar"
                  ? option.name_local
                  : option.name
              }}
          </template>
          <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
              <strong v-if="$i18n.locale == 'ar'"
                  >{{ name_local }}
              </strong>
              <strong v-else>{{ name }}</strong>
              </div>
          </template>
          <template #no-options>
              {{ $t('noMatching') }}
          </template>
          </v-select>
      </b-col>
    </template>
    <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
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
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template #cell(course)="data">
            <div class="d-flex" v-if="data.item.course">
              <b-link
                  v-if="$i18n.locale == 'en'"
                  class="font-weight-bold custom_link h5"
                  :to="{ name: 'offering', params: { id: data.item.offering_id } }"
              >
                {{
                  data.item.course
                      ? `${data.item.course.code} &nbsp; ${data.item.course.name}`
                      : '-'
                }}
              </b-link>
              <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold custom_link h5"
                  :to="{ name: 'offering', params: { id: data.item.offering_id } }"
              >
                {{
                  data.item.course
                      ? `${data.item.course.code} &nbsp; ${data.item.course.name_local}`
                      : '-'
                }}
              </b-link>
            </div>

            <!-- faculty AND bylaw AND satge  -->
            <div>
              <div v-if="$i18n.locale == 'en'" class="d-flex flex-wrap">
                <b-link
                    v-if="data.item.course && data.item.course.bylaw.faculty"
                    class="font-weight-bold custom_link d-block"
                    :to="{
                    name: 'faculty',
                    params: { id: data.item.course.bylaw.faculty.id },
                  }"
                >
                  {{ data.item.course.bylaw.faculty.name }}
                </b-link>
                &nbsp; &ndash; &nbsp;
                <b-link
                    v-if="data.item.course && data.item.course.bylaw"
                    class="font-weight-bold custom_link d-block"
                    :to="{
                    name: 'bylaw',
                    params: { id: data.item.course.bylaw.id },
                  }"
                >
                  {{ data.item.course.bylaw.name }}
                </b-link>
              </div>
              <div v-else class="d-flex flex-wrap">
                <b-link
                    v-if="data.item.course && data.item.course.bylaw.faculty"
                    class="font-weight-bold custom_link d-block"
                    :to="{
                    name: 'faculty',
                    params: { id: data.item.course.bylaw.faculty.id },
                  }"
                >
                  {{ data.item.course.bylaw.faculty.name_local }}
                </b-link>
                &ndash;
                <b-link
                    v-if="data.item.course && data.item.course.bylaw"
                    class="font-weight-bold custom_link d-block"
                    :to="{
                    name: 'bylaw',
                    params: { id: data.item.course.bylaw.id },
                  }"
                >
                  {{ data.item.course.bylaw.name_local }}
                </b-link>
              </div>
            </div>
            
          </template>
          <template #cell(id)="data">
            <div v-if="data.item.questionnaire_type">
              <b-link @click="show(data.item.id)" v-if="hasPermission('show_questionnaire')">
                {{ data.item.id }}
              </b-link>
              <div v-else>
                {{ data.item.id }}
              </div>
            </div>
          </template>
          <template #cell(active)="data">
            <div>
              <span v-if="$i18n.locale == 'ar'">
                {{ data.item.active == 'Active' ? 'نشط' : 'غير نشط' }}
              </span>
              <span v-else>
                {{ data.item.active}}
              </span>
            </div>
          </template>
          <template #cell(type)="data">
            <div v-if="data.item.type">
              {{ $i18n.locale == 'ar' ? data.item.type.name_local : data.item.type.name }}
            </div>
          </template>
          <template #cell(questionnaire_type)="data">
            <div v-if="data.item.questionnaire_type">
              <b-link :to="{ name: 'show_questionnairesTypes' , params: { id : data.item.questionnaire_type.id} }">
                {{ $i18n.locale == 'ar' ? data.item.questionnaire_type.name_local : data.item.questionnaire_type.name }}
              </b-link>
            </div>
          </template>
          <template #cell(actions)="data">
            <div>
              <b-link v-if="data.item.active == 'Active'">
    <feather-icon 
        v-if="hasPermission('active_questionnaire') || canActiveSurvey"
        v-b-tooltip.hover="$t('Global.make_inactive')"
        icon="ToggleRightIcon" 
        @click="changeStatus(data.item)" 
        class="text-primary"
        size="24" 
    />
</b-link>
<b-link v-else>
    <feather-icon 
        v-if="hasPermission('active_questionnaire') || canActiveSurvey"
        v-b-tooltip.hover="$t('Global.make_active')"
        icon="ToggleLeftIcon" 
        @click="changeStatus(data.item)" 
        class="text-primary"
        size="24"
    />
</b-link>
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
                  v-if="hasPermission('access_questionnaire') || canActiveSurvey"
                  v-b-tooltip.hover="$t('Global.view')"
                  icon="EyeIcon" 
                  @click="statistics(data.item.id)" 
                  class="text-primary"
                />
              </b-link>
              <!-- <b-link>
                <feather-icon 
                  v-if="hasPermission('edit_questionnaire')"
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon" 
                  @click="open(data.item.id)" 
                  class="text-primary"
                />
              </b-link> -->
              <b-link>
                <feather-icon 
                  v-if="hasPermission('delete_questionnaire') && $route.name != 'offering'"
                  v-b-tooltip.hover="$t('Global.delete')" 
                  icon="Trash2Icon"  
                  class="text-danger"
                  @click="deleteQuestionnaireType(data.item.id)" 
                />
              </b-link>
            </div>
          </template>
        </b-table>
    </template>
  </DataTable>
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
    BSpinner,
    BDropdownItem,
    BPagination,
    BOverlay,
    BCardHeader,
    BCardBody,
    BModal,
    VBModal,
    BFormCheckbox,
    BPopover
  } from 'bootstrap-vue';
  import DataTable from '@/views/components/table/DataTable';
  import { mapGetters } from 'vuex';
  import Ripple from 'vue-ripple-directive';
  import vSelect from 'vue-select';
  import { avatarText } from '@core/utils/filter';

  export default {
    name: 'Questionnaires',
    components: {
      DataTable,
      BCard,
      vSelect,
      BRow,
      BSpinner,
      BFormCheckbox,
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
      'b-modal': VBModal,
      Ripple,
    },
    props:{
      course_id : null,
      canActiveSurvey: false
    },
    watch:{
      "active"(val){
        const payload = { id: this.editedId, query: {active: this.active} };
        this.$store
          .dispatch("questionnaires/put", payload)
          .then((response) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            if(this.$route.name == "add_questionnaire"){
              this.$router.go(-1)
            }else{
              this.init();
              this.$emit('hide');
            }
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
      }
    },
    data() {
      return {
        filter: {},
        active: null,
        editedId: null
      };
    },
    computed: {
      ...mapGetters({
        items: 'questionnaires/items',
        total: 'questionnaires/total',
        load: 'questionnaires/load',
        needDrop:'app/needDrop',
        lookups: 'questionnaires/lookups',
      }),
      fields(){
        return[
          {
            key: "id",
            label: this.$t("Global.id"),
            sortable: true,
          },
          {
            key: "course",
            label: this.$t("Global.course"),
            sortable: true,
          },
          {
            key: "questionnaire_type",
            label: this.$t("Global.questionnaire_type"),
            sortable: false,
          },
          
          {
            key: "starts_at",
            label: this.$t("Global.start_date"),
            sortable: false,
          },
          {
            key: "ends_at",
            label: this.$t("Global.end_date"),
            sortable: false,
          },
          {
            key: "participants",
            label: this.$t("Global.participants"),
            sortable: false,
          },
          {
            key: "score",
            label: this.$t("Global.score"),
            sortable: false,
          },
          {
            key: "std",
            label: this.$t("Global.std"),
            sortable: false,
          },
          {
            key: "comments_count",
            label: this.$t("Global.comments_count"),
            sortable: false,
          },
          {
            key: "type",
            label: this.$t("Global.type"),
            sortable: false,
          },
          {
            key: "active",
            label: this.$t("Global.active"),
            sortable: false,
          },
          {
            key: 'actions',
            label: this.$t("Global.actions"),
            thClass: 'customAction',
            tdClass: 'customWidth',
          },
        ]
      }
    },
    methods: {
      refresh(query) {
        query = {
          ...query,
          type: this.type
        };
        if(this.course_id){
          query = {
          ...query,
          course_id: this.course_id
        };
        }

        if(this.$route.name != 'offering'){
          this.$store.dispatch('questionnaires/questionnaires', {
            query: query
          }).then(_=>{
            this.filter.term_id = this.lookups ? this.lookups.current_term.id : null
          });
        }else {
          this.$store.dispatch('questionnaires/offeringQuestionnaires', {
            query: query
          }).then(_=>{
            this.filter.term_id = this.lookups ? this.lookups.current_term.id : null
          });
        }
      },
      getColor(type) {
        if (type == 0) {
          return "light-success";
        }else{
          return "light-danger";
        } 
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
      changeStatus(val){
        const payload = {id: val.id}
        this.$store
          .dispatch("questionnaires/changeStatus", payload)
          .then((response) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.refresh()
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              text: `${error || this.$t("Global.errorMessage")}`,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      },
      open(id){
        this.$router.push({
          name: "edit_questionnaire",
          params: { id : id },
          query: { inline: true }
        });
      },
      show(id){
        this.$router.push({
          name: "show_questionnaire",
          params: { id : id }
        });
      },
      statistics(id){
        this.$router.push({
          name: "show_questionnaireStatistics",
          params: { id : id }
        });
      },
      deleteQuestionnaireType(id) {
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
                this.popoverShow = false;
                this.$store.dispatch('questionnaires/remove', id).then(response => {
                    this.$swal({
                        icon: 'success',
                        title: this.$t('Global.Deleted'),
                        showConfirmButton: false,
                        timer: 1500,
                    })
                    this.refresh()
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