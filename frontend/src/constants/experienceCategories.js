import {
  Camera,
  Flower2,
  Hammer,
  Leaf,
  Map,
  Mountain,
  PartyPopper,
  Shirt,
  Sparkles,
  Utensils,
  Wind
} from "lucide-react";

export const EXPERIENCE_CATEGORY_OPTIONS = [
  {
    id: 1,
    slug: "culture",
    label: "Văn hóa & Đời sống",
    shortLabel: "Văn hóa",
    icon: Leaf,
    className: "border-[#CFE3D7] bg-[#E8F3EE] text-[#1A3021]",
    activeClass: "border-[#1A3021] bg-[#D7E9DF] text-[#1A3021]",
    inactiveClass: "bg-[#E8F3EE] text-[#1A3021] border-[#CFE3D7]"
  },
  {
    id: 2,
    slug: "adventure",
    label: "Chinh phục & Khám phá",
    shortLabel: "Chinh phục",
    icon: Mountain,
    className: "border-[#D6E9FB] bg-[#EBF5FF] text-[#1D4E89]",
    activeClass: "border-[#1D4E89] bg-[#D6E9FB] text-[#1D4E89]",
    inactiveClass: "bg-[#EBF5FF] text-[#1D4E89] border-[#D6E9FB]"
  },
  {
    id: 3,
    slug: "healing",
    label: "Nghỉ dưỡng & Chữa lành",
    shortLabel: "Chữa lành",
    icon: Wind,
    className: "border-[#E5D5FA] bg-[#F3E8FF] text-[#6B3FA0]",
    activeClass: "border-[#6B3FA0] bg-[#E5D5FA] text-[#6B3FA0]",
    inactiveClass: "bg-[#F3E8FF] text-[#6B3FA0] border-[#E5D5FA]"
  },
  {
    id: 4,
    slug: "foodie",
    label: "Ẩm thực bản địa",
    shortLabel: "Ẩm thực",
    icon: Utensils,
    className: "border-[#F2DCCB] bg-[#FDF2E9] text-[#9C4F2B]",
    activeClass: "border-[#9C4F2B] bg-[#F2DCCB] text-[#9C4F2B]",
    inactiveClass: "bg-[#FDF2E9] text-[#9C4F2B] border-[#F2DCCB]"
  },
  {
    id: 5,
    slug: "craft",
    label: "Thủ Công & Truyền Thống",
    shortLabel: "Thủ công",
    icon: Hammer,
    className: "border-[#E7DCC8] bg-[#F6F0E7] text-[#7B5A2E]",
    activeClass: "border-[#7B5A2E] bg-[#EBDDCC] text-[#7B5A2E]",
    inactiveClass: "bg-[#F6F0E7] text-[#7B5A2E] border-[#E7DCC8]"
  },
  {
    id: 6,
    slug: "art-costume",
    label: "Nghệ thuật & Trang phục",
    shortLabel: "Nghệ thuật",
    icon: Shirt,
    className: "border-[#F1D8E4] bg-[#FFF1F6] text-[#A54874]",
    activeClass: "border-[#A54874] bg-[#F8DDE8] text-[#8D355F]",
    inactiveClass: "bg-[#FFF1F6] text-[#A54874] border-[#F1D8E4]"
  },
  {
    id: 7,
    slug: "local-experience",
    label: "Trải nghiệm địa phương",
    shortLabel: "Địa phương",
    icon: Map,
    className: "border-[#D7E6CC] bg-[#F2F8EC] text-[#4E6B2E]",
    activeClass: "border-[#4E6B2E] bg-[#E2EDD5] text-[#3E5722]",
    inactiveClass: "bg-[#F2F8EC] text-[#4E6B2E] border-[#D7E6CC]"
  },
  {
    id: 8,
    slug: "landscape-checkin",
    label: "Check-in cảnh quan",
    shortLabel: "Cảnh quan",
    icon: Camera,
    className: "border-[#CDE7EF] bg-[#EEF9FC] text-[#1F6E84]",
    activeClass: "border-[#1F6E84] bg-[#D9F0F6] text-[#16586A]",
    inactiveClass: "bg-[#EEF9FC] text-[#1F6E84] border-[#CDE7EF]"
  },
  {
    id: 9,
    slug: "festival-culture",
    label: "Văn hoá – Lễ hội",
    shortLabel: "Lễ hội",
    icon: PartyPopper,
    className: "border-[#F4DEB9] bg-[#FFF7E8] text-[#9B6A11]",
    activeClass: "border-[#9B6A11] bg-[#F8E9C7] text-[#7F550A]",
    inactiveClass: "bg-[#FFF7E8] text-[#9B6A11] border-[#F4DEB9]"
  },
  {
    id: 10,
    slug: "customs",
    label: "Phong tục – Tập quán",
    shortLabel: "Phong tục",
    icon: Flower2,
    className: "border-[#D9D2F3] bg-[#F5F1FF] text-[#5C479A]",
    activeClass: "border-[#5C479A] bg-[#E7DFFC] text-[#49357F]",
    inactiveClass: "bg-[#F5F1FF] text-[#5C479A] border-[#D9D2F3]"
  }
];

export const EXPERIENCE_CATEGORY_STYLES = Object.fromEntries(
  EXPERIENCE_CATEGORY_OPTIONS.map((category) => [
    category.slug,
    {
      icon: category.icon ?? Sparkles,
      className: category.className
    }
  ])
);
