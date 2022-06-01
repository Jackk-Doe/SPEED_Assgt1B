import ArticleModel from '../models/Article.js';


/*     ARTICLE CONTROLLERS     */

/// POST [ '/article' ]
export const createArticle = async (req, res) => {

    /// For Testing
    const newArticle = new ArticleModel(req.body);
    try {
        await newArticle.save();
        return res.json(newArticle);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

    // ArticleModel.create(req.body)
    //     .then(article => res.json({ message: 'New article created successfully!'}))
    //     .catch(err => res.status(400).json({ error: 'No Article found!'}));
}


/// GET [ '/article' ]
export const getAllArticle = async (req, res) => {
    ArticleModel.find({ needModerator: false, needAnalyst: false })
        .then(articles => res.json(articles))
        .catch(err => res.status(404).json({ error: 'No Article found!' }));
}


/// GET [ '/article/:id' ]
export const getArticle = async (req, res) => {
    ArticleModel.findById(req.params.id)
        .then(article => res.json(article))
        .catch(err => res.status(404).json({ error: 'No Article found!' }));
}


/// PATCH [ '/article/:id' ]
export const updateArticle = async (req, res) => {
    ArticleModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(article => res.json(article))
        .catch(err => res.status(400).json({ error: 'No Article found!' }));
}


/// DELETE [ '/article/:id' ]
export const deleteArticle = async (req, res) => {
    try {
        await ArticleModel.findByIdAndRemove(req.params.id);
    } catch (error) {
        res.status(404).json({ message: error });
    }

    return res.json({ message: 'Article Delete completed!' });
}


/// GET [ '/moderator/article' ]
export const getModeratorArticles = async (req, res) => {
    try {
        const moderatorArticles = await ArticleModel.find({ needModerator: true });
        return res.json(moderatorArticles);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}


/// GET [ '/analyst/article' ]
export const getAnalystArticles = async (req, res) => {
    try {
        const analystArticles = await ArticleModel.find({ needAnalyst: true });
        return res.json(analystArticles);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}


/// GET [ '/search/:title/:moderator/:analyst' ]
export const searchByTitle = async (req, res) => {

    const searchModerator = (req.params.moderator === "true" ? true : false);
    const searchAnalyst = (req.params.analyst === "true" ? true : false);

    // console.log("Req param title: ", req.params.title);
    // console.log("Found Searching Moderator: ", req.params.moderator);
    // console.log("Found Searching Analyst: ", req.params.analyst);
    
    try {
        const result = await ArticleModel.find({ title: { $regex: req.params.title }, needModerator: searchModerator,  needAnalyst: searchAnalyst });
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}
