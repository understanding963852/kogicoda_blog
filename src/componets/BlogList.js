import React from "react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Card from "../componets/Card";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../componets/LoadingSpinner";
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom"; //?앞쪽에 pathname 추출

const BlogList = ({ isAdmin }) => {
  const navigate = useNavigate();
  let location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const limit = 5;

  const [query, setQuery] = useSearchParams(); //history를 기억한다
  const pageParam = query.get("page");
  //console.log(pageParam);
  const [locationUrl, setLocationUrl] = useState("");
  useEffect(() => {
    setLocationUrl(location.pathname); //?앞쪽에 pathname 추출
  }, [location]);
  useEffect(() => {
    setNumberOfPages(Math.ceil(numberOfPosts / limit));
  }, [numberOfPosts]);

  const onClickPageButton = (page) => {
    navigate(`${locationUrl}?page=${page}`); //admin과 blogs둘다에서 작동하기위해
    setCurrentPage(page);
    getPost(page);
  };
  // useEffect(() => {
  //   getPost();
  // }, []); //빈배열일때는 한번만 실행한다

  useEffect(() => {
    setCurrentPage(parseInt(pageParam) || 1); //pageParam이 없으면 1이 들어간다
    getPost(parseInt(pageParam) || 1); //pageParam이 문자로 온다
  }, []);

  const getPost = (page = 1) => {
    //setCurrentPage(page); //pagination에서 버튼을 클릭하면 함수가 실행된다. 그때 currentPage를  upgrade하게 된다
    let params = {
      _page: page,
      _limit: limit,
      _sort: "id",
      _order: "desc",
      //title: searchText, //이렇게 적으면 완전히 제목과 동일하게 쳐야 검색이 된다
      title_like: searchText, //이렇게 적으면 일부분이라도 만족하면 검색이 된다.
    };

    if (!isAdmin) {
      params = { ...params, publish: true };
    }
    axios
      .get(`http://localhost:3004/posts`, {
        //params: params,  //키와 value가 같기 때문에 params로 줄일수 있다
        params,
      })
      .then((res) => {
        //받아온 데이터를 사용하기위해서는 .then를 사용해야하고
        //.then(함수)  //then(()=>{})
        //받아온 데이터가 res에 들어간다//response를 줄여서
        //console.log(res);
        //console.log(res.data);
        setNumberOfPosts(res.headers["x-total-count"]);
        //console.log(numberOfPosts);
        setPosts(res.data);
        setLoading(false);
      });
  };

  const deleteBlog = (e, id) => {
    e.stopPropagation();
    console.log("삭제");
    axios.delete(`http://localhost:3004/posts/${id}`).then(() => {
      //setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      getPost(1);
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderBlogList = () => {
    return posts
      .filter((post) => {
        return isAdmin || post.publish;
      })
      .map((post) => {
        return (
          <Card
            key={post.id}
            title={post.title}
            onClick={() => {
              //console.log("실행");
              navigate(`/blogs/${post.id}`);
            }}
          >
            <div>
              {isAdmin ? (
                <button
                  className="btn btn-danger"
                  onClick={(e) => deleteBlog(e, post.id)}
                >
                  Delete
                </button>
              ) : null}
            </div>
          </Card>
        );
      });
  };
  const onSearch = (e) => {
    if (e.key === "Enter") {
      //오타주의 enter키를 쳐야만 함수가 실행되도록
      getPost(1);
      setCurrentPage(1);
      navigate(`${locationUrl}?page=1`);
    }
  };
  return (
    <div>
      <input
        type="text"
        className="form-control"
        placeholder="Search.."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        onKeyUp={onSearch}
      />
      <hr />

      {posts.length === 0 ? (
        <div>"blog posts가 발견되지 않습니다."</div>
      ) : (
        <>
          {renderBlogList()}
          {numberOfPages > 1 && ( //numberOfPages가 1보다 클경우에만 pagination이 보이도록한다
            <Pagination
              currentPage={currentPage}
              numberOfPages={numberOfPages}
              onClick={onClickPageButton}
            />
          )}
        </>
      )}
    </div>
  );
};
BlogList.propTypes = {
  isAdmin: PropTypes.bool,
};
BlogList.defaultProps = {
  isAdmin: false,
};
export default BlogList;
