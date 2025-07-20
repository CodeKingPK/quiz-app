import { message, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteExamById, getAllExams } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = React.useState([]);
  const dispatch = useDispatch();

  const getExamsData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({
        examId,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "📚 Exam Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <span style={{ fontWeight: '600', color: 'var(--gray-900)' }}>
          {text}
        </span>
      ),
    },
    {
      title: "⏱️ Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => (
        <span className="status-badge status-warning">
          {duration} min
        </span>
      ),
    },
    {
      title: "🏷️ Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <span className="status-badge status-success">
          {category}
        </span>
      ),
    },
    {
      title: "🎯 Total Marks",
      dataIndex: "totalMarks",
      key: "totalMarks",
      render: (marks) => (
        <span style={{ fontWeight: '600', color: 'var(--primary)' }}>
          {marks}
        </span>
      ),
    },
    {
      title: "✅ Passing Marks",
      dataIndex: "passingMarks",
      key: "passingMarks",
      render: (marks) => (
        <span style={{ fontWeight: '600', color: 'var(--success)' }}>
          {marks}
        </span>
      ),
    },
    {
      title: "🛠️ Actions",
      key: "action",
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="premium-btn premium-btn-outline"
            onClick={() => navigate(`/admin/exams/edit/${record._id}`)}
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              borderRadius: '6px'
            }}
          >
            ✏️ Edit
          </button>
          <button
            className="premium-btn"
            onClick={() => deleteExam(record._id)}
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              borderRadius: '6px',
              background: 'var(--danger)',
              color: 'white',
              border: 'none'
            }}
          >
            🗑️ Delete
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getExamsData();
  }, []);
  return (
    <div className="premium-container">
      <div className="premium-header">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <PageTitle title="🎓 Quiz Management Dashboard" />
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: 'var(--gray-600)',
              fontSize: '1rem'
            }}>
              Create, edit, and manage all your quizzes
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="premium-btn premium-btn-secondary"
              onClick={() => navigate("/admin/reports")}
            >
              📊 View Reports
            </button>
            <button
              className="premium-btn premium-btn-primary"
              onClick={() => navigate("/admin/exams/add")}
            >
              ➕ Create New Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="premium-table">
        <Table 
          columns={columns} 
          dataSource={exams}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} quizzes`,
          }}
          locale={{
            emptyText: (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                color: 'var(--gray-500)'
              }}>
                <h3>📝 No quizzes found</h3>
                <p>Create your first quiz to get started!</p>
                <button
                  className="premium-btn premium-btn-primary"
                  onClick={() => navigate("/admin/exams/add")}
                  style={{ marginTop: '1rem' }}
                >
                  ➕ Create Quiz
                </button>
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}

export default Exams;
