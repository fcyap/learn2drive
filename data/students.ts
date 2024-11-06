export interface Student {
    id: number;
    name: string;
    date: string;
    time: string;
    location: string;
    contact: string;
    upcomingLessonTopic: string;
  }
  
  export const CurrentStudents: Student[] = [
    {
      id: 1,
      name: "Samuel Tan",
      date: "2024-10-22",
      time: "09:30 AM",
      location: "Jurong East, Singapore",
      contact: "samuel.tan@example.com",
      upcomingLessonTopic: "Lane Discipline",
    },
    {
      id: 2,
      name: "Lim Wei Ling",
      date: "2024-10-23",
      time: "01:00 PM",
      location: "Tampines, Singapore",
      contact: "weiling.lim@example.com",
      upcomingLessonTopic: "U-Turn Maneuvers",
    },
    {
      id: 3,
      name: "David Ng",
      date: "2024-10-24",
      time: "11:00 AM",
      location: "Ang Mo Kio, Singapore",
      contact: "david.ng@example.com",
      upcomingLessonTopic: "Parking Techniques",
    },
    {
      id: 4,
      name: "Nurul Aisyah",
      date: "2024-10-25",
      time: "03:30 PM",
      location: "Bedok, Singapore",
      contact: "nurul.aisyah@example.com",
      upcomingLessonTopic: "Expressway Driving",
    },
  ];
  