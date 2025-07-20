import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const [questions = [], setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [result = {}, setResult] = React.useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);
  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];
      let totalMarks = 0;

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push({
            ...question,
            selectedOption: selectedOptions[index],
            isCorrect: true
          });
          totalMarks++;
        } else {
          wrongAnswers.push({
            ...question,
            selectedOption: selectedOptions[index] || "Not Answered",
            isCorrect: false
          });
        }
      });

      const percentage = ((correctAnswers.length / questions.length) * 100).toFixed(1);
      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
        totalQuestions: questions.length,
        totalCorrect: correctAnswers.length,
        totalWrong: wrongAnswers.length,
        totalMarks,
        percentage,
        examData
      };
      setResult(tempResult);
      
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);
  return (
    examData && questions.length > 0 && (
      <div className="premium-container">
        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && (
          <div className="premium-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Quiz Header */}
            <div className="premium-card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{examData.name}</h2>
                  <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                    Question {selectedQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                <div className="premium-timer" style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '1.25rem',
                  fontWeight: '700'
                }}>
                  ⏰ {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            <div className="premium-card-body">
              {/* Progress Bar */}
              <div style={{ 
                marginBottom: '2rem',
                background: 'var(--gray-200)',
                borderRadius: '10px',
                height: '8px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${((selectedQuestionIndex + 1) / questions.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>

              {/* Question */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: 'var(--gray-900)',
                  lineHeight: '1.5',
                  marginBottom: '1.5rem'
                }}>
                  {questions[selectedQuestionIndex]?.name || 'Loading question...'}
                </h3>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {questions[selectedQuestionIndex]?.options && Object.keys(questions[selectedQuestionIndex].options).map((option, index) => {
                    const isSelected = selectedOptions[selectedQuestionIndex] === option;
                    return (
                      <div
                        key={option}
                        onClick={() => {
                          setSelectedOptions({
                            ...selectedOptions,
                            [selectedQuestionIndex]: option,
                          });
                        }}
                        style={{
                          padding: '1rem 1.5rem',
                          border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--gray-300)'}`,
                          borderRadius: 'var(--border-radius)',
                          background: isSelected ? 'rgba(37, 99, 235, 0.05)' : 'white',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}
                        className="quiz-option"
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--gray-400)'}`,
                          borderRadius: '50%',
                          background: isSelected ? 'var(--primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          {isSelected && '✓'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ color: 'var(--gray-700)' }}>{option}.</strong>
                          <span style={{ marginLeft: '0.5rem', color: 'var(--gray-600)' }}>
                            {questions[selectedQuestionIndex]?.options?.[option] || ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTop: '1px solid var(--gray-200)',
                paddingTop: '1.5rem'
              }}>
                <div>
                  {selectedQuestionIndex > 0 && (
                    <button
                      className="premium-btn premium-btn-outline"
                      onClick={() => setSelectedQuestionIndex(selectedQuestionIndex - 1)}
                    >
                      ← Previous
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedQuestionIndex(index)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: selectedOptions[index] 
                          ? 'var(--success)' 
                          : index === selectedQuestionIndex 
                            ? 'var(--primary)' 
                            : 'var(--gray-300)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>

                <div>
                  {selectedQuestionIndex < questions.length - 1 ? (
                    <button
                      className="premium-btn premium-btn-primary"
                      onClick={() => setSelectedQuestionIndex(selectedQuestionIndex + 1)}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      className="premium-btn premium-btn-secondary"
                      onClick={() => {
                        clearInterval(intervalId);
                        setTimeUp(true);
                      }}
                    >
                      🚀 Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="premium-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="premium-card-header text-center">
              <h2 style={{ margin: 0, fontSize: '2rem' }}>
                {result.verdict === "Pass" ? "🎉 Congratulations!" : "📚 Keep Learning!"}
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
                You {result.verdict === "Pass" ? "passed" : "can retake"} the quiz
              </p>
            </div>

            <div className="premium-card-body">
              {/* Score Circle */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: `conic-gradient(var(--${result.verdict === "Pass" ? "success" : "warning"}) ${result.percentage * 3.6}deg, var(--gray-200) 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                      {result.percentage}%
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div className="premium-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {result.totalCorrect}/{result.totalQuestions}
                  </div>
                  <div style={{ color: 'var(--gray-600)' }}>Correct Answers</div>
                </div>

                <div className="premium-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
                    {examData.duration - secondsLeft}s
                  </div>
                  <div style={{ color: 'var(--gray-600)' }}>Time Taken</div>
                </div>

                <div className="premium-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {result.verdict === "Pass" ? "✅" : "📈"}
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: result.verdict === "Pass" ? 'var(--success)' : 'var(--warning)'
                  }}>
                    {result.verdict}
                  </div>
                  <div style={{ color: 'var(--gray-600)' }}>Result</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="premium-btn premium-btn-primary"
                  onClick={() => setView("review")}
                >
                  📝 Review Answers
                </button>
                <button
                  className="premium-btn premium-btn-outline"
                  onClick={() => navigate("/")}
                >
                  🏠 Back to Home
                </button>
                <button
                  className="premium-btn premium-btn-secondary"
                  onClick={() => {
                    setView("instructions");
                    setSelectedQuestionIndex(0);
                    setSelectedOptions({});
                    setSecondsLeft(examData.duration);
                    setTimeUp(false);
                  }}
                >
                  🔄 Retake Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="premium-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="premium-card-header">
              <h2 style={{ margin: 0 }}>📝 Answer Review</h2>
              <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
                Review your answers and see the correct solutions
              </p>
            </div>

            <div className="premium-card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {questions.map((question, index) => {
                  const selectedAnswer = selectedOptions[index];
                  const isCorrect = question.correctOption === selectedAnswer;
                  
                  return (
                    <div 
                      key={index}
                      className="premium-card"
                      style={{ 
                        border: `2px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                        background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                      }}
                    >
                      <div style={{ padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{ 
                              background: isCorrect ? 'var(--success)' : 'var(--danger)',
                              color: 'white',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              Question {index + 1}
                            </span>
                            <span style={{ fontSize: '1.25rem' }}>
                              {isCorrect ? '✅' : '❌'}
                            </span>
                          </div>
                          <h4 style={{ color: 'var(--gray-900)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                            {question.name}
                          </h4>
                        </div>

                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                          {/* Your Answer */}
                          <div style={{ 
                            padding: '0.75rem 1rem',
                            background: selectedAnswer ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'rgba(156, 163, 175, 0.1)',
                            borderRadius: 'var(--border-radius)',
                            border: selectedAnswer ? `1px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}` : '1px solid var(--gray-400)'
                          }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.25rem' }}>
                              Your Answer:
                            </div>
                            <div style={{ color: 'var(--gray-900)' }}>
                              {selectedAnswer ? `${selectedAnswer}. ${question.options[selectedAnswer]}` : "Not Answered"}
                            </div>
                          </div>

                          {/* Correct Answer */}
                          <div style={{ 
                            padding: '0.75rem 1rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: 'var(--border-radius)',
                            border: '1px solid var(--success)'
                          }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--gray-700)', marginBottom: '0.25rem' }}>
                              Correct Answer:
                            </div>
                            <div style={{ color: 'var(--gray-900)' }}>
                              {question.correctOption}. {question.options[question.correctOption]}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center', 
                marginTop: '2rem',
                borderTop: '1px solid var(--gray-200)',
                paddingTop: '2rem'
              }}>
                <button
                  className="premium-btn premium-btn-outline"
                  onClick={() => navigate("/")}
                >
                  🏠 Back to Home
                </button>
                <button
                  className="premium-btn premium-btn-primary"
                  onClick={() => setView("result")}
                >
                  📊 View Results
                </button>
                <button
                  className="premium-btn premium-btn-secondary"
                  onClick={() => {
                    setView("instructions");
                    setSelectedQuestionIndex(0);
                    setSelectedOptions({});
                    setSecondsLeft(examData.duration);
                    setTimeUp(false);
                  }}
                >
                  🔄 Retake Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
