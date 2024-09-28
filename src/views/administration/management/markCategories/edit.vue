<template>
  <div>
    <edit-component :name="this.name" :loading="false" :status="2">
      <template #inputs>
       <validation-observer ref="simpleRules">
        <b-form  @submit.stop.prevent="save" ref="form">
          <b-row>
            <b-col md="6">
              <b-form-group :label="$t('Global.type')" label-for="mc-type">
              <validation-provider
                  #default="{ errors }"
                  name="type"
                  rules="required"
                >
                <v-select
                  v-model="form.type_id"
                  :options="types"
                  class="w-100"
                  :reduce="(val) => val.id"
                  :label="getSelectLabel()"
                />
                <ValidationErrors :frontend-errors="errors"  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.permissions')" label-for="mc-permissions">
              <validation-provider
                  #default="{ errors }"
                  name="permissions"
                  rules="required"
                >
                <v-select
                  v-model="form.permission_id"
                  :options="lookups.mark_permissions"
                  class="w-100"
                  :reduce="(val) => val.id"
                  :label="getSelectLabel()"
                  multiple
                />
                <ValidationErrors :frontend-errors="errors"  />
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group
                :label="$t('Global.english_name')"
                label-for="mc-english_name"
                type="text"
              >
              <validation-provider
                  #default="{ errors }"
                  name="english_name"
                  rules="required|english"
                >
                <b-form-input class="left_right" id="mc-name" v-model="form.name" type="text" />
               <ValidationErrors :frontend-errors="errors"  />
                </validation-provider>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group
                :label="$t('Global.arabic_name')"
                label-for="mc-name_local"
              >
               <validation-provider
                  #default="{ errors }"
                  name="arabic_name"
                  rules="required|arabic"
                >
                <b-form-input
                  id="mc-name_local"
                  class="right_left"
                  v-model="form.name_local"
                  type="text"
                />
                 <ValidationErrors :frontend-errors="errors"  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                :label="$t('Global.short_name')"
                label-for="mc-short_name"
                type="text"
              >
               <validation-provider
                  #default="{ errors }"
                  name="short_name"
                  rules="required"
                >
                <b-form-input
                  id="mc-name"
                  v-model="form.short_name"
                  type="text"
                />
                <ValidationErrors :frontend-errors="errors"  />
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                :label="$t('Global.code')"
                label-for="mc-code"
                type="text"
              >
               <validation-provider
                  #default="{ errors }"
                  name="code"
                  rules="required"
                >
                <b-form-input id="mc-code" v-model="form.code" type="text" />
                 <ValidationErrors :frontend-errors="errors"  />
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
                @click="submit"
              >
                {{ $t("Global.save") }}
              </b-button>
              <b-button
                @click="cancel"
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
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
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import EditComponent from "@/views/components/table/Edit";
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate'
import {required,integer} from '@validations'
import ValidationErrors from "@/views/components/common/ValidationErrors";
export default {
  name: "Edit",
  components: {
    EditComponent,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    ValidationProvider, 
    ValidationObserver, 
    localize,
    ValidationErrors,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: "markCategories/item",
      load: "markCategories/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    name() {
      // return this.id ? `${this.$t('Global.edit_offering')}` : this.$t('Global.add_offering')
      return this.id
        ? this.$t("Global.edit_markCategory")
        : this.$t("Global.add_markCategory");
    },
  },
  watch: {},
  data() {
    return {
      form: {
        permission_id: [],
      },
      types: [
        { id: 0, name: "Work", name_local: "اعمال" },
        { id: 1, name: "Exam", name_local: "امتحان" },
      ],
      lookups: [],
      lookupModules: {
        // bylaws: true,
        // terms: true,
        // faculties: true,
        // programs: true,
        //programs_details: true,
        //mark_categories: true,
        mark_permissions: true,
      },
      form_submit: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: "markCategories/get",
      getLookups: "app/GET_LOOKUPS",
      submitItem: "markCategories/put",
      getMarkCategories: "markCategories/markCategories",
    }),
    init() {
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
      });
      if (this.id) {
        this.getItem(this.id).then((_) => {
          //this.form = this.item
          let query = {
            permission_id: [],
          };
          if (this.item) {
            query.code = this.item.code;
            query.name = this.item.name;
            query.name_local = this.item.name_local;
            query.short_name = this.item.short_name;
            query.type_id = this.item.type.name;

            if (this.item.permissions) {
              for (const [key, value] of Object.entries(this.item.permissions)) {
                query.permission_id.push(value);
              }
            }
            this.form = query;
          }
        });
      } else {

        this.form = {};
        // this.$refs.form.reset()
      }
    },
    submit() {
      // this.form_submit.term_id = this.form.term.id
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const query = {
        //teaching_assistants: this.form.teachingAssistant.map(el => el.id),
        permissions: this.form.permission_id,
        name: this.form.name,
        name_local: this.form.name_local,
        code: this.form.code,
        short_name: this.form.short_name,
        type: this.form.type_id,
      };
      const payload = { id: this.id, query: query };
      this.submitItem(payload).then((response) => {
        if (response.status === "success" && this.id) {
          this.$swal({
            icon: "success",
            title:
              this.$i18n.locale == "en"
                ? "Mark Category Edited!"
                : "تم تعديل التصنيف",
            text:
              this.$i18n.locale == "en"
                ? "Mark Category Successfully."
                : "تم تعديل تصنيف الدرجة بنجاح",
            showConfirmButton: false,
            timer: 3000,
          });
          this.$router.push({ name: "markCategories" });
        } else if (response.status === "success" && this.id == null) {
          this.$swal({
            icon: "success",
            title:
              this.$i18n.locale == "en"
                ? "Mark Category Added!"
                : "تم اضافة تصنيف درجة",
            text:
              this.$i18n.locale == "en"
                ? "Mark Category Successfully."
                : "تم اضافة التصنيف بنجاح",
            showConfirmButton: false,
            timer: 3000,
          });
          this.$router.push({ name: "markCategories" });
        } else {
          this.$swal({
            icon: "error",
            title: this.$i18n.locale == "en" ? "There Is An Error" : "يوجد خطأ",

            showConfirmButton: false,
            timer: 3000,
          });
        }
      });
        }
        else {
           this.$swal({
            icon: "error",
            title: this.$i18n.locale == "en" ? "please fill missing data" : " من فضلك املأ كل الحقول",

            showConfirmButton: false,
            timer: 3000,
          });
        }
      })
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },
    cancel() {
      if (this.inline) {
        return this.$emit("hide");
      }
      this.$router.push({ name: "markCategories" });
    },
  },
};
</script>

<style scoped></style>
