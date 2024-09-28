<template>
  <div>
    <b-card class="mb-0">
      <b-tabs vertical nav-wrapper-class="nav-hidden" align="left">
        <!-- basic info -->
        <b-tab>
          <template #title>
            <feather-icon icon="BookOpenIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template
          >
          <Edit
            v-if="edit"
            :tabNumber="0"
            :data="
              id
                ? item
                : {
                    user: '',
                    name_local: '',
                    id: '',
                    excuse_type: '',
                    offerings: '',
                    term: '',
                    year: '',
                    reason: '',
                    status: '',
                  }
            "
            @hide="cancel()"
            :inline="true"
            @refresh="init"
          >
          </Edit>
          <div v-if="item && !edit">
            <ShowComponent
              :loading="load"
              :data="item"
              :only="[
                'user',
                'name_local',
                'id',
                'excuse_type',
                'offerings',
                'term',
                'year',
                'reason',
                'status',
              ]"
            >
              <template #user="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.name_custom`) }}
                </th>
                <td>
                  {{ data.user.name }}
                </td>
              </template>
              <template #name_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_name`) }}
                </th>
                <td>
                  {{ data.user.name_local }}
                </td>
              </template>
              <template #id="{ data }">
                <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                  {{ $t(`Global.name_local`) }}
                </th>
                <td v-if="$i18n.locale == 'en'">
                  {{ data.user.name_local }}
                </td>

                <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_name`) }}
                </th>
                <td v-if="$i18n.locale == 'ar'">
                  {{ data.user.name_local }}
                </td>
              </template>
              <template #excuse_type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.excuse_type`) }}
                </th>
                <td>
                  {{
                    $i18n.locale == "ar"
                      ? data.excuse_type.name_local
                      : data.excuse_type.name
                  }}
                </td>
              </template>
              <template #offerings="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.offerings`) }}
                </th>
                <td>
                  <div>
                    <span v-if="data.offerings && data.offerings.length > 0">
                      <p v-for="item in data.offerings" :key="item.id">
                        {{ item.course.name }}
                      </p>
                    </span>
                    <div v-else>_</div>
                  </div>
                </td>
              </template>
              <template #term="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.term`) }}
                </th>
                <td>
                  <div v-if="data.term">
                    {{
                      $i18n.locale == "ar"
                        ? data.term.name_local
                        : data.term.name
                    }}
                  </div>
                  <div v-else>_</div>
                </td>
              </template>
              <template #year="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.academic_year`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div v-if="data.year">
                    {{ data.year.start_year + "/" + data.year.end_year }}
                  </div>
                  <div v-else>_</div>
                </td>
              </template>
              <template #reason="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.reason`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div v-if="data.reason">
                    {{ data.reason }}
                  </div>
                  <div v-else>_</div>
                </td>
              </template>
              <template #status="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.status`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div v-if="data.status">
                    <b-button-group>
                      <b-button
                        class="btn-icon xs"
                        @click="status(3)"
                        variant="warning"
                        v-if="item.status.id == 1"
                      >
                        <span>
                          {{ $i18n.locale == "en" ? "Accept" : "موافقة" }}
                        </span>
                      </b-button>
                      <b-button
                        class="btn-icon"
                        @click="status(4)"
                        variant="primary"
                        v-if="item.status.id == 3"
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
                          item.status.id == 3 || item.status.id == 4 || item.status.id == 5
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
                        v-if="item.status.id == 1 || item.status.id == 3"
                      >
                        <span>
                          {{ $t("reject") }}
                        </span>
                      </b-button>
                    </b-button-group>
                  </div>
                  <div v-else>_</div>
                </td>
              </template>
              <template #edit>
                <div class="mt-0 mb-1">
                  <feather-icon
                    v-if="hasPermission('edit_excuse')"
                    @click="openEdit()"
                    style="cursor: pointer"
                    icon="EditIcon"
                    class="font-medium-3"
                    v-b-tooltip.hover="$t('Global.edit')"
                  />
                </div>
              </template>
            </ShowComponent>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { BBadge, BLink, BTab, BTabs, BCard, BButtonGroup } from "bootstrap-vue";
import Offerings from "@/views/study/offerings/components/offerings";
import ShowComponent from "@/views/components/info/show";
import Edit from "@/views/study/excuses/edit";

export default {
  name: "show",
  components: {
    mapGetters,
    Offerings,
    ShowComponent,
    Edit,
    BBadge,
    BLink,
    BTab,
    BTabs,
    BCard,
    BButtonGroup
  },
  data() {
    return {
      edit: false,
    };
  },
  computed: {
    ...mapGetters({
      item: "excuses/item",
      load: "excuses/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init(id) {
      if (this.id || id) {
        this.$store.dispatch("excuses/get", this.id);
        this.edit =
          this.$route.query.inline == "false"
            ? false
            : this.$route.query.inline;
      } else {
        this.edit = true;
      }
    },
    openEdit() {
      this.edit = true;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: true,
      });
    },
    cancel() {
      this.edit = false;
      this.updateFilterQueryParams({
        tabNum: this.$route.query.tabNum || 0,
        inline: false,
      });
    },
    status(status_id) {
      if (status_id == 6) {
        status_id = 1;
      }
      this.$store
        .dispatch("excuses/updateStatus", {
          query: { status: status_id },
          id: this.item.id,
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
    getExcuseStatus(id) {
      if (id == 1) {
        return {
          color: "primary",
          name: "New",
        };
      } else if (id == 3) {
        return {
          color: "warning",
          name: "Accepted",
        };
      } else if (id == 4) {
        return {
          color: "success",
          name: "Approved",
        };
      } else if (id == 5) {
        return {
          color: "danger",
          name: "Rejected",
        };
      } else if (id == 6) {
        return {
          color: "danger",
          name: "Canceled",
        };
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
.btn-icon {
  margin: 0px 5px !important;
}
</style>
