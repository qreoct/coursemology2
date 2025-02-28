import { FC, useEffect } from 'react';
import { Pagination } from '@mui/material';

interface Props {
  // Typing is any as it can be an array of any type
  items: any[];
  itemsPerPage: 12 | 24 | 36 | 42;
  // Typing is also any, following from items: any[]
  setSlicedItems: React.Dispatch<React.SetStateAction<any[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

/*
This componenet serves as an abstraction for front end pagination, and is written
on top of the pagination that MUI offers.

How to use: (can refer to CourseDisplay.tsx for example)

items - An array of objects that you need to paginate.

itemsPerPage: - The number of items you want per page (12, 24, 36 or 42)

setSlicedItems - A useState function, to set your sliced items for you to use in a 
higher component.
e.g. const [slicedItems, setSlicedItems] = useState(items);
You can then manipulate the slicedItems however you choose.

page, setPage - Initialize these with useState(1) and pass them down.
This is to ensure that multiple paginations within the same page are both synced properly.
*/

const PaginationHelper: FC<Props> = (props) => {
  const { items, itemsPerPage, setSlicedItems, page, setPage } = props;

  const count = Math.ceil(items.length / itemsPerPage);

  useEffect(() => {
    const begin = (page - 1) * itemsPerPage;
    setSlicedItems(items.slice(begin, begin + itemsPerPage));

    if (count < page) {
      setPage(1);
    }
  }, [page, items]);

  const handleChange: (
    _e: React.ChangeEvent<unknown>,
    pageNum: number,
  ) => void = (_e, pageNum) => {
    setPage(pageNum);
  };

  return (
    <>
      {count > 1 && (
        <Pagination
          color="primary"
          variant="outlined"
          style={{ padding: 24, display: 'flex', justifyContent: 'center' }}
          count={count}
          page={page}
          onChange={handleChange}
        />
      )}
    </>
  );
};

export default PaginationHelper;
