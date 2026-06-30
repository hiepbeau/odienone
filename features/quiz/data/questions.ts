import type { QuizCategory } from "@/types";

export interface QuizAnswerOption {
  id: string;
  text: string;
  score: number;
}

export interface QuizQuestionData {
  id: string;
  question: string;
  category: QuizCategory;
  emoji: string;
  /** Nguồn tham chiếu trong docs (doc1 | doc2 | doc3) */
  source: "doc1" | "doc2" | "doc3";
  answers: QuizAnswerOption[];
}

/**
 * 15 câu hỏi được biên soạn từ tài liệu chính thức:
 * - doc1.docx: Lịch sử thành lập xã, quy hoạch, kinh tế – văn hóa
 * - doc2.docx: Thông tin hành chính, địa giới, lãnh đạo, đặc sản
 * - doc3.docx: Cố đô Vạn Xuân, Tô Hiến Thành, du lịch di sản
 */
export const QUIZ_QUESTIONS: QuizQuestionData[] = [
  {
    id: "q1",
    category: "history",
    emoji: "🏛️",
    source: "doc1",
    question:
      "Thành cổ Ô Diên từng giữ vai trò gì trong lịch sử nước Vạn Xuân thế kỷ VI?",
    answers: [
      {
        id: "q1a",
        text: "Một trong ba trung tâm chính trị – quân sự quan trọng, bên cạnh Cổ Loa và Long Biên",
        score: 100,
      },
      { id: "q1b", text: "Thủ đô duy nhất của nhà Nguyễn", score: 10 },
      { id: "q1c", text: "Cảng biển lớn nhất miền Bắc", score: 15 },
      { id: "q1d", text: "Trung tâm đúc tiền thời Lê Trung Hưng", score: 20 },
    ],
  },
  {
    id: "q2",
    category: "history",
    emoji: "📅",
    source: "doc2",
    question: "Xã Ô Diên chính thức hoạt động từ ngày nào?",
    answers: [
      { id: "q2a", text: "01/07/2025", score: 100 },
      { id: "q2b", text: "01/07/2026", score: 30 },
      { id: "q2c", text: "12/12/2024", score: 20 },
      { id: "q2d", text: "30/04/1975", score: 5 },
    ],
  },
  {
    id: "q3",
    category: "landmarks",
    emoji: "🌊",
    source: "doc3",
    question:
      "Theo sử sách, Thành cổ Ô Diên nằm ở vị trí đắc địa tại điểm hợp lưu của những con sông nào?",
    answers: [
      { id: "q3a", text: "Sông Hồng, sông Đáy, sông Nhuệ và sông Hát", score: 100 },
      { id: "q3b", text: "Sông Mekong và sông Cửu Long", score: 5 },
      { id: "q3c", text: "Sông Hồng và sông Thương", score: 25 },
      { id: "q3d", text: "Sông Đà và sông Lô", score: 15 },
    ],
  },
  {
    id: "q4",
    category: "daily",
    emoji: "📊",
    source: "doc2",
    question:
      "Theo thông tin chính thức, quy mô dân số và diện tích tự nhiên của xã Ô Diên là bao nhiêu?",
    answers: [
      { id: "q4a", text: "97.506 người và 32,06 km²", score: 100 },
      { id: "q4b", text: "50.000 người và 15 km²", score: 20 },
      { id: "q4c", text: "120.000 người và 50 km²", score: 15 },
      { id: "q4d", text: "30.000 người và 10 km²", score: 10 },
    ],
  },
  {
    id: "q5",
    category: "history",
    emoji: "🤝",
    source: "doc1",
    question:
      "Vì sao tên gọi “Ô Diên” được chọn cho xã mới thay vì ghép tên các xã cũ?",
    answers: [
      {
        id: "q5a",
        text: "Gắn với Thành cổ Ô Diên – biểu tượng lịch sử văn hóa, thể hiện tinh thần đoàn kết cả vùng",
        score: 100,
      },
      {
        id: "q5b",
        text: "Vì là tên của một tỉnh mới sáp nhập",
        score: 10,
      },
      {
        id: "q5c",
        text: "Do ngẫu nhiên bốc thăm trên mạng xã hội",
        score: 5,
      },
      {
        id: "q5d",
        text: "Theo tên một khu công nghiệp nước ngoài",
        score: 15,
      },
    ],
  },
  {
    id: "q6",
    category: "food",
    emoji: "🍲",
    source: "doc2",
    question: "Đặc sản nào sau đây được tài liệu ghi nhận là sản phẩm đặc trưng của vùng?",
    answers: [
      {
        id: "q6a",
        text: "Cháo sen Hạ Mỗ, rượu đậu Hồng Hà, bánh tẻ Liên Hà, bánh gio Liên Hồng",
        score: 100,
      },
      { id: "q6b", text: "Phở bò Paris và bánh mì New York", score: 5 },
      { id: "q6c", text: "Cá hồi Na Uy nhập khẩu", score: 10 },
      { id: "q6d", text: "Bánh pizza Ý đặc sản Ô Diên", score: 15 },
    ],
  },
  {
    id: "q7",
    category: "festival",
    emoji: "🎭",
    source: "doc2",
    question:
      "Loại hình nghệ thuật dân gian đặc sắc nào được nhắc đến là di sản văn hóa của xã Ô Diên?",
    answers: [
      { id: "q7a", text: "Hội hát Chèo Tàu tổng Gối", score: 100 },
      { id: "q7b", text: "Opera Ý truyền thống", score: 5 },
      { id: "q7c", text: "K-pop cover contest", score: 10 },
      { id: "q7d", text: "Nhạc jazz đường phố", score: 15 },
    ],
  },
  {
    id: "q8",
    category: "landmarks",
    emoji: "⛩️",
    source: "doc2",
    question:
      "Di tích nào sau đây được xếp hạng cấp Quốc gia tại xã Ô Diên theo tài liệu?",
    answers: [
      {
        id: "q8a",
        text: "Đình – miếu Diều, miếu Voi Phục, lăng Văn Sơn, chùa Đại Bi, đình Quế Dương",
        score: 100,
      },
      { id: "q8b", text: "Tháp Eiffel phiên bản mini", score: 5 },
      { id: "q8c", text: "Tượng Nữ thần Tự do", score: 10 },
      { id: "q8d", text: "Kim tự tháp Ai Cập", score: 15 },
    ],
  },
  {
    id: "q9",
    category: "history",
    emoji: "👤",
    source: "doc3",
    question:
      "Danh nhân Tô Hiến Thành có mối liên hệ gì với vùng đất Ô Diên (Hạ Mỗ xưa)?",
    answers: [
      {
        id: "q9a",
        text: "Sinh năm 1102 tại quê hương Hạ Mỗ; được tôn thờ tại đền Văn Hiến",
        score: 100,
      },
      { id: "q9b", text: "Là vua đầu tiên của nhà Nguyễn", score: 10 },
      { id: "q9c", text: "Là tướng Pháp thời thuộc địa", score: 5 },
      { id: "q9d", text: "Không có liên hệ với vùng này", score: 15 },
    ],
  },
  {
    id: "q10",
    category: "daily",
    emoji: "🏢",
    source: "doc2",
    question: "Trụ sở UBND xã Ô Diên đặt tại địa chỉ nào?",
    answers: [
      { id: "q10a", text: "Số 3, đường Phan Xích, xã Ô Diên, Hà Nội", score: 100 },
      { id: "q10b", text: "Số 1, phố Hàng Bông, Hoàn Kiếm", score: 10 },
      { id: "q10c", text: "1600 Pennsylvania Avenue", score: 5 },
      { id: "q10d", text: "Đường Nguyễn Huệ, Quận 1, TP.HCM", score: 15 },
    ],
  },
  {
    id: "q11",
    category: "history",
    emoji: "📜",
    source: "doc3",
    question:
      "Nhà nước Vạn Xuân được nhắc đến trong tài liệu với ý nghĩa lịch sử nào?",
    answers: [
      {
        id: "q11a",
        text: "Quốc gia độc lập đầu tiên sau thời Bắc thuộc; Ô Diên từng là kinh đô",
        score: 100,
      },
      { id: "q11b", text: "Thuộc địa của nhà Minh suốt 1000 năm", score: 10 },
      { id: "q11c", text: "Liên bang với Nhật Bản thời Edo", score: 5 },
      { id: "q11d", text: "Thuộc địa Pháp thế kỷ XIX", score: 15 },
    ],
  },
  {
    id: "q12",
    category: "daily",
    emoji: "🌾",
    source: "doc1",
    question:
      "Đặc điểm kinh tế nổi bật của xã Ô Diên hiện nay theo định hướng phát triển là gì?",
    answers: [
      {
        id: "q12a",
        text: "Nông nghiệp chất lượng cao (rau màu, hoa) và làng nghề truyền thống (mộc, rèn, dệt)",
        score: 100,
      },
      { id: "q12b", text: "Khai thác dầu mỏ offshore", score: 5 },
      { id: "q12c", text: "Sản xuất chip bán dẫn toàn cầu", score: 10 },
      { id: "q12d", text: "Chỉ phát triển casino", score: 15 },
    ],
  },
  {
    id: "q13",
    category: "landmarks",
    emoji: "🗺️",
    source: "doc2",
    question: "Xã Ô Diên giáp với những địa phương nào?",
    answers: [
      {
        id: "q13a",
        text: "Phường Tây Tựu, Thượng Cát và các xã Liên Minh, Đan Phượng, Hoài Đức, Mê Linh, Yên Lãng",
        score: 100,
      },
      { id: "q13b", text: "TP. Hồ Chí Minh và Cần Thơ", score: 5 },
      { id: "q13c", text: "Đà Nẵng và Huế", score: 10 },
      { id: "q13d", text: "Lào Cai và Lạng Sơn", score: 15 },
    ],
  },
  {
    id: "q14",
    category: "festival",
    emoji: "🪁",
    source: "doc3",
    question:
      "Lễ hội và làng nghề truyền thống nào được nhắc đến trong định hướng phát triển du lịch Ô Diên?",
    answers: [
      {
        id: "q14a",
        text: "Nghề làm diều sáo và lễ hội thả diều làng Bá Dương Nội; Lễ hội chèo tàu Tổng gối",
        score: 100,
      },
      { id: "q14b", text: "Lễ hội bơi lội Bắc Cực", score: 5 },
      { id: "q14c", text: "Carnival Rio de Janeiro", score: 10 },
      { id: "q14d", text: "Lễ hội Halloween Mỹ", score: 15 },
    ],
  },
  {
    id: "q15",
    category: "history",
    emoji: "🏗️",
    source: "doc1",
    question:
      "Theo Quyết định 1569/QĐ-TTg (12/12/2024), khu vực Ô Diên được định hướng phát triển thành gì?",
    answers: [
      {
        id: "q15a",
        text: "Đô thị mới hiện đại, kết hợp du lịch sinh thái và không gian văn hóa – lịch sử",
        score: 100,
      },
      { id: "q15b", text: "Khu công nghiệp nặng 100% đất", score: 10 },
      { id: "q15c", text: "Sa mạc cát nhân tạo", score: 5 },
      { id: "q15d", text: "Khu phi thực dân độc lập", score: 15 },
    ],
  },
];

export const TOTAL_QUIZ_QUESTIONS = QUIZ_QUESTIONS.length;

export function getQuestionById(id: string): QuizQuestionData | undefined {
  return QUIZ_QUESTIONS.find((q) => q.id === id);
}

export function getAnswerScore(
  questionId: string,
  answerId: string
): number {
  const question = getQuestionById(questionId);
  const answer = question?.answers.find((a) => a.id === answerId);
  return answer?.score ?? 0;
}
