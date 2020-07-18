<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avtar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <div class="login_info">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="username">
            <!-- 用户名 -->
            <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <!-- 密码 -->
            <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <div class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm('loginFormRef')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这个是登录表单的数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 这个是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 登录验证
    login() {
      console.log('login start');
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) {
          this.$message({
            showClose: true,
            message: "登录失败，用户名或密码错误",
            type: "warning"
          });
          this.$refs.loginFormRef.resetFields();
          return console.log("登录失败");
        }
        this.$message({
          showClose: true,
          message:"登录成功",
          type: "success"
        })
        console.log('token start');
        // 1.验证登录成功，使用 token 完成用户在不同页面的验证
        // console.log(res.data);
        //  1.1 从后台获取到 token 数据 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token);
        // 1.2 完成验证和存储，跳转到主页
        this.$router.push('home');
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage中
      });
    }
  }
};
</script>

<style lang='less' scoped>
.login_container {
  position: relative;
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avtar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  border: 15px solid #fff;
  box-shadow: 0 0 10px;

  img {
    width: 100%;
    height: 100%;
    background-color: #ddd;
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>