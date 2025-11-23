<template>
    <div class="p-5">
      <h2>Quản lý lớp học</h2>
  
      <input v-model="newClass" placeholder="Tên lớp..." />
      <button @click="addClass">Thêm</button>
  
      <ul>
        <li v-for="c in classes" :key="c.id">
          {{ c.name }}
          <button @click="deleteClass(c.id)">Xóa</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminClasses",
    data() {
      return {
        newClass: "",
        classes: [
          { id: 1, name: "CNTT01" },
          { id: 2, name: "CNTT02" },
        ],
      };
    },
    methods: {
      addClass() {
        this.classes.push({ id: Date.now(), name: this.newClass });
        this.newClass = "";
      },
      deleteClass(id) {
        this.classes = this.classes.filter(c => c.id !== id);
      },
    },
  };
  </script>
  