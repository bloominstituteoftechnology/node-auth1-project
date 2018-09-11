<template>
  <div class="register">
    <h1>Sign Up</h1>
    <cred-form v-on:register="formSubmit"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CredForm from '@/components/CredForm.vue';
import axios from 'axios';
import store from '@/store';

export default {
  name: 'register',
  components: {
    CredForm,
  },
  methods: {
    formSubmit: function(username, password) {
      axios
        .post('http://localhost:5000/api/register', {
          username,
          password,
        })
        .then(response => {
          console.log(response);
          store.setLoggedIn(true);
          this.$router.push('/users');
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>
