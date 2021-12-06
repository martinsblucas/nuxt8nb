<template>
  <div>
    <div v-if="home">
      <div style="display: flex">
        <img
          v-for="image in home.images"
          :key="image"
          :src="image"
          width="200"
          height="150"
        />
      </div>
      {{ home.title }}<br />
      ${{ home.pricePerNight }} / night<br />
      <img src="/images/marker.svg" width="20" height="20" />{{
        home.location.address
      }}
      {{ home.location.city }} {{ home.location.state }}
      {{ home.location.country }}<br />
      <img src="/images/star.svg" width="20" height="20" />{{
        home.reviewValue
      }}
      <br />
      {{ home.guests }} guests, {{ home.bedrooms }} rooms, {{ home.beds }} beds,
      {{ home.bathrooms }} bath<br />
    </div>
  </div>
</template>

<script>
import homes from "~/data/homes";

export default {
  head() {
    if (this.home)
      return {
        title: this.home.title,
      };

    return {}
  },

  data: () => ({
    home: null,
  }),

  created() {
    const home = homes.find((home) => home.objectID == this.$route.params.id);
    if (!home) this.$nuxt.error({message: "This page could not be found", statusCode: 404})
    else this.home = home;
  },
};
</script>