<template>
  <div class="login">
    <div class="content">
      <h1>欢迎来到聊天室</h1>
      <div>
        <img src="@/assets/imgs/user.jpg" alt="" srcset="" />
      </div>
      <p class="tip">{{ tip }}</p>
      <input type="text" class="login-user" v-model="username" @keyup.enter="login"/>
      <button class="btn-login" @click="login">进入</button>
    </div>
  </div>
</template>

<script>
export default ({
  name: "Login",
  data() {
    return {
      username: "",
      tip: "",
    };
  },
  methods: {
    login() {
      if (!this.username) {
        console.log(this.username);
        this.tip = "请输入用户名";
        return false;
      }
      this.initChat();
      this.$router.push(`/chat?name=${this.username}`);
    },
    initChat() {
      let userInfo = {
        userId: Date.now(),
        username: this.username,
      };
      //登录之后开始连接ws
      window.socket = window.io.connect('ws://localhost:3000/');
      window.socket.emit("login", userInfo);
      window.userInfo = userInfo;
    },
  },
});
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  .content {
    width: 70vw;
    position: absolute;
    text-align: center;
    left: 50%;
    top: 20vh;
    margin-left: -35vw;
  }
}
img {
  width: 56px;
  height: 56px;
  display: inline-block;
  border: 1px solid #e2e2e2;
  border-radius: 50%;
  margin: 50px auto;
}
.btn-login {
  display: block;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  background-color: royalblue;
  color: #fff;
  border: none;
  margin: 46px auto;
  box-shadow: 0 8px 21px 2px rgb(166, 184, 245);
}
.login-user {
  width: 58vw;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  padding: 10px;
}
.tip{
    font-size: 12px;
    color: red;
    margin-bottom: 6px;
}
</style>