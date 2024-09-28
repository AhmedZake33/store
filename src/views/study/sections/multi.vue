<template>
  <div>
   <b-overlay :show="show" rounded="sm" no-fade>
    <edit-component
      :name="this.name"
      :loading="false"
      :status="2"
    >
      <template #inputs>
        <validation-observer ref="form">
          <b-form
            ref="form"
            @submit.stop.prevent="save"
          >
            <b-row>
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.course')"
                  label-for="mc-course"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="term"
                    rules="required"
                  >
                    <v-select
                      id="mc-course"
                      v-model="course_id"
                      :filter="fuseSearch"
                      :options="[item.course]"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :label="getSelectLabel()"
                      class="w-100"
                      :reduce="val => val.id"
                      disabled
                    />
                    <small
                      v-if="errors.length"
                      class="text-danger"
                    >{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.num_group')"
                  label-for="mc-group"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="num_groups"
                    rules="number|required|positive"
                  >
                    <b-form-input
                      id="mc-group"
                      v-model="form.num_groups"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                    <ValidationErrors  :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'num_groups')" />

                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.num_section')"
                  label-for="mc-section"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="num_sections"
                    rules="number|required|positive"
                  >
                    <b-form-input
                      id="mc-section"
                      v-model="form.num_sections"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                    <ValidationErrors  :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'num_sections')" />

                  </validation-provider>
                </b-form-group></b-col>
             <!--  <b-col md="6">
                <b-form-group
                  :label="$t('Global.section_group')"
                  label-for="mc-section_group"
                >
                  <b-form-input
                    id="mc-section_group"
                    v-model="form.section_group"
                    type="number"
                  />
                </b-form-group>
              </b-col> -->
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.quota')"
                  label-for="mc-quota"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="section_quota"
                    rules="number|required|positive"
                  >
                    <b-form-input
                      id="mc-quota"
                      v-model="form.students_quota"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                     <ValidationErrors  :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'section_quota')" />

                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  :label="$t('Global.over_quota')"
                  label-for="mc-over_quota"
                >
                  <validation-provider
                    #default="{ errors }"
                    name="section_over_quota"
                    rules="number|required|positive"
                  >
                    <b-form-input
                      id="mc-over_quota"
                      v-model="form.students_over_quota"
                      :state="errors.length > 0 ? false : null"
                      type="number"
                    />
                     <ValidationErrors  :frontend-errors="errors" :backend-errors="getBackendFieldError(errorsdata, 'section_over_quota')" />

                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>  <b-col md="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
              >
                {{ $t('Global.save') }}
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="cancel"
              >
                {{ $t('Global.cancel') }}
              </b-button>
            </b-col></b-row>
          </b-form>
        </validation-observer>
      </template>
    </edit-component>
   </b-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
    BOverlay,

} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required, integer } from '@validations'
import EditComponent from '@/views/components/table/Edit'
import ValidationErrors from '@/views/components/common/ValidationErrors';

export default {
  name: 'Edit',
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
      BOverlay,

  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      // item: 'sections/item',
      item: 'offerings/item',
      load: 'sections/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    name() {
      if(this.item)
      {
        let header = this.$t('Global.add_multi_seactions') + ' - ' + this.course_code  + ' ' + this.course_name
        return header

      }
      else 
         return this.$t('Global.add_multi_seactions') 

      
      
    },
  },
  watch: {},
  data() {
    return {
      disable_inputs: false,
      course_name: null,
      course_code: null,
      form: {
        students_quota: null,
        students_over_quota: null,
        num_groups: null,
        num_sections: null,
        section_group: null,
      },
      course_id: null,
      offering_id: null,
      errorsdata: {},
      show:true,

    }
  },
  mounted() {
    this.init()
    this.getItem(this.$route.query.offering_id)
  },
  methods: {
    ...mapActions({
      // getItem: 'sections/get',
      getItem: 'offerings/get',
      submitItem: 'sections/put',
      submitSections: 'offerings/addMultiSections',
    }),
    init() {
      this.getItem(this.$route.query.offering_id).then(value => {
        this.course_id = this.item.course.id
        this.course_name = this.item.course && this.$i18n.locale == 'en' ? this.item.course.name : this.item.course.name_local
        this.course_code = this.item?.course?.code
        this.show=false
      })
    },
    save() {
      this.offering_id = this.$route.query.offering_id
      const payload = {
        id: this.$route.query.offering_id,
        query: this.form,
      }
      this.submitSections(payload).then(response => {
        if(response.status == 'success')
        {
           this.$swal({
            icon: 'success',
            title: `${this.$t('Global.saved')}`,
            showConfirmButton: false,
            timer: 1500,
          })
          this.$router.push({
            name: 'sections',
            query: { offering_id: this.offering_id },
          })
        }
      })
      /*  if (this.$route.query.offering_id) {
        this.form.offering_id = this.$route.query.offering_id
      } else {
        this.form.offering_id = this.item.offering.id
      }
      const payload = {
        id: this.params && this.params.status == 1 ? null : this.id,
        query: this.form,
      }
      this.submitItem(payload).then(response => {
        if (response.status == 'success') {
          this.$swal({
            icon: 'success',
            text: `${this.$t('Global.successMessage')}`,
            showConfirmButton: false,
            timer: 1500,
          })
          this.$router.push({
            name: 'sections',
            query: { offering_id: this.form.offering_id },
          })
        }
      }) */
    },
    cancel() {
     this.$router.go(-1);
    },
  },
}
</script>

<style scoped></style>
