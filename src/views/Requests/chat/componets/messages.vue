<template>
<b-overlay
        id="overlay-background"
        :show="load"
        :variant="variant"
        :opacity="opacity"
        :blur="blur"
        rounded="sm"
      >
  <div>
    <b-card no-body>
      <b-card-body>
        <b-row class="d-flex justify-content-between">
          <b-col cols="12" md="12">
            <validation-observer ref="simpleRules">
              <b-form @submit.stop.prevent="send">
                <b-row class="d-flex justify-content-between">
                  <b-col md="12" class="d-flex align-items-start">
                    <b-form-group class="m-0 mx-1" style="flex-grow: 1" label-for="message">
                      <validation-provider #default="{ errors }" name="message" rules="required">
                        <b-form-textarea id="message" class="no_scroll pill" max-rows="6" rows="1" placeholder="Message" no-auto-shrink no-resize v-model="form.message" :state="errors.length > 0 ? false : null" />
                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                      </validation-provider>
                    </b-form-group>

                    <b-button size="lg" @click="selectFiles" v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" class="btn-icon rounded">
                      <feather-icon icon="UploadCloudIcon" />
                    </b-button>
                    <b-button size="lg" @click="send" v-ripple.400="'rgba(113, 102, 240, 0.15)'" variant="outline-primary" class="mx-1 btn-icon rounded">
                      <feather-icon icon="SendIcon" />
                    </b-button>
                  </b-col>
                  <span class="w-100 d-block px-1" v-for="preview in previews">
                   <span class="px-1 m-0"> {{ preview.name }}</span>
                  </span>
                </b-row>
              </b-form>
            </validation-observer>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <b-card>
      <history :items="$store.getters['chats/items']"></history>
    </b-card>
  </div>
</b-overlay>
</template>

<script>
import History from '@/views/Requests/chat/componets/history';
import { BCard, BCardText, BRow, BCol, BCollapse, VBToggle, BFormInput, BFormGroup, BFormTextarea, BButton, BTable, BMedia, BAvatar, BLink, BBadge, BDropdown, BDropdownItem, BPagination, BOverlay, BFormFile, BCardHeader, BCardBody } from 'bootstrap-vue';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import { mapActions, mapGetters } from 'vuex';
import { required, email } from '@validations';

export default {
  name: 'messages',
  components: {
    History,
    BCard,
    BCardText,
    BFormFile,
    BRow,
    BCol,
    BCollapse,
    VBToggle,
    BFormGroup,
    BFormInput,
    BButton,
    BTable,
    BFormTextarea,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BOverlay,
    BCardHeader,
    BCardBody,
    ValidationProvider,
    ValidationObserver,
    localize,
  },
  data() {
    return {
      form: {
        message: null,
      },
      files: [],
      previews: null,
    };
  },
  props: {
    chat_id: null,
    sent_to: null,
  },
  computed: {
    ...mapGetters({
      load: 'chats/load',
    }),
    id() {
      return this.chat_id ? this.chat_id : this.$route.params.id;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      message: 'chats/message',
    }),
    init() {
      let payload = { id: this.id, query: { limit: 10 } };
      this.$store.dispatch('chats/messages', payload).then(_ => {
        this.form = {};
      });
    },
    selectFiles() {
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple = 'multiple';
      input.onchange = _ => {
        this.previews = input.files;
        this.files = Array.from(input.files);
      };
      input.click();
    },
    send() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const formData = new FormData();
          for (const [key, value] of Object.entries(this.form)) {
            if (value) {
              formData.append(key, value);
            }
          }

          if (this.sent_to){
            formData.append('sent_to', this.sent_to);
          }

          if (this.files.length) {
            this.files.forEach((element, i) => {
              formData.append('files[' + i + ']', element);
            });
          }
          this.message({ id: this.id, resource: formData }).then(_ => {
            this.init();
          });
        }
      });
    },
  },
};
</script>

<style>
.no_scroll {
  overflow: auto !important;
}
</style>
