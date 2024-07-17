import React from 'react';

const Post = ({ post, onEdit, onDelete, t }) => {
  return (
    <li>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <button onClick={() => onEdit(post)}>{t('edit')}</button>
      <button onClick={() => onDelete(post.id)}>{t('delete')}</button>
    </li>
  );
};

export default Post;
