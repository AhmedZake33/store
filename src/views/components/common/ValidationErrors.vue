<template>
  <span v-if="frontendErrors && frontendErrors.length">
    <small
        class="text-danger"
        v-for="(error,index) in frontendErrors"
        :key="index"
    >
      {{  defaultMessage ? validationMessages(null) : validationMessages(error) }}<br>
    </small>
    <!-- <small class="text-danger">{{ validation(null, 0).message }}</small> -->
  </span>
  <span v-else-if=" backendErrors && backendErrors.length">
     <small
         class="text-danger"
     >
      {{ backendErrors }}
    </small>
  </span>
</template>

<script>

export default {
  name: 'ValidationErrors',
  props: {
    backendErrors: null,
    frontendErrors: null,
    defaultMessage:Boolean,
    noAlert:Boolean
  },
  watch:{
    backendErrors(){
      if(this.backendErrors && !this.noAlert){
        this.errorToast(this.$t('check_form_errors'))
      }
    },
  }
}
</script>

<style scoped></style>
