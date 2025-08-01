const { default: axiosInstance } = require("./axiosInstance");

export const addExam = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/exams/add", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAllExams = async () => {
  try {
    const response = await axiosInstance.post("/api/exams/get-all-exams");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getExamById = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/exams/get-exam-by-id", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const editExamById = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/exams/edit-exam-by-id", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteExamById = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/exams/delete-exam-by-id", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
