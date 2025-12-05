<template>
  <div class="p-5">
    <h2>Quản lý lớp học</h2>

    <!-- Nhập tên lớp -->
    <input v-model="newClass.class_name" placeholder="Tên lớp..." />
    <button @click="addClass">Thêm</button>

    <!-- Bảng danh sách lớp -->
    <table>
      <thead>
        <tr>
          <th>Tên lớp</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in classes" :key="c.class_id">
          <td>{{ c.class_name }}</td>
          <td>
            <button @click="deleteClass(c.class_id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "AdminClasses",
  data() {
    return {
      newClass: { class_name: "" }, // giữ dạng object để dễ mở rộng sau này
      classes: []
    };
  },
  mounted() {
    this.loadClasses();
  },
  methods: {
    async loadClasses() {
      const res = await fetch("http://localhost:8888/api/classes");
      this.classes = await res.json();
    },
    async addClass() {
      const res = await fetch("http://localhost:8888/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.newClass)
      });
      if (res.ok) {
        this.loadClasses();
        this.newClass.class_name = ""; 
      }
    },
    async deleteClass(id) {
      const res = await fetch(`http://localhost:8888/api/classes/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        this.loadClasses();
      }
    }
  }
};
</script>