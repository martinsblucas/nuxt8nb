<template>
  <div class="app-search-results-page">
    <div class="app-search-results">
      <div class="app-search-results-listing">
        <h2 class="app-title">Stays in {{ label }}</h2>

        <template v-if="homes.length">
        <nuxt-link
          v-for="home in homes"
          :key="home.objectID"
          :to="{ name: 'home-id', params: { id: home.objectID } }"
        >
          <HomeRow
            :home="home"
            @mouseover.native="hightlightMarker(home.objectID, true)"
            @mouseout.native="hightlightMarker(home.objectID, false)"
          />
        </nuxt-link>
        </template>

        <template v-else>
          No results
        </template>
      </div>

      <div class="app-search-results-map">
        <div class="app-map" ref="map"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Homes around ${this.label}`,
    };
  },

  mounted() {
    this.updateMap();
  },

  async beforeRouteUpdate(to, from, next) {
    const location = {
      label: to.query.label,
      lat: to.query.lat,
      lng: to.query.lng,
      start: to.query.start,
      end: to.query.end,
    };
    const data = await this.$dataApi.getHomesByLocation(location);
    this.label = location.label;
    this.lat = location.lat;
    this.lng = location.lng;
    this.homes = data.json.hits;
    this.updateMap();
    next();
  },

  async asyncData({ query, $dataApi }) {
    const location = {
      label: query.label,
      lat: parseFloat(query.lat),
      lng: parseFloat(query.lng),
    };
    const data = await $dataApi.getHomesByLocation(location);
    location.homes = data.json.hits;
    return location;
  },

  methods: {
    hightlightMarker(homeId, isHighlighted) {
      document
        .getElementsByClassName(`home-${homeId}`)[0]
        ?.classList?.toggle("marker-highlight", isHighlighted);
    },

    updateMap() {
      this.$maps.showMap({
        canvas: this.$refs.map,
        lng: this.lng,
        lat: this.lat,
        markers: this.getHomeMarkers(),
      });
    },

    getHomeMarkers() {
      return this.homes.map((home) => ({
        ...home._geoloc,
        price: home.pricePerNight,
        id: home.objectID,
      }));
    },
  },
};
</script>

<style>
.marker {
  background-color: #fff;
  border: 1px solid lightgray;
  font-weight: bold;
  border-radius: 20px;
  padding: 5px 8px;
}

.marker-highlight {
  color: white !important;
  background-color: black;
  border-color: black;
}
</style>