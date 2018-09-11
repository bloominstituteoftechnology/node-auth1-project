<template>
  <div id="app">
    <div class="nav">
      <h2 class="nav__brand">Vue Auth</h2>
      <div>
        <div v-if="state.loggedIn">
          <router-link class="nav__link" to="/Users">Users</router-link>
          <a class="nav__link" v-on:click="logout"  href="#">Logout</a>
        </div>
        <div v-else>
          <router-link class="nav__link" to="/">Sign Up</router-link>
          <router-link class="nav__link" to="/login">Login</router-link>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import store from '@/store';
import axios from 'axios';

export default {
  name: "App",
  data: function (){
    return {
      state: store.state
    }
  },
  methods: {
    logout: function() {
      axios.get('http://localhost:5000/api/logout').then(response => {
        console.log(response.data);
        store.setLoggedIn(false);
        this.$router.push('/');
      }).catch(console.log);
    }
  }
}
</script>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1 {
  margin-bottom: 30px;
}
</style>

<style lang="scss" scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px;
  background-color: teal;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
  color: #fafafa;
  margin-bottom: 80px;

  &__link {
    color: inherit;
    font-size: inherit;
    text-decoration: none;

    &:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>

