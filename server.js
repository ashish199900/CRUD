const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import the path module


const app = express();
const PORT = 5000;
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb+srv://ashishkumar12dd:IVdAdmNhymRsccxi@employee.pgby3.mongodb.net/employees_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB',  mongoose.connection.name))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Define the schema with name, email, contact, and id
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true }
},{ collection: 'list_of_employees' , versionKey: false });

const Item = mongoose.model('Item', itemSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.status(201).json(newItem);
});

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.status(200).json(items);
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  console.log('we got this', req.body);
  const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(updatedItem);
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  await Item.findByIdAndDelete(id);
  res.status(204).send();
});

app.get('/items/:id', (req, res) => {
  const itemId = req.params.id;

  // Find the item by ID in the database
  Item.findById(itemId, (err, item) => {
      if (err) {
          console.error('Error fetching item:', err);
          return res.status(500).send('An error occurred while fetching the item.');
      }

      if (!item) {
          return res.status(404).send('Item not found.');
      }

      // Send the item data back to the client
      res.status(200).json(item);
  });
});

app.listen(PORT, () =>console.log(`Server running on http://localhost:${PORT}`));

