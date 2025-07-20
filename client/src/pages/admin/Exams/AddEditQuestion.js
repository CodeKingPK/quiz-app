import { Form, message, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
    selectedQuestion,
    setSelectedQuestion
}) {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        exam: examId,
      };

      let response
        if(selectedQuestion){
            response = await editQuestionById({
                ...requiredPayload,
                questionId: selectedQuestion._id
            })
        }
        else{
            response = await addQuestionToExam(requiredPayload);
        }
      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }
      setSelectedQuestion(null)
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>
            {selectedQuestion ? '✏️' : '➕'}
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            {selectedQuestion ? "Edit Question" : "Add New Question"}
          </span>
        </div>
      }
      visible={showAddEditQuestionModal}
      footer={false}
      onCancel={() => {
        setShowAddEditQuestionModal(false)
        setSelectedQuestion(null)
      }}
      width={800}
      style={{ top: 20 }}
    >
      <div style={{ padding: '1rem 0' }}>
        <Form 
          onFinish={onFinish} 
          layout="vertical"
          initialValues={{
            name: selectedQuestion?.name,
            A: selectedQuestion?.options?.A,
            B: selectedQuestion?.options?.B,
            C: selectedQuestion?.options?.C,
            D: selectedQuestion?.options?.D,
            correctOption: selectedQuestion?.correctOption,
          }}
        >
          {/* Question Text */}
          <Form.Item 
            name="name" 
            label={
              <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                📝 Question Text
              </span>
            }
            rules={[{ required: true, message: 'Please enter the question!' }]}
          >
            <textarea 
              className="premium-input"
              placeholder="Enter your question here..."
              rows={3}
              style={{ 
                width: '100%', 
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </Form.Item>

          {/* Options Grid */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem',
              fontWeight: '600', 
              color: 'var(--gray-700)' 
            }}>
              🔤 Answer Options
            </label>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1rem' 
            }}>
              <Form.Item 
                name="A" 
                label="Option A"
                rules={[{ required: true, message: 'Option A is required!' }]}
              >
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="Enter option A"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item 
                name="B" 
                label="Option B"
                rules={[{ required: true, message: 'Option B is required!' }]}
              >
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="Enter option B"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item 
                name="C" 
                label="Option C"
                rules={[{ required: true, message: 'Option C is required!' }]}
              >
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="Enter option C"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Form.Item 
                name="D" 
                label="Option D"
                rules={[{ required: true, message: 'Option D is required!' }]}
              >
                <input 
                  type="text" 
                  className="premium-input"
                  placeholder="Enter option D"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
          </div>

          {/* Correct Answer */}
          <Form.Item 
            name="correctOption" 
            label={
              <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                ✅ Correct Answer
              </span>
            }
            rules={[
              { required: true, message: 'Please select the correct option!' },
              { pattern: /^[ABCD]$/, message: 'Please enter A, B, C, or D' }
            ]}
          >
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['A', 'B', 'C', 'D'].map(option => (
                <label key={option} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  border: '2px solid var(--gray-300)',
                  borderRadius: 'var(--border-radius)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  minWidth: '80px',
                  justifyContent: 'center'
                }}>
                  <input 
                    type="radio" 
                    name="correctOption" 
                    value={option}
                    style={{ margin: 0 }}
                  />
                  <span style={{ fontWeight: '600' }}>Option {option}</span>
                </label>
              ))}
            </div>
          </Form.Item>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '1rem',
            borderTop: '1px solid var(--gray-200)',
            paddingTop: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <button
              className="premium-btn premium-btn-outline"
              type="button"
              onClick={() => {
                setShowAddEditQuestionModal(false)
                setSelectedQuestion(null)
              }}
            >
              ❌ Cancel
            </button>
            <button className="premium-btn premium-btn-primary" type="submit">
              {selectedQuestion ? '💾 Update Question' : '➕ Add Question'}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

export default AddEditQuestion;
