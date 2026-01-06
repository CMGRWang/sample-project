package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

// define data structure
type Task struct {
	ID		string `json:"id"`
	Title	string `json:"title"`
}

// simulate database
var tasks = []Task{
	{ID: "1", Title: "learn React"},
	{ID: "2", Title: "learn Go API"},
}

func main() {
	r := gin.Default()
	// allow access from all resources, so that the frontend can get resources
	r.Use(cors.Default())


	// 1. [GET] get all tasks
	r.GET("/tasks", func(c *gin.Context) {
		c.JSON(http.StatusOK, tasks)
	})

	// 2. [POST] new task
	r.POST("/tasks", func(c *gin.Context) {
		var newTask Task
		// c.ShouldBindJSON 會自動把前端傳來的 JSON 轉成 Go 的結構體
		if err := c.ShouldBindJSON(&newTask); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		tasks = append(tasks, newTask)
		c.JSON(http.StatusCreated, newTask) // 回傳 201 代表成功建立 
	})

	// 3. [DELETE] 刪除特定任務 (使用路徑參數 :id)
	r.DELETE("/tasks/:id", func(c *gin.Context) {
		id := c.Param("id")
		// 這裡寫一個簡單的過濾邏輯來刪除資料
		newTasks := []Task{}
		for _, t := range tasks {
			if t.ID != id {
				newTasks = append(newTasks, t)
			}
		}
		tasks = newTasks
		c.JSON(http.StatusOK, gin.H{"message": "刪除成功"})
	})

	r.Run(":8080")
}