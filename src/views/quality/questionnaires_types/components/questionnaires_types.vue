<template>
<div>
  <DataTable 
    :total="total" 
    :allowSearch="true" 
    :filter="filter" 
    :loading="load"
    @Refresh="refresh"
    @reset="reset"
  >
    <template #action>
      <b-button
        v-if="hasPermission('add_questionnaireType')"
        :to="{ name: 'add_questionnaireType' }"
        class="btn-icon"
        v-b-tooltip.hover="$t('Global.add')"
        variant="primary"
      >
        <feather-icon icon="PlusIcon" />
      </b-button>
    </template>

    <template #filter>
      <b-col cols="12" md="4" v-if="lookups">
        <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.status"
                  :options="getStatusList(true)" class="w-100" :reduce="val => val.value"
                  :placeholder="$t('Global.status')">
            <template slot="selected-option" slot-scope="option">
                    <span>
                        {{ $t(`Global.${option.label}`) }}
                      </span>
            </template>
            <template v-slot:option="option">
                {{ $t(`Global.${option.label}`) }}
            </template>
        </v-select>
        <!-- <v-select
          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
          v-model="filter.status"
          :options="lookups.status"
          :label="'name'.replaceAll('_', ' ')"
          class="w-100 mb-2"
          :reduce="(val) => val.id"
          :placeholder="$t('Global.status')"
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
        </v-select> -->
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
          <template #cell(name)="data">
            <div v-if="data.item">
              <b-link :to="{ name: 'show_questionnairesTypes' , params: { id : data.item.id} }">
                {{ $i18n.locale == 'ar' ? data.item.name_local : data.item.name}}
              </b-link>
            </div>
          </template>
          <template #cell(status)="data">
            <div v-if="data.item">
              <b-badge
                pill
                :variant="getColor(data.item.status.id)"
                class="text-capitalize"
                v-if="data.item.status.id == 0"
              >
                {{ $i18n.locale == 'ar' ? 'نشط' : 'Active' }}
              </b-badge>
              <b-badge
                pill
                :variant="getColor(data.item.status.id)"
                class="text-capitalize"
                v-else
              >
                {{ $i18n.locale == 'ar' ? 'غير نشط' : 'inActive' }}
              </b-badge>
              <!-- <b-badge
                pill
                :variant="'light-success'"
                class="text-capitalize"
              >
                {{ $i18n.locale == 'ar' ? 'نشط' : 'Active' }}
              </b-badge> -->
            </div>
          </template>
          <template #cell(description)="data">
            <div v-if="data.item">
              {{ $i18n.locale == 'ar' ? data.item.description_local : data.item.description }}
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
              <b-link>
                <feather-icon 
                  v-if="hasPermission('access_questionnaireType')"
                  v-b-tooltip.hover="$t('Global.view_form')"
                  icon="MonitorIcon" 
                  @click="openQuestionForm(data.item)" 
                  class="text-primary"
                />
              </b-link>
              <b-link>
                <feather-icon 
                  v-if="hasPermission('access_questionnaireType')"
                  v-b-tooltip.hover="$t('Global.view')"
                  icon="EyeIcon" 
                  @click="openQuestions(data.item)" 
                  class="text-primary"
                />
              </b-link>
              <b-link>
                <feather-icon 
                  v-if="hasPermission('edit_questionnaireType') && data.item.status.id == 0 && data.item.can_edit"
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon" 
                  @click="open(data.item.id)" 
                  class="text-primary"
                />
              </b-link>
              <b-link>
                <feather-icon 
                  v-if="hasPermission('delete_questionnaireType') && data.item.status.id == 0 && data.item.can_edit"
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
  <b-modal id="form_modal" v-model="dialog" ok-only ok-variant="secondary" :ok-title="$t('Global.cancel')" no-close-on-backdrop size="lg" style="background-color: #000">
    <div class="custom_container">

      <QuestionnaireForm :questionnaire_id="questionnaire_id"/>
    </div>
  </b-modal>
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
  import QuestionnaireForm from '@/views/quality/questionnaires_forms/components/form_preview.vue';
  import { mapGetters } from 'vuex';
  import Ripple from 'vue-ripple-directive';
  import vSelect from 'vue-select';
  import { avatarText } from '@core/utils/filter';

  export default {
    name: 'QuestionnairesTypes',
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
      QuestionnaireForm
    },
    directives: {
      'b-modal': VBModal,
      Ripple,
    },
    data() {
      return {
        filter: { status: 0 },
        dialog: false,
        questionnaire_id: null
      };
    },
    computed: {
      ...mapGetters({
        items: 'questionnairesTypes/items',
        total: 'questionnairesTypes/total',
        needDrop:'app/needDrop',
        load: 'questionnairesTypes/load',
        lookups: 'questionnairesTypes/lookups',
      }),
      fields(){
        return[
          {
            key: "name",
            label: this.$t("Global.name"),
            sortable: false,
          },
          {
            key: "description",
            label: this.$t("Global.description"),
            sortable: false,
          },
          {
            key: "status",
            label: this.$t("Global.status"),
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
      reset(){
        this.filter = { status : 0 };
      },
      refresh(query) {
        if (this.filter.status != null) {
          query = { ...query, status: this.filter.status };
        }
        query.status == null ? delete query.status : query.status;
        this.$store.dispatch('questionnairesTypes/questionnairesTypes', {
          query: query
        });
      },
      getColor(status) {
        if (status == 0) {
          return "light-success";
        }else{
          return "light-danger";
        } 
      },
      open(id){
        this.$router.push({
          name: "edit_questionnaireType",
          params: { id : id },
          query: { inline: true }
        });
      },
      openQuestions(item){
        this.$router.push({
          name: "show_questionnairesTypes",
          params: { id : item.id }
        });
      },
      openQuestionForm(item){
        // this.$refs.form_modal.show();
        this.questionnaire_id = item.id
        this.dialog = true
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
                this.$store.dispatch('questionnairesTypes/remove', id).then(response => {
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
          this.refresh()
        }
      },
    },
  };
</script>

<style scoped>
  .per-page-selector {
    width: 90px;
  }
</style>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
  .custom_container, .modal-body, .modal-footer{
    background-color: #f8f8f8;
  }
</style>