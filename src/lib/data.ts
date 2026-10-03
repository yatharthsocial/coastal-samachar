// Sample widget content (no backend). Edit freely.

export const polls = [
  {
    id: "stream-after-sslc",
    question: "Which stream are you choosing after SSLC?",
    options: ["Science", "Commerce", "Arts", "Still deciding"],
    seed: [412, 288, 176, 241],
  },
  {
    id: "study-style",
    question: "How do you prefer to prepare for exams?",
    options: ["Studying alone", "Group study", "Coaching classes", "Online videos"],
    seed: [520, 210, 260, 330],
  },
  {
    id: "favourite-event",
    question: "Which cultural event do you look forward to most?",
    options: ["Mangaluru Dasara", "Kambala", "Yakshagana nights", "College fests"],
    seed: [610, 340, 280, 390],
  },
];

export type PollData = (typeof polls)[number];
