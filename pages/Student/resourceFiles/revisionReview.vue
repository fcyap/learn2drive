<script setup lang="ts">

definePageMeta({
  layout: "studentview",
});

import { ref, onMounted } from 'vue'; // Ensure you import ref and onMounted
import { Card } from '@/components/ui/card';
const client = useSupabaseClient();
import { useLocalStorage } from '@vueuse/core';
const router = useRouter();
import {Button} from '@/components/ui/button';

// Initialize results and handle JSON parsing
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




let results: TestResults = { id: 0, uid: 0, results: [], currentTopic: 'BTT' };
const userId = useLocalStorage('userId', null); // Ensure `userId` is set in local storage

onMounted(async () => {
  if (!userId.value) {
    console.error('User ID is not set');
    return;
  }

  // Fetch the latest result for the current user
  const { data: resultData, error: resultError } = await client
    .from('test_results')
    .select('*')
    .eq('uid', userId.value)
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

  } else {console.log('No results found for this user');
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

  console.log('incorrectByTopic.value:', incorrectByTopic.value); // Log after updating

  // Now call fetchTopicTips after the incorrectByTopic is updated
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

console.log('incorrectByTopic.value:', incorrectByTopic.value);

const topicTips = ref<any[]>([]);

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
    // Parse the JSON string of tips and store them in topicTips
    topicTips.value = data.topic_tips; // Store tips for the current topic
    console.log("topicTips.value updated:", topicTips.value); // Log updated tips for this topic
  }
}

onMounted(() => {
  Object.keys(incorrectByTopic.value).forEach((topic) => {
    fetchTopicTips(topic);
  });
});

// Log the current topic after extraction
console.log('Current Topic after extraction:', currentTopic.value);

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
        localStorage.setItem('currentType.value', 'test');
        router.push({ name: '/Student/resourceFiles/questionsPage' });
}
</script>


<template>
  <div class="inline">
    <a href="/Student/resourcesPage" class="inline-flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" stroke-width="1.5" stroke="currentColor" class="size-6 mr-2 mt-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg> 
      <h1 class="text-lg">Back to Resources</h1>
    </a>
 <div v-if="results.results.length !== 0">
  <section
        class="min-h-screen flex items-center justify-center relative overflow-hidden animation-delay-300"
      >
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
    </div> 
    <h1 style="font-weight: bold; font-size:35px; margin:30px 0px;" class="text-blue-900">Areas for Improvement</h1>
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 gap-4">
        <Card v-for="(count, topic) in incorrectByTopic" :key="topic" class="p-4 shadow-md" :class="{ 'bg-blue-400': count > 2, 'bg-blue-200': count <= 2 }">
          <h1 class="text-xl"><strong>{{ topic }}:</strong> {{ count }} incorrect answers</h1>
          <h1 class="underline">Tips to help your learning:</h1>
          <ul v-if="topicTips && topicTips.length > 0" class="list-disc list-inside">
            <li v-for="(tip, index) in topicTips" :key="index">{{ tip }}</li>
          </ul>
      <p v-else>Loading tips...</p>
          <p v-else>Loading tips...</p>
    </Card>
      </div>
    </div>
  <h1 style="font-weight: bold; font-size:35px; margin:30px 0px;" class="text-blue-900">Review Your Results</h1>
  <div class="mt-4">
    <div v-for="(resultPair, idx) in results.results" :key="idx" class="mb-2">
        <strong style="font-size: 20px;">{{idx+1}}.
        {{ getQuestion(resultPair.qid) }}
        </strong> 
        <br />
        <div class="inline-flex items-center justify-center">
          <h2 style="margin-right:30px;">Your answer:</h2>
          <Card v-if="resultPair.aid !== 0" :style="{backgroundColor: (getAnswer(resultPair.aid)?.is_correct === true) ? '#72c472' : '#d25757'}">
          <div class="text-white" style="padding: 10px 16px">{{ getAnswer(resultPair.aid)?.option_text }}</div>
          </Card>
          <div v-else>No answer selected.</div>
        </div>
        <div v-if="(getAnswer(resultPair.aid)?.is_correct === true)">
          <strong class="text-blue-500 mt-6">You got it correct!</strong>
        </div>
        <div v-else>
          <div class="inline-flex items-center justify-center">
          <h2 style="margin-right:10px;">Correct answer:</h2>
          <Card style="background-color: #72c472">
          <div class="text-white" style="padding: 10px 16px">{{ getCorrectAnswer(resultPair.qid)?.option_text }}</div>
          </Card>
          </div>
        </div>
        <br />
    </div>
  </div>
</div>
    <div v-if="results.results.length === 0" class="mt-4 text-gray-500 text-center">
      <h1 class="text-5xl font-bold mb-4 text-blue-800 animate-fade-in-up">No results to display yet.<br>Try our mock test now!<br></h1>
      <Button @click="navigateToTest()" class="animate-fade-in-up size-8">Take test</Button>
    </div>
</template>