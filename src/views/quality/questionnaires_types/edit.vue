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
                'name',
                'name_local',
                'id',
                'description',
                'description_local',
                'questions',
                'status'
              ]" 
            >
            
            <template #name>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.name_custom`) }}
              </th>
              <td>
                <b-form-group 
                  label-for="name-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.english_name')"
                    rules="required|english"
                  >
                    <b-form-input
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.english_name')"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الاسم باللغة الإنجليزية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #name_local>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.arabic_name`) }}
              </th>
              <td>
                <b-form-group
                  label-for="nameAr-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.arabic_name')"
                    rules="required|arabic"
                  >
                    <b-form-input
                      @keypress="
                        sanitizeArabic($event);
                        sanitizeNumber($event);
                      "
                      :placeholder="$t('Global.arabic_name')"
                      v-model="form.name_local"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الاسم باللغة العربية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template> 
            <template #id>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                {{ $t(`Global.name_local`) }}
              </th>
              <td v-if="$i18n.locale == 'en'">
                <b-form-group 
                  label-for="name_local" 
                  invalid-feedback="Name is required"
                >
                  <validation-provider 
                    #default="{ errors }" 
                    :name="$t('Global.arabic_name')" 
                    rules="required"
                  >
                    <b-form-input 
                      :placeholder="$t('Global.arabic_name')" 
                      v-model="form.name_local" 
                      :state="errors.length > 0 ? false : null" 
                      @keypress="sanitizeArabic($event)" 
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الاسم باللغة العربية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
              <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                {{ $t(`Global.name_custom`) }}
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
                    <b-form-input 
                      :placeholder="$t('Global.name_custom')" 
                      id="name" 
                      v-model="form.name" 
                      :state="errors.length > 0 ? false : null" 
                      @keypress="sanitizeEnglish($event);" 
                    />
                    <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الاسم باللغة الانجليزية مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #description>
              <th scope="row" :width="'20%'">
                {{ $t('Global.description_custom') }}
              </th>
              <td>
                <b-form-group
                  label-for="description-input"
                >
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.description')"
                    rules="required"
                  >
                    <b-form-textarea
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      id="description-input"
                      v-model="form.description"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.description')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error,index) in errors"
                      :key="index"
                    >
                      {{$i18n.locale == 'ar' ? 'حقل الوصف مطلوب' : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #description_local="{ data }">
                <th scope="row" :width="'20%'">
                    {{ $t(`Global.description_local`) }}
                </th>
                <td>
                  <b-form-group
                    label-for="description-local-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      :name="$t('Global.description_local')"
                      rules="required"
                    >
                      <b-form-textarea
                        @keypress="
                          sanitizeArabic($event);
                        "
                        id="description-local-input"
                        v-model="form.description_local"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.description_local')"
                      />
                      <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                      >
                        {{$i18n.locale == 'ar' ? 'حقل الوصف باللغة العربية مطلوب' : error }}
                      </small>
                    </validation-provider>
                  </b-form-group>
                </td>
            </template>
            <template #questions="{ data }">
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                    {{ $t(`Global.description_custom`) }}
                </th>
                <td v-if="$i18n.locale == 'ar'">
                  <b-form-group
                    label-for="description-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      :name="$t('Global.description')"
                      rules="required"
                    >
                      <b-form-textarea
                        @keypress="
                          sanitizeEnglish($event);
                        "
                        id="description-input"
                        v-model="form.description"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.description')"
                      />
                      <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                      >
                        {{$i18n.locale == 'ar' ? 'حقل الوصف مطلوب' : error }}
                      </small>
                    </validation-provider>
                  </b-form-group>
                </td>
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                    {{ $t(`Global.description_local`) }}
                </th>
                <td v-if="$i18n.locale == 'en'">
                  <b-form-group
                    label-for="description-local-input"
                  >
                    <validation-provider
                      #default="{ errors }"
                      :name="$t('Global.description_local')"
                      rules="required"
                    >
                      <b-form-textarea
                        @keypress="
                          sanitizeArabic($event);
                        "
                        id="description-local-input"
                        v-model="form.description_local"
                        :state="errors.length > 0 ? false : null"
                        :placeholder="$t('Global.description_local')"
                      />
                      <small
                        class="text-danger"
                        v-for="(error,index) in errors"
                        :key="index"
                      >
                        {{$i18n.locale == 'ar' ? 'حقل الوصف باللغة العربية مطلوب' : error }}
                      </small>
                    </validation-provider>
                  </b-form-group>
                </td>
            </template>

            <template #status="{ data }">
                <th scope="row" :width="'20%'" v-if="data.status">
                    {{ $t(`Global.status`) }}
                </th>
                <td v-if="data.status">
                    {{ $i18n.locale == 'ar' ? data.status.name_local : data.status.name }}
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
      lookups: "questionnairesTypes/lookups",
      item: "questionnairesTypes/item",
      load: "questionnairesTypes/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
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
        name: null,
        name_local: null,
        description: null,
        description_local: null
      },
    };
  },
  
  methods: {
    ...mapActions({
      getItem: "questionnairesTypes/get",
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.name = this.item.name;
          this.form.name_local = this.item.name_local;
          this.form.description = this.item.description;
          this.form.description_local = this.item.description_local;
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
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("questionnairesTypes/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if(this.$route.name == "add_questionnaireType"){
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
