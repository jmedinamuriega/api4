import React, { useCallback } from 'react';

const UserSelector = ({ users, selectedUserId, onSelectUser }) => {
  console.log('Rendering UserSelector');

  const handleUserChange = useCallback((event) => {
    onSelectUser(event.target.value);
  }, [onSelectUser]);

  return (
    <select value={selectedUserId} onChange={handleUserChange}>
      <option value="">All Users</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
};

export default React.memo(UserSelector);
