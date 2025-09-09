import clsx from "clsx";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { ActionGetAllCategory } from "@/app/actions/category/get-category";
import { useDispatch } from "react-redux";
import { setCompanyCategory } from "@/redux/offer-page";

function SelectCategories() {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    ActionGetAllCategory().then(({ data }) => {
      setCategories(data);
    });
  }, []);

  function SelectCategory(id: number) {
    const check = selectedCategories?.some((c) => c.id === id);

    if (check) {
      const findCat = selectedCategories?.filter((c) => c.id !== id);

      setSelectedCategories(findCat);
      dispatch(setCompanyCategory(findCat));
    } else {
      const findCat = categories?.find((c) => c.id === id);

      const newArr = [...selectedCategories, findCat];

      setSelectedCategories(newArr as ICategory[]);
      dispatch(setCompanyCategory(newArr as ICategory[]));
    }
  }

  return (
    <>
      {categories ? (
        <div className="tags">
          {categories.map((category: ICategory) => (
            <button
              key={`cat-${category.id}`}
              className={clsx("cursor-pointer", {
                "!bg-green !text-white": selectedCategories.some(
                  (c) => c.id === category.id,
                ),
                "hover:!bg-cream/50": !selectedCategories.some(
                  (c) => c.id === category.id,
                ),
              })}
              onClick={() => SelectCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="tags h-[134px] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      )}
    </>
  );
}

export default SelectCategories;
