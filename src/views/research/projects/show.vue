<template>
  <b-row v-if="project">
    <b-col cols="12" xl="12" lg="12" md="12">
      <b-card>
        <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
          <b-tab>
            <template #title>
              <feather-icon icon="InfoIcon"/>
              <span>{{ $t('Project Information') }}</span></template
            >
            <div class="d-flex justify-content-end align-items-center" v-if="id">
              <div class="mb-2">
                <feather-icon @click="$emit('toEditProject', id)" style="cursor: pointer"
                              icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')"/>
              </div>
            </div>
            <table class="table table-striped custom_table text_nobreak">
              <tbody style="text-align: initial">
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Title`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                          <span>
                            {{ project.title }}
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Reference Number`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                          <span>
                            {{ project.reference_number }}
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Description`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                          <span>
                            {{ project.description }}
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Location`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                          <span>
                            {{ project.location }}
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Room Number`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                        <span>
                          {{ project.room }}
                        </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Surface Area`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                        <span>
                          {{ project.surface_area }}
                        </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Amount`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                          <span>
                            {{ project.amount }}
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Mobility`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                          <span>
                            {{ project.mobility }}
                          </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Attachment Files`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                        <span>
                          {{ project.duration }}
                        </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Department`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                        <span v-if="project.department_id">
                          {{ departments[project.department_id].name }}
                        </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Organizations`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <template v-for="(organization, i) in project.organizations">
                            <span>
                              {{ (i > 0 ? ', ' : '') + organization.organization.name }}
                            </span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </b-tab>

          <b-tab>
            <template #title>
              <feather-icon icon="UsersIcon"/>
              <span>{{ $t('Teammates') }}</span></template
            >
            <div class="d-flex justify-content-end align-items-center" v-if="id">
              <div class="mb-2">
                <feather-icon @click="$emit('toEditProject', id)" style="cursor: pointer"
                              icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')"/>
              </div>
            </div>
            <table class="table table-striped custom_table text_nobreak">
              <tbody style="text-align: initial">
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`PIs`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <template v-for="(pi, i) in project.pis">
                            <span class="text-success">
                              {{ (i > 0 ? ', ' : '') + pi.user.name }}
                            </span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Team`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <template v-for="(member, i) in project.team">
                            <span class="text-primary">
                              {{ (i > 0 ? ', ' : '') + member.user.name }}
                            </span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Partners`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <template v-for="(partner, i) in project.partners">
                            <span class="text-secondary">
                              {{ (i > 0 ? ', ' : '') + partner.user.name }}
                            </span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </b-tab>

          <b-tab>
            <template #title>
              <feather-icon icon="BookOpenIcon"/>
              <span>{{ $t('Publications') }}</span></template
            >
            <div class="d-flex justify-content-end align-items-center" v-if="id">
              <div class="mb-2">
                <feather-icon @click="$emit('toEditProject', id)" style="cursor: pointer"
                              icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')"/>
              </div>
            </div>
            <table class="table table-striped custom_table text_nobreak">
              <tbody style="text-align: initial">
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t(`Publications`) }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <template v-for="(publication, i) in project.publications">
                            <span>
                              {{ (i > 0 ? ', ' : '') + publication.publication.title }}
                            </span>
                            </template>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {BTab, BTabs, BCardText, BCard, BCol, BRow, BLink} from 'bootstrap-vue';

export default {
  name: 'show-project',
  components: {BTab, BTabs, BCardText, BCard, BCol, BRow, BLink},
  props: {
    project_id: null,
  },
  computed: {
    ...mapGetters({
      item: 'projects/item',
      load: 'projects/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : this.project_id;
    },
  },
  data() {
    return {
      edit: false,
      project: null,
      query: {
        faculty_departments: true,
      },
      departments: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      lookups: 'app/GET_LOOKUPS',
      getItem: "projects/get",
    }),
    init(id) {
      if (this.id || id) {
        this.getItem(this.id).then((_) => {
          this.project = this.item;
        })
        if (this.$route.query.inline && this.$route.query.inline != 'false') {
          this.edit = true;
        }
      } else {
        this.edit = true;
      }
      this.lookups(this.query).then(res => {
        this.departments = res.success.faculty_departments;
      })
    },
  },
};
</script>

<style scoped></style>
