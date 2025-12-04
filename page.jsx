'use client'

import { useState } from 'react'
import { MessageSquare, Heart, Repeat2, Send, Home, Search, Bell, User } from 'lucide-react'

export default function HomePage() {
  const [posts, setPosts] = useState([
    { id: 1, user: 'علی', username: '@ali', content: 'اولین توییت در Lomus! 🎉', likes: 5 },
    { id: 2, user: 'سارا', username: '@sara', content: 'امروز روز خوبی برای کد زدن است 💻', likes: 12 },
    { id: 3, user: 'رضا', username: '@reza', content: 'لوموس رو دوست دارم! ❤️', likes: 8 },
  ])
  
  const [newPost, setNewPost] = useState('')

  const handlePost = () => {
    if (!newPost.trim()) return
    const newPostObj = {
      id: posts.length + 1,
      user: 'شما',
      username: '@you',
      content: newPost,
      likes: 0
    }
    setPosts([newPostObj, ...posts])
    setNewPost('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* نوار بالایی */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-500">Lomus</h1>
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-600" />
            <Bell className="w-5 h-5 text-gray-600" />
            <User className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </header>

      {/* نوار پایینی */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-3">
          <Home className="w-6 h-6 text-blue-500" />
          <Search className="w-6 h-6 text-gray-500" />
          <Bell className="w-6 h-6 text-gray-500" />
          <MessageSquare className="w-6 h-6 text-gray-500" />
          <User className="w-6 h-6 text-gray-500" />
        </div>
      </nav>

      {/* محتوای اصلی */}
      <main className="max-w-2xl mx-auto pb-20 pt-4 px-4">
        {/* باکس ایجاد توییت */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="چه خبر؟"
                className="w-full border-none focus:outline-none text-lg resize-none"
                rows="2"
              />
              <div className="flex justify-between items-center mt-3">
                <div className="text-blue-500">
                  {/* آیکون‌های رسانه */}
                </div>
                <button
                  onClick={handlePost}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600"
                >
                  توییت
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* لیست توییت‌ها */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold">{post.user}</h3>
                    <span className="text-gray-500">{post.username}</span>
                  </div>
                  <p className="mt-2">{post.content}</p>
                  <div className="flex items-center justify-between mt-4 text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-blue-500">
                      <MessageSquare className="w-5 h-5" />
                      <span>0</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-green-500">
                      <Repeat2 className="w-5 h-5" />
                      <span>0</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-red-500">
                      <Heart className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="hover:text-blue-500">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}