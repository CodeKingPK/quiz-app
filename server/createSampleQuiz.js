const mongoose = require("mongoose");
const examModel = require("./models/examModel");
const questionModel = require("./models/questionModel");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

const createSampleQuiz = async () => {
  try {
    console.log("🚀 Creating sample quiz with MCQ questions...");

    // Create a sample exam
    const sampleExam = new examModel({
      name: "JavaScript Fundamentals Quiz",
      duration: 300, // 5 minutes
      category: "Programming",
      totalMarks: 5,
      passingMarks: 3,
    });

    const savedExam = await sampleExam.save();
    console.log("✅ Sample exam created:", savedExam.name);

    // Sample MCQ questions
    const sampleQuestions = [
      {
        name: "Which of the following is used to declare a variable in JavaScript?",
        options: {
          A: "var",
          B: "variable",
          C: "declare",
          D: "v"
        },
        correctOption: "A",
        exam: savedExam._id
      },
      {
        name: "What does 'DOM' stand for in web development?",
        options: {
          A: "Document Object Model",
          B: "Data Object Management",
          C: "Dynamic Output Method",
          D: "Document Oriented Method"
        },
        correctOption: "A",
        exam: savedExam._id
      },
      {
        name: "Which method is used to add an element to the end of an array in JavaScript?",
        options: {
          A: "append()",
          B: "push()",
          C: "add()",
          D: "insert()"
        },
        correctOption: "B",
        exam: savedExam._id
      },
      {
        name: "What is the correct way to write a JavaScript comment?",
        options: {
          A: "<!-- This is a comment -->",
          B: "/* This is a comment */",
          C: "// This is a comment",
          D: "Both B and C are correct"
        },
        correctOption: "D",
        exam: savedExam._id
      },
      {
        name: "Which operator is used to compare both value and type in JavaScript?",
        options: {
          A: "==",
          B: "===",
          C: "=",
          D: "!="
        },
        correctOption: "B",
        exam: savedExam._id
      }
    ];

    // Insert all questions
    const savedQuestions = await questionModel.insertMany(sampleQuestions);
    console.log(`✅ ${savedQuestions.length} sample questions created`);

    console.log("\n🎉 Sample quiz setup complete!");
    console.log("📝 Quiz Name: JavaScript Fundamentals Quiz");
    console.log("⏱️  Duration: 5 minutes");
    console.log("📊 Total Questions: 5");
    console.log("🎯 Passing Score: 3");
    console.log("\n🔗 You can now test the quiz at: http://localhost:3000");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating sample quiz:", error.message);
    process.exit(1);
  }
};

// Create another sample quiz
const createAdvancedQuiz = async () => {
  try {
    const advancedExam = new examModel({
      name: "React Concepts Quiz",
      duration: 480, // 8 minutes
      category: "Frontend Development",
      totalMarks: 6,
      passingMarks: 4,
    });

    const savedExam = await advancedExam.save();

    const reactQuestions = [
      {
        name: "What is JSX in React?",
        options: {
          A: "A template engine",
          B: "A syntax extension for JavaScript",
          C: "A database query language",
          D: "A CSS framework"
        },
        correctOption: "B",
        exam: savedExam._id
      },
      {
        name: "Which method is used to update state in a React component?",
        options: {
          A: "updateState()",
          B: "changeState()",
          C: "setState()",
          D: "modifyState()"
        },
        correctOption: "C",
        exam: savedExam._id
      },
      {
        name: "What is the purpose of React hooks?",
        options: {
          A: "To add state and lifecycle features to functional components",
          B: "To create class components",
          C: "To style components",
          D: "To handle routing"
        },
        correctOption: "A",
        exam: savedExam._id
      },
      {
        name: "Which hook is used for side effects in React?",
        options: {
          A: "useState",
          B: "useEffect",
          C: "useContext",
          D: "useReducer"
        },
        correctOption: "B",
        exam: savedExam._id
      },
      {
        name: "What is the Virtual DOM?",
        options: {
          A: "A copy of the real DOM in memory",
          B: "A new browser API",
          C: "A React component",
          D: "A CSS technique"
        },
        correctOption: "A",
        exam: savedExam._id
      },
      {
        name: "How do you pass data from parent to child component in React?",
        options: {
          A: "Using state",
          B: "Using props",
          C: "Using context",
          D: "Using refs"
        },
        correctOption: "B",
        exam: savedExam._id
      }
    ];

    await questionModel.insertMany(reactQuestions);
    console.log("✅ React quiz created successfully!");
  } catch (error) {
    console.error("❌ Error creating React quiz:", error.message);
  }
};

const main = async () => {
  await createSampleQuiz();
  await createAdvancedQuiz();
};

main();
