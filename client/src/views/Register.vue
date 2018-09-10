<template>
  <div class="register">
    <h1>Sign Up</h1>
    <cred-form />
  </div>
</template>

<script>
// @ is an alias to /src
import CredForm from '@/components/CredForm.vue';

export default {
  name: 'register',
  components: {
    CredForm,
  },
};
</script>
