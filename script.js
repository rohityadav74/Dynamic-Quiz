let questions = [];

// Handle question type selection and show appropriate input fields
document.getElementById('questionType').addEventListener('change', function() {
  const questionType = this.value;
  const questionContent = document.getElementById('questionContent');
  questionContent.innerHTML = ''; // Clear previous form

  if (questionType === 'mcq') {
    questionContent.innerHTML = `
      <h3>MCQ Question</h3>
      <input type="text" id="mcqQuestion" placeholder="Enter question">
      <input type="text" id="mcqOption1" placeholder="Option 1">
      <input type="text" id="mcqOption2" placeholder="Option 2">
      <input type="text" id="mcqOption3" placeholder="Option 3">
      <input type="text" id="mcqOption4" placeholder="Option 4">
      <input type="text" id="mcqAnswer" placeholder="Correct Answer">
    `;
  } else if (questionType === 'singleChoice') {
    questionContent.innerHTML = `
      <h3>Single Choice Question</h3>
      <input type="text" id="singleChoiceQuestion" placeholder="Enter question">
      <input type="text" id="singleChoiceAnswer" placeholder="Correct Answer (Yes/No)">
    `;
  } else if (questionType === 'fillBlank') {
    questionContent.innerHTML = `
      <h3>Fill in the Blank Question</h3>
      <input type="text" id="fillBlankQuestion" placeholder="Enter question (use ____ for blank)">
      <input type="text" id="fillBlankAnswer" placeholder="Correct Answer">
    `;
  } else if (questionType === 'subjective') {
    questionContent.innerHTML = `
      <h3>Subjective Question</h3>
      <input type="text" id="subjectiveQuestion" placeholder="Enter question">
    `;
  }
});

// Add question to the list with image support
document.getElementById('addQuestion').addEventListener('click', function() {
  const questionType = document.getElementById('questionType').value;
  let question = {};

  // Handle optional image upload
  const imageInput = document.getElementById('questionImage');
  const imageFile = imageInput.files[0];

  const addQuestionToList = (imageUrl = '') => {
    if (questionType === 'mcq') {
      question = {
        type: 'mcq',
        question: document.getElementById('mcqQuestion').value,
        options: [
          document.getElementById('mcqOption1').value,
          document.getElementById('mcqOption2').value,
          document.getElementById('mcqOption3').value,
          document.getElementById('mcqOption4').value
        ],
        answer: document.getElementById('mcqAnswer').value,
        image: imageUrl
      };
    } else if (questionType === 'singleChoice') {
      question = {
        type: 'singleChoice',
        question: document.getElementById('singleChoiceQuestion').value,
        answer: document.getElementById('singleChoiceAnswer').value,
        image: imageUrl
      };
    } else if (questionType === 'fillBlank') {
      question = {
        type: 'fillBlank',
        question: document.getElementById('fillBlankQuestion').value,
        answer: document.getElementById('fillBlankAnswer').value,
        image: imageUrl
      };
    } else if (questionType === 'subjective') {
      question = {
        type: 'subjective',
        question: document.getElementById('subjectiveQuestion').value,
        image: imageUrl
      };
    }

    // Add question to the questions array
    questions.push(question);
    alert('Question added!');
  };

  // Handle image upload asynchronously
  if (imageFile) {
    const reader = new FileReader();
    reader.onloadend = function() {
      addQuestionToList(reader.result); // Add question with image once it's loaded
    };
    reader.readAsDataURL(imageFile);
  } else {
    addQuestionToList(); // Add question without image
  }
});

// Generate the quiz form for students
document.getElementById('generateQuiz').addEventListener('click', function() {
  const quizForm = document.getElementById('quizForm');
  quizForm.innerHTML = ''; // Clear previous content

  questions.forEach((question, index) => {
    let questionBlock = `<div class="question-block"><h2>${question.question}</h2>`;

    // Display image if present
    if (question.image) {
      questionBlock += `<img src="${question.image}" alt="Question Image" style="max-width:100%;height:auto;">`;
    }

    // Add answer options based on question type
    if (question.type === 'mcq') {
      question.options.forEach((option, i) => {
        questionBlock += `<label><input type="radio" name="q${index}" value="${option}"> ${option}</label><br>`;
      });
    } else if (question.type === 'singleChoice') {
      questionBlock += `<label><input type="radio" name="q${index}" value="Yes"> Yes</label><br>`;
      questionBlock += `<label><input type="radio" name="q${index}" value="No"> No</label><br>`;
    } else if (question.type === 'fillBlank') {
      questionBlock += `<input type="text" name="q${index}" placeholder="Your answer here">`;
    } else if (question.type === 'subjective') {
      questionBlock += `<textarea name="q${index}" rows="4" placeholder="Write your answer here"></textarea>`;
    }

    questionBlock += `</div>`;
    quizForm.innerHTML += questionBlock;
  });

  // Show the quiz container
  document.querySelector('.quiz-container').style.display = 'block';
});

// Submit the quiz and calculate the result
document.getElementById('submitQuiz').addEventListener('click', function(event) {
  event.preventDefault();
  let correctAnswers = 0;
  const totalQuestions = questions.length;

  questions.forEach((question, index) => {
    let studentAnswer = '';
    if (question.type === 'mcq' || question.type === 'singleChoice') {
      studentAnswer = document.querySelector(`input[name="q${index}"]:checked`)?.value;
    } else if (question.type === 'fillBlank') {
      studentAnswer = document.querySelector(`input[name="q${index}"]`)?.value;
    } else if (question.type === 'subjective') {
      studentAnswer = document.querySelector(`textarea[name="q${index}"]`)?.value;
    }

    // Check answers only for objective types (MCQ, Single Choice, Fill in the Blank)
    if ((question.type === 'mcq' || question.type === 'singleChoice' || question.type === 'fillBlank') && studentAnswer === question.answer) {
      correctAnswers++;
    }
  });

  // Display the result
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = `<h2>Results</h2><p>You answered ${correctAnswers} out of ${totalQuestions} questions correctly.</p>`;
});
