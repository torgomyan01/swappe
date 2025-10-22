import { InputMask } from "@react-input/mask";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyPrice } from "@/redux/offer-page";

function InputPrice() {
  const dispatch = useDispatch();
  const offerData = useSelector(
    (state: IUserOfferStore) => state.userOffer.offer,
  );
  const [amount, setAmount] = useState("");

  const formatMoney = (value: string | number) => {
    const stringValue = String(value);
    const numericValue = stringValue.replace(/\D/g, "");

    if (numericValue) {
      const formattedValue = new Intl.NumberFormat("ru-RU").format(
        Number(numericValue),
      );
      return `${formattedValue} ₽`;
    }

    return "";
  };

  useEffect(() => {
    if (offerData.price) {
      setAmount(formatMoney(offerData.price));
    }
  }, [offerData.price]);

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
