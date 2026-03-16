const Blog = require('../models/Blog');

// @desc    Tüm blogları getir (Filtreleme ve Arama dahil)
exports.getBlogs = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = {};

    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (search) query.title = { $regex: search, $options: 'i' };

    const blogs = await Blog.find(query)
      .populate('author', 'username')
      .populate('categories', 'name')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Bloglar getirilemedi", error: error.message });
  }
};

// @desc    Yeni bir blog oluştur
exports.createBlog = async (req, res) => {
  try {
    const { title, content, categories, tags, coverImage } = req.body;

    const blog = new Blog({
      title,
      content,
      author: req.user._id, // Protect middleware'den geliyor
      categories,
      tags,
      coverImage
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(400).json({ message: "Blog oluşturulamadı", error: error.message });
  }
};

// @desc    Tekil blog detayı (Görüntülenme sayısını artırarak)
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username')
      .populate('categories', 'name')
      .populate('comments.user', 'username');

    if (blog) {
      blog.views += 1;
      await blog.save();
      

      const similarBlogs = await Blog.find({
  _id: { $ne: blog._id }, // Mevcut blog hariç
  categories: { $in: blog.categories } // Aynı kategorideki yazılar
}).limit(3);
res.json({ blog, similarBlogs });
    } else {
      res.status(404).json({ message: "Blog bulunamadı" });
    }
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// @desc    Blog yazısını güncelle
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, categories, tags, coverImage } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (blog) {
      // Sadece admin veya içeriğin sahibi güncelleyebilir (Şu an admin odaklı gidiyoruz)
      blog.title = title || blog.title;
      blog.content = content || blog.content;
      blog.categories = categories || blog.categories;
      blog.tags = tags || blog.tags;
      blog.coverImage = coverImage || blog.coverImage;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Güncellenecek blog bulunamadı" });
    }
  } catch (error) {
    res.status(400).json({ message: "Güncelleme başarısız", error: error.message });
  }
};

// @desc    Blog yazısını sil
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await blog.deleteOne();
      res.json({ message: "Blog başarıyla silindi" });
    } else {
      res.status(404).json({ message: "Silinecek blog bulunamadı" });
    }
  } catch (error) {
    res.status(500).json({ message: "Silme işlemi başarısız", error: error.message });
  }
};


// @desc    Blog yazısına yorum yap
// @route   POST /api/blogs/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      const comment = {
        user: req.user._id,
        text,
      };
      blog.comments.push(comment);
      await blog.save();
      res.status(201).json({ message: "Yorum eklendi" });
    } else {
      res.status(404).json({ message: "Blog bulunamadı" });
    }
  } catch (error) {
    res.status(400).json({ message: "Yorum eklenemedi" });
  }
};

// @desc    Blog beğen / beğeniyi geri al (Toggle)
// @route   POST /api/blogs/:id/like
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      // Eğer kullanıcı daha önce beğenmişse, beğeniyi kaldır
      if (blog.likes.includes(req.user._id)) {
        blog.likes = blog.likes.filter((id) => id.toString() !== req.user._id.toString());
      } else {
        blog.likes.push(req.user._id);
      }
      await blog.save();
      res.json({ likesCount: blog.likes.length });
    }
  } catch (error) {
    res.status(400).json({ message: "İşlem başarısız" });
  }
};


