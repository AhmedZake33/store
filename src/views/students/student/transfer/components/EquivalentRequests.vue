<template>
  <div v-if="student">
    <b-card>
      <b-card-header>
        <h2>{{ $t("Global.External Transfer") }}</h2>
        <div
          :class="load ? 'disabled_all' : ''"
          class="d-flex justify-content-end align-items-center"
        >
          <div class="mb-2">
            <b-button variant="primary" @click="openAddTransferInfoDialog()">
              <feather-icon
                style="cursor: pointer"
                icon="PlusIcon"
                class="font-medium-3"
                v-b-tooltip.hover="$t('Global.add_course')"
              />
            </b-button>
          </div>
        </div>
      </b-card-header>
      <b-card-body>
        <b-overlay :show="studenLoad">
          <b-table
            outlined
            :empty-text="$t('Global.empty_text')"
            show-empty
            :busy="load"
            :items="student.external_request"
            :fields="fields"
            striped
            responsive="sm"
          >
            <template #cell(term)="data">
              {{ getTranslatedName(data.item.term) }}
            </template>
            <template #cell(status)="data">
              <b-badge
                pill
                :variant="`${getEquivalenceStatus(data.item.status).color}`"
                class="text-capitalize"
              >
                {{ getEquivalenceStatus(data.item.status).name }}
              </b-badge>
            </template>
            <template #cell(term)="data">
              {{
                $i18n.locale == "ar"
                  ? data.item.term_name_local
                  : data.item.term_name
              }}
            </template>
            <template #cell(actions)="row">
              <div class="pointer d-flex">
                <feather-icon @click="row.toggleDetails" icon="EyeIcon" />
                <feather-icon class="mx-1" @click="$emit('setEditMode', {id:Number(row.item.id),name:'equivalence_info'})" icon="EditIcon" />
              </div>
              <!-- <b-button variant="primary" @click="$emit('setEditMode', 'equivalence_info')">
              <feather-icon
                  style="cursor: pointer"
                  icon="PlusIcon"
                  class="font-medium-3"
                  v-b-tooltip.hover="$t('Global.add_course')"
              />
            </b-button> -->
            </template>
            <template #row-details="row">
              <equivalent
                studentComponent
                :applicant_id="Number(row.item.id)"
                :transfer_id="0"
                :isInternalTransfer="false"
                :showApplyButton="true"
              />
            </template>
          </b-table>
        </b-overlay>
      </b-card-body>
    </b-card>

    <b-card v-if="false">
      <b-card-header>
        <h2>{{ $t("Global.Study Abroad") }}</h2>
        <div
          :class="load ? 'disabled_all' : ''"
          class="d-flex justify-content-end align-items-center"
        >
          <div class="mb-2">
            <b-button
              variant="primary"
              @click="$emit('setEditMode', 'abroad_study')"
            >
              <feather-icon
                style="cursor: pointer"
                icon="PlusIcon"
                class="font-medium-3"
                v-b-tooltip.hover="$t('Global.add_course')"
              />
            </b-button>
          </div>
        </div>
      </b-card-header>
      <b-card-body>
        <b-table
          outlined
          :empty-text="$t('Global.empty_text')"
          show-empty
          :busy="load"
          :items="student.abroad_study"
          :fields="fields"
          striped
          responsive="sm"
        >
          <template #cell(term)="data">
            {{
              $i18n.locale == "ar"
                ? data.item.term_name_local
                : data.item.term_name
            }}
          </template>
          <template #cell(status)="data">
            <b-badge
              pill
              :variant="`${getEquivalenceStatus(data.item.status).color}`"
              class="text-capitalize"
            >
              {{ getEquivalenceStatus(data.item.status).name }}
            </b-badge>
          </template>
          <template #cell(actions)="row">
            <div class="pointer d-flex">
              <feather-icon @click="row.toggleDetails" icon="EyeIcon" />
            </div>
          </template>
          <template #row-details="row">
            <equivalent
              studentComponent
              :applicant_id="Number(student.applicant_data.id)"
              :transfer_id="row.item.id"
              :isInternalTransfer="false"
              :showApplyButton="row.item.status == 3"
            />
          </template>
        </b-table>
      </b-card-body>
    </b-card>

    <b-card>
      <b-card-header>
        <h2>{{ $t("Global.Internal Transfers") }}</h2>
      </b-card-header>
      <b-card-body>
        <b-table
          outlined
          :empty-text="$t('Global.empty_text')"
          show-empty
          :busy="load"
          :items="student.internal_requests"
          :fields="fields"
          striped
          responsive="sm"
        >
          <template #cell(term)="data">
            {{
              $i18n.locale == "ar"
                ? data.item.term_name_local
                : data.item.term_name
            }}
          </template>
          <template #cell(status)="data">
            <b-badge
              pill
              :variant="`${getEquivalenceStatus(data.item.status).color}`"
              class="text-capitalize"
            >
              {{ getEquivalenceStatus(data.item.status).name }}
            </b-badge>
          </template>
          <template #cell(actions)="row">
            <div class="pointer d-flex">
              <feather-icon @click="row.toggleDetails" icon="EyeIcon" />
            </div>
          </template>
          <template #row-details="row">
            <equivalent
              studentComponent
              :applicant_id="0"
              :transfer_id="row.item.id"
              :isInternalTransfer="true"
              :showApplyButton="row.item.status == 3"
            />
          </template>
        </b-table>
      </b-card-body>
    </b-card>

    <b-modal
      v-model="showAddTransferInfoDialog"
      no-close-on-backdrop
      size="lg"
      centered
      :title="$t('Global.transferInfo')"
    >
      <validation-observer ref="transferInfoForm">
        <form ref="transferInfoForm">
          <b-row class="row">
            <b-col md="6">
              <b-form-group class="left_right" :label="$t('Global.university')">
                <validation-provider #default="{ errors }" rules="required">
                  <b-form-input
                      id="university"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :state="errors.length > 0 ? false : null"
                      v-model="ruleForm.university"
                  />
                  <ValidationErrors
                      :frontend-errors="errors"
                  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group class="left_right" :label="$t('Global.faculty')">
                <validation-provider #default="{ errors }" rules="required">
                  <b-form-input
                    id="faculty"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :state="errors.length > 0 ? false : null"
                    v-model="ruleForm.faculty"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group class="left_right" :label="$t('Global.country')">
                <validation-provider #default="{ errors }" rules="required">
                  <b-form-input
                    id="country"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :state="errors.length > 0 ? false : null"
                    v-model="ruleForm.country"
                  />
                  <ValidationErrors
                    :frontend-errors="errors"
                  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group class="left_right" :label="$t('Global.term')">
                <validation-provider #default="{ errors }" rules="required">

                  <v-select
                    v-model="ruleForm.term_id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    :options="options.transferTerms"
                    :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                    class="w-100 mb-2"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.term')"
                  >
                    <template v-slot:option="option">
                      {{ $i18n.locale == "ar" ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <strong v-if="$i18n.locale == 'ar'">{{ name_local }} </strong>
                        <strong v-else>{{ name }}</strong>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <ValidationErrors
                    :frontend-errors="errors"
                  />
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button
              type="submit"
              variant="primary"
              :class="load ? 'disabled_all mr-1' : 'mr-1'"
              @click="saveTransferInfo()"
            >
              {{ $t("Global.save") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-secondary"
              @click="openAddTransferInfoDialog('close')"
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
import { mapActions, mapGetters } from "vuex";
import {
  BBadge,
  BCard,
  BCardBody,
  BCardHeader,
  BTable,
  BModal,
  BForm,
  BFormGroup,
  BFormInput,
  BCol,
  BRow,
  BOverlay,
} from "bootstrap-vue";
import equivalent from "@/views/admission/TransferStudents/equivalent.vue";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required, email } from "@validations";
import vSelect from 'vue-select';


export default {
  components: {
    ValidationErrors,
    ValidationObserver,
    ValidationProvider,
    BOverlay,
    BCol,
    BRow,
    BBadge,
    BModal,
    BTable,
    equivalent,
    BCardBody,
    BCardHeader,
    BCard,
    BForm,
    BFormGroup,
    BFormInput,
    vSelect,
  },
  props: {
    studentId: Number,
  },
  data() {
    return {
      showAddTransferInfoDialog: false,
      ruleForm:{},
      studenLoad:false
    };
  },
  computed: {
    ...mapGetters({
      student: "students/item",
      load: "students/load",
      options: 'students/lookups',

    }),
    fields() {
      return [
        {
          key: "term",
          label: this.$t("Global.term"),
          thStyle: { width: "60%" },
        },
        {
          key: "status",
          label: this.$t("Global.status"),
          thStyle: { width: "30%" },
        },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thStyle: { width: "10%" },
        },
      ];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      addExternalTransferInfo: "externalTransfer/addExternalTransferInfo",
      lookups: 'students/lookup',

    }),
    openAddTransferInfoDialog(type) {
      if (type == "close" && this.showAddTransferInfoDialog){
        this.showAddTransferInfoDialog = false;
      }else{
        this.showAddTransferInfoDialog = true;
      }
    },
    saveTransferInfo(){
      this.$refs.transferInfoForm.validate().then((success) => {
        if (success) {
          this.addExternalTransferInfo({id: this.$route.params.id, query: this.ruleForm}).then(
              (_) => {
                this.openAddTransferInfoDialog('close');
                this.init();
                this.$swal({
                  icon: "success",
                  title: `${this.$t("Global.saved")}`,
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
          );
        }
      });
    },
    init() {
      this.lookups({ transferTerms: true });

      this.studenLoad = true;
      this.$store.dispatch("students/get", {
        type: "transfer_requests",
        id: this.studentId ? this.studentId : this.$route.params.id,
      }).then(_=>{
        this.studenLoad = false
      });
    },
    getEquivalenceStatus(status) {
      if (status == 1) {
        return {
          color: "secondary",
          name: "Incomplete",
        };
      } else if (status == 2) {
        return {
          color: "light-secondary",
          name: "In Review",
        };
      } else if (status == 3) {
        return {
          color: "success",
          name: "Approved",
        };
      } else if (status == 4) {
        return {
          color: "danger",
          name: "Rejected",
        };
      } else {
        return {
          color: "secondary",
          name: "Incomplete",
        };
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
