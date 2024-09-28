<template>
  <b-row>
    <b-col
      cols="12"
      xl="12"
      lg="8"
      md="7"
    >
      <b-row >
        <b-col cols="12">
          <ShowComponent
            class="pb-0"
            title="Settings"
            :data="setting"
            :only="['name','bylaw','faculty','program','term']"
            :loading="load"
          >
          </ShowComponent>
          <ShowComponent
            class="pb-0"
            :data="setting.data"
            :except="['name']"
            :loading="load"
          >
          </ShowComponent>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  BTabs,
  BTab,
  BCard,
  BCol,
  BRow,
  BBadge,
  BAlert,
  BLink,
  BAvatar,
  BCardBody,
  BButtonGroup,
  BButton,
  BModal,
  BInputGroup,
  BFormTextarea,
  BImg,
  BFormGroup,
  BForm,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required, email } from '@validations'
import List from '@/views/components/info/list'
import ShowComponent from '@/views/components/info/show'
import Archive from '@/views/administration/archive/components/archive'

export default {
  name: 'Show',
  components: {
    Archive,
    List,
    BTabs,
    BTab,
    BCard,
    BCol,
    BRow,
    BBadge,
    BAlert,
    BLink,
    BCardBody,
    BAvatar,
    BButtonGroup,
    BButton,
    BImg,
    BModal,
    BInputGroup,
    BFormTextarea,
    BFormGroup,
    BForm,
    ShowComponent,
    ValidationProvider,
    ValidationObserver,
    localize,
  },
  data() {
    return {
      form: {},
      link: '',
      note: '',
      modalShow: false,
      type: null,
    }
  },
  computed: {
    ...mapGetters({
      setting: 'settings/item',
      load: 'settings/load',
      role: 'roles/userRoles',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    uploadFile() {
      const fileUpload = document.getElementById('refInput')
      if (fileUpload != null) {
        fileUpload.click()
      }
    },
    directToWebsite(id, secret) {
      this.link = `https://emsweb.fekracomputers.net/en/admissionForm/${id}/${secret}`
    },

    remove(id) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText:`${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.removesetting(id).then(_ => {
            this.refresh()
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            })
          })
        }
      })
    },
    refresh(query) {
      query = { ...query, type: this.type }
      this.$store.dispatch('settings/get', this.id)
    },
    hideModal() {
      this.modalShow = false
      this.type = null
    },
    toggleModal(type) {
      this.type = type
      this.modalShow = true
    },
    ...mapActions({
      changesettingStatus: 'settings/changeStatus',
      removesetting: 'settings/remove',
      acceptsettingDesire: 'settings/acceptDesire',
    }),
    init() {
      this.$store.dispatch('settings/get', this.id)
    },
    changeStatus(action) {
      if (this.type == null) {
        const payload = {
          id: this.id,
          query: {
            flag: action,
            message: this.form ? this.form.message : null,
          },
        }
        this.changesettingStatus(payload)
        this.hideModal()
        this.init()
      } else {
        this.$refs.ruleForm.validate().then(success => {
          if (success) {
            const payload = {
              id: this.id,
              query: {
                flag: action,
                message: this.form ? this.form.message : null,
              },
            }
            this.changesettingStatus(payload)
            this.hideModal()
            this.init()
          }
        })
      }
    },
    acceptDesire(faculty, program) {
      const payload = {
        query: {
          setting_id: this.id,
          faculty_id: faculty,
          program_id: program,
        },
      }
      this.acceptsettingDesire(payload)
      this.init()
    },
  },
}
</script>

<style scoped></style>
