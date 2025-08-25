import { useEffect, useState } from "react";
import { ActionGetAllCategory } from "@/app/actions/category/get-category";
import { addToast, Button, Spinner } from "@heroui/react";
import clsx from "clsx";

interface IThisProps {
  onSubmit: (data: object, index: number) => void;
}

function SelectCategory({ onSubmit }: IThisProps) {
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
    } else {
      const findCat = categories?.find((c) => c.id === id);

      const newArr = [...selectedCategories, findCat];

      setSelectedCategories(newArr as ICategory[]);
    }
  }

  function StartNextStep() {
    if (selectedCategories.length > 0) {
      onSubmit(selectedCategories, 2);
    } else {
      addToast({
        title: "Ошибка",
        description: "Добавьте хотя бы одну категория",
        color: "danger",
      });
    }
  }

  return (
    <form className="onbording-form" onSubmit={(e) => e.preventDefault()}>
      <h2>Интересующие категории</h2>
      <p>
        Выбери категории, интересные твоей компании для дальнейшего бартера. Мы
        постараемся показывать наиболее актуальные предложения
      </p>

      {categories ? (
        <>
          <div className="tags-wrap">
            <b>Изменить категории можно в профиле</b>
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
          </div>
          <Button className="green-btn cursor-pointer" onPress={StartNextStep}>
            Продолжить
          </Button>
        </>
      ) : (
        <div className="w-full h-[150px] flex-jc-c">
          <Spinner color="secondary" />
        </div>
      )}
    </form>
  );
}

export default SelectCategory;
