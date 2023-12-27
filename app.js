const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
// import styles from './views/style.css'

mongoose.connect('mongodb://localhost:27017/bootstrap-crud');


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String,
  dateAdded: { type: Date, default: Date.now }
});

const ItemModel = mongoose.model('Item', itemSchema);

app.get('/', async (req, res) => {
  const items = await ItemModel.find();
  res.render('index', { items });
});

app.post('/create', async (req, res) => {
  const newItem = new ItemModel(req.body);
  await newItem.save();
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const item = await ItemModel.findById(req.params.id);
  res.render('edit', { item });
});

app.post('/update/:id', async (req, res) => {
  await ItemModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    try {
      const deletedItem = await ItemModel.findOneAndDelete({ _id: req.params.id });
      if (!deletedItem) {
        return res.status(404).send('Data not found');
      }
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

  
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
