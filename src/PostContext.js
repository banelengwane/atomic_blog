import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
    return {
      title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      body: faker.hacker.phrase(),
    };
  }

//create context
const PostContext = createContext()

function PostProvider({children}){
    const [posts, setPosts] = useState(() =>
        Array.from({ length: 30 }, () => createRandomPost())
      );
      const [searchQuery, setSearchQuery] = useState("");
    
      // Derived state. These are the posts that will actually be displayed
      const searchedPosts =
        searchQuery.length > 0
          ? posts.filter((post) =>
              `${post.title} ${post.body}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
          : posts;
    
      function handleAddPost(post) {
        setPosts((posts) => [post, ...posts]);
      }
    
      function handleClearPosts() {
        setPosts([]);
      }

      return(
        <PostContext.Provider value={{
            posts: searchedPosts,
            onAddPost: handleAddPost,
            onClearPosts: handleClearPosts,
            searchQuery,
            setSearchQuery
          }}>{children}</PostContext.Provider>
      )
}

//creating a hook
function usePosts(){
    const context = useContext(PostContext);
    // prevent user from accessing the context outside of where if can be provided
    if(context === undefined) throw new Error("PostContext was used outside the PostProvider");
    return context;
}

export {PostProvider, usePosts};