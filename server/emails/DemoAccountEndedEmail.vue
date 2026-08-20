<script setup lang="ts">
import {Body, Container, Head, Heading, Html, Preview, Text} from '@vue-email/components'

defineProps<{ demoEmail: string; endedAt: string }>()
const body = {backgroundColor: '#f5f2eb', fontFamily: 'Arial,sans-serif', padding: '32px 12px'}
const card = {backgroundColor: '#ffffff', border: '1px solid #d7d1c8', margin: '0 auto', maxWidth: '560px', padding: '32px'}
</script>

<template>
  <Html lang="fr">
  <Head/>
  <Preview>Le compte de démonstration a terminé sa session et a été supprimé.</Preview>
  <Body :style="body">
  <Container :style="card">
    <Heading>Session de démonstration terminée</Heading>
    <Text>Le compte temporaire {{ demoEmail }} s’est déconnecté le {{ endedAt }}.</Text>
    <Text>Il a bien été supprimé automatiquement, avec toutes ses données associées.</Text>
  </Container>
  </Body>
  </Html>
</template>
