<template>
  <div>
    <h1>Users</h1>
    <ul>
    <li
      class="name"
      v-for="user in users"
      v-bind:key="user.username"
    >
      {{ user.username }}
    </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  mounted: function() {
    axios({
      url: 'http://localhost:5000/api/users',
      method: 'GET',
    })
      .then(response => {
        this.users = response.data.users;

      })
      .catch(error => {
        console.log(error);
      });
  },
  data: function() {
    return {
      users: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.name {
  text-transform: uppercase;
  padding: 20px;
  letter-spacing: 2px;
  font-size: 20px;
  max-width: 300px;
  margin: 0 auto;
  list-style-type: none;

  &:not(:last-child) {
    border-bottom: 1px solid #cdcdcd;
  }
}
</style>
