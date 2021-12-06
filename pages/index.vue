<template>
  <div>
    <div
      v-for="home in homes"
      :key="home.objectID"
      style="float: left; margin: 10px"
    >
      <nuxt-link :to="{ name: 'home-id', params: { id: home.objectID } }"
        ><HomeCard :home="home"></HomeCard
      ></nuxt-link>
    </div>
  </div>
</template>

<script>
import homes from "~/data/homes";

export default {
  name: "index",
  head: () => ({
    title: "Homepage",
    meta: [
      {
        name: "description",
        value: "This is a homepage!",
        hid: "description",
      },
    ],
  }),
  data: () => ({
    homes: homes.slice(0, 3),
  }),
};
</script>
