import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  return (
    user && (
      <div className="premium-container">
        <div className="premium-header">
          <PageTitle title={`Hi ${user.name}, Welcome to Quiz Application`} />
          {user.isAdmin && (
            <div style={{ marginTop: '1rem' }}>
              <button 
                className="premium-btn premium-btn-primary"
                onClick={() => navigate('/admin/exams')}
                style={{ marginRight: '1rem' }}
              >
                🛠️ Admin Dashboard
              </button>
              <button 
                className="premium-btn premium-btn-secondary"
                onClick={() => navigate('/admin/exams/add')}
              >
                ➕ Create New Quiz
              </button>
            </div>
          )}
        </div>
        
        <Row gutter={[24, 24]}>
          {exams.map((exam) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={exam._id}>
              <div className="quiz-card">
                <div className="quiz-card-content">
                  <h2 className="quiz-card-title">{exam?.name}</h2>
                  
                  <div className="quiz-card-info">
                    <div className="quiz-info-item">
                      📚 <span><strong>Category:</strong> {exam.category}</span>
                    </div>
                    <div className="quiz-info-item">
                      🎯 <span><strong>Total Marks:</strong> {exam.totalMarks}</span>
                    </div>
                    <div className="quiz-info-item">
                      ✅ <span><strong>Passing Marks:</strong> {exam.passingMarks}</span>
                    </div>
                    <div className="quiz-info-item">
                      ⏰ <span><strong>Duration:</strong> {exam.duration} minutes</span>
                    </div>
                  </div>

                  <button
                    className="premium-btn premium-btn-primary"
                    onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                    style={{ width: '100%' }}
                  >
                    🚀 Start Exam
                  </button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        
        {exams.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem', 
            background: 'white', 
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
              📝 No quizzes available at the moment
            </h3>
            <p style={{ color: 'var(--gray-500)' }}>
              Check back later for new quizzes!
            </p>
          </div>
        )}
      </div>
    )
  );
}

export default Home;
