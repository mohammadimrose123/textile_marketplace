export default function ProductSpecs() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow">
      <h2 className="mb-6 text-3xl font-bold">Specifications</h2>
      <table className="w-full">
        <tbody>
          <tr className="border-b">
            <td className="py-4 font-semibold">Material</td>
            <td>Cotton</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 font-semibold">Width</td>
            <td>58 Inches</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 font-semibold">GSM</td>
            <td>180 GSM</td>
          </tr>
          <tr className="border-b">
            <td className="py-4 font-semibold">Origin</td>
            <td>India</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
