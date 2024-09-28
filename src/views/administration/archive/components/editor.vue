<template>
  <b-row>
    <!-- <div v-model="(locale = $i18n.locale)"></div> -->
    <b-col cols="12" xl="12" lg="8" md="7">
      <b-card no-body>
        <b-card-header>
          <div>
            <b-breadcrumb v-if="item" class="breadcrumb-slash font-weight-bolder font-medium-1">
              <b-breadcrumb-item v-for="(item, i) in item.parents" :key="i" class="text-capitalize" @click="navigate(item.id)">
                {{ $i18n.locale == 'en' ? item.title || item.local_title : item.local_title || item.title }}
              </b-breadcrumb-item>
              <b-breadcrumb-item class="text-capitalize" :active="true">
                {{ $i18n.locale == 'en' ? item.title || item.local_title : item.local_title || item.title }}
              </b-breadcrumb-item>
            </b-breadcrumb>
          </div>
        </b-card-header>
        <b-card-body>
          <div>
            <!--                        <quill-editor v-model="content" :options="option"/>-->
            <page v-model="content" api-key="5134dsngirrl0brc1i314hwj587bk140g03tif8xq86wb1n7" :init="init_en" />
          </div>
          <div class="my-2">
            <b-button variant="primary" @click="save">
              <feather-icon icon="SaveIcon" class="mr-50" />
              <span class="align-middle">Save</span></b-button
            >
          </div>
        </b-card-body>
      </b-card>
    </b-col>
    <b-modal v-model="folderDialog" centered size="xl">
      <template #modal-title>
        {{ $t('Global.file_browser') }}
      </template>
      <Browser />
      <template #modal-footer>
        <b-col md="12">
          <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1" @click="setContent()">
            {{ $t('Global.save') }}
          </b-button>
          <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="reset()">
            {{ $t('archive.cancel') }}
          </b-button>
        </b-col>
      </template>
    </b-modal>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex';
import { BTab, BTabs, BCard, BCol, BRow, BAvatar, BBreadcrumb, BBreadcrumbItem, BCardFooter, BCardBody, BCardHeader } from 'bootstrap-vue';

import Editor from '@tinymce/tinymce-vue';
import List from '@/views/components/info/list';
import Archive from '../../../../api/administration/archive/archive';
import Browser from './browser.vue';

const archive = new Archive();

export default {
  name: 'Show',
  components: {
    page: Editor,
    BBreadcrumb,
    BCardBody,
    BCardHeader,
    BCardFooter,
    BBreadcrumbItem,
    BAvatar,
    Archive,
    List,
    BTabs,
    BTab,
    BCard,
    BCol,
    BRow,
    Browser,
  },
  data() {
    return {
      content: '',
      locale: this.$i18n.locale,
      folderDialog: false,
      option: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
          table: true,
          imageResize: {
            displaySize: true,
          },
        },
      },
      init_en: {
        height: 400,
        menubar: 'file edit view insert format tools table custom help',
        images_upload_handler: this.imageUpload,
        selector: 'textarea',
        // contextmenu: false,
        browser_spellcheck: true,
        font_formats:
          'Open Sans=Open Sans,sans-serif;Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
        content_style: '@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");body[dir="rtl"] ul{direction: rtl !important};',
        convert_urls: false,
        relative_urls: false,
        remove_script_host: true,
        automatic_uploads: true,
        directionality: this.$i18n.locale == 'ar'  ? 'rtl' : 'ltr',
        language: 'en',
        body_class : "my_class",
        toolbar1:
          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
        plugins: ['print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount  imagetools  textpattern help code'],
        menu: {
          custom: {
            title: this.$i18n.locale == 'ar' ? 'المزيد' : 'More',
            items: 'insert_file files_browser video_capture audio_capture',
          },
        },
        setup: this.setup,
      },
    };
  },
  computed: {
    ...mapGetters({
      item: 'archive/archive',
      load: 'archive/contentLoad',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },
  watch: {
    '$i18n.locale': function () {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    setup(editor) {
      const obj = this;
      editor.ui.registry.addMenuItem('files_browser', {
        text: 'استعراض الملفات',
        onAction() {
          obj.folderDialog = true;
        },
      });
      // editor.onInit.add(function(editor, evt) { //since tinymce4 use editor.on('init', function(evt){...
      //     editor.getBody().setAttribute('spellcheck', true);
      // });
    },
    navigate(archive_id) {
      let query = {
        limit: 10,
        parent_id: archive_id,
      };
      this.$store.commit('archive/SET_CURRENT_ID', archive_id);
      this.$router.push('/archives');
      this.$router.replace({ query: query }).catch(()=>{});
    },
    save() {
      this.$store
        .dispatch('archive/setContent', {
          id: this.id,
          body: this.content === '' ? '<p></p>' : this.content,
          language: this.$i18n.locale,
        })
        .then(_ => {
          this.$swal({
            icon: 'success',
            title: `${this.$t('Global.saved')}`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
    imageUpload(blobInfo, success, failure, progress) {
      let formData;
      formData = new FormData();
      const { folder } = this.item;
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      if (folder) {
        archive.upload(formData, `/${folder.id}`).then(response => {
          progress(100);
          success(response.data[0].url);
        });
      } else {
        this.$swal({ icon: 'error', text: 'Folder not exist' });
      }
    },
    init() {
      this.$store
        .dispatch('archive/get', {
          id: this.id,
          query: { language: this.$i18n.locale },
        })
        .then(_ => {
          this.content = this.item.content;
        });
    },
    isImage(extension) {
      if (extension) {
        if (extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'tif' || extension == 'jpeg' || extension == 'bmp') {
          return true;
        }
      }
      return false;
    },
    reset() {
      this.folderDialog = false;
      this.$store.commit('archive/SET_RESET');
    },
    setContent() {
      let content = '';
      this.$store.getters['archive/selectedItem'].forEach(item => {
        if (this.isImage(item.extension)) {
          content += `<img src="${process.env.VUE_APP_BASE_URL}/archive/download/${item.id}" />`;
        } else {
          content += `<a href="${process.env.VUE_APP_BASE_URL}/archive/download/${item.id}" >${item.title}</a>`;
        }
      });
      this.content = content + this.content;
      this.folderDialog = false;
      this.$store.commit('archive/SET_RESET');
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
#__BVID__73___BV_modal_outer_ {
  z-index: 99999 !important;
}
</style>
