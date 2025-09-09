import { setCompanyType } from "@/redux/offer-page";
import { useDispatch } from "react-redux";

function SelectType() {
  const dispatch = useDispatch();

  function Select(e: any) {
    dispatch(setCompanyType(e.target.dataset.type));
  }

  return (
    <div className="radios">
      <div className="radio-wrap">
        <input
          type="radio"
          id="radio1"
          name="type"
          onChange={Select}
          data-type="product"
        />
        <label
          htmlFor="radio1"
          className="border transition border-transparent hover:border-green cursor-pointer"
        >
          <span></span>
          Товар
        </label>
      </div>
      <div className="radio-wrap">
        <input
          type="radio"
          id="radio2"
          name="type"
          onChange={Select}
          data-type="service"
        />
        <label
          htmlFor="radio2"
          className="border transition border-transparent hover:border-green cursor-pointer"
        >
          <span></span>
          Услуга
        </label>
      </div>
    </div>
  );
}

export default SelectType;
