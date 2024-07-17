import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchPosts, fetchUsers, createPost, updatePost, deletePost } from './api';
import Post from './Post';
import UserSelector from './UserSelector';
import CommentForm from './CommentForm'; 

function App() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { data: posts, isLoading: isLoadingPosts, error: postsError } = useQuery(['posts'], fetchPosts);
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery(['users'], fetchUsers);

  const createPostMutation = useMutation(createPost, {
    onSuccess: (newPost) => {
      queryClient.setQueryData(['posts'], (oldPosts) => [newPost, ...oldPosts]);
    },
  });

  const updatePostMutation = useMutation(updatePost, {
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (oldPosts) =>
        oldPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
    },
  });

  const deletePostMutation = useMutation(deletePost, {
    onSuccess: (deletedPostId) => {
      queryClient.setQueryData(['posts'], (oldPosts) =>
        oldPosts.filter((post) => post.id !== deletedPostId)
      );
    },
  });

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  const handleCreatePost = useCallback(() => {
    if (newPostTitle.trim() && newPostBody.trim()) {
      createPostMutation.mutate({
        title: newPostTitle,
        body: newPostBody,
        userId: selectedUserId || 1,
      });
      setNewPostTitle('');
      setNewPostBody('');
    }
  }, [newPostTitle, newPostBody, createPostMutation, selectedUserId]);

  const handleUpdatePost = useCallback(() => {
    if (editingPost && newPostTitle.trim() && newPostBody.trim()) {
      updatePostMutation.mutate({
        ...editingPost,
        title: newPostTitle,
        body: newPostBody,
      });
      setEditingPost(null);
      setNewPostTitle('');
      setNewPostBody('');
    }
  }, [editingPost, newPostTitle, newPostBody, updatePostMutation]);

  const handleDeletePost = useCallback((postId) => {
    deletePostMutation.mutate(postId);
  }, [deletePostMutation]);

  const startEditingPost = useCallback((post) => {
    setEditingPost(post);
    setNewPostTitle(post.title);
    setNewPostBody(post.body);
  }, []);

  const handleUserSelection = useCallback((userId) => {
    setSelectedUserId(userId);
  }, []);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  if (isLoadingPosts || isLoadingUsers) {
    return <div>{t('loading')}</div>;
  }
  if (postsError || usersError) {
    return <div>{t('error', { message: postsError?.message || usersError?.message })}</div>;
  }

  const filteredPosts = selectedUserId
    ? posts.filter((post) => post.userId === parseInt(selectedUserId, 10))
    : posts;

  return (
    <div>
      <h1>{t('title')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fr')}>French</button>
      <UserSelector users={users} selectedUserId={selectedUserId} onSelectUser={handleUserSelection} />
      {/* Include the CommentForm component */}
      <CommentForm />
      <div>
        <label htmlFor="title">{t('title')}</label>
        <input
          id="title"
          type="text"
          placeholder={t('title')}
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <label htmlFor="body">{t('body')}</label>
        <input
          id="body"
          type="text"
          placeholder={t('body')}
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
        />
        {editingPost ? (
          <button onClick={handleUpdatePost}>{t('updatePost')}</button>
        ) : (
          <button onClick={handleCreatePost}>{t('createPost')}</button>
        )}
      </div>
      <ul>
        {filteredPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onEdit={startEditingPost}
            onDelete={handleDeletePost}
            t={t}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
