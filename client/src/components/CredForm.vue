<template>
  <form class="form">

    <input class="input" type="text" placeholder="Username" />
    <input class="input" type="text" placeholder="Password" />
    <button class="button">Submit</button>

  </form>
</template>

<script>
export default {
  name: 'CredForm',

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.form {
  max-width: 500px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
}

.input {
  width: 100%;
  display: block;
  border: none;
  border-bottom: 2px solid #eee;
  padding: 10px;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-bottom-color: teal;
  }

  &:not(:last-child) {
    margin-bottom: 20px;
  }

  &::placeholder {
    color: #777;
  }
}

.button {
  background-color: teal;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 10px 20px;
  border: none;
  font-size: 14px;
  font-family: inherit;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.3s;
  backface-visibility: hidden;

  &:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
}
</style>
