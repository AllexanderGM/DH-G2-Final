import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Button } from "@heroui/react";
import { Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { DatePicker } from "@heroui/react";
import { getLocalTimeZone } from "@internationalized/date";
import { useLocation } from 'react-router-dom';
import { useDateFormatter } from "@react-aria/i18n";

export default function ConfirmReserv() {
  const location = useLocation();
  const { tour } = location.state || {};

  // ➡️ State Variables
  const [selectedAdults, setSelectedAdults] = useState("");
  const [selectedChildren, setSelectedChildren] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState("");

  const numbers = Array.from({ length: 10 }, (_, i) => ({
    key: `${i + 1}`,
    label: `${i + 1}`,
    value: i + 1,
  }));

  const handleAdultsSelectionChange = (e) => {
    setSelectedAdults(e.target.value);
  };

  const handleChildrenSelectionChange = (e) => {
    setSelectedChildren(e.target.value);
  };

  const handleDateSelectionChange = (e) => {
    formatter.format(e.toDate(getLocalTimeZone()))
    setSelectedDate(formatter.format(e.toDate(getLocalTimeZone())));
  };

  let formatter = useDateFormatter({ dateStyle: "full" });

  // ➡️ Dynamic Price Calculation (guard for null)
  const adultPrice = tour?.adultPrice || 0;
  const childPrice = tour?.childPrice || 0;

  const adultsCount = selectedAdults || 0;
  const childrenCount = selectedChildren || 0;
  const totalPrice = adultsCount * adultPrice + childrenCount * childPrice;

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">

      <Card className="w-full max-w-5xl">
        <CardHeader>
          <h1>{tour.name}. {tour.destination.city.name}.</h1>
          
        </CardHeader>
        <CardBody>
          <h2>Confirmación de Detalles.</h2>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
           

            <div className="w-full lg:w-1/2 flex flex-col gap-4 text-sm">
              <Input
                size="sm"
                labelPlacement="outside"
                label="Nombre"
                id="first-name"
                placeholder="Ingrese su nombre"
                className="w-full text-sm"
              />

              <Input
                size="sm"
                labelPlacement="outside"
                label="Apellido"
                id="last-name"
                placeholder="Ingrese su apellido"
                className="w-full text-sm"
              />

              <Input
                size="sm"
                labelPlacement="outside"
                label="Correo Electronico"
                id="email"
                placeholder="Ingrese su Correo Electronico"
                className="w-full text-sm"
              />

              <Input
                size="sm"
                labelPlacement="outside"
                label="Pais"
                id="country"
                placeholder="Ingrese su Pais"
                className="w-full text-sm"
              />


              <div className="flex flex-col md:flex-row gap-4">

                <Select
                  className="w-full max-w-xs text-sm"
                  size="sm"
                  items={numbers}
                  label="Adultos"
                  labelPlacement="outside"
                  placeholder="Elegir cantidad adultos"
                  selectedKeys={selectedAdults ? [`${selectedAdults}`] : []}
                  onChange={handleAdultsSelectionChange}
                >
                  {(number) => (
                    <SelectItem key={number.key}>{number.label}</SelectItem>
                  )}
                </Select>


                <Select
                  className="w-full max-w-xs text-sm"
                  size="sm"
                  items={numbers}
                  label="Niños"
                  labelPlacement="outside"
                  placeholder="Elegir cantidad niños"
                  selectedKeys={selectedChildren ? [`${selectedChildren}`] : []}
                  onChange={handleChildrenSelectionChange}
                >
                  {(number) => (
                    <SelectItem key={number.key}>{number.label}</SelectItem>
                  )}
                </Select>
              </div>
            </div>


            <div className="w-full lg:w-1/2 flex justify-end">
              <img
                src={tour?.images?.[0] || "https://via.placeholder.com/500x400"}
                alt="Tour"
                className="rounded-xl w-full h-auto max-h-[500px] object-cover shadow-lg"
              />
            </div>
          </div>
        </CardBody>
      </Card>


      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl text-sm">

        <Card className="flex-1">
          <CardHeader>
            <p>Seleccionar Fecha y Hora de llegada</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <h1 className="text-base font-medium">Fecha de llegada</h1>
              <DatePicker
                className="max-w-[284px]"
                locale="es-ES"
                label="Fecha de llegada"
                onChange={
                  handleDateSelectionChange
                }
              />

              <h1 className="text-base font-medium">Hora de llegada</h1>
              <Input
                size="sm"
                label="Hora de llegada"
                type="time"
                onChange={(e) => setSelectedHour(e.target.value)}
              />
            </div>
          </CardBody>
        </Card>


        <Card className="flex-1 flex flex-col justify-between">
          <CardHeader>
            <p>Total & Confirmación</p>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">

            <div className="text-3xl font-semibold">
              ${totalPrice.toFixed(2)}
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Fecha de llegada:</strong> {selectedDate || "No seleccionado"}</p>
              <p><strong>Hora de llegada:</strong> {selectedHour || "No seleccionado"}</p>
              <p><strong>Adultos:</strong> {adultsCount}</p>
              <p><strong>Niños:</strong> {childrenCount}</p>
            </div>

            <Button className="w-full" size="lg">
              Confirmar Registro
            </Button>
          </CardBody>
        </Card>
      </div>


      <Card className="w-full max-w-5xl text-sm">
        <CardHeader>
          <p>Consideraciones</p>
        </CardHeader>
        <CardBody className="space-y-4">
          <p>🕒 Check-in desde 2:00 PM</p>
          <p>🕛 Check-out desde 12:00 PM</p>
          <p>🚭 No fumar</p>
          <p>🐾 Mascotas no estan permitidas</p>
          <p>❗La cancelación dentro de las 48 horas puede generar cargos.</p>
        </CardBody>
      </Card>
    </div>
  );
}
