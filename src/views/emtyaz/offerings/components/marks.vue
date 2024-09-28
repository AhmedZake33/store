<template>
  <div>
    <div>
      <b-form
        ref="form"
        :style="{height: trHeight}"
        class="repeater-form"
        @submit.prevent="repeateAgain"
      >
        <!-- Row Loop -->
        <b-row
          v-for="(item, index) in items"
          :id="item.id"
          :key="item.id"
          ref="row"
        >

          <!-- Grade Category -->
          <b-col md="4">
            <b-form-group
              label="Grade Category"
            >
              <v-select
                v-model="form.grade_category_id"
                :options="lookups.grade_categories"
                class="w-100"
                :reduce="val => val.id"
                :label="getSelectLabel()"
              />
            </b-form-group>
          </b-col>

          <!-- Grade Item -->
          <b-col md="4">
            <b-form-group
              label="Grade Item"
            >
              <v-select
                v-model="form.grade_item_id"
                :options="lookups.grade_items"
                class="w-100"
                :reduce="val => val.id"
                :label="getSelectLabel()"
              />
            </b-form-group>
          </b-col>

          <!-- Max Grade -->
          <b-col md="2">
            <b-form-group
              label="Max Grade"
              label-for="quantity"
            >
              <b-form-input
                id="quantity"
                type="number"
                placeholder="1"
              />
            </b-form-group>
          </b-col>

          <!-- Remove Button -->
          <b-col
            lg="2"
            md="3"
            class="mb-50"
          >
            <b-button
              v-ripple.400="'rgba(234, 84, 85, 0.15)'"
              variant="outline-danger"
              class="mt-0 mt-md-2"
              @click="removeItem(index)"
            >
              <feather-icon
                icon="XIcon"
                class="mr-25"
              />
              <span>Delete</span>
            </b-button>
          </b-col>
        </b-row>

      </b-form>
    </div>
    <b-col cols="12">
      <hr>
    </b-col>
    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
      @click="repeateAgain"
    >
      <feather-icon
        icon="PlusIcon"
        class="text-md-right"
      />
    </b-button>
  </div>
</template>

<script>
import {
  BForm, BFormGroup, BFormInput, BRow, BCol, BButton,
} from 'bootstrap-vue'
import { heightTransition } from '@core/mixins/ui/transition'
import Ripple from 'vue-ripple-directive'
import { mapGetters, mapActions } from 'vuex'
import vSelect from 'vue-select'

export default {
  components: {
    BForm,
    BRow,
    BCol,
    BButton,
    BFormGroup,
    BFormInput,
    vSelect,

  },
  directives: {
    Ripple,
  },
  mixins: [heightTransition],
  data() {
    return {
      items: [{
        id: 1,
        selected: 'male',
        selected1: 'designer',
        prevHeight: 0,
      }],
      lookups: [],
      lookupModules: {
        terms: true,
        faculties: true,
        bylaws: true,
        programs: true,
        grade_categories: true,
        grade_items: true,
      },
      list_categories: [],

      form: {},
      nextTodoId: 2,
    }
  },
  mounted() {
    this.init()
    this.initTrHeight()
  },
  created() {
    window.addEventListener('resize', this.initTrHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.initTrHeight)
  },
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
      submitItem: 'offerings/add',
      getOfferings: 'offerings/offerings',
    }),
    init() {
      this.getLookups(this.lookupModules).then(data => {
        this.lookups = data.success
        //this.list_categories = this.lookups.grade_categories
      })
    },
    repeateAgain() {
      this.items.push({
        id: this.nextTodoId += this.nextTodoId,
      })

      this.$nextTick(() => {
        this.trAddHeight(this.$refs.row[0].offsetHeight)
      })
    },
    removeItem(index) {
      this.items.splice(index, 1)
      this.trTrimHeight(this.$refs.row[0].offsetHeight)
    },
    initTrHeight() {
      this.trSetHeight(null)
      this.$nextTick(() => {
        this.trSetHeight(this.$refs.form.scrollHeight)
      })
    },
    getSelectLabel() {
      return this.$i18n.locale === 'en' ? 'name' : 'name_local'
    },
  },
}
</script>

<style lang="scss" scoped>
.repeater-form {
  overflow: hidden;
  transition: .35s height;
}
</style>
