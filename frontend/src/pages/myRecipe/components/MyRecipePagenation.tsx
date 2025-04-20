import ArrowLeft from "@assets/icons/ArrowLeft";
import ArrowRight from "@assets/icons/ArrowRight";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  const pagenations = generatePageNumbers();

  function generatePageNumbers() {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (currentPage >= totalPages - 2) {
      pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2);
    }

    return pages;
  }

  return (
    <div className="flex justify-center items-center w-full h-[10%] gap-2 font-preRegular">
      {/* 이전 페이지 */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeft width={16} height={16} strokeColor="black" />
      </button>

      {/* 페이지 번호 */}
      {pagenations &&
        pagenations.map((num) => (
          <button
            key={num}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              num === currentPage ? "bg-blue-500 text-white font-preSemiBold" : "bg-gray-200"
            }`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}

      {/* 다음 페이지 */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ArrowRight width={16} height={16} strokeColor="black" />
      </button>
    </div>
  );
};

export default Pagination;
