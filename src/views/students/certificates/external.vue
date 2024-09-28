<template>
  <b-row>
    <b-col  cols="8" >
    <b-card title="Student Data"
          tag="article"
          style="max-width: 70rem; text-transform: capitalize;"
          class="mb-2"
      >
        <list
          :data="items"
          :only="[]"
        >
          <template #custom_show>
            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.local_name') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>

                            {{ items.external_data.arabic_name }}

                          </span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.english_name') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>
                            {{ items.external_data.english_name }}
                          </span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'10%'"
                style="width: 10%"
              >
                {{ $t('Global.email') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>
                            {{(items.external_data.email) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.phone') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span> {{ items.external_data.mobile }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.graduation_year') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>
                            {{ items.external_data.graduation_year }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.student_code') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>{{ items.external_data.student_code }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.faculty') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>{{ items.assigend_program.bylaw.faculty.name }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.bylaw') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>{{ items.assigend_program.bylaw.name }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.program') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span> {{ items.assigend_program.name }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.apply_to') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span> {{ items.external_data.apply_to }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.certificates') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span
                            v-for="(service,index) in items.services"
                            :key="index"
                          >
                            {{ service.name }} ({{ service.quantity }}) -
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

          </template>
        </list>
      </b-card>
    </b-col>
    <b-col
      v-if="!items.user"
      cols="4"
    >
      <b-card style="height:354px;overflow:auto">
        <label>Select Student</label>
        <b-row>
          <b-col md="12">
            <div class="d-flex">
              <b-form-input
                v-model="search"
                class="d-inline-block mb-2"
                placeholder="Search..."
                style="width: 100%;"
              />

            </div>
          </b-col>
          <b-col
            v-if="!loading "
            md="12"
          >
            <!-- draggable -->
            <b-list-group
              :list="students"
              tag="ul"
              group="people"
              class="list-group list-group-flush "
            >
              <b-list-group-item
                v-for="(listItem, index) in students"
                :key="index"
                tag="li"
              >
                <div class="d-flex">
                  <div class="ml-25 d-flex justify-content-between w-100">
                    <div>
                      <b-card-text class="mb-0 font-weight-bold">
                        {{ listItem.user.name ? listItem.user.name : listItem.user.name_local }}
                      </b-card-text>
                    </div>
                    <b-button
                      v-ripple.400="'rgba(40, 199, 111, 0.15)'"
                      variant="flat-primary"
                      class="btn-icon"
                      @click="updateStudent(listItem.user.id)"
                    >
                      <feather-icon icon="PlusCircleIcon" />
                    </b-button>
                  </div>

                </div>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <b-col
            v-else
            md="12"
          >
            <div
              class="d-flex justify-content-center align-items-center mb-1"
              style="width: 100%;height: 100%"
            >
              <b-spinner :label="$t('Global.loading')" />
            </div>
          </b-col>
        </b-row>
      </b-card>

    </b-col>
    <b-col
      v-else
      cols="6"
    >
      <b-card
        title="Request Information"
        tag="article"
        style="max-width: 70rem; text-transform: capitalize;"
        class="mb-2"
      >
        <list
          :data="items.user"
          :only="[]"
          title="Chosen Student"
        >
          <template #custom_show>
            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.local_name') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>

                            {{ items.user.name_local }}

                          </span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.english_name') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>
                            {{ items.user.name }}
                          </span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.email') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>
                            ....
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.phone') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span> {{ items.external_data.phone }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.graduation_year') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>{{ items.graduation_year ? items.graduation_year.migration_year : '-' }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.student_code') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>{{ items.user.code }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.faculty') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>{{ items.student_program.bylaw.faculty.name }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.bylaw') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>{{ items.student_program.bylaw.name }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th
                scope="row"
                :width="'40%'"
              >
                {{ $t('Global.program') }}
              </th>
              <td
                class="d-flex flex-wrap"
              >
                <div
                  class="d-flex"
                >
                  <div
                    class="d-flex flex-wrap"
                  >
                    <div>
                      <div
                        class="d-flex flex-wrap"
                      >
                        <div>
                          <span>{{ items.student_program.name }}</span>
                          <span />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

          </template>
        </list>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  BCard, BCol, BRow, BLink, BFormInput, BListGroup, BListGroupItem, BSpinner
} from 'bootstrap-vue'
import form from '@/store/modules/quality/forms/form'
import List from '@/views/components/info/list'

export default {
  name: 'Show',
  components: {
    BCard, BCol, BRow, BLink, List, BFormInput, BListGroup, BListGroupItem, BSpinner
  },
  data() {
    return {
      fields: [
        'created_at',
        'status',
      ],
      items: [],
      form: {
        user_id: null,
        service_id: null,
        status: null,
      },
      search: '',
    }
  },
  computed: {
    ...mapGetters({
      students: 'students/items',
      loading: 'students/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    query() {
      const data = {
        query: { keywords: this.search },
      }
      return data
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getItem(this.id)
        .then(res => {
          this.items = res.data[0];
          this.items.services = JSON.parse(res.data[0].external_data.services)
          this.items.pdf = res.data[1].pdf
        })
    },
    ...mapActions({
      getItem: 'certificates/get',
      getStudent: 'students/search',
      updateCertificate: 'certificates/updateStudent',
    }),
    status(value) {
      this.form = {
        user_id: this.items.user.id,
        service_id: this.items.service.id,
        quantity: this.items.quantity,
        status: value,
        apply_to: this.items.apply_to ? this.items.apply_to : '-',
      }
      const payload = {
        id: this.id,
        query: this.form,
      }
      this.$store.dispatch('certificates/put', payload)
        .then(response => {
          this.items.status = response.data.status
          this.items.reviewer = response.data.reviewer
          this.items.prepared_by = response.data.prepared_by
          this.items.approved_by = response.data.approved_by
          this.$swal({
            icon: 'success',
            title: `${this.$t('Global.saved')}`,
            showConfirmButton: false,
            timer: 1500,
          })
        })
    },
    updateStudent(value) {

      // let queryData={...this.query,id:this.id,student:value}
      const queryData = { id: this.id, query: { user_id: value } }
      this.updateCertificate(queryData).then(res => {
        res.status == 'success'
          ? this.$swal({
            icon: 'success',
            title: `${this.$t('Global.saved')}`,
            showConfirmButton: false,
            timer: 1500,
          })
          : this.$swal({
            icon: 'error',
            title: 'Something went Wrong',
            text: '',
            showConfirmButton: false,
            timer: 1500,
          })
      })
      this.$router.go(-1)
    },
  },
  watch: {
    search(val) {
      if (val.length > 2) {
        this.getStudent(this.query)
      }
    },
  },
}

</script>

<style scoped></style>
