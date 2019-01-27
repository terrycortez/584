<template>
  <div>
    <h2> {{ msg }}</h2>
    <router-link to="/login"><a>Login</a></router-link>
    <router-link to="/register"><a>Register</a></router-link>
    <router-link to="/newconversation"><a>Message</a></router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'MEVN CHAT'
    }
  }
}
</script>
