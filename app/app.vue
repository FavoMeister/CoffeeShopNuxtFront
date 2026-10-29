<script setup>
import { Notivue, Notification } from 'notivue';
</script>
<template>
  <NuxtLayout >
    <NuxtPage />
  </NuxtLayout>
  
  <Notivue v-slot="item">
    <Notification :item="item"/>
  </Notivue>
  <!-- <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
    {{  }}
  </div> -->
</template>

<style>
[v-clock]{
  display: none !important;
}
</style>