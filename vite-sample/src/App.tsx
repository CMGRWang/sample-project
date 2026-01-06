import { useState, useEffect } from 'react'


// 1. 定義資料型別
interface Task {
  id: string;
  title: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');

  
  // 2. [Read] 網頁載入時，去向後端要資料
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // 定義一個非同步函式
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/tasks');
      const data = await response.json();
      setTasks(data); // 將後端抓到的資料塞進 State
    } catch (error) {
      console.error("無法連線至後端 Go 伺服器", error);
    }
  };

  // 3. [Create] 按下新增按鈕時，發送 POST 請求
    const addTask = async () => {
    if (!inputValue) return;

    const newTask = { 
      id: Date.now().toString(), 
      title: inputValue 
    };

    console.log("正在發送請求到後端...", newTask); // 加這行

    try {
      const response = await fetch('http://localhost:8080/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      console.log("後端回應狀態碼:", response.status); // 加這行

      if (response.ok) {
        setTasks([...tasks, newTask]);
        setInputValue('');
      } else {
        const errorData = await response.json();
        console.error("後端報錯:", errorData);
      }
    } catch (error) {
      console.error("網路連線失敗，請確認 Go 跑在 8080 端口", error);
    }
  };

  // 4. [Delete] 按下刪除按鈕時，發送 DELETE 請求
  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 成功後，過濾掉該項目來更新畫面
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error("刪除失敗", error);
    }
  };


  // 5. 渲染畫面 (TSX)
  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto' }}>
      <h1>Task Manager</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="要做什麼事？"
        />
        <button onClick={addTask}>新增任務</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '10px',
            borderBottom: '1px solid #eee'
          }}>
            {task.title}
            <button 
              onClick={() => deleteTask(task.id)}
              style={{ color: 'red', cursor: 'pointer' }}
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App