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
              'faculties',
              'type',
              'building',
              'location_num',
              'type_obj',
              'floor',
              'floor_local',
              'test',
              'floor_code',
              'capacity',
              'exam_capacity',
            ]"
          >
            <template #name>
              <th scope="row" :width="'20%'">
                {{ $t(`Global.name_custom`) }}
              </th>
              <td>
                <b-form-group label-for="name-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.english_name')"
                    rules="required"
                  >
                      <!-- @keypress="sanitizeEnglish($event)" -->
                    <b-form-input
                      id="name-input"
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                      :placeholder="$t('Global.english_name')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "حقل الاسم باللغة الإنجليزية مطلوب"
                          : error
                      }}
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
                <b-form-group label-for="nameAr-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.arabic_name')"
                    rules="required"
                  >
                      <!-- @keypress="
                        sanitizeArabic($event);
                        sanitizeNumber($event);
                      " -->
                    <b-form-input
                      id="nameAr-input"
                      :placeholder="$t('Global.arabic_name')"
                      v-model="form.name_local"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "حقل الاسم باللغة العربية مطلوب"
                          : error
                      }}
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
                    :name="$t('Global.arabic_name')"
                    rules="required"
                  >
                      <!-- @keypress="sanitizeArabic($event)" -->
                    <b-form-input
                      :placeholder="$t('Global.arabic_name')"
                      id="name_local"
                      v-model="form.name_local"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "حقل الاسم باللغة العربية مطلوب"
                          : error
                      }}
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
                    rules="required"
                  >
                      <!-- @keypress="sanitizeEnglish($event)" -->
                    <b-form-input
                      :placeholder="$t('Global.name_custom')"
                      id="name"
                      v-model="form.name"
                      :state="errors.length > 0 ? false : null"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "حقل الاسم باللغة الانجليزية مطلوب"
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #faculties>
              <th scope="row" :width="'20%'">
                {{ $t("Faculties during study") }}
              </th>
              <td>
                <b-form-group label-for="faculties-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('faculties')"
                    :rules="{required: false}"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.faculty_ids"
                      :label="getSelectLabel()"
                      :options="lookups.faculties"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Faculties during study')"
                      multiple
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{ $i18n.locale == "ar" ? "حقل الكلية مطلوب" : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #type>
              <th scope="row" :width="'20%'">
                {{ $t("Faculties during exams") }}
              </th>
              <td>
                <b-form-group label-for="faculties-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Faculties during exams')"
                    :rules="{required: false}"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.exam_faculty_ids"
                      :label="getSelectLabel()"
                      :options="lookups.faculties"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Faculties during exams')"
                      multiple
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{ $i18n.locale == "ar" ? "حقل الكلية مطلوب" : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #building>
              <th scope="row" :width="'20%'">
                {{ $t("Global.building") }}
              </th>
              <td>
                <b-form-group label-for="building-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.building')"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.building_id"
                      :label="getSelectLabel()"
                      :options="lookups.buildings"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.building')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{ $i18n.locale == "ar" ? "حقل المبني مطلوب" : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #location_num>
              <th scope="row" :width="'20%'">
                {{ $t("Global.location_num") }}
              </th>
              <td>
                <b-form-group label-for="location_num">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.location_num')"
                    rules="required"
                  >
                    <b-form-input
                      id="location_num"
                      type="number"
                      v-model="form.location_num"
                      :placeholder="$t('Global.location_num')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar" ? "حقل رقم الموقع مطلوب" : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #type_obj>
              <th scope="row" :width="'20%'">
                {{ $t("Global.type") }}
              </th>
              <td>
                <b-form-group label-for="name-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.type')"
                    rules="required"
                    v-if="lookups"
                  >
                    <v-select
                      v-model="form.type"
                      :label="getSelectLabel()"
                      :options="lookups.locations_types"
                      :reduce="(val) => val.id"
                      :placeholder="$t('Global.type')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{ $i18n.locale == "ar" ? "حقل النوع مطلوب" : error }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #floor>
              <th scope="row" :width="'20%'">
                {{ $t("Global.location_floor") }}
              </th>
              <td>
                <b-form-group label-for="floor-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.location_floor')"
                    rules="required"
                  >
                    <b-form-input
                      id="floor-input"
                      v-model="form.floor"
                      :placeholder="$t('Global.location_floor')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "حقل اسم الطابق باللغة الانجليزية مطلوب"
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #floor_local>
              <th scope="row" :width="'20%'">
                {{ $t("Global.location_floor_local") }}
              </th>
              <td>
                <b-form-group label-for="floor-local">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.location_floor_local')"
                    rules="required"
                  >
                    <b-form-input
                      id="floor-local"
                      v-model="form.floor_local"
                      :placeholder="$t('Global.location_floor_local')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "حقل اسم الطابق باللغة العربية مطلوب"
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #test="{ data }">
              <th scope="row" v-if="$i18n.locale == 'en'">
                {{ $t("Global.location_floor_local") }}
              </th>
              <td v-if="$i18n.locale == 'en'">
                <b-form-group label-for="floor-local">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.location_floor_local')"
                    rules="required"
                  >
                    <b-form-input
                      id="floor-local"
                      v-model="form.floor_local"
                      :placeholder="$t('Global.location_floor_local')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "حقل اسم الطابق باللغة العربية مطلوب"
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
              <th scope="row" v-if="$i18n.locale == 'ar'">
                {{ $t(`Global.location_floor`) }}
              </th>
              <td v-if="$i18n.locale == 'ar'">
                <b-form-group label-for="floor-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.location_floor')"
                    rules="required"
                  >
                    <b-form-input
                      id="floor-input"
                      v-model="form.floor"
                      :placeholder="$t('Global.location_floor')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar"
                          ? "حقل اسم الطابق باللغة الانجليزية مطلوب"
                          : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #floor_code>
              <th scope="row" :width="'20%'">
                {{ $t("Global.floor_code") }}
              </th>
              <td>
                <b-form-group label-for="floor_code">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.floor_code')"
                    rules="required"
                  >
                    <b-form-input
                      id="floor_code"
                      type="text"
                      v-model="form.floor_code"
                      :placeholder="$t('Global.floor_code')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar" ? "حقل كود الطابق مطلوب" : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #capacity>
              <th scope="row" :width="'20%'">
                {{ $t("Global.capacity") }}
              </th>
              <td>
                <b-form-group label-for="capacity-input">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.location_capacity')"
                    rules="required"
                  >
                    <b-form-input
                      id="capacity-input"
                      type="number"
                      v-model="form.capacity"
                      :placeholder="$t('Global.location_capacity')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar" ? "حقل سعة الموقع مطلوب" : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #exam_capacity>
              <th scope="row" :width="'20%'">
                {{ $t("Global.exam_capacity") }}
              </th>
              <td>
                <b-form-group label-for="exam_capacity">
                  <validation-provider
                    #default="{ errors }"
                    :name="$t('Global.exam_capacity')"
                    rules="required"
                  >
                    <b-form-input
                      id="exam_capacity"
                      type="number"
                      v-model="form.exam_capacity"
                      :placeholder="$t('Global.exam_capacity')"
                    />
                    <small
                      class="text-danger"
                      v-for="(error, index) in errors"
                      :key="index"
                    >
                      {{
                        $i18n.locale == "ar" ? "حقل سعة الامتحان مطلوب" : error
                      }}
                    </small>
                  </validation-provider>
                </b-form-group>
              </td>
            </template>
            <template #edit>
              <div class="mt-0 mb-1">
                <feather-icon
                  v-if="hasPermission('edit_exam')"
                  @click="cancel()"
                  style="cursor: pointer"
                  icon="XCircleIcon"
                  class="font-medium-3"
                  v-b-tooltip.hover="$t('Global.close')"
                />
              </div>
            </template>
          </ShowComponent>
          <!-- <b-row>
          
            <b-col md="6">
              
            </b-col> -->
          <!-- submit and reset -->
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
      lookups: 'app/lookups',
      item: "locations/item",
      load: "locations/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.id
        ? this.$t("Global.location_edit")
        : this.$t("Global.location_add");
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
        floor: null,
        capacity: null,
        faculty_ids: null,
        exam_faculty_ids: null,
        building_id: null,
        type: null,
        location_num: null,
        floor_local: null,
        floor_code: null,
        exam_capacity: null,
      },
    };
  },
  watch: {
    "this.form.floor_local"(newVal) {
    },
  },
  methods: {
    ...mapActions({
      getItem: "locations/get",
      getLookups: 'app/GET_LOOKUPS',
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then((_) => {
          this.form.name = this.item.name;
          this.form.name_local = this.item.name_local;
          this.form.floor = this.item.floor;
          this.form.capacity = this.item.capacity;
          this.form.building_id = this.item.building.id;
          this.form.faculty_ids = this.item.faculty_ids;
          this.form.exam_faculty_ids = this.item.exam_faculty_ids;
          this.form.location_num = this.item.location_num;
          this.form.type = this.item.type;
          this.form.floor_local = this.item.floor_local;
          this.form.floor_code = this.item.floor_code;
          this.form.exam_capacity = this.item.exam_capacity;
        });
      }
    },
    cancel() {
      if (!this.id) {
        this.$router.go(-1);
      }
      if (this.inline) {
        return this.$emit("hide");
      }
    },
    save() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const payload = { id: this.id, query: this.form };
          this.$store
            .dispatch("locations/put", payload)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push({
                name: "schedule-settings",
                query: { tabNum: 1 },
              });
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
    const lookupPayload = {
      locations_types: true,
      faculties: true,
      buildings: true
    }
    this.getLookups(lookupPayload).then(_=>{
    })
  },
};
</script>

<style scoped></style>
