const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const fs = require('fs');
const path = require('path');

const allArticle = async (req, res) => {
    
 try {
    let articles;
    if(req.role === 'admin'){
        articles = await newsModel.find()
        .populate('category', 'name')
        .populate('author', 'fullname');
    }else{
        articles = await newsModel.find({author: req.id})
        .populate('category', 'name')
        .populate('author', 'fullname');
    }
    res.render('admin/articles', {articles , role: req.role});
 } catch (error) {
     console.log(error);
     res.status(500).send('Internal Server Error');
 }
}
const addArticlePage = async (req, res) => {
    const categories = await categoryModel.find();
    res.render('admin/articles/create' , { categories, role: req.role});
}
const addArticle = async (req, res) => {
    try {
        const {title, content   , category} = req.body;
        const article = new newsModel({
            title,
            content,
            category,
            author: req.id,
            image: req.file.filename
        });
        // article.author = req.user.id;
        await article.save();
        res.redirect('/admin/article');
    } catch (error) {
        console.log(error);
        res.status(500).send('Article not saved');
    }
}
const updateArticlePage = async (req, res) => {
   const id = req.params.id;
   try {
       const article = await newsModel.findById(id)
       .populate('category', 'name')
       .populate('author', 'fullname ');


       if(!article){
           return res.status(404).send('Article not found');
       }
       
       if(req.role ==  'author'){
        if(req.id != article.author._id){
            return res.status(401).send('Unauthorized');
        }
       }
       const categories = await categoryModel.find();
       res.render('admin/articles/update' , {article, role: req.role , categories});
   } catch (error) {
       console.log(error);
       res.status(500).send('Server error');
   }

}
const updateArticle = async (req, res) => {
 
   const id = req.params.id;
   try{
    const {title, content, category} = req.body;
    const article = await newsModel.findById(id);
    if(!article){
        return res.status(404).send('Article not found');
    }

     if(req.role ==  'author'){
        if(req.id != article.author._id){
            return res.status(401).send('Unauthorized');
        }
       }
    article.title = title || article.title;
    article.content = content || article.content;
    article.category = category || article.category;
    
    if(req.file){
        const imagePath = path.join(__dirname, '../public/uploads', article.image);
        fs.unlinkSync(imagePath);


        article.image = req.file.filename;
    }

    await article.save();
    res.redirect('/admin/article');
   } catch (error) {
       console.log(error);
       res.status(500).send('Server error');
   }

}
const deleteArticle = async (req, res) => {
    const id = req.params.id;
    try {
        const article = await newsModel.findById(id);
        if(!article){
            return res.status(404).send('Article not found');
        }
         if(req.role ==  'author'){
        if(req.id != article.author._id){
            return res.status(401).send('Unauthorized');
        }
       }
        
    try {
        const imagePath = path.join(__dirname, '../public/uploads', article.image);
        fs.unlinkSync(imagePath);
    } catch (error) {
        console.log('Error deleting image:', error);
    }


       await article.deleteOne()
        res.json({success: true});
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    allArticle,
    addArticlePage,
    addArticle,
    updateArticlePage,
    updateArticle,
    deleteArticle
}

