<template>
<div>
  <div>
    <form method="POST" @submit.prevent="onSubmit">
        <div>
          <label for="sender">sender</label>
        </div>
        <div>
          <input type="text" id="sender" v-model="userInput.sender">
        </div>
        <div>
          <label for="reciever">reciever</label>
        </div>
        <div>
          <input type="text" id="reciever" v-model="userInput.reciever">
        </div>
        <div>
          <label for="txt">message</label>
        </div>
        <div>
          <input type="text" id="txt" v-model="userInput.txt">
        </div>

        <button type="submit" class="btn">Send</button>

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
        sender: '',
        reciever: '',
        txt: ''
      },
    }
  },
  methods: {
    onSubmit() {
      axios.post('http://localhost:3000/newconversation', {
        sender: this.userInput.sender,
        reciever: this.userInput.reciever,
        txt: this.userInput.txt
      })
      .then((response) => {
        console.log(response.data)
        location.href = '/#/'
      })
    },
  }
}
</script>