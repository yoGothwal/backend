// const { test, describe } = require('node:test')
// const assert = require('node:assert');
// const average = require('../utilis/for_testing').average;
const { list_helper, total_likes, max_likes, most_liked ,most_blogs} = require('../utilis/list_helper')

describe('average', () => {
//   test('average of one value is the value itself', () => {
//     assert.strictEqual(average([1]), 1)
//   })

//   test('average of many is calculated right', () => {
//     assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
//   })

//   test('average of empty array is zero', () => {
//     assert.strictEqual(average([]), 0)
//   })
  
//   test('average of 5 10 15', ()=>{
//     assert.strictEqual(average([10,5,15]), 10)
//   })

  const blogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Structured Programming with go to Statements',
        author: 'Donald Knuth',
        url: 'http://www.cs.utexas.edu/users/EWD/ewd02xx/EWD215.PDF',
        likes: 15,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'An Axiomatic Basis for Computer Programming',
        author: 'Tony Hoare',
        url: 'https://www.cs.ox.ac.uk/people/tony.hoare/Hoare1969.pdf',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'The Art of Computer Programming',
        author: 'Donald Knuth',
        url: 'https://www-cs-faculty.stanford.edu/~knuth/taocp.html',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Reflections on Trusting Trust',
        author: 'Ken Thompson',
        url: 'https://dl.acm.org/doi/10.1145/358198.358210',
        likes: 20,
        __v: 0
    },
    {
        _id: '5a422bd71b54a676234d17fd',
        title: 'The Humble Programmer',
        author: 'Edsger W. Dijkstra',
        url: 'https://dl.acm.org/doi/10.1145/358218.358221',
        likes: 12,
        __v: 0
    }
];

  describe('list tests', ()=>{
    test('dummy check',()=>{
      const result = list_helper(blogs)
      expect(result).toBe(1)
    })
    test('total likes', () => {
      expect(total_likes(blogs)).toBe(69)
    })
    test('max likes', () => {
      expect(max_likes(blogs)).toBe(20)
    })
    test('most liked ', () => {
      expect(most_liked(blogs)).toBe(blogs[4].author)
    })
    test('most blogs ', () =>   {
      expect(most_blogs(blogs)).toBe(blogs[0].author)
    })
  })
})
