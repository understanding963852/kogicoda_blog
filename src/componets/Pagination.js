import React from "react";
import PropTypes from "prop-types";

const Pagination = ({ currentPage, numberOfPages, onClick, limit }) => {
  //numberOfPages 페이지의 갯수(5개씩 몇개의 페이지가 될것인가)
  //currentPage  클릭한 번호의 버튼
  const currentSet = Math.ceil(currentPage / limit); //6~10까지는 2번째셋트, 11~15까지는 3번째셋트,currentPage 클릭한번호
  const lastSet = Math.ceil(numberOfPages / limit); //마지막셋트,numberOfPages:전체list갯수
  const startPage = limit * (currentSet - 1) + 1; // 8를 클릭하면 start는 6(6~10이 보여야하기 때문이다)
  //console.log(startPage);
  const numberOfPagesForset =
    currentSet === lastSet ? numberOfPages % limit : limit;
  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        {currentSet !== 1 && ( //currentSet이 1이 아닐때만 보인다
          <li className="page-item">
            <div
              className="page-link cursor-pointer"
              onClick={() => {
                onClick(startPage - limit);
              }}
            >
              Previous
            </div>
          </li>
        )}
        {Array(numberOfPagesForset)
          .fill(startPage)
          .map((value, index) => value + index)
          .map((pageNumber) => {
            return (
              <li
                key={pageNumber}
                className={`page-item ${
                  currentPage === pageNumber ? "active" : ""
                }`}
              >
                <div
                  className="page-link cursor-pointer"
                  onClick={() => {
                    onClick(pageNumber);
                  }}
                >
                  {pageNumber}
                </div>
              </li>
            );
          })}
        {currentSet !== lastSet && (
          <li className="page-item">
            <div
              className="page-link cursor-pointer"
              onClick={() => {
                onClick(startPage + limit);
              }}
            >
              Next
            </div>
          </li>
        )}
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  numberOfPages: PropTypes.number.isRequired, //isRequired는 필수값이라는 의미이다
  onClick: PropTypes.func.isRequired,
  limit: PropTypes.number,
};
Pagination.defaultProps = {
  currentPage: 1,
  limit: 5,
};
export default Pagination;
