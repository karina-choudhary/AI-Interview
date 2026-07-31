import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function InterviewHistory() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "https://ai-interview-a2kn.onrender.com/api/interview/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setInterviews(res.data.interviews);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="history-page">

      <h1>Interview History</h1>

      {interviews.length === 0 ? (
        <h3>No Interview Found</h3>
      ) : (
        interviews.map((item) => (
          <div className="history-card" key={item._id}>

            <h3>
              Interview
            </h3>

            <p>
              Score : <b>{item.score}%</b>
            </p>

            <p>
              Status : {item.status}
            </p>

            <p>
              Date :
              {" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <button
              onClick={() =>
                navigate(`/feedback/${item._id}`)
              }
            >
              View Report
            </button>

          </div>
        ))
      )}
    </div>
  );
}

export default InterviewHistory;