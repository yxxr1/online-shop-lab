"use client"

import React, {useEffect, useState} from "react";
import {createOrder} from "@/lib/controllers/order";
import {Input} from "@/shared/ui/Input";
import {Button} from "@/shared/ui/Button";
import {PersonalData} from "@/lib/model/types/user";
import {DataRow} from "@/shared/ui/DataRow";
import {numToFixed} from "@/lib/helpers/num";

interface Props {
  sum: number;
  getBonusValue: (bonusCard: string) => Promise<number | undefined>;
}

export const OrderForm: React.FC<Props> = ({ sum, getBonusValue }) => {
  const [isPay, setIsPay] = useState(true);
  const [bonusCard, setBonusCard] = useState("");
  const [bonusCardValue, setBonusCardValue] = useState<number | null>(null);
  const [bonusValue, setBonusValue] = useState(0);

  const getBonusCardValue = async () => {
    const bonusCardValue = await getBonusValue(bonusCard);

    if (bonusCardValue !== undefined) {
      setBonusCardValue(bonusCardValue);
    } else {
      alert("Карты не существует");
    }
  }
  const clearBonusCard = () => {
    setBonusCard("");
    setBonusCardValue(null);
    setBonusValue(0);
  }

  const submitForm: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const personalData: PersonalData = {
      name: formData.get("name")?.toString() || "",
      address: formData.get("address")?.toString() || "",
      email: formData.get("email")?.toString() || "",
    };
    const paymentCard = formData.get("paymentCard")?.toString();
    const bonusCard = formData.get("bonusCard")?.toString();
    const bonusValue = +(formData.get("bonusValue") || 0) || undefined;

    const result = await createOrder(personalData, paymentCard, bonusCard, bonusValue);

    if (result?.error) {
      alert(result.error);
    }
  }

  // сумма к оплате с учетом бонусов
  const summarySum = numToFixed(sum-bonusValue);
  // максимально можно потратить бонусов: все бонусы или вся стоимость заказа
  const maxBonusSum = Math.min(bonusCardValue || 0, sum);

  useEffect(() => {
    // если товар удаляется из корзины - контроллер вызывает ререндер страницы
    // при этом проп sum меняется и на клиенте нужно поправить значение в поле
    // потраченных бонусов
    setBonusValue(Math.min(bonusValue, sum));
  }, [sum]);
  useEffect(() => {
    // если сумма заказа с бонусами равна 0 - убрать чекбокс оплаты (заказ оплачен бонусами)
    if (summarySum === 0) {
      setIsPay(false);
    }
  }, [summarySum]);

  return (
    <>
      <DataRow label="Общая стоимость" value={summarySum} bold />

      <div className="border-b-1 border-gray-300 my-3" />

      <form onSubmit={submitForm}>
        <Input label="Имя" required name="name" />
        <Input label="Адрес" required name="address" />
        <Input label="Email" required type="email" name="email" />

        <div className="border-b-1 border-gray-300 my-3" />

        <div>
          <Input
            label="Бонусная карта"
            name="bonusCard"
            value={bonusCard}
            onChange={(e) => setBonusCard(e.target.value)}
            readOnly={bonusCardValue !== null}
          />
          {bonusCardValue === null ? (
            <Button onClick={getBonusCardValue} type="button" inline disabled={!bonusCard}>Получить баланс</Button>
          ) : (
            <>
              <Button onClick={clearBonusCard} type="button" inline>Очистить</Button>
              <DataRow label="Количество бонусов" value={bonusCardValue} />
            </>
          )}
        </div>
        <Input
          className="w-25"
          label="Списать бонусов"
          type="number"
          name="bonusValue"
          value={bonusValue}
          onChange={(e) => {
            const value = +e.target.value;

            if (value < 0) {
              return;
            }

            setBonusValue(Math.min(value, maxBonusSum));
          }}
          min={0}
          max={Math.ceil(maxBonusSum)}
          step="any"
          disabled={bonusCardValue === null}
        />

        <div className="border-b-1 border-gray-300 my-3" />

        <Input
          label="Оплатить заказ"
          type="checkbox"
          checked={isPay}
          onChange={(e) => setIsPay(e.target.checked)}
          disabled={!summarySum}
        />
        {isPay && <Input label="Платежная карта" required name="paymentCard" />}
        <Button className="mt-3 w-full">Создать заказ</Button>
      </form>
    </>
  );
}
