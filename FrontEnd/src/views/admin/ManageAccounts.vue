<template>
  <div class="p-5">
    <h2>Quản lý tài khoản người dùng</h2>

    <input v-model="newUser" placeholder="Tên tài khoản..." />
    <input v-model="newPassword" placeholder="Mật khẩu..." type="password" />
    <select v-model="newRole">
      <option value="Sinh_vien">Sinh viên</option>
      <option value="Giang_vien">Giảng viên</option>
    </select>
    <button @click="addUser">Thêm</button>

    <ul>
      <li v-for="u in users" :key="u.user_id">
        {{ u.username }} - {{ u.role }}
        <button @click="deleteUser(u.user_id)">Xóa</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return { 
      newUser: "", 
      newPassword: "", 
      newRole: "Sinh_vien", 
      users: [] 
    };
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      const res = await fetch("http://localhost:8888/api/users");
      this.users = await res.json();
    },
    async addUser() {
      if (!this.newUser.trim()) return;
      await fetch("http://localhost:8888/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: this.newUser,
          password: this.newPassword,
          role: this.newRole
        })
      });
      this.newUser = "";
      this.newPassword = "";
      this.newRole = "Sinh_vien";
      this.loadUsers();
    },
    async deleteUser(id) {
      await fetch(`http://localhost:8888/api/users/${id}`, { method: "DELETE" });
      this.loadUsers();
    }
  }
};
</script>