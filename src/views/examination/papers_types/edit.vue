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
                    name="english name"
                    rules="required|english"
                  >
                    <b-form-input
                      @keypress="
                        sanitizeEnglish($event);
                      "
                      id="name-input"
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
            <template #id="{ data }">
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
                    name="name_local" 
                    rules="arabic|required"
                  >
                    <b-form-input 
                      :placeholder="$t('Global.arabic_name')" 
                      id="name_local" 
                      v-model="form.name_local" 
                      :state="errors.length > 0 ? false : null" 
                      @keypress="sanitizeArabic($event)" 
                    />
                    <ValidationErrors 
                      :frontend-errors="errors" 
                      :backend-errors="getBackendFieldError(errorsdata, 'name_local')" 
                    />
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
                    <ValidationErrors 
                      :frontend-errors="errors" 
                      :backend-errors="getBackendFieldError(errorsdata, 'name')" 
                    />
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon v-if="hasPermission('edit_examPapersType')" @click="cancel()" style="cursor: pointer"
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
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  localize,
} from "vee-validate";
import { mapGetters, mapActions } from "vuex";
import { required } from "@validations";
// import * as rules from "@validations";
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
  BFormDatepicker,
  BFormCheckbox,
  BBadge,
} from "bootstrap-vue";

export default {
  name: "edit",
  components: {
    EditComponent,
    ShowComponent,
    vSelect,
    ValidationErrors,
    required,
    extend,
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
    BFormDatepicker,
    BFormCheckbox,
    BBadge,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      errorsdata: {},
      form: {
        name: null,
        name_local: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      lookups: "papersTypes/lookups",
      item: "papersTypes/item",
      load: "papersTypes/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id ? this.$t("edit_papers_type") : this.$t("add_papers_type");
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    tabNumber: Number,
    data: { default: {}, type: [Array, Object] },
  },
  methods: {
    ...mapActions({
      getItem: "papersTypes/get",
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.name = this.item.name;
          this.form.name_local = this.item.name_local;
        });
      }
    },
    cancel() {
      return this.$emit('hide');
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("papersTypes/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              // this.$router.go(-1);
              this.$router.push({name:'papers_types'})
            })
            .catch((error) => {
              let message = error.response.data.errors.term_id.length > 0 ? this.$i18n.locale == 'ar' ? error.response.data.errors.term_id[0].ar : error.response.data.errors.term_id[0].en : this.$t("Global.errorMessage")
              this.$swal({
                icon: "error",
                text: message,
                showConfirmButton: true,
                timer: 3000,
              });
            });
        }
      });
    },
  },
  mounted() {
    extend("after", {
      params: ["otherValue"],
      message: (field, { otherValue }) => otherValue.msg,
      validate: (value, { otherValue }) =>
        value > otherValue.value ? true : false,
    });
    // this.$store.dispatch("papersTypes/lookups");
    this.init();
  },
};
</script>
