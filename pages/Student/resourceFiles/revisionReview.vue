<script setup lang="ts">
  definePageMeta({
    layout: "studentview",
  });

  import { ref, onMounted } from 'vue'; // Ensure you import ref and onMounted
  import { Card } from '@/components/ui/card';
  const client = useSupabaseClient();
  import { useLocalStorage } from "@vueuse/core";
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const userId = Number(useLocalStorage("userId", null).value);
  if (userId === 0) {
    const router = useRouter();
    router.push("/");
  }
  import {Button} from '@/components/ui/button';

  interface ResultEntry {
    qid: number;
    aid: number;
  }

  interface TestResults {
    id: number;
    uid: number;
    results: ResultEntry[];
    currentTopic: string;
  }

  const loading = ref(true);

  let results: TestResults = { id: 0, uid: 0, results: [], currentTopic: 'BTT' };

  onMounted(async () => {
    if (!userId.valueOf) {
      console.error('User ID is not set');
      return;
    }

    // Fetch the latest result for the current user
    const { data: resultData, error: resultError } = await client
      .from('test_results')
      .select('*')
      .eq('uid', userId.valueOf)
      .order('id', { ascending: false })
      .limit(1);

    if (resultError) {
      console.error('Error fetching student results:', resultError);
      return;
    }

    if (resultData && resultData.length > 0) {
      const latestResult = resultData[0] as TestResults;;
      results = {
        id: latestResult.id,
        uid: latestResult.uid,
        results: JSON.parse(latestResult.results),
        currentTopic: latestResult.currentTopic,
      };

    } else {
      console.log('No results found for this user');
    }
  });

  // Extract currentTopic from the parsed results
  const currentTopic = ref<'BTT' | 'FTT'>(results.currentTopic as 'BTT' | 'FTT'); // Use type assertion
  const questions = ref<any[]>([]);
  const answers = ref<any[]>([]);
  const incorrectByTopic = ref<Record<string, number>>({});

  interface CorrectAnswer {
    qid: number; // Use the appropriate type for your qid
    aid: number; // Use the appropriate type for your aid
  }

  // Declare your reactive arrays with explicit types
  const correctAnswers = ref<CorrectAnswer[]>([]);

  onMounted(async () => {
    console.log('Current Topic:', currentTopic.value); // Log the currentTopic before making requests
    
    const { data: questionsData, error: questionsError } = await client
      .from(`${currentTopic.value}_questions`)
      .select('*');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return;
    }
    questions.value = questionsData || []; // Populate questions

    const { data: answersData, error: answersError } = await client
      .from(`${currentTopic.value}_answers`)
      .select('*');

    if (answersError) {
      console.error('Error fetching answers:', answersError);
      return;
    }
    answers.value = answersData || []; // Populate answers

    populateCorrectAnswers();
    calculateScore();
    countIncorrectByTopic();
  });

  const countIncorrectByTopic = () => {
    if (loading.value) return;
    incorrectByTopic.value = results.results.reduce((acc, result) => {
      const isCorrect = correctAnswers.value.some(
        (correctAnswer) => correctAnswer.qid === result.qid && correctAnswer.aid === result.aid
      );

      if (!isCorrect) {
        const question = questions.value.find(q => q.qid === result.qid);
        if (question) {
          acc[question.topic] = (acc[question.topic] || 0) + 1;
        }
      }

      return acc;
    }, {} as Record<string, number>);

    // Call fetchTopicTips after the incorrectByTopic is updated
    Object.keys(incorrectByTopic.value).forEach((topic) => {
      fetchTopicTips(topic); // Fetch tips for each topic
    });
  };

  watch(incorrectByTopic, (newVal) => {
    // Watch for changes in the incorrectByTopic object and fetch tips
    Object.keys(newVal).forEach((topic) => {
      fetchTopicTips(topic);
    });
  }, { immediate: true });

  const topicTips = ref<Record<string, string[]>>({}); // Store tips per topic

  async function fetchTopicTips(topic: string) {
    console.log(`Fetching tips for topic: ${topic}`);
    const { data, error } = await client
      .from('theory_tips')
      .select('topic_tips')
      .eq('topic', topic)
      .single(); // Fetch a single row for this topic

    if (error) {
      console.error(`Error fetching tips for topic "${topic}":`, error);
      return;
    }

    if (data) {
      // Store the tips for the current topic in the topicTips object
      topicTips.value[topic] = data.topic_tips; // Use topic as the key
    }
  }

  onMounted(() => {
    Object.keys(incorrectByTopic.value).forEach((topic) => {
      fetchTopicTips(topic);
    });

    setTimeout(() => {
      loading.value = false;
    }, 2000);
  });

  const getQuestion = (qid: number) => {
    const question = questions.value.find(q => q.qid === qid);
    return question ? question.question : 'Question not found'; // Handle missing question case
  };

  const getAnswer = (aid: number) => {
    const answer = answers.value.find(a => a.aid === aid);
    return answer ? answer : { option_text: 'Option not found', is_correct: false }; // Handle missing answer case
  };

  const populateCorrectAnswers = () => {
    correctAnswers.value = answers.value
      .filter(answer => answer.is_correct) // Get only correct answers
      .map(answer => ({ qid: answer.qid, aid: answer.aid })); // Map to { qid, aid } pairs
  };

  // Function to get correct answer for a given qid
  const getCorrectAnswer = (qid: number) => {
    const correctAnswer = correctAnswers.value.find(ca => ca.qid === qid);
    return correctAnswer ? getAnswer(correctAnswer.aid) : { option_text: 'Correct answer not found', is_correct: true };
  }

  const isScoreLoading = ref(true); // Initially set to true

  const score = ref(0); // Initialize the score variable

  const calculateScore = () => {
    // Calculate the score
    score.value = results.results.filter((result) =>
      correctAnswers.value.some(
        (correctAnswer) =>
          correctAnswer.qid === result.qid && correctAnswer.aid === result.aid
      )
    ).length;
    
    isScoreLoading.value = false; // Set loading to false after calculation
  };

  function navigateToTest() {
    router.push('/Student/resourceFiles/questionsPage');
  }
</script>


<template>
  <head>
    <title>
      Revision Review
    </title>
  </head>
  <!-- Back button -->
  <NuxtLink to="/Student/resourcesPage" class="inline-flex">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg> 
    <h1 class="text-lg">Back to Resources</h1>
  </NuxtLink>

  <!-- Loading page -->
  <div v-if="loading" class="text-center py-8">
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden">
      <h2 class="relative text-5xl font-bold mb-4 text-blue-800">
          <div class="car-container">
            <div class="car">
              <svg fill="rgb(30 64 175)" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                width="100px" height="100px" viewBox="0 0 31.445 31.445"
                xml:space="preserve">
              <g>
                <g>
                  <path d="M7.592,16.86c-1.77,0-3.203,1.434-3.203,3.204s1.434,3.204,3.203,3.204c1.768,0,3.203-1.434,3.203-3.204
                    S9.36,16.86,7.592,16.86z M7.592,21.032c-0.532,0-0.968-0.434-0.968-0.967s0.436-0.967,0.968-0.967
                    c0.531,0,0.966,0.434,0.966,0.967S8.124,21.032,7.592,21.032z"/>
                  <path d="M30.915,17.439l-0.524-4.262c-0.103-0.818-0.818-1.418-1.643-1.373L27.6,11.868l-3.564-3.211
                    c-0.344-0.309-0.787-0.479-1.249-0.479l-7.241-0.001c-1.625,0-3.201,0.555-4.468,1.573l-4.04,3.246l-5.433,1.358
                    c-0.698,0.174-1.188,0.802-1.188,1.521v1.566C0.187,17.44,0,17.626,0,17.856v2.071c0,0.295,0.239,0.534,0.534,0.534h3.067
                    c-0.013-0.133-0.04-0.26-0.04-0.396c0-2.227,1.804-4.029,4.03-4.029s4.029,1.802,4.029,4.029c0,0.137-0.028,0.264-0.041,0.396
                    h8.493c-0.012-0.133-0.039-0.26-0.039-0.396c0-2.227,1.804-4.029,4.029-4.029c2.227,0,4.028,1.802,4.028,4.029
                    c0,0.137-0.026,0.264-0.04,0.396h2.861c0.295,0,0.533-0.239,0.533-0.534v-1.953C31.449,17.68,31.21,17.439,30.915,17.439z
                    M20.168,12.202l-10.102,0.511L12,11.158c1.051-0.845,2.357-1.305,3.706-1.305h4.462V12.202z M21.846,12.117V9.854h0.657
                    c0.228,0,0.447,0.084,0.616,0.237l2.062,1.856L21.846,12.117z"/>
                  <path d="M24.064,16.86c-1.77,0-3.203,1.434-3.203,3.204s1.434,3.204,3.203,3.204c1.769,0,3.203-1.434,3.203-3.204
                    S25.833,16.86,24.064,16.86z M24.064,21.032c-0.533,0-0.967-0.434-0.967-0.967s0.434-0.967,0.967-0.967
                    c0.531,0,0.967,0.434,0.967,0.967S24.596,21.032,24.064,21.032z"/>
                </g>
              </g>
              </svg>
            </div>
          </div>
          Loading your results
          <span class="dot animate-bounce">.</span>
          <span class="dot animate-bounce" style="animation-delay: 0.2s">.</span>
          <span class="dot animate-bounce" style="animation-delay: 0.4s">.</span>
        </h2>
    </section>
  </div>

  <!-- If results exist -->
  <div v-else>
    <div v-if="results && results.results && results.results.length > 0">
      <section class="min-h-screen flex items-center justify-center relative overflow-hidden animation-delay-300">
        <div class="container mx-auto px-6 text-center">
          <h2 class="text-5xl font-bold mb-4 text-blue-800 animate-fade-in-up">
            Good job on completing the test!
          </h2>
          <div class="inline">
            <span v-if="!isScoreLoading" class="text-2xl mb-8 text-gray-600 animate-fade-in-up">
              Your Score is: {{score}}/15
            </span>
          </div>
        </div>
      </section>  
    <h1 style="font-weight: bold; font-size:35px; margin:30px 0px;" class="text-blue-900">Areas for Improvement</h1>
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 gap-4">
        <Card v-for="(count, topic) in incorrectByTopic" :key="topic" class="p-4 shadow-md" :class="{ 'bg-blue-400': count > 2, 'bg-blue-200': count <= 2 }">
          <h1 class="text-xl pb-3"><strong>{{ topic }}:</strong> {{ count }} incorrect answers</h1>
          <hr style="border-color: darkblue">
          <ul v-if="topicTips[topic] && topicTips[topic].length > 0" class="list-disc list-inside pt-3">
            <li v-for="(tip, index) in topicTips[topic]" :key="index">{{ tip }}</li>
          </ul>
          <p v-else>Loading tips...</p>
        </Card>
      </div>
    </div>
    <h1 style="font-weight: bold; font-size:35px; margin:30px 0px;" class="text-blue-900">Review Your Results</h1>
    <div class="mt-4">
      <div v-for="(resultPair, idx) in results.results" :key="idx" class="m-5">
        <div class="my-2">
          <strong style="font-size: 20px;">{{idx+1}}.
          {{ getQuestion(resultPair.qid) }}
          </strong> 
        </div>
          <br />
          <div class="inline-flex items-center justify-center w-full my-1 drop-shadow-md">
            <div class="mr-7 sm:w-auto sm:mr-9 flex-shrink-0"> 
              <h2>Your answer:</h2>
            </div>
            <Card v-if="resultPair.aid !== 0" class="flex-grow w-full" :style="{backgroundColor: (getAnswer(resultPair.aid)?.is_correct === true) ? '#bcf6b8' : '#f3bdbd'}">
            <div style="padding: 10px 16px;">{{ getAnswer(resultPair.aid)?.option_text }}</div>
            </Card>
            <Card v-else class="flex-grow w-full">
            <div style="padding: 10px 16px;">No answer selected.</div>
            </Card>
          </div>
          <div v-if="(getAnswer(resultPair.aid)?.is_correct === true)" class="my-4">
            <strong class="text-blue-500 mt-6">You got it correct!</strong>
          </div>
          <div v-else>
            <div class="inline-flex items-center justify-center w-full my-1 drop-shadow-lg">
              <div class="mr-2 sm:w-auto sm:mr-4 flex-shrink-0"> 
              <h2>Correct answer:</h2>
            </div>
            <Card style="background-color: #bcf6b8" class="w-full">
            <div class="text-green" style="padding: 10px 16px">{{ getCorrectAnswer(resultPair.qid)?.option_text }}</div>
            </Card>
            </div>
          </div>
          <br />
      </div>   
    </div>
    </div>

  <!-- If results do not exist -->
    <section v-else class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden animation-delay-300">
      <h1 class="text-5xl font-bold mb-4 text-blue-800">No results to display yet.</h1>
      <h1 class="text-5xl font-bold mb-4 text-blue-800">Try our mock test now!</h1>
      <Button @click="navigateToTest()" class="mt-5 checkAnswer">Take test</Button>
    </section>
  </div>
</template>

<style>
.checkAnswer {
  display: inline-flex;      /* Keeps the button size based on content */
  padding: 20px;        /* Padding for the button */
  justify-content: center;
  align-items: center;
  cursor: pointer;            /* Change cursor to pointer on hover */
  font-size: 20px;
  margin-bottom: 20px;
}

/* Bounce animation for '...' */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-bounce {
  display: inline-block;
  animation: bounce 1s infinite;
}

/* Car animation */
@keyframes driveCar {
  0% {
    left: -100px; /* Start position (outside the screen) */
  }
  100% {
    left: 100%; /* End position (fully to the right) */
  }
}

.car-container {
  position: absolute;
  top: -100px;  /* Adjust this value to move the car higher or lower */
  left: 0;
  width: 100%;
  height: 50px; /* Set height for car container */
  z-index: 10/;  /* Ensure the car is above the text */
}

.car {
  width: 50px;
  height: 30px;
  transform: scaleX(-1);
  border-radius: 5px; /* Rounded edges for the car */
  position: absolute;
  top: 0;
  animation: driveCar 3s linear infinite; /* Speed and infinite loop for driving effect */
}

</style>