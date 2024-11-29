<script setup lang="ts">

interface Props {
  title: string;
  description: string;
}

const { title, description } = defineProps<Props>();
</script>

<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>{{ description }}</v-card-text>
  </v-card>
</template>