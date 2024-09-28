<template>
  <multiselect
    :multiple="true"
    track-by="name"
    label="name"
    group-values="tags"
    :placeholder="$t('Tags')"
    group-label="label"
    v-model="value"
    @input="addStatus"
    :closeOnSelect="false"
    :options="options"
  >
    {{ setStatus(options) }}
    <template slot="placeholder">
      <span>{{ placeholder ? placeholder : $t('Tags') }}</span>
    </template>
    <template slot="option" slot-scope="props">
      <span
        :style="{
          'border-left-color': getColor(props.option.$groupLabel),
          'color': getColor(props.option.$groupLabel),
        }"
        v-if="props.option.$groupLabel"
        style="border-left: 3px solid; padding-left: 10px"
      >
        {{ getLabel(props.option.$groupLabel) }}
      </span>
      <li id="null-1" role="option" class="multiselect__element">
        <span class="multiselect__option"
          ><span>{{ props.option.name }}</span></span
        >
      </li>
    </template>
    <template slot="tag" slot-scope="{ option, search }">
      <span :style="{ backgroundColor: option.color }" class="multiselect__tag"
        ><span>{{ option.name }}</span>
        <i
          @click="remove(option)"
          tabindex="1"
          class="multiselect__tag-icon"
        ></i
      ></span>
    </template>
    <template slot="caret">
      <div class="vs__actions">
        <button
          type="button"
          title="Clear Selected"
          aria-label="Clear Selected"
          class="vs__clear"
          style="display: none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14px"
            height="14px"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-x"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15px"
          height="15px"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-chevron-down open-indicator vs__open-indicator"
          role="presentation"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <div class="vs__spinner" style="display: none">Loading...</div>
      </div>
    </template>
  </multiselect>
</template>

<script>
import Multiselect from "vue-multiselect";
export default {
  components: {
    Multiselect,
  },
  props: {
    options: Array,
    placeholder: String,
    filter: Array,
    paramName:String
  },
  data() {
    return {
      value: null,
      run: false,
    };
  },
  watch: {
    filter(val) {
      if (val == null) {
        this.value = null;
      }
    },
  },
  computed: {
    tags() {
      let allTags = [];
      if (this.options) {
        this.options.forEach((element, i) => {
          allTags.push(element.tags);
        });
      }
      return allTags.flat(1);
    },
  },
  methods: {
    setStatus() {
      if (this.$route.query[this.paramName?this.paramName:'status'] && this.tags && !this.run) {
        if (this.$route.query[this.paramName?this.paramName:'status'].length) {
          this.value = this.tags.filter((x) =>
            this.$route.query[this.paramName?this.paramName:'status'].includes(String(x.id))
          );
        } else {
          this.value = this.tags.filter(
            (x) => this.$route.query[this.paramName?this.paramName:'status'] == x.id
          );
        }
        this.run = true;
      }
    },
    addStatus(value) {
      this.$emit("addStatus", value);
    },
    remove(removedOption) {
      const objWithIdIndex = this.value.findIndex(
        (obj) => obj.id === removedOption.id
      );
      if (objWithIdIndex > -1) {
        this.value.splice(objWithIdIndex, 1);
      }
      this.$emit("remove", removedOption);
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
.multiselect__element:not([role="option"]) {
  background: #e4e4e4;
}
.multiselect__option--disabled {
  background: transparent !important;
  font-weight: bolder;
}
.multiselect__placeholder {
  margin-top: 4px;
  color: #948f8c;
  margin-inline-start: 8px;
}
.multiselect__tags {
  padding: 3px 40px 0 8px;
  border-color: #d8d6de;
}
.multiselect__tag {
  margin-top: 4px;
  margin-right: 4px;
}
.multiselect .vs__actions {
  right: 1px;
  top: 7px;
  position: absolute;
}
.multiselect__option {
  font-weight: unset !important;
  padding: 3px 20px;
  min-height: unset;
  line-height: 1.8;
  font-size: 15px;
}
.multiselect__option.multiselect__option--disabled.multiselect__option--group {
  font-weight: 700 !important;
  color: #000 !important;
  padding: 3px 15px;
  border-bottom: 1px solid #dfdfdf;
}
.multiselect__option--highlight {
  background: rgba(5, 73, 120, 0.12);
  color: #054978;
  // padding: 3px 20px;
  clear: both;
}
.multiselect__option--highlight::after {
  content: none !important;
  width: 0;
}
.multiselect__option.multiselect__option--selected {
  background-color: #054978;
  display: flex;
  align-items: center;
  color: #fff;
}
.multiselect__option.multiselect__option--selected::after {
  content: none;
}
.multiselect__option.multiselect__option--highlight.multiselect__option--selected {
  background-color: #054978;
  display: flex;
  align-items: center;
  color: #fff;
}
.multiselect__input {
  margin-bottom: 0;
  margin-top: 7px;
  padding-left: 0;
  font-size: 14px;
  &::placeholder {
    color: #8b8682;
    opacity: 1;
  }
}
[dir=rtl] .multiselect__input{
  right: 10px;
}
[dir=ltr] .multiselect__input{
  left: 10px;
}
</style>
