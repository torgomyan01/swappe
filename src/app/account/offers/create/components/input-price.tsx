import { InputMask } from "@react-input/mask";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCompanyPrice } from "@/redux/offer-page";

function InputPrice() {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");

  const formatMoney = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue) {
      const formattedValue = new Intl.NumberFormat("ru-RU").format(
        Number(numericValue),
      );
      return `${formattedValue} ₽`;
    }

    return "";
  };

  return (
    <InputMask
      mask="_____________"
      replacement={{ _: /\d/ }}
      value={amount}
      onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
      onBlur={(e) => {
        if (e.target.value) {
          setAmount(formatMoney(e.target.value));
          dispatch(setCompanyPrice(e.target.value));
        }
      }}
      onFocus={() => {
        setAmount(amount.replace(/\D/g, ""));
      }}
      placeholder="Стоимость, ₽"
      className="price-input"
    />
  );
}

export default InputPrice;
