"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { formatFormErrors } from "~/utils/handler/error-handler";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";

export default function ProfilingForm({ fetcher }: { fetcher: any }) {
  const errors = fetcher.data?.errors;
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [age, setAge] = useState<number | null>(null);
  const city = "City of Zamboanga";

  const calculateAge = (birth: Date): number => {
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  const handleDateSelect = (selected: Date | undefined) => {
    setDate(selected);
    setOpen(false);
    setAge(selected ? calculateAge(selected) : null);
  };

  // Format Date to YYYY-MM-DD for the hidden input
  const birthdayValue = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";

  useEffect(() => {
    if (errors) {
      setFieldErrors(formatFormErrors(errors));
    }
  }, [errors]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <fetcher.Form
        method="put"
        className="p-7 rounded-lg lg:shadow-lg w-full lg:w-1/3"
      >
        <h2 className="text-2xl font-bold text-center">Welcome to SSP!</h2>
        <p className="text-center">Setup your account before we proceed.</p>

        <h3 className="mb-2 mt-5">Information</h3>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="col-span-2 md:col-span-1">
            <div className="flex">
              <Label htmlFor="first_name" className="mb-2">
                First Name<span className="text-red-500">*</span>
              </Label>
              {fieldErrors?.first_name && (
                <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                  {fieldErrors.first_name}
                </p>
              )}
            </div>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              className={fieldErrors?.first_name ? "border-red-500 bg-red-50" : ""}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="flex">
              <Label htmlFor="last_name" className="mb-2">
                Last Name<span className="text-red-500">*</span>
              </Label>
              {fieldErrors?.last_name && (
                <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                  {fieldErrors.last_name}
                </p>
              )}
            </div>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              className={fieldErrors?.last_name ? "border-red-500 bg-red-50" : ""}
            />
          </div>
        </div>

        {/* Middle Name */}
        <div className="mb-2">
          <Label htmlFor="middle_name" className="mb-2">
            Middle Name
          </Label>
          <Input id="middle_name" name="middle_name" type="text" />
        </div>

        {/* Birthday & Age */}
        <div className="mb-2 grid grid-cols-2 gap-2">
          <div className="col-span-2 md:col-span-1">
            <div className="flex">
              <Label className="mb-2">
                Birthday<span className="text-red-500">*</span>
              </Label>
              {fieldErrors?.birthday && (
                <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                  {fieldErrors.birthday}
                </p>
              )}
            </div>

            {/* Hidden input so birthday is submitted with the form */}
            <input type="hidden" name="birthday" value={birthdayValue} />

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start font-normal ${
                    fieldErrors?.birthday ? "border-red-500 bg-red-50" : ""
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {date ? date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : (
                    <span className="text-muted-foreground">Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  defaultMonth={date}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                  disabled={(d) => d > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="flex">
              <Label htmlFor="age" className="mb-2">
                Age
              </Label>
              {fieldErrors?.age && (
                <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                  {fieldErrors.age}
                </p>
              )}
            </div>
            <Input
              id="age"
              name="age"
              type="number"
              value={age ?? ""}
              disabled
              readOnly
            />
          </div>
        </div>

        <h3 className="mb-2 mt-5">Address</h3>

        {/* Street */}
        <div className="mb-2">
          <div className="flex">
            <Label htmlFor="street" className="mb-2">
              Street<span className="text-red-500">*</span>
            </Label>
            {fieldErrors?.street && (
              <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                {fieldErrors.street}
              </p>
            )}
          </div>
          <Input
            id="street"
            name="street"
            type="text"
            className={fieldErrors?.street ? "border-red-500 bg-red-50" : ""}
          />
        </div>

        {/* Barangay */}
        <div className="mb-2">
          <div className="flex">
            <Label htmlFor="barangay" className="mb-2">
              Barangay<span className="text-red-500">*</span>
            </Label>
            {fieldErrors?.barangay && (
              <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                {fieldErrors.barangay}
              </p>
            )}
          </div>
          <Input
            id="barangay"
            name="barangay"
            type="text"
            className={fieldErrors?.barangay ? "border-red-500 bg-red-50" : ""}
          />
        </div>

        {/* City */}
        <div className="mb-2">
          <Label htmlFor="city" className="mb-2">
            City
          </Label>
          <Input id="city" name="city" type="text" value={city} disabled />
        </div>

        {/* Submit */}
        <div className="w-full">
          <button
            type="submit"
            className="rounded text-center text-white bg-red-700 w-full mt-5 p-2 hover:bg-red-800 transition-colors disabled:opacity-50"
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? "Submitting..." : "Next"}
          </button>
        </div>

        {/* General error */}
        {fieldErrors?.general && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center flex items-center justify-center">
              {fieldErrors.general}
            </p>
          </div>
        )}
      </fetcher.Form>
    </div>
  );
}