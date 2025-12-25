import {bonusModel, paymentModel} from "@/lib/model";

export const dynamic = 'force-dynamic'

export default function Admin() {
  return (
    <>
      <h1 className="font-bold">Платежные карты</h1>
      <ul>
        {paymentModel.getAllData().map((item) => (
          <li key={item.id} className="list-disc">{item.id}: {item.value}</li>
        ))}
      </ul>
      <br />
      <h1 className="font-bold">Бонусные карты</h1>
      <ul>
        {bonusModel.getAllData().map((item) => (
          <li key={item.id} className="list-disc">{item.id}: {item.value}</li>
        ))}
      </ul>
    </>
  );
}
