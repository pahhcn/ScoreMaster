# 项目名称-ScoreMaster

## 一、项目名称-ScoreMaster：一款基于 Web 的成绩管理系统

![home](https://github.com/pahhcn/ScoreMaster/blob/main/src/assets/42.jpg/home.png)

### 一、要求

> 完成成绩管理系统webui设计，要求如下：

1. 能添加、删除、修改、查询成绩信息；
2. 能按某科成绩、总分、平均分进行排序显示；
3. 能快速挑选查询出特定同学，如姓名（模糊匹配，如王XX）、任意科目特定成绩查询等。

> `作业开发环境说明：`

1. vscode （使用 VS Code 远程连接 VMware 虚拟机，作为主要开发）
2. ubuntu22.04  (实验运行系统环境)
3. windows11
4. WindTerm（用于远程登录 Ubuntu 系统和文件传输）
5. GitHub Copilot（AI 编程助手，辅助代码自动补全与问题解决）



## 二、系统架构与技术栈

### 2.1 技术架构

- 前端框架：Vue 3
- 组件库：Element Plus、Arco Design
- 构建工具：Vite
- 后端框架：Node.js + Express
- 数据库：MySQL
- 通信协议：RESTful API
- 部署方式：本地运行 / 服务器部署

### 2.2 系统功能模块（前端页面）

- 首页：欢迎页面，展示系统简介
- 成绩查询：支持多条件查询与结果展示
- 成绩排序：支持按字段排序成绩
- 添加成绩：录入新学生成绩信息
- 修改成绩：编辑已有学生成绩数据
- 删除成绩：删除指定学生成绩记录
- 关于页面：简单介绍而已



## 三、功能模块设计

### 4.1 成绩管理模块

- 添加成绩：支持录入学生成绩。

- 修改成绩：支持对已有成绩进行编辑。

- 删除成绩：支持删除指定学生的成绩。

- 查询成绩：支持按学号、姓名、科目、分数范围等条件查询。

### 4.2 成绩排序模块

- 支持按总分、平均分或任意科目排序。

- 提供升序和降序选项。


### 4.3 条件筛选模块

- 支持姓名模糊查询（如“王XX”）。
- 支持按分数范围筛选特定科目成绩。

## 四、关键实现逻辑(API)

###  4.1 字段映射（英文字段转中文字段）

统一字段处理，适用于查询、添加、更新。

```js
function mapRow(row) {
  const newRow = {}
  for (const key in row) {
    newRow[keyMap[key] || key] = row[key]
  }
  return newRow
}
```

------

###  4.2 成绩查询（支持模糊、筛选、排序）

- 支持按 `name` 模糊搜索
- 支持按任意课程 `subject` 过滤（`min`、`max`）
- 支持 `sort + order` 排序
- 自动计算 `total` 与 `avg`

```js
router.get('/scores', (req, res) => {
  const { name, sort, order = 'desc', subject, min, max } = req.query
  let sql = 'SELECT * FROM scores WHERE 1=1'
  const params = []

  if (name) {
    sql += ' AND 姓名 LIKE ?'
    params.push(`%${name}%`)
  }

  if (subject) {
    const subjectCN = Object.keys(keyMap).find(k => keyMap[k] === subject)
    if (subjectCN && min) {
      sql += ` AND \`${subjectCN}\` >= ?`
      params.push(Number(min))
    }
    if (subjectCN && max) {
      sql += ` AND \`${subjectCN}\` <= ?`
      params.push(Number(max))
    }
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send([])

    const mappedResults = results.map(row => {
      const newRow = mapRow(row)
      let total = 0, count = 0
      for (const key in newRow) {
        if (!['xh', 'name'].includes(key)) {
          const score = convertGradeToScore(newRow[key])
          if (!isNaN(score)) {
            total += score
            count++
          }
        }
      }
      newRow.total = total
      newRow.avg = count ? parseFloat((total / count).toFixed(2)) : 0
      return newRow
    })

    // 排序处理
    let finalResults = mappedResults
    if (sort) {
      finalResults = [...mappedResults].sort((a, b) => {
        const aVal = a[sort], bVal = b[sort]
        if (aVal == null) return 1
        if (bVal == null) return -1
        return order === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    res.send(finalResults)
  })
})
```

------

###  4.3 查询单个学生成绩（按学号）

按学号 `xh` 查询单个学生，字段映射并计算 `total` 与 `avg`。

```js
router.get('/scores/:xh', (req, res) => {
  const xh = req.params.xh
  db.query('SELECT * FROM scores WHERE 学号 = ?', [xh], (err, results) => {
    if (err) return res.status(500).send([])
    if (!results.length) return res.send([])

    const row = mapRow(results[0])
    let total = 0, count = 0
    for (const key in row) {
      if (!['xh', 'name'].includes(key)) {
        const score = convertGradeToScore(row[key])
        if (!isNaN(score)) {
          total += score
          count++
        }
      }
    }
    row.total = total
    row.avg = count ? (total / count).toFixed(2) : 0
    res.send([row])
  })
})
```

------

###  4.4 添加成绩

```js
router.post('/scores', (req, res) => {
  const data = {}
  for (const k in req.body) {
    const cnKey = Object.keys(keyMap).find(key => keyMap[key] === k) || k
    data[cnKey] = req.body[k]
  }
  const fields = Object.keys(data).map(f => `\`${f}\``).join(',')
  const values = Object.values(data)
  const placeholders = values.map(() => '?').join(',')

  db.query(`INSERT INTO scores (${fields}) VALUES (${placeholders})`, values, (err, result) => {
    if (err) return res.status(500).send({ success: false })
    res.send({ success: true, id: result.insertId })
  })
})
```

------

###  4.5 修改 & 删除成绩

修改成绩（PUT）：按学号更新记录，字段也支持英文转中文。

```js
router.put('/scores/:xh', (req, res) => {
  const xh = req.params.xh
  const data = {}
  for (const k in req.body) {
    const cnKey = Object.keys(keyMap).find(key => keyMap[key] === k) || k
    data[cnKey] = req.body[k]
  }
  const fields = Object.keys(data).map(f => `\`${f}\`=?`).join(',')
  const values = [...Object.values(data), xh]
  db.query(`UPDATE scores SET ${fields} WHERE 学号=?`, values, (err) => {
    if (err) return res.status(500).send({ success: false })
    res.send({ success: true })
  })
})
```

删除成绩（DELETE）：

```js
router.delete('/scores/:xh', (req, res) => {
  db.query('DELETE FROM scores WHERE 学号=?', [req.params.xh], (err) => {
    if (err) return res.status(500).send({ success: false })
    res.send({ success: true })
  })
})
```

------

###  4.6：文字成绩转数值函数

```js
function convertGradeToScore(val) {
  if (typeof val === 'number') return val
  const gradeMap = { '优秀': 90, '良好': 80, '中等': 70, '及格': 60, '不及格': 50 }
  return gradeMap[val] ?? NaN
}
```



## 五、项目托管

### 5.1项目源代码

项目源代码已托管至 GitHub：👉 https://github.com/pahhcn/ScoreMaster

> 包含前端（Vite + Vue3）、后端（Express + MySQL）、数据库文件等所有源码。

### 5.2项目部署



` 项目结构说明：`

```
bash复制编辑ScoreMaster/
├── client/         # 前端代码（Vite + Vue3）
├── server/         # 后端接口（Express）
├── db/             # 数据库脚本及示例数据
├── server.js       # 启动后端入口
├── package.json    # 项目依赖
```

`环境依赖：`

- Node.js ≥ 16
- MySQL ≥ 5.7
- 推荐使用 `pnpm` / `npm` 作为包管理器

### 5.3本地部署

```bash
# 克隆项目
git clone https://github.com/pahhcn/ScoreMaster.git
cd ScoreMaster

# 安装依赖
npm install

# 启动数据库（MySQL）并导入表结构与数据scores 表
sudo systemctl start mysql

# 启动后端服务（默认端口 3000）
node server.js

# 启动前端项目（Vite dev server，默认端口 5173）
npm run dev
```