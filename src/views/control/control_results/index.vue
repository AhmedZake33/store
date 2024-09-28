<template>
  <div>
    <b-row>
      <b-col cols="12">
        <b-card class="ml-1 mr-1">
          <b-row>
            <b-col cols="4">
              <v-select
                v-model="filter.control_term_id"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.terms"
                :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                class="w-100 mb-1"
                :reduce="(val) => val.id"
                :placeholder="$t('Term')"
              >
                <template v-slot:option="option">
                  {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                </template>
                <template #selected-option="{ name, name_local }">
                  <div style="display: flex; align-items: baseline">
                    <strong
                      >{{ $i18n.locale == 'ar' ? name_local : name }}
                    </strong>
                  </div>
                </template>
                <template #no-options>
                  {{ $t('noMatching') }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="4">
              <v-select
                v-model="filter.faculty_id"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.faculties"
                :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                class="w-100 mb-1"
                :reduce="(val) => val.id"
                :placeholder="$t('Faculty')"
              >
                <template v-slot:option="option">
                  {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                </template>
                <template #selected-option="{ name, name_local }">
                  <div style="display: flex; align-items: baseline">
                    <strong
                      >{{ $i18n.locale == 'ar' ? name_local : name }}
                    </strong>
                  </div>
                </template>
                <template #no-options>
                  {{ $t('noMatching') }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="4">
              <v-select
                :disabled="!filter.faculty_id"
                v-model="filter.bylaw_id"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.bylaws"
                :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                class="w-100 mb-1"
                :reduce="(val) => val.id"
                :placeholder="$t('Bylaw')"
              >
                <template v-slot:option="option">
                  {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                </template>
                <template #selected-option="{ name, name_local }">
                  <div style="display: flex; align-items: baseline">
                    <strong
                      >{{ $i18n.locale == 'ar' ? name_local : name }}
                    </strong>
                  </div>
                </template>
                <template #no-options>
                  {{ $t('noMatching') }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="4">
              <v-select
                :disabled="!(filter.faculty_id && filter.bylaw_id)"
                v-model="filter.program_id"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.programs"
                :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                class="w-100 mb-1"
                :reduce="(val) => val.id"
                :placeholder="$t('Program')"
              >
                <template v-slot:option="option">
                  {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                </template>
                <template #selected-option="{ name, name_local }">
                  <div style="display: flex; align-items: baseline">
                    <strong
                      >{{ $i18n.locale == 'ar' ? name_local : name }}
                    </strong>
                  </div>
                </template>
                <template #no-options>
                  {{ $t('noMatching') }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="4">
              <v-select
                :disabled="!(filter.faculty_id && filter.bylaw_id)"
                v-model="filter.level_number"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.faculty_levels"
                :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                class="w-100 mb-1"
                :reduce="(val) => val.id"
                :placeholder="$t('level')"
              >
                <template v-slot:option="option">
                  {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                </template>
                <template #selected-option="{ name, name_local }">
                  <div style="display: flex; align-items: baseline">
                    <strong
                      >{{ $i18n.locale == 'ar' ? name_local : name }}
                    </strong>
                  </div>
                </template>
                <template #no-options>
                  {{ $t('noMatching') }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="4">
              <v-select
                :disabled="!(filter.faculty_id && filter.bylaw_id)"
                v-model="filter.sheet_type_id"
                :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                :options="lookups.sheet_types"
                :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                class="w-100 mb-1"
                :reduce="(val) => val.id"
                :placeholder="$t('Results Sheet')"
              >
                <template v-slot:option="option">
                  {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                </template>
                <template #selected-option="{ name, name_local }">
                  <div style="display: flex; align-items: baseline">
                    <strong
                      >{{ $i18n.locale == 'ar' ? name_local : name }}
                    </strong>
                  </div>
                </template>
                <template #no-options>
                  {{ $t('noMatching') }}
                </template>
              </v-select>
            </b-col>
            <b-col cols="4">
              <b-button
                :disabled="
                  !(
                    filter.control_term_id &&
                    filter.faculty_id &&
                    filter.bylaw_id &&
                    filter.program_id &&
                    filter.sheet_type_id
                  )
                "
                type="submit"
                variant="primary"
                class=""
                @click="showPdf()"
              >
                {{ $t('Show') }}
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <!-- <b-overlay v-if="!loading" rounded="sm" class="col-12"> -->
        <b-card :title="$t('Results')" tag="article" class="ml-1 mr-1">
          <b-row>
            <b-col class="xs_mini">
              <iframe
                :src="computedPdf"
                :frameborder="0"
                style="width: 100%; height: 600px"
              />
            </b-col>
          </b-row>
        </b-card>
        <!-- </b-overlay> -->
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { BRow, BCol, BCard, BOverlay, VBModal } from 'bootstrap-vue';
import { mapGetters, mapActions } from 'vuex';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';

export default {
  components: {
    BRow,
    BCol,
    BCard,
    mapActions,
    mapGetters,
    vSelect,
    BOverlay,
  },
  directives: {
    Ripple,
    'b-modal': VBModal,
  },
  data() {
    return {
      filter: {
        control_term_id: null,
        faculty_id: null,
        bylaw_id: null,
        program_id: null,
        level_number:null,
        sheet_type_id: null,
        lang: '',
      },
      pdf: '',
      token: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      lookups: 'controlResults/lookups',
    }),
    computedPdf() {
      return this.pdf;
    },
  },
  methods: {
    ...mapActions({
      getlookup: 'controlResults/getLookups',
      getControlResult: 'controlResults/getControlResult',
    }),
    init() {
      let payload = { terms: true, faculties: true, sheet_types: true };
      // this.filter.lang = this.$cookie.get('language');
      this.filter.lang = 'en'
      this.getlookup(payload)
        .then((data) => {})
        .catch((error) => {
          this.errorToast(error.title);
        });
    },
    showPdf() {
      this.loading = true;
      let payload = this.filter;

      this.getControlResult(payload)
        .then((data) => {
          let token = data.data.token;

          let params = `lang=${this.filter.lang}&control_term_id=${this.filter.control_term_id}&faculty_id=${this.filter.faculty_id}&bylaw_id=${this.filter.bylaw_id}&sheet_type_id=${this.filter.sheet_type_id}&token=${token}`;
          if (this.filter.program_id) {
            params = params + `&program_id=${this.filter.program_id}`;
          }
          if(this.filter.level_number){
              params = params + `&level_number=${this.filter.level_number}`;
            }
        
          this.pdf = `${process.env.VUE_APP_BASE_URL}/control/results/pdf?${params}`;
        })
        .catch((error) => {
          this.errorToast(error.title);
        });

      this.loading = false;
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    'filter.faculty_id': function (newValue) {
      this.filter.bylaw_id = null;
      this.filter.program_id = null;
      this.filter.level_number = null;
      this.filter.sheet_type_id = null;
      let payload = {
        terms: true,
        faculties: true,
        sheet_types: true,
        bylaws: true,
        faculty_id: this.filter.faculty_id,
      };

      this.getlookup(payload)
        .then((data) => {})
        .catch((error) => {
          this.errorToast(error.title);
        });
    },

    'filter.bylaw_id': function (newValue) {
      this.filter.program_id = null;
      this.filter.level_number = null;
      this.filter.sheet_type_id = null;
      let payload = {
        terms: true,
        faculties: true,
        sheet_types: true,
        bylaws: true,
        programs: true,
        faculty_level: true,
        faculty_id: this.filter.faculty_id,
        bylaw_id: this.filter.bylaw_id,
      };

      this.getlookup(payload)
        .then((data) => {})
        .catch((error) => {
          this.errorToast(error.title);
        });
    },
  },
};
</script>
