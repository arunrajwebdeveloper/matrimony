import { createProductQueryUrl } from "@/utils/createProductQueryUrl";
import { searchParamsToObject } from "@/utils/searchParamsToObject";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  page: number;
  lastPage: number;
  path?: string;
};

const Pagination = ({ page, lastPage, path = "/" }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(page);

  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", lastPage);
      } else if (currentPage >= lastPage - 2) {
        pages.push(1, "...", lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          lastPage
        );
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const goToPage = (pageNum: number) => {
    router.push(
      createProductQueryUrl(path, {
        ...searchParamsToObject(searchParams),
        page: pageNum,
      })
    );
  };

  return (
    <div className="pagination-element">
      {currentPage > 1 && (
        <>
          <a onClick={() => goToPage(1)}>First</a>
          <a onClick={() => goToPage(currentPage - 1)}>Previous</a>
        </>
      )}

      {pageNumbers.map((num, index) =>
        num === "..." ? (
          <span key={`ellipsis-${index}`} className="ellipsis">
            ...
          </span>
        ) : (
          <a
            key={num}
            className={`link-boxed ${num === currentPage ? "active" : ""}`}
            onClick={() => goToPage(Number(num))}
          >
            {num}
          </a>
        )
      )}

      {currentPage < lastPage && (
        <>
          <a onClick={() => goToPage(currentPage + 1)}>Next</a>
          <a onClick={() => goToPage(lastPage)}>Last</a>
        </>
      )}
    </div>
  );
};

export default Pagination;
