<template>
  <div>
    <header style="background-color: #eee; margin-bottom: 20px">
      <nuxt-link :to="{ name: 'index' }">Home</nuxt-link>
      <input type="text" ref="citySearch" @changed="changed" />
    </header>
    <nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$refs.citySearch);
    this.$maps.makeAutoComplete(this.$refs.citySearch);
  },

  methods: {
    changed(event) {
      const place = event.detail;
      if (!place.geometry) return;

      this.$router.push({
        name: "search",
        query: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          label: this.$refs.citySearch.value,
        },
      });
    },
  },
};
</script>