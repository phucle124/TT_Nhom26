<template>
    <div class="p-5">
      <h2>Tạo thông báo môn học</h2>
  
      <input v-model="title" placeholder="Tiêu đề..." />
      <textarea v-model="content" placeholder="Nội dung..."></textarea>
  
      <button @click="send">Gửi</button>
  
      <h3>Các thông báo đã tạo:</h3>
      <ul>
        <li v-for="n in notifications" :key="n.id">
          <strong>{{ n.title }}</strong> — {{ n.content }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "TeacherNotifications",
    data() {
      return {
        title: "",
        content: "",
        notifications: [],
      };
    },
    methods: {
      send() {
        if (!this.title || !this.content) return;
        this.notifications.push({
          id: Date.now(),
          title: this.title,
          content: this.content,
        });
        this.title = "";
        this.content = "";
      },
    },
  };
  </script>
  