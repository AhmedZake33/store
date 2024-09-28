<template>
    <b-card :title="title">
        <!-- <h4>Select Radius</h4>
        <input @change="setRaduis()" type="range" min="1" max="1000" value="20" class="slider" id="myRange" style="margin-bottom: 20px" /> -->
        <!-- <p style="margin-left:15px">Raduis :{{radius}} Kilometer &nbsp;<span style="color:black;font-weight:bold"> Result:{{index.length}}</span></p> -->

        <div v-if="!getLocation"
             style="z-index: 999; margin-left: 40px; margin-bottom: -40px; position: relative; text-align: center">
            <b-button style="border-radius: 50px" @click="setCategory((x = null))" variant="light">
                <feather-icon icon="" size="12"/> &nbsp;Show All
            </b-button>&nbsp;
            <b-button style="border-radius: 50px" @click="setCategory((x = 11))" variant="light">
                <feather-icon icon="TruckIcon" size="12"/> &nbsp;Car
            </b-button>&nbsp;
            <b-button style="border-radius: 50px" @click="setCategory((x = 8))" variant="light">
                <feather-icon icon="HomeIcon" size="12"/> &nbsp;Villa
            </b-button>&nbsp;
            <b-button style="border-radius: 50px" @click="setCategory((x = 7))" variant="light">
                <feather-icon icon="HomeIcon" size="12"/> &nbsp;Apartment
            </b-button>&nbsp;
        </div>
        <!-- <div v-else style="z-index: 999; margin-left: 40px; margin-bottom: -40px; position: relative; text-align: center">
          <b-button style="border-radius: 50px" @click="getCurrentLocation()" variant="light"> <feather-icon icon="" size="12" /> &nbsp;current Locatio</b-button>&nbsp;
        </div> -->
        <l-map ref="myMap" @ready="init()" :zoom="11" :center="center">
            <l-tile-layer :url="url"/>
            <l-circle :lat-lng="circle.center" :radius="circle.radius" :color="circle.color"/>
            <l-marker v-if="getLocation" :lat-lng="getCoords" @update:latLng="getBounds" draggable></l-marker>
            <l-marker v-else :lat-lng="markerLatLng" @update:latLng="getBounds" draggable></l-marker>
            <v-marker-cluster>
                <l-marker class="marker" @mouseout="closeInfo" @mouseover="openInfo($event, location)"
                          :key="location.id" v-for="location in index"
                          :lat-lng="[location.latitude, location.longitude]"/>
            </v-marker-cluster>
        </l-map>

        <!-- {{index}} -->

        <!-- test -->

        <!-- test -->
        <div class="theMainDiv my-0 mt-1 white text-black no_spacing p-0 mb-2 w-100" @mouseout="closeInfo"
             @mouseover="setWindowInfoStatus" elevation="16" max-width="600" width="500" max-height="100"
             style="padding: 0px">
<!--            <div class="img_slider bg-white rounded-top">-->
<!--                <b-img class="mr-0-5" :src="require('@/assets/images/avatars/1.png')" fluid alt="Fluid image"></b-img>-->
<!--                <b-img class="mx-0-5" :src="require('@/assets/images/avatars/1.png')" fluid alt="Fluid image"></b-img>-->
<!--                <b-img class="mx-0-5" :src="require('@/assets/images/avatars/1.png')" fluid alt="Fluid image"></b-img>-->
<!--                <b-img class="ml-0-5" :src="require('@/assets/images/avatars/1.png')" fluid alt="Fluid image"></b-img>-->
<!--            </div>-->
            <!-- {{location}} -->

            <b-card>
                <div class="d-flex justify-content-between">
                    <div class="d-flex flex-column">
                        <p class="bold mb-0"><strong>EGYPT</strong></p>
                        <small v-if="location">{{ location.city }}</small>
                        <small>Restaurant </small>
                        <small>Open until 3:00 AM</small>
                    </div>

                    <div>
                        <corner-up-right-icon @click="Direction(location.latitude, location.longitude)" size="2x"
                                              class="custom-class border_icon" color="#1a73e8"></corner-up-right-icon>
                        <bookmark-icon size="2x" @click="getData" class="custom-class border_icon ml-1"
                                       color="#1a73e8"></bookmark-icon>
                    </div>
                </div>
            </b-card>
        </div>
    </b-card>
</template>

<script>
  import BCardCode from '@core/components/b-card-code/BCardCode.vue'
  import { LMap, LTileLayer, LCircle, LMarker } from 'vue2-leaflet'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.markercluster/dist/MarkerCluster.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import { BCard, BImg, BButton, BIcon } from 'bootstrap-vue'
  import { Icon } from 'leaflet'
  import { BookmarkIcon, ArrowDownCircleIcon, CornerUpRightIcon } from 'vue-feather-icons'

  import Vue2LeafletMarkercluster from 'vue2-leaflet-markercluster'

  delete Icon.Default.prototype._getIconUrl
  Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  })

  export default {
    components: {
      LMap,
      LTileLayer,
      LCircle,
      BCardCode,
      BCard,
      LMarker,
      Icon,
      'v-marker-cluster': Vue2LeafletMarkercluster,
      BImg,
      BookmarkIcon,
      ArrowDownCircleIcon,
      CornerUpRightIcon,
      BButton,
      BIcon,
      radius: null,
    },
    props: {
      title: String,
      getLocation: Boolean,
    },
    data() {
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        zoom: 8,
        center: {
          lat: 30.975254,
          lng: 31.247197
        },
        circle: {
          center: [47.41322, -1.0482],
          radius: 4500,
          color: '#EA5455',
        },
        markerLatLng: [30.975254, 31.247197],
        location: null,
        windowInfoStatus: false,
        Category: null,
        lat: 5,
        lon: 5,
      }
    },
    methods: {
      getCurrentLocation() {
        //do we support geolocation
        if (!('geolocation' in navigator)) {
          // this.errorStr = 'Geolocation is not available.';
          return
        }
        // get position
        navigator.geolocation.getCurrentPosition(
          pos => {
            this.lat = pos.coords.latitude
            this.lon = pos.coords.longitude
            this.center = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            }
            this.gettingLocation = true
          },
          err => {
            this.gettingLocation = false
            // this.errorStr = err.message;
          }
        )
      },
      init() {
        this.map = this.$refs.myMap.mapObject
      },
      setRaduis() {
        var myRange = this.$el.querySelector('#myRange')
        this.radius = myRange.value
        this.getData()
      },
      setCategory(x) {
        this.Category = x
        this.getData()
      },
      getBounds(event) {
        if (this.getLocation) {
          this.$store.commit('location/SET_LOCATION', {
            latitude: event.lat,
            longitude: event.lng
          })
        }
        this.center = {
          lat: event.lat,
          lng: event.lng
        }
        let max = {
          lat: event.lat + 0.5,
          lng: event.lng + 0.5,
        }
        let min = {
          lat: event.lat - 0.5,
          lng: event.lng - 0.5,
        }
        this.getData(max, min)
      },
      openInfo(data, location) {
        this.location = location
        var InfoWindowDom = this.$el.querySelector('.theMainDiv')
        InfoWindowDom.classList.add('showInfo')

        InfoWindowDom.style.top = data.containerPoint.y - 200 + 'px'
        InfoWindowDom.style.left = data.containerPoint.x - 100 + 'px'
      },
      closeInfo() {
        var InfoWindowDom = this.$el.querySelector('.theMainDiv')
        InfoWindowDom.classList.remove('showInfo')
      },
      setWindowInfoStatus() {
        this.WindowInfoStatus = true
        var InfoWindowDom = this.$el.querySelector('.theMainDiv')
        InfoWindowDom.classList.add('showInfo')
      },
      Direction(x, y) {
        getData(x, y)
      },
      getData(max, min) {
        let payload = {
          category: this.Category,
          max: max,
          min: min,
        }
        if (!this.getLocation) {
          this.$store.dispatch('location/map', payload)
            .then({})
            .catch({})
        }
      },
    },
    updated() {
      this.getCurrentLocation()
    },
    computed: {
      index() {
        if (this.$store.state.location.map) {
          return this.$store.state.location.map
        }
      },
      getCoords() {
        let lat = this.lat
        let long = this.lon
        this.center = {
          lat: lat,
          lng: long
        }
        return [lat, long]
      },
    },
    mounted() {
      let max = {
        lat: this.markerLatLng[0] + 0.5,
        lng: this.markerLatLng[1] + 0.5,
      }
      let min = {
        lat: this.markerLatLng[0] - 0.5,
        lng: this.markerLatLng[1] - 0.5,
      }
      this.getData(max, min)
      // this.$nextTick(() => {
      //   this.$refs.myMap.mapObject.ANY_LEAFLET_MAP_METHOD();
      // });
    },
  }
</script>

<style lang="scss">
    .vue2leaflet-map {
        &.leaflet-container {
            height: 350px;
        }
    }

    .theMainDiv {
        position: absolute !important;
        display: none !important;
        z-index: 99999;
        max-width: 290px !important;
        max-height: auto;
    }

    .showInfo {
        display: block !important;
    }

    .img_slider::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    /* Track */
    .img_slider::-webkit-scrollbar-track {
        background: #fff;
    }

    /* Handle */
    .img_slider::-webkit-scrollbar-thumb {
        background: #888;
        visibility: hidden;
    }

    /* Handle on hover */
    .img_slider::-webkit-scrollbar-thumb:hover {
        background: #555;
        visibility: visible;
    }

    .img_slider:hover::-webkit-scrollbar-thumb {
        visibility: visible;
    }

    .border_icon {
        padding: 5px;
        border: 1px solid #1a73e8;
        border-radius: 50%;
        cursor: pointer;
    }

    .img_slider {
        overflow-x: scroll;
        display: flex;
        height: 190px;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: mandatory;
        scroll-snap-points-x: repeat(300px);
    }

    .mx-0-5 {
        margin-left: 2px;
        margin-right: 2px;
    }

    .ml-0-5 {
        margin-left: 2px;
    }

    .mr-0-5 {
        margin-right: 2px;
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 15px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #04aa6d;
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #04aa6d;
        cursor: pointer;
    }
</style>
