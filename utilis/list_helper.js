const list_helper =(blogs)=>{
    return 1;
}
const total_likes = (blogs)=>{
    const reducer = (sum, item)=>{
        return sum + item.likes
    }
    return blogs.length === 1 ? blogs[0].likes : blogs.reduce(reducer, 0)
}
const max_likes = (blogs)=>{
    const reducer = (max, item)=>{
        return item.likes > max ? item.likes : max
    }
    return blogs.length === 1 ? blogs[0].likes : blogs.reduce(reducer, 0)
}
const most_liked = (blogs)=>{
    const reducer = (max, item)=>{
        console.log("Current max:", max);
        return item.likes > max.likes ? item : max
    }
    return blogs.reduce(reducer, blogs[0]).author
}
const most_blogs = (blogs)=>{
    const authorCount = blogs.reduce((counts, blog)=>{
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts;
    },{})
    let maxCount = 0;
    let maxAuthor = '';
    console.log(authorCount)
    // Find the author with the highest count
    for (const author in authorCount) {
        if (authorCount[author] > maxCount) {
        maxCount = authorCount[author];
        maxAuthor = author;
        }
    }
    console.log(maxAuthor)
    return maxAuthor;
}
module.exports = {
    list_helper,
    total_likes,
    max_likes,
    most_liked,
    most_blogs,
}