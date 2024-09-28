<template>
    <div>
      <edit-component :name="title">
        <template #inputs>
          <validation-observer ref="simpleRules">
            <b-form ref="form" @submit.stop.prevent="save">
              <b-row v-if="form">
                <b-col md="6">
                  <b-form-group
                    class="left_right"
                    :label="$t('Global.english_name')"
                    label-for="name-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="name"
                      rules="required|english"
                    >
                      <b-form-input
                        @keypress="
                          sanitizeEnglish($event);
                          sanitizeNumber($event);
                        "
                        id="name-input"
                        v-model="form.name"
                        :state="errors.length > 0 ? false : null"
                      />
                      <ValidationErrors
                        :frontend-errors="errors"
                        :backend-errors="getBackendFieldError(errorsdata, 'name')"
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group
                    :state="nameLocalState"
                    :label="$t('Global.arabic_name')"
                    label-for="nameAr-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="arabic name"
                      rules="required|arabic"
                    >
                      <b-form-input
                        id="nameAr-input"
                        class="right_left"
                        @keypress="
                          sanitizeArabic($event);
                          sanitizeNumber($event);
                        "
                        v-model="form.name_local"
                        :state="errors.length > 0 ? false : null"
                      />
                      <ValidationErrors
                        :frontend-errors="errors"
                        :backend-errors="
                          getBackendFieldError(errorsdata, 'name_local')
                        "
                      />
                    </validation-provider>
                  </b-form-group>
                </b-col>
  
                <!-- submit and reset -->
                <b-col md="12">
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
        </template>
      </edit-component>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from "vuex";
  import {
    BRow,
    BCol,
    BForm,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BButton,
  } from "bootstrap-vue";
  import Ripple from "vue-ripple-directive";
  import ValidationErrors from "@/views/components/common/ValidationErrors";
  import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
  import { required } from "@validations";
  import EditComponent from "@/views/components/table/Edit";
  
  export default {
    title: "Edit",
    components: {
      BRow,
      BCol,
      BFormGroup,
      BFormInput,
      BFormCheckbox,
      BForm,
      BButton,
      EditComponent,
      ValidationErrors,
      ValidationProvider,
      ValidationObserver,
      localize,
    },
    directives: {
      Ripple,
    },
  
    computed: {
      ...mapGetters({
        item: "banks/item",
        load: "banks/load",
      }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
      title() {
        return this.id
          ? this.$t("Global.Edit Bank")
          : this.$t("Global.Add Bank");
      },
    },
    data() {
      return {
        nameLocalState: null,
        form: {
          name: null,
          name_local: null,
        },
        errorsdata: {},
      };
    },
    mounted() {
      this.init();
    },
  
    methods: {
      ...mapActions({
        getItem: "banks/get",
      }),
      init() {
        if (this.id) {
          this.getItem(this.id).then((_) => {
            this.form.name = this.item.name;
            this.form.name_local = this.item.name_local;
          });
        }
      },
  
      save() {
        this.$refs.simpleRules.validate().then((success) => {
          if (success) {
            const payload = { id: this.id, query: this.form };
            this.$store
              .dispatch("banks/put", payload)
              .then((response) => {
                this.$swal({
                  icon: "success",
                  text: `${this.$t("Global.successMessage")}`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.$router.push({
                  name: "bank_settings",
                  query: { tabNum: this.$route.query.tabNum },
                });
                if (this.inline) {
                  this.$emit("refresh");
                  return this.$emit("hide");
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
  
      cancel() {
        this.$router.push({
                  name: "bank_settings",
                  query: { tabNum: this.$route.query.tabNum },
                });
      },
    },
  };
  </script>
  
  <style lang="scss"></style>
  