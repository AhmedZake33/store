<template>
  <div>
    <div class="new_edit">
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="save">
          <ShowComponent 
            :loading="load"
            v-if="data" 
            :data="data" 
            :only="[
                'question',
                'question_local',
                'id',
                'type'
              ]" 
            >
            
            <template #question>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.english_question`) }}
              </th>
              <td>
                <b-form-group 
                  label-for="name-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.english_question')"
                    rules="required"
                  >
                    <!-- <b-form-input
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      v-model="form.question"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.english_question')"
                    /> -->
                    <b-form-textarea
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      v-model="form.question"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.english_question')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل السؤال باللغة الإنجليزية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #question_local>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.arabic_question`) }}
              </th>
              <td>
                <b-form-group
                  label-for="nameAr-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.arabic_question')"
                    rules="required|arabic"
                  >
                    <b-form-textarea
                      @keypress="
                        sanitizeArabic($event);
                        sanitizeNumber($event);
                      "
                      :placeholder="$t('Global.arabic_question')"
                      v-model="form.question_local"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل السؤال باللغة العربية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template> 
            <template #id>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                {{ $t(`Global.arabic_question`) }}
              </th>
              <td v-if="$i18n.locale == 'en'">
                <b-form-group 
                  label-for="arabic_question" 
                  invalid-feedback="Name is required"
                >
                  <validation-provider 
                    #default="{ errors }" 
                    :name="$t('Global.arabic_question')" 
                    rules="required"
                  >
                    <b-form-textarea
                      :placeholder="$t('Global.arabic_question')" 
                      v-model="form.question_local" 
                      :state="errors.length > 0 ? false : null" 
                      @keypress="sanitizeArabic($event)" 
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل السؤال باللغة العربية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                {{ $t(`Global.english_question`) }}
              </th>
              <td v-if="$i18n.locale == 'ar'">
                <b-form-group 
                  label-for="name" 
                  invalid-feedback="Name is required"
                >
                  <validation-provider 
                    #default="{ errors }" 
                    name="name" 
                    rules="english|required"
                  >
                    <b-form-textarea
                      :placeholder="$t('Global.english_question')" 
                      id="name" 
                      v-model="form.question" 
                      :state="errors.length > 0 ? false : null" 
                      @keypress="sanitizeEnglish($event);" 
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل السؤال باللغة الانجليزية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #type>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.type`) }}
              </th>
              <td>
                <b-form-group
                  label-for="type-input"
                  v-if="lookups"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.type')"
                    rules="required"
                  >
                    <v-select
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      v-model="form.type"
                      :options="lookups.types"
                      :label="$t('Global.type')"
                      class="w-100 mb-2"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.type')"
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
                          <span v-if="$i18n.locale == 'ar'"
                            >{{ name_local.replaceAll("_", " ") }}
                          </span>
                          <span v-else>{{ name.replaceAll("_", " ") }}</span>
                        </div>
                      </template>
                    </v-select>
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل النوع مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template> 
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon v-if="hasPermission('edit_exam')" @click="cancel()" style="cursor: pointer"
                  icon="XCircleIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.close')" />
              </div>
            </template>
          </ShowComponent>
          <b-row>
            <b-col md="12 mt-3">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="cancel"
              >
                {{ $t("Global.cancel") }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { mapGetters, mapActions } from "vuex";
import { required } from "@validations";
import { PlusIcon, DeleteIcon } from "vue-feather-icons";
import ShowComponent from "@/views/components/info/show";

import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
  BFormTextarea,
  BSpinner,
  BPopover,
} from "bootstrap-vue";
import lookups from '@/api/system/lookups';

export default {
  name: "edit",
  components: {
    EditComponent,
    ShowComponent,
    vSelect,
    ValidationErrors,
    required,
    DeleteIcon,
    PlusIcon,
    ValidationProvider,
    ValidationObserver,
    BForm,
    BFormGroup,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BFormTextarea,
    BSpinner,
    BPopover,
    localize,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      lookups: "questionnairesQuestions/lookups",
      item: "questionnairesQuestions/item",
      load: "questionnairesQuestions/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    questionnaire_type_id(){
      return this.$route.query.questionnaire_type_id ? this.$route.query.questionnaire_type_id : null;
    },
    title() {
      return this.id
        ? this.$t("Global.questionnaires_types_edit")
        : this.$t("Global.questionnaires_types_add");
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    tabNumber: Number,
    data: { default: {}, type: [Array, Object] },
  },
  data() {
    return {
      errorsdata: {},
      form: {
        question: null,
        question_local: null,
        questionnaire_type_id: null,
        type: null
      },
    };
  },
  
  methods: {
    ...mapActions({
      getItem: "questionnairesQuestions/get",
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.question = this.item.question;
          this.form.question_local = this.item.question_local;
          this.form.type = this.item.type.id;
          this.form.questionnaire_type_id = this.item.questionnaire_type_id;
        });
      }
    },
    cancel() {
      if(!this.id){
        this.$router.go(-1)
      }
      if (this.inline) {
        return this.$emit('hide');
      }
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.form.questionnaire_type_id = this.questionnaire_type_id;
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("questionnairesQuestions/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if(this.$route.name == "add_questionnaireQuestion"){
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
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped></style>
