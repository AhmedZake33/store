<template>
    <div class="media-list media-bordered">
        <b-media class="d-flex justify-content-between align-items-center" vertical-align="top"
                 v-for="(item , i) in items" :key="i" v-if="item.user">
            <template #aside>
                <b-avatar size="35" :text="avatarText(item.user.name)" :src="user_photo(item.user.id)"/>
            </template>
            <b-row class="d-flex justify-content-between">
                <b-col md="3" class="d-flex m-0 align-content-center">
                    <div v-if="$i18n.locale == 'ar'">{{item.user.name_local}}</div>
                    <div v-else>{{item.user.name}}</div>
                </b-col>

                <b-col md="3" v-if="item.status">
                    <div v-if="$i18n.locale == 'ar'">{{item.status.message_local || item.status.message}}</div>
                    <div v-else>{{item.status.message || item.status.message_local}}</div>
                    <div v-if="item.note" class="font-weight-bolder">({{item.note}})</div>
                </b-col>

                <b-col md="3">
                    <b-badge class="mx-1" variant="primary" v-if="$i18n.locale == 'ar'">
                        {{item.status.name_local}}
                    </b-badge>
                    <b-badge class="mx-1" variant="primary" v-else>
                        {{item.status.name}}
                    </b-badge>
                </b-col>
                <b-col md="3">
                    <span class="font-small-3">{{toLocalDatetime(item.created_at , $i18n.locale , true)}}</span>
                </b-col>
            </b-row>
        </b-media>
    </div>

</template>

<script>
    import {BMedia, BImg, BAvatar, BRow, BCol, BBadge} from 'bootstrap-vue'

    export default {
        name: "history",
        components: {
            BMedia,
            BImg,
            BAvatar,
            BBadge,
            BRow,
            BCol
        },
        props: {
            items: []
        }
    }
</script>

<style scoped>

</style>