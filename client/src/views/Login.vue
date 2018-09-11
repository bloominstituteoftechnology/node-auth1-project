<template>
  <div class="login">
    <h1>Login</h1>
    <cred-form v-on:register="login" />
  </div>
</template>

<script>
import CredForm from '@/components/CredForm.vue';
import axios from 'axios';

export default {
  components: {
    CredForm,
  },
  methods: {
    login: function(username, password) {
      axios
        .post('http://localhost:5000/api/login', {
          username,
          password,
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(data);
        });
    },
  },
};
</script>
