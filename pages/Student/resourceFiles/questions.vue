<script setup lang="ts">
  definePageMeta({
    layout: "studentview",
  });
  import { useRoute, useRouter } from 'vue-router';
  import { ref, onMounted, onBeforeUnmount,computed } from 'vue';
  import { Button } from '@/components/ui/button';
  //Redirect user if not signed in
  import { useLocalStorage } from "@vueuse/core";
  const studentId = Number(useLocalStorage("userId", null).value);
  if (studentId === 0) {
    const router = useRouter();
    router.push("/");
  }

  const client = useSupabaseClient();
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false); // Add loading state

  // Define reactive variables for your data
  const currentTopic = ref<'BTT' | 'FTT'>(route.query.topic as 'BTT' | 'FTT');
  const currentType = ref<'practise' | 'test'>(route.query.type as 'practise' | 'test');
  const selectedQuestions = ref<number | null>(
    currentType.value === 'practise' && route.query.questions
      ? Number(route.query.questions)
      : null
  );

  //Shuffles questions extracted from Supabase
  const shuffledQuestions = computed(() => {
    // Shuffle the questions array
    const shuffled = [...questions.value];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  const questions = ref<any[]>([]);
  const answers = ref<any[]>([]);
  const selectedAnswers = ref<number[]>([]); // Track selected answers for each question
  const feedbackMessages = ref<string[]>([]); // Track feedback for each question
  const answerCorrect = ref<boolean[]>([]); // Track if each answer is correct
    

  interface CorrectAnswer {
    qid: number; // Use the appropriate type for your qid
    aid: number; // Use the appropriate type for your aid
  }

  // Declare your reactive arrays with explicit types
  const selectedAnswersForTest = ref<number[]>(new Array(shuffledQuestions.value.length).fill(null)); // To store user's selected answers
  const correctAnswers = ref<CorrectAnswer[]>([]);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  //Upload test results to Supabase after user submits
  const uploadTestResults = async (results: any[], currentTopic: string) => {
    const userId = useLocalStorage('userId', null); //get current user
    const uid: number = userId.value || 0; // Ensure userId is not null or undefined
    const resultsString: string = JSON.stringify(results); // Convert results array to JSON string
    const topic: string = currentTopic;
    try {
      // Insert data into Supabase
      const { data, error } = await client
        .from('test_results') // Specify the table and type
        .insert({
          uid: uid,
          results: resultsString,
          currentTopic: topic
        }) // Insert the dataToUpload in an array
        .select(); // Optionally include .select() to return the inserted data

      if (error) {
        console.error('Error uploading test results:', error);
      } else {
        console.log('Test results uploaded successfully:', data);
      }
    } catch (err) {
      console.error('Error during Supabase operation:', err);
    }
  };

  //Uploads results and delays for 1s before navigating to Revision Review
  const evaluateAnswers = async () => {
    loading.value = true; // Show loading state immediately after the submit button is clicked
    
    const results = shuffledQuestions.value.map((question, index) => {
      const selectedAid = selectedAnswersForTest.value[index];
      const correctAnswer = correctAnswers.value.find(answer => answer.qid === question.qid);

      return {
        qid: question.qid,
        aid: selectedAid !== null && selectedAid !== undefined ? selectedAid : 0, // Use '0' if no selection
        isCorrect: correctAnswer && correctAnswer.aid === selectedAid,
      };
    });

    try {
      // Wait for the upload to complete
      await uploadTestResults(results, currentTopic.value);
      
      // Introduce a small delay (e.g., 1 second) to ensure Supabase data is fully available
      await delay(1000);
    } catch (error) {
      console.error("Error uploading test results:", error);
    } finally {
      loading.value = false; // Remove loading state before navigating
    }

    // Now navigate to the review page
    navigateToReviewPage();
  };

  const navigateToReviewPage = () => {
    router.push('/Student/resourceFiles/revisionReview');
  };

  //Timer function
  const timeRemaining = ref(900);
  const interval = ref<number | null>(null);
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeRemaining.value / 60);
    const seconds = timeRemaining.value % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  });

  const startTimer = () => {
    interval.value = window.setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--;
      } else {
        endTest();
      }
    }, 1000);
  };

  const endTest = () => {
    if (interval.value) {
      clearInterval(interval.value as number); // Ensure to cast interval.value to number
    }
    alert('Time’s up! Your test is automatically submitted.');
    // Trigger test submission or review here
  };
  onMounted(() => {
    startTimer();
  });

  onBeforeUnmount(() => {
    if (interval.value) {
      clearInterval(interval.value as number); // Ensure to cast interval.value to number
    }
  });

  //Retrieve BTT-related qn and ans
  if (currentTopic.value === "BTT") {
    const BTTquestions = ref<BTT_questions[]>([]);
    const BTTanswers = ref<BTT_answers[]>([]);
    
    interface BTT_questions {
      qid: number;
      question: string;
      topic: string;
    }
    
    interface BTT_answers {
      aid: number;
      qid: number;
      option: string;
      is_correct: boolean;
    }

    onMounted(async () => {
      const { data: BTTquestionsData, error: BTTquestionsError } = await client
        .from('BTT_questions')
        .select('*');

      if (BTTquestionsError) {
        console.error('Error fetching BTT questions:', BTTquestionsError);
        return;
      }

      if (BTTquestionsData) {
        BTTquestions.value = BTTquestionsData;
        questions.value = BTTquestions.value; // Limit to selected questions
        feedbackMessages.value = new Array(questions.value.length).fill(''); // Initialize feedback messages
        answerCorrect.value = new Array(questions.value.length).fill(null); // Initialize correctness tracking
      }

      const { data: BTTanswersData, error: BTTanswersError } = await client
        .from('BTT_answers')
        .select('*');

      if (BTTanswersError) {
        console.error('Error fetching BTT answers:', BTTanswersError);
        return;
      }

      if (BTTanswersData) {
        BTTanswers.value = BTTanswersData;
        answers.value = BTTanswers.value; // Store all answers
      }
    });
    // Fetch correct answers from Supabase
      onMounted(async () => {
        const { data, error } = await client
          .from('BTT_questions') 
          .select('qid, aid')
          .eq('is_correct', true); // Fetch only correct answers
        
        if (data) {
          correctAnswers.value = data.map(item => ({ qid: item.qid, aid: item.aid }));
        }
      });

  // Retrieve FTT-related qn and ans
  } else if (currentTopic.value === "FTT") {
    const FTTquestions = ref<FTT_questions[]>([]);
    const FTTanswers = ref<FTT_answers[]>([]);
    
    interface FTT_questions {
      qid: number;
      question: string;
      topic: string;
    }
    
    interface FTT_answers {
      aid: number;
      qid: number;
      option: string;
      is_correct: boolean;
    }

    onMounted(async () => {
      const { data: FTTquestionsData, error: FTTquestionsError } = await client
        .from('FTT_questions')
        .select('*');

      if (FTTquestionsError) {
        console.error('Error fetching FTT questions:', FTTquestionsError);
        return;
      }

      if (FTTquestionsData) {
        FTTquestions.value = FTTquestionsData;
        questions.value = FTTquestions.value; // Limit to selected questions
        feedbackMessages.value = new Array(questions.value.length).fill(''); // Initialize feedback messages
        answerCorrect.value = new Array(questions.value.length).fill(null); // Initialize correctness tracking
      }

      const { data: FTTanswersData, error: FTTanswersError } = await client
        .from('FTT_answers')
        .select('*');

      if (FTTanswersError) {
        console.error('Error fetching FTT answers:', FTTanswersError);
        return;
      }

      if (FTTanswersData) {
        FTTanswers.value = FTTanswersData;
        answers.value = FTTanswers.value; // Store all answers
      }
    });
    // Fetch correct answers from Supabase
    onMounted(async () => {
      const { data, error } = await client
        .from('FTT_questions')
        .select('qid, aid')
        .eq('is_correct', true); // Fetch only correct answers
      
      if (data) {
        correctAnswers.value = data.map(item => ({ qid: item.qid, aid: item.aid }));
      }
    });
  }

  // Check selected answer against correct answer
  function checkAnswer(index: number, qid: number, selectedAid: number) {
    const correctAnswer = answers.value.find(answer => answer.qid === qid && answer.is_correct);
    
    // Update feedback and correctness based on selected answer
    if (selectedAid) {
      if (correctAnswer && correctAnswer.aid === selectedAid) {
        feedbackMessages.value[index] = 'Correct!';
        answerCorrect.value[index] = true; // Mark as correct
      } else {
        feedbackMessages.value[index] = 'That is wrong. Please try again.';
        answerCorrect.value[index] = false; // Mark as incorrect
      }
    }
    selectedAnswers.value[index] = selectedAid; // Store the selected answer
  }

</script>

<template>
  <head>
    <title v-if="currentType === 'practise'">
      {{ currentTopic }} Practice Questions
    </title>
    <title v-else>
      {{ currentTopic }} Mock Test
    </title>
  </head>
  <!-- Back button -->
  <div>
    <NuxtLink to="/Student/resourceFiles/questionsPage" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Question Page</h1>
    </NuxtLink>
  </div>

  <!-- Practise layout -->
  <div v-if="currentType === 'practise'">
    <div v-for="(question, index) in shuffledQuestions.slice(0, selectedQuestions)" :key="question.qid" class="qnDiv">
      <h1 class="questionTitle">{{ question.question }}</h1>
      <img v-if="question.image !== null" :src="question.image" class="m-4">
      
      <div v-for="answer in answers.filter(a => a.qid === question.qid)" :key="answer.aid">
        <Card
          :style="{ 
            backgroundColor: 
              (selectedAnswers[index] === answer.aid && answerCorrect[index] === true) ? '#72c472' : 
              (selectedAnswers[index] === answer.aid && answerCorrect[index] === false) ? '#d25757' : 
              (selectedAnswers[index] === answer.aid) ? '#4682B4' : '#71b7e3' 
          }"
          class="mb-2 cursor-pointer text-black"
          @click="() => { selectedAnswers[index] = answer.aid; feedbackMessages[index] = ''; answerCorrect[index] = null; }"
        >
          <input type="radio" :value="answer.aid" v-model="selectedAnswers[index]" class="hidden" />
          <div class="p-4 text-white">
            {{ answer.option_text }}
          </div>
        </Card>
      </div>
      <div class="button-container" style="margin-top: 20px;">
        <Button class="checkAnswer" @click="checkAnswer(index, question.qid, selectedAnswers[index])">Check answer</Button>
      </div>
      <p class="mb-5 font-xxl font-bold">{{ feedbackMessages[index] }}</p>
      <hr>
    </div>
    
    <div class="text-center font-bold" style="font-size: 40px;">
      Congrats! You have reached the end.
      <div>
          <NuxtLink to="/Student/resourceFiles/questionsPage">
              <Button class="checkAnswer">Go Back</Button>
          </NuxtLink>
      </div>
    </div>
  </div>

  <!-- Test layout -->
  <div v-if="currentType === 'test'">
    <div class="timer text-center font-bold text-xl">
      Time Remaining: {{ formattedTime }}
    </div>

    <!-- Questions Section -->
    <div v-for="(question, index) in shuffledQuestions" :key="question.qid" class="qnDiv" style="margin-bottom: 30px;">
      <h1 class="questionTitle">{{ question.question }}</h1>
      <img v-if="question.image !== null" :src="question.image" class="m-4">

      <div v-for="answer in answers.filter(a => a.qid === question.qid)" :key="answer.aid">
        <Card :style="{ backgroundColor: (selectedAnswersForTest[index] === answer.aid) ? '#4682B4' : '#71b7e3' }" class="mb-2 cursor-pointer text-black" @click="() => { selectedAnswersForTest[index] = answer.aid; feedbackMessages[index] = ''; answerCorrect[index] = null; }">
          <input type="radio" :value="answer.aid" v-model="selectedAnswers[index]" class="hidden" />
          <div class="p-4 text-white">
            {{ answer.option_text }}
          </div>
        </Card>
      </div>
      <hr style="margin-top:30px;">
    </div>

    <!-- End of Test Button -->
    <div class="text-center">
        <Button class="checkAnswer" @click="evaluateAnswers">Submit</Button>
    </div>
  </div>
</template>

<style>
.qnDiv {
  margin: 20px;
}

.questionTitle {
  font-size: 20px;
  font-weight: bolder;
  text-align: left;
  margin-bottom: 10px;
}
.button-container {
  display: flex;              /* Use flexbox for alignment */
  justify-content: flex-end;  /* Align items to the right */
  margin-right: 20px;
}

.checkAnswer {
  display: inline-flex;      /* Keeps the button size based on content */
  padding: 20px;        /* Padding for the button */
  justify-content: center;
  align-items: center;
  cursor: pointer;            /* Change cursor to pointer on hover */
  font-size: 20px;
  margin-bottom: 20px;
}
</style>