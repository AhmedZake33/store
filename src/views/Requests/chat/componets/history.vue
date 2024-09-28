<template>
  <div class="media-list media-bordered">
    <b-media vertical-align="top" v-for="(item, i) in items" :key="i" v-if="item.sent_by" :dir="item.sent_by.id == authUser().id ? 'ltr' : 'rtl'">
      <template #aside>
        <b-avatar size="35" :text="avatarText(item.sent_by.name)" />
      </template>
      <div class="d-flex">
        <h5 class="d-flex">
          <div v-if="$i18n.locale == 'ar'">{{ item.sent_by.name_local }}</div>
          <div v-else>{{ item.sent_by.name }}</div>
        </h5>
        <span class="font-small-3 mx-1">{{ toLocalDatetime(item.sent_at, $i18n.locale, true) }}</span>
      </div>
      <b-card-text>
        <div style="background-color: #dddddd" class="p-1 round text-left d-block">
          <span class="d-block w-100">
            {{ item.message }}
          </span>
          <div class="d-flex">
            <a class="overflow-hidden mx-1" v-for="(img , i) in item.attachements"  :key="i" target="_blank" :href="img.url" >
              <b-img  v-if="['jpg','png', 'jpeg'].includes(img.extension)" right class="mb-1 mb-sm-0 object_cover" height="120" width="120" :src="img.url" />
              <div v-else class="font-weight-bolder">{{img.name}}  </div>
            </a>
<!--            <a class="overflow-hidden mx-1" v-for="(img , i) in item.attachements" :key="i" target="_blank" :href="img.url" v-else>-->
<!--            testdddd{{img.url}}-->
<!--            </a>-->
          </div>
        </div>
      </b-card-text>
    </b-media>
    <div v-else class="d-flex justify-content-center">
        <span>{{$t('Global.noMessages')}}</span>
    </div>

    <!-- <div class="d-flex justify-content-center">
      <b-button variant="primary">{{ $t('Global.more') }}</b-button>
    </div> -->
  </div>
</template>

<script>
import { BMedia, BImg, BAvatar, BBadge, BCardText } from 'bootstrap-vue';

export default {
  name: 'history',
  components: {
    BMedia,
    BImg,
    BCardText,
    BAvatar,
    BBadge,
  },
  props: {
    items: [],
  },
};
</script>

<style scoped>
.object_cover {
  object-fit: cover;
}
</style>
