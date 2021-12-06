<template>
  <div>
    <img :src="home.images[0]" style="width: 200px" /><br />
    {{ home.title }}<br />
    {{ home.location.address }} {{ home.location.city }}<br />
    {{ home.guests }} guests<br />
    {{ home.pricePerNight }} / per night<br />
  </div>
</template>

<script>
export default {
  props: {
    home: {
      type: Object,
      required: true,
    },
  },
};
</script>
