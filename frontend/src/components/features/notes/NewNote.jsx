import { PulseLoader } from 'react-spinners';
import { useGetUsersQuery } from '../users/usersApiSlice';
import NewNoteForm from './NewNoteForm';

const NewNote = () => {
  const { users } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users) return <PulseLoader color={'#fff'} />;

  const content = <NewNoteForm users={users} />;

  return content;
};
export default NewNote;
