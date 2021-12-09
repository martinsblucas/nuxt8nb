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

      <div style="width: 800px; height: 800px" ref="map"></div>

      <div v-for="review in reviews" :key="review.objectID">
        <img :src="review.reviewer.image" /><br />
        {{ review.reviewer.name }}<br />
        {{ formatDate(review.date) }}<br />
        <ShortText :text="review.comment" :target="150" />
      </div>

      <img :src="user.image" /><br />
      {{ user.name }}
      {{ formatDate(user.joined) }}<br />
      {{ user.reviewCount }}<br />
      {{ user.description }}
    </div>
  </div>
</template>

<script>
import ShortText from "../../components/ShortText.vue";
export default {
  components: { ShortText },
  head() {
    const head = {};

    if (this.home) head.title = this.home.title;

    return head;
  },

  data: () => ({
    home: null,
    reviews: [],
    user: null
  }),

  async asyncData({ params, $dataApi, error }) {
    const responses = await Promise.all([$dataApi.getHome(params.id), $dataApi.getReviewsByHomeId(params.id), await $dataApi.getUserByHomeId(params.id)])
    const badResponse = responses.find((response) => !response.ok)
    if(badResponse)
      return error({
        statusCode: badResponse.status,
        message: badResponse.statusText,
      });

    return { home: responses[0].json, reviews: responses[1].json.hits, user: responses[2].json.hits[0] };
  },

  mounted() {
    if (!this.home || !this.$refs.map) return;
    else
      this.$maps.showMap({
        canvas: this.$refs.map,
        lng: this.home._geoloc.lng,
        lat: this.home._geoloc.lat,
      });
  },

  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
        day: "numeric",
      });
    },
  },
};
</script>