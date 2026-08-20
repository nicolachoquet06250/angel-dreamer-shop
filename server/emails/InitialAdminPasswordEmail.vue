<script setup lang="ts">
import {Body, Container, Head, Heading, Html, Preview, Text} from '@vue-email/components'

defineProps<{ password: string }>()
const body = {backgroundColor: '#f5f2eb', fontFamily: 'Arial,sans-serif', padding: '32px 12px'}
const card = {
  backgroundColor: '#ffffff',
  border: '1px solid #d7d1c8',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px'
}
</script>
<template>
  <Html lang="fr">
  <Head/>
  <Preview>Votre accès administrateur Angel Dreamer</Preview>
  <Body :style="body">
  <Container :style="card">
    <Heading>Votre compte administrateur</Heading>
    <Text>Votre mot de passe temporaire est :</Text>
    <Text :style="{fontSize:'22px',fontWeight:'700',color:'#c93620'}">{{ password }}</Text>
    <Text>Connectez-vous puis choisissez immédiatement un nouveau mot de passe. Ce mot de passe temporaire ne pourra
      plus être utilisé après ce changement.
    </Text>
  </Container>
  </Body>
  </Html>
</template>
