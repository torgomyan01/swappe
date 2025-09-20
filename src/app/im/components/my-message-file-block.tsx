function MyMessageFileBlock() {
  return (
    <div className="w-full p-2 bg-black/20 rounded-[8px] mb-2 flex-js-c gap-2">
      <div className="min-w-10 h-10 flex-jc-c bg-black/20 rounded-[8px] cursor-pointer">
        <i className="fa-regular fa-arrow-down-to-line"></i>
      </div>
      <b className="mr-4">File Name</b>
    </div>
  );
}

export default MyMessageFileBlock;
