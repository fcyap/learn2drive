<template>
    <div class="container mx-auto p-4">
        <div class="space-y-0.5 mb-6">
            <h1 class="text-3xl font-bold tracking-tight text-slate-700">Student Dashboard</h1>
            <p class="text-gray-600">Your learning journey at a glance</p>
        </div>

        <div class="flex-col md:flex">
            <div class="flex-1 space-y-4 pt-6">
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <!-- Total Lessons Completed Card -->
                    <Card class="bg-slate-100 rounded-lg shadow-md p-4 border border-slate-200">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium text-slate-600">Total Lessons Completed</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                class="h-4 w-4 text-slate-500">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold text-slate-700">{{ completedLessons.length }}</div>
                            <p class="text-xs text-gray-500">+{{ lessonsThisWeek.length }} from last week</p>
                        </CardContent>
                    </Card>

                    <!-- Next Lesson Card -->
                    <Card class="bg-slate-100 rounded-lg shadow-md p-4 border border-slate-200">
                        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle class="text-sm font-medium text-slate-600">Next Lesson</CardTitle>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                class="h-4 w-4 text-slate-500">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div class="text-2xl font-bold text-slate-700">
                                {{ nextLesson && nextLesson.date ? formatDate(nextLesson.date) : 'No upcoming lessons' }}
                            </div>
                            <p class="text-xs text-gray-500">{{ nextLesson ? nextLesson.time : '' }}</p>
                        </CardContent>
                    </Card>
                </div>

                <!-- Lessons for Next Week Section -->
                <Card class="bg-slate-100 rounded-lg shadow-md p-4 border border-slate-200">
                    <CardHeader>
                        <CardTitle class="text-slate-600">Lessons for Next Week</CardTitle>
                        <CardDescription class="text-gray-500">Your scheduled lessons for the upcoming week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-8">
                            <div v-for="lesson in nextWeekLessons" :key="lesson.id" class="flex items-center">
                                <Avatar :class="'h-9 w-9'">
                                    <AvatarImage
                                        :src="`https://avatar.vercel.sh/${lesson.instructor_name.replace(' ', '-')}.png`"
                                        alt="Avatar" />
                                    <AvatarFallback>{{ lesson.instructor_name.split(' ').map(n => n[0]).join('') }}</AvatarFallback>
                                </Avatar>
                                <div class="ml-4 space-y-1">
                                    <p class="text-sm font-medium leading-none text-gray-800">{{ lesson.instructor_name }}</p>
                                    <p class="text-sm text-gray-500">{{ formatDate(lesson.date) }} at {{ lesson.time }}</p>
                                </div>
                                <div class="ml-auto font-medium text-slate-600">{{ lesson.location }}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Notifications for Past Instructors to Review -->
                <Card class="bg-slate-100 rounded-lg shadow-md p-4 border border-slate-200">
                    <CardHeader>
                        <CardTitle class="text-slate-600">Review</CardTitle>
                        <CardDescription class="text-gray-500">Past Instructors to Review</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="space-y-8" v-if="uniqueInstructors && uniqueInstructors.length">
                            <div v-for="lesson in uniqueInstructors" :key="lesson.instructor_id" class="flex items-center">
                                <Avatar :class="'h-9 w-9'">
                                    <AvatarImage
                                        :src="`https://avatar.vercel.sh/${lesson.instructor_name.replace(' ', '-')}.png`"
                                        alt="Avatar" />
                                    <AvatarFallback>{{ lesson.instructor_name.split(' ').map(n => n[0]).join('') }}</AvatarFallback>
                                </Avatar>
                                <div class="ml-4 space-y-1">
                                    <p class="text-sm font-medium leading-none text-gray-800">{{ lesson.instructor_name }}</p>
                                </div>
                                <button class="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                                    @click="goToReviewForm(lesson.instructor_id)">
                                    Review
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <p class="text-gray-500">No past instructors to review.</p>
                        </div>
                    </CardContent>
                </Card>

                <!-- Review Modal -->
                <Transition name="fade" appear>
                    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center z-50">
                        <div class="bg-white rounded-lg p-6 shadow-2xl w-11/12 max-w-md">
                            <h3 class="text-lg font-bold mb-4 text-blue-700">
                                {{ existingReview ? 'Edit' : 'Review' }} Instructor: {{ selectedInstructor }}
                            </h3>

                            <p v-if="existingReview" class="text-sm text-gray-600 mb-2">
                                Note: Editing this review will replace your original review.
                            </p>

                            <form @submit.prevent="submitReview">
                                <!-- Improved Star Rating System -->
                                <div class="flex items-center justify-center mb-4">
                                    <svg v-for="star in 5" :key="star" :class="[ 
                                        'w-8 h-8 cursor-pointer transition-all duration-200', 
                                        star <= (hoverRating || reviewRating) ? 'text-yellow-400 scale-110' : 'text-gray-300'
                                    ]" @click="setRating(star)" @mouseenter="setHoverRating(star)"
                                        @mouseleave="setHoverRating(0)" xmlns="http://www.w3.org/2000/svg" 
                                        fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" 
                                        stroke-width="1.5">
                                        <path
                                            d="M12 17.25l-6.172 3.243 1.179-6.873L2.5 9.327l6.9-1 3.1-6.273 3.1 6.273 6.9 1-5.507 4.293 1.179 6.873z" />
                                    </svg>
                                </div>

                                <!-- Review Textarea -->
                                <textarea v-model="reviewText" placeholder="Write your review here..." rows="4"
                                    class="w-full border border-blue-300 p-2 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>

                                <!-- Buttons for Cancel and Submit -->
                                <div class="flex justify-end mt-4">
                                    <button type="button"
                                        class="mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors duration-200"
                                        @click="closeModal">
                                        Cancel
                                    </button>
                                    <button type="submit"
                                        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200">
                                        {{ existingReview ? 'Update' : 'Submit' }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">


definePageMeta({
    layout: 'studentview'
});

import { ref, computed, onMounted } from 'vue';

import { useAuthStore } from '~/stores/UseAuth'

const authStore = useAuthStore()


// To check if the user is authenticated
console.log(authStore.isAuthenticated)

// To get the current user ID
const userId = authStore.userId;
console.log(authStore.userId)



// Define the Lesson interface to represent the structure of a lesson
const client = useSupabaseClient();

interface Lesson {
    id: number;
    instructor_id: number;
    student_id: number;
    instructor_name: string;
    date: string;
    time: string;
    location: string;
}

// Define the Review interface
// Define the Review interface
interface Review {
    instructor_id: number;   // The ID of the instructor being reviewed
    student_id: number;      // The ID of the student who wrote the review
    comment: string;          // The content of the review
    rating: number;           // The rating given by the student (if applicable)
    date_posted: Date;
}

const isModalOpen = ref(false);
const selectedInstructorId = ref(0);  // Changed to hold instructor ID
const reviewText = ref('');
const reviewRating = ref(0); // New reactive reference for review rating
const existingReview = ref<Review | null>(null); // Use the Review interface for existing reviews



const hoverRating = ref(0);


// Example setRating and setHoverRating methods
const setRating = (rating) => {
    reviewRating.value = rating;
};

const setHoverRating = (rating) => {
    hoverRating.value = rating;
};
// Open review modal and fetch existing review
const goToReviewForm = async (instructorId: number) => {
    selectedInstructorId.value = instructorId; // Store the selected instructor ID
    existingReview.value = await fetchExistingReview(userId, instructorId); // Fetch existing review using student ID and instructor ID

    if (existingReview.value) {
        reviewText.value = existingReview.value.comment; // Pre-fill comment if exists
        reviewRating.value = existingReview.value.rating; // Pre-fill rating if exists
    } else {
        reviewText.value = ''; // Clear comment if no existing review
        reviewRating.value = 0; // Reset rating if no existing review
    }

    isModalOpen.value = true;
};

// Close modal and reset values
const closeModal = () => {
    isModalOpen.value = false;
    reviewText.value = ''; // Clear the review text when closing
    reviewRating.value = 0; // Reset the rating when closing
    existingReview.value = null; // Reset the existing review
};

// Submit review logic
const submitReview = async () => {
    const reviewExists = await checkReviewExists(userId, selectedInstructorId.value); // Use the selected instructor ID

    if (reviewExists) {
        // Logic to update the existing review
        await updateReview(userId, selectedInstructorId.value, reviewText.value, reviewRating.value);
        console.log('Updating review for instructor ID', selectedInstructorId.value, ':', reviewText.value, 'with rating:', reviewRating.value);
    } else {
        // Logic to submit a new review
        await createReview(userId, selectedInstructorId.value, reviewText.value, reviewRating.value);
        console.log('Submitting review for instructor ID', selectedInstructorId.value, ':', reviewText.value, 'with rating:', reviewRating.value);
    }

    // Reset the modal after submission
    closeModal();
};

// Fetch existing review from Supabase
const fetchExistingReview = async (studentId: number, instructorId: number): Promise<Review | null> => {
    const { data, error } = await client
        .from('instructor_reviews')
        .select()
        .eq('student_id', studentId) // Use actual student ID
        .eq('instructor_id', instructorId) // Use instructor ID for fetching
        .single(); // Fetch a single review

    if (error) {
        console.error('Error fetching existing review:', error);
        return null;
    }
    return data; // Return the fetched review data
};

// Check if a review exists for the student and instructor
const checkReviewExists = async (studentId: number, instructorId: number): Promise<boolean> => {
    const { data, error } = await client
        .from('instructor_reviews')
        .select()
        .eq('student_id', studentId) // Use actual student ID
        .eq('instructor_id', instructorId) // Use instructor ID for checking
        .single(); // Fetch a single review

    if (error) {
        console.error('Error checking if review exists:', error);
        return false; // Assume it doesn't exist if there's an error
    }

    return data ? true : false; // Return true if review exists, else false
};

import Swal from 'sweetalert2';

// Function to create a new review
const createReview = async (studentId: number, instructorId: number, comment: string, rating: number) => {
    // Ask user for confirmation
    Swal.fire({
        title: "Do you want to submit your review?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Submit",
        denyButtonText: `Don't submit`
    }).then(async (result) => {
        if (result.isConfirmed) {
            const currentTimestamp = new Date().toISOString();  // Get the current timestamp

            const { error } = await client
                .from('instructor_reviews')
                .insert({
                    instructor_id: instructorId,
                    student_id: studentId,
                    comment,
                    rating,
                    date_posted: currentTimestamp
                });

            if (error) {
                console.error('Error creating review:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'There was an issue submitting your review. Please try again later.',
                    confirmButtonText: 'Retry'
                });
            } else {
                Swal.fire('Submitted!', 'Your review has been submitted successfully.', 'success');
            }
        } else if (result.isDenied) {
            Swal.fire("Review not submitted", "", "info");
        }
    });
};


// Function to update an existing review
const updateReview = async (studentId: number, instructorId: number, comment: string, rating: number) => {
    // Ask user for confirmation
    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: "Don't save"
    }).then(async (result) => {
        if (result.isConfirmed) {
            const currentTimestamp = new Date().toISOString();  // Get the current timestamp
            const { error } = await client
                .from('instructor_reviews')
                .update({ comment, rating, date_posted: currentTimestamp })
                .eq('student_id', studentId)
                .eq('instructor_id', instructorId);

            if (error) {
                console.error('Error updating review:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'There was a problem updating your review. Please try again later.',
                    confirmButtonText: 'Retry'
                });
            } else {
                Swal.fire('Saved!', 'Your review has been updated successfully.', 'success');
            }
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
};




// Create a reactive reference to store the list of lessons
const lessons = ref<Lesson[]>([]);

// Fetch lessons for the student with student_id = 101 when the component is mounted
onMounted(async () => {
    const { data, error } = await client
        .from('lessons')
        .select()
        .eq('student_id', userId);  // Fetch lessons where student_id is 101
    if (error) {
        console.error('Error fetching lessons:', error); // Log any errors
    } else {
        lessons.value = data ?? []; // Assign the fetched data to the lessons reference
    }
});

// Today's date for reference
const today = new Date();

// Filtering lessons that are completed (before today)
const completedLessons = computed(() => {
    return lessons.value.filter(lesson => new Date(lesson.date) < today);
});

// Filtering lessons completed this week
const lessonsThisWeek = computed(() => {
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return completedLessons.value.filter(lesson => new Date(lesson.date) >= lastWeek && new Date(lesson.date) < today);
});

// Finding the next upcoming lesson
const nextLesson = computed(() => {
    const now = new Date();
    const upcomingLessons = lessons.value
        .filter(lesson => {
            const lessonDateTime = combineDateTime(lesson.date, lesson.time); // Combine date and time into a Date object
            return lessonDateTime > now; // Compare properly as Date objects
        })
        .sort((a, b) => combineDateTime(a.date, a.time) - combineDateTime(b.date, b.time));

    return upcomingLessons.length > 0 ? upcomingLessons[0] : null;
});


// Filtering lessons for next week (within 7 days from today)
// Helper function to combine date and time into a single Date object
const combineDateTime = (dateStr, timeStr) => {
    return new Date(`${dateStr}T${timeStr}`);
};

const nextWeekLessons = computed(() => {
    const now = new Date(); // Current date and time
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of today

    const nextWeekStart = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from today

    return lessons.value
        .filter(lesson => {
            const lessonDateTime = combineDateTime(lesson.date, lesson.time); // Use combined Date object
            // Filter out lessons that are either in the past or beyond the next 7 days
            return lessonDateTime >= now && lessonDateTime < nextWeekStart;
        })
        .sort((a, b) => combineDateTime(a.date, a.time) - combineDateTime(b.date, b.time));
});



// Filtering past lessons (before today) for review
const pastLessons = computed(() => {
    return lessons.value.filter(lesson => new Date(lesson.date) < today);
});

const uniqueInstructors = computed(() => {
    if (!pastLessons.value) return []; // Check if pastLessons is defined

    const unique = new Map();
    pastLessons.value.forEach(lesson => {
        // Assuming lesson has an instructor_id and instructor_name
        if (lesson.instructor_id && !unique.has(lesson.instructor_id)) {
            unique.set(lesson.instructor_id, lesson);
        }
    });
    return Array.from(unique.values());
});

// Date formatter for display
const formatDate = (dateString: string) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};


</script>

<style scoped>
/* Add any additional styles if needed */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
