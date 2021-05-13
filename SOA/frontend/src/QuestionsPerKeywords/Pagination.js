import Pagination from "react-bootstrap/Pagination";

function PaginationComponent({ totalItems, pageSize, pageState }) {
  const [activePage, setActivePage] = pageState;

  const changePage = number => {
    setActivePage(number);
  };

  const prevPage = () => {
    setActivePage(prevActivePage => prevActivePage - 1);
  };

  const nextPage = () => {
    setActivePage(prevActivePage => prevActivePage + 1);
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const pages = [];
  
  if (activePage > 1) {
    pages.push(
        <Pagination.Item key={'prev'} onClick={() => prevPage()}>
          Prev
        </Pagination.Item>
    );
  }

  for (let number = 1; number <= totalPages; number++) {
    pages.push(
        <Pagination.Item key={number} onClick={() => changePage(number)} active={activePage === number}>
          {number}
        </Pagination.Item>
    );
  }

  if (activePage < totalPages) {
    pages.push(
        <Pagination.Item key={'next'} onClick={() => nextPage()}>
          Next
        </Pagination.Item>
    );
  }

  return (
      <Pagination className="mb-0 pb-3 justify-content-end" size="sm">
        {pages}
      </Pagination>
  );
}

export default PaginationComponent;
