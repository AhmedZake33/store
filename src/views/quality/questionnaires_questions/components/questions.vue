<template>
  <DataTable 
    :total="total" 
    :allowSearch="true" 
    :filter="filter" 
    :draggable="true"
    @Drag="drag"
    @Refresh="refresh"
    @reset="reset"
  >
    <template #action >
      <b-button
        v-if="hasPermission('add_questionnaireQuestion')"
        :to="{ name: 'add_questionnaireQuestion', query:{ questionnaire_type_id: id} }"
        class="btn-icon"
        v-b-tooltip.hover="$t('Global.add')"
        variant="primary"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>
    </template>

    <template #filter>
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
    </template>
    
    <template #customTable >
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative list-group list-group-flush cursor-move"
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
          <template #cell(question)="data">
            <div v-if="data.item">
              <b-link :to="{ name: 'show_questionnairesQuestions' , params: { id : data.item.id} , query: {questionnaire_type_id: id}}">
                {{ $i18n.locale == 'ar' ? data.item.question_local : data.item.question}}
              </b-link>
            </div>
          </template>
          <template #cell(type)="data">
            <div v-if="data.item">
                {{ $i18n.locale == 'ar' ? data.item.type.name_local : data.item.type.name}}
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
                <!-- <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template> -->
              </b-dropdown>
              <b-link>
                <feather-icon 
                  v-if="hasPermission('show_questionnaireQuestion')"
                  v-b-tooltip.hover="$t('Global.view')"
                  icon="EyeIcon" 
                  @click="openQuestion(data.item.id)" 
                  class="text-primary"
                />
              </b-link>
              <b-link v-if="data.item.can_edit == true">
                <feather-icon 
                  v-if="hasPermission('edit_questionnaireQuestion')"
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon" 
                  @click="open(data.item.id)" 
                  class="text-primary"
                />
              </b-link>
              <b-link v-if="data.item.can_edit == true">
                <feather-icon 
                  v-if="hasPermission('delete_questionnaireQuestion')"
                  v-b-tooltip.hover="$t('Global.delete')" 
                  icon="Trash2Icon"  
                  class="text-danger"
                  @click="deleteQuestion(data.item.id)" 
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
    BPopover
  } from 'bootstrap-vue';
  import DataTable from '@/views/components/table/DataTable';
  import { mapGetters } from 'vuex';
  import Ripple from 'vue-ripple-directive';
  import vSelect from 'vue-select';
  import { avatarText } from '@core/utils/filter';

  export default {
    name: 'QuestionnairesQuestions',
    components: {
      DataTable,
      BCard,
      vSelect,
      BRow,
      BSpinner,
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
      typeId: null
    },
    data() {
      return {
        filter: {}
      };
    },
    computed: {
      ...mapGetters({
        items: 'questionnairesQuestions/items',
        total: 'questionnairesQuestions/total',
        load: 'questionnairesQuestions/load',
        needDrop:'app/needDrop',
        lookups: 'questionnairesQuestions/lookups',
      }),
      id(){
          return this.$route.params.id ? this.$route.params.id : this.typeId;
      },
      status(){
          return this.$route.query.status ? this.$route.query.status : this.typeId;
      },
      fields(){
        return[
          {
            key: "question",
            label: this.$t("Global.question"),
            sortable: false,
          },
          {
            key: "type",
            label: this.$t("Global.type"),
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
          questionnaire_type_id	: this.id,
        };
        this.$store.dispatch('questionnairesQuestions/questionnairesQuestions', {
          query: query
        });
      },
      open(id){
        this.$router.push({
          name: "edit_questionnaireQuestion",
          params: { id : id },
          query: { inline: true, questionnaire_type_id: this.id }
        });
      },
      openQuestion(id){
        this.$router.push({
          name: "show_questionnairesQuestions",
          params: { id : id },
          query: {questionnaire_type_id: this.id}
        });
      },
      drag(data){
        this.$store.dispatch('questionnairesQuestions/reorderQuestion', {
          query: data
        }).then((response) => {
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
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
      },
      deleteQuestion(id) {
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
                this.$store.dispatch('questionnairesQuestions/remove', id).then(response => {
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
    }
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