<template>
  <div>
    {{ lat }} / {{ lng }} / {{ label }}
    <div v-for="home in homes" :key="home.objectID">
      {{ home.title }}
    </div>
  </div>
</template>

<script>
export default {
  async beforeRouteUpdate(to, from, next) {
    const location = {
      label: to.query.label,
      lat: to.query.lat,
      lng: to.query.lng,
    };
    const data = await this.$dataApi.getHomesByLocation(location);
    this.label = location.label
    this.lat = location.lat
    this.lng = location.lng
    this.homes = data.json.hits
    next()
  },

  async asyncData({ query, $dataApi }) {
    const location = {
      label: query.label,
      lat: query.lat,
      lng: query.lng,
    };
    const data = await $dataApi.getHomesByLocation(location);
    location.homes = data.json.hits;
    return location;
  },
};
</script>