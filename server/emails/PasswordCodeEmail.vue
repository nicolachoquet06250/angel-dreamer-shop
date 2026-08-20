<script setup lang="ts">
import {Body, Container, Head, Heading, Html, Preview, Text} from '@vue-email/components'

defineProps<{ code: string }>()
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
  <Preview>Votre code de sécurité Angel Dreamer</Preview>
  <Body :style="body">
  <Container :style="card">
    <Heading>Modification de votre mot de passe</Heading>
    <Text>Votre code de sécurité est :</Text>
    <Text :style="{fontSize:'30px',fontWeight:'700',letterSpacing:'8px',color:'#c93620'}">{{ code }}</Text>
    <Text>Ce code expire dans 10 minutes et ne peut être utilisé qu’une fois.</Text>
    <Text>Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.</Text>
  </Container>
  </Body>
  </Html>
</template>
