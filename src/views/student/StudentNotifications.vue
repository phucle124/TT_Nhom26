<template>
    <div class="p-5">
      <h2>Thông báo</h2>
  
      <div v-for="note in notifications" :key="note.id" class="notify-card">
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
        <small>{{ note.date }}</small>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "StudentNotifications",
    data() {
      return {
        notifications: [
          { id: 1, title: "Lịch thi giữa kỳ", content: "Thi vào 20/11", date: "10/11" },
          { id: 2, title: "Nộp bài tập", content: "Hạn: 15/11", date: "09/11" },
        ],
      };
    },
  };
  </script>
  
  <style>
  .notify-card {
    border: 1px solid #ccc;
    padding: 12px;
    margin-bottom: 10px;
  }
  </style>
  