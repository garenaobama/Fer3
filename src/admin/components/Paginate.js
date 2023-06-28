import { Button } from 'react-bootstrap';

export default function Paginate({ currentPage, totalPages, handlePageChange, handlePrevPage, handleNextPage }) {
  const renderPaginationButtons = () => {
    const buttons = [];

    buttons.push(
      <Button
        variant="light"
        className='border'
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        key="prev"
      >
        Prev
      </Button>
    );

    // Add previous page button if available
    if (currentPage > 1) {
      buttons.push(
        <Button
          key={currentPage - 1}
          className='mx-2 border'
          variant="light"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </Button>
      );
    }

    // Add current page button
    buttons.push(
      <Button
        key={currentPage}
        variant="primary"
        className='border'
        onClick={() => handlePageChange(currentPage)}
      >
        {currentPage}
      </Button>
    );

    // Add next page button if available
    if (currentPage < totalPages) {
      buttons.push(
        <Button
          key={currentPage + 1}
          variant="light"
          className='mx-2 border'
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </Button>
      );
    }

    buttons.push(
      <Button
        variant="light"
        className='border'
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        key="next"
      >
        Next
      </Button>
    );

    return buttons;
  };

  return <div className="pagination mb-3 justify-content-end">{renderPaginationButtons()}</div>;
}