require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//express start
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());        // parse JSON bodies
app.use(morgan('dev'));         // request logs

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Demo routes
app.get('/api/name', (req, res) => {
  const name = req.query.name || 'World';
  res.json({ message: `Hello, ${name}!` });
});

// Demo routes
app.get('/api/watch', (req, res) => {
    const v = req.query.v || 'World';

    let obj = 
        [
            {
                id: 10,
                title: 'John Doe',
                url: `https://youtube.com/watch?v=${v}`
            },
            {
                id: 11,
                name: 'Jane Doe',
                email: 'jane.doe@example.com'
            }
        ]

        let returnobj = {}
        console.log(v);
        obj.forEach(video => {
            if(video.id === v){
               returnobj =  { message: `Hello, ${video.title}!` };
            }
        })
        res.json(returnobj)

  });

app.get('/api/users/:id', (req, res) => {
  res.json({ id: req.params.id, note: 'Dynamic route param demo' });
});

app.post('/api/echo', (req, res) => {
  res.status(201).json({ you_sent: req.body });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler (keeps demo clean)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something broke' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
