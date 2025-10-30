import { useDispatch } from "react-redux";
import { setCompanyActivity } from "@/redux/offer-page";

function SelectActivity({ offer }: { offer: IUserOfferFront }) {
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
          id="radio5"
          name="activity"
          onChange={Select}
          data-activity="barter"
          defaultChecked={offer.activity === "barter"}
        />
        <label
          htmlFor="radio5"
          className="border transition border-transparent hover:border-green cursor-pointer"
        >
          <span></span>
          Бартер
        </label>
      </div>
      <div className="radio-wrap">
        <input
          type="radio"
          id="radio6"
          name="activity"
          onChange={Select}
          data-activity="collaboration"
          defaultChecked={offer.activity === "collaboration"}
        />
        <label
          htmlFor="radio6"
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
