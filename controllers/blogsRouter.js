const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()

const getTokenFrom = request =>{
    const auth = request.get('authorization')
    if(auth, auth.startsWith('Bearer ')) {
        return auth.replace('Bearer ', '')
    }
    return null
}
blogsRouter.get('/', async (request, response, next) => {

    console.log("Total blogs ",request.user.blogs.length)
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, })

    if(blogs){
      response.json(blogs)
    }
    else{
       response.status(500).json({ error: 'Blogs not found' })
    }
})
blogsRouter.get('/:id', async (request, response, next) => {
    const id = request.params.id
    console.log(id)
    const blog = await Blog.findById(id)
    if(blog) {
        response.json(blog)    
    }
    else{
        response.status(404).json({error: 'blog not found'})
    }
})
blogsRouter.post('/', async (request, response, next) => {
    if(!request.token){
        console.log('failed')
        return
    }
    const { user } = request;
    const newBlog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user.id
    })
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(newBlog)
    await user.save()
    console.log("Blog added")

    response.json(savedBlog)
})
blogsRouter.delete('/:id', async (request, response, next) => {
    console.log("del req")
    if(!request.token){
        console.log('failed')
        return
    }

    const id = request.params.id
    const { user } = request;
    user.blogs = user.blogs.filter(blogID=> blogID.toString() !== id)
    await user.save()

    await Blog.findByIdAndDelete(id)
    console.log("Blog deleted")
    response.status(204).end()
})
blogsRouter.put('/:id', async (request, response, next) => {
    const id = request.params.id
    try {
        const modifiedBlog = request.body
        const newBlog = await Blog.findByIdAndUpdate(id, modifiedBlog, {new: true, runValidators: true, context: 'query'})
        if(newBlog){
            response.json(newBlog)
        }else{
            response.json({error: "Cant find the blog"})
        }
    } catch (error) {
        next(error)
    }
})
module.exports= blogsRouter