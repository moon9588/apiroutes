const router = require('express').Router();
const res = require('express/lib/response');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  rounter.get('/',(req,res) =>{
    Tag.findAll({
      include:[
        {
          model: Product, through: ProductTag,
          attributes:['id', 'product_name', 'price', 'stock'],
        }],
    })
    .then(dbTagData => {
      if (!dbTagData){
        res.status(404).json({ message:'No tag found with this id'});
        return
      }
      res.status(200).json(dbTagData)
    })
    .catch (err => {
      console.log(err);
      res.status(500).json(err);
    });
  });
});
 

// find a single tag by its `id`
router.get('/:id', (req, res) => {
  // be sure to include its associated Product data
  console.log(req.params.id);
  Tag.findOne({
    where: {
      id:req.params.id
    },
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [
      {
        model: Product, through: ProductTag,
        attributes: ['product_name'],
      },
      { model: Tag, through: Product,
      attributes:['tag_name'],
      }
    ],
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message:'No Tag found with this id'})
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err){
    res.status(400).json(err);     
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: { id: req.params.id }
    });
    if (!tagData){
      res.status(404).json({ message: 'No Tag with this id!'});
      return;
    }
    res.status(200).json(tagData);
  } catch (err){
    res.status(500).json(err);
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ messagae: 'No tag found with this id'});
      return;
    }
    res.json(dbTagData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
