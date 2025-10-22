import { useDispatch } from "react-redux";
import { setCompanyVid } from "@/redux/offer-page";

function SelectVid({ offer }: { offer: IUserOfferFront }) {
  const dispatch = useDispatch();

  function Select(e: any) {
    dispatch(setCompanyVid(e.target.dataset.vid));
  }

  return (
    <div className="radios">
      <div className="radio-wrap">
        <input
          type="radio"
          id="radio3"
          name="view"
          onChange={Select}
          data-vid="online"
          checked={offer.vid === "online"}
        />
        <label
          htmlFor="radio3"
          className="border transition border-transparent hover:border-green cursor-pointer"
        >
          <span></span>
          Онлайн
        </label>
      </div>
      <div className="radio-wrap">
        <input
          type="radio"
          id="radio4"
          name="view"
          onChange={Select}
          data-vid="offline"
          checked={offer.vid === "offline"}
        />
        <label
          htmlFor="radio4"
          className="border transition border-transparent hover:border-green cursor-pointer"
        >
          <span></span>
          Оффлайн
        </label>
      </div>
    </div>
  );
}

export default SelectVid;
