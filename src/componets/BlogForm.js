import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";

function BlogForm({ editing }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [originalTitle, setOriginalTitle] = useState("");
  const [originalBody, setOriginalBody] = useState("");
  const [publish, setPublish] = useState(false);
  const [originalPublish, setOriginalPublish] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);

  const { id } = useParams(); //url에서 parameters(id번호)를 가져온다
  const validateForm = () => {
    let validated = true;
    if (title == "") {
      setTitleError(true);
      validated = false;
    }
    if (body == "") {
      setBodyError(true);
      validated = false;
    }
    return validated;
  };
  const onSubmit = () => {
    setTitleError(false);
    setBodyError(false); //reset을 하는 이유는  입력된것이 있는곳에도 에러가 남아있기 때문이다
    if (validateForm()) {
      if (editing) {
        axios
          .patch(`http://localhost:3004/posts/${id}`, {
            title,
            body,
            publish,
          })
          .then((res) => {
            console.log(res);
            navigate(`/blogs/${id}`);
          });
      } else {
        axios
          .post("http://localhost:3004/posts", {
            title,
            body,
            publish,
            createdAt: Date.now(),
          })
          .then(() => {
            //성공하면 then()가 실행된다.
            navigate("/admin");
          });
      }
    }
  };

  useEffect(() => {
    if (editing) {
      axios.get(`http://localhost:3004/posts/${id}`).then((res) => {
        console.log(res);
        setTitle(res.data.title);
        setBody(res.data.body);
        setOriginalTitle(res.data.title);
        setOriginalBody(res.data.body);
        setPublish(res.data.publish);
        setOriginalPublish(res.data.publish);
      });
    }
  }, [id, editing]); //처음한번만 실행

  const isEdited = () => {
    //수정이 되었다면 true, 수정이 되지 않았다면 false가 실행된다.
    return (
      title !== originalTitle ||
      body !== originalBody ||
      publish !== originalPublish
    );
  };

  const goBack = () => {
    if (editing) {
      navigate(`/blogs/${id}`);
    } else {
      navigate(`/blogs`);
    }
  };

  const onChagngePublish = (e) => {
    console.log(e.target.checked);
    setPublish(e.target.checked);
  };
  return (
    <div className="container">
      <h2 className="mb-5 mt-3">{editing ? "Edit" : "Create"} a blog post</h2>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className={`form-control ${titleError ? "border-danger" : ""}`}
          value={title}
          onChange={(e) => {
            //console.log(e.target.value);
            setTitle(e.target.value);
          }}
        />
        {titleError && <div className="text-danger">Title is required</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Body</label>
        <textarea
          className={`form-control ${bodyError ? "border-danger" : ""}`}
          value={body}
          rows="10"
          onChange={(e) => {
            //console.log(e.target.value);
            setBody(e.target.value);
          }}
        />
        {bodyError && <div className="text-danger">Body is required</div>}
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={publish}
          onChange={onChagngePublish}
        />
        <label className="form-check-label">publish</label>
      </div>
      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={editing && !isEdited()}
      >
        {editing ? "Edit" : "Post"}
      </button>
      <button className="btn btn-danger ms-2" onClick={goBack}>
        Cancel
      </button>
    </div>
  );
}

BlogForm.propTypes = {
  editing: PropTypes.bool,
};

BlogForm.defaultProps = {
  editing: false,
};
export default BlogForm;
