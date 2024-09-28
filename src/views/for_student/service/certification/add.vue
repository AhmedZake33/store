<template>
  <div v-if="form != null" style="position: relative">
    <edit-component>
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save()">
            <b-row>
              <b-col v-if="hasPermission('edit_certificate') && user_id == null" cols="12" md="12">
                <b-form-group
                  :label="$t('Global.student')"
                  label-for="code-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="student input"
                    rules="required"
                  >
                    <v-select
                      v-model="form.student_id"
                      :dir="$i18n.locale == 'en' ? 'ltr' : 'rtl'"
                      @search="fetchOptions"
                      :options="studentData"
                      :filterable="false"
                      :reduce="(val) => val.id"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                    >
                      <template slot="no-options">
                        {{
                          $i18n.locale == "en"
                            ? "Type Student Code or Name to search"
                            : "أكتب كود الطالب او اسمه للبحث"
                        }}
                      </template>
                      <template slot="option" slot-scope="option">
                        <div class="d-center">
                          {{
                            $i18n.locale == "en"
                              ? option.name
                                ? option.name
                                : option.name_local
                              : option.name_local
                              ? option.name_local
                              : option.name
                          }}
                        </div>
                      </template>
                    </v-select>
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'student_id')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  :label="$t('Global.certificateType')"
                  label-for="service-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="certificate input"
                    rules="required"
                  >
                    <v-select
                      v-model="form.service_id"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="certificateslookups"
                      :clearable="false"
                      input-id="service-input"
                      :reduce="(val) => val.id"
                      :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar" ? option.name_local : option.name
                        }}
                      </template>
                      <template #selected-option="{ name, name_local }">
                        <div style="display: flex; align-items: baseline">
                          <div v-if="$i18n.locale == 'ar'">{{
                            name_local
                          }}</div>
                          <div v-else>{{ name }} </div>
                        </div>
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'service_id')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group
                  :label="$t('Global.quantity')"
                  label-for="quantity-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="quantity-input"
                    rules="required|integer|min:1"
                  >
                    <b-form-input
                      id="quantity-input"
                      v-model="form.quantity"
                      type="number"
                      rules="min:1"
                      @keyup="checkPrintCount($event)"
                    />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'quantity')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="12" v-if="isApplyTo">
                <b-form-group
                  :label="$t('Global.apply_to')"
                  label-for="apply-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="apply input"
                    rules="required"
                  >
                    <b-form-input id="apply-input" v-model="form.apply_to" />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'apply_to')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="12" v-if="certificateFlag">
                <b-form-group
                    :label="$t('Global.date')"
                    label-for="date-input"
                    invalid-feedback="Date is required"
                >
                  <b-form-datepicker v-model="form.date"/>
                </b-form-group>
              </b-col>

              <b-col md="12">
                <b-form-group
                    :label="$t('Global.notes')"
                    label-for="notes-input"
                    invalid-feedback="Notes is required"
                >
                    <!-- @keypress="sanitizeEnglish($event)"  -->
                  <b-form-textarea 
                    :placeholder="$t('Global.notes')" 
                    id="notes-input" 
                    v-model="form.notes" 
                    rows="3" 
                  />
                </b-form-group>
              </b-col>

              <!-- <b-col md="4">
                <b-form-group
                  :label="$t('Global.name_custom')"
                  label-for="certificate-name-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="certificate name input"
                    rules="english|required"
                  >
                    <b-form-input
                      id="certificate-name-input"
                      v-model="form.name"
                      @keypress="sanitizeEnglish($event)"
                    />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="getBackendFieldError(errorsdata, 'name')"
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group
                  :label="$t('Global.phone')"
                  label-for="phone-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="phone input"
                    rules="required|integer"
                  >
                    <b-form-input
                      id="phone-input"
                      v-model="form.phone"
                      :state="errors.length > 0 ? false : null"
                    />
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'phone')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col>

              <b-col md="4">
                <b-form-group
                  :label="$t('Global.ids')"
                  label-for="social-number-input"
                  id="test-id"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="Social Number input"
                    rules="required|fileValidate"
                  >
                    <b-form-file
                      accept=".jpeg, .png, .gif,.pdf"
                      id="social-number-input"
                      v-model="file"
                      :placeholder="$t('Global.fileChoose')"
                      drop-placeholder="Drop file here..."
                      ref="image"
                    />
                    <div
                      style="margin-top: 3px; margin-left: 3px"
                      v-if="form.documents"
                    >
                      <a :href="form.documents[0].url" target="_blank">
                        Uploaded File
                      </a>
                      <feather-icon icon="ArrowDownCircleIcon" size="15" />
                    </div>
                    <ValidationErrors
                      :frontend-errors="errors"
                      :backend-errors="
                        getBackendFieldError(errorsdata, 'image')
                      "
                    />
                  </validation-provider>
                </b-form-group>
              </b-col> -->

              <!-- submit and reset -->
              <b-col md="12" class="mt-2 d-flex justify-content-end">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  class="mr-1"
                >
                  <span
                    v-if="
                      $route.params.id &&
                      item[0] &&
                      item[0].payment_transaction &&
                      item[0].payment_transaction.status == 0
                    "
                  >
                    Pay
                  </span>
                  <span v-else>
                    {{ $t("Global.save") }}
                  </span>
                </b-button>
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="outline-secondary"
                  class="mr-1"
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
    <div
      v-if="load"
      style="
        position: absolute;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #eee;
        opacity: 0.8;
        text-align: center;
        z-index: 999;
      "
    >
      <b-spinner
        variant="secondary"
        style="position: absolute; top: 60px; z-index: 1000"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BFormTextarea,
  BForm,
  BButton,
  BFormFile,
  BFormDatepicker,
  BSpinner,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import ToastificationContent from "@core/components/toastification/ToastificationContent";
import Cookies from "js-cookie";
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { required, email, regex, integer } from "@validations";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
export default {
  title: "Edit",
  components: {
    ValidationErrors,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormTextarea,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    BFormDatepicker,
    BFormFile,
    ToastificationContent,
    ValidationProvider,
    ValidationObserver,
    localize,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  props:{
    user_id: null,
    certificateslookups: null
  },
  computed: {
    ...mapGetters({
      item: "certificates/item",
      load: "certificates/load",
      options: "students/lookups",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id
        ? this.$t("Global.certificate_edit")
        : this.$t("Global.certificate_add");
    },
    studentData: function () {
      return this.studentsOptions;
    },
    isApplyTo() {
      if (this.form.service_id) {
        let data = this.certificateslookups
        let itemData = data.filter((item) => {
          return item.id == this.form.service_id
        })
        if (itemData[0].apply_to == 1) {
          return true
        } else {
          return false
        }
      }
    },
    // certificateslookups() {
    //   return this.certificatesFilters;
    // },
    FormSubmittedMsg() {
      let value = "";
      this.$i18n.locale == "en"
        ? (value = "From Submitted")
        : (value = "تم الارسال");
      return value;
    },
  },
  data() {
    return {
      errorsdata: {},
      form: {
        user_id: true,
        notes: null
      },
      message: null,
      user: JSON.parse(Cookies.get("user")),
      file: null,
      transaction: {},
      studentsOptions: [],
      certificatesFilters: [],
      is_student: false,
      certificateFlag: false
    };
  },
  mounted() {
    this.is_student = this.authUser().type.type == 3 ? true : false;
    // document.getElementById("");
    // document
    //   .getElementById("social-number-input")
    //   .addEventListener("hover", (e) => {
    //     document.getElementById("social-number-input").style.cursor =
    //       "pointer !important";
    //   });
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: "certificates/get",
      lookups: "students/lookup",
      checkBankMisrPaymentStatus: "certificates/checkBankMisrPaymentStatus",
    }),
    ...mapMutations({
      setLoad: "certificates/SET_ITEMS_LOAD", // map `this.increment()` to `this.$store.commit('increment')`
    }),
    init() {
      this.setLoad(true);
      let payload = {
        certificates: true,
      };
      if (this.is_student) {
        payload.student_auth_data = true;
      }
      
      this.lookups(payload).then((res) => {
        this.certificatesFilters = res.success.certificates;
        // if(res.success.user_auth_data){
        // this.certificatesFilters = this.availCertificates(res.success.certificates,res.success.user_auth_data);
        // }else{
        //   this.certificatesFilters =res.success.certificates
        // }
        this.setLoad(false);
      });
      // if (this.id) {
      //   this.setLoad(true);
      //   this.getItem(this.id)
      //     .then((response) => {
      //       response.data.length > 1
      //         ? (this.form = this.maparrays(response.data[0]))
      //         : (this.form = this.item);
      //       this.setLoad(false);
      //     })
      //     .catch((error) => {
      //       const errors = [error.response.data.errors];
      //       errors.forEach((error, index) => {
      //         const error_data = Object.values(error)[index][0];
      //         this.errorsdata = error;
      //       });
      //     });
      // }
    },
    save() {
      this.setLoad(true);
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const updatedData = {
            service_id: this.form.service_id,
            quantity: this.form.quantity,
            apply_to: this.form.apply_to,
            name: this.form.name,
            phone: this.form.phone,
            date: this.form.date
          };
          // if (!this.$route.params.id) {
          //   updatedData.user_id = true;
          // } else {
          //   updatedData.status = this.item[0].status;
          // }

          let formData = new FormData();

          if (formData.service_id == null) {
            formData.append("service_id", this.form.service_id);
          }
          if (formData.apply_to == null) {
            formData.append("apply_to", this.form.apply_to);
          }
          // if (formData.phone == null) {
          //   formData.append("phone", this.form.phone);
          // }
          // if (formData.name == null) {
          //   formData.append("name", this.form.name);
          // }
          if (formData.quantity == null) {
            formData.append("quantity", this.form.quantity);
          }
          if (this.id != null) {
            formData.append("user_id", this.id);
          }
          if (this.form.student_id != null) {
            formData.append("user_id", this.form.student_id);
          }
          if (formData.date == null) {
            formData.append("date", this.form.date);
          }
          if (formData.notes == null) {
            formData.append("notes", (this.form.notes != null && this.form.notes !== "null") ? this.form.notes : null);
          }
          // if (this.$refs.image.files.length == 1) {
          //   formData.append("image", this.$refs.image.files[0]);
          //   // formData.append('image', e.target.files[0]);
          // }
          this.validateForm() == true
            ? this.$store
                .dispatch("certificates/put", {
                  query: formData,
                })
                .then((response) => {
                  this.transaction = response.data;
                  if (!this.hasPermission("edit_certificate")) {
                    this.setLoad(true);
                    this.EventListnerFunction(response.data);
                  } else {
                    // this.$toast({
                    //   component: ToastificationContent,
                    //   props: {
                    //     title: this.FormSubmittedMsg,
                    //     icon: "EditIcon",
                    //     variant: "success",
                    //   },
                    // });
                    // this.$router.push("/certificates");
                    this.$emit('refresh');
                    this.$emit('hide');
                  }
                  this.$swal({
                    icon: 'success',
                    title: 'Certificates Added!',
                    text: 'Certificates Added Successfully.',
                    showConfirmButton: false,
                    timer: 1500,
                  })
                  // this.$router.go(-1)
                })
                .catch((error) => {
                  const errors = [error.response.data.errors];
                  errors.forEach((error, index) => {
                    const error_data = Object.values(error)[index][0];
                    this.errorsdata = error;
                  });
                  // if (errors[0]) {
                  //   if (errors[0].update) {
                  //     this.$swal({
                  //       icon: "error",
                  //       title: this.$i18n.locale == "en" ? "Erorr!" : "خطأ!",
                  //       text:
                  //         this.$i18n.locale == "en"
                  //           ? errors[0].update.en
                  //           : errors[0].update.ar,
                  //       showConfirmButton: false,
                  //       timer: 3000,
                  //     });
                  //   //   this.$router.go(-1);
                  //   this.$emit('hide');

                  //   }
                  // }
                   this.$swal({
                    icon: "error",
                    text: `${error || this.$t("Global.errorMessage")}`,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                })
            : this.$swal({
                icon: "error",
                title:
                  this.$i18n.locale == "en" ? "Missing Fields" : "بيانات ناقصه",
                text:
                  this.$i18n.locale == "en"
                    ? "Please Complete All Fields"
                    : "برجاء إكمال جميع الحقول",
                showConfirmButton: false,
                timer: 3000,
              });
        } else {
          this.setLoad(false);
        }
      });
    },
    maparrays(data) {
      delete data.service;
      delete data.user;
      delete data.reviewer;
      return data;
    },
    validateForm() {
      let valid = true;
      if (this.form.service_id == null) {
        this.errorsdata.service_id = ["This Field is required"];
        valid = false;
      }
      if (this.form.quantity == null) {
        this.errorsdata.quantity = ["This Field is required"];
        valid = false;
      }
      // if (this.form.name == null) {
      //   this.errorsdata.name = ["This Field is required"];
      //   valid = false;
      // }
      // if (this.form.phone == null) {
      //   this.errorsdata.phone = ["This Field is required"];
      //   valid = false;
      // }

      return valid;
    },
    EventListnerFunction(transactionData) {
      try {
        this.setLoad(true);
        document.addEventListener("completePaymentCallback", async () => {
          await this.checkBankMisrPaymentStatus({
            transaction: transactionData?.id,
            id: null,
          }).then((response) => {
            if (response.status == "success") {
              // this.$toast({
              //   component: ToastificationContent,
              //   props: {
              //     title: this.FormSubmittedMsg,
              //     icon: "EditIcon",
              //     variant: "success",
              //   },
              // });
              this.$router.go("/");
              this.setLoad(false);
            } else {
              this.$swal({
                icon: "error",
                title: this.$i18n.locale == "en" ? "Error!" : "خطأ!",
                text: response.data,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.go(-1);
              // this.$router.back()
            }
          });
        });
        Checkout.configure({
          //6TH OCTOBER UNIVERSITY , TestMERCHANT_CBA
          merchant: "OCTOBER_UNIV",
          order: {
            amount: transactionData?.amount,
            currency: "EGP",
            description: "test",
            id: transactionData?.merchant_reference,
          },
          interaction: {
            operation: "PURCHASE", // set this field to 'PURCHASE' for Hosted Checkout to perform a Pay Operation.
            merchant: {
              name: "6TH OCTOBER UNIVERSITY",
            },
          },
          session: {
            id: transactionData?.session_id,
          },
        });
        Checkout.showLightbox();
      } catch (e) {}
    },
    fetchOptions(search, loading) {
      //  ... do some asynchronous stuff!
      let query = {
        studentQuery: search,
        certificates: true,
      };

      if (search.length > 1) {
        loading(true);
        this.lookups(query)
          .then((res) => {
            this.studentsOptions = res.success.students;
            loading(false);
          })
          .catch((err) => {
            loading(false);
          });
      }
    },
    cancel() {
    //   this.$router.go(-1);
        this.$emit('hide');
    },
    availCertificates(certificates, statusData) {
      let data = [];
      for (let certificate of certificates) {
        let is_active = false;
        for (let status of statusData) {
          if (
            certificate.flags.includes(status.name) ||
            certificate.flags.includes("Both")
          ) {
            is_active = true;
          }
        }
        is_active == true ? data.push(certificate) : "";
      }
      return data;
    },
    checkPrintCount(e) {
      if (e.target.value <= 0) {
        e.target.value = 1;
      }
    },
  },
  watch: {
    file: function (val) {},
    "lookups.certificates": function (val) {},
    "form.student_id": function (val) {
      
      let stu = this.options.students.filter((item) => {
        // alert(item.id)
        return item.id == val;
      });
      let payload = {
        certificates: true,
        studentID: stu[0].id
      };
      this.lookups(payload).then((res) => {
        // console.log(res.success.certificates)
        this.certificateslookups = res.success.certificates
        this.certificatesFilters = res.success.certificates;
        this.setLoad(false);
      });
      // console.log(this.certificatesFilters)
      // this.certificatesFilters = this.options.certificates;
      // this.availCertificates(this.options.certificates, stu[0].status_data)
    },
    "form.service_id": function (val) {
      let certificate = this.certificateslookups.filter((el)=>{
        return el.id == val
      })
      this.certificateFlag = certificate[0].type == 32 ? true : false
    },
    
    // 'form.student_id': function(){
     
    // }
    // 'form.quantity': function (val){
    //     if( val <= 0 ){
    //       this.form.quantity = 1
    //       document.getElementById('quantity-input').valueInnerText = '1'
    //     }
    // }
  },
};
</script>

<style scoped>
#test-id span {
  pointer-events: auto !important;
}
#test-id:hover {
  cursor: pointer !important;
}
</style>
