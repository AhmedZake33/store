<template>
  <div>
    <edit-component :name="title">
      <template #inputs>
        <b-form
          ref="form"
          @submit.stop.prevent="save"
        >
          <b-row>
            <b-col md="6">
              <b-form-group
                label="English Name"
                label-for="name-input"
              >
                <b-form-input
                  id="name-input"
                  v-model="form.name"
                />
                <small
                  v-if="$i18n.locale == 'ar' "
                  class="danger"
                  style="color:red !important"
                >{{ errorsdata ? (errorsdata.name ? errorsdata.name[0].ar : "" ) : "" }}</small>
                <small
                  v-else
                  class="danger"
                  style="color:red !important"
                > {{ errorsdata ? (errorsdata.name ? errorsdata.name[0].en : "" ) : "" }} </small>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                :state="nameLocalState"
                label="Arabic Name"
                label-for="nameAr-input"
              >
                <b-form-input
                  id="nameAr-input"
                  v-model="form.name_local"
                  :state="nameLocalState"
                />
                <small
                  v-if="$i18n.locale == 'ar' "
                  class="danger"
                  style="color:red !important"
                >{{ errorsdata ? (errorsdata.name ? errorsdata.name_local[0].ar : "" ) : "" }}</small>
                <small
                  v-else
                  class="danger"
                  style="color:red !important"
                > {{ errorsdata ? (errorsdata.name ? errorsdata.name_local[0].en : "" ) : "" }} </small>
              </b-form-group>
            </b-col>

            <b-col md="6">
              <b-form-group
                :state="codeState"
                label="Code"
                label-for="code-input"
              >
                <b-form-input
                  id="code-input"
                  v-model="form.code"
                  :state="codeState"
                />
                <small
                  v-if="$i18n.locale == 'ar' "
                  class="danger"
                  style="color:red !important"
                >{{ errorsdata ? (errorsdata.code ? errorsdata.code[0].ar : "" ) : "" }}</small>
                <small
                  v-else
                  class="danger"
                  style="color:red !important"
                > {{ errorsdata ? (errorsdata.code ? errorsdata.code[0].en : "" ) : "" }} </small>
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

              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
              >
                Reset
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </template>
    </edit-component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  BCard, BRow, BCol, BFormGroup, BFormInput, BFormCheckbox, BForm, BButton,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import EditComponent from '@/views/components/table/Edit'

export default {
  title: 'Edit',
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
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'faculties/item',
      load: 'faculties/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    title() {
      // return this.id ? this.$t('Global.edit_section') +' '+ item.section : this.$t('Global.add_section')
      return this.id ? this.$t('Global.certificate_edit') : this.$t('Global.faculty_add')
    },
  },
  data() {
    return {
      nameState: null,
      nameLocalState: null,
      codeState: null,
      errorsdata: {},
      form: {
        name: null,
        name_local: null,
        code: null,
      },
      message: null,
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    ...mapActions({
      getItem: 'certificates/get',
    }),
    init() {
      if (this.id) {
        this.getItem(this.id).then(_ => {
          this.form = this.item
        })
      }
    },
    // save() {
    //   const payload = { id: this.id, query: this.form }
    //   this.$store.dispatch('faculties/put', payload).then(response => {
    //     this.$swal({
    //       icon: 'success',
    //       title: 'Faculty Added!',
    //       text: 'Faculty Added Successfully.',
    //       showConfirmButton: false,
    //       timer: 1500,
    //     })
    //     this.$router.go(-1)
    //   }).catch(error => {
    //     const errors = [error.response.data.errors]
    //     errors.forEach((error, index) => {
    //       const error_data = Object.values(error)[index][0]
    //       // this.showToast(this.$i18n.locale = 'ar' ? 'خطأ في البيانات' : 'Data Errors', 8000, error_data.ar, 'danger')
    //       this.errorsdata = error
    //     })
    //   })
    // },
  },
}
</script>

<style scoped></style>
