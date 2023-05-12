import React, { useState, useEffect } from 'react'

import { Loader, Card, FormField } from '../components';

const RenderCards = ({ data, title }) => {
  if(data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />)
  }

  return (
    <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>{title}</h2>
  )

}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch('http://www.songzhijun.cn:8080/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if(response.ok) {
          const result = await response.json();

          // reverse to show de newest posts first
          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Search function
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>社区展示</h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w[500px]'>浏览由 DALL-E AI 生成的富有想象力和视觉震撼的图像集</p>
      </div>

      <div className='mt-16'>
        <FormField 
          labelName="搜索帖子"
          type="text"
          name="text"
          placeholder="搜索帖子"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-[#666e75] text-xl mb-3'>显示结果 <span className='text-[#222328]'>{searchText}</span></h2>
            )}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
              {searchText ? (
                <RenderCards 
                  data={searchedResults}
                  title="没有找到搜索结果"
                />
              ) : (
                <RenderCards 
                  data={allPosts}
                  title="找不到帖子"
                />
              )}
            </div>
          </>
        )}
      </div>

    </section>
  )
}

export default Home