<template>
  <div>
    <div class="text-center text-black my-2" v-if="load">
      <b-spinner class="align-middle"></b-spinner>
    </div>
    <div v-else>
      <validation-observer ref="simpleRules" v-if="items.length > 0">
        <div v-if="items" class="py-2">
          <ol>
            <b-card
              class="mb-2 pl-2"
              v-for="(item, index) in items"
              :key="index"
            >
              <li v-if="item.type.id == 2">
                <h5 class="mb-0">
                  {{
                    $i18n.locale == "ar" ? item.question_local : item.question
                  }}
                </h5>
                <hr class="my-1" />
                <b-form-group class="left_right" label-for="notes">
                  <validation-provider
                    #default="{ errors }"
                    name="comment"
                    rules="required"
                  >
                    <b-form-textarea id="notes" v-model="selected[index]" />
                    
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{ $i18n.locale == "ar" ? "حقل التعليق مطلوب" : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </li>
              <li v-else>
                <h5 class="mb-0">
                  {{
                    $i18n.locale == "ar" ? item.question_local : item.question
                  }}
                </h5>
                <hr class="my-1" />
                <b-form-group label="">
                  <b-form-radio-group
                    v-model="selected[index]"
                    :options="item.answers"
                    value-field="id"
                    :state="state"
                    class="demo-inline-spacing mb-1"
                    :text-field="$i18n.locale == 'ar' ? 'name_local' : 'name'"
                    disabled-field="disabled"
                  />
                  <div v-if="flag">
                    <b-form-invalid-feedback :state="state">{{
                      $i18n.locale == "ar"
                        ? "الرجاء الإجابة على جميع الأسئلة"
                        : "Please answer all questions"
                    }}</b-form-invalid-feedback>
                  </div>
                </b-form-group>
              </li>
            </b-card>
          </ol>
        </div>
      </validation-observer>
      <div v-else>
        <b-card class="mb-2 pl-2 text-center">
          {{ $i18n.locale == "ar" ? "لا يوجد اسئلة" : "There is no questions" }}
        </b-card>
      </div>
    </div>

    <b-button class="btn-icon ml-1 mb-3" variant="primary" @click="save()">
      {{ $t("Global.submit_custom") }}
    </b-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  BBadge,
  BLink,
  BTab,
  BTabs,
  BCard,
  BSpinner,
  BFormGroup,
  BFormRadioGroup,
  BFormInvalidFeedback,
  BFormValidFeedback,
  BFormTextarea,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { required } from "@validations";
export default {
  name: "form",
  components: {
    mapGetters,
    BBadge,
    BLink,
    BTab,
    BTabs,
    BCard,
    BSpinner,
    BFormGroup,
    BFormRadioGroup,
    BFormInvalidFeedback,
    BFormValidFeedback,
    ValidationProvider,
    ValidationObserver,
    BFormTextarea,
    required,
  },
  computed: {
    state() {
      if (this.selected.length == this.items.length) {
        return true;
      } else {
        return false;
      }
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    ...mapGetters({
      items: "questionnaires/items",
      total: "questionnaires/total",
      load: "questionnaires/load",
      lookups: "questionnaires/lookups",
    }),
  },
  data() {
    return {
      selected: [],
      flag: false,
    };
  },
  methods: {
    save() {
      this.flag = !this.state;
      const answers = this.items.map((el, index) => {
        if (typeof this.selected[index] == "string") {
          return { question_id: el.id, comment: this.selected[index] };
        } else {
          return { question_id: el.id, answer_id: this.selected[index] };
        }
      });
      this.$refs.simpleRules.validate().then((success) => {
        if (success && this.state) {
          const payload = { id: this.id, query: { questions: answers } };
          this.$store
            .dispatch("questionnaires/submit", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              //  this.$router.go(-1)
              this.$router.push({ name: "dashboard" });
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
    this.$store.dispatch("questionnaires/getQuestions", this.id);
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 0rem;
}
ol {
  padding-left: 10px;
}
</style>