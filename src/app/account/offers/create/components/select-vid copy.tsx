import { useDispatch } from "react-redux";
import { setCompanyActivity } from "@/redux/offer-page";

function SelectActivity() {
  const dispatch = useDispatch();

  function Select(e: any) {
    dispatch(
      setCompanyActivity(
        e.target.dataset.activity as "barter" | "collaboration",
      ),
    );
  }

  return (
    <div className="radios">
      <div className="radio-wrap">
        <input
          type="radio"
          id="radio7"
          name="activity"
          onChange={Select}
          data-activity="barter"
        />
        <label
          htmlFor="radio7"
          className="border transition border-transparent hover:border-green cursor-pointer"
        >
          <span></span>
          Бартер
        </label>
      </div>
      <div className="radio-wrap">
        <input
          type="radio"
          id="radio8"
          name="activity"
          onChange={Select}
          data-activity="collaboration"
        />
        <label
          htmlFor="radio8"
          className="border transition border-transparent hover:border-green cursor-pointer"
        >
          <span></span>
          Коллаборация
        </label>
      </div>
    </div>
  );
}

export default SelectActivity;
