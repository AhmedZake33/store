<template>
  <b-row v-if="hasPermission('access_excuse')">
    <b-col cols="12">
      <b-card style="max-width: 100%; text-transform: capitalize" class="mb-2">
        <b-card-header style="padding: 15px 0 !important">
          <b-col class="col-md-4" style="font-size: 14px">
            <h4>
              {{ $i18n.locale == "en" ? "excuse" : "عذر" }}
            </h4>
          </b-col>
          <b-col
            class="xs_mini col-8"
            :style="$i18n.locale == 'ar' ? 'text-align: left' : 'text-align: right'"
          >
            <b-button-group>
              <b-button
                class="btn-icon xs"
                @click="status(3)"
                variant="warning"
                v-if="items.status.id == 1"
              >
                <span>
                  {{ $i18n.locale == "en" ? "Accept" : "موافقة" }}
                </span>
              </b-button>
              <b-button
                class="btn-icon"
                @click="status(4)"
                variant="primary"
                v-if="items.status.id == 3"
              >
                <span>
                  {{ $i18n.locale == "en" ? "Approve" : "قبول" }}
                </span>
              </b-button>
              <b-button
                class="btn-icon xs"
                @click="status(6)"
                variant="secondary"
                v-if="
                  items.status.id == 3 || items.status.id == 4 || items.status.id == 5
                "
              >
                <span>
                  {{ $i18n.locale == "en" ? "Reset" : "اعادة تعيين" }}
                </span>
              </b-button>
              <b-button
                class="btn-icon"
                @click="status(5)"
                variant="danger"
                v-if="items.status.id == 1 || items.status.id == 3"
              >
                <span>
                  {{ $t("reject") }}
                </span>
              </b-button>
            </b-button-group>
          </b-col>
        </b-card-header>

        <b-card-body style="padding: 0 !important">
          <div
            v-if="loading"
            style='
              position: absolute;
              width: 100%;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              background-color: #fff;
              opacity: 0.8;
              text-align: center;
              z-index: 999;
            '
          >
            <b-spinner
              variant="primary"
              style="position: absolute; top: 40px; z-index: 1000"
            />
          </div>
          <list v-else :data="items" style="padding: 0 !important" :only="[]">
            <template #custom_show>
              <tr>
                <th scope="row" :width="'15%'">
                  {{ $t("Global.student") }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <strong v-if="items.user">
                        <b-link
                          :to="{ name: 'user-show', params: { id: items.user.id } }"
                        >
                          {{
                            $i18n.locale == "ar"
                              ? items.user.name_local
                              : items.user.name
                          }}
                        </b-link>
                      </strong>
                      <div v-else>_</div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'15%'">
                  {{ $t("Global.excuse_type") }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div v-if="items.excuse_type">
                        {{ items.excuse_type.name }}
                      </div>
                      <div v-else>_</div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'15%'">
                  {{ $t("Global.Offerings") }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <span v-if="items.offerings && items.offerings.length > 0">
                          <p v-for="item in items.offerings" :key="item.id">
                            {{ item.course.name }}
                          </p>
                        </span>
                        <div v-else>_</div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'15%'">
                  {{ $t("Global.term") }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div v-if="items.term">
                        {{ items.term.name }}
                      </div>
                      <div v-else>_</div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'15%'">
                  {{ $t("Global.year") }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div v-if="items.year">
                        {{ items.year.start_year + "/" + items.year.end_year }}
                      </div>
                      <div v-else>_</div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'15%'">
                  {{ $t("Global.reason") }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div v-if="items.reason">
                        {{ items.reason }}
                      </div>
                      <div v-else>_</div>
                    </div>
                  </div>
                </td>
              </tr>
              
              <tr>
                <th scope="row" :width="'15%'">
                  {{ $t("Global.status") }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex" >
                    <div class="d-flex flex-wrap">
                      <b-badge
                        pill
                        :variant="`${getExcuseStatus(items.status.id).color}`"
                        class="text-capitalize"
                      >
                        {{
                          items.status.name
                        }}
                      </b-badge>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'15%'">
                  {{ $t("Global.supported_document") }}
                </th>
                <td class="d-flex flex-wrap">
                  <div v-if="items.documents && items.documents.length > 0">
                    <span v-for="document in items.documents" :key="document.id">
                      <a
                        class="text-capitalize"
                        style="cursor: pointer"
                        target="_blank"
                        :href="document.url"
                      >
                        <feather-icon
                          icon="FileIcon"
                          size="18"
                          class="align-middle text-body"
                        />
                        {{ document.title }}
                      </a>
                    </span>
                  </div>
                  <div v-else>_</div>
                </td>
              </tr>
            </template>
          </list>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  BCard,
  BCol,
  BRow,
  BLink,
  BOverlay,
  BSpinner,
  BCardHeader,
  BCardBody,
  BFormGroup,
  BButtonGroup,
  BFormInput,
  BForm,
  BBadge,
} from "bootstrap-vue";
import form from "@/store/modules/quality/forms/form";
import List from "@/views/components/info/list";

export default {
  name: "Show",
  components: {
    BCard,
    BCol,
    BRow,
    BLink,
    List,
    BOverlay,
    BSpinner,
    BCardHeader,
    BCardBody,
    BFormGroup,
    BFormInput,
    BForm,
    BButtonGroup,
    BBadge,
  },
  computed: {
    ...mapGetters({
      loading: "excuses/load",
      lookups: "excuses/lookups",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },

    classObject() {
      const isEnglish = this.$i18n.locale === "en";
      return {
        "flex-class-end": this.$i18n.locale === "en",
        "flex-class-start": this.$i18n.locale === "ar",
      };
    },
    classObject2() {
      const isEnglish = this.$i18n.locale === "en";
      return {
        "align-item-left": this.$i18n.locale === "en",
        "align-item-right": this.$i18n.locale === "ar",
      };
    },
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // this.$store.dispatch("excuses/excuses");
      this.getItem(this.id).then((res) => {
        this.items = res.data;
      });
    },

    ...mapActions({
      getItem: "excuses/get",
      updateExc: "excuses/put",
    }),

    status(status_id) {
      if (status_id == 6) {
        status_id = 1;
      }
      this.$store
        .dispatch("excuses/updateStatus", {
          query: { status: status_id },
          id: this.items.id,
        })
        .then((_) => {
          this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.init();
        });
    },

    getExcuseStatus(id){
        if(id == 1){
            return{
                color: 'primary',
                name: 'New'
            }
        }else if(id == 3){
            return{
                color: 'warning',
                name: 'Accepted'
            }
        }else if(id == 4){
            return{
                color: 'success',
                name: 'Approved'
            }
        }else if(id == 5){
            return{
                color: 'danger',
                name: 'Rejected'
            }
        }else if(id == 6){
            return{
                color: 'danger',
                name: 'Canceled'
            }
        }
    },
  },
};
</script>

<style scoped>
.flex-class-start {
  justify-content: flex-start;
}

.flex-class-end {
  justify-content: flex-end;
}

.align-item-right {
  text-align: right;
}

.align-item-left {
  text-align: left;
}
</style>
