<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <v-app id="inspire">
    <v-navigation-drawer
      class="pt-4"
      color="grey-dark"
      model-value
      rail
    >
      <v-avatar
        v-for="n in 1"
        :key="n"
        :color="`grey-${n === 1 ? 'darken' : 'lighten'}-1`"
        :size="n === 1 ? 36 : 20"
        class="d-block text-center mx-auto mb-9"
      ></v-avatar>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
