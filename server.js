require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const OpenAI = require('openai');

//express start
const app = express();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY
});

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

// Fetch todos from JSONPlaceholder
app.get('/api/todos', async (req, res) => {
  try {
    const id = req.query.id;
    let url = 'https://jsonplaceholder.typicode.com/todos';
    
    // If ID is provided, fetch specific todo
    if (id) {
      url = `https://jsonplaceholder.typicode.com/todos/${id}`;
    }
    
    const response = await fetch(url);
    const json = await response.json();
    
    res.json(json);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Weather API - Fetch weather forecast from Open-Meteo
app.get('/api/weather', async (req, res) => {
  try {
    const latitude = req.query.latitude || 31.5;
    const longitude = req.query.longitude || 74.3;
    const limit = parseInt(req.query.limit) || 5;
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Get first N temperature values
    const temperatures = data.hourly.temperature_2m.slice(0, limit);
    
    res.json({
      latitude,
      longitude,
      temperatures,
      count: temperatures.length,
      full_data: data
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// ChatGPT API - Ask a question and get a response
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    if (!process.env.OPEN_AI_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: question }
      ],
      max_tokens: 500
    });
    
    const response = completion.choices[0].message.content;
    
    res.json({
      question,
      response,
      model: completion.model
    });
  } catch (error) {
    console.error('Error calling ChatGPT:', error);
    res.status(500).json({ error: 'Failed to get response from ChatGPT', details: error.message });
  }
});

// ChatGPT API - Direct API call using fetch
app.post('/api/chat-direct', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    if (!process.env.OPEN_AI_URL) {
      return res.status(500).json({ error: 'OpenAI API URL is not configured' });
    }
    
    if (!process.env.OPEN_AI_KEY) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
    
    const response = await fetch(process.env.OPEN_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPEN_AI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: question }
        ],
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    const chatResponse = data.choices[0].message.content;
    
    res.json({
      question,
      response: chatResponse,
      model: data.model
    });
  } catch (error) {
    console.error('Error calling ChatGPT (direct API):', error);
    res.status(500).json({ error: 'Failed to get response from ChatGPT', details: error.message });
  }
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
