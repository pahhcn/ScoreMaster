import { Router } from 'express'
const router = Router()

const keyMap = {
  '学号': 'xh',
  '姓名': 'name',
  'e1': 'e1',
  'e2': 'e2',
  'e3': 'e3',
  '高等数学1-1 [4]': 'math1_1',
  '高等数学1-2 [5]': 'math1_2',
  '线性代数 [3]': 'linear_algebra',
  '大学物理4-1 [3]': 'physics4_1',
  '信息技术导论 [2]': 'info_tech_intro',
  '高级语言程序设计 [3]': 'prog_lang',
  '高级语言程序设计实验 [1]': 'prog_lang_lab',
  '面向对象程序设计 [3]': 'oop',
  '计算机组成原理 [3]': 'computer_org',
  '离散数学 [4]': 'discrete_math',
  '汇编语言程序设计 [2]': 'asm_prog',
  '汇编语言程序设计实验 [1]': 'asm_prog_lab',
  '程序设计训练 [1]': 'coding_training',
  '计算机组成原理课程设计 [1]': 'computer_org_proj',
  '数字系统与逻辑设计 [3]': 'logic_design',
  '数字系统与逻辑设计实验 [1]': 'logic_design_lab',
  'JAVA语言程序设计 [3]': 'java_prog',
  '计算机专业认知 [.5]': 'major_intro',
  '思想道德修养与法律基础 [3]': 'morals_law',
  '中国近现代史纲要 [2]': 'modern_history',
  '马克思主义基本原理概论 [3]': 'marxism_intro',
  '毛泽东思想和中国特色社会主义理论体系概论（1） [3]': 'mao_thought_1',
  '贵州省情 [1]': 'guizhou_profile',
  '体育1 [1]': 'pe1',
  '大学生职业生涯规划 [.5]': 'career_planning',
  '军事理论及军事训练 [2]': 'military_theory',
  '大学生心理健康 [1]': 'mental_health',
  '总分': 'total',
  '平均分': 'avg'
}

function mapRow(row) {
  const newRow = {}
  for (const key in row) {
    newRow[keyMap[key] || key] = row[key]
  }
  return newRow
}

export default (db) => {
  

router.get('/scores', (req, res) => {
  const { name, sort, order = 'desc', subject, min, max } = req.query
  let sql = 'SELECT * FROM scores WHERE 1=1'
  const params = []
  if (name) {
    sql += ' AND 姓名 LIKE ?'
    params.push(`%${name}%`)
  }
  if (subject) {
    const subjectCN = Object.keys(keyMap).find(key => keyMap[key] === subject)
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
    if (err) {
      console.error(err)
      return res.status(500).send([])
    }

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

    let finalResults = mappedResults
    if (sort) {
      finalResults = [...mappedResults].sort((a, b) => {
        const aVal = a[sort]
        const bVal = b[sort]
        if (aVal == null) return 1
        if (bVal == null) return -1
        return order === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    res.send(finalResults)
  })
})

function convertGradeToScore(val) {
  if (typeof val === 'number') return val
  const gradeMap = {
    '优秀': 90,
    '良好': 80,
    '中等': 70,
    '及格': 60,
    '不及格': 50
  }
  return gradeMap[val] ?? NaN 
}

router.get('/scores/:xh', (req, res) => {
  const xh = req.params.xh
  db.query('SELECT * FROM scores WHERE 学号 = ?', [xh], (err, results) => {
    if (err) return res.status(500).send([])
    if (!results.length) return res.send([])

    const row = mapRow(results[0]) 
    let total = 0, count = 0

    for (const key in row) {
      if (!['xh', 'name', 'total', 'avg'].includes(key)) {
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
      if (err) {
        console.error(err)
        return res.status(500).send({ success: false })
      }
      res.send({ success: true, id: result.insertId })
    })
  })


  router.put('/scores/:xh', (req, res) => {
    const xh = req.params.xh
    const data = {}
    for (const k in req.body) {
      const cnKey = Object.keys(keyMap).find(key => keyMap[key] === k) || k
      data[cnKey] = req.body[k]
    }
    const fields = Object.keys(data).map(f => `\`${f}\`=?`).join(',')
    const values = Object.values(data)
    values.push(xh)
    db.query(`UPDATE scores SET ${fields} WHERE 学号=?`, values, (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).send({ success: false })
      }
      res.send({ success: true })
    })
  })


  router.delete('/scores/:xh', (req, res) => {
    const xh = req.params.xh
    db.query('DELETE FROM scores WHERE 学号=?', [xh], (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).send({ success: false })
      }
      res.send({ success: true })
    })
  })

  return router
}