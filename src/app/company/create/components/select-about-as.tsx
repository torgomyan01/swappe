import { addToast, Button, Radio, RadioGroup } from "@heroui/react";
import { useState } from "react";

const values = [
  "Из социальных сетей",
  "Баннер в интернете",
  "E-mail рассылка",
  "От коллег/партнеров",
  "По реферальной программе",
  "Другое",
];

interface IThisProps {
  onSubmit: (data: string, index: number) => void;
}

function SelectAboutAs({ onSubmit }: IThisProps) {
  const [selectedKey, setSelectedKey] = useState<string>("");

  function NextStep() {
    if (selectedKey.length > 0) {
      onSubmit(selectedKey, 3);
    } else {
      addToast({
        title: "Ошибка",
        description: "Выбрать хотя бы одну вариант",
        color: "danger",
      });
    }
  }

  return (
    <form className="onbording-form" onSubmit={(e) => e.preventDefault()}>
      <h2>Расскажите, как нас нашли?</h2>
      <p>
        Выбери подходящий вариант из списка. <br />
        Если его нет, то выбери Другое
      </p>

      <div className="md:px-16 mt-4">
        <RadioGroup color="secondary" onValueChange={(e) => setSelectedKey(e)}>
          {values.map((item, index) => (
            <Radio
              key={`keys-${index}`}
              classNames={{
                label: "ml-2",
              }}
              value={item}
            >
              {item}
            </Radio>
          ))}
        </RadioGroup>
      </div>

      <Button className="green-btn !mt-8" onPress={NextStep}>
        Продолжить
      </Button>
    </form>
  );
}

export default SelectAboutAs;
