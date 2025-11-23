<template>
    <div class="p-5">
      <h2>Quản lý tài liệu</h2>
  
      <input v-model="newMaterial" placeholder="Tên tài liệu..." />
      <button @click="addMaterial">Thêm</button>
  
      <ul>
        <li v-for="m in materials" :key="m.id">
          {{ m.title }}
          <button @click="removeMaterial(m.id)">Xóa</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "TeacherMaterials",
    data() {
      return {
        newMaterial: "",
        materials: [
          { id: 1, title: "Slide chương 1" },
          { id: 2, title: "Đề cương môn học" },
        ],
      };
    },
    methods: {
      addMaterial() {
        if (!this.newMaterial.trim()) return;
        this.materials.push({ id: Date.now(), title: this.newMaterial });
        this.newMaterial = "";
      },
      removeMaterial(id) {
        this.materials = this.materials.filter(m => m.id !== id);
      },
    },
  };
  </script>
  