<template>
<div>
  <div>
    <form method="POST" @submit.prevent="onSubmit">
        <div>
          <label for="usernames">Usernames</label>
        </div>
        <div>
          <input type="text" id="usernames" v-model="userInput.usernames">
        </div>
        <div>
          <label for="password">Password</label>
        </div>
        <div>
          <input type="text" id="password" v-model="userInput.password">
        </div>
        <div>
          <button type="submit" class="btn">Login</button>
        </div>
    </form>
  </div>  
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      userInput: {
        usernames: '',
        password: ''
      },
    }
  },
  methods: {
    onSubmit() {
      axios.post('http://localhost:3000/login', {
        usernames: this.userInput.usernames,
        password: this.userInput.password
      })
      .then((response) => {
        console.log(response.data)
        location.href = '/#/'
      })
    },
  }
}
</script>