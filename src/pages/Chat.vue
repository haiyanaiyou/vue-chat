<template>
  <div>
    <div class="home">
      <header>
        <h1>
          chat
          <span class="online"
            >（在线人数： {{ updateData.onlineCount }}）</span
          >
        </h1>
      </header>
      <!-- 用户提示 -->
      <p class="chat-tip">{{ user.username }} {{ type }}</p>
      <!-- 聊天内容 -->
      <div class="content" id="chatContainer">
        <div v-for="(item, index) in messageList" :key="index">
          <!-- 其他人 -->
          <div v-if="item.content">
            <!-- 自己 -->
            <div class="me" v-if="currentUser === item.username">
              <span class="dialog-content">{{ item.content }}</span>
              <img src="@/assets/imgs/user.jpg" alt="" srcset="" />
            </div>
            <div class="other" v-else>
              <img src="@/assets/imgs/other-one.jpg" alt="" srcset="" />
              <div class="dialog-content-other">
                <p class="other-name">{{ item.username }}</p>
                <span class="other-content">{{ item.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="error-tip">{{ tip }}</p>
      <footer>
        <div class="footer-content">
          <span class="iconfont upload"
            >&#xe70f;
            <input type="file" accept=".png, .jpg .jpeg" @change="handleUpload" class="input-file" />
          </span>
          <span class="iconfont" @click="handleShowEmoji">&#xe745;</span>
          <input
            type="text"
            class="send-content"
            v-model="message"
            ref="inputs"
            @keyup.enter="submitMessage"
          />
          <button class="btn-send" @click="submitMessage">发送</button>
        </div>
      </footer>
    </div>
    <!-- emoji表情 -->
    <VEmojiPicker
      v-show="showDialog"
      labelSearch="Search"
      lang="pt-BR"
      class="emojis"
      @select="onSelectEmoji"
    />
  </div>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";

export default {
  name: "Chat",
  components: { VEmojiPicker },
  data() {
    return {
      hasTip: false,
      updateData: {
        onlineCount: 0,
        onlineUsers: {},
      },
      user: {
        username: "",
      },
      message: "",
      tip: "",
      socket: {},
      messageList: [
        {
          userId: 0,
          username: "",
          content: "",
        },
      ],
      currentUser: "",
      type: "",
      container: {},
      showDialog: false,
    };
  },
  created() {
    const _this = this;
    if (!window.socket) {
      _this.$router.replace("/login");
    }
    //监听新用户登录
    window.socket.on("login", (data) => {
      _this.updateMessage(data, "加入群聊");
    });

    //监听用户退出
    window.socket.on("logout", (data) => {
      _this.updateMessage(data, "退出群聊");
    });

    window.socket.on("message", (dataObj) => {
      _this.messageList.push({
        ...dataObj,
        addtime: new Date().toLocaleTimeString(),
      });
      _this.container.scrollTop = _this.container.scrollHeight;
    });
  },
  methods: {
    updateMessage(data, type) {
      this.type = type;
      this.updateData = data;
      this.user = data.user;
    },
    submitMessage() {
      this.currentUser = this.$route.query.name;
      if (!this.message) {
        this.tip = "请输入聊天内容";
        return;
      }
      this.tip = "";
      const obj = {
        username: this.currentUser,
        content: this.message,
      };
      window.socket.emit("message", obj);
      this.message = "";
      this.$nextTick(() => {
        this.container = this.$el.querySelector("#chatContainer");
        console.log(this.container.scrollHeight, '+++++++')
        // this.container.scrollTop = this.container.scrollHeight;
        this.container.scrollIntoView()
      });
    },
    // 选择表情
    handleShowEmoji() {
      this.showDialog = true;
    },
    onSelectEmoji(emoji) {
      console.log(emoji.data);
      this.message += emoji.data;
      this.showDialog = false;
      this.$nextTick(() => {
        this.$refs.inputs.focus();
      });
    },
    // 发送图片
    handleUpload(e){
      console.log(e.target.files[0])

    }
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
header {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
footer {
  width: 100vw;
  height: 36px;
  .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .btn-send {
      width: 46px;
      background-color: royalblue;
      color: #fff;
      border: none;
    }
    .send-content {
      height: 36px;
      line-height: 36px;
      flex: 1;
      border: 1px solid #e2e2e2;
    }
  }
}
.content {
  padding: 10px;
  padding-top: 0;
  font-size: 12px;
  flex: 1;
  overflow-y: auto;
  img {
    width: 32px;
    height: 32px;
  }
  .other {
    display: flex;
    flex-direction: row;
    max-width: 70vw;
    margin-bottom: 10px;
    .dialog-content-other {
      margin-left: 10px;
      flex: 1;
    }
    .other-name {
      font-size: 10px;
      color: rgb(68, 67, 67);
      margin-bottom: 6px;
    }
    .other-content {
      display: inline-block;
      border: 1px solid #e2e2e2;
      padding: 5px 10px;
      line-height: 18px;
    }
  }
  .me {
    margin-top: 20px;
    text-align: right;
    .dialog-content {
      display: inline-block;
      background-color: rgb(155, 228, 155);
      padding: 5px 10px;
      line-height: 18px;
      margin-right: 10px;
      max-width: 70vw;
      vertical-align: top;
    }
  }
}
.chat-tip {
  color: rgb(119, 116, 116);
  margin: 12px 10px;
  margin-bottom: 0;
  font-size: 12px;
  height: 24px;
}
.error-tip {
  height: 20px;
  color: red;
  font-size: 12px;
}
.iconfont {
  font-size: 20px;
  margin: 6px 8px 0;
}
.emojis {
  position: fixed;
  bottom: 40px;
  width: 100vw !important;
}
.upload {
  position: relative;
  overflow: hidden;
}
.input-file {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
}
</style>
