export default function ProductGallery() {
  return (
    <div>
      <img
        src="https://picsum.photos/700/700?random=7"
        alt="Fabric"
        className="w-full rounded-3xl shadow-lg"
      />
      <div className="mt-5 flex gap-4">
        {[1, 2, 3, 4].map((item) => (
          <img
            key={item}
            src={`https://picsum.photos/120?random=${item}`}
            className="h-24 w-24 cursor-pointer rounded-xl border"
          />
        ))}
      </div>
    </div>
  );
}
