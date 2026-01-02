<template>
    <div class="p-5">
      <h2>Tài liệu môn học</h2>
  
      <ul>
        <li v-for="materials in materials" :key="materials.id">
          {{ materials.title }}
          <button @click="download(materials.fileUrl)">Tải xuống</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "StudentMaterials",
    data() {
      return {
        // materials: [
        //   { id: 1, title: "Slide chương 1", fileUrl: "/docs/slide1.pdf" },
        //   { id: 2, title: "Bài tập chương 2", fileUrl: "/docs/bai_tap_2.pdf" },
        // ],
      };
    },
    methods: {
      download(url) {
        window.open(url, "_blank");
      },
    },
  };
  </script>
  