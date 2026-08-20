<script setup lang="ts">
import {Body, Button, Container, Head, Heading, Html, Preview, Text} from '@vue-email/components'

defineProps<{ resetUrl: string }>()
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
  <Preview>Réinitialisez votre mot de passe Angel Dreamer</Preview>
  <Body :style="body">
  <Container :style="card">
    <Heading>Réinitialisation de votre mot de passe</Heading>
    <Text>Un administrateur vous invite à choisir un nouveau mot de passe.</Text>
    <Button :href="resetUrl"
            :style="{backgroundColor:'#c93620',color:'#ffffff',display:'inline-block',padding:'13px 20px',textDecoration:'none'}">
      Choisir mon nouveau mot de passe
    </Button>
    <Text>Ce lien est personnel, utilisable une seule fois et expire dans 30 minutes.</Text>
    <Text>Si vous n’attendiez pas cet e-mail, vous pouvez simplement l’ignorer.</Text>
  </Container>
  </Body>
  </Html>
</template>
