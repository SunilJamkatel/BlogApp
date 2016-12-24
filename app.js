var express         = require('express'),
    methodOverride  = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose');

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); // Always after the body-parser
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Restful routes

app.get('/',function(req,res){
  res.redirect('/blogs');
});

app.get('/blogs',function(req,res){
  Blog.find({}, function(err,blogs){
    if(err){
      console.log("ERROR!!!");
    } else {
      res.render('index', {blogs: blogs, pageName: 'index'});
    }
  })
});

app.get('/blogs/new',function(req,res){
  res.render('new', {pageName: 'new'});
});

app.get('/blogs/:id',function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect('/blogs');
    }else{
      res.render('show', {blog: foundBlog, pageName: 'show'});
    }
  })
})

app.get('/blogs/:id/edit', function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect('/Blogs');
    } else {
      res.render('edit',{blog: foundBlog, pageName: 'edit'});
    }
  })
});


app.post('/blogs',function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.create(req.body.blog, function(err,newBlog){
    if(err){
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.put('/blogs/:id',function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if (err){
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/'+req.params.id);
    }
  });
});


app.delete('/blogs/:id', function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect('/blogs');
    } else{
      res.redirect('/blogs');
    }
  });
});
app.listen(3000,function(){
  console.log("Blog app has started!");
});
